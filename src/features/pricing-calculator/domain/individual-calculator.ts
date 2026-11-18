import { calculateAmazonPrice } from './calculators/amazon-calculator';
import { calculateMercadoLivrePrice } from './calculators/mercado-livre-calculator';
import { calculateShopeePrice } from './calculators/shopee-calculator';
import { calculateTikTokPrice } from './calculators/tiktok-calculator';
import type {
  AmazonPlan,
  BaseCalculatorInput,
  CalculationMode,
  CalculatorResult,
  ListingType,
  MarketplaceKey,
  SellerType,
} from './types';

/** Entradas comuns a todos os marketplaces, em reais e em pontos percentuais. */
export interface ProductInputs {
  productCost: number;
  packagingCost: number;
  calculationMode: CalculationMode;
  margin: number;
  targetSalePrice: number;
}

/** Ads, promo e impostos em pontos percentuais; outros e frete em reais. */
export interface ExtraCosts {
  ads: number;
  promo: number;
  tax: number;
  other: number;
  shipping: number;
}

/** Configurações próprias de cada marketplace. Cada campo pertence a um só. */
export interface MarketplaceSettings {
  sellerType: SellerType;
  categoryKey: string;
  listingType: ListingType;
  affiliates: number;
  plan: AmazonPlan;
  amazonCategory: string;
}

export type ExtraCostsByMarketplace = Record<MarketplaceKey, ExtraCosts>;

export const DEFAULT_PRODUCT: ProductInputs = {
  productCost: 25,
  packagingCost: 1.5,
  calculationMode: 'margin',
  margin: 26,
  targetSalePrice: 50,
};

export const DEFAULT_EXTRA_COSTS: ExtraCosts = { ads: 0, promo: 0, tax: 0, other: 0, shipping: 0 };

export const DEFAULT_SETTINGS: MarketplaceSettings = {
  sellerType: 'cnpj',
  categoryKey: 'outros',
  listingType: 'classic',
  affiliates: 0,
  plan: 'prof',
  amazonCategory: 'demais',
};

export function createDefaultExtraCosts(): ExtraCostsByMarketplace {
  return {
    shopee: { ...DEFAULT_EXTRA_COSTS },
    mercadoLivre: { ...DEFAULT_EXTRA_COSTS },
    tiktok: { ...DEFAULT_EXTRA_COSTS },
    amazon: { ...DEFAULT_EXTRA_COSTS },
  };
}

function toBaseInput(product: ProductInputs, extras: ExtraCosts): BaseCalculatorInput {
  return {
    productCost: product.productCost,
    packagingCost: product.packagingCost,
    adsPercent: extras.ads / 100,
    promoPercent: extras.promo / 100,
    taxPercent: extras.tax / 100,
    otherCost: extras.other,
    calculationMode: product.calculationMode,
    targetMargin: product.margin / 100,
    targetSalePrice: product.targetSalePrice,
  };
}

type MarketplaceCalculator = (
  base: BaseCalculatorInput,
  extras: ExtraCosts,
  settings: MarketplaceSettings,
) => CalculatorResult;

const CALCULATORS: Record<MarketplaceKey, MarketplaceCalculator> = {
  shopee: (base, _extras, settings) =>
    calculateShopeePrice({ ...base, sellerType: settings.sellerType }),
  mercadoLivre: (base, extras, settings) =>
    calculateMercadoLivrePrice({
      ...base,
      shippingCost: extras.shipping,
      categoryKey: settings.categoryKey,
      listingType: settings.listingType,
    }),
  tiktok: (base, extras, settings) =>
    calculateTikTokPrice({
      ...base,
      shippingCost: extras.shipping,
      affiliatesPercent: settings.affiliates / 100,
    }),
  amazon: (base, extras, settings) =>
    calculateAmazonPrice({
      ...base,
      shippingCost: extras.shipping,
      plan: settings.plan,
      category: settings.amazonCategory,
    }),
};

/** Delega ao calculador do marketplace; as regras de preço ficam em `calculators/`. */
export function calculateMarketplacePrice(
  marketplace: MarketplaceKey,
  product: ProductInputs,
  extras: ExtraCosts,
  settings: MarketplaceSettings,
): CalculatorResult {
  return CALCULATORS[marketplace](toBaseInput(product, extras), extras, settings);
}

export function isViable(result: CalculatorResult): boolean {
  return result.salePrice > 0;
}

/** Margem real sobre o preço de venda, em fração (0.26 = 26%). */
export function getProfitMargin(result: CalculatorResult): number {
  return isViable(result) ? result.profit / result.salePrice : 0;
}
