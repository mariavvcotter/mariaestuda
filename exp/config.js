/* ============================================================
   mariaestuda — Explicandos: configuração
   ------------------------------------------------------------
   Mesmo projeto Supabase do resto do site, mas tabelas próprias
   (exp_*) e regras de acesso diferentes: aqui NADA é legível com
   a chave anon. A chave abaixo serve só de `apikey` no pedido —
   sozinha não abre nenhuma das tabelas, porque as políticas RLS
   exigem um utilizador autenticado (ver schema.sql).

   O utilizador cria-se UMA vez no painel Supabase:
     Authentication → Users → Add user → email + password.
   ============================================================ */
window.EXPLICANDOS_CONFIG = {
  SUPABASE_URL: 'https://dfflzfytizugstxjvemk.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmZmx6Znl0aXp1Z3N0eGp2ZW1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NzA3ODIsImV4cCI6MjA5NTQ0Njc4Mn0.V0H7seu8x2DQqmBT1Dzp1UMBlaNyqTrAtPHasA-KALs',
};
