import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@store';

import { setFilters } from '@features/products/model/productSlice';
import { useCreateProductMutation, useUpdateProductMutation } from '@features/products/api/productQueries';

import Button from '@shared/components/Button/Button';
import TextInput from '@shared/components/TextInput/TextInput';
import SelectInput from '@shared/components/SelectInput/SelectInput';
import TableSkeleton from '@shared/components/TableSkeleton/TableSkeleton';
import useDebounce from '@shared/hooks/useDebounce';

import { Product, Category } from '@features/products/model/types';
import { ProductFormValues } from '@features/products/components/ProductForm';

const ProductTable = lazy(() => import('@features/products/components/ProductTable'));
const ProductModal = lazy(() => import('@features/products/components/ProductModal'));

const ProductPage: React.FC = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state: RootState) => state.productList);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [searchInput, setSearchInput] = useState(filters.name || '');
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    dispatch(setFilters({ name: debouncedSearch }));
  }, [debouncedSearch, dispatch]);

  const createProduct = useCreateProductMutation();
  const updateProduct = useUpdateProductMutation();

  const onFilterChange = useCallback(
    (payload: Partial<{ name: string; category: Category | ''; isActive: boolean | '' }>) => {
      dispatch(setFilters(payload));
    },
    [dispatch]
  );

  const handleSearchChange = useCallback((val: string) => setSearchInput(val), []);

  const handleOpenCreate = useCallback(() => {
    setEditProduct(null);
    setModalOpen(true);
  }, []);

  const handleOpenEdit = useCallback((product: Product) => {
    setEditProduct(product);
    setModalOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleSubmit = useCallback(
    async (values: ProductFormValues) => {
      if (editProduct) {
        await updateProduct.mutateAsync({ ...editProduct, ...values });
      } else {
        await createProduct.mutateAsync(values);
      }
      setModalOpen(false);
    },
    [createProduct, updateProduct, editProduct]
  );

  const handleResetFilters = useCallback(() => {
    setSearchInput('');
    dispatch(setFilters({ name: '', category: '', isActive: '' }));
  }, [dispatch]);

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      <div className="mx-auto max-w-7xl w-full flex flex-col flex-1 overflow-hidden px-4 pt-8 pb-4">
        <div className="mb-6 shrink-0 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            <p className="mt-1 text-gray-500">Manage your product inventory</p>
          </div>
          <Button onClick={handleOpenCreate} className="flex items-center gap-2">
            + Create New Product
          </Button>
        </div>

        <div className="mb-4 shrink-0 rounded-lg bg-white p-5 shadow-sm">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:items-end">
            <TextInput
              label="Search product..."
              placeholder="Search product..."
              value={searchInput}
              onChange={handleSearchChange}
            />
            <SelectInput
              label="All Categories"
              options={[
                { value: '', label: 'All Categories' },
                { value: 'Food', label: 'Food' },
                { value: 'Beverage', label: 'Beverage' },
                { value: 'Other', label: 'Other' },
              ]}
              value={filters.category || ''}
              onChange={(category) => onFilterChange({ category: category as Category | '' })}
            />
            <SelectInput
              label="Status"
              options={[
                { value: '', label: 'All' },
                { value: 'true', label: 'Active' },
                { value: 'false', label: 'Inactive' },
              ]}
              value={filters.isActive === '' || filters.isActive === undefined ? '' : String(filters.isActive)}
              onChange={(value) => {
                onFilterChange({ isActive: value === '' ? '' : value === 'true' });
              }}
            />
            <div className="flex justify-end">
              <button
                onClick={handleResetFilters}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Table — flex-1 style will fill remaining height, overflow-hidden means ProductTable controls its own scroll */}
        <div className="flex-1 overflow-hidden">
          <Suspense fallback={<TableSkeleton />}>
            <ProductTable onEdit={handleOpenEdit} />
          </Suspense>
        </div>

        {/* Modal for Create/Edit Product is lazily loaded with conditional check, which will prevent the modal bundle from being downloaded until opened */}
        {isModalOpen && (
          <Suspense>
            <ProductModal
              isOpen={isModalOpen}
              onClose={handleClose}
              onSubmit={handleSubmit}
              initialData={editProduct}
              loading={createProduct.isPending || updateProduct.isPending}
            />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
