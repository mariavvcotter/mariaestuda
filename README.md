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
tools/cv-en.html      versão curta do CV, em inglês, feita para imprimir
tools/build-cv-pdf.mjs  gera o PDF a partir dela
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

A versão curta em inglês, para anexar a candidaturas, vive em `tools/cv-en.html`
e não está ligada a partir do site.

```sh
npm i playwright
node tools/build-cv-pdf.mjs maria-cotter-cv.pdf
```

Sai uma página A4. O ficheiro não é versionado: regenera-se sempre que a fonte
mudar, para não haver duas versões a divergir.
