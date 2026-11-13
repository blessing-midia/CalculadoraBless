export const formatCurrency = (value: number): string => {
  const safeValue = Number.isFinite(value) ? value : 0;
  return `R$ ${safeValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatDecimal = (value: number): string => {
  const safeValue = Number.isFinite(value) ? value : 0;
  return safeValue.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatPercent = (value: number): string => {
  const safeValue = Number.isFinite(value) ? value : 0;
  return `${(safeValue * 100).toFixed(1)}%`;
};

export const roundMoney = (value: number): number =>
  Math.round((value + Number.EPSILON) * 100) / 100;

/** Fração como percentual pt-BR com até uma casa: 0.26 → "26%", 0.265 → "26,5%". */
export const formatPercentShort = (value: number): string => {
  const safeValue = Number.isFinite(value) ? value : 0;
  return `${(safeValue * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`;
};

/**
 * Lê o texto digitado num campo numérico (vírgula como separador decimal).
 * Devolve `null` quando o texto tem mais de uma vírgula e deve ser ignorado.
 */
export const parseDecimalInput = (raw: string): { display: string; value: number } | null => {
  const display = raw.replace(/[^0-9,]/g, '');
  if ((display.match(/,/g) ?? []).length > 1) return null;
  return { display, value: parseFloat(display.replace(',', '.')) || 0 };
};
