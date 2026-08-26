# Maria Leonor Cotter — CV em formato website

Vive em `/cv/` dentro do site **mariaestuda.eu**, publicado em
https://mariaestuda.eu/cv/

Site pessoal de uma página, estático, sem dependências nem passo de compilação.
Abre `index.html` num browser e funciona.

## Estrutura

```
index.html                  toda a estrutura e o conteúdo
assets/css/style.css        design (tokens de cor, tipografia, layout)
assets/css/fonts.css        @font-face das fontes locais — gerado, não editar à mão
assets/fonts/*.woff2        Bodoni Moda + Outfit (variáveis, 136 KB no total)
assets/img/*.jpg            retrato e fotografias dos projetos
assets/js/main.js           revelação ao scroll e barra de topo (opcional)
```

## Editar o conteúdo

Todo o texto está em `index.html`, dividido por secções comentadas
(`HERO`, `SOBRE`, `EXPERIÊNCIAS`, `FORMAÇÃO`, `COMPETÊNCIAS`, `CONTACTO`).
Para acrescentar uma experiência, copia um bloco `<article class="xp">`.

Realces a marcador amarelo: `<mark class="hl">texto</mark>`.

Trocar uma fotografia: substitui o ficheiro em `assets/img/` mantendo o nome,
ou muda o `src` e os atributos `width`/`height` (evitam saltos no layout).

## Design

Segue a identidade dos materiais feitos no Canva: gradiente iridescente,
Bodoni Moda itálico pesado no display, realces a marcador e formas orgânicas
nas fotografias. Os tokens estão no topo de `style.css`.

| Token | Papel |
| --- | --- |
| `--accent` | rosa-choque dos botões e etiquetas |
| `--marker` | amarelo do marcador |
| `--g1`…`--g4` | paragens do gradiente iridescente |
| `--display-opsz` | eixo óptico do Bodoni — ver nota abaixo |

**Nota sobre o Bodoni:** é uma fonte variável com eixo óptico 6–96. Em
`auto`, o browser sobe o eixo em tamanhos grandes e os traços finos ficam tão
finos que a travessa do «t» desaparece — «Cotter» passa a ler-se «Coller».
Por isso o eixo está fixo (`font-optical-sizing: none`).

## Publicar

O site está publicado por GitHub Pages a partir do branch `main`, pelo que
**qualquer alteração a esta pasta fica online assim que chegar ao `main`**.
Não há workflow nem passo de build.

O CV liga-se a outras páginas do mesmo domínio por caminho absoluto
(`/explicacoes/`, `/lpuplayback/`, `/`), por isso só funciona corretamente
servido a partir da raiz do site — abrir `cv/index.html` diretamente do disco
mostra a página bem, mas essas ligações não resolvem. Para testar localmente,
servir a raiz do repositório:

```sh
python3 -m http.server 8000    # a partir da raiz do repositório
# depois abrir http://localhost:8000/cv/
```

**Ficheiro único** — para enviar por email ou anexar a uma candidatura:

```sh
python3 tools/build-singlefile.py     # escreve dist/maria-cotter.html
```

Os scripts em `tools/` vivem no repositório `mariavvcotter/cv`, onde este site
foi construído.

CSS, JavaScript, imagens e fontes ficam todos embutidos: o ficheiro abre
offline, sem rede.

**Imprimir / PDF** — a folha de estilo tem regras de impressão que escondem a
navegação e os gradientes e expandem os endereços dos links.

## Detalhes de implementação

- **Sem JavaScript o site continua legível.** As animações de entrada só
  escondem elementos depois de `main.js` marcar `<html class="js">`. Se o
  script falhar ou for bloqueado, tudo aparece normalmente.
- **Tema claro e escuro** através dos três estados que o browser expõe:
  `:root` (claro), `prefers-color-scheme: dark` e `[data-theme]` explícito.
- **`prefers-reduced-motion`** desliga o gradiente animado, as setas
  desenhadas e as revelações ao scroll.
- **Fontes locais** em vez do CDN do Google: uma dependência externa a menos,
  e o site renderiza igual em qualquer rede.

## Licenças

Bodoni Moda e Outfit distribuem-se sob a
[SIL Open Font License 1.1](https://scripts.sil.org/OFL).
As fotografias e o texto são da Maria Leonor Cotter.
