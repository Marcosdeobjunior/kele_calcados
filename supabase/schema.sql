-- Kele Calçados — schema do Supabase (rode no SQL Editor do projeto).
-- Leitura pública dos produtos; escrita só para a conta com papel `owner`.
--
-- Para dar o papel à dona (uma única conta), depois de criá-la em
-- Authentication → Users, rode:
--   update auth.users
--      set raw_app_meta_data = raw_app_meta_data || '{"role":"owner"}'
--    where email = 'dona@exemplo.com.br';
-- (app_metadata só pode ser alterado pelo servidor, nunca pelo próprio usuário.)

create or replace function public.is_owner() returns boolean
language sql stable as $$
  select coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'owner'
$$;

create table if not exists public.products (
  id          text primary key,
  name        text not null check (length(trim(name)) > 0),
  dept        text not null check (dept in ('Feminino', 'Masculino', 'Infantil')),
  type        text not null check (type in ('Tênis', 'Sandálias', 'Rasteiras', 'Scarpins', 'Botas', 'Sociais')),
  price       numeric(10, 2) not null check (price > 0),
  is_new      boolean not null default false,
  description text not null default '',
  colors      jsonb not null default '[]',   -- [["Preto", "#2a2725"], ...]
  sizes       int[] not null default '{}',   -- oferecidos
  off         int[] not null default '{}',   -- esgotados (subconjunto de sizes)
  photos      text[] not null default '{}',  -- URLs públicas do Storage
  created_at  timestamptz not null default now()
);

alter table public.products enable row level security;

drop policy if exists "products: leitura pública" on public.products;
create policy "products: leitura pública" on public.products
  for select using (true);

drop policy if exists "products: escrita da dona" on public.products;
create policy "products: escrita da dona" on public.products
  for all using (public.is_owner()) with check (public.is_owner());

-- Fotos dos produtos
insert into storage.buckets (id, name, public)
values ('product-photos', 'product-photos', true)
on conflict (id) do nothing;

drop policy if exists "fotos: leitura pública" on storage.objects;
create policy "fotos: leitura pública" on storage.objects
  for select using (bucket_id = 'product-photos');

drop policy if exists "fotos: escrita da dona" on storage.objects;
create policy "fotos: escrita da dona" on storage.objects
  for all using (bucket_id = 'product-photos' and public.is_owner())
  with check (bucket_id = 'product-photos' and public.is_owner());
