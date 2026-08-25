export interface ProductListItem {
  productId: number;
  productCode: string;
  productName: string;
  category: string | null;
  price: number | null;
  description: string | null;
  status: boolean;
}

export interface ProductsPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductsResponse {
  data: ProductListItem[];
  pagination: ProductsPagination;
}

export interface ProductQuery {
  search?: string;
  category?: string;
  status?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateProductInput {
  productName: string;
  category?: string;
  price: number;
  description?: string;
  status?: boolean;
}

export interface UpdateProductInput {
  productName?: string;
  category?: string;
  price?: number;
  description?: string;
  status?: boolean;
}

export interface ProductMutationResponse {
  message: string;
  product: ProductListItem;
}

export interface DeleteProductResponse {
  message: string;
  mode: | 'deleted' | 'deactivated';
  productId?: number;
  product?: ProductListItem;
}

export interface ProductCategoriesResponse {
  data: string[];
}