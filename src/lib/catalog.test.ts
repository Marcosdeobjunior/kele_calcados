import { describe, expect, it } from 'vitest';
import { SEED_PRODUCTS as P } from '../data/catalog';
import { EMPTY_FILTERS, filterProducts, searchProducts } from './catalog';
import { maskCep, parsePrice } from './format';
import { cycleSize, draftErrors, emptyDraft } from './productForm';

const names = (l: { name: string }[]) => l.map((p) => p.name);

describe('searchProducts', () => {
  it('ignora acentos e plural simples', () => {
    expect(names(searchProducts(P, 'botas'))).toEqual(['Bota Trilha', 'Bota Nina', 'Botinha Léo']);
    expect(names(searchProducts(P, 'sandalia infantil'))).toEqual(['Sandália Bia']);
    expect(searchProducts(P, '   ')).toEqual([]);
  });
});

describe('filterProducts', () => {
  it('filtra novidades', () => {
    expect(filterProducts(P, { cat: 'Novidades' }, EMPTY_FILTERS).every((p) => p.isNew)).toBe(true);
  });
  it('filtra departamento + subcategoria', () => {
    expect(names(filterProducts(P, { dept: 'Masculino', sub: 'Sociais' }, EMPTY_FILTERS))).toEqual(['Oxford Bento', 'Mocassim Davi']);
  });
  it('tamanho esgotado não conta', () => {
    // 44 está esgotado no Tênis Atlas
    expect(names(filterProducts(P, { cat: 'Tênis' }, { ...EMPTY_FILTERS, sizes: [44] }))).toEqual([]);
  });
  it('faixa de preço e ordenação', () => {
    const l = filterProducts(P, { cat: 'Todos' }, { sizes: [], price: 'gt300', sort: 'asc' });
    expect(l.map((p) => p.price)).toEqual([329.9, 359.9, 389.9]);
  });
});

describe('cadastro de produto', () => {
  it('cicla tamanho: não oferece → disponível → esgotado → não oferece', () => {
    let d = emptyDraft();
    d = { ...d, ...cycleSize(d, 37) };
    expect([d.sizes, d.off]).toEqual([[37], []]);
    d = { ...d, ...cycleSize(d, 37) };
    expect([d.sizes, d.off]).toEqual([[37], [37]]);
    d = { ...d, ...cycleSize(d, 37) };
    expect([d.sizes, d.off]).toEqual([[], []]);
  });
  it('valida nome, preço, cor e tamanho disponível', () => {
    expect(draftErrors(emptyDraft())).toEqual(['name', 'price', 'colors', 'sizes']);
    expect(draftErrors({ ...emptyDraft(), name: 'X', price: '1.189,90', colors: [['Preto', '#000']], sizes: [37] })).toEqual([]);
  });
  it('preço e CEP', () => {
    expect(parsePrice('1.189,90')).toBe(1189.9);
    expect(maskCep('01000000')).toBe('01000-000');
  });
});
