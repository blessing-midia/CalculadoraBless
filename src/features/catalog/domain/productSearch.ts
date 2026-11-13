/** Literal SKU matches always precede names and related terms. */
export function normalizeProductSearch(value: string) {
  return value
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}
export function productSearchScore(
  name: string,
  sku: string,
  query: string,
): number {
  const q = normalizeProductSearch(query);
  if (!q) return 1;
  const s = normalizeProductSearch(sku),
    n = normalizeProductSearch(name);
  const compact = (value: string) => value.replaceAll(" ", "");
  if (s && s === q) return 1000;
  if (s && compact(s) === compact(q)) return 950;
  if (s.startsWith(q)) return 900;
  if (s.includes(q)) return 800;
  if (n === q) return 700;
  if (n.startsWith(q)) return 650;
  if (n.includes(q)) return 600;
  if (/\d/.test(q)) return 0;
  const terms = q
    .split(" ")
    .filter((term) => term.length >= 3)
    .map((term) =>
      term.endsWith("s") && term.length > 3 ? term.slice(0, -1) : term,
    );
  return terms.length &&
    terms.every((term) => n.split(" ").some((word) => word.startsWith(term)))
    ? 300
    : 0;
}
export type ProductOriginFilter = "all" | "marketplace" | "manual";
export function matchesProductOrigin(
  link: unknown,
  filter: ProductOriginFilter,
) {
  return filter === "all" || (filter === "marketplace" ? !!link : !link);
}
export function isInactiveShopeeStatus(status: string) {
  return [
    "UNLIST",
    "BANNED",
    "MODEL_UNAVAILABLE",
    "SELLER_DELETE",
    "SHOPEE_DELETE",
  ].includes(status);
}
export function matchesCatalogProductFilters(
  product: { shopee_link?: { status: string }; is_active: boolean },
  origin: ProductOriginFilter,
  status: "all" | "active" | "inactive",
) {
  if (!matchesProductOrigin(product.shopee_link, origin)) return false;
  if (status === "all") return true;
  return product.shopee_link
    ? status === "active"
      ? product.shopee_link.status === "NORMAL"
      : isInactiveShopeeStatus(product.shopee_link.status)
    : status === "active"
      ? product.is_active
      : !product.is_active;
}
