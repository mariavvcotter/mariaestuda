# Inglês · plataforma de estudo (mariaestuda.eu/ing)

Site estático (HTML + CSS + JavaScript), sem servidor nem base de dados própria. Funciona no GitHub Pages.

## O que contém

| Ficheiro / pasta | Conteúdo |
|---|---|
| `index.html`, `style.css`, `app.js` | A aplicação (funciona no telemóvel e no computador, com modo escuro). |
| `data/index.json` | Lista dos anos (5.º ao 12.º) com contagens. |
| `data/5.json` … `data/12.json` | Por ano: lições (os PowerPoints, com os exercícios), história de leitura (9 capítulos), fichas (compreensão, gramática e escrita) e sebenta de gramática. |

Os conteúdos **não se editam aqui**. A fonte é a pasta `Inglês/Recursos gerais/Geradores (para editar e reaproveitar)` no OneDrive (`content/decks`, `content/stories`, `content/fichas` e as sebentas HTML em `5 - Sebenta` de cada ano). Depois de alterar alguma coisa lá, regenerar os dados:

```
cd "Inglês/Recursos gerais/Geradores (para editar e reaproveitar)"
python -I tools/build_site.py
```

O script escreve diretamente em `github/mariaestuda/ing/data/`. A seguir, commit e push.

## O que os alunos podem fazer

- **Escolher o ano** (fica memorizado) e ver o resumo do progresso.
- **Lições**: cada PowerPoint virou uma página com a explicação e os exercícios interativos (completar, escolher, associar, verdadeiro ou falso, reescrever, ordenar, resposta livre com resposta modelo). A correção é imediata; podem tentar outra vez e marcar a lição como concluída.
- **História**: os 9 capítulos, com glossário, botão para aumentar a letra e ligação à ficha correspondente.
- **Fichas**: texto, compreensão, gramática e escrita (com contagem de palavras e resposta modelo).
- **Gramática**: a sebenta do ano, capítulo a capítulo.
- **Vocabulário**: flashcards (inglês ou português primeiro) com repetição: as palavras falhadas voltam mais cedo.
- **Praticar**: sessões de 5, 10 ou 15 exercícios ao acaso, dando prioridade aos nunca feitos ou errados.
- **Progresso**: lições e fichas concluídas, percentagem de respostas certas, capítulos lidos, dias seguidos, últimas sessões.

Nas respostas escritas (completar, reescrever) a correção ignora maiúsculas, pontuação final e contrações (*isn't* = *is not*) e aceita as alternativas indicadas na solução. Se mesmo assim uma resposta certa for dada como errada, o aluno pode carregar em «afinal estava certo».

## Contas e progresso

O progresso fica no navegador (localStorage, chave `ing-v1`). Com a conta partilhada do site (`/account`, nome + PIN, botão no fundo do menu) o progresso é sincronizado para o Supabase e fica disponível em qualquer dispositivo, na fatia `ing` da coluna `progress`. O login é opcional.

## Testar localmente

A partir da raiz do repositório (as ligações a `/account/` são absolutas):

```
python -m http.server 8000
```

e abrir `http://localhost:8000/ing/`.
