-- Contas: a explicadora, a mãe da Rita, o Tomás (aluno), a Beatriz (misto).
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000000a', 'maria@exemplo.pt'),
  ('00000000-0000-0000-0000-00000000000b', 'mae.rita@exemplo.pt'),
  ('00000000-0000-0000-0000-00000000000c', 'tomas@exemplo.pt'),
  ('00000000-0000-0000-0000-00000000000d', 'beatriz@exemplo.pt'),
  ('00000000-0000-0000-0000-00000000000e', 'pai.tomas@exemplo.pt');

update public.perfis set is_admin = true, nome = 'Maria'
  where id = '00000000-0000-0000-0000-00000000000a';
update public.perfis set ve_conta_corrente = true, nome = 'Mãe da Rita'
  where id = '00000000-0000-0000-0000-00000000000b';
update public.perfis set ve_materiais = true, nome = 'Tomás'
  where id = '00000000-0000-0000-0000-00000000000c';
update public.perfis set ve_conta_corrente = true, ve_materiais = true, nome = 'Beatriz'
  where id = '00000000-0000-0000-0000-00000000000d';
update public.perfis set ve_conta_corrente = true, nome = 'Pai do Tomás'
  where id = '00000000-0000-0000-0000-00000000000e';

insert into public.alunos (id, nome, ano, preco_hora, encarregado_id, aluno_perfil_id) values
  ('10000000-0000-0000-0000-000000000001', 'Rita Silva',    '5.º ano',  10,
   '00000000-0000-0000-0000-00000000000b', null),
  ('10000000-0000-0000-0000-000000000002', 'Tomás Faria',   '3.º ano',  10,
   '00000000-0000-0000-0000-00000000000e', '00000000-0000-0000-0000-00000000000c'),
  ('10000000-0000-0000-0000-000000000003', 'Beatriz Nunes', '11.º ano', 15,
   '00000000-0000-0000-0000-00000000000d', '00000000-0000-0000-0000-00000000000d');

-- Uma explicação de grupo: Rita e Tomás, 8 € cada (§98-99).
insert into public.explicacoes (id, data, duracao_min, sumario) values
  ('20000000-0000-0000-0000-000000000001', current_date - 3, 60, 'Frações equivalentes');
insert into public.explicacao_alunos values
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 8),
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 8);

insert into public.pagamentos (aluno_id, data, valor_eur, nota) values
  ('10000000-0000-0000-0000-000000000001', current_date - 1, 20, 'MB Way');

-- Materiais: um só da Rita (publicado), um só da Rita com data futura,
-- um partilhado pela Rita e pelo Tomás.
insert into public.materiais (id, titulo, disciplina, ano, storage_path, tamanho_bytes) values
  ('30000000-0000-0000-0000-000000000001', 'Fichas de frações', 'Matemática', '5', 'mat/fracoes.pdf', 120000),
  ('30000000-0000-0000-0000-000000000002', 'Teste modelo',      'Matemática', '5', 'mat/teste.pdf',   90000),
  ('30000000-0000-0000-0000-000000000003', 'Tabuada',           'Matemática', '3', 'mat/tabuada.pdf', 40000);
insert into public.material_alunos (material_id, aluno_id, publicar_em) values
  ('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', null),
  ('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', current_date + 7),
  ('30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', null),
  ('30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', null);
insert into storage.objects (bucket_id, name) values
  ('materiais', 'mat/fracoes.pdf'), ('materiais', 'mat/teste.pdf'), ('materiais', 'mat/tabuada.pdf');

-- TPCs: um do Tomás por fazer, um já confirmado com nota.
insert into public.tpcs (id, aluno_id, descricao, estado, nota, confirmado_em) values
  ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002',
   'Exercícios 3 a 7 da página 42', 'por_fazer', null, null),
  ('40000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002',
   'Tabuada do 7', 'confirmado', 4, now()),
  ('40000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001',
   'Ler o capítulo 2', 'por_fazer', null, null);
insert into public.tpc_materiais values
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000003');

insert into public.notas_proxima (aluno_id, texto) values
  ('10000000-0000-0000-0000-000000000002', 'Trazer o caderno de Estudo do Meio');

-- A Rita também tem conta de aluna, para se poder testar a data de publicação.
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-00000000000f', 'rita@exemplo.pt');
update public.perfis set ve_materiais = true, nome = 'Rita'
  where id = '00000000-0000-0000-0000-00000000000f';
update public.alunos set aluno_perfil_id = '00000000-0000-0000-0000-00000000000f'
  where id = '10000000-0000-0000-0000-000000000001';
