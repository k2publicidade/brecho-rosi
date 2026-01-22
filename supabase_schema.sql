-- Tabela de Produtos
create table if not exists public.products (
  id text primary key,
  title text not null,
  description text,
  price numeric not null,
  original_price numeric,
  size text,
  condition text,
  category text,
  image_url text,
  available boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilita RLS para produtos
alter table public.products enable row level security;

-- Política de acesso para produtos (leitura pública, escrita pública para simplificar MVP)
drop policy if exists "Produtos visíveis para todos" on public.products;
create policy "Produtos visíveis para todos"
  on public.products for all
  using ( true )
  with check ( true );


-- Tabela de Pedidos
create table if not exists public.orders (
  id text primary key,
  customer_name text,
  total numeric,
  status text default 'pending',
  order_data jsonb, -- Armazena o objeto completo do pedido (itens, histórico, endereço, etc)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilita RLS para pedidos
alter table public.orders enable row level security;

-- Política de acesso para pedidos (leitura e escrita pública para simplificar MVP)
drop policy if exists "Pedidos acessíveis (DEV)" on public.orders;
create policy "Pedidos acessíveis (DEV)"
  on public.orders for all
  using ( true )
  with check ( true );
