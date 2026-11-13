import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import type { WorkspaceQuote } from "../domain/workspace";

export function useCostChartAnimation(rows: WorkspaceQuote["rows"]) {
  const ref = useRef<SVGGElement>(null);
  const initialized = useRef(false);
  useLayoutEffect(() => {
    if (!ref.current) return;
    const total = rows.reduce((sum, row) => sum + Math.max(0, row.value), 0);
    let offset = 0;
    const tweens: gsap.core.Tween[] = [];
    for (const row of rows) {
      const circle = [...ref.current.children].find(
        (element) => element.getAttribute("data-cost-key") === row.key,
      );
      if (!circle) continue;
      const share = total > 0 ? (Math.max(0, row.value) / total) * 100 : 0;
      const gap = Math.min(1.2, share * 0.3);
      const attr = {
        "stroke-dasharray": `${Math.max(0, share - gap)} 100`,
        "stroke-dashoffset": -(offset + gap / 2),
      };
      offset += share;
      if (
        !initialized.current ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      )
        gsap.set(circle, { attr });
      else
        tweens.push(
          gsap.to(circle, {
            attr,
            duration: 0.5,
            ease: "power3.out",
            overwrite: true,
          }),
        );
    }
    initialized.current = true;
    return () => {
      tweens.forEach((tween) => tween.kill());
    };
  }, [rows]);
  return ref;
}
