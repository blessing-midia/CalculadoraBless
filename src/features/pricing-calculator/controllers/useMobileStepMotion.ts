import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

/** Animate the existing panels so moving between steps never resets form state. */
export function useMobileStepMotion(step: number) {
  const root = useRef<HTMLDivElement>(null);
  const previousStep = useRef(step);

  useLayoutEffect(() => {
    if (!root.current) return;
    const direction = step >= previousStep.current ? 1 : -1;
    previousStep.current = step;
    const media = gsap.matchMedia();

    media.add('(max-width: 820px) and (prefers-reduced-motion: no-preference)', () => {
      const panels = root.current!.querySelectorAll('.cw-mobile-intro, .cw-grid, .cw-mobile-step-actions, .cw-mobile-diagnostic');
      gsap.fromTo(panels,
        { opacity: 0, x: direction * 12, y: 6 },
        { opacity: 1, x: 0, y: 0, duration: 0.36, stagger: 0.045, ease: 'power3.out', clearProps: 'transform,opacity' },
      );
    }, root);

    // Revert on rapid navigation, desktop resize, reduced-motion changes and unmount.
    return () => media.revert();
  }, [step]);

  return root;
}
