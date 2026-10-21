import type { Cat } from '../data/catalog';
import type { Dept, Filters, Product } from '../types';
import { norm } from './format';

export const EMPTY_FILTERS: Filters = { sizes: [], price: 'all', sort: 'rel' };

export const countFilters = (f: Filters) => f.sizes.length + (f.price !== 'all' ? 1 : 0) + (f.sort !== 'rel' ? 1 : 0);

export const availableSizes = (p: Product) => p.sizes.filter((n) => !p.off.includes(n));

/** Lista da vitrine (por categoria) ou do departamento (por subcategoria), com filtros e ordenação. */
export function filterProducts(
  products: Product[],
  scope: { cat: Cat } | { dept: Dept; sub: string },
  f: Filters,
): Product[] {
  let list =
    'dept' in scope
      ? products.filter((p) => p.dept === scope.dept && (scope.sub === 'Todos' || p.type === scope.sub))
      : products.filter((p) => scope.cat === 'Todos' || (scope.cat === 'Novidades' ? p.isNew : p.type === scope.cat));
  if (f.sizes.length) list = list.filter((p) => availableSizes(p).some((n) => f.sizes.includes(n)));
  if (f.price === 'lt150') list = list.filter((p) => p.price < 150);
  if (f.price === '150-300') list = list.filter((p) => p.price >= 150 && p.price <= 300);
  if (f.price === 'gt300') list = list.filter((p) => p.price > 300);
  if (f.sort === 'asc') list = [...list].sort((a, b) => a.price - b.price);
  if (f.sort === 'desc') list = [...list].sort((a, b) => b.price - a.price);
  return list;
}

/** Busca que ignora acentos e plural simples ("botas" → "bota"). Todas as palavras precisam casar. */
export function searchProducts(products: Product[], q: string): Product[] {
  const words = norm(q.trim()).split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return products.filter((p) => {
    const hay = norm(`${p.name} ${p.dept} ${p.type}`);
    return words.every((w) => hay.includes(w.replace(/s$/, '')));
  });
}
