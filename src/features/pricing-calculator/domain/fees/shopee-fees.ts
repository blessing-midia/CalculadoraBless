import type { SellerType, ShopeeFeeTier, ShopeeFeeBreakdown } from '../types';

export const SHOPEE_BASE_COMMISSION_RATE = 0.14;

export const SHOPEE_FIXED_FEES: Record<string, number> = {
  cpf: 4.5,
  cpf_high_volume: 7.5,
};

export const SHOPEE_CNPJ_TIERS: ShopeeFeeTier[] = [
  { maxPriceExclusive: 80, commissionPercent: 0.2, fixedFee: 4.5 },
  { maxPriceExclusive: 100, commissionPercent: 0.14, fixedFee: 16 },
  { maxPriceExclusive: 200, commissionPercent: 0.14, fixedFee: 20 },
  { maxPriceExclusive: 500, commissionPercent: 0.14, fixedFee: 26 },
  { maxPriceExclusive: Number.POSITIVE_INFINITY, commissionPercent: 0.14, fixedFee: 26 },
];

export const SHOPEE_CPF_TIERS: ShopeeFeeTier[] = [
  { maxPriceExclusive: 80, commissionPercent: 0.2, fixedFee: 4.5 },
  { maxPriceExclusive: 100, commissionPercent: 0.14, fixedFee: 16 },
  { maxPriceExclusive: 200, commissionPercent: 0.14, fixedFee: 20 },
  { maxPriceExclusive: 500, commissionPercent: 0.14, fixedFee: 26 },
  { maxPriceExclusive: Number.POSITIVE_INFINITY, commissionPercent: 0.14, fixedFee: 26 },
];

export const SHOPEE_CPF_HIGH_VOLUME_TIERS: ShopeeFeeTier[] = [
  { maxPriceExclusive: 80, commissionPercent: 0.2, fixedFee: 7.5 },
  { maxPriceExclusive: 100, commissionPercent: 0.14, fixedFee: 19 },
  { maxPriceExclusive: 200, commissionPercent: 0.14, fixedFee: 23 },
  { maxPriceExclusive: 500, commissionPercent: 0.14, fixedFee: 29 },
  { maxPriceExclusive: Number.POSITIVE_INFINITY, commissionPercent: 0.14, fixedFee: 29 },
];

const getTier = (tiers: ShopeeFeeTier[], salePrice: number): ShopeeFeeTier => {
  for (const tier of tiers) {
    if (salePrice < tier.maxPriceExclusive) return tier;
  }
  return tiers[tiers.length - 1];
};

export const getShopeeFeeBreakdown = ({
  salePrice,
  sellerType,
}: {
  salePrice: number;
  sellerType: SellerType;
}): ShopeeFeeBreakdown => {
  if (!Number.isFinite(salePrice) || salePrice <= 0) {
    return { commissionPercent: 0, commissionValue: 0, fixedFee: 0, totalMarketplaceFee: 0 };
  }

  let tiers: ShopeeFeeTier[];

  if (sellerType === 'cnpj') tiers = SHOPEE_CNPJ_TIERS;
  else if (sellerType === 'cpf') tiers = SHOPEE_CPF_TIERS;
  else if (sellerType === 'cpf_high_volume') tiers = SHOPEE_CPF_HIGH_VOLUME_TIERS;
  else {
    const commissionPercent = SHOPEE_BASE_COMMISSION_RATE;
    const fixedFee = SHOPEE_FIXED_FEES[sellerType] ?? SHOPEE_FIXED_FEES.cpf;
    const commissionValue = salePrice * commissionPercent;
    return { commissionPercent, commissionValue, fixedFee, totalMarketplaceFee: commissionValue + fixedFee };
  }

  const tier = getTier(tiers, salePrice);
  const commissionValue = salePrice * tier.commissionPercent;
  return {
    commissionPercent: tier.commissionPercent,
    commissionValue,
    fixedFee: tier.fixedFee,
    totalMarketplaceFee: commissionValue + tier.fixedFee,
  };
};
