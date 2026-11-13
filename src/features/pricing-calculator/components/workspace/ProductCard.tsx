import type { CalculatorWorkspaceController } from '../../controllers/useCalculatorWorkspace';
import { ModeToggle } from '../individual/ModeToggle';
import { NumberTile } from '../individual/NumberTile';
import { EXTRA_COST_FIELDS } from '../../domain/config/individual-fields';
import ProductThumb from '@/components/ProductThumb';
import { formatCurrency } from '../../domain/formatters';

export function ProductCard({ calculator }: { calculator: CalculatorWorkspaceController }) {
  const { draft, updateProduct, updateMetadata } = calculator;
  const isMargin = draft.product.calculationMode === 'margin';
  const extraFields = [EXTRA_COST_FIELDS[2], EXTRA_COST_FIELDS[0], EXTRA_COST_FIELDS[1], EXTRA_COST_FIELDS[3]];
  return (
    <section className={`cw-card cw-product${calculator.canPersist ? '' : ' cw-product--simulation'}`} aria-labelledby="cw-product-title">
      <header className="cw-card-heading">
        <h2 id="cw-product-title">Produto</h2>
        {draft.shopeeSalePrice === undefined && (
          <ModeToggle
            mode={draft.product.calculationMode}
            onChange={(mode) => updateProduct('calculationMode', mode)}
          />
        )}
      </header>
      {calculator.canPersist && (
        <div className="cw-metadata">
          {draft.sourceImageUrl && (
            <ProductThumb productId={draft.sourceCatalogProductId ?? 0} stored={draft.sourceImageUrl} size="md" />
          )}
          <div className="cw-metadata-fields">
            <div className="cw-name-fields">
              <label className="cw-text-field">
                <span>Nome do produto</span>
                <input
                  aria-label="Nome do produto"
                  maxLength={160}
                  value={draft.name}
                  onChange={(event) => updateMetadata('name', event.target.value)}
                  placeholder="Nome do produto"
                />
              </label>
              <label className="cw-text-field">
                <span>SKU (opcional)</span>
                <input
                  aria-label="SKU"
                  maxLength={80}
                  value={draft.sku}
                  onChange={(event) => updateMetadata('sku', event.target.value)}
                  placeholder="SKU"
                />
              </label>
            </div>
          </div>
        </div>
      )}
      <div className="cw-primary-fields">
        <NumberTile
          label="Custo do Produto"
          value={draft.product.productCost}
          unit="R$"
          onChange={(value) => updateProduct('productCost', value)}
        />
        {draft.shopeeSalePrice !== undefined ? (
          <label className="cw-text-field">
            <span>Preço de venda na Shopee</span>
            <input
              aria-label="Preço de venda na Shopee"
              readOnly
              value={draft.shopeeSalePrice === null ? 'Indisponível' : formatCurrency(draft.shopeeSalePrice)}
            />
          </label>
        ) : (
          <NumberTile
            key={draft.product.calculationMode}
            label={isMargin ? 'Margem desejada' : 'Preço de venda'}
            value={isMargin ? draft.product.margin : draft.product.targetSalePrice}
            unit={isMargin ? '%' : 'R$'}
            onChange={(value) => (isMargin ? updateProduct('margin', value) : updateProduct('targetSalePrice', value))}
          />
        )}
        <NumberTile
          label="Embalagem"
          value={draft.product.packagingCost}
          unit="R$"
          onChange={(value) => updateProduct('packagingCost', value)}
        />
      </div>
      <div className="cw-extra-fields">
        {extraFields.map((field) => (
          <NumberTile
            key={field.key}
            label={field.label}
            value={draft.extras.shopee[field.key]}
            unit="%"
            onChange={(value) => calculator.updateExtra(field.key, value)}
          />
        ))}
      </div>
    </section>
  );
}
