# Explicandos

Aplicação privada para gerir os alunos das explicações: quem são, que aulas
tiveram, o que pagaram e — o que interessa mesmo — **quantas horas ainda têm
no pack** e **quanto está por cobrar**.

Estática, sem passo de compilação, como o resto do site. Fala diretamente com
o Supabase por HTTP: GoTrue para o login, PostgREST para os dados.

```
index.html   estrutura (login, painel, alunos, aulas, dinheiro)
style.css    desenho, com os tokens do resto do site; feito para telemóvel
app.js       tudo o resto: sessão, pedidos, contas e formulários
config.js    URL do projeto Supabase e chave anon
schema.sql   as três tabelas e as regras de acesso — correr uma vez
```

## A ideia: o saldo mede-se em horas

Um pack de 10h e uma aula avulsa paga na hora são a mesma coisa vista de
ângulos diferentes, por isso não há dois mecanismos:

- um **pagamento** acrescenta as horas que comprou (`horas_credito`) e regista
  o dinheiro que entrou (`valor_eur`), que são números independentes — é aí
  que vive o desconto do pack;
- uma **aula** gasta as horas que durou.

Saldo = horas compradas − horas gastas. Positivo é o que falta dar do pack;
negativo são aulas já dadas e ainda não pagas, e a app converte-as em euros
pelo preço/hora do aluno.

Uma aula desmarcada a tempo não desconta; uma falta sem aviso desconta. A
caixa `Desconta horas do saldo` acompanha o estado escolhido, mas pode ser
mudada à mão — as exceções decidem-se caso a caso, não por regra.

## Segurança: ao contrário do resto do site

As outras secções (`smoothies`, `usage_events`, contas com Nome + PIN) usam a
chave anon com políticas abertas e dizem-no na cara: não é segurança real.
Para comentários de smoothies tanto faz.

Aqui há nomes de crianças, contactos dos encarregados e registos de
pagamentos, por isso **nada disto é acessível com a chave anon**. As tabelas
`exp_*` têm RLS que só deixa passar um utilizador autenticado, e o `anon`
está explicitamente revogado. A chave que está em `config.js` serve só de
`apikey` no pedido; sozinha não abre nenhuma tabela.

O que isto **não** faz: qualquer pessoa com o email e a palavra-passe entra.
Não há segundo fator. Vale o que valer a palavra-passe escolhida.

A sessão fica em `localStorage` (token de acesso e de renovação), para não
haver login a cada aula registada no telemóvel. `Sair` apaga-a.

## Instalação

1. Painel Supabase → **SQL Editor** → colar o `schema.sql` inteiro e correr.
2. Painel Supabase → **Authentication → Users → Add user** → email e uma
   palavra-passe longa. É a única conta que entra.
3. Abrir `/explicandos/` e entrar.

Se o projeto Supabase mudar, é o `config.js` que se atualiza.

## Testar localmente

A partir da raiz do repositório, porque os caminhos são absolutos:

```sh
python3 -m http.server 8000
```

Depois `http://localhost:8000/explicandos/`.

## Notas

- Não está ligada a partir de lado nenhum do site e leva `noindex, nofollow`.
  Chega-se lá pelo endereço.
- Apagar um aluno apaga as aulas e os pagamentos dele (cascata). Para deixar
  de o ver sem perder o histórico, usar **Arquivar**.
- As listas de aulas e pagamentos mostram os 60 movimentos mais recentes; a
  ficha de cada aluno mostra os 40 dele.
