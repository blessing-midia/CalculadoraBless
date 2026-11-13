const SERVICE_FEE_CAP = 50;
const LOW_PRICE_THRESHOLD = 50;
export const LOW_PRICE_COMMISSION = 0.16;
export const HIGH_PRICE_COMMISSION = 0.12;
const LOW_PRICE_FIXED_FEE = 4;
const HIGH_PRICE_FIXED_FEE = 6;

export const getTikTokCommissionPercent = (salePrice: number): number => {
  return salePrice < LOW_PRICE_THRESHOLD ? LOW_PRICE_COMMISSION : HIGH_PRICE_COMMISSION;
};

export const getTikTokFixedFee = (salePrice: number): number => {
  return salePrice < LOW_PRICE_THRESHOLD ? LOW_PRICE_FIXED_FEE : HIGH_PRICE_FIXED_FEE;
};

export const getTikTokServiceFee = (salePrice: number): number => {
  const commission = salePrice * getTikTokCommissionPercent(salePrice);
  return Math.min(commission, SERVICE_FEE_CAP);
};

export const getTikTokFees = (salePrice: number): { commission: number; fixedFee: number; total: number } => {
  const commissionPercent = getTikTokCommissionPercent(salePrice);
  const commission = Math.min(salePrice * commissionPercent, SERVICE_FEE_CAP);
  const fixedFee = getTikTokFixedFee(salePrice);
  return { commission, fixedFee, total: commission + fixedFee };
};
