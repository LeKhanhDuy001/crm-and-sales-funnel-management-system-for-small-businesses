import type { Quote } from '../../modules/quotes/quotes.types';
import QuotesTable from './quotes-table';
import styles from './quotes-page.module.css';

interface QuotesContentProps {
  quotes: Quote[];
  isLoading: boolean;
  error: string;
  onView: (quote: Quote) => void;
  onEdit: (quote: Quote) => void;
  onConfirm: (quote: Quote) => void;
  onDelete: (quote: Quote) => void;
}

export default function QuotesContent({quotes, isLoading, error, onView, onEdit, onConfirm, onDelete,}: QuotesContentProps) {
  if (isLoading) {
    return (
      <p>
        Đang tải danh sách báo giá...
      </p>
    );
  }

  if (error) {
    return (
      <p className={styles.errorMessage}>
        {error}
      </p>
    );
  }

  if (quotes.length === 0) {
    return <p>Chưa có báo giá nào.</p>;
  }

  return (
    <QuotesTable
      quotes={quotes}
      onView={onView}
      onEdit={onEdit}
      onConfirm={onConfirm}
      onDelete={onDelete}
    />
  );
}