import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

/** Sequential view switch; the screens never overlap. Input edits do not run it. */
export function useCalculatorView(requested: "calculator" | "history") {
  const [displayed, setDisplayed] = useState(requested);
  const ref = useRef<HTMLDivElement>(null);
  const entering = useRef(false);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (requested !== displayed) {
      const tween = gsap.to(element, {
        opacity: reduced ? 1 : 0,
        x: reduced ? 0 : -10,
        duration: reduced ? 0 : 0.16,
        ease: "power2.in",
        onComplete: () => {
          entering.current = true;
          setDisplayed(requested);
        },
      });
      return () => {
        tween.kill();
      };
    }
    if (reduced) {
      gsap.set(element, { clearProps: "opacity,transform" });
      return;
    }
    if (!entering.current) return;
    entering.current = false;
    const tween = gsap.fromTo(
      element,
      { opacity: 0, x: 14 },
      {
        opacity: 1,
        x: 0,
        duration: 0.35,
        ease: "power3.out",
        clearProps: "opacity,transform",
      },
    );
    return () => {
      tween.kill();
      gsap.set(element, { clearProps: "opacity,transform" });
    };
  }, [requested, displayed]);
  return { ref, displayed, transitioning: displayed !== requested };
}
