import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Desliza o indicador do controle segmentado até a opção ativa. As opções têm a
 * mesma largura, então basta `xPercent`: funciona em qualquer largura de tela
 * sem medir nada. Na montagem ele só se posiciona, sem animar.
 */
export function useSegmentIndicator(activeIndex: number) {
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const mounted = useRef(false);

  useLayoutEffect(() => {
    const indicator = indicatorRef.current;
    if (!indicator) return;
    const xPercent = activeIndex * 100;
    if (!mounted.current || prefersReducedMotion()) {
      mounted.current = true;
      gsap.set(indicator, { xPercent });
      return;
    }
    gsap.to(indicator, { xPercent, duration: 0.42, ease: 'power3.inOut' });
  }, [activeIndex]);

  return indicatorRef;
}

/** Entrada do conteúdo que troca junto com o modo (margem ↔ preço de venda). */
export function useSwapIn<T extends HTMLElement>(swapKey: string) {
  const ref = useRef<T>(null);
  const mounted = useRef(false);

  useLayoutEffect(() => {
    if (!mounted.current || !ref.current || prefersReducedMotion()) {
      mounted.current = true;
      return;
    }
    gsap.fromTo(
      ref.current,
      { autoAlpha: 0, y: 7.42, filter: 'blur(3px)' },
      { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.38, ease: 'power3.out', clearProps: 'filter' },
    );
  }, [swapKey]);

  return ref;
}
