import type {ProductListItem,} from '../../modules/products/products.types';
import styles from './product-modal.module.css';

interface Props {
  product: ProductListItem | null;
  onClose: () => void;
}

function formatPrice(price: number | null,): string {
  if (price === null) {
    return 'Chưa có';
  }

  return new Intl.NumberFormat(
    'vi-VN',
    {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    },
  ).format(price);
}

export default function ProductDetailModal({product, onClose,}: Props) {
  if (!product) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Chi tiết sản phẩm</h2>

          <button type="button"
            className={styles.closeButton}
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className={styles.detailGrid}>
          <p>
            <strong>Mã:</strong>{' '}
            {product.productCode}
          </p>

          <p>
            <strong>Tên:</strong>{' '}
            {product.productName}
          </p>

          <p>
            <strong>Danh mục:</strong>{' '}
            {product.category ?? 'Không có'}
          </p>

          <p>
            <strong>Giá:</strong>{' '}
            {formatPrice(product.price)}
          </p>

          <p>
            <strong>Trạng thái:</strong>{' '}
            {product.status ? 'Đang hoạt động' : 'Ngừng hoạt động'}
          </p>

          <p>
            <strong>Mô tả:</strong>{' '}
            {product.description ??
              'Không có'}
          </p>
        </div>

        <div className={styles.footer}>
          <button type="button" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}