import type { CalculationMode } from '../../domain/types';
import { useSegmentIndicator } from '../../controllers/useSegmentAnimation';

interface SegmentedControlProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string>({ label, value, options, onChange }: SegmentedControlProps<T>) {
  const activeIndex = Math.max(0, options.findIndex((option) => option.value === value));
  const indicatorRef = useSegmentIndicator(activeIndex);
  // Largura de uma opção dentro do respiro interno (p-phi-n2 dos dois lados).
  const indicatorWidth = `calc((100% - 2 * var(--spacing-phi-n2)) / ${options.length})`;

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="relative grid auto-cols-fr grid-flow-col rounded-phi-0 bg-(--calc-field) p-phi-n2"
    >
      <span
        ref={indicatorRef}
        aria-hidden
        className="absolute inset-y-phi-n2 left-phi-n2 rounded-phi-n1 bg-(--calc-card) shadow-sm"
        style={{ width: indicatorWidth }}
      />
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
          className={`relative cursor-pointer rounded-phi-n1 px-phi-0 py-phi-n1 text-phi-0 font-medium transition-colors duration-300 ${
            value === option.value ? 'text-(--calc-text)' : 'text-(--calc-muted) hover:text-(--calc-text)'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

const MODE_OPTIONS: { value: CalculationMode; label: string }[] = [
  { value: 'margin', label: 'Definir margem' },
  { value: 'salePrice', label: 'Definir preço' },
];

export function ModeToggle({ mode, onChange }: { mode: CalculationMode; onChange: (mode: CalculationMode) => void }) {
  return <SegmentedControl label="Modo de cálculo" value={mode} options={MODE_OPTIONS} onChange={onChange} />;
}
