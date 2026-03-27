import { rest } from 'msw';
import ProductMockData from '../data/productMockData';
import { Product, ProductFilters } from '@features/products/model/types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/products';

let productStore = [...ProductMockData];

const applyFilters = (items: Product[], filters: ProductFilters): Product[] => {
  return items.filter((item) => {
    const nameMatch = filters.name ? item.name.toLowerCase().includes(filters.name.toLowerCase()) : true;
    const categoryMatch = filters.category ? item.category === filters.category : true;
    const isActiveMatch =
      filters.isActive !== undefined && filters.isActive !== '' ? item.isActive === Boolean(filters.isActive) : true;
    return nameMatch && categoryMatch && isActiveMatch;
  });
};

const applySort = (items: Product[], sortField: keyof Product, sortDirection: 'asc' | 'desc') => {
  return [...items].sort((a, b) => {
    const valueA = a[sortField];
    const valueB = b[sortField];

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    }

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    }

    if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {
      return sortDirection === 'asc' ? Number(valueA) - Number(valueB) : Number(valueB) - Number(valueA);
    }

    return 0;
  });
};

// Toggle this to call an error response from the GET /products endpoint
const ENABLE_API_ERROR = false;

export const productHandlers = [
  rest.get(BASE_URL, async (req, res, ctx) => {
    if (ENABLE_API_ERROR) {
      return res(
        ctx.delay(500),
        ctx.status(500),
        ctx.json({
          isSuccess: false,
          message: 'Server error',
          data: { rows: [], total: 0 },
        })
      );
    }

    const page = Number(req.url.searchParams.get('page') ?? 1);
    const pageSize = Number(req.url.searchParams.get('pageSize') ?? 10);
    const sortField = (req.url.searchParams.get('sortField') as keyof Product) ?? 'name';
    const sortDirection = (req.url.searchParams.get('sortDirection') as 'asc' | 'desc') ?? 'asc';
    const name = req.url.searchParams.get('name') ?? '';
    const category = (req.url.searchParams.get('category') as Product['category'] | null) ?? '';
    const isActiveParam = req.url.searchParams.get('isActive');
    const isActive = isActiveParam !== null ? isActiveParam === 'true' : '';

    const filtered = applyFilters(productStore, { name, category: category ?? '', isActive });
    const sorted = applySort(filtered, sortField, sortDirection);

    const start = (page - 1) * pageSize;
    const data = sorted.slice(start, start + pageSize);

    return res(
      ctx.delay(500),
      ctx.status(200),
      ctx.json({
        isSuccess: true,
        message: 'Products fetched successfully',
        data: {
          rows: data,
          total: filtered.length,
        },
      })
    );
  }),

  rest.post(BASE_URL, async (req, res, ctx) => {
    const body = (await req.json()) as Omit<Product, 'id' | 'updatedAt'>;
    const id = `product-${productStore.length + 1}-${Math.floor(Math.random() * 10000)}`;
    const now = new Date().toISOString();
    const created: Product = { ...body, id, updatedAt: now };
    productStore = [created, ...productStore];

    return res(
      ctx.delay(500),
      ctx.status(201),
      ctx.json({ isSuccess: true, message: 'Product created', data: created })
    );
  }),

  rest.put(`${BASE_URL}/:id`, async (req, res, ctx) => {
    const id = req.params.id as string;
    const body = (await req.json()) as Product;

    const existing = productStore.find((item) => item.id === id);
    if (!existing) {
      return res(
        ctx.delay(500),
        ctx.status(404),
        ctx.json({ isSuccess: false, message: 'Product not found', errors: null, data: null })
      );
    }

    const updated: Product = { ...existing, ...body, updatedAt: new Date().toISOString() };
    productStore = productStore.map((item) => (item.id === id ? updated : item));

    return res(
      ctx.delay(500),
      ctx.status(200),
      ctx.json({ isSuccess: true, message: 'Product updated', data: updated })
    );
  }),
];
