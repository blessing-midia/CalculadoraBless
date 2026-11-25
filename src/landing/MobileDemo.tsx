import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { MARKETPLACE_LIST, MARKETPLACES } from '../features/pricing-calculator/domain/config/marketplaces';
import { formatCurrency, formatPercentShort } from '../features/pricing-calculator/domain/formatters';
import type { ProductInputs } from '../features/pricing-calculator/domain/individual-calculator';
import type { WorkspaceQuote } from '../features/pricing-calculator/domain/workspace';
import type { MarketplaceKey } from '../features/pricing-calculator/domain/types';
import { TypewriterText } from './TypewriterText';
import './mobile-demo.css';

const SCENES = ['Produto', 'Resultados', 'Composição'] as const;
const STEP_TITLES = ['Informe custo e margem', 'Escolha os marketplaces', 'Entenda seus custos'];
const slot = (index: number, front: number) => ((index - front + SCENES.length + 1) % SCENES.length) - 1;
const position = (index: number, front: number) => {
  const side = slot(index, front);
  return { xPercent: side * 96, scale: side === 0 ? 1 : 0.88, autoAlpha: side === 0 ? 1 : 0.55, zIndex: side === 0 ? 3 : 2 };
};

function AnimatedValue({ value, kind = 'money', active }: { value: number; kind?: 'money' | 'percent' | 'integer'; active: boolean }) {
  const element = useRef<HTMLSpanElement>(null);
  const format = (number: number) => kind === 'money' ? formatCurrency(number) : kind === 'percent' ? formatPercentShort(number) : String(Math.round(number));
  useLayoutEffect(() => {
    if (!active || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (element.current) element.current.textContent = format(value);
      return;
    }
    const counter = { value: 0 };
    const tween = gsap.to(counter, {
      value, duration: 0.9, delay: 0.12, ease: 'power2.out',
      onUpdate: () => { if (element.current) element.current.textContent = format(counter.value); },
    });
    return () => { tween.kill(); };
  }, [value, kind, active]);
  return <span ref={element} className="lp-md-number">{format(value)}</span>;
}

function DemoCosts({ quote, active }: { quote: WorkspaceQuote; active: boolean }) {
  const chart = useRef<SVGSVGElement>(null);
  const rows = quote.rows.filter((row) => row.value > 0);
  const total = rows.reduce((sum, row) => sum + row.value, 0);
  let offset = 0;
  const arcs = rows.map((row) => {
    const start = offset;
    offset += total ? row.value / total * 100 : 0;
    return { ...row, dash: Math.max(0, offset - start - 1), offset: -start };
  });
  useLayoutEffect(() => {
    if (!active || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      chart.current?.querySelectorAll('circle').forEach((circle, index) => gsap.fromTo(circle,
        { attr: { 'stroke-dasharray': '0 100' } },
        { attr: { 'stroke-dasharray': `${circle.dataset.dash} 100` }, duration: 0.7, delay: index * 0.1, ease: 'power3.out' },
      ));
    });
    return () => ctx.revert();
  }, [quote, active]);
  return <div className="lp-md-costs">
    <div className="lp-md-donut" role="img" aria-label={`Custo total ${formatCurrency(quote.cost)}`}>
      <svg ref={chart} viewBox="0 0 120 120" aria-hidden="true">{arcs.map((arc) => <circle key={arc.key} cx="60" cy="60" r="46" fill="none" pathLength="100" stroke={arc.color}
        strokeDasharray={`${arc.dash} 100`} strokeDashoffset={arc.offset} data-dash={arc.dash} transform="rotate(-90 60 60)" />)}</svg>
      <div><strong><AnimatedValue value={quote.cost} active={active} /></strong><span>Custo total</span></div>
    </div>
    <div className="lp-md-legend">{rows.map((row) => <div className="lp-md-cost-row" key={row.key}>
      <span className="lp-md-cost-name"><i style={{ background: row.color }} />{row.label}</span>
      <strong>{formatCurrency(row.value)}</strong><span>{formatPercentShort(total ? row.value / total : 0)}</span>
    </div>)}</div>
  </div>;
}

export function MobileDemo({ product, quotes, onEnter }: { product: ProductInputs; quotes: WorkspaceQuote[]; onEnter: () => void }) {
  const [scene, setScene] = useState(0);
  const [selected, setSelected] = useState<MarketplaceKey[]>([]);
  const [interaction, setInteraction] = useState(0);
  const [dragging, setDragging] = useState(false);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const gesture = useRef<{ x: number; y: number } | null>(null);
  const previous = useRef(0);
  const initialized = useRef(false);
  const visibleQuotes = quotes.filter((quote) => selected.includes(quote.marketplace));
  const current = visibleQuotes[0];
  const navigate = (next: number) => {
    setScene((next + SCENES.length) % SCENES.length);
    setInteraction((value) => value + 1);
  };

  useEffect(() => {
    const motion = window.matchMedia('(max-width: 900px) and (prefers-reduced-motion: no-preference)');
    let timeout: number | undefined;
    const schedule = () => {
      window.clearTimeout(timeout);
      if (motion.matches && !dragging) timeout = window.setTimeout(() => setScene((currentScene) => (currentScene + 1) % SCENES.length), [4500, 6500, 5000][scene]);
    };
    schedule();
    motion.addEventListener('change', schedule);
    return () => { window.clearTimeout(timeout); motion.removeEventListener('change', schedule); };
  }, [scene, interaction, dragging]);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timeouts: number[] = [];
    const selectAutomatically = () => {
      timeouts.forEach(window.clearTimeout);
      timeouts = [];
      if (motion.matches || scene === 2) { setSelected([...MARKETPLACE_LIST]); return; }
      setSelected([]);
      if (scene === 1) {
        timeouts = MARKETPLACE_LIST.map((key, index) => window.setTimeout(() => {
          setSelected((list) => [...list, key]);
        }, 800 + index * 1350));
      }
    };
    selectAutomatically();
    motion.addEventListener('change', selectAutomatically);
    return () => { timeouts.forEach(window.clearTimeout); motion.removeEventListener('change', selectAutomatically); };
  }, [scene]);

  useLayoutEffect(() => {
    if (scene !== 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      const tiles = cards.current[0]?.querySelectorAll('.lp-tile');
      if (tiles?.length) gsap.fromTo(tiles, { scale: 1 }, { scale: 1.04, duration: 0.22, stagger: 0.4, repeat: 1, yoyo: true, ease: 'power1.inOut', clearProps: 'transform' });
    });
    return () => ctx.revert();
  }, [scene]);

  useLayoutEffect(() => {
    const from = previous.current;
    previous.current = scene;
    if (!initialized.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cards.current.forEach((card, index) => { if (card) gsap.set(card, position(index, scene)); });
      initialized.current = true;
      return;
    }
    const timeline = gsap.timeline();
    cards.current.forEach((card, index) => {
      if (!card) return;
      const before = slot(index, from);
      const after = slot(index, scene);
      if (Math.abs(after - before) > 1) {
        timeline.set(card, { xPercent: after * 192, scale: 0.88, autoAlpha: 0 }, 0)
          .to(card, { ...position(index, scene), duration: 0.75, ease: 'expo.out', overwrite: true }, 0.15);
      } else {
        timeline.to(card, { ...position(index, scene), duration: 0.75, ease: 'expo.inOut', overwrite: true }, 0);
      }
    });
    return () => { timeline.kill(); };
  }, [scene]);

  return <section id="como-funciona" className="lp-mobile-demo" aria-labelledby="lp-mobile-demo-title">
    <header className="lp-demo-intro lp-md-intro">
      <span className="lp-mobile-eyebrow"><TypewriterText text="SIMPLES, DO INÍCIO AO RESULTADO" /></span>
      <h2 id="lp-mobile-demo-title"><TypewriterText text="Seu próximo preço começa aqui." /></h2>
      <p><TypewriterText text="Veja como seus custos se transformam em uma decisão de venda." /></p>
    </header>

    <div className="lp-markets lp-md-markets" role="group" aria-label="Marketplaces da demonstração">
      {MARKETPLACE_LIST.map((key) => <span className={`lp-chip${selected.includes(key) ? ' is-on' : ''}`} key={key} data-marketplace={key}>
        <i className="lp-check" aria-hidden="true" /><img src={`/calculator/brands/${key}.png`} alt="" />
        <span className="sr-only">{MARKETPLACES[key].name}: {selected.includes(key) ? 'selecionado' : 'não selecionado'}</span>
      </span>)}
    </div>

    <div className="lp-stage lp-md-stage" tabIndex={0} role="group" aria-roledescription="carrossel" aria-label={`Demonstração: ${SCENES[scene]}`}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); navigate(scene + (event.key === 'ArrowRight' ? 1 : -1)); }
      }}
      onPointerDown={(event) => { setDragging(true); gesture.current = { x: event.clientX, y: event.clientY }; event.currentTarget.setPointerCapture(event.pointerId); }}
      onPointerCancel={() => { setDragging(false); gesture.current = null; }}
      onPointerUp={(event) => {
        setDragging(false);
        if (!gesture.current) return;
        const dx = event.clientX - gesture.current.x;
        const dy = event.clientY - gesture.current.y;
        gesture.current = null;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) navigate(scene + (dx < 0 ? 1 : -1));
      }}>
      {SCENES.map((label, index) => <article key={label} ref={(element) => { cards.current[index] = element; }}
        className={`lp-card lp-md-panel${scene === index ? ' is-front' : ''}`} data-scene={index} aria-hidden={scene !== index}>
        <h3>{index === 2 ? 'Composição de custos' : index === 1 ? visibleQuotes.length === 1 ? `Resultado · ${MARKETPLACES[current.marketplace].name}` : 'Resultados por marketplace' : label}</h3>
        {index === 0 ? <>
          <div className="lp-tiles lp-md-product-grid">
            <div className="lp-tile"><span>Custo do Produto</span><b><AnimatedValue value={product.productCost} active={scene === 0} /></b></div>
            <div className="lp-tile"><span>Margem desejada</span><b><AnimatedValue value={product.margin} kind="integer" active={scene === 0} /><small>%</small></b></div>
            <div className="lp-tile"><span>Embalagem</span><b><AnimatedValue value={product.packagingCost} active={scene === 0} /></b></div>
          </div>
        </> : !visibleQuotes.length ? <p className="lp-md-empty">Preparando a comparação dos marketplaces…</p>
          : index === 2 ? <DemoCosts quote={current} active={scene === 2} />
          : visibleQuotes.length === 1 ? <div className="lp-md-single">
            <div className="lp-md-result-brand"><img src={`/calculator/brands/${current.marketplace}.png`} alt="" />{MARKETPLACES[current.marketplace].name}</div>
            <div className="lp-md-sale"><span>Preço de venda</span><strong><AnimatedValue value={current.result.salePrice} active={scene === 1} /></strong></div>
            <div className="lp-md-profit"><span>Lucro líquido</span><strong><AnimatedValue value={current.result.profit} active={scene === 1} /></strong></div>
            <div><span>Margem líquida</span><strong><AnimatedValue value={current.margin} kind="percent" active={scene === 1} /></strong></div>
          </div> : visibleQuotes.length === 2 ? <div className="lp-md-pair">{visibleQuotes.map((quote) => <div className="lp-md-pair-quote" key={quote.marketplace}>
            <div className="lp-md-result-brand"><img src={`/calculator/brands/${quote.marketplace}.png`} alt="" /><span>{MARKETPLACES[quote.marketplace].name}</span></div>
            <div className="lp-md-sale"><span>Preço de venda</span><strong><AnimatedValue value={quote.result.salePrice} active={scene === 1} /></strong></div>
            <div className="lp-md-profit"><span>Lucro líquido</span><strong><AnimatedValue value={quote.result.profit} active={scene === 1} /></strong></div>
            <div><span>Margem líquida</span><strong><AnimatedValue value={quote.margin} kind="percent" active={scene === 1} /></strong></div>
          </div>)}</div> : <table className="lp-md-table">
            <caption className="sr-only">Preços e lucro dos marketplaces selecionados</caption>
            <thead><tr><th scope="col">Canal</th><th scope="col">Preço</th><th scope="col">Lucro</th><th scope="col">Margem</th></tr></thead>
            <tbody>{visibleQuotes.map((quote) => <tr key={quote.marketplace}>
              <th scope="row"><img src={`/calculator/brands/${quote.marketplace}.png`} alt={MARKETPLACES[quote.marketplace].name} /></th>
              <td><strong><AnimatedValue value={quote.result.salePrice} active={scene === 1} /></strong></td>
              <td className="lp-md-profit"><AnimatedValue value={quote.result.profit} active={scene === 1} /></td>
              <td><AnimatedValue value={quote.margin} kind="percent" active={scene === 1} /></td>
            </tr>)}</tbody>
          </table>}
      </article>)}
    </div>

    <nav className="lp-md-navigation" aria-label="Navegar pela demonstração">
      <button type="button" aria-label="Etapa anterior da demonstração" onClick={() => navigate(scene - 1)}><ArrowLeft size={18} /></button>
      <div className="lp-dots">{SCENES.map((label, index) => <button type="button" key={label} aria-label={`Ver ${label.toLowerCase()} na demonstração`}
        aria-current={scene === index ? 'step' : undefined} onClick={() => navigate(index)}><i className={scene === index ? 'is-active' : ''} /></button>)}</div>
      <button type="button" aria-label="Próxima etapa da demonstração" onClick={() => navigate(scene + 1)}><ArrowRight size={18} /></button>
    </nav>
    <ol className="lp-steps lp-steps--compact lp-md-steps" aria-label="Como usar a calculadora">
      {STEP_TITLES.map((title, index) => <li key={title} className={`lp-step${scene === index ? ' is-active' : ''}`}>
        <button type="button" onClick={() => navigate(index)} aria-current={scene === index ? 'step' : undefined}>
          <span className="lp-step-index">{index + 1}</span><strong>{title}</strong>
          <i className="lp-step-bar" aria-hidden="true"><b style={{ transform: `scaleX(${scene === index ? 1 : 0})` }} /></i>
        </button>
      </li>)}
    </ol>
    <a className="lp-md-cta" href="/calculadora" onClick={(event) => { event.preventDefault(); onEnter(); }}>Calcular meu preço agora <ArrowRight size={18} /></a>
  </section>;
}
