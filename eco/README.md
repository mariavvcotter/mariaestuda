# Economia A — mariaestuda.eu/eco

Plataforma de estudo para os alunos de Economia A: resumos por unidade,
exercícios de escolha múltipla com explicação, painel de progresso e notícias
comentadas. Estática, sem compilação, publicada pelo GitHub Pages como o resto
do site. Pensada primeiro para o telemóvel.

A versão anterior (EconoSL, com o tema do Benfica) ficou em `/eco/benfica/`.

```
index.html          estrutura (o conteúdo é desenhado pelo app.js)
style.css           desenho; claro e escuro, segue o telemóvel
app.js              ecrãs, treino, níveis, gestão
config.js           endereço e chave pública do Supabase
schema.sql          tabelas e funções — correr uma vez no Supabase
dados/unidades.js   as 11 unidades (título, ano, cor, ícone)
dados/resumos-*.js  os resumos (a: U1–U4, b: U5–U7, c: U8–U11)
dados/perguntas-*.js  as perguntas de escolha múltipla, com explicação
dados/noticias.js   notícias do Público e do Observador, com análise
testes/             schema.sh (PostgreSQL) e navegador.cjs (Playwright)
```

## Pôr a funcionar (uma vez)

Sem este passo a plataforma funciona, mas em **modo local**: cada aluno guarda
o progresso só no seu telemóvel, a gestão não abre, e os resumos abertos são
os de `desbloqueadasSemBD` em `config.js`.

1. Painel do Supabase → **SQL Editor** → colar e correr o `schema.sql` todo.
2. No mesmo sítio, definir a palavra-passe da gestão (10 caracteres ou mais):
   ```sql
   select eco_definir_senha('uma frase comprida que só tu sabes');
   ```
3. Abrir `mariaestuda.eu/eco`, carregar em **Sou a professora**, entrar.

O `config.js` aponta para o mesmo projeto Supabase que o `/edc` usa. Se
mudares de projeto (por exemplo para a VPS), é só trocar `url` e `chave`.

## O dia a dia

- **Criar alunos:** Gestão → Novo aluno. O nome de utilizador é sugerido a
  partir do nome (`joana.m42`). O botão **Copiar nome** prepara a mensagem
  para enviar ao aluno.
- **Abrir resumos:** Gestão → marcar as unidades → Guardar. Os alunos veem-nas
  logo. Os exercícios de todas as unidades estão sempre abertos.
- **Acompanhar:** a lista de alunos mostra o nível de cada um em cada unidade.

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

- **Protegido:** a gestão (criar/apagar alunos, abrir resumos, ver o progresso
  de todos) exige a palavra-passe, verificada dentro da base de dados. As
  tabelas não são acessíveis com a chave pública; os alunos não conseguem
  listar outros alunos. Testado em `testes/schema.sh`.
- **Não protegido, por escolha:** quem souber o nome de utilizador de um aluno
  entra no perfil dele. É o preço de entrar só com o nome. Por isso a sugestão
  junta uma inicial e um número.
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

# interface, com o Supabase imitado
python3 -m http.server 8766 &
NODE_PATH=$(npm root -g) node eco/testes/navegador.cjs
```
