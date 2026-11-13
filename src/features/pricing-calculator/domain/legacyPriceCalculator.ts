export const MARKETPLACES = [
  { value: "shopee", label: "Shopee" },
  { value: "mercado-livre", label: "Mercado Livre" },
];

export const LEGEND = [
  { key: "custoVal",     label: "Custo Produto", color: "#ff4c0c" },
  { key: "impostoVal",   label: "Imposto",       color: "#ff7a45" },
  { key: "comissaoVal",  label: "Comissão",      color: "#ffa573" },
  { key: "tarifaVal",    label: "Tarifa Fixa",   color: "#ffbf99" },
  { key: "freteVal",     label: "Frete",         color: "#6366f1" },
  { key: "marketingVal", label: "Marketing",     color: "#8b5cf6" },
  { key: "adsVal",       label: "Ads",           color: "#a78bfa" },
  { key: "lucroVal",     label: "Lucro",         color: "#22c55e" },
] as const;

export type LegendKey = (typeof LEGEND)[number]["key"];

export type Fields = {
  custo: string;
  imposto: string;
  margem: string;
  ads: string;
  marketing: string;
  comissao: string;
  tarifa: string;
  frete: string;
};

export type Result = Record<LegendKey, number> & { preco: number };
export type MarketplaceResult = Result & { label: string; mode: "margem-lucro" | "custo-maximo" };

export const EMPTY_FIELDS: Fields = {
  custo: "", imposto: "", margem: "", ads: "",
  marketing: "", comissao: "", tarifa: "", frete: "",
};

function n(v: string) {
  const p = parseFloat(v);
  return isNaN(p) ? 0 : p;
}

export function fmt(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function pct(value: number, total: number) {
  if (!total) return "—";
  return ((value / total) * 100).toFixed(1) + "%";
}

function solvePrice(
  fields: Fields,
  comissaoOverride: number | null,
  extraFixed: number,
): number {
  const fixed =
    n(fields.custo) + n(fields.frete) + n(fields.tarifa) + extraFixed;
  const comissao =
    comissaoOverride !== null ? comissaoOverride : n(fields.comissao);
  const relative =
    (n(fields.margem) + n(fields.imposto) + n(fields.ads) +
      n(fields.marketing) + comissao) / 100;
  if (relative >= 1) return 0;
  return fixed / (1 - relative);
}

function buildResult(
  fields: Fields,
  preco: number,
  comissaoUsed: number,
  feeFixed: number,
): Result {
  return {
    preco,
    custoVal:     n(fields.custo),
    impostoVal:   preco * (n(fields.imposto) / 100),
    comissaoVal:  preco * (comissaoUsed / 100),
    tarifaVal:    n(fields.tarifa) + feeFixed,
    freteVal:     n(fields.frete),
    marketingVal: preco * (n(fields.marketing) / 100),
    adsVal:       preco * (n(fields.ads) / 100),
    lucroVal:     preco * (n(fields.margem) / 100),
  };
}

function getShopeeParams(price: number): { commission: number; fee: number } {
  if (price < 80)  return { commission: 20, fee: 4.5 };
  if (price < 100) return { commission: 14, fee: 16 };
  if (price < 200) return { commission: 14, fee: 20 };
  return           { commission: 14, fee: 26 };
}

export function roundUpTo90(price: number): number {
  return Math.ceil(price - 0.9) + 0.9;
}

export function calcShopee(fields: Fields): Result {
  let price = 0;
  let commission = 20;
  let fee = 4.5;
  for (let i = 0; i < 100; i++) {
    const params = getShopeeParams(price);
    commission = params.commission;
    fee = params.fee;
    const next = solvePrice(fields, commission, fee);
    if (Math.abs(next - price) < 0.001) { price = next; break; }
    price = next;
  }
  return buildResult(fields, roundUpTo90(price), commission, fee);
}

export function calcML(fields: Fields): Result {
  let price = 0;
  let fee = 6.5;
  for (let i = 0; i < 100; i++) {
    fee = price < 79 ? 6.5 : 0;
    const next = solvePrice(fields, null, fee);
    if (Math.abs(next - price) < 0.001) { price = next; break; }
    price = next;
  }
  return buildResult(fields, roundUpTo90(price), n(fields.comissao), fee);
}

export function calcGeneric(fields: Fields): Result {
  const price = solvePrice(fields, null, 0);
  return buildResult(fields, roundUpTo90(price), n(fields.comissao), 0);
}

// ── Custo Máximo: reverse-engineers the max product cost given a selling price ──

function buildResultWithCusto(
  fields: Fields,
  preco: number,
  custo: number,
  comissaoUsed: number,
  feeFixed: number,
): Result {
  return {
    preco,
    custoVal:     Math.max(0, custo),
    impostoVal:   preco * (n(fields.imposto) / 100),
    comissaoVal:  preco * (comissaoUsed / 100),
    tarifaVal:    n(fields.tarifa) + feeFixed,
    freteVal:     n(fields.frete),
    marketingVal: preco * (n(fields.marketing) / 100),
    adsVal:       preco * (n(fields.ads) / 100),
    lucroVal:     preco * (n(fields.margem) / 100),
  };
}

export function calcCustoMaximoGeneric(fields: Fields): Result {
  // fields.custo holds the selling price (Preço) in this mode
  const preco = n(fields.custo);
  const comissao = n(fields.comissao);
  const relative = (n(fields.margem) + n(fields.imposto) + n(fields.ads) + n(fields.marketing) + comissao) / 100;
  const custo = preco * (1 - relative) - n(fields.frete) - n(fields.tarifa);
  return buildResultWithCusto(fields, preco, custo, comissao, 0);
}

export function calcCustoMaximoShopee(fields: Fields): Result {
  const preco = n(fields.custo);
  const { commission, fee } = getShopeeParams(preco);
  const relative = (n(fields.margem) + n(fields.imposto) + n(fields.ads) + n(fields.marketing) + commission) / 100;
  const custo = preco * (1 - relative) - fee;
  return buildResultWithCusto(fields, preco, custo, commission, fee);
}

export function calcCustoMaximoML(fields: Fields): Result {
  const preco = n(fields.custo);
  const fee = preco < 79 ? 6.5 : 0;
  const comissao = n(fields.comissao);
  const relative = (n(fields.margem) + n(fields.imposto) + n(fields.ads) + n(fields.marketing) + comissao) / 100;
  const custo = preco * (1 - relative) - fee;
  return buildResultWithCusto(fields, preco, custo, comissao, fee);
}
