import type { Backend } from './backend';
import type { Product } from '../types';
import { SEED_PRODUCTS } from '../data/catalog';
import { load, save } from '../lib/storage';

/**
 * Modo demonstração: sem Supabase configurado, os produtos ficam no
 * localStorage deste navegador e a "dona" entra com uma conta de teste.
 * Serve para avaliar o app — não é seguro para produção.
 */
export const DEMO_OWNER = { email: 'dona@kelecalcados.com.br', password: 'kele2026' };

const PRODUCTS_KEY = 'kele-products';
const SESSION_KEY = 'kele-demo-owner';

const read = () => load<Product[]>(PRODUCTS_KEY, SEED_PRODUCTS);

export const localBackend: Backend = {
  async listProducts() {
    return read();
  },
  async saveProduct(p) {
    const all = read();
    save(PRODUCTS_KEY, all.some((x) => x.id === p.id) ? all.map((x) => (x.id === p.id ? p : x)) : [p, ...all]);
  },
  async deleteProduct(id) {
    save(PRODUCTS_KEY, read().filter((x) => x.id !== id));
  },
  uploadPhoto: (file) => resizeToDataUrl(file, 900),
  async isOwner() {
    return load(SESSION_KEY, false);
  },
  async signIn(email, password) {
    const ok = email.trim().toLowerCase() === DEMO_OWNER.email && password === DEMO_OWNER.password;
    if (ok) save(SESSION_KEY, true);
    return ok;
  },
  async signOut() {
    save(SESSION_KEY, false);
  },
};

/** Reduz a foto (JPEG) para caber no localStorage. */
function resizeToDataUrl(file: File, max: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.82));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Imagem inválida'));
    };
    img.src = url;
  });
}
