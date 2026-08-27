'use client';

import { type FormEvent, useEffect, useState, } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '../../modules/auth/auth.storage';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProductCategories,
  getProducts,
  updateProduct,
} from '../../modules/products/products.service';
import type { CreateProductInput, ProductListItem, ProductsPagination, UpdateProductInput, } from '../../modules/products/products.types';
import AdminDashboardLayout from '../dashboard/admin-dashboard-layout';
import DashboardHeader from '../dashboard/dashboard-header';
import ProductFilters from './product-filters';
import ProductPagination from './product-pagination';
import ProductsTable from './products-table';
import styles from './admin-products-page.module.css';
import ProductPageModals from './product-page-modals';
import { getErrorMessage, handleLoadError, handleMutationError } from './product-page-errors';

const DEFAULT_PAGINATION: ProductsPagination = { page: 1, limit: 20, total: 0, totalPages: 0, };

export default function AdminProductsPage() {
  const router = useRouter();

  const [products, setProducts] = useState<ProductListItem[]>([]);

  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);

  const [searchInput, setSearchInput] = useState('');

  const [search, setSearch] = useState('');

  const [category, setCategory] = useState('');

  const [status, setStatus] = useState('');

  const [categories, setCategories] = useState<string[]>([]);

  const [page, setPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);

  const [isSaving, setIsSaving] = useState(false);

  const [error, setError] = useState('');

  const [refreshKey, setRefreshKey] = useState(0);

  const [selectedProduct, setSelectedProduct,] = useState<ProductListItem | null>(null,);

  const [editingProduct, setEditingProduct,] = useState<ProductListItem | null>(null,);

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const accessToken = getAccessToken();

      if (!accessToken) {
        router.replace('/login');
        return;
      }

      try {
        setIsLoading(true);
        setError('');

        const response = await getProducts(
          accessToken,
          {
            search: search || undefined,
            category: category || undefined,
            status: status === '' ? undefined : status === 'true',
            page,
            limit: 20,
          },
        );

        setProducts(response.data);

        setPagination(response.pagination,);
      } catch (caughtError) {
        handleLoadError(caughtError, router, setError,);
      } finally {
        setIsLoading(false);
      }
    }

    void loadProducts();
  }, [
    category,
    page,
    refreshKey,
    router,
    search,
    status,
  ]);

  useEffect(() => {
    async function loadCategories(): Promise<void> {
      const accessToken = getAccessToken();

      if (!accessToken) {
        return;
      }

      try {
        const response = await getProductCategories(accessToken,);

        setCategories(response.data);
      } catch {
        setCategories([]);
      }
    }

    void loadCategories();
  }, [refreshKey]);

  function handleSearch(event: FormEvent<HTMLFormElement>,): void {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  async function handleView(productId: number,): Promise<void> {
    const accessToken = getAccessToken();

    if (!accessToken) {
      router.replace('/login');
      return;
    }

    try {
      const product = await getProductById(accessToken, productId,);

      setSelectedProduct(product);
    } catch (caughtError) {
      window.alert(getErrorMessage(caughtError, 'Không thể tải chi tiết sản phẩm.',),);
    }
  }

  async function handleCreate(input: CreateProductInput,): Promise<string | null> {
    const accessToken = getAccessToken();

    if (!accessToken) {
      router.replace('/login');
      return null;
    }

    try {
      setIsSaving(true);

      const response = await createProduct(accessToken, input,);

      window.alert(response.message);
      setIsCreateOpen(false);
      refreshProducts();

      return null;
    } catch (caughtError) {
      return handleMutationError(caughtError, router,);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleUpdate(productId: number, input: UpdateProductInput,): Promise<string | null> {
    const accessToken = getAccessToken();

    if (!accessToken) {
      router.replace('/login');
      return null;
    }

    try {
      setIsSaving(true);

      const response = await updateProduct(accessToken, productId, input,);

      window.alert(response.message);
      setEditingProduct(null);
      refreshProducts();

      return null;
    } catch (caughtError) {
      return handleMutationError(caughtError, router,);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(product: ProductListItem,): Promise<void> {
    const confirmed = window.confirm(`Bạn có chắc muốn xóa "${product.productName}"?`,);

    if (!confirmed) {
      return;
    }

    const accessToken = getAccessToken();

    if (!accessToken) {
      router.replace('/login');
      return;
    }

    try {
      const response = await deleteProduct(accessToken, product.productId,);

      window.alert(response.message);
      refreshProducts();
    } catch (caughtError) {
      window.alert(getErrorMessage(caughtError, 'Không thể xóa sản phẩm.',),);
    }
  }

  function refreshProducts(): void {
    setRefreshKey((current) => current + 1,);
  }

  return (
    <AdminDashboardLayout activePage="products">
      <main className={styles.page}>
        <DashboardHeader title="Quản lý sản phẩm"
          description="Quản lý danh mục sản phẩm và dịch vụ trong hệ thống CRM."
        />

        <section className={styles.panel}>
          <div className={styles.panelHeader}>
            <div>
              <h2>Danh sách sản phẩm</h2>

              <p>
                Tổng cộng{' '}
                {pagination.total}{' '}
                sản phẩm
              </p>
            </div>
          </div>
          <ProductFilters
            searchInput={searchInput}
            category={category}
            status={status}
            categories={categories}
            onSearchInputChange={setSearchInput}
            onSearch={handleSearch}
            onCategoryChange={(value) => { setPage(1); setCategory(value); }}
            onStatusChange={(value) => { setPage(1); setStatus(value); }}
            onCreate={() => setIsCreateOpen(true)}
          />
          {isLoading ? (
            <p className={styles.empty}>
              Đang tải danh sách sản phẩm...
            </p>
          ) : error ? (
            <p className={styles.error}>
              {error}
            </p>
          ) : products.length === 0 ? (
            <p className={styles.empty}>
              Không tìm thấy sản phẩm phù hợp.
            </p>
          ) : (
            <>
              <ProductsTable products={products}
                onView={(productId) => { void handleView(productId,); }}
                onEdit={setEditingProduct}
                onDelete={(product) => { void handleDelete(product,); }}
              />
              <ProductPagination
                pagination={pagination}
                onPageChange={setPage}
              />
            </>
          )}
        </section>
      </main>
      <ProductPageModals
        state={{
          selectedProduct,
          editingProduct,
          isCreateOpen,
          isSaving,
        }}
        actions={{
          closeDetail: () => setSelectedProduct(null),
          closeCreate: () => setIsCreateOpen(false),
          closeEdit: () => setEditingProduct(null),
          create: handleCreate,
          update: handleUpdate,
        }}
      />
    </AdminDashboardLayout>
  );
}