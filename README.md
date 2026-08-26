# mariaestuda.eu

Site pessoal. Estático, sem passo de compilação, publicado por GitHub Pages a
partir do `main`.

```
index.html            candidatura / CV
assets/css/style.css  design: tokens, tipografia, layout
assets/css/fonts.css  @font-face das fontes locais (gerado)
assets/fonts/         Bodoni Moda e Outfit, variáveis, 212 KB
assets/img/           retrato e fotografias
assets/js/main.js     revelação ao scroll, barra de topo, flashcards e quiz
cv/                   redireciona para a raiz (o CV viveu aqui)
```

As restantes pastas (`ci/`, `explicacoes/`, `lpuplayback/`, `portugues/`, ...)
são projetos independentes, cada um com o seu design.

## Notas sobre a página principal

- **Tema único e claro**, por opção. Todas as cores são pintadas
  explicitamente, sem modo escuro.
- **Sem JavaScript continua legível.** As animações só escondem elementos
  depois de `main.js` marcar `<html class="js">`, e o quiz é substituído por um
  resumo em texto.
- **Flashcards**: viram com o rato (`:hover`, só em dispositivos com ponteiro),
  com o teclado (`:focus-visible`) e ao toque (`aria-expanded`, via JS).
- **O eixo óptico do Bodoni está fixo**: em `auto` o browser afina os traços
  finos até a travessa do «t» desaparecer.
- **Folha de estilo de impressão**: esconde navegação e quiz, e abre os
  flashcards para o verso aparecer no papel.

Testar localmente a partir da raiz, porque há ligações absolutas entre secções:

```sh
python3 -m http.server 8000
```
