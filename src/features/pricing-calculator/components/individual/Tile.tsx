import type { ReactNode } from "react";

/** Superfície dos campos, compartilhada com o dropdown, que é um botão e não um label. */
export const TILE_SURFACE =
  "calc-tile min-w-0 rounded-phi-0 bg-(--calc-field) px-phi-1 py-phi-0 transition-shadow focus-within:ring-2 focus-within:ring-[#ff4c0c]/50";

export const TILE_LABEL = "truncate text-phi-0 font-medium text-(--calc-muted)";

interface TileProps {
  label: string;
  children: ReactNode;
  className?: string;
}

/** Moldura dos campos: rótulo pequeno em cima, valor grande embaixo. */
export function Tile({ label, children, className = "" }: TileProps) {
  return (
    <label
      className={`flex cursor-text flex-col gap-phi-n2 ${TILE_SURFACE} ${className}`}
    >
      <span className={TILE_LABEL}>{label}</span>
      {children}
    </label>
  );
}
