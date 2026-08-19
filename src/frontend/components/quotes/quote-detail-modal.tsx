import { getQuoteStatusLabel } from '../../modules/quotes/quote-status';
import type { Quote } from '../../modules/quotes/quotes.types';
import styles from './quotes-page.module.css';

interface QuoteDetailModalProps {
  quote: Quote;
  onClose: () => void;
}

export default function QuoteDetailModal({quote, onClose,}: QuoteDetailModalProps) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <div>
            <h2>
              {quote.quoteCode}
            </h2>

            <p>
              {getQuoteStatusLabel(
                quote.status,
              )}
            </p>
          </div>

          <button type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.detailGrid}>
          <span>Deal</span>
          <strong>
            {quote.deal.dealName}
          </strong>

          <span>Khách hàng</span>
          <strong>
            {quote.customer.fullName}
          </strong>

          <span>Tổng tiền</span>
          <strong>
            {quote.totalAmount.toLocaleString(
              'vi-VN',
            )}{' '}
            đ
          </strong>
        </div>

        <h3>Sản phẩm</h3>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Sản phẩm</th>
              <th>SL</th>
              <th>Đơn giá</th>
              <th>Thành tiền</th>
            </tr>
          </thead>

          <tbody>
            {quote.items.map(
              (item) => (
                <tr key={item.quoteDetailId}>
                  <td>
                    {item.productName}
                  </td>

                  <td>
                    {item.quantity}
                  </td>

                  <td>
                    {item.unitPrice.toLocaleString(
                      'vi-VN',
                    )}{' '}
                    đ
                  </td>

                  <td>
                    {item.total.toLocaleString(
                      'vi-VN',
                    )}{' '}
                    đ
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}