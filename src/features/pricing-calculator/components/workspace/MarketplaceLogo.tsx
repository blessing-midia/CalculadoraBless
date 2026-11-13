import type { MarketplaceKey } from "../../domain/types";
import { MARKETPLACES } from "../../domain/config/marketplaces";

export function MarketplaceLogo({
  marketplace,
}: {
  marketplace: MarketplaceKey;
}) {
  return (
    <img
      className="cw-logo"
      src={`/calculator/brands/${marketplace}.png`}
      alt=""
      aria-hidden="true"
      title={MARKETPLACES[marketplace].name}
    />
  );
}
