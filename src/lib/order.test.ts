import { describe, expect, it } from 'vitest';
import { SEED_PRODUCTS } from '../data/catalog';
import { buildMessage, cartLines, missingFields, orderId, orderSummary } from './order';
import type { CheckoutForm } from '../types';

const form: CheckoutForm = { name: 'Maria Souza', cep: '01000-000', street: 'Rua das Flores', num: '123', comp: 'Apto 4', bairro: 'Centro', city: 'São Paulo / SP' };
// Tênis Atlas, cor 1 = Preto, tam. 41, 2 unidades
const lines = cartLines([{ productId: 'atlas', colorIndex: 1, size: 41, qty: 2 }], SEED_PRODUCTS);

describe('buildMessage', () => {
  it('gera exatamente o formato do README', () => {
    const msg = buildMessage(orderId(0), lines, form, 'entrega', 'Pix').replace(/ /g, ' ');
    expect(msg).toBe(`Olá, Kele Calçados! Quero fazer o pedido #KC-1042:

1) Tênis Atlas
   Tam. 41 · Preto · Qtd 2
   R$ 299,90 × 2 = R$ 599,80

Total dos itens: R$ 599,80
Frete: a combinar

Nome: Maria Souza
Entrega: Rua das Flores, 123 (Apto 4) — Centro, São Paulo / SP · CEP 01000-000
Pagamento preferido: Pix`);
  });

  it('usa a linha de retirada na loja', () => {
    expect(buildMessage('#KC-1', lines, form, 'retirada', 'Boleto')).toContain('\nEntrega: vou retirar na loja\nPagamento preferido: Boleto');
  });

  it('omite a multiplicação quando a quantidade é 1', () => {
    const one = cartLines([{ productId: 'lis', colorIndex: 0, size: 37, qty: 1 }], SEED_PRODUCTS);
    expect(buildMessage('#KC-1', one, form, 'entrega', 'Pix').replace(/ /g, ' ')).toContain('   R$ 189,90\n\nTotal');
  });
});

describe('carrinho e pedido', () => {
  it('ignora itens de produtos excluídos', () => {
    expect(cartLines([{ productId: 'nao-existe', colorIndex: 0, size: 37, qty: 1 }], SEED_PRODUCTS)).toEqual([]);
  });
  it('resume o pedido', () => {
    expect(orderSummary(lines)).toBe('2× Tênis Atlas (41)');
  });
  it('exige endereço só na entrega', () => {
    const empty = { ...form, street: '', name: '' };
    expect(missingFields(empty, 'entrega')).toEqual(['name', 'street']);
    expect(missingFields(empty, 'retirada')).toEqual(['name']);
  });
});
