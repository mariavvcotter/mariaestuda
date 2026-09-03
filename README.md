# mariaestuda.eu

Site pessoal. Estático, sem passo de compilação, publicado por GitHub Pages a
partir do `main`.

```
index.html            candidatura / CV
assets/css/style.css  design: tokens, tipografia, layout
assets/css/fonts.css  @font-face das fontes locais (gerado)
assets/fonts/         Playfair Display, Dancing Script e Inter, 332 KB
assets/img/           retrato e fotografias
assets/js/main.js     idioma, revelação ao scroll, barra de topo, flashcards e quiz
assets/js/i18n.js     traduções inglesas (o português vive no HTML)
cv/                   redireciona para a raiz (o CV viveu aqui)
tools/cv-pt.html      versão curta do CV, em português, feita para imprimir
tools/cv-en.html      a mesma, em inglês
tools/cv-print.css    folha de estilo partilhada pelas duas
tools/build-cv-pdf.mjs  gera os PDF a partir delas
```

As restantes pastas (`ci/`, `explicacoes/`, `lpuplayback/`, `portugues/`, ...)
são projetos independentes, cada um com o seu design.

## Notas sobre a página principal

- **Tema único e claro**, por opção. Todas as cores são pintadas
  explicitamente, sem modo escuro.
- **Sem JavaScript continua legível.** As animações só escondem elementos
  depois de `main.js` marcar `<html class="js">`, e o quiz é substituído por um
  resumo em texto.
- **Flashcards**: viram só ao clique, nunca ao passar o rato. Sem JavaScript
  as duas faces aparecem empilhadas, para as razões não se perderem.
- **Quiz em slides**: uma pergunta de cada vez, a caixa acompanha a altura do
  slide visível. O resultado é honesto: quando há desencontros de fundo,
  di-lo em vez de agradar.
- **Uma só cor de acento**, um laranja escuro escolhido para ser legível em
  texto pequeno. Onde havia frisos, há sombras dessa cor.
- **Português e inglês.** O português é o que está escrito no HTML e é lido de
  lá na primeira passagem, por isso `i18n.js` só contém o inglês. Cada texto
  traduzível tem um `data-i18n`; para acrescentar um, basta pôr o atributo e a
  entrada correspondente no dicionário.
- **Não guarda nada.** Sem cookies, sem `localStorage`, sem `sessionStorage`.
  A escolha de idioma vive no endereço (`?lang=pt` ou `?lang=en`), escrito com
  `history.replaceState`. Sobrevive a um recarregamento e pode ser partilhada
  já na língua certa, mas não deixa rasto no navegador de quem visita. O custo
  é que uma visita nova, sem parâmetro, volta a ver o diálogo.
- **Folha de estilo de impressão**: esconde navegação e quiz, e abre os
  flashcards para o verso aparecer no papel.

Testar localmente a partir da raiz, porque há ligações absolutas entre secções:

```sh
python3 -m http.server 8000
```

## Gerar o CV em PDF

As versões curtas, para anexar a candidaturas, vivem em `tools/cv-pt.html` e
`tools/cv-en.html`. Não estão ligadas a partir do site e levam `noindex`.

```sh
npm i playwright
node tools/build-cv-pdf.mjs              # os dois PDF
node tools/build-cv-pdf.mjs pt           # só o português
node tools/build-cv-pdf.mjs en saida.pdf # o inglês, com nome escolhido
```

Cada um sai numa folha A4. As duas partilham `cv-print.css`, para não
divergirem no aspeto: o português é cerca de 15% mais longo, e é por isso que
o espaçamento está apertado o suficiente para os dois caberem.

Os PDF não são versionados: regeneram-se sempre que a fonte mudar.
