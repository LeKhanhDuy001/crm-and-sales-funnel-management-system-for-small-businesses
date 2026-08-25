import type { ProductsPagination, } from '../../modules/products/products.types';
import styles from './admin-products-page.module.css';

interface Props {
  pagination: ProductsPagination;
  onPageChange: (page: number,) => void;
}

export default function ProductPagination({pagination, onPageChange,}: Props) {
  if (pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div className={styles.pagination}>
      <button type="button" disabled={pagination.page <= 1}
        onClick={() => onPageChange(pagination.page - 1,)}
      >
        Trước
      </button>

      <span>
        Trang {pagination.page} /{' '}
        {pagination.totalPages}
      </span>

      <button type="button"
        disabled={pagination.page >= pagination.totalPages}
        onClick={() => onPageChange(pagination.page + 1,)}
      >
        Sau
      </button>
    </div>
  );
}