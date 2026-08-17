import AdminRouteGuard from '../../../components/auth/admin-route-guard';
import AdminProductsPage from '../../../components/products/admin-products-page';

export default function ProductsPage() {
  return (<AdminRouteGuard><AdminProductsPage /></AdminRouteGuard>
  );
}