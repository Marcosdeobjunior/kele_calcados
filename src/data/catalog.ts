import type { Color, Dept, PriceFilter, Product, ProductType, SortOrder, Payment } from '../types';

export const DEPTS: Record<Dept, { range: number[]; num: string; line: string; subs: ProductType[] }> = {
  Feminino: {
    range: [33, 34, 35, 36, 37, 38, 39, 40],
    num: '01',
    line: 'Do scarpin à rasteira, em couro legítimo — tamanhos 33 a 40.',
    subs: ['Tênis', 'Sandálias', 'Rasteiras', 'Scarpins', 'Botas'],
  },
  Masculino: {
    range: [37, 38, 39, 40, 41, 42, 43, 44],
    num: '02',
    line: 'Tênis, sociais, sandálias e botas — tamanhos 38 a 44.',
    subs: ['Tênis', 'Sociais', 'Sandálias', 'Botas'],
  },
  Infantil: {
    range: [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
    num: '03',
    line: 'Para os pequenos crescerem bem calçados — tamanhos 26 a 33.',
    subs: ['Tênis', 'Sandálias', 'Botas'],
  },
};
export const DEPT_NAMES = Object.keys(DEPTS) as Dept[];

export const CATS = ['Todos', 'Novidades', 'Tênis', 'Sandálias', 'Rasteiras', 'Botas', 'Sociais', 'Scarpins'] as const;
export type Cat = (typeof CATS)[number];

/** Cores pré-definidas no cadastro de produto. */
export const PRESET_COLORS: Color[] = [
  ['Preto', '#2a2725'], ['Branco', '#f0ede6'], ['Off-white', '#ece6da'], ['Caramelo', '#a8703a'],
  ['Café', '#5a3e2b'], ['Conhaque', '#8a5a2e'], ['Nude', '#d6b49a'], ['Vinho', '#6b2a2e'],
  ['Marinho', '#2f3a4d'], ['Rosé', '#d4a99a'], ['Dourado', '#c2a05a'], ['Verde musgo', '#5b6146'],
];

/** Tamanhos oferecidos no filtro (grade de 7 colunas). */
export const FILTER_SIZES = [26, 30, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44];

export const PRICES: [PriceFilter, string][] = [
  ['all', 'Todos'], ['lt150', 'Até R$ 150'], ['150-300', 'R$ 150–300'], ['gt300', 'Acima de R$ 300'],
];
export const SORTS: [SortOrder, string][] = [['rel', 'Relevância'], ['asc', 'Menor preço'], ['desc', 'Maior preço']];
export const PAYMENTS: Payment[] = ['Pix', 'Cartão (link)', 'Boleto'];
export const SEARCH_SUGGESTIONS = ['Tênis', 'Bota', 'Sandália infantil', 'Social masculino', 'Rasteira'];

/** Catálogo inicial (modo demonstração e seed do Supabase). Fotos: placeholders. */
export const SEED_PRODUCTS: Product[] = [
  { id: 'aurora', name: 'Scarpin Aurora', dept: 'Feminino', type: 'Scarpins', price: 249.9, isNew: true, colors: [['Nude', '#d6b49a'], ['Preto', '#2a2725'], ['Vinho', '#6b2a2e']], sizes: [33, 34, 35, 36, 37, 38, 39], off: [39], desc: 'Bico fino e salto de 7 cm em couro envernizado. Forro acolchoado e palmilha de memória — elegância que aguenta a noite inteira.' },
  { id: 'lis', name: 'Sandália Lis', dept: 'Feminino', type: 'Sandálias', price: 189.9, colors: [['Caramelo', '#a8703a'], ['Areia', '#d9c4a3']], sizes: [33, 34, 35, 36, 37, 38, 39, 40], off: [33], desc: 'Tiras finas em couro legítimo e salto bloco de 5 cm. Palmilha anatômica e sola antiderrapante para o dia todo.' },
  { id: 'flor', name: 'Rasteira Flor', dept: 'Feminino', type: 'Rasteiras', price: 119.9, colors: [['Dourado', '#c2a05a'], ['Off-white', '#ece6da']], sizes: [33, 34, 35, 36, 37, 38, 39], off: [], desc: 'Rasteira trançada à mão com aplique floral em couro. Leve, macia e com elástico no calcanhar.' },
  { id: 'atlas', name: 'Tênis Atlas', dept: 'Masculino', type: 'Tênis', price: 299.9, isNew: true, colors: [['Off-white', '#ece6da'], ['Preto', '#2a2725'], ['Verde musgo', '#5b6146']], sizes: [38, 39, 40, 41, 42, 43, 44], off: [44], desc: 'Tênis casual em couro macio com sola vulcanizada e palmilha removível. Combina com jeans, sarja e bermuda.' },
  { id: 'oxford', name: 'Oxford Bento', dept: 'Masculino', type: 'Sociais', price: 359.9, colors: [['Café', '#5a3e2b'], ['Preto', '#2a2725']], sizes: [38, 39, 40, 41, 42, 43], off: [38], desc: 'Oxford clássico em couro natural com costura aparente e solado de couro com taco de borracha.' },
  { id: 'trilha', name: 'Bota Trilha', dept: 'Masculino', type: 'Botas', price: 389.9, colors: [['Conhaque', '#8a5a2e'], ['Grafite', '#4a4745']], sizes: [38, 39, 40, 41, 42, 43, 44], off: [], desc: 'Bota cano curto em nobuck com solado tratorado. Firme na chuva, confortável na cidade.' },
  { id: 'nina', name: 'Bota Nina', dept: 'Feminino', type: 'Botas', price: 329.9, colors: [['Preto', '#2a2725'], ['Caramelo', '#a8703a']], sizes: [34, 35, 36, 37, 38, 39], off: [35], desc: 'Bota de cano médio em couro com zíper lateral e salto quadrado de 4 cm.' },
  { id: 'pipa', name: 'Tênis Pipa', dept: 'Infantil', type: 'Tênis', price: 139.9, isNew: true, colors: [['Azul', '#4f6b8a'], ['Rosa', '#d49a9a'], ['Branco', '#f0ede6']], sizes: [26, 27, 28, 29, 30, 31, 32, 33], off: [26], desc: 'Fecho em velcro para calçar sozinho, biqueira reforçada e sola flexível que acompanha cada pulo.' },
  { id: 'bia', name: 'Sandália Bia', dept: 'Infantil', type: 'Sandálias', price: 89.9, colors: [['Lavanda', '#a99bc2'], ['Caramelo', '#a8703a']], sizes: [26, 27, 28, 29, 30, 31, 32], off: [], desc: 'Sandália macia com tira ajustável e palmilha antiderrapante. Leve para o dia inteiro de brincadeira.' },
  { id: 'leo', name: 'Botinha Léo', dept: 'Infantil', type: 'Botas', price: 159.9, colors: [['Conhaque', '#8a5a2e']], sizes: [26, 27, 28, 29, 30, 31, 32, 33], off: [33], desc: 'Botinha em couro com elástico lateral e solado de borracha — pronta para o frio e a escola.' },
  { id: 'brisa', name: 'Tênis Brisa', dept: 'Feminino', type: 'Tênis', price: 229.9, colors: [['Branco', '#f0ede6'], ['Rosé', '#d4a99a']], sizes: [33, 34, 35, 36, 37, 38, 39, 40], off: [40], desc: 'Tênis leve em couro e tecido respirável, solado de EVA macio. Para caminhar a cidade sem pensar nos pés.' },
  { id: 'marina', name: 'Rasteira Marina', dept: 'Feminino', type: 'Rasteiras', price: 99.9, colors: [['Caramelo', '#a8703a'], ['Preto', '#2a2725']], sizes: [33, 34, 35, 36, 37, 38, 39], off: [], desc: 'Rasteira de tiras cruzadas em couro, com fivela ajustável no tornozelo.' },
  { id: 'mar', name: 'Sandália Mar', dept: 'Masculino', type: 'Sandálias', price: 149.9, colors: [['Café', '#5a3e2b'], ['Preto', '#2a2725']], sizes: [38, 39, 40, 41, 42, 43, 44], off: [38], desc: 'Sandália de tiras largas em couro com velcro e palmilha anatômica. Fim de semana com conforto.' },
  { id: 'davi', name: 'Mocassim Davi', dept: 'Masculino', type: 'Sociais', price: 279.9, isNew: true, colors: [['Conhaque', '#8a5a2e'], ['Marinho', '#2f3a4d']], sizes: [38, 39, 40, 41, 42, 43], off: [], desc: 'Mocassim em camurça com solado de borracha costurado. Do escritório ao jantar.' },
  { id: 'sol', name: 'Tênis Sol', dept: 'Infantil', type: 'Tênis', price: 119.9, colors: [['Amarelo', '#d9b44a'], ['Branco', '#f0ede6']], sizes: [26, 27, 28, 29, 30, 31, 32, 33], off: [], desc: 'Tênis com cadarço elástico e luzinha na sola. Fácil de calçar, difícil de tirar.' },
];
