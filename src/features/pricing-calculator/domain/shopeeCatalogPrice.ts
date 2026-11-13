import {
  calculateMarketplacePrice,
  type ProductInputs,
  type ExtraCosts,
  type MarketplaceSettings,
} from "./individual-calculator";
import type { CalculatorResult } from "./types";
/** A known advertised price is not a profit estimate while cost is missing. */
export function calculateShopeeCatalogPrice(
  price: number | null,
  product: ProductInputs,
  extras: ExtraCosts,
  settings: MarketplaceSettings,
): CalculatorResult {
  if (price === null || !Number.isFinite(price) || price <= 0)
    return {
      salePrice: 0,
      profit: 0,
      breakdown: [],
      meta: { viable: false, reason: "Preço de venda da Shopee indisponível." },
    };
  if (product.productCost <= 0)
    return {
      salePrice: price,
      profit: 0,
      breakdown: [],
      meta: {
        costPending: true,
        reason: "Informe o custo para calcular lucro e margem.",
      },
    };
  return calculateMarketplacePrice(
    "shopee",
    { ...product, calculationMode: "salePrice", targetSalePrice: price },
    extras,
    settings,
  );
}
