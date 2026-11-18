import {
  getAmazonCommission,
  getAmazonCommissionRate,
  getAmazonItemFee,
} from '../fees/amazon-fees';
import { isVariableShareInvalid } from '../validators';
import type { AmazonInput, CalculatorResult, BreakdownRow } from '../types';

const emptyBreakdown = (): BreakdownRow[] => [
  { label: 'Produto', value: 0 },
  { label: 'Amazon (comis+frete)', value: 0 },
  { label: 'Marketing', value: 0 },
  { label: 'Impostos', value: 0 },
  { label: 'Outros', value: 0 },
  { label: 'Lucro Líquido', value: 0 },
];

export const calculateAmazonPrice = (input: AmazonInput): CalculatorResult => {
  const {
    productCost,
    packagingCost,
    shippingCost,
    plan,
    category,
    adsPercent,
    promoPercent,
    taxPercent,
    otherCost,
    calculationMode = 'margin',
    targetMargin = 0,
    targetSalePrice = 0,
  } = input;

  const itemFee = getAmazonItemFee(plan);
  const commissionPercent = getAmazonCommissionRate(category);
  const marketingPercent = adsPercent + promoPercent;

  if (productCost + packagingCost + shippingCost + otherCost < 0 || targetMargin < 0) {
    return { salePrice: 0, profit: 0, breakdown: emptyBreakdown() };
  }

  if (calculationMode === 'salePrice') {
    const salePrice = targetSalePrice;

    if (!Number.isFinite(salePrice) || salePrice <= 0) {
      return { salePrice: 0, profit: 0, breakdown: emptyBreakdown() };
    }

    const commissionValue = getAmazonCommission({ totalSaleAmount: salePrice, category });
    const marketingValue = salePrice * marketingPercent;
    const taxValue = salePrice * taxPercent;
    const otherValue = otherCost;

    const profitValue =
      salePrice -
      (productCost + packagingCost + shippingCost + itemFee + commissionValue + marketingValue + taxValue + otherValue);

    return {
      salePrice,
      profit: profitValue,
      breakdown: [
        { label: 'Produto', value: productCost + packagingCost },
        { label: 'Amazon (comis+frete)', value: commissionValue + itemFee + shippingCost },
        { label: 'Marketing', value: marketingValue },
        { label: 'Impostos', value: taxValue },
        { label: 'Outros', value: otherValue },
        { label: 'Lucro Líquido', value: profitValue },
      ],
    };
  }

  const variableShare = commissionPercent + marketingPercent + taxPercent + targetMargin;

  if (isVariableShareInvalid(variableShare)) {
    return { salePrice: 0, profit: 0, breakdown: emptyBreakdown() };
  }

  let salePrice = 0;
  let extraMinCommission = 0;

  for (let attempt = 0; attempt < 30; attempt += 1) {
    const baseCosts = productCost + packagingCost + shippingCost + otherCost + itemFee + extraMinCommission;

    salePrice = baseCosts / (1 - variableShare);

    const commissionValue = getAmazonCommission({ totalSaleAmount: salePrice, category });
    const percentageCommission = salePrice * commissionPercent;
    extraMinCommission = Math.max(0, commissionValue - percentageCommission);
  }

  const commissionValue = getAmazonCommission({ totalSaleAmount: salePrice, category });
  const marketingValue = salePrice * marketingPercent;
  const taxValue = salePrice * taxPercent;
  const otherValue = otherCost;

  const profitValue =
    salePrice -
    (productCost + packagingCost + shippingCost + itemFee + commissionValue + marketingValue + taxValue + otherValue);

  return {
    salePrice,
    profit: profitValue,
    breakdown: [
      { label: 'Produto', value: productCost + packagingCost },
      { label: 'Amazon (comis+frete)', value: commissionValue + itemFee + shippingCost },
      { label: 'Marketing', value: marketingValue },
      { label: 'Impostos', value: taxValue },
      { label: 'Outros', value: otherValue },
      { label: 'Lucro Líquido', value: profitValue },
    ],
  };
};
