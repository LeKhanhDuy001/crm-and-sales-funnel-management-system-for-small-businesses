import type { CreateProductInput, ProductListItem, UpdateProductInput } from '../../modules/products/products.types';
import CreateProductModal from './create-product-modal';
import EditProductModal from './edit-product-modal';
import ProductDetailModal from './product-detail-modal';

interface ProductModalState {
  selectedProduct: ProductListItem | null;
  editingProduct: ProductListItem | null;
  isCreateOpen: boolean;
  isSaving: boolean;
}

interface ProductModalActions {
  closeDetail: () => void;
  closeCreate: () => void;
  closeEdit: () => void;
  create: (input: CreateProductInput) => Promise<string | null>;
  update: (productId: number, input: UpdateProductInput) => Promise<string | null>;
}

interface ProductPageModalsProps {
  state: ProductModalState;
  actions: ProductModalActions;
}

export default function ProductPageModals({ state, actions }: ProductPageModalsProps) {
  return (
    <>
      <ProductDetailModal product={state.selectedProduct} onClose={actions.closeDetail} />

      <CreateProductModal
        isOpen={state.isCreateOpen}
        isSaving={state.isSaving}
        onClose={actions.closeCreate}
        onSubmit={actions.create}
      />

      {state.editingProduct && (
        <EditProductModal
          key={state.editingProduct.productId}
          product={state.editingProduct}
          isSaving={state.isSaving}
          onClose={actions.closeEdit}
          onSubmit={actions.update}
        />
      )}
    </>
  );
}