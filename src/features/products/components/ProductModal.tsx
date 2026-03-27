import React from 'react';
import Modal from '@shared/components/Modal/Modal';
import { Product } from '@features/products/model/types';
import ProductForm, { ProductFormValues } from '@features/products/components/ProductForm';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ProductFormValues) => void;
  initialData?: Product | null;
  loading?: boolean;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSubmit, initialData, loading }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Product' : 'Create Product'}>
      {loading ? (
        <p className="p-4 text-center text-gray-500">Processing...</p>
      ) : (
        <ProductForm onSubmit={onSubmit} onCancel={onClose} initialData={initialData ?? null} />
      )}
    </Modal>
  );
};

export default React.memo(ProductModal);
