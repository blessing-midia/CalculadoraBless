export interface ShopeeProductLinkData {
  /** Loja do vínculo; compõe o link público do anúncio. */
  shop_id?: string;
  item_id: string;
  model_id: string;
  name: string;
  sku: string;
  status: string;
  price: string | null;
  original_price: string | null;
  currency: "BRL" | null;
  stock: number | null;
  image_url: string | null;
  image_urls?: string[];
  synced_at: string;
}
export function readShopeeProductLink(
  value: unknown,
): ShopeeProductLinkData | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return;
  const v = value as Record<string, unknown>;
  if (
    typeof v.item_id !== "string" ||
    !/^\d{1,16}$/.test(v.item_id) ||
    typeof v.model_id !== "string" ||
    !/^\d{1,16}$/.test(v.model_id) ||
    typeof v.status !== "string" ||
    typeof v.synced_at !== "string" ||
    !Number.isFinite(Date.parse(v.synced_at))
  )
    return;
  if (
    v.price !== null &&
    (typeof v.price !== "string" || !/^\d{1,14}\.\d{2}$/.test(v.price))
  )
    return;
  if (
    v.stock !== null &&
    (!Number.isSafeInteger(v.stock) || Number(v.stock) < 0)
  )
    return;
  if (v.currency !== null && v.currency !== "BRL") return;
  return v as unknown as ShopeeProductLinkData;
}
/** Anúncios removidos não têm mais página na Shopee. */
const REMOVED_STATUSES = new Set(["SELLER_DELETE", "SHOPEE_DELETE"]);

/** Página pública do anúncio, ou `null` sem a loja ou com o anúncio removido. */
export function shopeeListingUrl(
  link: Pick<ShopeeProductLinkData, "shop_id" | "item_id" | "status"> | undefined,
): string | null {
  if (!link?.shop_id || REMOVED_STATUSES.has(link.status)) return null;
  if (!/^\d+$/.test(link.shop_id) || !/^\d+$/.test(link.item_id)) return null;
  return `https://shopee.com.br/product/${link.shop_id}/${link.item_id}`;
}

export const shopeeProductStatusLabels: Record<string, string> = {
  NORMAL: "Vinculado à Shopee",
  UNLIST: "Inativo na Shopee",
  BANNED: "Bloqueado na Shopee",
  REVIEWING: "Em revisão na Shopee",
  SELLER_DELETE: "Removido na Shopee",
  SHOPEE_DELETE: "Removido na Shopee",
  MODEL_UNAVAILABLE: "Variação indisponível",
  NOT_SEEN: "Não localizado na última consulta",
};
