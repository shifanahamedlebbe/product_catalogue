export const PRODUCTS_BASE = import.meta.env.VITE_API_BASE_URL || '/api/products';

type UrlDocType = Record<string, { url: string; type: 'get' | 'post' | 'put' | 'delete' }>;

const urlDoc: UrlDocType = {
  getProducts: { url: PRODUCTS_BASE, type: 'get' },
  createProduct: { url: PRODUCTS_BASE, type: 'post' },
  updateProduct: { url: `${PRODUCTS_BASE}/:id`, type: 'put' },
};

export default urlDoc;
