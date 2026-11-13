import { MARKETPLACE_LIST } from './config/marketplaces';
import {
  calculateMarketplacePrice,
  getProfitMargin,
  isViable,
  type ExtraCosts,
  type MarketplaceSettings,
  type ProductInputs,
} from './individual-calculator';
import type { CalculatorResult, MarketplaceKey } from './types';

export type ComparatorSort = 'price' | 'profit';

export interface RankedMarketplace {
  key: MarketplaceKey;
  result: CalculatorResult;
  margin: number;
  rank: number;
}

const COMPARE: Record<ComparatorSort, (a: CalculatorResult, b: CalculatorResult) => number> = {
  price: (a, b) => a.salePrice - b.salePrice,
  profit: (a, b) => b.profit - a.profit,
};

/** Os mesmos custos aplicados aos quatro marketplaces; só os viáveis entram no ranking. */
export function rankMarketplaces(
  product: ProductInputs,
  extras: ExtraCosts,
  settings: MarketplaceSettings,
  sortBy: ComparatorSort,
): RankedMarketplace[] {
  return MARKETPLACE_LIST.map((key) => ({ key, result: calculateMarketplacePrice(key, product, extras, settings) }))
    .filter((item) => isViable(item.result))
    .sort((a, b) => COMPARE[sortBy](a.result, b.result))
    .map((item, index) => ({ ...item, margin: getProfitMargin(item.result), rank: index + 1 }));
}
