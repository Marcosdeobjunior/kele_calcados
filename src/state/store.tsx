import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Cat } from '../data/catalog';
import type { CartItem, CheckoutForm, DeliveryMode, Filters, Order, Payment, Product } from '../types';
import { backend } from '../services/backend';
import { load, save } from '../lib/storage';
import { EMPTY_FILTERS } from '../lib/catalog';
import { cartLines, type CartLine } from '../lib/order';

type Toast = { msg: string; withCart: boolean } | null;

export const EMPTY_FORM: CheckoutForm = { name: '', cep: '', street: '', num: '', comp: '', bairro: '', city: '' };

type Store = {
  products: Product[];
  loading: boolean;
  loadError: boolean;
  reloadProducts(): Promise<void>;
  saveProduct(p: Product): Promise<void>;
  deleteProduct(id: string): Promise<void>;

  cart: CartItem[];
  lines: CartLine[];
  addToCart(productId: string, colorIndex: number, size: number): void;
  changeQty(item: CartItem, delta: number): void;
  removeFromCart(item: CartItem): void;
  clearCart(): void;

  orders: Order[];
  addOrder(o: Order): void;

  owner: boolean;
  /** false até a sessão salva ser verificada. */
  authReady: boolean;
  signIn(email: string, password: string): Promise<boolean>;
  signOut(): Promise<void>;

  toast: Toast;
  flash(msg: string, withCart?: boolean): void;
  dismissToast(): void;

  /** Estado de UI compartilhado entre telas. */
  cat: Cat;
  setCat(c: Cat): void;
  filters: Filters;
  setFilters(f: Filters): void;
  query: string;
  setQuery(q: string): void;
  form: CheckoutForm;
  setForm(f: CheckoutForm): void;
  delivery: DeliveryMode;
  setDelivery(d: DeliveryMode): void;
  payment: Payment;
  setPayment(p: Payment): void;
};

const Ctx = createContext<Store | null>(null);

const sameItem = (a: CartItem, b: CartItem) =>
  a.productId === b.productId && a.colorIndex === b.colorIndex && a.size === b.size;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [cart, setCart] = useState<CartItem[]>(() => load('kele-cart', []));
  const [orders, setOrders] = useState<Order[]>(() => load('kele-orders', []));
  const [owner, setOwner] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const [cat, setCat] = useState<Cat>('Todos');
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [query, setQuery] = useState('');
  const [form, setForm] = useState<CheckoutForm>(EMPTY_FORM);
  const [delivery, setDelivery] = useState<DeliveryMode>('entrega');
  const [payment, setPayment] = useState<Payment>('Pix');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const reloadProducts = useCallback(async () => {
    try {
      setProducts(await backend.listProducts());
      setLoadError(false);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reloadProducts();
    backend
      .isOwner()
      .then(setOwner, () => setOwner(false))
      .finally(() => setAuthReady(true));
  }, [reloadProducts]);

  useEffect(() => save('kele-cart', cart), [cart]);
  useEffect(() => save('kele-orders', orders), [orders]);

  const flash = useCallback((msg: string, withCart = false) => {
    clearTimeout(timer.current);
    setToast({ msg, withCart });
    timer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const value = useMemo<Store>(
    () => ({
      products, loading, loadError, reloadProducts,
      async saveProduct(p) {
        await backend.saveProduct(p);
        await reloadProducts();
      },
      async deleteProduct(id) {
        await backend.deleteProduct(id);
        setCart((c) => c.filter((i) => i.productId !== id));
        await reloadProducts();
      },

      cart,
      lines: cartLines(cart, products),
      addToCart(productId, colorIndex, size) {
        const item = { productId, colorIndex, size, qty: 1 };
        setCart((c) =>
          c.some((i) => sameItem(i, item)) ? c.map((i) => (sameItem(i, item) ? { ...i, qty: i.qty + 1 } : i)) : [...c, item],
        );
      },
      changeQty(item, delta) {
        setCart((c) => c.map((i) => (sameItem(i, item) ? { ...i, qty: i.qty + delta } : i)).filter((i) => i.qty > 0));
      },
      removeFromCart(item) {
        setCart((c) => c.filter((i) => !sameItem(i, item)));
      },
      clearCart: () => setCart([]),

      orders,
      addOrder: (o) => setOrders((list) => [o, ...list]),

      owner,
      authReady,
      async signIn(email, password) {
        const ok = await backend.signIn(email, password);
        setOwner(ok);
        return ok;
      },
      async signOut() {
        await backend.signOut();
        setOwner(false);
      },

      toast, flash,
      dismissToast: () => {
        clearTimeout(timer.current);
        setToast(null);
      },
      cat, setCat, filters, setFilters, query, setQuery,
      form, setForm, delivery, setDelivery, payment, setPayment,
    }),
    [products, loading, loadError, reloadProducts, cart, orders, owner, authReady, toast, flash, cat, filters, query, form, delivery, payment],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error('useStore fora do StoreProvider');
  return s;
}
