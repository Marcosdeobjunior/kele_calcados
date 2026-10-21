import type { Color, Dept, Product, ProductType } from '../types';
import { parsePrice, priceToInput, slugify } from './format';

export type Draft = {
  name: string;
  dept: Dept;
  type: ProductType;
  price: string;
  desc: string;
  isNew: boolean;
  colors: Color[];
  sizes: number[];
  off: number[];
  photos: string[];
};

export type DraftError = 'name' | 'price' | 'colors' | 'sizes';

export const emptyDraft = (): Draft => ({
  name: '', dept: 'Feminino', type: 'Tênis', price: '', desc: '', isNew: true, colors: [], sizes: [], off: [], photos: [],
});

export const draftFromProduct = (p: Product): Draft => ({
  name: p.name,
  dept: p.dept,
  type: p.type,
  price: priceToInput(p.price),
  desc: p.desc,
  isNew: !!p.isNew,
  colors: p.colors.map((c) => [...c] as Color),
  sizes: [...p.sizes],
  off: [...p.off],
  photos: [...(p.photos ?? [])],
});

export function draftErrors(d: Draft): DraftError[] {
  const e: DraftError[] = [];
  if (!d.name.trim()) e.push('name');
  if (!(parsePrice(d.price) > 0)) e.push('price');
  if (!d.colors.length) e.push('colors');
  if (!d.sizes.some((n) => !d.off.includes(n))) e.push('sizes');
  return e;
}

/** Ciclo de um tamanho: não oferece → disponível → esgotado → não oferece. */
export function cycleSize(d: Draft, n: number): Pick<Draft, 'sizes' | 'off'> {
  const has = d.sizes.includes(n);
  const out = d.off.includes(n);
  if (!has) return { sizes: [...d.sizes, n], off: d.off };
  if (!out) return { sizes: d.sizes, off: [...d.off, n] };
  return { sizes: d.sizes.filter((x) => x !== n), off: d.off.filter((x) => x !== n) };
}

export function productFromDraft(d: Draft, id?: string): Product {
  const sizes = [...d.sizes].sort((a, b) => a - b);
  return {
    id: id || `${slugify(d.name)}-${Date.now().toString(36)}`,
    name: d.name.trim(),
    dept: d.dept,
    type: d.type,
    price: parsePrice(d.price),
    isNew: d.isNew,
    desc: d.desc.trim(),
    colors: d.colors,
    sizes,
    off: d.off.filter((n) => sizes.includes(n)),
    photos: d.photos,
  };
}
