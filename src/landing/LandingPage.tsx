import { useMemo, useRef } from 'react';
import { LandingButtons } from './LandingButtons';
import { MARKETPLACE_LIST, MARKETPLACES } from '../features/pricing-calculator/domain/config/marketplaces';
import { calculateWorkspaceQuote, createCalculatorDraft } from '../features/pricing-calculator/domain/workspace';
import { formatCurrency, formatPercentShort } from '../features/pricing-calculator/domain/formatters';
import { useLandingMotion } from './useLandingMotion';
import './landing.css';

const STEPS = [
  { title: 'Informe custo e margem', text: 'Custo, embalagem e a margem que você quer.' },
  { title: 'Escolha os marketplaces', text: 'O resultado muda a cada seleção.' },
  { title: 'Entenda seus custos', text: 'Produto, embalagem e taxas no gráfico.' },
];

const PERKS = ['100% grátis', 'Sem cadastro', 'Resultado na hora'];

const LOGOS = [
  { name: 'Shopee', src: '/landing/shopee.png' },
  { name: 'Mercado Livre', src: '/landing/mercado-livre.png' },
  { name: 'TikTok Shop', src: '/landing/tiktok.png' },
  { name: 'Amazon', src: '/landing/amazon.png' },
];

/** Os números da demonstração saem do mesmo cálculo da calculadora, com os valores iniciais dela. */
function useDemo() {
  return useMemo(() => {
    const draft = createCalculatorDraft();
    const quotes = MARKETPLACE_LIST.map((key) =>
      calculateWorkspaceQuote(key, draft.product, draft.extras[key], draft.settings),
    );
    const shopee = quotes[0];
    // Mesma divisão de arcos do gráfico da calculadora (useCostChartAnimation).
    const total = shopee.rows.reduce((sum, row) => sum + Math.max(0, row.value), 0);
    let offset = 0;
    const arcs = shopee.rows.map((row) => {
      const share = total > 0 ? (Math.max(0, row.value) / total) * 100 : 0;
      const gap = Math.min(1.2, share * 0.3);
      const arc = { ...row, share, dash: Math.max(0, share - gap), offset: -(offset + gap / 2) };
      offset += share;
      return arc;
    });
    return { product: draft.product, quotes, shopee, arcs, total };
  }, []);
}

function Check() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
      <circle cx="10" cy="10" r="10" fill="currentColor" />
      <path d="M6 10.2l2.6 2.6L14 7.4" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Keep full text accessible and reserve its final layout while letters appear. */
function TypewriterText({ text }: { text: string }) {
  const words = text.split(' ');
  return <>
    <span className="sr-only">{text}</span>
    <span aria-hidden="true">{words.map((word, index) => (
      <span key={index}>
        <span className="lp-typed-word">{Array.from(word).map((letter, i) => <span key={i} data-lp-char>{letter}</span>)}</span>
        {index < words.length - 1 ? ' ' : ''}
      </span>
    ))}</span>
  </>;
}

export function LandingPage({ onEnter }: { onEnter: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const { product, quotes, shopee, arcs, total } = useDemo();
  const { leave } = useLandingMotion(root);

  const enter = () => leave(onEnter);

  return (
    <div ref={root} className="lp lp--carousel">
      <header className="lp-nav" data-lp="nav">
        <img className="lp-brand" src="/landing/blessing-logo.webp" alt="Blessing" width={190} height={58} />
      </header>

      <main className="lp-main">
        <section className="lp-copy" aria-labelledby="lp-title">
          <div className="lp-hero-message">
            <span className="lp-mobile-eyebrow" data-lp="rise">CALCULADORA DE PREÇOS</span>
            <h1 id="lp-title" className="lp-title">
              <span data-lp="rise">Preço certo.</span>
              <span className="lp-accent" data-lp="rise">Lucro real.</span>
            </h1>
            <p className="lp-description" data-lp="rise">
              Informe o custo e a margem. A calculadora aplica as taxas da Shopee, Mercado Livre, TikTok Shop e Amazon e
              mostra o preço de venda e o lucro de cada um, lado a lado.
            </p>
          </div>
          <div className="lp-hero-visual" aria-hidden="true">
            <div className="lp-cart-motion" data-lp="rise">
              <img src="/landing/carrinho-compras.png" alt="" width={512} height={512} fetchPriority="high" />
            </div>
          </div>

          <div className="lp-actions-scroll">
            <div className="lp-actions" data-lp="rise">
              <LandingButtons onEnter={enter} />
              <ul className="lp-perks" aria-label="Vantagens">
                {PERKS.map((perk) => (
                  <li key={perk}>
                    <Check />
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <a className="lp-explore" href="#como-funciona">
            Veja como funciona
            <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
              <path d="m5 8 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </section>

        <div id="como-funciona" className="lp-demo" data-lp="demo">
          <div className="lp-demo-intro">
            <span className="lp-mobile-eyebrow"><TypewriterText text="SIMPLES, DO INÍCIO AO RESULTADO" /></span>
            <h2><TypewriterText text="Seu próximo preço começa aqui." /></h2>
            <p><TypewriterText text="Veja como seus custos se transformam em uma decisão de venda." /></p>
          </div>
          {/* Seleção de marketplaces fora do card, como no topo da calculadora. */}
          <div className="lp-markets" aria-hidden="true">
            {MARKETPLACE_LIST.map((key) => (
              <span key={key} className="lp-chip" data-lp="chip">
                <i className="lp-check">
                  <i className="lp-ripple" data-lp="ripple" />
                </i>
                <img src={`/calculator/brands/${key}.png`} alt="" />
                <span>{MARKETPLACES[key].name}</span>
              </span>
            ))}
          </div>

          <div className="lp-stage" aria-hidden="true">
          {/* 1 — Produto */}
          <article className="lp-card" data-lp="card">
            <header className="lp-card-head">
              <h2>Produto</h2>
              <span className="lp-toggle">
                <b>Definir margem</b>
                <span>Definir preço</span>
              </span>
            </header>
            <div className="lp-tiles">
              <div className="lp-tile" data-lp="tile">
                <span>Custo do Produto</span>
                <b>
                  R$ <em data-lp="num" data-value={product.productCost} data-decimals="2">0,00</em>
                </b>
              </div>
              <div className="lp-tile" data-lp="tile">
                <span>Margem desejada</span>
                <b>
                  <em data-lp="num" data-value={product.margin} data-decimals="0">0</em>
                  <small>%</small>
                </b>
              </div>
              <div className="lp-tile" data-lp="tile">
                <span>Embalagem</span>
                <b>
                  R$ <em data-lp="num" data-value={product.packagingCost} data-decimals="2">0,00</em>
                </b>
              </div>
            </div>
            <div className="lp-tiles lp-tiles--small">
              {['Imposto', 'Ads ( ACOS )', 'Ferramentas', 'Outros'].map((label) => (
                <div key={label} className="lp-tile">
                  <span>{label}</span>
                  <b>
                    0<small>%</small>
                  </b>
                </div>
              ))}
            </div>
          </article>

          {/* 2 — Resultados */}
          <article className="lp-card" data-lp="card">
            <header className="lp-card-head">
              <h2 data-lp="results-title">Resultados por marketplace</h2>
            </header>
            {/* O layout muda com a quantidade de marketplaces, igual à calculadora:
                1 = destaque, 2 = dois blocos, 3 ou 4 = tabela. */}
            <div className="lp-results-area" data-lp="results" data-count="4">
              <div className="lp-result-head" data-lp="results-head">
                <span>Marketplace</span>
                <span>Preço de venda</span>
                <span>Lucro líquido</span>
                <span>Margem</span>
              </div>
              <p className="lp-results-empty">Selecione um marketplace para calcular.</p>
              <div className="lp-results">
                {quotes.map((quote) => (
                  <div key={quote.marketplace} className="lp-result" data-lp="row">
                    <span className="lp-result-brand">
                      <img src={`/calculator/brands/${quote.marketplace}.png`} alt="" />
                      {MARKETPLACES[quote.marketplace].name}
                    </span>
                    <div className="lp-r-price">
                      <small>Preço de venda</small>
                      <strong>
                        R$ <em data-lp="num" data-value={quote.result.salePrice} data-decimals="2">0,00</em>
                      </strong>
                    </div>
                    <div className="lp-r-profit">
                      <small>Lucro líquido</small>
                      <b>
                        R$ <em data-lp="num" data-value={quote.result.profit} data-decimals="2">0,00</em>
                      </b>
                    </div>
                    <div className="lp-r-margin">
                      <small>Margem líquida</small>
                      <span>{formatPercentShort(quote.margin)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* 3 — Composição de custos */}
          <article className="lp-card" data-lp="card">
            <header className="lp-card-head">
              <h2>Composição de custos</h2>
            </header>
            <div className="lp-tabs">
              {MARKETPLACE_LIST.map((key, index) => (
                <span key={key} className={index === 0 ? 'is-active' : ''}>
                  <img src={`/calculator/brands/${key}.png`} alt="" />
                  {MARKETPLACES[key].name}
                </span>
              ))}
            </div>
            <div className="lp-composition">
              <div className="lp-donut">
                <svg viewBox="0 0 120 120">
                  {arcs.map((arc) => (
                    <circle
                      key={arc.key}
                      data-lp="arc"
                      data-dash={arc.dash}
                      data-offset={arc.offset}
                      cx="60"
                      cy="60"
                      r="46"
                      fill="none"
                      pathLength="100"
                      stroke={arc.color}
                      strokeDasharray="0 100"
                      strokeDashoffset={arc.offset}
                      transform="rotate(-90 60 60)"
                    />
                  ))}
                </svg>
                <div className="lp-donut-center">
                  <strong>
                    R$ <em data-lp="num" data-value={shopee.cost} data-decimals="2">0,00</em>
                  </strong>
                  <span>Custo total</span>
                </div>
              </div>
              <div className="lp-legend">
                <div className="lp-legend-head">
                  <span>Item</span>
                  <span>Valor</span>
                  <span>%</span>
                </div>
                {shopee.rows.slice(0, 6).map((row) => (
                  <div key={row.key} className="lp-legend-row" data-lp="legend">
                    <span>
                      <i style={{ background: row.color }} />
                      {row.label}
                    </span>
                    <span>{formatCurrency(row.value)}</span>
                    <b>{formatPercentShort(total > 0 ? row.value / total : 0)}</b>
                  </div>
                ))}
              </div>
            </div>
          </article>
          </div>

          {/* Paginação do carrossel e o "como usar", compacto, embaixo da demonstração. */}
          <div className="lp-dots" aria-hidden="true">
            {STEPS.map((step, index) => (
              <i key={step.title} data-lp="dot" className={index === 0 ? 'is-active' : ''} />
            ))}
          </div>
          <ol className="lp-steps lp-steps--compact" aria-label="Como usar">
            {STEPS.map((step, index) => (
              <li key={step.title} className="lp-step" data-lp="step">
                <span className="lp-step-index">{index + 1}</span>
                <strong>{step.title}</strong>
                <span className="lp-step-text">{step.text}</span>
                <i className="lp-step-bar" aria-hidden="true">
                  <b data-lp="bar" />
                </i>
              </li>
            ))}
          </ol>
        </div>
      </main>

      <footer className="lp-marquee" data-lp="marquee">
        <span className="lp-marquee-label">Calcule para</span>
        <div className="lp-marquee-track">
          <div className="lp-marquee-row">
            {[...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS].map((logo, index) => (
              <img key={index} src={logo.src} alt={index < LOGOS.length ? logo.name : ''} aria-hidden={index >= LOGOS.length} />
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
