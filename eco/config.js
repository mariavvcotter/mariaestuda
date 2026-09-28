/* ============================================================
   mariaestuda.eu/eco — configuração
   ------------------------------------------------------------
   O endereço e a chave do Supabase vêm de /account/config.js,
   os mesmos da conta partilhada: a Economia usa sempre a mesma
   base de dados que o login.

   desbloqueadasSemBD: resumos abertos quando a base de dados não
   responde (ou enquanto o eco/schema.sql não foi corrido).
   ============================================================ */
window.ECO_CONFIG = {
  desbloqueadasSemBD: ['u1'],
};
