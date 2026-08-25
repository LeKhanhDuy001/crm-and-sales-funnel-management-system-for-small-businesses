import type { ProductListItem, } from '../../modules/products/products.types';
import styles from './admin-products-page.module.css';

interface Props {
  products: ProductListItem[];
  onView: (productId: number,) => void;
  onEdit: (product: ProductListItem,) => void;
  onDelete: (product: ProductListItem,) => void;
}

function formatPrice(value: number | null,): string {
  if (value === null) {
    return 'Chưa có';
  }

  return new Intl.NumberFormat(
    'vi-VN',
    {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    },
  ).format(value);
}

export default function ProductsTable({products, onView, onEdit, onDelete,}: Props) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Mã</th>
            <th>Tên sản phẩm</th>
            <th>Danh mục</th>
            <th>Giá</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.productId}>
              <td>
                {product.productCode}
              </td>

              <td>
                {product.productName}
              </td>

              <td>
                {product.category ??
                  'Không có'}
              </td>

              <td>
                {formatPrice(
                  product.price,
                )}
              </td>

              <td>
                {product.status ? 'Đang hoạt động' : 'Ngừng hoạt động'}
              </td>

              <td>
                <div className={styles.actions}>
                  <button type="button" onClick={() => onView(product.productId,)}>
                    Xem
                  </button>

                  <button type="button" onClick={() => onEdit(product)}>
                    Sửa
                  </button>

                  <button type="button" onClick={() => onDelete(product)}>
                    Xóa
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}