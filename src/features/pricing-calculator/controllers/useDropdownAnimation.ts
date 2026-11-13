import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import type { DropdownPlacement } from "./useDropdown";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Entrada e saída da lista com GSAP. A lista fica sempre montada, assim o
 * fechamento também anima; o `display` só volta a `none` quando ele termina,
 * para a lista fechada não ocupar espaço nem criar rolagem.
 */
export function useDropdownAnimation(
  open: boolean,
  placement: DropdownPlacement,
  listRef: RefObject<HTMLUListElement | null>,
) {
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const offset = placement === "down" ? -7.42 : 7.42; // phi-n1 em px
    const speed = prefersReducedMotion() ? 0 : 1;
    gsap.killTweensOf([list, list.children]);

    if (!open) {
      gsap.to(list, {
        autoAlpha: 0,
        y: offset / 2,
        scale: 0.98,
        duration: 0.14 * speed,
        ease: "power2.in",
        onComplete: () => gsap.set(list, { display: "none" }),
      });
      return;
    }
    gsap.set(list, { display: "block" });
    gsap.fromTo(
      list,
      { autoAlpha: 0, y: offset, scale: 0.96 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.24 * speed,
        ease: "power3.out",
      },
    );
    gsap.fromTo(
      list.children,
      { opacity: 0, y: offset / 2 },
      {
        opacity: 1,
        y: 0,
        duration: 0.2 * speed,
        stagger: 0.012 * speed,
        ease: "power2.out",
        delay: 0.04 * speed,
      },
    );
  }, [open, placement, listRef]);

  return listRef;
}
