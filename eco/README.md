# Economia A — mariaestuda.eu/eco

Plataforma de estudo para os alunos de Economia A: resumos por unidade,
exercícios de escolha múltipla com explicação, painel de progresso e notícias
comentadas. Estática, sem compilação, publicada pelo GitHub Pages como o resto
do site. Pensada primeiro para o telemóvel.

**O login é o do resto do site** (`/account/`), igual ao do `/edc` e ao da
versão Benfica: opcional, Nome + PIN, a mesma conta em todas as secções. Sem
conta, o aluno estuda como convidado e o progresso fica no aparelho. Com conta,
o progresso da Economia vai para a fatia `"eco"` da tabela `edc_users`.

A versão anterior (EconoSL, com o tema do Benfica) ficou em `/eco/benfica/`.

```
index.html          estrutura (o conteúdo é desenhado pelo app.js)
style.css           desenho; claro e escuro, segue o telemóvel
app.js              ecrãs, treino, níveis, gestão
config.js           resumos abertos quando não há base de dados
schema.sql          resumos abertos e gestão — correr uma vez no Supabase
dados/unidades.js   as 11 unidades (título, ano, cor, ícone)
dados/resumos-*.js  os resumos (a: U1–U4, b: U5–U7, c: U8–U11)
dados/perguntas-*.js  as perguntas de escolha múltipla, com explicação
dados/noticias.js   notícias do Público e do Observador, com análise
testes/             schema.sh (PostgreSQL) e navegador.cjs (Playwright)
```

## Pôr a funcionar (uma vez)

O login já funciona: é o mesmo projeto Supabase de `/account/config.js`. O
`schema.sql` só é preciso para a parte da professora. Sem ele, os resumos
abertos são os de `desbloqueadasSemBD` em `config.js` e a gestão não abre.

1. Painel do Supabase → **SQL Editor** → colar e correr o `schema.sql` todo.
2. No mesmo sítio, definir a palavra-passe da gestão (10 caracteres ou mais):
   ```sql
   select eco_definir_senha('uma frase comprida que só tu sabes');
   ```
3. Em `mariaestuda.eu/eco`, no fundo do Início, **Área da professora**.

## O dia a dia

- **Alunos:** criam conta sozinhos no botão **Entrar** (Nome + PIN), como no
  `/edc`. Quem já tem conta no `/edc` entra com a mesma.
- **Abrir resumos:** Gestão → marcar as unidades → Guardar. Os alunos veem-nas
  logo. Os exercícios de todas as unidades estão sempre abertos.
- **Acompanhar:** a Gestão mostra o nível de cada aluno em cada unidade (só de
  quem estudou com conta iniciada).

## Como se calcula o nível

Conta a **última** resposta do aluno a cada pergunta da unidade, para quem
errou e depois aprendeu subir de nível.

| Nível | Regra |
|---|---|
| ⚪ Por avaliar | menos de 5 perguntas respondidas na unidade |
| 🔴 Mal | menos de 50% certas |
| 🟠 Mais ou menos | 50% a 69% |
| 🟢 Bem | 70% ou mais |
| 🌟 Fantástico | 90% ou mais **e** já respondeu a 80% das perguntas da unidade |

O painel geral diz em quantas das 11 unidades o aluno está em Bem ou
Fantástico. No treino, as perguntas que o aluno nunca viu têm prioridade, e a
ordem das perguntas e das opções é sempre baralhada.

## Segurança: o que protege e o que não protege

- **Protegido:** abrir e fechar resumos exige a palavra-passe da gestão,
  verificada dentro da base de dados. A lista de progresso da Gestão nunca
  devolve PINs. Testado em `testes/schema.sh`.
- **Não protegido (é o sistema de conta do site, tal como está):** a tabela
  `edc_users` está aberta à chave pública. Quem souber usar a consola do
  navegador lê os nomes, os PIN e o progresso de todas as contas, e pode
  alterá-los. Isto vale para o `/edc` e para o `/eco` por igual.
- **Os resumos "fechados" não são segredo.** Estão nos ficheiros `dados/` que
  qualquer pessoa pode abrir. Fechar uma unidade serve para dar ritmo, não
  para esconder.

## Acrescentar conteúdo

**Uma pergunta** (em `dados/perguntas-*.js`):

```js
{ id: 'u3-21', u: 'u3', p: 'Enunciado', o: ['certa', 'errada', 'errada', 'errada'], c: 0, e: 'Explicação' },
```

`c` é a posição da certa dentro de `o`. As opções são baralhadas, por isso
nunca escrever "todas as anteriores" nem referir letras. O `id` não pode
mudar depois de publicado: é por ele que o progresso é guardado.

**Uma notícia** (em `dados/noticias.js`): `u`, `fonte`, `titulo`, `url`,
`data`, `imagem` (endereço de uma foto, ou `null` para a ilustração da
unidade), `resumo`, `analise`, `conceitos`.

## Testes

```sh
# permissões, contra um PostgreSQL local na porta 5433
PGUSER=postgres ./eco/testes/schema.sh

# interface, com o Supabase (conta partilhada e funções) imitado
python3 -m http.server 8766 &
NODE_PATH=$(npm root -g) node eco/testes/navegador.cjs
```
