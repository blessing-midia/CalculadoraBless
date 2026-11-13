import { useMemo, useState } from 'react';
import { MARKETPLACE_LIST } from '../domain/config/marketplaces';
import { calculateWorkspaceQuote, createCalculatorDraft, updateSharedExtra } from '../domain/workspace';
import type { ExtraCosts, MarketplaceSettings, ProductInputs } from '../domain/individual-calculator';
import type { MarketplaceKey } from '../domain/types';

/**
 * Versão pública do `useCalculatorWorkspace` do Hub.
 *
 * O cálculo (cotações, atualização de produto, ajustes, extras e frete) é o
 * mesmo do Hub, linha a linha. Ficou de fora só o que depende de login e
 * banco: salvar produto, histórico, projetos e abrir produto pela URL — que no
 * Hub também ficam desligados quando a calculadora é aberta fora de um projeto
 * (`canPersist: false`), que é exatamente a tela replicada aqui.
 */
export function useCalculatorWorkspace() {
  const [draft, setDraft] = useState(createCalculatorDraft);
  const [detail, setDetail] = useState<MarketplaceKey>('shopee');
  const [message, setMessage] = useState('');

  const quotes = useMemo(
    () =>
      MARKETPLACE_LIST.filter((key) => draft.selected.includes(key)).map((key) =>
        calculateWorkspaceQuote(
          key,
          draft.product,
          draft.extras[key],
          draft.settings,
          !!draft.sourceProductId,
          draft.shopeeSalePrice,
        ),
      ),
    [draft.product, draft.extras, draft.settings, draft.selected, draft.sourceProductId, draft.shopeeSalePrice],
  );
  const detailQuote = quotes.find((quote) => quote.marketplace === detail) ?? quotes[0];
  const updateProduct = <K extends keyof ProductInputs>(key: K, value: ProductInputs[K]) =>
    setDraft((current) => ({
      ...current,
      product: { ...current.product, [key]: value },
    }));
  const updateSetting = <K extends keyof MarketplaceSettings>(key: K, value: MarketplaceSettings[K]) =>
    setDraft((current) => ({
      ...current,
      settings: { ...current.settings, [key]: value },
    }));
  const updateMetadata = (key: 'name' | 'sku', value: string) =>
    setDraft((current) => ({ ...current, [key]: value }));
  const updateExtra = (key: Exclude<keyof ExtraCosts, 'shipping'>, value: number) =>
    setDraft((current) => ({
      ...current,
      extras: updateSharedExtra(current.extras, key, value),
    }));
  const updateShipping = (marketplace: MarketplaceKey, value: number) =>
    setDraft((current) => ({
      ...current,
      extras: {
        ...current.extras,
        [marketplace]: { ...current.extras[marketplace], shipping: value },
      },
    }));
  const toggleMarketplace = (marketplace: MarketplaceKey) =>
    setDraft((current) => ({
      ...current,
      selected: current.selected.includes(marketplace)
        ? current.selected.filter((key) => key !== marketplace)
        : [...current.selected, marketplace],
    }));

  return {
    canPersist: false,
    view: 'calculator' as 'calculator' | 'history',
    productLoading: false,
    productOpenError: '',
    draft,
    quotes,
    detailQuote,
    setDetail,
    message,
    setMessage,
    updateProduct,
    updateSetting,
    updateMetadata,
    updateExtra,
    updateShipping,
    toggleMarketplace,
  };
}
export type CalculatorWorkspaceController = ReturnType<typeof useCalculatorWorkspace>;
