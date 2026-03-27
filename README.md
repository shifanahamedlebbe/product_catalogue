# Product Catalogue (React + TypeScript)

## 🔹 Description

A React + TypeScript web application built with **TanStack Query**, **Redux Toolkit**, and **Tailwind CSS**.  
It allows users to **browse, search, create, and edit products with pagination, sorting, and filtering**, following a scalable domain-based architecture.

---

## Table of Contents

- [Architecture Decisions]
- [Folder structure]
- [Environment Setup]
- [Installation Steps]
- [Remarkable packages]
- [Code Style & Linting]
- [Environment Variables]
- [License]

---

## Architecture decisions

- Feature-based domain structure under `src/features/products`.
- `shared` for reusable components (TextInput, SelectInput, Button, Modal).
- Redux UI state in `features/products/model/productSlice.ts`: pagination, sorting, filters, column visibility.
- React Query handles server state and caching, no API data in Redux.
- Clean separation: `api/*` for networking; `components/*` for UI; `pages/*` for composition.
- Lazy loading with `React.lazy` + `Suspense` for `ProductTable` and `ProductModal`.
- `ErrorBoundary` handles runtime errors with graceful fallback.

---

## Folder structure

public/
src/
── app/ # store provider setup
── shared/ # components, hooks and utilities
── features/products/ # feature module
── mocks/ # MSW, handlers, mock data

---

## Environment Setup

- Node.js: >=24.x
- React: ^18.0.0
- TOOLS: VSCode, VITE

---

## Installation Steps

1. Clone the repository:

```bash
git clone https://github.com/shifanahamedlebbe/product_catalogue.git
cd product_catalogue
```

2. Install dependencies:

```bash
npm install
```

2. Run dev server:

```bash
npm run dev
```

---

## Remarkable packages

- MSW - (Mock Service Worker) is used in React to mock API requests at the network level, so your frontend behaves as if it’s talking to a real backend.
  > **Note:** The mock data generation helper function in `src/mocks/data/productMockData.ts` was generated with the assistance of AI.
- reduxjs/toolkit - state management tool
- tanstack/react-query - used in React to fetch, cache, and manage server data (API data) in a clean and efficient way.
- sonner - React library for toast notifications that allows you to easily show success, error, info, or custom messages in your app with minimal setup

---

## Code Style & Linting

- ESLint + Prettier integrated
- TypeScript enforced
- Domain-based folder structure
- Naming conventions:
  - Components: `PascalCase`

---

## Environment Variables

Create a `.env` file from `.env.dev`:

```env
VITE_API_BASE_URL=/api/products
```

---

## License

MIT © Asfath Shifan
