import React, { useMemo, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useReactTable, getCoreRowModel, createColumnHelper, ColumnDef, flexRender } from '@tanstack/react-table';

import { RootState } from '@store';

import { useProductsQuery } from '@features/products/api/productQueries';
import { setPage, setSort } from '@features/products/model/productSlice';
import { Product } from '@features/products/model/types';

import TableSkeleton from '@shared/components/TableSkeleton/TableSkeleton';

import { formatDate } from '@shared/utils';
import { handleApiError } from '@shared/utils/handleApiError';

interface ProductTableProps {
  onEdit: (product: Product) => void;
}

const columnHelper = createColumnHelper<Product>();

const ProductTable: React.FC<ProductTableProps> = ({ onEdit }) => {
  const dispatch = useDispatch();

  const { page, pageSize, sortField, sortDirection, filters, columnVisibility } = useSelector(
    (state: RootState) => state.productList
  );

  const { data, isLoading, isError, error } = useProductsQuery({
    page,
    pageSize,
    sortField,
    sortDirection,
    filters,
  });

  const productList = data?.data ?? [];
  const total = data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  const onHeaderClick = useCallback(
    (field: string) => {
      const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
      dispatch(setSort({ field, direction }));
    },
    [dispatch, sortField, sortDirection]
  );

  const handlePageChange = useCallback((newPage: number) => dispatch(setPage(newPage)), [dispatch]);

  useEffect(() => {
    if (isError) handleApiError(error, 'Failed to load products');
  }, [isError, error]);

  const renderActionsButtons = useCallback(
    (product: Product) => (
      <div className="flex gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(product);
          }}
          className="text-gray-500 hover:text-gray-700 transition-colors text-lg"
        >
          ✏️
        </button>
      </div>
    ),
    [onEdit]
  );

  const columns = useMemo<ColumnDef<Product>[]>(
    () =>
      [
        columnVisibility.name &&
          columnHelper.accessor('name', {
            header: () => (
              <div
                onClick={() => onHeaderClick('name')}
                className="cursor-pointer flex items-center gap-1 font-semibold"
              >
                Name{' '}
                {sortField === 'name' && <span className="text-gray-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
            ),
            cell: (info) => <span className="font-medium text-gray-900">{info.getValue()}</span>,
          }),

        columnVisibility.category &&
          columnHelper.accessor('category', {
            header: () => (
              <div
                onClick={() => onHeaderClick('category')}
                className="cursor-pointer flex items-center gap-1 font-semibold"
              >
                Category{' '}
                {sortField === 'category' && (
                  <span className="text-gray-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </div>
            ),
            cell: (info) => <span className="text-gray-700">{info.getValue()}</span>,
          }),

        columnVisibility.price &&
          columnHelper.accessor('price', {
            header: () => (
              <div
                onClick={() => onHeaderClick('price')}
                className="cursor-pointer flex items-center gap-1 font-semibold"
              >
                Price{' '}
                {sortField === 'price' && <span className="text-gray-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
              </div>
            ),
            cell: (info) => <span className="text-gray-900 font-medium">${info.getValue().toFixed(2)}</span>,
          }),

        columnVisibility.isActive &&
          columnHelper.accessor('isActive', {
            header: 'Status',
            cell: (info) => (
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${info.getValue() ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
              >
                {info.getValue() ? 'Active' : 'Inactive'}
              </span>
            ),
          }),

        columnVisibility.updatedAt &&
          columnHelper.accessor('updatedAt', {
            header: () => (
              <div
                onClick={() => onHeaderClick('updatedAt')}
                className="cursor-pointer flex items-center gap-1 font-semibold"
              >
                Updated{' '}
                {sortField === 'updatedAt' && (
                  <span className="text-gray-600">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </div>
            ),
            cell: (info) => <span className="text-gray-600">{formatDate(info.getValue())}</span>,
          }),

        columnHelper.display({
          id: 'actions',
          header: 'Actions',
          cell: (info) => renderActionsButtons(info.row.original),
        }),
      ].filter(Boolean) as ColumnDef<Product>[],
    [columnVisibility, sortField, sortDirection, onEdit, onHeaderClick]
  );

  const table = useReactTable({
    data: productList,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return <TableSkeleton rows={pageSize} columns={Object.values(columnVisibility).filter(Boolean).length + 1} />;
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-white shadow-sm h-full flex flex-col items-center justify-center gap-3 px-4">
        <svg className="h-12 w-12 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          />
        </svg>
        <p className="text-sm font-semibold text-gray-700">Failed to load products</p>
        <p className="text-xs text-gray-400">
          {error instanceof Error ? error.message : 'An unexpected error occurred'}
        </p>
      </div>
    );
  }

  const hasProducts = productList.length > 0;

  return (
    <div className="rounded-lg bg-white shadow-sm h-full flex flex-col overflow-hidden">
      {/* Load this section if no data available */}
      {!hasProducts ? (
        <div className="flex flex-col items-center justify-center flex-1 px-4">
          <svg className="mb-4 h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">No products found</h3>
          <p className="text-center text-sm text-gray-500">Try adjusting your filters or add a new product.</p>
        </div>
      ) : (
        <>
          {/* Scrollable table area */}
          <div className="flex-1 overflow-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onDoubleClick={() => onEdit(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 text-sm text-gray-900">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="shrink-0 flex items-center justify-center gap-4 border-t border-gray-200 bg-white px-6 py-4">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            <span className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{Math.min(page * pageSize, total)}</span>
              {' of '}
              <span className="font-semibold text-gray-900">{total}</span>
            </span>

            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= pageCount}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(ProductTable);
