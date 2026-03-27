import { Product, PaginatedResponse, ProductFilters, ApiResponse } from '@features/products/model/types';
import urlDoc from '@features/products/api/urlDoc';

const buildQuery = (params: {
  page: number;
  pageSize: number;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  filters: ProductFilters;
}) => {
  const searchParams = new URLSearchParams();
  searchParams.append('page', String(params.page));
  searchParams.append('pageSize', String(params.pageSize));
  searchParams.append('sortField', params.sortField);
  searchParams.append('sortDirection', params.sortDirection);

  if (params.filters.name) searchParams.append('name', params.filters.name);
  if (params.filters.category) searchParams.append('category', params.filters.category);
  if (params.filters.isActive !== undefined && params.filters.isActive !== '') {
    searchParams.append('isActive', String(params.filters.isActive));
  }

  return searchParams;
};

export async function fetchProducts(params: {
  page: number;
  pageSize: number;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  filters: ProductFilters;
}): Promise<PaginatedResponse<Product>> {
  const url = `${urlDoc.getProducts.url}?${buildQuery(params).toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  const json: ApiResponse<{ rows: Product[]; total: number }> = await response.json();
  return {
    data: json.data.rows,
    total: json.data.total,
    page: params.page,
    pageSize: params.pageSize,
  };
}

export async function createProduct(payload: Omit<Product, 'id' | 'updatedAt'>): Promise<Product> {
  const response = await fetch(urlDoc.createProduct.url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Failed to create product: ${response.statusText}`);
  }

  const json: ApiResponse<Product> = await response.json();
  return json.data;
}

export async function updateProduct(payload: Product): Promise<Product> {
  const body: Product = { ...payload, updatedAt: new Date().toISOString() };
  const response = await fetch(`${urlDoc.updateProduct.url.replace(':id', payload.id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Failed to update product: ${response.statusText}`);
  }

  const json: ApiResponse<Product> = await response.json();
  return json.data;
}
