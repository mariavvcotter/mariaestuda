/* ============================================================
   mariaestuda.eu/eco — ligação à base de dados
   ------------------------------------------------------------
   O projeto Supabase onde correu o eco/schema.sql.
   Painel Supabase → Project Settings → Data API:
     • url  = "Project URL"
     • chave = "anon public" key (é pública de propósito: a
       segurança está nas funções do schema, não aqui)

   Se a base de dados não responder, a plataforma continua a
   funcionar em "modo local": o progresso fica só no aparelho
   e os resumos abertos são os de `desbloqueadasSemBD`.
   ============================================================ */
window.ECO_CONFIG = {
  url: 'https://dfflzfytizugstxjvemk.supabase.co',
  chave: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRmZmx6Znl0aXp1Z3N0eGp2ZW1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NzA3ODIsImV4cCI6MjA5NTQ0Njc4Mn0.V0H7seu8x2DQqmBT1Dzp1UMBlaNyqTrAtPHasA-KALs',
  desbloqueadasSemBD: ['u1'],
};
