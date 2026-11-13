import { getCompositionRows } from "./composition";
import type { ShopeeProductLinkData } from "@/features/catalog/domain/shopeeProductLink";
import { MARKETPLACE_LIST, MARKETPLACES } from "./config/marketplaces";
import {
  calculateMarketplacePrice,
  createDefaultExtraCosts,
  DEFAULT_PRODUCT,
  DEFAULT_SETTINGS,
  getProfitMargin,
  type ExtraCosts,
  type ExtraCostsByMarketplace,
  type MarketplaceSettings,
  type ProductInputs,
} from "./individual-calculator";
import type { MarketplaceKey } from "./types";
import { calculateShopeeCatalogPrice } from "./shopeeCatalogPrice";
import {
  productSearchScore,
  matchesProductOrigin,
  type ProductOriginFilter,
} from "@/features/catalog/domain/productSearch";

export interface CalculatorDraft {
  sourceProductId?: string;
  shopeeSalePrice?: number | null;
  sourceImageUrl?: string | null;
  sourceCatalogProductId?: number;
  name: string;
  sku: string;
  projectId: string;
  selected: MarketplaceKey[];
  product: ProductInputs;
  extras: ExtraCostsByMarketplace;
  settings: MarketplaceSettings;
}
export interface SavedCalculation {
  shopeeLink?: ShopeeProductLinkData;
  catalogProductId?: number | null;
  id: string;
  savedAt: string;
  source?: "individual" | "bulk";
  salePrices?: Partial<Record<MarketplaceKey, number | null>>;
  draft: CalculatorDraft;
}
export interface CalculatorProject {
  id: number;
  name?: string;
  store_name?: string;
  is_active?: boolean;
}

export function createCalculatorDraft(): CalculatorDraft {
  return {
    name: "",
    sku: "",
    projectId: "",
    selected: [...MARKETPLACE_LIST],
    product: { ...DEFAULT_PRODUCT },
    extras: createDefaultExtraCosts(),
    settings: { ...DEFAULT_SETTINGS },
  };
}

export function updateSharedExtra(
  extras: ExtraCostsByMarketplace,
  key: Exclude<keyof ExtraCosts, "shipping">,
  value: number,
): ExtraCostsByMarketplace {
  return Object.fromEntries(
    MARKETPLACE_LIST.map((marketplace) => [
      marketplace,
      { ...extras[marketplace], [key]: value },
    ]),
  ) as ExtraCostsByMarketplace;
}

/** Presentation only: splits the existing breakdown, never computes a fee table. */
export function calculateWorkspaceQuote(
  marketplace: MarketplaceKey,
  product: ProductInputs,
  extras: ExtraCosts,
  settings: MarketplaceSettings,
  requiresCost = false,
  shopeeSalePrice?: number | null,
) {
  const result =
    marketplace === "shopee" && shopeeSalePrice !== undefined
      ? calculateShopeeCatalogPrice(shopeeSalePrice, product, extras, settings)
      : requiresCost && product.productCost <= 0
        ? {
            salePrice: 0,
            profit: 0,
            breakdown: [],
            meta: {
              viable: false,
              reason: "Preencha o custo do produto importado da Shopee.",
            },
          }
        : calculateMarketplacePrice(marketplace, product, extras, settings);
  const viable = result.salePrice > 0;
  const source = getCompositionRows(result, extras);
  const shipping = viable && marketplace !== "shopee" ? extras.shipping : 0;
  const affiliates =
    viable && marketplace === "tiktok"
      ? (result.salePrice * settings.affiliates) / 100
      : 0;
  const channel =
    source.find((row) => /Shopee|Mercado Livre|TikTok|Amazon/.test(row.label))
      ?.value ?? 0;
  const fee =
    marketplace === "mercadoLivre" ? channel : channel - shipping - affiliates;
  const rows = [
    {
      key: "product",
      label: "Custo do Produto",
      value: viable ? product.productCost : 0,
      color: "var(--cw-blue)",
    },
    {
      key: "pack",
      label: "Embalagem",
      value: viable ? product.packagingCost : 0,
      color: "var(--cw-purple)",
    },
    {
      key: "fee",
      label: `Taxa ${MARKETPLACES[marketplace].name}`,
      value: Math.max(0, fee),
      color: "var(--primary-color)",
    },
    ...(marketplace === "tiktok"
      ? [
          {
            key: "affiliates",
            label: "Afiliados",
            value: affiliates,
            color: "var(--cw-teal)",
          },
        ]
      : []),
    {
      key: "shipping",
      label: "Frete",
      value: shipping,
      color: "var(--cw-yellow)",
    },
    ...(
      [
        "Impostos",
        "Ads ( ACOS )",
        "Ferramentas de marketing",
        "Outros",
      ] as const
    ).map((label, index) => ({
      key: label,
      label,
      value: source.find((row) => row.label === label)?.value ?? 0,
      color: [
        "var(--cw-amber)",
        "var(--cw-green)",
        "var(--cw-pink)",
        "var(--calc-muted)",
      ][index],
    })),
  ];
  const costPending = result.meta?.costPending === true;
  const cost = viable && !costPending ? result.salePrice - result.profit : 0;
  return {
    marketplace,
    result,
    viable,
    costPending,
    rows,
    cost,
    feePercent: viable ? fee / result.salePrice : 0,
    margin: getProfitMargin(result),
    roi: cost > 0 ? result.profit / cost : 0,
  };
}
export type WorkspaceQuote = ReturnType<typeof calculateWorkspaceQuote>;

export function filterCalculations(
  entries: SavedCalculation[],
  query: string,
  project: string,
  marketplace: string,
  since: number,
  origin: ProductOriginFilter = "all",
) {
  return entries
    .filter(
      ({ draft, savedAt, shopeeLink }) =>
        matchesProductOrigin(shopeeLink, origin) &&
        productSearchScore(draft.name, draft.sku, query) > 0 &&
        (!project ||
          (project === "own"
            ? !draft.projectId
            : draft.projectId === project)) &&
        (!marketplace ||
          draft.selected.includes(marketplace as MarketplaceKey)) &&
        Date.parse(savedAt) >= since,
    )
    .sort(
      (a, b) =>
        productSearchScore(b.draft.name, b.draft.sku, query) -
        productSearchScore(a.draft.name, a.draft.sku, query),
    );
}
