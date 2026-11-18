import { getShopeeFeeBreakdown } from '../fees/shopee-fees';
import { isVariableShareInvalid } from '../validators';
import type { ShopeeInput, CalculatorResult, BreakdownRow } from '../types';

const emptyBreakdown = (): BreakdownRow[] => [
  { label: 'Produto', value: 0 },
  { label: 'Shopee (taxas)', value: 0 },
  { label: 'Marketing', value: 0 },
  { label: 'Impostos', value: 0 },
  { label: 'Outros', value: 0 },
  { label: 'Lucro Líquido', value: 0 },
];

export const calculateShopeePrice = (input: ShopeeInput): CalculatorResult => {
  const {
    sellerType,
    productCost,
    packagingCost,
    adsPercent,
    promoPercent,
    taxPercent,
    otherCost,
    calculationMode = 'margin',
    targetMargin = 0,
    targetSalePrice = 0,
  } = input;

  const marketingPercent = adsPercent + promoPercent;
  const extraVariablePercent = marketingPercent + taxPercent;
  const fixedBaseCosts = productCost + packagingCost + otherCost;

  if (fixedBaseCosts < 0 || targetMargin < 0) {
    return { salePrice: 0, profit: 0, breakdown: emptyBreakdown() };
  }

  if (calculationMode === 'salePrice') {
    const salePrice = targetSalePrice;

    if (!Number.isFinite(salePrice) || salePrice <= 0) {
      return { salePrice: 0, profit: 0, breakdown: emptyBreakdown() };
    }

    const finalFees = getShopeeFeeBreakdown({ salePrice, sellerType });
    const marketingValue = salePrice * marketingPercent;
    const taxValue = salePrice * taxPercent;
    const otherValue = otherCost;

    const totalCosts =
      productCost + packagingCost + finalFees.totalMarketplaceFee + marketingValue + taxValue + otherValue;

    const netProfit = salePrice - totalCosts;

    return {
      salePrice,
      profit: netProfit,
      breakdown: [
        { label: 'Produto', value: productCost + packagingCost },
        { label: 'Shopee (taxas)', value: finalFees.totalMarketplaceFee },
        { label: 'Marketing', value: marketingValue },
        { label: 'Impostos', value: taxValue },
        { label: 'Outros', value: otherValue },
        { label: 'Lucro Líquido', value: netProfit },
      ],
    };
  }

  let salePrice = fixedBaseCosts || 1;

  for (let attempt = 0; attempt < 40; attempt += 1) {
    const feeBreakdown = getShopeeFeeBreakdown({ salePrice, sellerType });
    const variableShare = feeBreakdown.commissionPercent + extraVariablePercent + targetMargin;

    if (isVariableShareInvalid(variableShare)) {
      return { salePrice: 0, profit: 0, breakdown: emptyBreakdown() };
    }

    const nextSalePrice = (fixedBaseCosts + feeBreakdown.fixedFee) / (1 - variableShare);

    if (!Number.isFinite(nextSalePrice) || nextSalePrice <= 0) {
      return { salePrice: 0, profit: 0, breakdown: emptyBreakdown() };
    }

    if (Math.abs(nextSalePrice - salePrice) < 0.01) {
      salePrice = nextSalePrice;
      break;
    }

    salePrice = nextSalePrice;
  }

  const finalFees = getShopeeFeeBreakdown({ salePrice, sellerType });

  const marketingValue = salePrice * marketingPercent;
  const taxValue = salePrice * taxPercent;
  const otherValue = otherCost;

  const totalCosts =
    productCost + packagingCost + finalFees.totalMarketplaceFee + marketingValue + taxValue + otherValue;

  const netProfit = salePrice - totalCosts;

  return {
    salePrice,
    profit: netProfit,
    breakdown: [
      { label: 'Produto', value: productCost + packagingCost },
      { label: 'Shopee (taxas)', value: finalFees.totalMarketplaceFee },
      { label: 'Marketing', value: marketingValue },
      { label: 'Impostos', value: taxValue },
      { label: 'Outros', value: otherValue },
      { label: 'Lucro Líquido', value: netProfit },
    ],
  };
};
