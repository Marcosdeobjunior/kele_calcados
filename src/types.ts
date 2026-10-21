export type Dept = 'Feminino' | 'Masculino' | 'Infantil';
export type ProductType = 'Tênis' | 'Sandálias' | 'Rasteiras' | 'Scarpins' | 'Botas' | 'Sociais';
export type Color = [name: string, hex: string];

export type Product = {
  id: string;
  name: string;
  dept: Dept;
  type: ProductType;
  price: number;
  isNew?: boolean;
  desc: string;
  colors: Color[];
  /** Tamanhos oferecidos. */
  sizes: number[];
  /** Tamanhos esgotados (subconjunto de `sizes`). */
  off: number[];
  photos?: string[];
};

export type CartItem = { productId: string; colorIndex: number; size: number; qty: number };

export type Order = { id: string; text: string; total: number; summary: string; createdAt: string };

export type PriceFilter = 'all' | 'lt150' | '150-300' | 'gt300';
export type SortOrder = 'rel' | 'asc' | 'desc';
export type Filters = { sizes: number[]; price: PriceFilter; sort: SortOrder };

export type DeliveryMode = 'entrega' | 'retirada';
export type Payment = 'Pix' | 'Cartão (link)' | 'Boleto';
export type CheckoutForm = {
  name: string;
  cep: string;
  street: string;
  num: string;
  comp: string;
  bairro: string;
  city: string;
};
