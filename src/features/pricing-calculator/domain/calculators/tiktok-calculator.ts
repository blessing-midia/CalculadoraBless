import { getTikTokFees, getTikTokCommissionPercent, getTikTokFixedFee } from '../fees/tiktok-fees';
import { isVariableShareInvalid } from '../validators';
import type { TikTokInput, CalculatorResult, BreakdownRow } from '../types';

const emptyBreakdown = (): BreakdownRow[] => [
  { label: 'Produto', value: 0 },
  { label: 'TikTok (taxa+frete)', value: 0 },
  { label: 'Marketing', value: 0 },
  { label: 'Impostos', value: 0 },
  { label: 'Outros', value: 0 },
  { label: 'Lucro Líquido', value: 0 },
];

export const calculateTikTokPrice = (input: TikTokInput): CalculatorResult => {
  const {
    productCost,
    packagingCost,
    shippingCost,
    affiliatesPercent,
    adsPercent,
    promoPercent,
    taxPercent,
    otherPercent,
    calculationMode = 'margin',
    targetMargin = 0,
    targetSalePrice = 0,
  } = input;

  const baseCosts = productCost + packagingCost + shippingCost;
  const marketingPercent = adsPercent + promoPercent;

  // Reusa a mesma tabela de `fees/tiktok-fees.ts` em vez de duplicar os
  // limiares/percentuais aqui — a duplicação anterior já causou o valor
  // ficar desatualizado numa ponta quando só a outra foi corrigida.
  const estimateCommission = getTikTokCommissionPercent;
  const estimateFixedFee = getTikTokFixedFee;

  if (baseCosts < 0 || targetMargin < 0) {
    return { salePrice: 0, profit: 0, breakdown: emptyBreakdown() };
  }

  if (calculationMode === 'salePrice') {
    const salePrice = targetSalePrice;

    if (!Number.isFinite(salePrice) || salePrice <= 0) {
      return { salePrice: 0, profit: 0, breakdown: emptyBreakdown() };
    }

    const fees = getTikTokFees(salePrice);
    const serviceFee = fees.commission;
    const actualFixedFee = fees.fixedFee;
    const affiliatesValue = salePrice * affiliatesPercent;
    const marketingValue = salePrice * marketingPercent;
    const taxValue = salePrice * taxPercent;
    const otherValue = salePrice * otherPercent;

    const profitValue =
      salePrice -
      (productCost + packagingCost + shippingCost + serviceFee + actualFixedFee + affiliatesValue + marketingValue + taxValue + otherValue);

    return {
      salePrice,
      profit: profitValue,
      breakdown: [
        { label: 'Produto', value: productCost + packagingCost },
        { label: 'TikTok (taxa+frete)', value: serviceFee + actualFixedFee + affiliatesValue + shippingCost },
        { label: 'Marketing', value: marketingValue },
        { label: 'Impostos', value: taxValue },
        { label: 'Outros', value: otherValue },
        { label: 'Lucro Líquido', value: profitValue },
      ],
    };
  }

  let commissionPercent = estimateCommission(baseCosts);
  let fixedFee = estimateFixedFee(baseCosts);

  const variableShare =
    commissionPercent + affiliatesPercent + marketingPercent + taxPercent + otherPercent + targetMargin;

  if (isVariableShareInvalid(variableShare)) {
    return { salePrice: 0, profit: 0, breakdown: emptyBreakdown() };
  }

  let salePrice = (baseCosts + fixedFee) / (1 - variableShare);

  const newCommissionPercent = estimateCommission(salePrice);
  const newFixedFee = estimateFixedFee(salePrice);
  if (newCommissionPercent !== commissionPercent || newFixedFee !== fixedFee) {
    commissionPercent = newCommissionPercent;
    fixedFee = newFixedFee;
    const newVariableShare =
      commissionPercent + affiliatesPercent + marketingPercent + taxPercent + otherPercent + targetMargin;
    if (isVariableShareInvalid(newVariableShare)) {
      return { salePrice: 0, profit: 0, breakdown: emptyBreakdown() };
    }
    salePrice = (baseCosts + fixedFee) / (1 - newVariableShare);
  }

  const fees = getTikTokFees(salePrice);
  const serviceFee = fees.commission;
  const actualFixedFee = fees.fixedFee;
  const affiliatesValue = salePrice * affiliatesPercent;
  const marketingValue = salePrice * marketingPercent;
  const taxValue = salePrice * taxPercent;
  const otherValue = salePrice * otherPercent;

  const profitValue =
    salePrice -
    (productCost + packagingCost + shippingCost + serviceFee + actualFixedFee + affiliatesValue + marketingValue + taxValue + otherValue);

  return {
    salePrice,
    profit: profitValue,
    breakdown: [
      { label: 'Produto', value: productCost + packagingCost },
      { label: 'TikTok (taxa+frete)', value: serviceFee + actualFixedFee + affiliatesValue + shippingCost },
      { label: 'Marketing', value: marketingValue },
      { label: 'Impostos', value: taxValue },
      { label: 'Outros', value: otherValue },
      { label: 'Lucro Líquido', value: profitValue },
    ],
  };
};
