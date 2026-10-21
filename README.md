# Kele Calçados

App de vitrine (PWA mobile) da Kele Calçados — Feminino, Masculino e Infantil. A cliente monta a sacola e, em
"Finalizar compra", preenche nome, endereço e pagamento preferido; o app gera a mensagem do pedido e abre o
WhatsApp da loja (`https://wa.me/<numero>?text=<mensagem>`). Frete e pagamento são combinados na conversa.
A dona tem uma área exclusiva (login) para cadastrar, editar e excluir produtos.

A especificação de design (telas, tokens, formato exato da mensagem) está em [`design/README.md`](design/README.md),
junto do protótipo HTML de referência.

## Stack

- **Vite + React 19 + TypeScript**, web instalável (manifest + service worker).
- **Responsivo**: no celular segue o design de 390pt (tab bar embaixo); no tablet as grades se alargam; a partir
  de 900px (desktop) entra um cabeçalho com departamentos, busca, pedidos e sacola, a vitrine mostra mais colunas,
  o produto fica em duas colunas, sacola e checkout ganham um resumo lateral fixo e os filtros abrem num painel
  lateral.
- **React Router** para as telas; **Lucide** para os ícones; fontes Cormorant Garamond + Lora (Google Fonts).
- **Supabase** (Auth + Postgres + Storage) para login da dona, produtos e fotos — opcional no desenvolvimento.
- Sacola e pedidos ficam no `localStorage` do aparelho da cliente.

## Rodando

```bash
npm install
cp .env.example .env   # ajuste o número do WhatsApp etc.
npm run dev            # http://localhost:5173
```

Outros comandos: `npm test` (regras de negócio), `npm run typecheck`, `npm run build` (gera `dist/`), `npm run preview`.

### Modo demonstração

Sem `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` o app roda sozinho: o catálogo inicial vem de
`src/data/catalog.ts`, as alterações da dona ficam no `localStorage` do navegador e o login usa a conta de teste
`dona@kelecalcados.com.br` / `kele2026` (mostrada na tela de login). Serve só para avaliar — **não publique assim**.

### Supabase (produção)

1. Crie um projeto em supabase.com e rode `supabase/schema.sql` no SQL Editor (tabela `products`, RLS e bucket
   `product-photos`). Opcional: `supabase/seed.sql` para o catálogo inicial.
2. Em *Authentication → Users*, crie a conta da dona e dê a ela o papel `owner` (comando no topo do `schema.sql`).
   Leitura de produtos é pública; escrita e upload de fotos só para `owner`.
3. Preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` no `.env`.

## Configuração (`.env`)

| Variável | Padrão | Uso |
| --- | --- | --- |
| `VITE_WHATSAPP_NUMBER` | `5511900000000` (fictício) | Número da loja, com DDI e DDD |
| `VITE_PICKUP_ENABLED` | `true` | Mostra "Retirar na loja" no checkout |
| `VITE_PALETTE` | `noir` | `noir` (Noir & ouro) ou `marfim` |
| `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` | — | Backend; vazio = modo demonstração |

## Publicação

### GitHub Pages (visualização)

O workflow `.github/workflows/pages.yml` compila e publica o app a cada push na `main`, em modo demonstração
(sem Supabase), em `https://<usuario>.github.io/kele_calcados/`. Configuração única no GitHub:
*Settings → Pages → Build and deployment → Source* = **GitHub Actions**.

O build usa `BASE_PATH=/kele_calcados/` para o subcaminho e copia `index.html` para `404.html`, assim links
diretos (ex.: `/kele_calcados/produto/atlas`) também abrem o app.

### Outros serviços

`npm run build` gera um site estático em `dist/`. Como as rotas são do lado do cliente, o servidor precisa
devolver `index.html` para qualquer caminho — já incluído para Netlify (`public/_redirects`) e Vercel (`vercel.json`).

## Estrutura

```
src/
  config.ts            variáveis de ambiente
  types.ts             Product, CartItem, Order…
  data/catalog.ts      departamentos, categorias, cores, catálogo inicial
  lib/                 regras puras: filtros/busca, mensagem do pedido, WhatsApp, validação do cadastro (+ testes)
  services/            backend: Supabase ou local (modo demonstração)
  state/store.tsx      estado global (produtos, sacola, pedidos, sessão da dona, toast)
  components/          Plate, grade de produtos, tab bar, cabeçalho do desktop, filtros, toast, botões
  screens/             Vitrine, Departamento, Buscar, Produto, Sacola, Checkout, Enviado, Pedidos,
                       Login, Painel, Novo/Editar produto
  styles/              classical.css (design system), palette.css (Noir & ouro / Marfim), app.css
supabase/              schema.sql e seed.sql
design/                especificação (README) e protótipo HTML de referência
```

## Rotas

`/` vitrine · `/departamento/:dept` · `/buscar` · `/produto/:id` · `/sacola` · `/pedido` (dados do pedido) ·
`/pedido/enviado` · `/pedidos` · `/loja/entrar` · `/loja` (painel) · `/loja/produto/novo` · `/loja/produto/:id`
