import { useId, useLayoutEffect, useRef, type MouseEvent } from 'react';
import { AssessoriaLink } from '../components/AssessoriaLink';
import gsap from 'gsap';

function wavePath(progress: number, remaining: boolean) {
  const x = -0.25 + progress * 1.5;
  const bend = Math.sin(progress * Math.PI) * 0.26;
  const edge = `M ${x} 0 C ${x + bend} 0.18 ${x - bend} 0.32 ${x} 0.5 C ${x + bend} 0.68 ${x - bend} 0.82 ${x} 1`;
  return `${edge} L ${remaining ? 1 : 0} 1 L ${remaining ? 1 : 0} 0 Z`;
}

export function LandingButtons({ onEnter }: { onEnter: (event: MouseEvent) => void }) {
  const root = useRef<HTMLDivElement>(null);
  const calculateMask = useRef<SVGPathElement>(null);
  const diagnosticMask = useRef<SVGPathElement>(null);
  const id = useId().replace(/:/g, '');
  const calculateClip = `${id}-calculate-wave`;
  const diagnosticClip = `${id}-diagnostic-wave`;

  useLayoutEffect(() => {
    const group = root.current;
    if (!group) return;
    const calculate = group.querySelector<HTMLAnchorElement>('.lp-cta')!;
    const diagnostic = group.querySelector<HTMLAnchorElement>('.lp-secondary')!;
    gsap.set(calculate, { clearProps: 'color' });
    const calculateWave = { progress: 0 };
    const diagnosticWave = { progress: 0 };
    const drawCalculate = () => calculateMask.current?.setAttribute('d', wavePath(calculateWave.progress, true));
    const drawDiagnostic = () => diagnosticMask.current?.setAttribute('d', wavePath(diagnosticWave.progress, false));
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let current = calculate;
    let timeline: gsap.core.Timeline | undefined;
    const animate = (immediate = false) => {
      timeline?.kill();
      const isDiagnostic = current === diagnostic;
      const duration = immediate || motion.matches ? 0 : 0.9;
      timeline = gsap.timeline({ defaults: { duration, ease: 'sine.inOut', overwrite: 'auto' } });
      timeline
        .to(calculateWave, { progress: isDiagnostic ? 1 : 0, onUpdate: drawCalculate }, 0)
        .to(diagnosticWave, { progress: isDiagnostic ? 1 : 0, onUpdate: drawDiagnostic }, duration * 0.1);
    };
    const select = (link: HTMLAnchorElement) => {
      if (current === link) return;
      current = link;
      group.dataset.highlight = link === diagnostic ? 'diagnostic' : 'calculate';
      animate();
    };
    const showCalculate = () => select(calculate);
    const showDiagnostic = () => select(diagnostic);
    const reset = () => select(diagnostic.matches(':focus-visible') ? diagnostic : calculate);
    const focus = (event: FocusEvent) => {
      select(diagnostic.contains(event.target as Node) ? diagnostic : calculate);
    };
    const blur = (event: FocusEvent) => {
      if (!group.contains(event.relatedTarget as Node | null)) showCalculate();
    };
    const updateMotion = () => animate(true);
    animate(true);
    motion.addEventListener('change', updateMotion);
    calculate.addEventListener('pointerenter', showCalculate);
    diagnostic.addEventListener('pointerenter', showDiagnostic);
    group.addEventListener('pointerleave', reset);
    group.addEventListener('focusin', focus);
    group.addEventListener('focusout', blur);
    return () => {
      timeline?.kill();
      motion.removeEventListener('change', updateMotion);
      calculate.removeEventListener('pointerenter', showCalculate);
      diagnostic.removeEventListener('pointerenter', showDiagnostic);
      group.removeEventListener('pointerleave', reset);
      group.removeEventListener('focusin', focus);
      group.removeEventListener('focusout', blur);
    };
  }, []);

  return (
    <div className="lp-buttons" ref={root}>
      <svg className="lp-wave-definitions" width="0" height="0" aria-hidden="true">
        <defs>
          <clipPath id={calculateClip} clipPathUnits="objectBoundingBox">
            <path ref={calculateMask} d={wavePath(0, true)} />
          </clipPath>
          <clipPath id={diagnosticClip} clipPathUnits="objectBoundingBox">
            <path ref={diagnosticMask} d={wavePath(0, false)} />
          </clipPath>
        </defs>
      </svg>
      <a className="lp-cta" href="/calculadora" onClick={onEnter} data-lp="cta">
        <span className="lp-button-wave" style={{ clipPath: `url(#${calculateClip})` }} aria-hidden="true" />
        <span>Calcular meu preço agora</span>
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
      <AssessoriaLink
        className="lp-secondary"
        decoration={<span className="lp-button-wave" style={{ clipPath: `url(#${diagnosticClip})` }} aria-hidden="true" />}
      />
    </div>
  );
}
