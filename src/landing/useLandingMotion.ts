import { useCallback, useLayoutEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function format(value: number, decimals: string) {
  const digits = Number(decimals) || 0;
  return value.toLocaleString('pt-BR', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

const nums = (scope: Element) => Array.from(scope.querySelectorAll<HTMLElement>('[data-lp="num"]'));

function zero(elements: HTMLElement[]) {
  elements.forEach((el) => (el.textContent = format(0, el.dataset.decimals ?? '0')));
}

function setFinal(elements: HTMLElement[]) {
  elements.forEach((el) => (el.textContent = format(Number(el.dataset.value) || 0, el.dataset.decimals ?? '0')));
}

/** Conta de 0 até `data-value` no texto de cada elemento, em cascata. */
function countUp(elements: HTMLElement[], duration: number, stagger = 0.12) {
  const tl = gsap.timeline();
  elements.forEach((el, index) => {
    const counter = { value: 0 };
    tl.to(
      counter,
      {
        value: Number(el.dataset.value) || 0,
        duration,
        ease: 'power2.out',
        onUpdate: () => {
          el.textContent = format(counter.value, el.dataset.decimals ?? '0');
        },
      },
      index * stagger,
    );
  });
  return tl;
}

/** Mesmos títulos do card de resultados da calculadora. */
const RESULT_TITLES = [
  'Resultados por marketplace',
  'Resultado · Shopee',
  'Resultados · 2 marketplaces',
  'Resultados · 3 marketplaces',
  'Resultados por marketplace',
];

/** Posição no baralho: 0 é o card da frente; os de trás aparecem só pela borda de cima. */
const DECK = [
  { y: 0, scale: 1, autoAlpha: 1, rotate: 0, zIndex: 3 },
  { y: -16, scale: 0.95, autoAlpha: 0.7, rotate: 0, zIndex: 2 },
  { y: -32, scale: 0.9, autoAlpha: 0.4, rotate: 0, zIndex: 1 },
];
const depth = (index: number, front: number, total: number) => (index - front + total) % total;

/**
 * Entrada da página e a demonstração em loop. Os três cards da calculadora se
 * revezam como um baralho, um por passo:
 * 1. Produto: os campos se preenchem;
 * 2. Resultados: os marketplaces são marcados um a um, fora do card, e o card
 *    se transforma a cada clique (destaque → dois blocos → tabela);
 * 3. Composição de custos: o gráfico se desenha arco por arco.
 */
export function useLandingMotion(root: RefObject<HTMLDivElement | null>) {
  const leaving = useRef(false);

  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    const q = gsap.utils.selector(element);
    const steps = q('[data-lp="step"]');
    const bars = q('[data-lp="bar"]');
    const cards = q('[data-lp="card"]');
    const [productCard, , compositionCard] = cards;
    const chips = q('[data-lp="chip"]');
    const tiles = q('[data-lp="tile"]');
    const rows = q('[data-lp="row"]') as HTMLElement[];
    const results = q('[data-lp="results"]')[0] as HTMLElement;
    const resultsHead = q('[data-lp="results-head"]')[0];
    const resultsTitle = q('[data-lp="results-title"]')[0] as HTMLElement;
    const arcs = q('[data-lp="arc"]');
    const legend = q('[data-lp="legend"]');
    const tileNums = nums(productCard);
    const donutNums = nums(compositionCard);
    const fullArc = (arc: Element) => `${(arc as SVGElement).dataset.dash} 100`;

    /** Mostra `count` marketplaces no card de resultados, com ou sem animação. */
    const applyLayout = (count: number) => {
      results.dataset.count = String(count);
      rows.forEach((row, i) => (row.hidden = i >= count));
      resultsTitle.textContent = RESULT_TITLES[count];
    };
    /**
     * Troca o layout dentro do card: o que está na tela sai rápido para cima,
     * o layout muda e as linhas entram em cascata já no lugar novo. O card
     * corta qualquer sobra (overflow: hidden), então nada aparece fora dele.
     */
    const showResults = (count: number, animate: boolean) => {
      if (!animate) {
        gsap.killTweensOf([...rows, resultsHead, resultsTitle]);
        gsap.set([...rows, resultsHead, resultsTitle], { clearProps: 'all' });
        applyLayout(count);
        return;
      }
      const before = rows.filter((row) => !row.hidden);
      const added = rows[count - 1];
      gsap
        .timeline()
        .to([...before, resultsHead, resultsTitle], { autoAlpha: 0, y: -10, duration: 0.2, ease: 'power2.in', stagger: 0.02 })
        .call(() => {
          applyLayout(count);
          before.forEach((row) => setFinal(nums(row)));
          zero(nums(added));
        })
        .fromTo(resultsTitle, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power3.out' })
        .fromTo(resultsHead, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, '<')
        .fromTo(
          rows.slice(0, count),
          { autoAlpha: 0, y: 16, scale: 0.97 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.07, ease: 'back.out(1.4)', clearProps: 'transform' },
          '<',
        )
        .add(countUp(nums(added), 0.8, 0.08), '<0.15');
    };

    /** Clique num marketplace: o chip afunda, a onda sai do check e ele marca. */
    const press = (chip: Element) => {
      const ripple = chip.querySelector('[data-lp="ripple"]');
      gsap
        .timeline()
        .to(chip, { scale: 0.9, duration: 0.12, ease: 'power2.out' })
        .call(() => chip.classList.add('is-on'))
        .to(chip, { scale: 1, duration: 0.55, ease: 'elastic.out(1, 0.45)' })
        .fromTo(ripple, { scale: 0, autoAlpha: 0.55 }, { scale: 3.2, autoAlpha: 0, duration: 0.7, ease: 'power2.out' }, 0.12);
    };

    if (reducedMotion()) {
      setFinal([...tileNums, ...nums(results), ...donutNums]);
      chips.forEach((chip) => chip.classList.add('is-on'));
      showResults(4, false);
      arcs.forEach((arc) => arc.setAttribute('stroke-dasharray', fullArc(arc)));
      steps.forEach((step) => step.classList.add('is-active'));
      cards.forEach((card, i) => gsap.set(card, DECK[depth(i, 1, cards.length)]));
      gsap.set(bars, { scaleX: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      cards.forEach((card, i) => gsap.set(card, DECK[depth(i, 0, cards.length)]));
      showResults(0, false);

      // Entrada da página.
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from(q('[data-lp="nav"]'), { y: -40, opacity: 0, duration: 0.7 })
        .from(q('[data-lp="rise"]'), { y: 28, opacity: 0, duration: 0.8, stagger: 0.08 }, 0.1)
        .from(q('[data-lp="demo"]'), { x: 60, opacity: 0, duration: 1, ease: 'expo.out' }, 0.25)
        .from(chips, { y: -14, opacity: 0, duration: 0.5, stagger: 0.06 }, 0.6)
        .from(q('[data-lp="marquee"]'), { y: 30, opacity: 0, duration: 0.7 }, 0.5);

      // Troca de card: o da frente sai para baixo e vai para o fundo; os outros sobem uma posição.
      const swap = (from: number, to: number) => {
        const tl = gsap.timeline();
        const leavingCard = cards[from];
        tl.set(leavingCard, { zIndex: 4 }).to(leavingCard, {
          y: 46,
          scale: 1.02,
          rotate: -2,
          autoAlpha: 0,
          duration: 0.45,
          ease: 'power2.in',
        });
        cards.forEach((card, i) => {
          if (i === from) return;
          const target = DECK[depth(i, to, cards.length)];
          tl.set(card, { zIndex: target.zIndex }, 0).to(
            card,
            { y: target.y, scale: target.scale, autoAlpha: target.autoAlpha, duration: 0.65, ease: 'power3.out' },
            0.18,
          );
        });
        const back = DECK[depth(from, to, cards.length)];
        tl.set(leavingCard, { zIndex: back.zIndex, y: back.y - 10, scale: back.scale, rotate: 0 }, 0.5).to(
          leavingCard,
          { y: back.y, autoAlpha: back.autoAlpha, duration: 0.4, ease: 'power2.out' },
          0.5,
        );
        return tl;
      };
      const activate = (index: number) => () =>
        steps.forEach((step, i) => step.classList.toggle('is-active', i === index));

      const PICK = 1.35; // tempo entre um clique e outro
      const demo = gsap.timeline({ repeat: -1, delay: 1.2 });
      demo
        .set(bars, { scaleX: 0 })
        .call(() => {
          zero(tileNums);
          chips.forEach((chip) => chip.classList.remove('is-on'));
          showResults(0, false);
        })
        // 1 — Produto
        .call(activate(0))
        .to(bars[0], { scaleX: 1, duration: 2.6, ease: 'none' }, '<')
        .fromTo(tiles, { scale: 1 }, { scale: 1.04, duration: 0.22, stagger: 0.45, yoyo: true, repeat: 1, ease: 'power1.inOut' }, '<0.3')
        .add(countUp(tileNums, 0.9, 0.45), '<')
        .addLabel('toResults', '>0.5')
        .add(swap(0, 1), 'toResults')
        .call(() => {
          arcs.forEach((arc) => arc.setAttribute('stroke-dasharray', '0 100'));
          zero(donutNums);
        }, undefined, 'toResults')
        .set(legend, { autoAlpha: 0, x: 10 }, 'toResults')
        // 2 — Marketplaces: um clique por vez, o card muda a cada seleção.
        .call(activate(1), undefined, 'toResults+=0.35')
        .to(bars[1], { scaleX: 1, duration: 0.6 + PICK * 4, ease: 'none' }, 'toResults+=0.35');
      chips.forEach((chip, i) => {
        const at = 0.8 + i * PICK;
        demo
          .call(() => press(chip), undefined, `toResults+=${at}`)
          .call(() => showResults(i + 1, true), undefined, `toResults+=${at + 0.15}`);
      });
      demo
        .addLabel('toComposition', `toResults+=${0.8 + PICK * 4 + 0.4}`)
        .add(swap(1, 2), 'toComposition')
        // 3 — Composição de custos
        .call(activate(2), undefined, 'toComposition+=0.35')
        .to(bars[2], { scaleX: 1, duration: 3.6, ease: 'none' }, 'toComposition+=0.35')
        .add(() => {
          arcs.forEach((arc, i) =>
            gsap.fromTo(
              arc,
              { attr: { 'stroke-dasharray': '0 100' } },
              { attr: { 'stroke-dasharray': fullArc(arc) }, duration: 0.7, delay: i * 0.12, ease: 'power3.out' },
            ),
          );
        }, 'toComposition+=0.55')
        .add(countUp(donutNums, 1.2), 'toComposition+=0.55')
        .to(legend, { autoAlpha: 1, x: 0, duration: 0.4, stagger: 0.07, ease: 'power2.out' }, 'toComposition+=0.7')
        .addLabel('toProduct', 'toComposition+=4.2')
        .add(swap(2, 0), 'toProduct')
        .to({}, { duration: 0.6 });

      // O CTA respira de leve para chamar o clique.
      gsap.to(q('[data-lp="cta"]'), { scale: 1.03, duration: 0.9, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 1.6 });
    }, element);

    return () => ctx.revert();
  }, [root]);

  /** Saída antes de abrir a calculadora. */
  const leave = useCallback(
    (done: () => void) => {
      const element = root.current;
      if (!element || leaving.current) return;
      leaving.current = true;
      if (reducedMotion()) {
        done();
        return;
      }
      const q = gsap.utils.selector(element);
      gsap
        .timeline({ defaults: { ease: 'power3.in' }, onComplete: done })
        .to(q('[data-lp="cta"]'), { scale: 0.94, duration: 0.12, ease: 'power2.out', overwrite: true })
        .to(q('[data-lp="cta"]'), { scale: 1.05, duration: 0.18, ease: 'power2.out' })
        .to(q('[data-lp="rise"]'), { y: -24, opacity: 0, duration: 0.35, stagger: 0.03 }, 0.15)
        .to(q('[data-lp="demo"]'), { y: -30, opacity: 0, duration: 0.45 }, 0.2)
        .to(q('[data-lp="nav"], [data-lp="marquee"]'), { opacity: 0, duration: 0.3 }, 0.3);
    },
    [root],
  );

  return { leave };
}
