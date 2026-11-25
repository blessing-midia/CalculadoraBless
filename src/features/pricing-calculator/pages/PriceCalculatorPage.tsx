import { useRef, useState } from 'react';
import { Check, Package, SlidersHorizontal, ChartNoAxesCombined, ChartPie, Sparkles } from 'lucide-react';
import { useCalculatorWorkspace } from '../controllers/useCalculatorWorkspace';
import { useCalculatorView } from '../controllers/useCalculatorView';
import { useSwapIn } from '../controllers/useSegmentAnimation';
import { useMobileStepMotion } from '../controllers/useMobileStepMotion';
import { MARKETPLACE_LIST, MARKETPLACES } from '../domain/config/marketplaces';
import { MarketplaceLogo } from '../components/workspace/MarketplaceLogo';
import { ProductCard } from '../components/workspace/ProductCard';
import { ResultsCard } from '../components/workspace/ResultsCard';
import { MarketplaceSettingsCard } from '../components/workspace/MarketplaceSettingsCard';
import { CostCompositionCard } from '../components/workspace/CostCompositionCard';
import { AssessoriaLink } from '@/components/AssessoriaLink';
import { StepActions } from '../components/workspace/StepActions';
import '../styles/mobile-flow.css';

const MOBILE_STEPS = [
  { label: 'Produto', title: 'Comece pelo seu produto', description: 'Informe seus custos e defina a margem ou o preço de venda.', icon: Package, slot: 'product' },
  { label: 'Ajustes', title: 'Ajuste cada marketplace', description: 'Confira seu perfil, as condições de venda e o frete.', icon: SlidersHorizontal, slot: 'settings' },
  { label: 'Resultado', title: 'Seu preço, com clareza', description: 'Compare o preço de venda, o lucro e a margem por canal.', icon: ChartNoAxesCombined, slot: 'results' },
  { label: 'Composição', title: 'Entenda cada custo', description: 'Veja quanto cada custo representa no seu preço de venda.', icon: ChartPie, slot: 'composition' },
] as const;

/**
 * Mesma tela de `/hub/calculadora-de-precos` do Hub, sem o breadcrumb do Hub e
 * sem salvar/histórico (que no Hub só existem dentro de um projeto).
 */
export default function PriceCalculatorPage({ onHome }: { onHome: () => void }) {
  const calculator = useCalculatorWorkspace();
  const { ref, displayed, transitioning } = useCalculatorView(calculator.view);
  const resultsRef = useSwapIn<HTMLDivElement>(calculator.draft.selected.join(','));
  const [step, setStep] = useState(0);
  const motionRoot = useMobileStepMotion(step);
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const currentStep = MOBILE_STEPS[step];
  const goToStep = (next: number) => {
    if (next === step) return;
    setStep(next);
    window.requestAnimationFrame(() => {
      stepHeading.current?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
  };
  return (
    <div ref={motionRoot} className="calculator-compact cw-workspace" data-mobile-step={currentStep.slot}>
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
          <AssessoriaLink className="calc-assessoria-link" label="Diagnóstico grátis" />
        </header>

        <section className="cw-mobile-markets" aria-label="Seleção de marketplaces">
          <div className="cw-mobile-markets-heading">
            <h2>Onde você quer vender?</h2>
            <span aria-live="polite">{calculator.draft.selected.length} {calculator.draft.selected.length === 1 ? 'selecionado' : 'selecionados'}</span>
          </div>
          <div className="cw-market-carousel">
            {MARKETPLACE_LIST.map((key) => {
              const selected = calculator.draft.selected.includes(key);
              return (
                <button key={key} type="button" className="cw-market-option" aria-label={MARKETPLACES[key].name}
                  aria-pressed={selected} onClick={() => calculator.toggleMarketplace(key)}>
                  <span className="cw-market-avatar">
                    <MarketplaceLogo marketplace={key} />
                    {selected && <span className="cw-market-check"><Check size={10} strokeWidth={3} /></span>}
                  </span>
                  <span>{MARKETPLACES[key].name}</span>
                </button>
              );
            })}
          </div>
          <p>Toque para selecionar ou remover canais.</p>
        </section>

        <div className="cw-mobile-intro">
          <div className="cw-mobile-progress" aria-label={`Etapa ${step + 1} de ${MOBILE_STEPS.length}`}>
            {MOBILE_STEPS.map((item, index) => <span key={item.slot} data-reached={index <= step} />)}
          </div>
          <span className="cw-mobile-eyebrow">ETAPA {step + 1} DE {MOBILE_STEPS.length}</span>
          <h2 ref={stepHeading} tabIndex={-1}>{currentStep.title}</h2>
          <p>{currentStep.description}</p>
        </div>

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
        <StepActions key={step} step={step} total={MOBILE_STEPS.length} onNavigate={goToStep} />
        <aside className="cw-mobile-diagnostic" aria-label="Diagnóstico gratuito">
          <span className="cw-diagnostic-icon" aria-hidden="true"><Sparkles size={20} /></span>
          <div>
            <h2>Quer melhorar seus resultados?</h2>
            <p>Conte com a Blessing para planejar seus próximos passos.</p>
          </div>
          <AssessoriaLink className="cw-diagnostic-link" />
        </aside>
        <nav className="cw-mobile-nav" aria-label="Etapas da calculadora">
          {MOBILE_STEPS.map((item, index) => {
            const Icon = item.icon;
            return <button key={item.slot} type="button" aria-current={step === index ? 'step' : undefined}
              aria-label={`${index + 1}. ${item.label}`} onClick={() => goToStep(index)}>
              <Icon size={22} strokeWidth={step === index ? 2.3 : 1.7} />
              <span>{item.label}</span>
            </button>;
          })}
        </nav>
      </div>
    </div>
  );
}
