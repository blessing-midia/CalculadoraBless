import { useId, useLayoutEffect, useRef } from 'react';
import { AssessoriaLink } from '../components/AssessoriaLink';
import gsap from 'gsap';
import { wavePath } from '../components/buttonWave';

export function LandingButtons({ onEnter }: { onEnter: () => void }) {
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
    let navigating = false;
    const animate = (immediate = false, onComplete?: () => void) => {
      timeline?.kill();
      const isDiagnostic = current === diagnostic;
      const duration = immediate || motion.matches ? 0 : onComplete ? 0.38 : 0.65;
      timeline = gsap.timeline({ defaults: { duration, ease: 'sine.inOut', overwrite: 'auto' }, onComplete });
      timeline
        .to(calculateWave, { progress: isDiagnostic ? 1 : 0, onUpdate: drawCalculate }, 0)
        .to(diagnosticWave, { progress: isDiagnostic ? 1 : 0, onUpdate: drawDiagnostic }, duration * 0.1);
    };
    const select = (link: HTMLAnchorElement) => {
      if (navigating || current === link) return;
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
    const click = (event: MouseEvent) => {
      const link = (event.target as Element).closest('a');
      if (link !== calculate && link !== diagnostic) return;
      // Preserve open-in-new-tab/window shortcuts.
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      // Let the browser open the external URL directly. Its navigation must not
      // depend on a GSAP callback running after focus moves to another tab.
      if (link === diagnostic) {
        if (!navigating) {
          current = current === diagnostic ? calculate : diagnostic;
          group.dataset.highlight = current === diagnostic ? 'diagnostic' : 'calculate';
          animate();
        }
        return;
      }
      event.preventDefault();
      if (navigating) return;
      navigating = true;
      group.setAttribute('aria-busy', 'true');

      current = current === diagnostic ? calculate : diagnostic;
      group.dataset.highlight = current === diagnostic ? 'diagnostic' : 'calculate';
      animate(false, onEnter);
    };
    const updateMotion = () => {
      if (navigating) timeline?.progress(1);
      else animate(true);
    };
    animate(true);
    motion.addEventListener('change', updateMotion);
    calculate.addEventListener('pointerenter', showCalculate);
    diagnostic.addEventListener('pointerenter', showDiagnostic);
    group.addEventListener('pointerleave', reset);
    group.addEventListener('focusin', focus);
    group.addEventListener('focusout', blur);
    group.addEventListener('click', click);
    return () => {
      timeline?.kill();
      group.removeAttribute('aria-busy');
      motion.removeEventListener('change', updateMotion);
      calculate.removeEventListener('pointerenter', showCalculate);
      diagnostic.removeEventListener('pointerenter', showDiagnostic);
      group.removeEventListener('pointerleave', reset);
      group.removeEventListener('focusin', focus);
      group.removeEventListener('focusout', blur);
      group.removeEventListener('click', click);
    };
  }, [onEnter]);

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
      <a className="lp-cta" href="/calculadora" data-lp="cta">
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
