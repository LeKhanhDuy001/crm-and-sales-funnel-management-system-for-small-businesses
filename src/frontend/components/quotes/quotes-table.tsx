import type { Quote } from '../../modules/quotes/quotes.types';
import { canEditQuote, getQuoteStatusLabel,} from '../../modules/quotes/quote-status';
import styles from './quotes-page.module.css';

interface QuotesTableProps {
  quotes: Quote[];
  onView: (quote: Quote) => void;
  onEdit: (quote: Quote) => void;
  onConfirm: (quote: Quote) => void;
  onDelete: (quote: Quote) => void;
}

export default function QuotesTable({quotes, onView, onEdit, onConfirm, onDelete,}: QuotesTableProps) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Mã</th>
            <th>Deal</th>
            <th>Khách hàng</th>
            <th>Ngày báo giá</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {quotes.map((quote) => (
            <QuoteRow
              key={quote.quoteId}
              quote={quote}
              onView={onView}
              onEdit={onEdit}
              onConfirm={onConfirm}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface QuoteRowProps {
  quote: Quote;
  onView: (quote: Quote) => void;
  onEdit: (quote: Quote) => void;
  onConfirm: (quote: Quote) => void;
  onDelete: (quote: Quote) => void;
}

function QuoteRow({quote, onView, onEdit, onConfirm, onDelete,}: QuoteRowProps) {
  const editable = canEditQuote(quote.status);

  return (
    <tr>
      <td>{quote.quoteCode}</td>
      <td>{quote.deal.dealName}</td>
      <td>{quote.customer.fullName}</td>

      <td>
        {quote.quoteDate ? new Date(quote.quoteDate,).toLocaleDateString('vi-VN'): '-'}
      </td>

      <td>
        {quote.totalAmount.toLocaleString('vi-VN',)}{' '}
        đ
      </td>

      <td>
        {getQuoteStatusLabel(
          quote.status,
        )}
      </td>

      <td>
        <div className={styles.actions}>
          <button type="button" onClick={() => onView(quote)}>
            Chi tiết
          </button>

          {editable && (
            <>
              <button type="button" onClick={() => onEdit(quote)}>
                Sửa
              </button>

              <button type="button" onClick={() => onConfirm(quote)}>
                Xác nhận
              </button>

              <button type="button" className={styles.deleteButton}
                onClick={() => onDelete(quote)}
              >
                Xóa
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
}