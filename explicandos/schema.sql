-- ============================================================
-- mariaestuda — Explicações
-- Caderno de encargos v1.0, 18 de setembro de 2026.
-- Correr UMA vez no painel Supabase → SQL Editor.
--
-- O modelo de segurança é este ficheiro, não a interface. Um
-- aluno autenticado consegue falar com o PostgREST diretamente
-- a partir da consola do browser, com o seu próprio token e a
-- chave anon que está no JavaScript. O que o impede de ler a
-- conta corrente das outras famílias são as políticas abaixo.
-- ============================================================

-- A primeira versão da aplicação media o saldo em horas. O caderno
-- mede em euros, com o valor congelado em cada explicação, por isso
-- aquelas tabelas não servem e vão embora.
drop table if exists public.exp_aulas      cascade;
drop table if exists public.exp_pagamentos cascade;
drop table if exists public.exp_alunos     cascade;

-- ============================================================
-- 1. Perfis
-- Uma linha por conta do Supabase Auth. Guardamos a LISTA DE
-- PERMISSÕES, não a etiqueta do perfil (§42): "encarregado",
-- "aluno" e "misto" são só combinações destas duas colunas.
-- ============================================================
create table if not exists public.perfis (
  id                 uuid primary key references auth.users(id) on delete cascade,
  nome               text not null,
  ve_conta_corrente  boolean not null default false,
  ve_materiais       boolean not null default false,
  is_admin           boolean not null default false,
  ativo              boolean not null default true,
  criado_em          timestamptz not null default now()
);

-- Uma conta nova começa sem ver nada: as permissões são dadas
-- à mão pelo administrador, nunca assumidas.
create or replace function public.trata_utilizador_novo()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.perfis (id, nome)
  values (new.id, coalesce(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.trata_utilizador_novo();

-- ============================================================
-- 2. Alunos
-- `encarregado_id` e `aluno_id` apontam para perfis. No perfil
-- misto (o aluno do secundário que trata da sua conta) são o
-- mesmo id. Qualquer um pode ficar vazio: um aluno pode existir
-- antes de haver contas criadas.
-- ============================================================
create table if not exists public.alunos (
  id             uuid primary key default gen_random_uuid(),
  nome           text not null,
  ano            text,
  disciplinas    text,
  preco_hora     numeric(6,2) not null default 10 check (preco_hora >= 0),
  encarregado_id uuid references public.perfis(id) on delete set null,
  aluno_perfil_id uuid references public.perfis(id) on delete set null,
  notas          text,
  arquivado      boolean not null default false,
  arquivado_em   timestamptz,
  criado_em      timestamptz not null default now()
);
create index if not exists alunos_enc_idx   on public.alunos (encarregado_id);
create index if not exists alunos_aluno_idx on public.alunos (aluno_perfil_id);

-- ============================================================
-- 3. Explicações
-- Uma linha por sessão; uma linha em `explicacao_alunos` por
-- aluno presente. O valor é POR ALUNO (§98) e fica congelado no
-- registo: mudar o preço-hora do aluno não mexe no passado (§101).
-- ============================================================
create table if not exists public.explicacoes (
  id          uuid primary key default gen_random_uuid(),
  data        date not null default current_date,
  duracao_min integer not null default 60 check (duracao_min between 15 and 480),
  sumario     text,
  criado_em   timestamptz not null default now()
);

create table if not exists public.explicacao_alunos (
  explicacao_id uuid not null references public.explicacoes(id) on delete cascade,
  aluno_id      uuid not null references public.alunos(id) on delete cascade,
  valor_eur     numeric(8,2) not null check (valor_eur >= 0),
  primary key (explicacao_id, aluno_id)
);
create index if not exists expl_alunos_aluno_idx on public.explicacao_alunos (aluno_id);
create index if not exists explicacoes_data_idx  on public.explicacoes (data desc);

-- ============================================================
-- 4. Pagamentos
-- Crédito simples, sem ligação a explicações nenhumas (§116).
-- ============================================================
create table if not exists public.pagamentos (
  id        uuid primary key default gen_random_uuid(),
  aluno_id  uuid not null references public.alunos(id) on delete cascade,
  data      date not null default current_date,
  valor_eur numeric(8,2) not null check (valor_eur >= 0),
  nota      text,
  criado_em timestamptz not null default now()
);
create index if not exists pagamentos_aluno_idx on public.pagamentos (aluno_id, data desc);

-- ============================================================
-- 5. Materiais
-- O ficheiro existe uma só vez (§131); o que se repete é a
-- atribuição. `storage_path` é o caminho dentro do bucket
-- privado `materiais`.
-- ============================================================
create table if not exists public.materiais (
  id             uuid primary key default gen_random_uuid(),
  titulo         text not null,
  disciplina     text,
  ano            text,
  storage_path   text not null unique,
  tamanho_bytes  bigint not null default 0,
  criado_em      timestamptz not null default now()
);

create table if not exists public.material_alunos (
  material_id uuid not null references public.materiais(id) on delete cascade,
  aluno_id    uuid not null references public.alunos(id) on delete cascade,
  publicar_em date,                      -- vazio = visível já (§144)
  primary key (material_id, aluno_id)
);
create index if not exists material_alunos_aluno_idx on public.material_alunos (aluno_id);

-- ============================================================
-- 6. TPCs
-- Uma tarefa, não um ficheiro (§154). Três estados (§166-168).
-- ============================================================
create table if not exists public.tpcs (
  id            uuid primary key default gen_random_uuid(),
  aluno_id      uuid not null references public.alunos(id) on delete cascade,
  descricao     text not null,
  entrega       date,
  estado        text not null default 'por_fazer'
                  check (estado in ('por_fazer','feito_aluno','confirmado')),
  nota          smallint check (nota between 0 and 5),
  criado_em     timestamptz not null default now(),
  feito_em      timestamptz,
  confirmado_em timestamptz,
  -- A nota só existe depois da explicadora confirmar.
  constraint nota_so_quando_confirmado check (nota is null or estado = 'confirmado')
);
create index if not exists tpcs_aluno_idx on public.tpcs (aluno_id, criado_em desc);

create table if not exists public.tpc_materiais (
  tpc_id      uuid not null references public.tpcs(id) on delete cascade,
  material_id uuid not null references public.materiais(id) on delete cascade,
  primary key (tpc_id, material_id)
);

-- ============================================================
-- 7. "Importante para a próxima explicação" (§9)
-- A nota em vigor é a mais recente por consumir. Registar uma
-- explicação consome as que já existiam; uma nota escrita depois
-- fica de pé. O histórico nunca se apaga (§177).
-- ============================================================
create table if not exists public.notas_proxima (
  id           uuid primary key default gen_random_uuid(),
  aluno_id     uuid not null references public.alunos(id) on delete cascade,
  texto        text not null,
  criado_em    timestamptz not null default now(),
  consumida_em timestamptz
);
create index if not exists notas_proxima_aluno_idx on public.notas_proxima (aluno_id, criado_em desc);

-- ============================================================
-- 8. Horário semanal
-- Decorativo (§76): serve para veres o dia e para pré-preencher
-- o formulário. NUNCA cria registos (§77).
-- ============================================================
create table if not exists public.horario (
  id          uuid primary key default gen_random_uuid(),
  aluno_id    uuid not null references public.alunos(id) on delete cascade,
  dia_semana  smallint not null check (dia_semana between 0 and 6),  -- 0 = domingo
  hora_inicio time not null,
  duracao_min integer not null default 60 check (duracao_min between 15 and 480),
  ativo       boolean not null default true
);

-- Exceções pontuais, só para efeitos de visualização (§78).
create table if not exists public.horario_excecoes (
  id         uuid primary key default gen_random_uuid(),
  horario_id uuid not null references public.horario(id) on delete cascade,
  data       date not null,
  unique (horario_id, data)
);

create table if not exists public.horario_extras (
  id          uuid primary key default gen_random_uuid(),
  aluno_id    uuid not null references public.alunos(id) on delete cascade,
  data        date not null,
  hora_inicio time not null,
  duracao_min integer not null default 60,
  nota        text
);

-- ============================================================
-- 9. Quem é quem — funções auxiliares
-- SECURITY DEFINER com search_path fixo, para as políticas não
-- dependerem do que o cliente puser no caminho de procura.
-- ============================================================
create or replace function public.e_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select is_admin and ativo from public.perfis where id = auth.uid()), false)
$$;

create or replace function public.ve_conta_corrente()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select ve_conta_corrente and ativo from public.perfis where id = auth.uid()), false)
$$;

create or replace function public.ve_materiais()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select ve_materiais and ativo from public.perfis where id = auth.uid()), false)
$$;

-- Os alunos que a conta atual pode ver, seja como encarregado,
-- seja por ser o próprio. Alunos arquivados ficam de fora (§187).
create or replace function public.meus_alunos()
returns setof uuid language sql stable security definer set search_path = public as $$
  select id from public.alunos
   where not arquivado
     and (encarregado_id = auth.uid() or aluno_perfil_id = auth.uid())
$$;

-- ============================================================
-- 10. RLS — as tabelas em bruto são do administrador
-- As famílias nunca leem daqui: leem das vistas da secção 11,
-- que mostram só as colunas a que têm direito. Assim não é
-- preciso segurança ao nível da coluna para esconder o valor
-- de uma explicação ao aluno, deixando-lhe o sumário (§94).
-- ============================================================
do $$
declare t text;
begin
  foreach t in array array['alunos','explicacoes','explicacao_alunos','pagamentos',
                           'materiais','material_alunos','tpcs','tpc_materiais',
                           'notas_proxima','horario','horario_excecoes','horario_extras']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "admin faz tudo" on public.%I', t);
    execute format(
      'create policy "admin faz tudo" on public.%I for all to authenticated
         using (public.e_admin()) with check (public.e_admin())', t);
    execute format('revoke all on public.%I from anon', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
  end loop;
end $$;

alter table public.perfis enable row level security;

drop policy if exists "vejo o meu perfil"    on public.perfis;
drop policy if exists "admin vê os perfis"   on public.perfis;
drop policy if exists "admin muda os perfis" on public.perfis;

create policy "vejo o meu perfil" on public.perfis
  for select to authenticated using (id = auth.uid());
create policy "admin vê os perfis" on public.perfis
  for select to authenticated using (public.e_admin());
create policy "admin muda os perfis" on public.perfis
  for all to authenticated using (public.e_admin()) with check (public.e_admin());

revoke all on public.perfis from anon;
grant select, insert, update, delete on public.perfis to authenticated;

-- ============================================================
-- 11. Vistas para as famílias
-- Correm com os direitos do dono (security_invoker desligado),
-- por isso passam por cima do RLS das tabelas de base — e são
-- elas próprias que filtram por auth.uid(). É aqui que vive a
-- diferença entre o que o encarregado vê e o que o aluno vê.
-- ============================================================

-- Os educandos da conta atual. Quem só vê materiais também
-- precisa desta lista para saber a que aluno pertence o que lê.
create or replace view public.v_meus_alunos as
  select a.id, a.nome, a.ano, a.disciplinas
    from public.alunos a
   where a.id in (select public.meus_alunos());

-- Conta corrente por educando: débitos (explicações) e créditos
-- (pagamentos) na mesma lista. Só para quem vê conta corrente.
create or replace view public.v_conta_corrente as
  select ea.aluno_id,
         e.id            as movimento_id,
         'explicacao'::text as tipo,
         e.data,
         e.sumario       as descricao,
         e.duracao_min,
         ea.valor_eur    as debito,
         0::numeric      as credito
    from public.explicacao_alunos ea
    join public.explicacoes e on e.id = ea.explicacao_id
   where public.ve_conta_corrente()
     and ea.aluno_id in (select public.meus_alunos())
  union all
  select p.aluno_id, p.id, 'pagamento', p.data, p.nota, null,
         0::numeric, p.valor_eur
    from public.pagamentos p
   where public.ve_conta_corrente()
     and p.aluno_id in (select public.meus_alunos());

-- Sumários para o aluno: data, duração e texto. SEM valor —
-- é isto que separa o §94 do §46.
create or replace view public.v_sumarios as
  select ea.aluno_id, e.id, e.data, e.duracao_min, e.sumario
    from public.explicacao_alunos ea
    join public.explicacoes e on e.id = ea.explicacao_id
   where public.ve_materiais()
     and ea.aluno_id in (select public.meus_alunos());

-- Materiais atribuídos e já publicados. Um material com data
-- futura não aparece aqui de forma nenhuma: não há contagem,
-- nem indício de que exista (§148).
create or replace view public.v_materiais as
  select ma.aluno_id, m.id, m.titulo, m.disciplina, m.ano,
         m.storage_path, m.tamanho_bytes, ma.publicar_em
    from public.material_alunos ma
    join public.materiais m on m.id = ma.material_id
   where public.ve_materiais()
     and ma.aluno_id in (select public.meus_alunos())
     and (ma.publicar_em is null or ma.publicar_em <= current_date);

-- TPCs com os materiais associados que já estejam publicados.
create or replace view public.v_tpcs as
  select t.id, t.aluno_id, t.descricao, t.entrega, t.estado, t.nota, t.criado_em,
         coalesce((
           select jsonb_agg(jsonb_build_object('id', m.id, 'titulo', m.titulo,
                                               'storage_path', m.storage_path))
             from public.tpc_materiais tm
             join public.materiais m on m.id = tm.material_id
             join public.material_alunos ma
               on ma.material_id = m.id and ma.aluno_id = t.aluno_id
            where tm.tpc_id = t.id
              and (ma.publicar_em is null or ma.publicar_em <= current_date)
         ), '[]'::jsonb) as materiais
    from public.tpcs t
   where public.ve_materiais()
     and t.aluno_id in (select public.meus_alunos());

-- A nota em vigor para a próxima explicação, uma por educando.
create or replace view public.v_nota_proxima as
  select distinct on (n.aluno_id) n.aluno_id, n.id, n.texto, n.criado_em
    from public.notas_proxima n
   where public.ve_materiais()
     and n.consumida_em is null
     and n.aluno_id in (select public.meus_alunos())
   order by n.aluno_id, n.criado_em desc;

revoke all on public.v_meus_alunos, public.v_conta_corrente, public.v_sumarios,
              public.v_materiais, public.v_tpcs, public.v_nota_proxima from anon;
grant select on public.v_meus_alunos, public.v_conta_corrente, public.v_sumarios,
                public.v_materiais, public.v_tpcs, public.v_nota_proxima to authenticated;

-- ============================================================
-- 12. Escritas que as famílias podem fazer
-- Só uma: o aluno assinalar que fez o TPC (§167). Passa por uma
-- função para não haver UPDATE nenhum aberto sobre `tpcs`.
-- ============================================================
create or replace function public.marcar_tpc_feito(p_tpc uuid, p_feito boolean default true)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.ve_materiais() then
    raise exception 'sem permissão';
  end if;
  update public.tpcs t
     set estado   = case when p_feito then 'feito_aluno' else 'por_fazer' end,
         feito_em = case when p_feito then now() else null end
   where t.id = p_tpc
     and t.aluno_id in (select public.meus_alunos())
     -- Um TPC já confirmado pela explicadora não volta atrás pela
     -- mão do aluno.
     and t.estado <> 'confirmado';
  if not found then
    raise exception 'TPC não encontrado ou já confirmado';
  end if;
end $$;

revoke all on function public.marcar_tpc_feito(uuid, boolean) from anon;
grant execute on function public.marcar_tpc_feito(uuid, boolean) to authenticated;

-- ============================================================
-- 13. Registar uma explicação
-- Feito numa transação para o valor de cada aluno e o consumo
-- das notas da secção 7 não poderem ficar meio feitos.
-- Registar É o estado "dada": não há segundo passo (§212).
-- ============================================================
create or replace function public.registar_explicacao(
  p_data date, p_duracao_min integer, p_sumario text, p_alunos jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_id uuid;
  v_item jsonb;
begin
  if not public.e_admin() then
    raise exception 'sem permissão';
  end if;

  insert into public.explicacoes (data, duracao_min, sumario)
  values (p_data, p_duracao_min, nullif(trim(p_sumario), ''))
  returning id into v_id;

  -- p_alunos: [{"aluno_id": "...", "valor_eur": 8}, ...]
  for v_item in select * from jsonb_array_elements(p_alunos) loop
    insert into public.explicacao_alunos (explicacao_id, aluno_id, valor_eur)
    values (v_id, (v_item->>'aluno_id')::uuid, (v_item->>'valor_eur')::numeric);

    -- A nota "importante para a próxima" que já existia cumpriu
    -- o seu papel; uma escrita depois desta explicação fica.
    update public.notas_proxima
       set consumida_em = now()
     where aluno_id = (v_item->>'aluno_id')::uuid
       and consumida_em is null;
  end loop;

  return v_id;
end $$;

revoke all on function public.registar_explicacao(date, integer, text, jsonb) from anon;
grant execute on function public.registar_explicacao(date, integer, text, jsonb) to authenticated;

-- ============================================================
-- 14. Arquivar um aluno (§10)
-- Não há eliminação definitiva. O que se apaga são os materiais
-- atribuídos EXCLUSIVAMENTE a este aluno — a aplicação mostra a
-- lista e o número antes de confirmar (§191). Esta função só
-- devolve a lista; quem apaga os ficheiros do Storage é o
-- cliente, a seguir, com a confirmação já dada.
-- ============================================================
create or replace function public.materiais_exclusivos(p_aluno uuid)
returns table (id uuid, titulo text, storage_path text, tamanho_bytes bigint)
language sql stable security definer set search_path = public as $$
  select m.id, m.titulo, m.storage_path, m.tamanho_bytes
    from public.materiais m
    join public.material_alunos ma on ma.material_id = m.id
   where public.e_admin()
     and ma.aluno_id = p_aluno
     and not exists (
       select 1 from public.material_alunos outro
        where outro.material_id = m.id and outro.aluno_id <> p_aluno
     )
$$;

revoke all on function public.materiais_exclusivos(uuid) from anon;
grant execute on function public.materiais_exclusivos(uuid) to authenticated;

-- Saldo final guardado no momento do arquivo, para o arquivo
-- continuar a dizer a verdade mesmo depois de tudo mudar.
alter table public.alunos add column if not exists saldo_final numeric(10,2);

-- ============================================================
-- 15. Storage — bucket privado `materiais`
-- Criar o bucket no painel: Storage → New bucket → nome
-- `materiais`, "Public bucket" DESLIGADO. Depois correr isto.
--
-- Sem estas políticas, o URL assinado não chega a ser emitido:
-- o Supabase só assina o que a conta podia ler.
-- ============================================================
insert into storage.buckets (id, name, public)
values ('materiais', 'materiais', false)
on conflict (id) do update set public = false;

drop policy if exists "admin gere materiais" on storage.objects;
create policy "admin gere materiais" on storage.objects
  for all to authenticated
  using (bucket_id = 'materiais' and public.e_admin())
  with check (bucket_id = 'materiais' and public.e_admin());

-- A consulta tem de correr como dona das tabelas: `material_alunos` e
-- `materiais` também têm RLS, e dentro de uma política elas continuam a ser
-- filtradas. Feita à mão dentro do USING, o EXISTS via sempre zero linhas e o
-- aluno não alcançava o ficheiro que era dele.
create or replace function public.posso_ler_ficheiro(p_path text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1
      from public.material_alunos ma
      join public.materiais m on m.id = ma.material_id
     where m.storage_path = p_path
       and ma.aluno_id in (select public.meus_alunos())
       and (ma.publicar_em is null or ma.publicar_em <= current_date)
  )
$$;

revoke all on function public.posso_ler_ficheiro(text) from anon;
grant execute on function public.posso_ler_ficheiro(text) to authenticated;

drop policy if exists "aluno lê o que lhe foi atribuído" on storage.objects;
create policy "aluno lê o que lhe foi atribuído" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'materiais'
    and public.ve_materiais()
    and public.posso_ler_ficheiro(name)
  );

-- ============================================================
-- 16. O primeiro administrador
-- Depois de criares a tua conta em Authentication → Users,
-- corre isto UMA vez com o teu email:
--
--   update public.perfis set is_admin = true, nome = 'Maria'
--    where id = (select id from auth.users where email = 'o-teu@email');
-- ============================================================
