-- Atualização da tabela orders para suportar JSONB com todos os dados
-- Se a tabela já existir, adicione a coluna order_data
alter table public.orders add column if not exists order_data jsonb;

-- Se precisar recriar do zero (cuidado: apaga dados existentes!)
-- drop table if exists public.orders;
-- create table public.orders (
--   id text primary key,
--   items jsonb,
--   total numeric,
--   customer_name text,
--   customer_contact text,
--   status text default 'pending',
--   order_data jsonb, -- Aqui salvaremos o objeto completo do frontend
--   created_at timestamp with time zone default timezone('utc'::text, now()) not null
-- );

-- Políticas de segurança
alter table public.orders enable row level security;

create policy "Pedidos visíveis para todos (DEV ONLY)"
  on public.orders for all
  using ( true )
  with check ( true );
