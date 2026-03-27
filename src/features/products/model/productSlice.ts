import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductFilters } from './types';

interface productListState {
  page: number;
  pageSize: number;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  filters: ProductFilters;
  columnVisibility: Record<string, boolean>;
}

const initialState: productListState = {
  page: 1,
  pageSize: 10,
  sortField: 'name',
  sortDirection: 'asc',
  filters: {
    name: '',
    category: '',
    isActive: '',
  },
  columnVisibility: {
    id: true,
    name: true,
    category: true,
    price: true,
    isActive: true,
    updatedAt: true,
  },
};

const productSlice = createSlice({
  name: 'productList',
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setPageSize(state, action: PayloadAction<number>) {
      state.pageSize = action.payload;
    },
    setSort(state, action: PayloadAction<{ field: string; direction: 'asc' | 'desc' }>) {
      state.sortField = action.payload.field;
      state.sortDirection = action.payload.direction;
    },
    setFilters(state, action: PayloadAction<ProductFilters>) {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1;
    },
    setColumnVisibility(state, action: PayloadAction<Record<string, boolean>>) {
      state.columnVisibility = { ...state.columnVisibility, ...action.payload };
    },
  },
});

export const { setPage, setPageSize, setSort, setFilters, setColumnVisibility } = productSlice.actions;

export default productSlice.reducer;
