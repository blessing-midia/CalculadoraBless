import {
  ML_PUBLIC_RATE_LIMITS,
  getMercadoLivreCommissionRate,
} from '../config/ml-categories';
import type { MercadoLivreFeeBreakdown } from '../types';

export const ML_LISTING_TYPES = {
  CLASSIC: 'classic' as const,
  PREMIUM: 'premium' as const,
};

export const ML_FIXED_FEE_TIERS = [
  { maxPriceExclusive: 12.5, type: 'percent_of_sale_price' as const, value: 0.5, label: '50% do valor do produto' },
  { maxPriceExclusive: 29, type: 'fixed' as const, value: 6.25, label: 'Custo fixo até R$ 29' },
  { maxPriceExclusive: 50, type: 'fixed' as const, value: 6.5, label: 'Custo fixo até R$ 50' },
  { maxPriceExclusive: 79, type: 'fixed' as const, value: 6.75, label: 'Custo fixo até R$ 79' },
];

export const clampMercadoLivrePublicRate = (rate: number, listingType: string): number => {
  const limits =
    listingType === ML_LISTING_TYPES.PREMIUM
      ? ML_PUBLIC_RATE_LIMITS.premium
      : ML_PUBLIC_RATE_LIMITS.classic;

  if (!Number.isFinite(rate)) return limits.max;
  return Math.min(Math.max(rate, limits.min), limits.max);
};

export const getMercadoLivreFixedFee = (salePrice: number): number => {
  if (!Number.isFinite(salePrice) || salePrice <= 0) return 0;

  for (const tier of ML_FIXED_FEE_TIERS) {
    if (salePrice < tier.maxPriceExclusive) {
      if (tier.type === 'percent_of_sale_price') return salePrice * tier.value;
      return tier.value;
    }
  }
  return 0;
};

export const getMercadoLivreCommissionPercent = ({
  categoryKey,
  listingType,
  customRate = null,
  clampToPublicLimits = true,
}: {
  categoryKey: string;
  listingType: 'classic' | 'premium';
  customRate?: number | null;
  clampToPublicLimits?: boolean;
}): number => {
  const rawRate = getMercadoLivreCommissionRate({ categoryKey, listingType, customRate });
  if (!clampToPublicLimits) return rawRate;
  return clampMercadoLivrePublicRate(rawRate, listingType);
};

export const getMercadoLivreInstallmentExtra = ({
  salePrice,
  installmentExtraPercent = 0,
  installmentExtraFixed = 0,
}: {
  salePrice: number;
  installmentExtraPercent?: number;
  installmentExtraFixed?: number;
}): number => {
  if (!Number.isFinite(salePrice) || salePrice <= 0) return 0;
  return salePrice * installmentExtraPercent + installmentExtraFixed;
};

export const getMercadoLivreFeeBreakdown = ({
  salePrice,
  categoryKey,
  listingType,
  customCommissionRate = null,
  installmentExtraPercent = 0,
  installmentExtraFixed = 0,
}: {
  salePrice: number;
  categoryKey: string;
  listingType: 'classic' | 'premium';
  customCommissionRate?: number | null;
  installmentExtraPercent?: number;
  installmentExtraFixed?: number;
}): MercadoLivreFeeBreakdown => {
  const commissionPercent = getMercadoLivreCommissionPercent({
    categoryKey,
    listingType,
    customRate: customCommissionRate,
  });

  const commissionValue = salePrice * commissionPercent;
  const fixedFee = getMercadoLivreFixedFee(salePrice);
  const installmentExtra = getMercadoLivreInstallmentExtra({
    salePrice,
    installmentExtraPercent,
    installmentExtraFixed,
  });

  return {
    commissionPercent,
    commissionValue,
    fixedFee,
    installmentExtra,
    totalMarketplaceFee: commissionValue + fixedFee + installmentExtra,
  };
};
