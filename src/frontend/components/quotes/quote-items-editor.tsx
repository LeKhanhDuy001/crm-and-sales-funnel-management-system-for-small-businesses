import type { QuoteInputItem, QuoteMetaProduct, } from '../../modules/quotes/quotes.types';
import styles from './quotes-page.module.css';

interface Props {
  items: QuoteInputItem[];
  products: QuoteMetaProduct[];
  onChange: (items: QuoteInputItem[],) => void;
}

export default function QuoteItemsEditor({items, products, onChange,}: Props) {
  function addItem(): void {
    const product = products[0];

    if (!product) {
      return;
    }

    onChange([...items, {
        productId: product.productId,
        quantity: 1,
      },
    ]);
  }

  function removeItem(index: number): void {
    onChange(items.filter((_, itemIndex) => itemIndex !== index,),);
  }

  function updateItem(index: number, value: QuoteInputItem,): void {
    onChange(items.map((item, itemIndex) => itemIndex === index ? value : item,),);
  }

  return (
    <div>
      <h3>Sản phẩm</h3>

      <div className={styles.quoteItems}>
        {items.map((item, index) => (
          <QuoteItemRow key={index} item={item} products={products}
            canRemove={items.length > 1}
            onChange={(value) => updateItem(index, value)}
            onRemove={() => removeItem(index)}
          />
        ))}
      </div>

      <button type="button" className={styles.secondaryButton} onClick={addItem}>
        + Thêm sản phẩm
      </button>
    </div>
  );
}

interface RowProps {
  item: QuoteInputItem;
  products: QuoteMetaProduct[];
  canRemove: boolean;
  onChange: (item: QuoteInputItem,) => void;
  onRemove: () => void;
}

function QuoteItemRow({item, products, canRemove, onChange, onRemove,}: RowProps) {
  return (
    <div className={styles.quoteItemRow}>
      <div>
        <label>Sản phẩm</label>

        <select value={item.productId}
          onChange={(event) => onChange({...item, productId: Number(event.target.value,),})}
        >
          {products.map((product) => (
            <option key={product.productId} value={product.productId}>
              {product.productName} -{' '}
              {product.price.toLocaleString('vi-VN',)}{' '}
              đ
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Số lượng</label>

        <input type="number" min="1" value={item.quantity}
          onChange={(event) => onChange({...item, quantity: Number(event.target.value,),})}
        />
      </div>

      <button type="button" className={styles.removeButton} disabled={!canRemove} onClick={onRemove}>
        Xóa
      </button>
    </div>
  );
}