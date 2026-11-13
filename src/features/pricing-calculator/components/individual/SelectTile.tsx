import { useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";
import type { FieldOption } from "../../domain/config/individual-fields";
import { useDropdown } from "../../controllers/useDropdown";
import { useDropdownAnimation } from "../../controllers/useDropdownAnimation";
import { TILE_LABEL, TILE_SURFACE } from "./Tile";

interface SelectTileProps {
  label: string;
  value: string;
  options: FieldOption[];
  onChange: (value: string) => void;
}

const PLACEMENT_CLASS = { down: "origin-top", up: "origin-bottom" };

function optionClass(active: boolean, selected: boolean): string {
  const tone = active
    ? "bg-(--calc-field) text-(--calc-text)"
    : "text-(--calc-muted)";
  return `flex cursor-pointer items-center justify-between gap-phi-0 rounded-phi-0 px-phi-0 py-phi-0 text-phi-0 transition-colors ${tone} ${
    selected ? "font-semibold text-(--calc-text)" : ""
  }`;
}

export function SelectTile({
  label,
  value,
  options,
  onChange,
}: SelectTileProps) {
  const id = useId();
  const {
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
  } = useDropdown(options, value, onChange);
  useDropdownAnimation(open, placement, listRef);
  const optionId = (index: number) => `${id}-option-${index}`;

  useEffect(() => {
    if (open)
      listRef.current?.children[activeIndex]?.scrollIntoView({
        block: "nearest",
      });
  }, [open, activeIndex, listRef]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-activedescendant={open ? optionId(activeIndex) : undefined}
        onClick={toggle}
        onKeyDown={onKeyDown}
        className={`flex w-full cursor-pointer flex-col gap-phi-n2 text-left outline-none ${TILE_SURFACE}`}
      >
        <span className={TILE_LABEL}>{label}</span>
        <span className="flex w-full items-center justify-between gap-phi-n1 text-phi-1 font-semibold text-(--calc-text)">
          <span className="truncate">{options[selectedIndex]?.label}</span>
          <ChevronDown
            className={`size-phi-0 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      {typeof document !== "undefined" &&
        createPortal(
          <ul
            ref={listRef}
            id={`${id}-list`}
            role="listbox"
            aria-label={label}
            style={position}
            className={`calc-scroll hidden fixed z-50 overflow-y-auto rounded-phi-1 bg-(--calc-card) p-phi-n1 shadow-xl ring-1 ring-(--calc-line) ${PLACEMENT_CLASS[placement]}`}
          >
            {options.map((option, index) => (
              <li
                key={option.value}
                id={optionId(index)}
                role="option"
                aria-selected={index === selectedIndex}
                onPointerEnter={() => setActiveIndex(index)}
                onClick={() => choose(index)}
                className={optionClass(
                  index === activeIndex,
                  index === selectedIndex,
                )}
              >
                <span>{option.label}</span>
                {index === selectedIndex && (
                  <Check className="size-phi-0 shrink-0 text-[#ff4c0c]" />
                )}
              </li>
            ))}
          </ul>,
          document.body,
        )}
    </div>
  );
}
