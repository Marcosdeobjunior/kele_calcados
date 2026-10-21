# Handoff: Kele Calçados — app de vitrine com checkout via WhatsApp

## Overview
Aplicativo mobile de uma loja de calçados (linha unissex/família: Feminino, Masculino, Infantil). **A venda não é finalizada no app**: o cliente monta a sacola e, ao tocar em "Finalizar compra", preenche nome, endereço e pagamento preferido. O app gera uma mensagem detalhada e abre o WhatsApp da dona da loja (`https://wa.me/<numero>?text=<mensagem>`). Frete e pagamento (Pix, link de cartão, boleto) são combinados na conversa.
Há também uma **área exclusiva da dona** (login) para cadastrar, editar e excluir produtos.

## About the Design Files
Os arquivos deste pacote são **referências de design feitas em HTML**: protótipos que mostram aparência e comportamento, **não código de produção para copiar**. A tarefa é **recriar esses designs no ambiente do projeto** (React Native, Next.js, Flutter etc.) usando seus padrões. Se ainda não existe projeto, sugestão:
- **Expo (React Native) + TypeScript** para o app (ou **Next.js PWA** se preferir web instalável).
- **Supabase** (Auth + Postgres + Storage) para login da dona, produtos e fotos.
- Fontes via Google Fonts: Cormorant Garamond + Lora. Ícones: **Lucide** (`lucide-react-native` / `lucide-react`).

Para abrir o protótipo: sirva a pasta por HTTP (ex. `npx serve .`) e abra `Loja de Calcados v2.dc.html`.

## Fidelity
**High-fidelity.** Cores, tipografia, espaçamentos, textos e interações são finais. Fotos são placeholders (listras diagonais com legenda "foto · …") — substituir por imagens reais.

## Frame
Projetado em **390 × 844 pt** (iPhone 14/15). Status bar 44pt; tab bar com 22pt de safe-area inferior. Margem lateral padrão **20px**.

## Screens / Views

### 1. Vitrine (home) — tab "Vitrine"
- **Header** (padding 6/14/10/20, borda inferior hairline): logo "Kele" (Cormorant 28px/500) + "CALÇADOS" (Lora 10px, letter-spacing .16em, uppercase, accent-700). À direita: botão "Painel" (só se dona logada), ícone busca, ícone sacola com badge (16px círculo, borda accent, número tabular).
- **Hero** (só quando categoria = Todos e sem filtros): imagem `.plate` 200px de altura; kicker "NOVA COLEÇÃO · 2026"; título Cormorant 29px "Um par para / *cada passo da casa*" (2ª linha itálica); botão outline "Novidades" → filtra novidades.
- **Departamentos**: kicker + grid 3 colunas (gap 10). Cada item: plate 3:4 com numeral "01/02/03" (Cormorant 22px accent) no canto, nome (Cormorant 18/600) + chevron, contagem "N modelos" (11px). Toque → página do departamento.
- **Chips de tipo** (scroll horizontal, gap 8): Todos, Novidades, Tênis, Sandálias, Rasteiras, Botas, Sociais, Scarpins. Pill, borda 1px; ativo = borda accent + texto accent-700.
- **Cabeçalho da lista**: título (Cormorant 21/600) + "N modelos"; botão ghost "Filtrar · n".
- **Grid de produtos** 2 colunas, gap 22/14: plate 4:5, tag "Novo" (outline), kicker departamento, nome Cormorant 17/600, preço 14px tabular.
- **Rodapé**: hairline, "Kele Calçados · atendimento pelo WhatsApp" + link "🔒 Área da loja" (ícone Lucide `lock`) → login.

### 2. Página de departamento (Feminino / Masculino / Infantil)
- Top bar: voltar · kicker "DEPARTAMENTO" · busca.
- Numeral fantasma 96px (accent-200, lining nums) à direita; título Cormorant 46px/400; frase itálica 13px.
- **Abas de subcategoria** (scroll horizontal, gap 20, sublinhado 1px accent na ativa, contagem 10px ao lado):
  - Feminino: Todos, Tênis, Sandálias, Rasteiras, Scarpins, Botas (tam. 33–40)
  - Masculino: Todos, Tênis, Sociais, Sandálias, Botas (tam. 37–44)
  - Infantil: Todos, Tênis, Sandálias, Botas (tam. 20–33)
- Contagem + "Filtrar"; grid igual à vitrine (kicker = subcategoria).

### 3. Filtros (bottom sheet)
Backdrop neutral-900 40%; sheet com raio 14px no topo, sombra lg, animação slide-up 280ms ease. Seções: **Tamanho** (grid 7 col, botões 40px), **Preço** (Todos / Até R$ 150 / R$ 150–300 / Acima de R$ 300), **Ordenar** (segmentado: Relevância / Menor preço / Maior preço). "Limpar" no topo; CTA "Ver N modelos".

### 4. Buscar — tab "Buscar"
Input 44px com ícone. Vazio: "BUSCAS FREQUENTES" (chips: Tênis, Bota, Sandália infantil, Social masculino, Rasteira) + lista "DEPARTAMENTOS" (linhas Cormorant 22px com contagem). Com texto: lista de resultados (thumb 64×76, kicker dept · tipo, nome, preço, chevron). Busca ignora acentos e plural simples ("botas" → "bota").

### 5. Detalhe do produto
Top bar: voltar · "DEPT · TIPO" · sacola. Imagem plate 1:1; nome Cormorant 32/500; preço 18px + "ou 3× de R$ X · combinado no WhatsApp". Hairline. **Cor**: swatches 38px circulares (anel accent na selecionada), nome da cor em itálico à direita. **Tamanho**: grid 5 col, 44px; selecionado = fundo accent 12% + borda accent; esgotado = riscado + neutral-400, desabilitado. Erro "Escolha um tamanho para continuar." se tentar adicionar sem tamanho. Descrição justificada 14/1.65. CTA fixo "Adicionar à sacola" (50px). Se dona logada: botão "Editar este produto".
Ao adicionar: toast (borda accent, sombra md, slide-up 250ms) "Adicionado: Nome · 37" + "Ver sacola"; some em 2,6s.

### 6. Sacola — tab "Sacola (n)"
Itens: thumb 84×100, nome, "Tam. 37 · Caramelo · R$ 189,90", stepper −/+ (36×34), total da linha, remover (×). Subtotal; "Frete — a combinar". Aviso com ícone `message-circle`: "Nenhum pagamento é feito no app…". Rodapé: "Total dos itens" (Cormorant 24px) + CTA **"Finalizar compra"**. Estado vazio com CTA "Ver vitrine".

### 7. Dados do pedido (checkout)
- Segmentado "Entrega no endereço / Retirar na loja" (configurável).
- Grid 6 colunas: Nome completo (6), CEP (2, máscara 00000-000), Rua/Avenida (4), Número (2), Complemento (4, opcional), Bairro (3), Cidade/UF (3). Na retirada, só Nome.
- Pagamento preferido (pills): Pix · Cartão (link) · Boleto.
- **Prévia da mensagem** (balão com raio 7/7/2/7, fundo accent-100 45%, `white-space: pre-wrap`) + "para Kele Calçados · +55 (11) 90000-0000".
- CTA "Enviar pedido no WhatsApp". Validação: campos obrigatórios vazios ganham borda accent + mensagem "Preencha os campos destacados para enviar."

### 8. Pedido enviado
Círculo 72px com check; "PEDIDO #KC-1042 · R$ X"; título "Pedido enviado / *para a Kele*"; 3 passos numerados (confirma estoque/frete → recebe Pix/link → envio). Botões "Abrir conversa novamente" e "Ver meus pedidos". A sacola é esvaziada.

### 9. Pedidos — tab "Pedidos"
Lista: nº do pedido (Cormorant 20/600), tag "Enviado à loja", resumo "1× Tênis Atlas (41), …", data/hora · total, "Abrir conversa" (reabre o wa.me com a mesma mensagem). Estado vazio.

### 10. Login da dona
Ícone de cadeado em círculo; "ACESSO EXCLUSIVO"; "Área da *loja*"; campos E-mail e Senha (com Mostrar/Ocultar); erro "E-mail ou senha incorretos."; CTA "Entrar". (O protótipo usa credenciais fixas `dona@kelecalcados.com.br / kele2026` — **substituir por autenticação real**, ex. Supabase Auth com uma única conta com papel `owner`.)

### 11. Painel — Produtos
Header "PAINEL DA DONA / Produtos", "Ver vitrine", sair (`log-out`). Busca no estoque + botão "+ Novo". Lista: thumb, nome + tag Novo, "Dept · Tipo", "N tamanhos disponíveis" ou "Esgotado" (accent-700), preço, "Editar".

### 12. Novo / Editar produto
Fotos (1 principal 2×2 + slots "+ Foto"), Nome, Preço (prefixo R$, aceita só dígitos e vírgula), Departamento (segmentado), Subcategoria (pills, opções mudam pelo depto; trocar depto zera tamanhos), Cores (grade 6 col de 12 swatches pré-definidos, multi-seleção), Tamanhos (grade 7 col da faixa do depto; toque cicla **não oferece (tracejado) → disponível (borda accent) → esgotado (riscado)**), Descrição (textarea), "Destacar como novidade" (toggle). CTA "Publicar na vitrine" / "Salvar alterações". Editando: "Excluir produto" → diálogo de confirmação ("O produto sai da vitrine e das sacolas abertas…", Cancelar / Excluir).
Validação: nome obrigatório, preço > 0, ≥1 cor, ≥1 tamanho disponível.

**Tab bar** (Vitrine, Buscar, Sacola, Pedidos): visível em vitrine, departamento, busca, sacola e pedidos. Ícones Lucide 22px stroke 1.5 (`home`, `search`, `shopping-bag`, `package`), label 11px; ativo = accent-700, inativo = neutral-700.

## Interactions & Behavior
- Navegação: produto volta para a tela de origem; departamento volta para vitrine ou busca.
- Toasts 2,6s. Sheet de filtros 280ms ease; toast 250ms ease.
- Hover/pressed dos botões: tint accent 12% / 22% (outline), foco `outline: 2px solid accent; offset 2px`.
- Itens iguais (mesmo produto+cor+tamanho) somam quantidade; quantidade 0 remove.
- Envio: abrir `https://wa.me/${numero}?text=${encodeURIComponent(msg)}` (no RN: `Linking.openURL`). Salvar o pedido localmente (AsyncStorage) ou no backend.

### Formato da mensagem (exato)
```
Olá, Kele Calçados! Quero fazer o pedido #KC-1042:

1) Tênis Atlas
   Tam. 41 · Preto · Qtd 2
   R$ 299,90 × 2 = R$ 599,80

Total dos itens: R$ 599,80
Frete: a combinar

Nome: Maria Souza
Entrega: Rua das Flores, 123 (Apto 4) — Centro, São Paulo / SP · CEP 01000-000
Pagamento preferido: Pix
```
Retirada: `Entrega: vou retirar na loja`. Valores em `pt-BR` BRL.

## State Management
- `products: Product[]` (backend). `cart: {productId, colorIndex, size, qty}[]` (local, persistido).
- `orders: {id, text, total, summary, createdAt}[]` (local ou backend).
- UI: categoria ativa, depto + subcategoria, filtros `{sizes[], price, sort}`, busca, seleção de cor/tamanho, form de checkout, `deliveryMode`, `payment`.
- Dona: sessão auth, rascunho do produto, confirmação de exclusão.

```ts
type Product = {
  id: string; name: string;
  dept: 'Feminino' | 'Masculino' | 'Infantil';
  type: 'Tênis' | 'Sandálias' | 'Rasteiras' | 'Scarpins' | 'Botas' | 'Sociais';
  price: number; isNew?: boolean; desc: string;
  colors: [name: string, hex: string][];
  sizes: number[];   // oferecidos
  off: number[];     // esgotados (subconjunto de sizes)
  photos?: string[];
};
```
Regras de backend sugeridas: leitura pública de `products`; escrita só para o usuário com papel `owner` (RLS no Supabase). Fotos no Storage.

## Configuração
- `WHATSAPP_NUMBER` (protótipo: fictício `5511900000000`).
- `PICKUP_ENABLED` (mostra "Retirar na loja").
- Paleta: **Noir & ouro** (padrão) ou **Marfim**.

## Design Tokens
Base: design system "Classical" (`_ds/.../styles.css`) com a paleta sobrescrita no app.

**Noir & ouro (padrão)**
- bg `#17140f` · surface `#241e17` · text `#efe7d8`
- accent `#c9a25a` · accent-100 `#2a2218` · accent-200 `#3a2f1f` · accent-400 `#b08a45` · accent-600 `#d8b46c` · accent-700 `#dcbd80` · accent-800 `#e8d09c`
- divider `rgba(239,231,216,.14)` · neutral-100 `#1f1a14` · neutral-400 `#6b6256` · neutral-700 `#a89c8a` · neutral-800 `#cfc4b2` · neutral-900 `#0a0908`
- shadow-md `0 4px 14px rgba(0,0,0,.5)` · shadow-lg `0 18px 44px rgba(0,0,0,.35)`

**Marfim**
- bg `#f6f1e7` · surface `#ebe2d1` · text `#1c1712` · accent `#9c7a3c` · accent-100 `#f1e6cf` · accent-200 `#e6d6b4` · accent-400 `#b8955a` · accent-600 `#84652e` · accent-700 `#6e5222` · accent-800 `#4f3a17` · divider `rgba(28,23,18,.14)` · neutral-100 `#efe8da` · neutral-400 `#b3a895` · neutral-700 `#6f6557` · neutral-800 `#3f382f` · neutral-900 `#1a1612`

Regra visual: dourado é **traço** (bordas, sublinhados, numerais), nunca bloco preenchido. Botão primário = contorno 1px accent sobre transparente. Seleção = fundo `accent` a 12%.

**Tipografia**: títulos Cormorant Garamond (400 display / 500 / 600 máx.), corpo Lora 400/500. Escala usada: 10 (kicker, .12em uppercase), 11, 12, 13, 14 (corpo), 17–18 (nomes), 21–26 (títulos de tela), 29–36 (heros), 46 (depto), 96 (numeral fantasma). Números de preço/tamanho/contagem com `font-feature-settings: 'tnum'`. Corpo longo justificado.

**Espaçamento**: 4.6 / 9.2 / 13.8 / 18.4 / 27.6 / 36.8 px (fator 1.15). Gutter de tela 20px.
**Raios**: 2 / 4 / 7px; pills 999px; bottom sheet 14px.
**Imagens `.plate`**: borda 6px cor `surface` + outline 1px divider; filtro `sepia(.22) saturate(.82) contrast(1.05)`.

## Assets
- Ícones: Lucide (search, shopping-bag, home, package, chevron-left/right, plus, minus, x, lock, log-out, pencil, trash-2, message-circle, check, sliders).
- Fotos: placeholders — a loja deve fornecer fotos de produto (1:1 e 4:5), campanha (hero) e departamentos (3:4).
- Fontes: Google Fonts (Cormorant Garamond, Lora).

## Files
- `Loja de Calcados v2.dc.html` — protótipo final (todas as telas + área da dona). Lógica, dados de exemplo e geração da mensagem estão na classe `Component` no fim do arquivo.
- `support.js` — runtime necessário para abrir o protótipo.
- `_ds/classical-…/styles.css` — tokens e classes base (.btn, .input, .seg, .tag, .plate).
