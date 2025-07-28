import { Product } from '@/constants/data';
import { fakeProducts } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import { ProductTable } from './product-tables';
import { columns } from './product-tables/columns';

/**
 * Props for the ProductListingPage component
 */
type ProductListingPage = {};

/**
 * Server-side product listing page component with filtering and pagination
 * 
 * This component provides a complete product listing interface with:
 * - Server-side rendering for better SEO and performance
 * - Search parameter caching for consistent state management
 * - Filtering by product name and categories
 * - Pagination with configurable page size
 * - Integration with mock API for data fetching
 * - Responsive data table with sorting and filtering
 * 
 * The component uses Next.js App Router conventions and demonstrates
 * proper server-side data fetching with search parameter handling.
 * It fetches products based on URL search parameters and renders
 * them in a feature-rich data table.
 * 
 * @param props - Component props (currently empty)
 * 
 * @returns A server-rendered product listing with data table
 * 
 * @example
 * ```tsx
 * // Used in a Next.js page
 * export default function ProductsPage() {
 *   return <ProductListingPage />;
 * }
 * 
 * // URL examples that affect the listing:
 * // /products?page=2&perPage=20&name=laptop&category=electronics
 * ```
 */
export default async function ProductListingPage({}: ProductListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  const categories = searchParamsCache.get('category');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(categories && { categories: categories })
  };

  const data = await fakeProducts.getProducts(filters);
  const totalProducts = data.total_products;
  const products: Product[] = data.products;

  return (
    <ProductTable
      data={products}
      totalItems={totalProducts}
      columns={columns}
    />
  );
}
