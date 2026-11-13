import type { MarketplaceSettings } from '../individual-calculator';
import type { MarketplaceKey } from '../types';
import { AMAZON_CATEGORY_LABELS } from './amazon-categories';
import { MERCADO_LIVRE_CATEGORIES } from './ml-categories';

export interface FieldOption {
  value: string;
  label: string;
}

type SelectSettingKey = Exclude<keyof MarketplaceSettings, 'affiliates'>;

export type SettingField =
  | { kind: 'select'; key: SelectSettingKey; label: string; options: FieldOption[] }
  | { kind: 'percent'; key: 'affiliates'; label: string };

export interface MarketplaceFieldConfig {
  /** Nome curto para as abas do modal; nome e cor vêm de `MARKETPLACES`. */
  shortName: string;
  /** Rótulo do frete; ausente quando o marketplace não cobra frete do vendedor. */
  shippingLabel?: string;
  /** O primeiro campo também aparece no card principal. */
  settings: SettingField[];
}

const SELLER_TYPE_OPTIONS: FieldOption[] = [
  { value: 'cnpj', label: 'CNPJ' },
  { value: 'cpf', label: 'CPF' },
  { value: 'cpf_high_volume', label: 'CPF alto volume' },
];

const LISTING_TYPE_OPTIONS: FieldOption[] = [
  { value: 'classic', label: 'Clássico' },
  { value: 'premium', label: 'Premium' },
];

const AMAZON_PLAN_OPTIONS: FieldOption[] = [
  { value: 'prof', label: 'Profissional' },
  { value: 'ind', label: 'Individual' },
];

const ML_CATEGORY_OPTIONS: FieldOption[] = Object.entries(MERCADO_LIVRE_CATEGORIES).map(
  ([value, category]) => ({ value, label: category.label }),
);

const AMAZON_CATEGORY_OPTIONS: FieldOption[] = Object.entries(AMAZON_CATEGORY_LABELS).map(
  ([value, label]) => ({ value, label }),
);

export const MARKETPLACE_FIELDS: Record<MarketplaceKey, MarketplaceFieldConfig> = {
  shopee: {
    shortName: 'Shopee',
    settings: [{ kind: 'select', key: 'sellerType', label: 'Vendedor', options: SELLER_TYPE_OPTIONS }],
  },
  mercadoLivre: {
    shortName: 'M. Livre',
    shippingLabel: 'Frete ao cliente',
    settings: [
      { kind: 'select', key: 'listingType', label: 'Anúncio', options: LISTING_TYPE_OPTIONS },
      { kind: 'select', key: 'categoryKey', label: 'Categoria', options: ML_CATEGORY_OPTIONS },
    ],
  },
  tiktok: {
    shortName: 'TikTok',
    shippingLabel: 'Frete próprio',
    settings: [{ kind: 'percent', key: 'affiliates', label: 'Afiliados' }],
  },
  amazon: {
    shortName: 'Amazon',
    shippingLabel: 'Frete',
    settings: [
      { kind: 'select', key: 'plan', label: 'Plano', options: AMAZON_PLAN_OPTIONS },
      { kind: 'select', key: 'amazonCategory', label: 'Categoria', options: AMAZON_CATEGORY_OPTIONS },
    ],
  },
};

export const EXTRA_COST_FIELDS = [
  { key: 'ads', label: 'Ads ( ACOS )' },
  { key: 'promo', label: 'Ferramentas de marketing' },
  { key: 'tax', label: 'Imposto' },
  { key: 'other', label: 'Outros' },
] as const;
