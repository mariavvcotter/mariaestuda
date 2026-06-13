/* ============================================================
   EDC — Configuração do Supabase (sincronização entre dispositivos)
   ------------------------------------------------------------
   Cola aqui os dados do TEU projeto Supabase:
     Painel Supabase → Project Settings → Data API (ou API)
       • SUPABASE_URL      = "Project URL"      (ex.: https://abcd1234.supabase.co)
       • SUPABASE_ANON_KEY = "anon public" key  (uma chave longa que começa por "eyJ...")

   Enquanto isto não estiver preenchido, a plataforma funciona em modo
   local (só neste navegador). Depois de preencher, as contas e o
   progresso passam a existir em qualquer dispositivo.
   ============================================================ */
window.EDC_CONFIG = {
  SUPABASE_URL: 'https://dfflzfytizugstxjvemk.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmZmx6Znl0aXp1Z3N0eGp2ZW1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NzA3ODIsImV4cCI6MjA5NTQ0Njc4Mn0.V0H7seu8x2DQqmBT1Dzp1UMBlaNyqTrAtPHasA-KALs'
};
