import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { fetchProducts, createProduct, updateProduct } from './productApi';
import { PaginatedResponse, Product, ProductFilters } from '@features/products/model/types';
import { handleApiError } from '@shared/utils/handleApiError';

export const PRODUCTS_QUERY_KEY = ['products'];

export function useProductsQuery(options: {
  page: number;
  pageSize: number;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  filters: ProductFilters;
}) {
  const queryKey = [
    ...PRODUCTS_QUERY_KEY,
    options.page,
    options.pageSize,
    options.sortField,
    options.sortDirection,
    options.filters,
  ];

  return useQuery<PaginatedResponse<Product>>({
    queryKey,
    queryFn: () => fetchProducts(options),
    retry: 3,
    throwOnError: false,
  });
}

export function useCreateProductMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      toast.success('Product created successfully');
    },
    onError: (error) => handleApiError(error, 'Failed to create product'),
  });
}

export function useUpdateProductMutation() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      toast.success('Product updated successfully');
    },
    onError: (error) => handleApiError(error, 'Failed to update product'),
  });
}
