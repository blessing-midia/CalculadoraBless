import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import type { FieldOption } from "../domain/config/individual-fields";

/** Altura máxima da lista; abaixo disso de espaço, ela abre para cima. */
const LIST_MAX_HEIGHT = 348; // max-h-phi-7

export type DropdownPlacement = "down" | "up";

/** Abre, fecha e navega pelo teclado uma lista de opções. */
export function useDropdown(
  options: FieldOption[],
  value: string,
  onChange: (value: string) => void,
) {
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [position, setPosition] = useState<{
    left: number;
    top?: number;
    bottom?: number;
    width: number;
    maxHeight: number;
  }>({ left: 0, top: 0, width: 0, maxHeight: LIST_MAX_HEIGHT });
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<DropdownPlacement>("down");
  const [activeIndex, setActiveIndex] = useState(0);
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );

  useLayoutEffect(() => {
    if (!open) return;
    const updatePosition = () => {
      const rect = rootRef.current?.getBoundingClientRect();
      if (!rect) return;
      const below = window.innerHeight - rect.bottom - 16;
      const above = rect.top - 16;
      const nextPlacement =
        below >= Math.min(LIST_MAX_HEIGHT, options.length * 48 + 16) ||
        below >= above
          ? "down"
          : "up";
      const width = Math.min(Math.max(rect.width, 240), window.innerWidth - 16);
      setPlacement(nextPlacement);
      setPosition({
        left: Math.max(8, Math.min(rect.left, window.innerWidth - width - 8)),
        width,
        maxHeight: Math.max(
          0,
          Math.min(LIST_MAX_HEIGHT, nextPlacement === "down" ? below : above),
        ),
        ...(nextPlacement === "down"
          ? { top: rect.bottom + 8 }
          : { bottom: window.innerHeight - rect.top + 8 }),
      });
    };
    updatePosition();
    window.addEventListener("resize", updatePosition);
    document.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      document.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, options.length]);

  useEffect(() => {
    if (!open) return;
    const closeOnOutside = (event: PointerEvent) => {
      if (
        !rootRef.current?.contains(event.target as Node) &&
        !listRef.current?.contains(event.target as Node)
      )
        setOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutside);
    return () => document.removeEventListener("pointerdown", closeOnOutside);
  }, [open]);

  const show = () => {
    setActiveIndex(selectedIndex);
    setOpen(true);
  };

  const toggle = () => (open ? setOpen(false) : show());

  const choose = (index: number) => {
    onChange(options[index].value);
    setOpen(false);
  };

  const move = (step: number) => {
    if (!open) return show();
    setActiveIndex(
      (current) => (current + step + options.length) % options.length,
    );
  };

  const KEY_ACTIONS: Record<string, () => void> = {
    ArrowDown: () => move(1),
    ArrowUp: () => move(-1),
    Enter: () => (open ? choose(activeIndex) : show()),
    " ": () => (open ? choose(activeIndex) : show()),
    Escape: () => setOpen(false),
    Tab: () => setOpen(false),
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const action = KEY_ACTIONS[event.key];
    if (!action) return;
    if (event.key !== "Tab") event.preventDefault();
    // Dentro do modal, o Esc deve fechar só a lista, não o modal inteiro.
    if (event.key === "Escape" && open) event.stopPropagation();
    action();
  };

  return {
    rootRef,
    listRef,
    position,
    open,
    placement,
    activeIndex,
    selectedIndex,
    setActiveIndex,
    toggle,
    choose,
    onKeyDown,
  };
}
