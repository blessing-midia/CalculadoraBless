import { useState } from "react";
import { formatDecimal, parseDecimalInput } from "../../domain/formatters";
import { Tile } from "./Tile";

interface NumberTileProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  unit: "R$" | "%";
  className?: string;
}

function formatValue(value: number, unit: NumberTileProps["unit"]): string {
  if (unit === "R$") return formatDecimal(value);
  return value.toLocaleString("pt-BR", { maximumFractionDigits: 2 });
}

export function NumberTile({
  label,
  value,
  onChange,
  unit,
  className,
}: NumberTileProps) {
  const [editing, setEditing] = useState<string | null>(null);
  const isCurrency = unit === "R$";

  const handleChange = (raw: string) => {
    const parsed = parseDecimalInput(raw);
    if (!parsed) return;
    setEditing(parsed.display);
    onChange(parsed.value);
  };

  return (
    <Tile label={label} className={className}>
      <span
        className={`flex items-baseline ${isCurrency ? "gap-phi-n1" : "gap-phi-n2"} text-phi-1 font-semibold text-(--calc-text) tabular-nums`}
      >
        {isCurrency && <span>R$</span>}
        <input
          type="text"
          aria-label={label}
          inputMode="decimal"
          value={editing ?? formatValue(value, unit)}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={(e) => e.target.select()}
          onBlur={() => setEditing(null)}
          // A regra global de `input[type=text]` dá largura cheia, borda e fonte
          // pequena; aqui o input precisa ter só a largura do número.
          className="w-auto min-w-[1ch] max-w-full field-sizing-content rounded-none border-0 bg-transparent p-0 text-phi-1 font-semibold text-(--calc-text) outline-none focus:outline-none"
        />
        {!isCurrency && <span>%</span>}
      </span>
    </Tile>
  );
}
