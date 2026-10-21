import type { CartItem, CheckoutForm, DeliveryMode, Payment, Product } from '../types';
import { fmt } from './format';

export type CartLine = CartItem & { product: Product; colorName: string; line: number };

/** Junta a sacola com os produtos; itens de produtos excluídos somem. */
export function cartLines(cart: CartItem[], products: Product[]): CartLine[] {
  return cart.flatMap((c) => {
    const product = products.find((p) => p.id === c.productId);
    if (!product) return [];
    const color = product.colors[c.colorIndex] ?? product.colors[0];
    return [{ ...c, product, colorName: color?.[0] ?? '', line: product.price * c.qty }];
  });
}

export const cartTotal = (lines: CartLine[]) => lines.reduce((a, l) => a + l.line, 0);
export const cartCount = (lines: CartLine[]) => lines.reduce((a, l) => a + l.qty, 0);

export const orderId = (ordersSoFar: number) => `#KC-${1042 + ordersSoFar}`;

export const requiredFields = (mode: DeliveryMode): (keyof CheckoutForm)[] =>
  mode === 'entrega' ? ['name', 'cep', 'street', 'num', 'bairro', 'city'] : ['name'];

export const missingFields = (form: CheckoutForm, mode: DeliveryMode) =>
  requiredFields(mode).filter((k) => !form[k].trim());

/** Mensagem enviada à dona pelo WhatsApp (formato definido no README). */
export function buildMessage(
  id: string,
  lines: CartLine[],
  form: CheckoutForm,
  mode: DeliveryMode,
  payment: Payment,
): string {
  const items = lines
    .map(
      (l, i) =>
        `${i + 1}) ${l.product.name}\n` +
        `   Tam. ${l.size} · ${l.colorName} · Qtd ${l.qty}\n` +
        `   ${fmt(l.product.price)}${l.qty > 1 ? ` × ${l.qty} = ${fmt(l.line)}` : ''}`,
    )
    .join('\n');
  const addr =
    mode === 'entrega'
      ? `Entrega: ${form.street || '—'}, ${form.num || 's/n'}${form.comp ? ` (${form.comp})` : ''} — ${form.bairro || '—'}, ${form.city || '—'} · CEP ${form.cep || '—'}`
      : 'Entrega: vou retirar na loja';
  return (
    `Olá, Kele Calçados! Quero fazer o pedido ${id}:\n\n${items}\n\n` +
    `Total dos itens: ${fmt(cartTotal(lines))}\nFrete: a combinar\n\n` +
    `Nome: ${form.name || '—'}\n${addr}\nPagamento preferido: ${payment}`
  );
}

export const orderSummary = (lines: CartLine[]) =>
  lines.map((l) => `${l.qty}× ${l.product.name} (${l.size})`).join(', ');

export const formatWhen = (iso: string) => {
  const d = new Date(iso);
  return `${d.toLocaleDateString('pt-BR')} ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
};
