-- ══════════════════════════════════════════════════════════════
-- Tabela repetidas — banco compartilhado FSaid & Romeo
-- Figurinhas duplicadas por seção+número, sem user_id (coletiva)
-- ══════════════════════════════════════════════════════════════
--
-- ATENÇÃO: se já existir uma tabela "repetidas" com esquema antigo
-- (user_id, code, num, quantidade) da aba Rep. anterior, ela deve
-- ser removida primeiro — os dados da aba Rep. não migram para este
-- novo formato. Descomente a linha abaixo se for o caso:
--
-- drop table if exists public.repetidas;
--

create table if not exists public.repetidas (
  id          bigint generated always as identity primary key,
  code        text not null,
  num         integer not null check (num >= 0),
  qty         integer not null check (qty >= 1),
  updated_by  text,
  updated_at  timestamptz not null default now(),
  unique (code, num)
);

alter table public.repetidas enable row level security;

create policy "repetidas_select" on public.repetidas
  for select to authenticated using (true);

create policy "repetidas_insert" on public.repetidas
  for insert to authenticated with check (true);

create policy "repetidas_update" on public.repetidas
  for update to authenticated using (true) with check (true);

create policy "repetidas_delete" on public.repetidas
  for delete to authenticated using (true);

alter publication supabase_realtime add table public.repetidas;
