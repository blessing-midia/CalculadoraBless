import type { CSSProperties } from "react";
import type { CalculatorWorkspaceController } from "../../controllers/useCalculatorWorkspace";
import { MARKETPLACE_FIELDS } from "../../domain/config/individual-fields";
import {
  MARKETPLACES,
  MARKETPLACE_LIST,
} from "../../domain/config/marketplaces";
import { NumberTile } from "../individual/NumberTile";
import { SettingTile } from "../individual/SettingTile";
import { MarketplaceLogo } from "./MarketplaceLogo";

export function MarketplaceSettingsCard({
  calculator,
}: {
  calculator: CalculatorWorkspaceController;
}) {
  return (
    <section
      className="cw-card cw-settings"
      aria-labelledby="cw-settings-title"
    >
      <h2 id="cw-settings-title">Ajustes por marketplace</h2>
      <div
        className="cw-settings-list"
        data-count={calculator.draft.selected.length}
      >
        {MARKETPLACE_LIST.filter((key) =>
          calculator.draft.selected.includes(key),
        ).map((key) => {
          const config = MARKETPLACE_FIELDS[key];
          return (
            <div
              key={key}
              className="cw-settings-row"
              aria-label={`Ajustes ${MARKETPLACES[key].name}`}
              data-marketplace={key}
            >
              <MarketplaceLogo marketplace={key} />
              <div
                className="cw-settings-fields"
                style={{
                  "--cw-setting-columns": config.settings.length + (config.shippingLabel ? 1 : 0),
                } as CSSProperties}
              >
                {config.settings.map((field) => (
                  <SettingTile
                    key={field.key}
                    field={field}
                    settings={calculator.draft.settings}
                    onChange={calculator.updateSetting}
                  />
                ))}
                {config.shippingLabel && (
                  <NumberTile
                    label={config.shippingLabel}
                    unit="R$"
                    value={calculator.draft.extras[key].shipping}
                    onChange={(value) => calculator.updateShipping(key, value)}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
      {!calculator.draft.selected.length && (
        <p className="cw-empty">Selecione um marketplace para ajustar.</p>
      )}
    </section>
  );
}
