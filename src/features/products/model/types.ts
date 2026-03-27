export type Category = 'Food' | 'Beverage' | 'Other';

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  isActive: boolean;
  updatedAt: string;
}

export interface ProductFilters {
  name?: string;
  category?: Category | '';
  isActive?: boolean | '';
}

export interface ProductQueryParams {
  page: number;
  pageSize: number;
  sortField: keyof Product;
  sortDirection: 'asc' | 'desc';
  filters: ProductFilters;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export type ApiResponse<T> = {
  isSuccess: boolean;
  message?: string;
  errors?: unknown;
  data: T;
};
