import type { SettingField } from '../../domain/config/individual-fields';
import type { MarketplaceSettings } from '../../domain/individual-calculator';
import { NumberTile } from './NumberTile';
import { SelectTile } from './SelectTile';

interface SettingTileProps {
  field: SettingField;
  settings: MarketplaceSettings;
  onChange: <K extends keyof MarketplaceSettings>(key: K, value: MarketplaceSettings[K]) => void;
}

/** Campo de configuração do marketplace, descrito em `MARKETPLACE_FIELDS`. */
export function SettingTile({ field, settings, onChange }: SettingTileProps) {
  if (field.kind === 'percent') {
    return (
      <NumberTile
        label={field.label}
        unit="%"
        value={settings[field.key]}
        onChange={(value) => onChange(field.key, value)}
      />
    );
  }

  return (
    <SelectTile
      label={field.label}
      value={settings[field.key]}
      options={field.options}
      onChange={(value) => onChange(field.key, value as MarketplaceSettings[typeof field.key])}
    />
  );
}
