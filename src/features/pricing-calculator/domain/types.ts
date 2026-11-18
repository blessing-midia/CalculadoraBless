export type MarketplaceKey = 'shopee' | 'mercadoLivre' | 'tiktok' | 'amazon';

export type CalculationMode = 'margin' | 'salePrice';

export type SellerType = 'cnpj' | 'cpf' | 'cpf_high_volume';

export type ListingType = 'classic' | 'premium';

export type AmazonPlan = 'ind' | 'prof';

export interface BreakdownRow {
  label: string;
  value: number;
}

export interface CalculatorResult {
  salePrice: number;
  profit: number;
  breakdown: BreakdownRow[];
  meta?: {
    viable?: boolean;
    reason?: string;
    commissionPercent?: number;
    fixedFee?: number;
    [key: string]: unknown;
  };
}

export interface BaseCalculatorInput {
  productCost: number;
  packagingCost: number;
  adsPercent: number;
  promoPercent: number;
  taxPercent: number;
  otherCost: number;
  calculationMode?: CalculationMode;
  targetMargin?: number;
  targetSalePrice?: number;
}

export interface ShopeeInput extends BaseCalculatorInput {
  sellerType: SellerType;
}

export interface MercadoLivreInput extends BaseCalculatorInput {
  shippingCost: number;
  categoryKey: string;
  listingType: ListingType;
  customCommissionRate?: number | null;
  installmentExtraPercent?: number;
  installmentExtraFixed?: number;
}

export interface TikTokInput extends BaseCalculatorInput {
  shippingCost: number;
  isNewSeller?: boolean;
  affiliatesPercent: number;
}

export interface AmazonInput extends BaseCalculatorInput {
  shippingCost: number;
  plan: AmazonPlan;
  category: string;
}

export interface ShopeeFeeTier {
  maxPriceExclusive: number;
  commissionPercent: number;
  fixedFee: number;
}

export interface ShopeeFeeBreakdown {
  commissionPercent: number;
  commissionValue: number;
  fixedFee: number;
  totalMarketplaceFee: number;
}

export interface MercadoLivreFeeBreakdown {
  commissionPercent: number;
  commissionValue: number;
  fixedFee: number;
  installmentExtra: number;
  totalMarketplaceFee: number;
}

export interface AmazonCategoryRule {
  rate: number;
  minCommission: number;
}

export interface ModalItem {
  label: string;
  tag: string;
  tagColor: string;
  description: string;
}

export interface ModalSection {
  title: string;
  subtitle: string;
  items: ModalItem[];
  table: string[][];
}
