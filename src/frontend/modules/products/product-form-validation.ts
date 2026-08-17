export interface ProductFormValues {
  productName: string;
  category: string;
  price: string;
  description: string;
  status: boolean;
}

export interface ProductFieldErrors {
  productName?: string;
  category?: string;
  price?: string;
  description?: string;
  form?: string;
}

export function validateProductForm(values: ProductFormValues,): ProductFieldErrors {
  const errors: ProductFieldErrors = {};

  const productName = values.productName.trim();

  if (!productName) {
    errors.productName = 'Tên sản phẩm không được để trống.';
  } else if (
    productName.length > 200
  ) {
    errors.productName = 'Tên sản phẩm không được vượt quá 200 ký tự.';
  }

  if (values.category.trim().length > 100) {
    errors.category = 'Danh mục không được vượt quá 100 ký tự.';
  }

  if (!values.price.trim()) {
    errors.price = 'Giá sản phẩm không được để trống.';
  } else {
    const price = Number(values.price);

    if (!Number.isFinite(price)) {
      errors.price = 'Giá sản phẩm phải là số.';
    } else if (price <= 0) {
      errors.price = 'Giá sản phẩm phải lớn hơn 0.';
    }
  }

  return errors;
}

export function hasProductErrors(errors: ProductFieldErrors,): boolean {
  return Object.keys(errors).length > 0;
}

export function mapProductServerError(message: string,): ProductFieldErrors {
  if (message.includes('Tên sản phẩm')) {
    return {productName: message,};
  }

  if (message.includes('Giá sản phẩm')) {
    return {price: message,};
  }

  if (message.includes('Danh mục')) {
    return {category: message,};
  }

  return {form: message,};
}