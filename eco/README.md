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
dados/perguntas-*.js  as perguntas de escolha múltipla, com explicação
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
| 🌟 Fantástico | 90% ou mais **e** já respondeu a 80% das perguntas da unidade |

O painel geral diz em quantas das 12 unidades o aluno está em Bem ou
Fantástico. No treino, as perguntas que o aluno nunca viu têm prioridade, e a
ordem das perguntas e das opções é sempre baralhada.

## Segurança

A conta é a do resto do site, tal como está: a tabela `edc_users` está aberta à
chave pública. Quem souber usar a consola do navegador lê os nomes, os PIN e o
progresso de todas as contas, e pode alterá-los. Vale para o `/edc` e para o
`/eco` por igual. Não guardar ali nada sensível.

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
