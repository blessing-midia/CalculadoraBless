import { useId, useLayoutEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { wavePath } from '@/components/buttonWave';

export function StepActions({ step, total, onNavigate }: { step: number; total: number; onNavigate: (step: number) => void }) {
  const root = useRef<HTMLDivElement>(null);
  const nextMask = useRef<SVGPathElement>(null);
  const backMask = useRef<SVGPathElement>(null);
  const navigate = useRef(onNavigate);
  const id = useId().replace(/:/g, '');
  const nextClip = `${id}-next`;
  const backClip = `${id}-back`;
  useLayoutEffect(() => { navigate.current = onNavigate; });

  useLayoutEffect(() => {
    const group = root.current!;
    const next = group.querySelector<HTMLButtonElement>('.cw-step-next')!;
    const back = group.querySelector<HTMLButtonElement>('.cw-step-back');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const progress = { value: 0 };
    let swapped = false;
    let busy = false;
    let tween: gsap.core.Tween | undefined;
    const draw = () => {
      nextMask.current?.setAttribute('d', wavePath(progress.value, true));
      backMask.current?.setAttribute('d', wavePath(progress.value, false));
    };
    const animate = (swap: boolean, done?: () => void) => {
      tween?.kill();
      swapped = swap;
      tween = gsap.to(progress, {
        value: swap ? 1 : 0,
        duration: motion.matches ? 0 : done ? 0.38 : 0.65,
        ease: 'sine.inOut',
        onUpdate: draw,
        onComplete: done,
      });
    };
    const highlight = (event: Event) => {
      if (busy) return;
      animate(!!back?.contains(event.target as Node));
    };
    const reset = () => { if (!busy) animate(!!back?.matches(':focus-visible')); };
    const click = (event: MouseEvent) => {
      const button = (event.target as Element).closest('button');
      if (!button || (button !== next && button !== back)) return;
      if (busy) return;
      busy = true;
      group.setAttribute('aria-busy', 'true');
      animate(!swapped, () => navigate.current(Number(button.dataset.destination)));
    };
    const updateMotion = () => {
      if (busy) tween?.progress(1);
      else { tween?.kill(); progress.value = swapped ? 1 : 0; draw(); }
    };
    group.addEventListener('pointerover', highlight);
    group.addEventListener('pointerleave', reset);
    group.addEventListener('focusin', highlight);
    group.addEventListener('focusout', reset);
    group.addEventListener('click', click);
    motion.addEventListener('change', updateMotion);
    return () => {
      tween?.kill();
      group.removeEventListener('pointerover', highlight);
      group.removeEventListener('pointerleave', reset);
      group.removeEventListener('focusin', highlight);
      group.removeEventListener('focusout', reset);
      group.removeEventListener('click', click);
      motion.removeEventListener('change', updateMotion);
    };
  }, []);

  return <div className="cw-mobile-step-actions cw-wave-actions" ref={root}>
    <svg className="cw-wave-definitions" width="0" height="0" aria-hidden="true"><defs>
      <clipPath id={nextClip} clipPathUnits="objectBoundingBox"><path ref={nextMask} d={wavePath(0, true)} /></clipPath>
      <clipPath id={backClip} clipPathUnits="objectBoundingBox"><path ref={backMask} d={wavePath(0, false)} /></clipPath>
    </defs></svg>
    {step > 0 && <button type="button" className="cw-step-back" data-destination={step - 1}>
      <span className="cw-button-wave" style={{ clipPath: `url(#${backClip})` }} aria-hidden="true" />
      <ArrowLeft size={17} /><span>Voltar</span>
    </button>}
    <button type="button" className="cw-step-next" data-destination={step < total - 1 ? step + 1 : 0}>
      <span className="cw-button-wave" style={{ clipPath: `url(#${nextClip})` }} aria-hidden="true" />
      <span>{step === total - 1 ? 'Revisar produto' : step === 1 ? 'Ver resultado' : 'Continuar'}</span><ArrowRight size={17} />
    </button>
  </div>;
}
