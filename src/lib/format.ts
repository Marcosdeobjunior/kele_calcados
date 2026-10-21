export const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/** Remove acentos e caixa para comparar textos. */
export const norm = (t: string) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/** Máscara 00000-000. */
export const maskCep = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
};

/** "189,90" / "1.189,90" → 189.9 (NaN se inválido). */
export const parsePrice = (v: string) => parseFloat(v.replace(/\./g, '').replace(',', '.'));

export const priceToInput = (v: number) => v.toFixed(2).replace('.', ',');

export const slugify = (t: string) =>
  norm(t.trim()).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
