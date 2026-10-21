import type { Product } from '../types';
import { DEMO_MODE } from '../config';
import { localBackend } from './local';

export interface Backend {
  listProducts(): Promise<Product[]>;
  /** Cria ou atualiza (upsert por id). */
  saveProduct(p: Product): Promise<void>;
  deleteProduct(id: string): Promise<void>;
  /** Envia a foto e devolve a URL pública. */
  uploadPhoto(file: File): Promise<string>;
  /** true se há sessão da dona (papel `owner`). */
  isOwner(): Promise<boolean>;
  /** true se o login deu certo e a conta tem papel `owner`. */
  signIn(email: string, password: string): Promise<boolean>;
  signOut(): Promise<void>;
}

// O cliente do Supabase só é baixado quando está configurado.
let pending: Promise<Backend> | undefined;
const get = () =>
  (pending ??= DEMO_MODE ? Promise.resolve(localBackend) : import('./supabase').then((m) => m.supabaseBackend()));

export const backend: Backend = {
  listProducts: () => get().then((b) => b.listProducts()),
  saveProduct: (p) => get().then((b) => b.saveProduct(p)),
  deleteProduct: (id) => get().then((b) => b.deleteProduct(id)),
  uploadPhoto: (f) => get().then((b) => b.uploadPhoto(f)),
  isOwner: () => get().then((b) => b.isOwner()),
  signIn: (e, p) => get().then((b) => b.signIn(e, p)),
  signOut: () => get().then((b) => b.signOut()),
};
