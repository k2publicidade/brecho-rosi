-- Copie e cole este código no SQL Editor do Supabase para criar as tabelas necessárias

-- Tabela de Produtos
create table public.products (
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

-- Habilitar Row Level Security (RLS) é uma boa prática, mas para começar simples vamos deixar público
-- ou criar uma política básica
alter table public.products enable row level security;

-- Política para leitura (todos podem ver produtos)
create policy "Produtos são visíveis para todos"
  on public.products for select
  using ( true );

-- Política para inserção/atualização (apenas autenticados ou via API Key se configurado assim)
-- Como estamos usando a chave anon pública para simplificar o protótipo inicial sem login de usuário:
-- (Numa aplicação real, você restringiria isso apenas a administradores logados)
create policy "Permitir modificações irrestritas (DEV ONLY)"
  on public.products
  for all
  using ( true )
  with check ( true );

-- Tabela de Pedidos (Simplificada)
create table public.orders (
  id text primary key,
  items jsonb,
  total numeric,
  customer_name text,
  customer_contact text,
  status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.orders enable row level security;

create policy "Pedidos abertos para todos (DEV ONLY)"
  on public.orders for all
  using ( true )
  with check ( true );
