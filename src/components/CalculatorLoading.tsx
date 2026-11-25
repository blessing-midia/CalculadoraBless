import { useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';
import './calculator-loading.css';

export function CalculatorLoading({ onComplete }: { onComplete: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const finished = useRef(false);
  const complete = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches) { complete(); return; }
    finished.current = false;
    root.current?.focus({ preventScroll: true });
    const ctx = gsap.context(() => {
      gsap.fromTo('.cl-content', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
    }, root);
    let frame = 0;
    const update = () => {
      const clip = video.current;
      const value = clip && Number.isFinite(clip.duration) && clip.duration > 0 ? clip.currentTime / clip.duration : 0;
      if (bar.current) bar.current.style.transform = `scaleX(${Math.min(1, value)})`;
      progress.current?.setAttribute('aria-valuenow', String(Math.round(value * 100)));
      frame = requestAnimationFrame(update);
    };
    update();
    void video.current?.play().catch(complete);
    // Never block access on a slow connection, a stalled video or a browser policy.
    const timeout = window.setTimeout(complete, 7500);
    const reduce = () => { if (motion.matches) complete(); };
    motion.addEventListener('change', reduce);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
      motion.removeEventListener('change', reduce);
      ctx.revert();
    };
  }, [complete]);

  return <div ref={root} className="cl-screen" tabIndex={-1} aria-label="Preparando calculadora">
    <div className="cl-content">
      <img className="cl-brand" src="/landing/blessing-logo-black.png" alt="Blessing" width={190} height={58} />
      <video ref={video} className="cl-video" src="/landing/cris-loading.mp4" poster="/landing/cris-loading-poster.jpg"
        muted playsInline preload="auto" onEnded={complete} onError={complete} aria-hidden="true" />
      <div className="cl-copy">
        <span className="cl-eyebrow">DO CARRINHO AO LUCRO</span>
        <h1>Preparando sua calculadora</h1>
        <p>O Cris já está levando tudo para você.</p>
        <div ref={progress} className="cl-progress" role="progressbar" aria-label="Transição para a calculadora"
          aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
          <div ref={bar} className="cl-progress-fill" />
        </div>
        <button type="button" className="cl-skip" onClick={complete}>Ir para a calculadora</button>
      </div>
    </div>
  </div>;
}
