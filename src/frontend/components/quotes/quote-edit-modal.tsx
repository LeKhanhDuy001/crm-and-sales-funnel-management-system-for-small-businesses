'use client';

import { useState, } from 'react';
import type { Quote, QuoteInputItem, QuoteMetaProduct, } from '../../modules/quotes/quotes.types';
import styles from './quotes-page.module.css';

interface QuoteEditModalProps {
  quote: Quote;
  products: QuoteMetaProduct[];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (items: QuoteInputItem[],) => Promise<void>;
}

export default function QuoteEditModal({
  quote,
  products,
  isSubmitting,
  onClose,
  onSubmit,
}: QuoteEditModalProps) {
  const [items, setItems] = useState<QuoteInputItem[]>(
    () =>
      quote.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
  );

  function updateItem(
    index: number,
    field: keyof QuoteInputItem,
    value: number,
  ): void {
    setItems((currentItems) =>
      currentItems.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value, } : item,
      ),
    );
  }

  function addItem(): void {
    const firstProduct = products[0];

    if (!firstProduct) {
      return;
    }

    setItems((currentItems) => [...currentItems, {
      productId: firstProduct.productId,
      quantity: 1,
    },
    ]);
  }

  function removeItem(index: number,): void {
    setItems((currentItems) => currentItems.filter((_, itemIndex) => itemIndex !== index,),);
  }

  async function handleSubmit(event: React.FormEvent,): Promise<void> {
    event.preventDefault();

    await onSubmit(items);
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div>
            <h2>
              Sửa {quote.quoteCode}
            </h2>

            <p>
              Deal: {quote.deal.dealName}
            </p>
          </div>

          <button type="button" onClick={onClose} disabled={isSubmitting}>
            ×
          </button>
        </div>

        <form onSubmit={(event) => { void handleSubmit(event); }}>
          <div className={styles.quoteItems}>
            {items.map(
              (item, index) => (
                <div key={`${item.productId}-${index}`} className={styles.quoteItemRow}>
                  <div>
                    <label>
                      Sản phẩm
                    </label>

                    <select value={item.productId}
                      onChange={(event) => updateItem(index, 'productId', Number(event.target.value,),)}
                    >
                      {products.map(
                        (product) => (
                          <option key={product.productId}
                            value={product.productId}
                          >
                            {product.productName}{' '}-{' '}
                            {product.price.toLocaleString('vi-VN',)}{' '}
                            đ
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  <div>
                    <label>
                      Số lượng
                    </label>

                    <input type="number" min="1" value={item.quantity}
                      onChange={(event) => updateItem(index, 'quantity', Number(event.target.value,),)
                      }
                    />
                  </div>

                  <button type="button" className={styles.removeButton}
                    onClick={() => removeItem(index)}
                    disabled={items.length <= 1}
                  >
                    Xóa
                  </button>
                </div>
              ),
            )}
          </div>

          <button type="button" className={styles.secondaryButton} onClick={addItem}>
            + Thêm sản phẩm
          </button>

          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </button>

            <button type="submit" className={styles.primaryButton}
              disabled={isSubmitting || items.length === 0}
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}