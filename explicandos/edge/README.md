# Edge Function `admin-contas`

Criar contas e redefinir palavras-passe precisa da `service_role key` do
Supabase. Essa chave dá acesso total à base de dados, por cima de todas as
políticas de RLS, e por isso **não pode estar no site**: o `/explicandos/` é
servido pelo GitHub Pages, onde tudo o que o browser carrega é público.

Esta função é o pedaço de servidor que falta. A chave vive no ambiente da
função, e a função só age depois de confirmar na base de dados que quem
chamou tem `is_admin`.

## Publicar

```sh
npm install -g supabase
supabase login
supabase link --project-ref dfflzfytizugstxjvemk
supabase functions deploy admin-contas --project-ref dfflzfytizugstxjvemk
```

As variáveis `SUPABASE_URL`, `SUPABASE_ANON_KEY` e
`SUPABASE_SERVICE_ROLE_KEY` já existem no ambiente das Edge Functions.

## Enquanto não estiver publicada

A aplicação funciona à mesma; o que falha é o botão de criar conta, com uma
mensagem a dizê-lo. O caminho alternativo:

1. Painel Supabase → **Authentication → Users → Add user**, com email e
   palavra-passe, e **Auto Confirm User** ligado.
2. Voltar a `/explicandos/` → separador **Contas** → a conta nova aparece
   sem permissões → abrir e dar-lhe o que deve ver.
3. Ligar a conta ao aluno, na ficha dele.
