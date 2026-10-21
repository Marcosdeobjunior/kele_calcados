import { createClient, type User } from '@supabase/supabase-js';
import type { Backend } from './backend';
import type { Product } from '../types';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../config';

/** Linha da tabela `products` (ver supabase/schema.sql). */
type Row = {
  id: string;
  name: string;
  dept: Product['dept'];
  type: Product['type'];
  price: number;
  is_new: boolean;
  description: string;
  colors: Product['colors'];
  sizes: number[];
  off: number[];
  photos: string[];
};

const toProduct = (r: Row): Product => ({
  id: r.id, name: r.name, dept: r.dept, type: r.type, price: Number(r.price), isNew: r.is_new,
  desc: r.description, colors: r.colors, sizes: r.sizes, off: r.off, photos: r.photos,
});

const toRow = (p: Product): Row => ({
  id: p.id, name: p.name, dept: p.dept, type: p.type, price: p.price, is_new: !!p.isNew,
  description: p.desc, colors: p.colors, sizes: p.sizes, off: p.off, photos: p.photos ?? [],
});

const isOwnerUser = (u: User | null | undefined) => u?.app_metadata?.role === 'owner';

const BUCKET = 'product-photos';

export function supabaseBackend(): Backend {
  const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return {
    async listProducts() {
      const { data, error } = await db.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return (data as Row[]).map(toProduct);
    },
    async saveProduct(p) {
      const { error } = await db.from('products').upsert(toRow(p));
      if (error) throw error;
    },
    async deleteProduct(id) {
      const { error } = await db.from('products').delete().eq('id', id);
      if (error) throw error;
    },
    async uploadPhoto(file) {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error } = await db.storage.from(BUCKET).upload(path, file, { contentType: file.type });
      if (error) throw error;
      return db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
    },
    async isOwner() {
      const { data } = await db.auth.getSession();
      return isOwnerUser(data.session?.user);
    },
    async signIn(email, password) {
      const { data, error } = await db.auth.signInWithPassword({ email: email.trim(), password });
      if (error) return false;
      if (!isOwnerUser(data.user)) {
        await db.auth.signOut();
        return false;
      }
      return true;
    },
    async signOut() {
      await db.auth.signOut();
    },
  };
}
