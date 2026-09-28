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
app.js              ecrãs, treino, níveis
dados/unidades.js   as 12 unidades (título, ano, cor, ícone)
dados/resumos-*.js  os resumos (a: U1–U4, b: U5–U7, c: U9–U12, d: U8)
dados/perguntas-*.js  perguntas de escolha múltipla escritas para a plataforma
dados/exames/uN.js  perguntas de exames nacionais (14 Dias · IAVE), com explicação
img/perguntas/      tabelas e gráficos recortados dos PDF, um por pergunta que precisa
ferramentas/        extrator dos PDF 14 Dias, recortes e imagens das notícias
dados/noticias.js   notícias do Público e do Observador, com análise
testes/             navegador.cjs (Playwright)
```

## Como funciona

- **Tudo aberto:** os 12 resumos, as perguntas de todas as unidades e as
  notícias estão disponíveis para todos. Não há área da professora nem
  nada para configurar no Supabase além da conta que já existe.
- **Conta:** o aluno cria-a sozinho no botão **Entrar** (Nome + PIN), como no
  `/edc`. Quem já tem conta no `/edc` entra com a mesma.

## Como se calcula o nível

Conta a **última** resposta do aluno a cada pergunta da unidade, para quem
errou e depois aprendeu subir de nível.

| Nível | Regra |
|---|---|
| ⚪ Por avaliar | menos de 5 perguntas respondidas na unidade |
| 🔴 Mal | menos de 50% certas |
| 🟠 Mais ou menos | 50% a 69% |
| 🟢 Bem | 70% ou mais |
| 🌟 Fantástico | 90% ou mais **e** já respondeu a 40 perguntas da unidade (ou 80%, se tiver menos) |

O painel geral diz em quantas das 12 unidades o aluno está em Bem ou
Fantástico. No treino, as perguntas que o aluno nunca viu têm prioridade, e a
ordem das perguntas e das opções é sempre baralhada.

## Segurança

A conta é a do resto do site, tal como está: a tabela `edc_users` está aberta à
chave pública. Quem souber usar a consola do navegador lê os nomes, os PIN e o
progresso de todas as contas, e pode alterá-los. Vale para o `/edc` e para o
`/eco` por igual. Não guardar ali nada sensível.

## Perguntas de exame (14 Dias)

As perguntas de exame vêm dos PDF «14 Dias – Itens de Seleção» de cada unidade,
com a resposta certa tirada do PDF dos critérios de correção correspondente.
Para refazer ou acrescentar unidades:

```sh
pip install pypdf pymupdf
# 1. texto de cada PDF (perguntas e critérios) para uma pasta
# 2. perguntas + respostas → JSON por unidade
python3 eco/ferramentas/extrair_14dias.py PASTA_TXT PASTA_JSON
# 3. recortar tabelas e gráficos para eco/img/perguntas/ (acrescenta "img" ao JSON)
python3 eco/ferramentas/recortes_14dias.py PASTA_PDF PASTA_JSON eco/img/perguntas
```

O extrator confirma, unidade a unidade, que há tantas perguntas completas
quanto respostas nos critérios. Ficam de fora os itens de «completar o texto»
(1/2/3), que não são de escolha A–D. As explicações e a limpeza do texto foram
escritas depois, pergunta a pergunta, mantendo sempre a letra oficial; quando a
resposta oficial parecia discutível ficou marcada com `duvida`.

No treino, o interruptor «Só perguntas de exames nacionais» deixa de fora as
perguntas escritas para a plataforma.

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
python3 -m http.server 8766 &      # na raiz do repositório
NODE_PATH=$(npm root -g) node eco/testes/navegador.cjs
```
