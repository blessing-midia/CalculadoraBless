import { useCallback, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import './calculator-loading.css';

export function CalculatorLoading({ onComplete }: { onComplete: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const videoMotion = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const icon = useRef<HTMLImageElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const finished = useRef(false);
  const exitMotion = useRef<gsap.core.Tween | null>(null);
  const complete = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    if (!root.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onComplete();
      return;
    }
    exitMotion.current = gsap.to(root.current.querySelectorAll('.cl-visual, .cl-copy > *'), {
      autoAlpha: 0,
      y: -10,
      duration: 0.22,
      stagger: 0.025,
      ease: 'power2.inOut',
      overwrite: true,
      onComplete,
    });
  }, [onComplete]);

  useLayoutEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches) { complete(); return; }
    finished.current = false;
    root.current?.focus({ preventScroll: true });
    const surface = canvas.current;
    const clip = video.current;
    const paint = surface?.getContext('2d', { alpha: false });
    let videoFrame: number | undefined;
    let animationFrame = 0;
    let hasVideoFrame = false;
    const poster = new Image();
    if (surface && paint && clip) {
      paint.fillStyle = '#fff';
      paint.fillRect(0, 0, surface.width, surface.height);
      const draw = (source: CanvasImageSource, width: number, height: number) => {
        // Paint an opaque raster, avoiding the browser's moving video compositor.
        // Crop decoder edges and keep a white matte in every displayed frame.
        paint.drawImage(source, 3, 3, width - 6, height - 6, 0, 0, surface.width, surface.height);
        paint.strokeStyle = '#fff';
        paint.lineWidth = 6;
        paint.strokeRect(0, 0, surface.width, surface.height);
      };
      poster.onload = () => { if (!hasVideoFrame) draw(poster, poster.naturalWidth, poster.naturalHeight); };
      poster.src = clip.poster;
      const render = () => {
        if (clip.readyState >= 2 && clip.videoWidth > 6 && clip.videoHeight > 6) {
          draw(clip, clip.videoWidth, clip.videoHeight);
          hasVideoFrame = true;
        }
      };
      if (typeof clip.requestVideoFrameCallback === 'function') {
        const nextFrame = () => {
          render();
          videoFrame = clip.requestVideoFrameCallback(nextFrame);
        };
        videoFrame = clip.requestVideoFrameCallback(nextFrame);
      } else {
        const nextFrame = () => { render(); animationFrame = requestAnimationFrame(nextFrame); };
        animationFrame = requestAnimationFrame(nextFrame);
      }
    }
    const ctx = gsap.context(() => {
      gsap.fromTo('.cl-content', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' });
      const exit = gsap.timeline({ delay: 0.12, onComplete: complete });
      exit.eventCallback('onUpdate', () => {
        const value = bar.current ? Number(gsap.getProperty(bar.current, 'scaleX')) : 0;
        progress.current?.setAttribute('aria-valuenow', String(Math.round(value * 100)));
      });
      exit
        .fromTo(videoMotion.current, { xPercent: 0 }, { xPercent: 100, force3D: false, duration: 1.4, ease: 'power1.in' }, 0)
        .to('.cl-copy > *', { autoAlpha: 0, y: -6, duration: 0.16, stagger: 0.02, ease: 'power2.inOut' }, 1.2)
        .fromTo(icon.current, { autoAlpha: 0, scale: 0.75, y: 12 }, {
          autoAlpha: 1, scale: 1, y: 0, duration: 0.36, ease: 'back.out(1.5)',
        }, 1.4)
        .to(icon.current, { scale: 1.03, duration: 0.18, ease: 'sine.inOut' }, 1.82)
        .to(icon.current, { autoAlpha: 0, scale: 1.1, y: -10, duration: 0.24, ease: 'power2.in' }, 2)
        .fromTo(bar.current, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'none' }, 0);
    }, root);
    // If autoplay is unavailable, the poster still slides out before the icon.
    void video.current?.play().catch(() => {});
    // Never block access on a slow connection, a stalled video or a browser policy.
    const timeout = window.setTimeout(complete, 3600);
    const reduce = () => { if (motion.matches) complete(); };
    motion.addEventListener('change', reduce);
    return () => {
      exitMotion.current?.kill();
      if (videoFrame !== undefined) clip?.cancelVideoFrameCallback(videoFrame);
      cancelAnimationFrame(animationFrame);
      poster.onload = null;
      clearTimeout(timeout);
      motion.removeEventListener('change', reduce);
      ctx.revert();
    };
  }, [complete]);

  return <div ref={root} className="cl-screen" tabIndex={-1} aria-label="Preparando calculadora">
    <div className="cl-content">
      <div className="cl-visual" aria-hidden="true">
        <div className="cl-video-stage">
          <div ref={videoMotion} className="cl-video-motion">
            <canvas ref={canvas} className="cl-video" width={720} height={400} />
            <video ref={video} className="cl-video-source" src="/landing/cris-loading.mp4?v=2" poster="/landing/cris-loading-poster.jpg?v=2"
              muted playsInline preload="auto" />
          </div>
        </div>
        <div className="cl-icon-stage">
          <img ref={icon} className="cl-calculator-icon" src="/icone-calculadora-hub-animado.webp" alt="" width={512} height={512} />
        </div>
      </div>
      <div className="cl-copy">
        <h1>Preparando sua calculadora</h1>
        <div ref={progress} className="cl-progress" role="progressbar" aria-label="Transição para a calculadora"
          aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
          <div ref={bar} className="cl-progress-fill" />
        </div>
      </div>
    </div>
  </div>;
}
