import { apiRequest } from '../../services/api';
import type {
  CreateProductInput,
  DeleteProductResponse,
  ProductCategoriesResponse,
  ProductListItem,
  ProductMutationResponse,
  ProductQuery,
  ProductsResponse,
  UpdateProductInput,
} from './products.types';

function buildProductQuery(query: ProductQuery,): string {
  const params = new URLSearchParams();

  if (query.search) {
    params.set('search', query.search,);
  }

  if (query.category) {
    params.set('category', query.category,);
  }

  if (query.status !== undefined) {
    params.set('status', String(query.status),);
  }

  if (query.page) {
    params.set('page', String(query.page),);
  }

  if (query.limit) {
    params.set('limit', String(query.limit),);
  }

  const value = params.toString();

  return value ? `?${value}` : '';
}

export function getProducts(accessToken: string, query: ProductQuery,) {
  return apiRequest<ProductsResponse>(
    `/products${buildProductQuery(query)}`,
    {
      accessToken,
    },
  );
}

export function getProductById(accessToken: string, productId: number,) {
  return apiRequest<ProductListItem>(
    `/products/${productId}`,
    {
      accessToken,
    },
  );
}

export function getProductCategories(accessToken: string,) {
  return apiRequest<ProductCategoriesResponse>(
    '/products/categories',
    {
      accessToken,
    },
  );
}

export function createProduct(accessToken: string, input: CreateProductInput,) {
  return apiRequest<ProductMutationResponse>(
    '/products',
    {
      method: 'POST',
      accessToken,
      body: input,
    },
  );
}

export function updateProduct(accessToken: string, productId: number, input: UpdateProductInput,) {
  return apiRequest<ProductMutationResponse>(
    `/products/${productId}`,
    {
      method: 'PATCH',
      accessToken,
      body: input,
    },
  );
}

export function deleteProduct(accessToken: string, productId: number,) {
  return apiRequest<DeleteProductResponse>(
    `/products/${productId}`,
    {
      method: 'DELETE',
      accessToken,
    },
  );
}