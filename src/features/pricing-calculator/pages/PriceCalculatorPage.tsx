import { useCalculatorWorkspace } from '../controllers/useCalculatorWorkspace';
import { useCalculatorView } from '../controllers/useCalculatorView';
import { useSwapIn } from '../controllers/useSegmentAnimation';
import { MARKETPLACE_LIST, MARKETPLACES } from '../domain/config/marketplaces';
import { MarketplaceLogo } from '../components/workspace/MarketplaceLogo';
import { ProductCard } from '../components/workspace/ProductCard';
import { ResultsCard } from '../components/workspace/ResultsCard';
import { MarketplaceSettingsCard } from '../components/workspace/MarketplaceSettingsCard';
import { CostCompositionCard } from '../components/workspace/CostCompositionCard';

/**
 * Mesma tela de `/hub/calculadora-de-precos` do Hub, sem o breadcrumb do Hub e
 * sem salvar/histórico (que no Hub só existem dentro de um projeto).
 */
export default function PriceCalculatorPage({ onHome }: { onHome: () => void }) {
  const calculator = useCalculatorWorkspace();
  const { ref, displayed, transitioning } = useCalculatorView(calculator.view);
  const resultsRef = useSwapIn<HTMLDivElement>(calculator.draft.selected.join(','));
  return (
    <div className="calculator-compact cw-workspace">
      <div className="cw-page">
        {/* Barra da marca: logo da Blessing e a seleção de marketplaces. */}
        <header className="calc-brandbar">
          <div className="calc-brand">
            <a
              href="/"
              aria-label="Blessing, voltar ao início"
              onClick={(event) => {
                event.preventDefault();
                onHome();
              }}
            >
              <img src="/landing/blessing-logo.webp" alt="Blessing" width={190} height={58} />
            </a>
            <h1>Calculadora</h1>
          </div>
          <div className="cw-marketplaces" aria-label="Marketplaces selecionados">
            {MARKETPLACE_LIST.map((key) => (
              <label key={key} className="cw-market-checkbox">
                <input
                  type="checkbox"
                  aria-label={MARKETPLACES[key].name}
                  checked={calculator.draft.selected.includes(key)}
                  onChange={() => calculator.toggleMarketplace(key)}
                />
                <MarketplaceLogo marketplace={key} />
                <span>{MARKETPLACES[key].name}</span>
              </label>
            ))}
          </div>
        </header>

        <div ref={ref} className="cw-view" aria-busy={transitioning}>
          <div hidden={displayed !== 'calculator'}>
            <div className="cw-grid">
              <ProductCard calculator={calculator} />
              <CostCompositionCard
                quote={calculator.detailQuote}
                selected={calculator.draft.selected}
                onSelect={calculator.setDetail}
              />
              <MarketplaceSettingsCard calculator={calculator} />
              <div className="cw-result-slot" ref={resultsRef}>
                <ResultsCard quotes={calculator.quotes} />
              </div>
            </div>
            <p className="cw-footnote" role="status">
              {calculator.message || 'Atualiza ao editar · Valores por unidade'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
