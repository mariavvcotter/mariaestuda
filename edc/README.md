# EDC — Plataforma de Estudo (Ética e Deontologia da Comunicação)

Plataforma de estudo estática (HTML/CSS/JS, sem dependências) pronta para publicar em **mariaestuda.eu/edc**.

## Ficheiros

| Ficheiro | O que é |
|----------|---------|
| `index.html` | Estrutura e todas as secções |
| `styles.css` | Design (tema claro **e** escuro) |
| `data.js` | Todo o conteúdo: perguntas, flashcards, glossário, mapas, etc. |
| `app.js` | Lógica, navegação, gamificação e login |
| `config.js` | Chaves do Supabase (sincronização entre dispositivos) |
| `README.md` | Este ficheiro |

## O que tem

- **Painel** — XP, níveis, **ofensiva de 8 em 8 horas** 🔥, domínio por tema e **16 conquistas**
- **Quiz** — **139 perguntas** filtráveis por 8 temas + **Modo Erros** (revê só o que falhaste)
- **Simulador de Exame** — escolhes nº de perguntas, tempo (cronómetro) e temas; dá nota final e revisão
- **Flashcards** — 49 cartões com **repetição espaçada** (marca "sabia"/"não sabia" e revê os que falhas)
- **Mapas mentais** por tema + **linha do tempo** + **tabelas comparativas**
- **Exercícios** — ordenação, associação, completar, **"Quem disse?"** e **Verdadeiro/Falso**
- **Resumos**, **Casos Reais** e **Conta a História** (blog, futebol, F1, fofoca)
- **Glossário** pesquisável (40+ termos)
- **Pesquisa global** (botão ⌕ ou tecla `/`)
- **Modo escuro** (botão ☾/☀, fica memorizado)
- Conquistas com **confetti** 🎉

- **Login / Criar conta** — nome de utilizador + PIN (sem segurança real; só separa perfis)

O progresso é guardado por utilizador. **Sem Supabase** fica só no `localStorage` do navegador (por dispositivo). **Com Supabase configurado** (ver abaixo), as contas e o progresso existem em **qualquer dispositivo**.

## Sincronização entre dispositivos (Supabase)

Para as contas funcionarem em todo o lado, é preciso uma base de dados grátis na nuvem (o GitHub Pages só serve ficheiros, não guarda dados).

1. Cria conta grátis em **https://supabase.com** (podes entrar com o GitHub) e cria um **New project**.
2. No projeto, abre **SQL Editor** e corre este código:

   ```sql
   create table public.edc_users (
     username_key text primary key,
     name         text not null,
     pin          text not null,
     progress     jsonb not null default '{}'::jsonb,
     updated_at   timestamptz not null default now()
   );

   alter table public.edc_users enable row level security;

   grant select, insert, update, delete on public.edc_users to anon;

   create policy "edc acesso aberto" on public.edc_users
     for all to anon using (true) with check (true);
   ```

3. Vai a **Project Settings → API** e copia:
   - **Project URL** (ex.: `https://abcd1234.supabase.co`)
   - **anon public** key (chave longa que começa por `eyJ...`)
4. Cola os dois valores no ficheiro **`config.js`**.
5. Faz upload da pasta (incluindo `config.js`) para o GitHub.

> ⚠ **Sem segurança real:** a chave `anon` fica pública e a tabela está aberta — qualquer pessoa com a chave pode ler/escrever (incluindo ver os PINs). Para uma plataforma de estudo entre colegas, tudo bem; não guardes aqui nada sensível.

## Como publicar no GitHub Pages

1. Cria/usa o repositório que serve `mariaestuda.eu`.
2. Coloca **o conteúdo desta pasta** dentro de uma pasta `edc/` no repositório
   (deve ficar `edc/index.html`, `edc/styles.css`, etc.).
3. `git add . && git commit -m "Plataforma EDC" && git push`
4. Fica acessível em **https://mariaestuda.eu/edc/**

> Não é preciso configurar nada: são ficheiros estáticos. Basta que o `index.html` fique dentro de `/edc/`.

## Testar localmente

Abre `index.html` com duplo-clique. Tudo funciona offline
(as fontes vêm do Google Fonts, por isso o tipo de letra só fica perfeito com internet).
