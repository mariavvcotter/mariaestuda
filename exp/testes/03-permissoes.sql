set role authenticated;

-- ============ mãe da Rita (só conta corrente, um educando) ============
select como('00000000-0000-0000-0000-00000000000b');
select espera('mãe vê 1 educando', conta('select * from v_meus_alunos'), '1');
select espera('mãe vê os 2 movimentos da Rita', conta('select * from v_conta_corrente'), '2');
select espera('mãe NÃO lê a tabela alunos em bruto', conta('select * from alunos'), '0');
select espera('mãe NÃO lê explicacao_alunos em bruto', conta('select * from explicacao_alunos'), '0');
select espera('mãe NÃO lê pagamentos em bruto', conta('select * from pagamentos'), '0');
select espera('mãe NÃO vê sumários (não tem ve_materiais)', conta('select * from v_sumarios'), '0');
select espera('mãe NÃO vê materiais', conta('select * from v_materiais'), '0');
select espera('mãe NÃO vê ficheiros no storage', conta('select * from storage.objects'), '0');
select espera('mãe NÃO vê os perfis dos outros', conta('select * from perfis'), '1');
select espera('saldo da Rita: 20 pago − 8 devido = 12',
  (select to_char(sum(credito) - sum(debito), 'FM999990.00') from v_conta_corrente), '12.00');
select espera('mãe NÃO consegue registar uma explicação',
  conta('select registar_explicacao(current_date, 60, ''x'', ''[]''::jsonb)'), 'NEGADO');
select espera('mãe NÃO consegue inserir um pagamento a si própria',
  tenta('insert into pagamentos (aluno_id, data, valor_eur)
         values (''10000000-0000-0000-0000-000000000001'', current_date, 999)'), 'NEGADO');
select espera('e a tabela continua com 1 pagamento',
  (select count(*)::text from v_conta_corrente where tipo = 'pagamento'), '1');

-- ============ Rita (aluna) — data de publicação ============
select como('00000000-0000-0000-0000-00000000000f');
select espera('Rita vê 2 dos 3 materiais: o de data futura não conta',
  conta('select * from v_materiais'), '2');
select espera('o "Teste modelo" (publicar daqui a 7 dias) está invisível',
  conta('select * from v_materiais where titulo = ''Teste modelo'''), '0');
select espera('e o ficheiro dele também está fora de alcance',
  conta('select * from storage.objects where name = ''mat/teste.pdf'''), '0');
select espera('Rita alcança os 2 ficheiros publicados',
  conta('select * from storage.objects'), '2');
select espera('Rita NÃO vê conta corrente nenhuma', conta('select * from v_conta_corrente'), '0');

-- ============ Tomás (aluno) ============
select como('00000000-0000-0000-0000-00000000000c');
select espera('Tomás vê-se a si próprio', conta('select * from v_meus_alunos'), '1');
select espera('Tomás vê o sumário da explicação de grupo', conta('select * from v_sumarios'), '1');
select espera('Tomás NÃO vê valores', conta('select * from v_conta_corrente'), '0');
select espera('Tomás vê só o material partilhado', conta('select * from v_materiais'), '1');
select espera('e é a Tabuada', (select titulo from v_materiais), 'Tabuada');
select espera('Tomás alcança só esse ficheiro', conta('select * from storage.objects'), '1');
select espera('e é mat/tabuada.pdf', (select name from storage.objects), 'mat/tabuada.pdf');
select espera('Tomás vê os seus 2 TPCs', conta('select * from v_tpcs'), '2');
select espera('Tomás NÃO vê o TPC da Rita',
  conta('select * from v_tpcs where aluno_id = ''10000000-0000-0000-0000-000000000001'''), '0');
select espera('Tomás vê a nota da próxima explicação',
  (select texto from v_nota_proxima), 'Trazer o caderno de Estudo do Meio');
select marcar_tpc_feito('40000000-0000-0000-0000-000000000001');
select espera('marca o seu TPC como feito',
  (select estado from v_tpcs where id = '40000000-0000-0000-0000-000000000001'), 'feito_aluno');
select espera('NÃO desmarca um TPC já confirmado pela explicadora',
  conta('select marcar_tpc_feito(''40000000-0000-0000-0000-000000000002'', false)'), 'NEGADO');
select espera('NÃO marca o TPC da Rita',
  conta('select marcar_tpc_feito(''40000000-0000-0000-0000-000000000003'')'), 'NEGADO');
select espera('NÃO se dá a si próprio uma nota (0 linhas mudadas)',
  tenta('update tpcs set nota = 5 where id = ''40000000-0000-0000-0000-000000000001'''), '0');
select espera('e o TPC continua sem nota',
  coalesce((select nota::text from v_tpcs where id = '40000000-0000-0000-0000-000000000001'), 'sem nota'),
  'sem nota');

-- ============ pai do Tomás ============
select como('00000000-0000-0000-0000-00000000000e');
select espera('pai vê o movimento do Tomás', conta('select * from v_conta_corrente'), '1');
select espera('pai vê 8 € — o débito é por aluno, não por sessão',
  (select to_char(sum(debito), 'FM999990.00') from v_conta_corrente), '8.00');
select espera('pai NÃO vê nada da Rita',
  conta('select * from v_conta_corrente where aluno_id = ''10000000-0000-0000-0000-000000000001'''), '0');
select espera('pai NÃO vê materiais nem TPCs', conta('select * from v_tpcs'), '0');

-- ============ conta desativada ============
reset role;
update public.perfis set ativo = false where id = '00000000-0000-0000-0000-00000000000e';
set role authenticated;
select como('00000000-0000-0000-0000-00000000000e');
select espera('conta desativada deixa de ver a conta corrente',
  conta('select * from v_conta_corrente'), '0');
reset role;
update public.perfis set ativo = true where id = '00000000-0000-0000-0000-00000000000e';
set role authenticated;

-- ============ administradora ============
select como('00000000-0000-0000-0000-00000000000a');
select espera('admin vê os 3 alunos', conta('select * from alunos'), '3');
select espera('admin vê os 6 perfis', conta('select * from perfis'), '6');
select espera('admin vê os 3 ficheiros', conta('select * from storage.objects'), '3');
select espera('materiais exclusivos do Tomás: nenhum (a tabuada é partilhada)',
  conta('select * from materiais_exclusivos(''10000000-0000-0000-0000-000000000002'')'), '0');
select espera('materiais exclusivos da Rita: 2 (fichas e teste)',
  conta('select * from materiais_exclusivos(''10000000-0000-0000-0000-000000000001'')'), '2');

-- registar explicação: valor congelado e nota consumida
select registar_explicacao(current_date, 90, 'Revisões', jsonb_build_array(
  jsonb_build_object('aluno_id', '10000000-0000-0000-0000-000000000002', 'valor_eur', 12)));
select espera('a explicação nova entra com o valor escrito',
  (select to_char(valor_eur, 'FM999990.00') from explicacao_alunos ea
     join explicacoes e on e.id = ea.explicacao_id where e.sumario = 'Revisões'), '12.00');
select espera('registar consumiu a nota da próxima explicação',
  (select count(*)::text from notas_proxima
    where aluno_id = '10000000-0000-0000-0000-000000000002' and consumida_em is null), '0');

-- mudar o preço-hora não recalcula o passado (§101)
reset role;
update public.alunos set preco_hora = 99 where id = '10000000-0000-0000-0000-000000000002';
set role authenticated;
select como('00000000-0000-0000-0000-00000000000a');
select espera('mudar o preço-hora não mexe nos valores já registados',
  (select to_char(sum(valor_eur), 'FM999990.00') from explicacao_alunos
    where aluno_id = '10000000-0000-0000-0000-000000000002'), '20.00');

-- uma nota escrita DEPOIS da explicação fica de pé (§176)
reset role;
insert into public.notas_proxima (aluno_id, texto)
  values ('10000000-0000-0000-0000-000000000002', 'Trazer a calculadora');
set role authenticated;
select como('00000000-0000-0000-0000-00000000000c');
select espera('a nota escrita depois da explicação continua visível',
  (select texto from v_nota_proxima), 'Trazer a calculadora');
reset role;
