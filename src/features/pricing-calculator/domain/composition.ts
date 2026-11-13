import type { ExtraCosts } from "./individual-calculator";
import type { BreakdownRow, CalculatorResult } from "./types";
import { roundMoney } from "./formatters";

/** Apresenta os custos separados sem alterar o total agregado do calculador. */
export function getCompositionRows(
  result: CalculatorResult,
  extras: Pick<ExtraCosts, "ads" | "promo">,
): BreakdownRow[] {
  return result.breakdown.flatMap((row) => {
    if (row.label === "Produto") return [{ ...row, label: "Custo do Produto" }];
    if (row.label !== "Marketing") return [row];
    const totalPercent = extras.ads + extras.promo;
    const ads =
      extras.promo === 0
        ? row.value
        : totalPercent > 0
          ? roundMoney((row.value * extras.ads) / totalPercent)
          : 0;
    return [
      { label: "Ads ( ACOS )", value: ads },
      { label: "Ferramentas de marketing", value: row.value - ads },
    ];
  });
}
