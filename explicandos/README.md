# Explicações

Aplicação de gestão das explicações, segundo o caderno de encargos v1.0
(18 de setembro de 2026). Substitui o Google Classroom e as folhas de Excel:
conta corrente por aluno, materiais com ritmo controlado, TPCs e as notas de
preparação para a explicação seguinte.

Estática, sem passo de compilação, publicada pelo GitHub Pages como o resto do
site. Fala com o Supabase por HTTP: GoTrue para as sessões, PostgREST para os
dados, Storage para os ficheiros.

```
index.html    entrada e estrutura dos ecrãs
style.css     desenho, com os tokens do resto do site
config.js     endereço do projeto Supabase e chave anon
api.js        sessão, pedidos, ficheiros e a função de contas
ui.js         peças de interface partilhadas (datas, dinheiro, formulários)
app.js        arranque: entra, lê o perfil e escolhe o painel
admin.js      painel da explicadora
familia.js    painel do encarregado e do aluno
schema.sql    tabelas, vistas, funções e regras de acesso — correr uma vez
edge/         função de servidor para criar contas e redefinir palavras-passe
testes/       testes de permissões (SQL) e de interface (navegador)
```

## Segurança: o schema, não a interface

O §36 do caderno assume que basta a interface não expor os materiais de outros
alunos. **Isso não chega, e a aplicação não foi construída assim.**

A razão é simples: a chave anon está no JavaScript, tem de estar. Um aluno com
conta, a consola do browser e essa chave fala com o PostgREST diretamente —
sem passar por ecrã nenhum. Se a proteção vivesse na interface, bastava isso
para ler a conta corrente de todas as famílias.

O que existe em vez disso:

- **RLS em todas as tabelas.** As tabelas em bruto são da administradora e de
  mais ninguém. Uma família que tente lê-las recebe zero linhas.
- **As famílias leem vistas** (`v_conta_corrente`, `v_sumarios`, `v_materiais`,
  `v_tpcs`, `v_nota_proxima`), que filtram por `auth.uid()` e mostram só as
  colunas a que aquela conta tem direito. É isto que deixa o aluno ver o
  sumário de uma explicação sem ver o valor dela.
- **Uma só escrita aberta às famílias**: marcar um TPC como feito, por uma
  função que verifica de quem é o TPC e recusa mexer num já confirmado.
- **Bucket privado e URLs assinados de poucos minutos.** O Supabase só assina
  o que as políticas deixam aquela conta ler. Um link copiado para outro sítio
  deixa de funcionar sozinho.

A segunda metade do §36 fica verdadeira: inspecionar o código não dá nada, e
não vale a pena ofuscar seja o que for.

**O que isto não faz:** quem tiver o email e a palavra-passe entra. Não há
segundo fator. A palavra-passe é toda a segurança de uma conta — por isso o
painel gera uma em vez de deixar escolher à mão.

## Conta corrente

Em euros, por aluno, como manda o §6. Cada explicação é um débito; cada
pagamento é um crédito; o saldo é a diferença. Os pagamentos não se ligam a
explicações nenhumas: quem paga à sessão fica sempre a zero, quem paga ao fim
de umas semanas acumula saldo negativo até pagar.

O valor de cada explicação é **por aluno** — numa explicação de grupo com dois
alunos a 8 €/h, cada um gera 8 € de débito — e fica **congelado no registo**.
Mudar o preço-hora de um aluno não mexe no passado.

Não há modelo de packs: o desconto escreve-se à mão no valor de cada
explicação. Para um engano não passar despercebido, a ficha de cada aluno
mostra o **preço efetivo até hoje** (o que foi cobrado a dividir pelas horas
dadas) e assinala-o quando se afasta do preço de tabela.

## Instalação

1. Painel Supabase → **SQL Editor** → colar o `schema.sql` inteiro e correr.
   Cria as tabelas, as vistas, as funções, as políticas e o bucket privado
   `materiais`.
2. Painel Supabase → **Authentication → Users → Add user** → o teu email e uma
   palavra-passe longa, com *Auto Confirm User* ligado.
3. No **SQL Editor**, dar-te a ti mesma os direitos:

   ```sql
   update public.perfis set is_admin = true, nome = 'Maria'
    where id = (select id from auth.users where email = 'o-teu@email');
   ```

4. Abrir a aplicação no browser e entrar.
5. Opcional, mas recomendado: publicar a função `admin-contas` (ver
   `edge/README.md`) para poderes criar contas sem sair da aplicação.

## Testar

```sh
# permissões, contra um PostgreSQL local — 47 verificações
./explicandos/testes/correr.sh

# interface, num navegador sem rede — 46 verificações
python3 -m http.server 8765 &
node explicandos/testes/navegador.mjs
```

O primeiro é o que interessa: aplica o `schema.sql` a uma base de dados a
sério, cria uma explicadora, duas famílias e um aluno, e verifica linha a
linha que ninguém alcança o que não é seu. Não dá para verificar isso a olho.

O segundo usa um Supabase falso em memória e prova que os ecrãs fazem o que
dizem — incluindo o valor congelado, o débito por aluno em explicações de
grupo, a data de publicação dos materiais e a lista de ficheiros antes de
arquivar.

## Notas

- Não está ligada a partir de lado nenhum do site e leva `noindex, nofollow`.
- **O nome da pasta não está preso em lado nenhum.** Os ficheiros são todos
  irmãos do `index.html` e as ligações entre eles são relativas, por isso a
  pasta serve em `/explicandos/`, em `/exp/` ou onde a puseres. Os testes de
  navegador aceitam `APP=/exp/` para confirmar isso.
- **O horário semanal é decorativo.** Serve para veres o dia e pré-preencher o
  formulário. Uma explicação só existe depois de a registares, e registar é o
  mesmo que dizer que aconteceu — não há segundo passo.
- **Arquivar não apaga o aluno.** Corta o acesso, guarda o saldo final e
  mantém o histórico. Apaga só os materiais atribuídos exclusivamente a ele,
  com a lista e o total à frente antes de confirmar.
- A conta do encarregado só é desativada se não lhe restar outro educando.
- Uma conta nova não vê nada até lhe dares permissões e a ligares a um aluno.
- **Um encarregado por educando**, como no caderno. O caso do avô que paga e
  da irmã que acompanha não está coberto; resolve-se com o perfil misto, ou
  passando `alunos.encarregado_id` para uma tabela de ligação.
- Sem recuperação de palavra-passe por email. O Supabase guarda-as cifradas:
  nem tu as lês, só as substituis, pelo botão na ficha da conta.
