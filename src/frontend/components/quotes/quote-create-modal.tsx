'use client';

import {type FormEvent, useState, } from 'react';
import type { CreateQuoteInput, QuoteInputItem, QuoteMetaDeal, QuoteMetaProduct, } from '../../modules/quotes/quotes.types';
import styles from './quotes-page.module.css';
import QuoteItemsEditor from './quote-items-editor';
import QuotePreview from './quote-preview';

interface QuoteCreateModalProps {
  deals: QuoteMetaDeal[];
  products: QuoteMetaProduct[];
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (
    input: CreateQuoteInput,
  ) => Promise<void>;
}

function createFirstItem(
  products: QuoteMetaProduct[],
): QuoteInputItem[] {
  if (products.length === 0) {
    return [];
  }

  return [
    {
      productId: products[0].productId,
      quantity: 1,
    },
  ];
}

export default function QuoteCreateModal({
  deals,
  products,
  isSubmitting,
  onClose,
  onSubmit,
}: QuoteCreateModalProps) {
  const [dealId, setDealId] = useState(
    deals[0]?.dealId ?? 0,
  );

  const [items, setItems] =
    useState<QuoteInputItem[]>(
      () => createFirstItem(products),
    );

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): void {
    event.preventDefault();

    void onSubmit({
      dealId,
      items,
    });
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <QuoteCreateHeader
          onClose={onClose}
          disabled={isSubmitting}
        />

        <form onSubmit={handleSubmit}>
          <DealField
            deals={deals}
            dealId={dealId}
            onChange={setDealId}
          />

          <QuoteItemsEditor
            items={items}
            products={products}
            onChange={setItems}
          />

          <QuotePreview
            items={items}
            products={products}
          />

          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy
            </button>

            <button
              type="submit"
              className={styles.primaryButton}
              disabled={
                isSubmitting ||
                dealId === 0 ||
                items.length === 0
              }
            >
              {isSubmitting
                ? 'Đang tạo...'
                : 'Tạo báo giá'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function QuoteCreateHeader({
  onClose,
  disabled,
}: {
  onClose: () => void;
  disabled: boolean;
}) {
  return (
    <div className={styles.modalHeader}>
      <div>
        <h2>Tạo báo giá</h2>
        <p>
          Chọn Deal và các sản phẩm
          cần báo giá.
        </p>
      </div>

      <button
        type="button"
        onClick={onClose}
        disabled={disabled}
      >
        ×
      </button>
    </div>
  );
}

function DealField({
  deals,
  dealId,
  onChange,
}: {
  deals: QuoteMetaDeal[];
  dealId: number;
  onChange: (dealId: number) => void;
}) {
  return (
    <div className={styles.formGroup}>
      <label>Deal</label>

      <select
        value={dealId}
        onChange={(event) =>
          onChange(
            Number(event.target.value),
          )
        }
      >
        {deals.map((deal) => (
          <option
            key={deal.dealId}
            value={deal.dealId}
          >
            {deal.dealCode} -{' '}
            {deal.dealName} -{' '}
            {deal.customer.fullName}
          </option>
        ))}
      </select>

      {deals.length === 0 && (
        <p className={styles.errorMessage}>
          Không có Deal ở giai đoạn
          Proposal hoặc Negotiation.
        </p>
      )}
    </div>
  );
}