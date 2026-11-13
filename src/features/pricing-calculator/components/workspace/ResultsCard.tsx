import { useState } from "react";
import type { WorkspaceQuote } from "../../domain/workspace";
import { MARKETPLACES } from "../../domain/config/marketplaces";
import { formatCurrency, formatPercentShort } from "../../domain/formatters";
import { MarketplaceLogo } from "./MarketplaceLogo";

export function ResultsCard({ quotes }: { quotes: WorkspaceQuote[] }) {
  const [active, setActive] = useState<string | null>(null);
  return (
    <section className="cw-card cw-results" aria-labelledby="cw-results-title">
      <h2 id="cw-results-title">
        {quotes.length === 1
          ? `Resultado · ${MARKETPLACES[quotes[0].marketplace].name}`
          : quotes.length === 4
            ? "Resultados por marketplace"
            : `Resultados · ${quotes.length} marketplace${quotes.length === 1 ? "" : "s"}`}
      </h2>
      {!quotes.length ? (
        <p className="cw-empty">Selecione um marketplace para calcular.</p>
      ) : (
        <div
          className="cw-result-list"
          data-count={quotes.length}
          onMouseLeave={() => setActive(null)}
        >
          <div className="cw-result-head" aria-hidden="true">
            <span>Marketplace</span>
            <strong>Preço de venda</strong>
            <span>Lucro líquido</span>
            <span>Margem</span>
          </div>
          {quotes.map((quote) => (
            <article
              key={quote.marketplace}
              className={`cw-result${active === quote.marketplace ? " is-active" : active ? " is-muted" : ""}`}
              style={
                {
                  "--cw-market-color": MARKETPLACES[quote.marketplace].color,
                } as React.CSSProperties
              }
              data-result={quote.marketplace}
              onMouseEnter={() => setActive(quote.marketplace)}
              onFocus={() => setActive(quote.marketplace)}
              onBlur={() => setActive(null)}
            >
              <button
                type="button"
                className="cw-result-brand"
                onClick={() =>
                  setActive(
                    active === quote.marketplace ? null : quote.marketplace,
                  )
                }
                aria-pressed={active === quote.marketplace}
              >
                <MarketplaceLogo marketplace={quote.marketplace} />
                <span>{MARKETPLACES[quote.marketplace].name}</span>
              </button>
              {quote.viable ? (
                <>
                  <div className="cw-price" data-label="Preço de venda">
                    <strong>{formatCurrency(quote.result.salePrice)}</strong>
                    {quote.costPending && (
                      <span className="block text-xs font-normal text-muted-foreground">
                        Custo pendente
                      </span>
                    )}
                  </div>
                  <div
                    className={`cw-profit${quote.result.profit < 0 ? " is-loss" : ""}`}
                    data-label="Lucro líquido"
                  >
                    <strong>{formatCurrency(quote.result.profit)}</strong>
                  </div>
                  <div
                    className={`cw-margin${quote.margin < 0 ? " is-loss" : ""}`}
                    data-label="Margem líquida"
                  >
                    {formatPercentShort(quote.margin)}
                  </div>
                </>
              ) : (
                <p className="cw-invalid">
                  {quote.result.meta?.reason ||
                    "Não é possível calcular com estes valores. Revise margem e custos."}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
