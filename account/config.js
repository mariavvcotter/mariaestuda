/* ============================================================
   mariaestuda — Configuração da conta partilhada (Supabase)
   ------------------------------------------------------------
   As MESMAS credenciais em todas as secções → a mesma conta
   funciona em qualquer secção (edc, eco, eng, ...).

   Painel Supabase → Project Settings → Data API:
     • SUPABASE_URL      = "Project URL"
     • SUPABASE_ANON_KEY = "anon public" key

   Enquanto não estiver preenchido, o login funciona em modo
   local (só neste navegador). Depois de preenchido, as contas
   e o progresso passam a existir em qualquer dispositivo.

   Tabela usada: edc_users (username_key, name, pin, progress).
   A coluna `progress` (JSON) guarda uma fatia por secção, ex.:
     { "edc": {...}, "eco": {...}, "ci": {...} }
   ============================================================ */
window.MARIAESTUDA_CONFIG = {
  SUPABASE_URL: 'https://dfflzfytizugstxjvemk.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmZmx6Znl0aXp1Z3N0eGp2ZW1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NzA3ODIsImV4cCI6MjA5NTQ0Njc4Mn0.V0H7seu8x2DQqmBT1Dzp1UMBlaNyqTrAtPHasA-KALs',
  TABLE: 'edc_users',
};
