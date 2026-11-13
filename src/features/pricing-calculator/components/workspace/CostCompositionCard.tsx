import { useState } from "react";
import {
  MARKETPLACES,
  MARKETPLACE_LIST,
} from "../../domain/config/marketplaces";
import type { MarketplaceKey } from "../../domain/types";
import type { WorkspaceQuote } from "../../domain/workspace";
import { formatCurrency, formatPercentShort } from "../../domain/formatters";
import { useCostChartAnimation } from "../../controllers/useCostChartAnimation";
import { MarketplaceLogo } from "./MarketplaceLogo";

function CostChart({ quote }: { quote: WorkspaceQuote }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const requested = hovered ?? pinned;
  const active = quote.rows.some((row) => row.key === requested)
    ? requested
    : null;
  const current = quote.rows.find((row) => row.key === active);
  const arcs = useCostChartAnimation(quote.rows);
  const toggle = (key: string) =>
    setPinned((value) => (value === key ? null : key));
  return (
    <div className="cw-composition-body" onMouseLeave={() => setHovered(null)}>
      <div className="cw-donut">
        <svg
          viewBox="0 0 120 120"
          role="group"
          aria-label={`Composição de custos ${MARKETPLACES[quote.marketplace].name}`}
        >
          <g ref={arcs}>
            {quote.rows.map((row) => (
              <circle
                key={row.key}
                data-cost-key={row.key}
                cx="60"
                cy="60"
                r="46"
                fill="none"
                pathLength="100"
                stroke={row.color}
                transform="rotate(-90 60 60)"
                className={`${active && active !== row.key ? "is-muted" : ""}${active === row.key ? " is-active" : ""}`}
                role="button"
                tabIndex={row.value > 0 ? 0 : -1}
                aria-label={`${row.label}: ${formatCurrency(row.value)}`}
                aria-pressed={pinned === row.key}
                onMouseEnter={() => setHovered(row.key)}
                onMouseLeave={() => setHovered(null)}
                onFocus={() => setHovered(row.key)}
                onBlur={() => setHovered(null)}
                onClick={() => toggle(row.key)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    toggle(row.key);
                  }
                  if (event.key === "Escape") {
                    setHovered(null);
                    setPinned(null);
                  }
                }}
              />
            ))}
          </g>
        </svg>
        <div className="cw-donut-center">
          <strong>{formatCurrency(current?.value ?? quote.cost)}</strong>
          <span>{current?.label ?? "Custo total"}</span>
        </div>
      </div>
      <div className="cw-cost-legend">
        <div className="cw-legend-head">
          <span>Item</span>
          <span>Valor</span>
          <span>%</span>
        </div>
        {quote.rows.map((row) => (
          <button
            type="button"
            key={row.key}
            className={`cw-legend-row${active && active !== row.key ? " is-muted" : ""}`}
            aria-pressed={pinned === row.key}
            onMouseEnter={() => setHovered(row.key)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(row.key)}
            onBlur={() => setHovered(null)}
            onClick={() => toggle(row.key)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setPinned(null);
                setHovered(null);
              }
            }}
          >
            <span>
              <i style={{ background: row.color }} />
              {row.label}
            </span>
            <span>{formatCurrency(row.value)}</span>
            <strong>
              {formatPercentShort(quote.cost > 0 ? row.value / quote.cost : 0)}
            </strong>
          </button>
        ))}
      </div>
    </div>
  );
}

export function CostCompositionCard({
  quote,
  selected,
  onSelect,
}: {
  quote?: WorkspaceQuote;
  selected: MarketplaceKey[];
  onSelect: (marketplace: MarketplaceKey) => void;
}) {
  return (
    <section
      className="cw-card cw-composition"
      aria-labelledby="cw-composition-title"
    >
      <h2 id="cw-composition-title">Composição de custos</h2>
      <div
        className="cw-cost-tabs"
        role="tablist"
        aria-label="Marketplace da composição"
      >
        {MARKETPLACE_LIST.map((key) => (
          <button
            type="button"
            role="tab"
            key={key}
            id={`cw-cost-${key}`}
            aria-controls="cw-cost-panel"
            aria-selected={quote?.marketplace === key}
            disabled={!selected.includes(key)}
            onClick={() => onSelect(key)}
          >
            <MarketplaceLogo marketplace={key} />
            {MARKETPLACES[key].name}
          </button>
        ))}
      </div>
      <div
        id="cw-cost-panel"
        role="tabpanel"
        aria-labelledby={
          quote ? `cw-cost-${quote.marketplace}` : "cw-composition-title"
        }
      >
        {quote?.viable ? (
          <CostChart quote={quote} />
        ) : (
          <p className="cw-empty">
            {quote
              ? "Revise os valores para visualizar os custos."
              : "Selecione um marketplace para visualizar os custos."}
          </p>
        )}
      </div>
    </section>
  );
}
