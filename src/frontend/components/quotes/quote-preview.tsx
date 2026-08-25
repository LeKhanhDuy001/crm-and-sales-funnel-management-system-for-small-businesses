import type { QuoteInputItem, QuoteMetaProduct, } from '../../modules/quotes/quotes.types';
import styles from './quotes-page.module.css';

interface Props {
  items: QuoteInputItem[];
  products: QuoteMetaProduct[];
}

function getItemTotal(item: QuoteInputItem, products: QuoteMetaProduct[],): number {
  const product = products.find(
    (currentProduct) => currentProduct.productId === item.productId,
  );

  if (!product) {
    return 0;
  }

  return product.price * item.quantity;
}

export default function QuotePreview({items, products,}: Props) {
  const total = items.reduce((sum, item) => sum + getItemTotal(item, products,), 0,);

  return (
    <div className={styles.quoteTotal}>
      <span>Tổng dự kiến</span>

      <strong>
        {total.toLocaleString('vi-VN',)}{' '}
        đ
      </strong>
    </div>
  );
}