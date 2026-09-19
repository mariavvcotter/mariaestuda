# Supabase self-hosted numa VPS

Alternativa ao Supabase alojado. A aplicação continua a ser servida pelo
GitHub Pages em `mariaestuda.eu/exp` — o que muda de casa é só a base de
dados, que passa a viver em `api.maisinfo.site`.

**O `schema.sql` corre aqui sem mudar uma vírgula.** Fora do `public`, ele
só depende de `auth.uid()`, `auth.users`, `storage.buckets` e
`storage.objects`, que existem com os mesmos nomes no Supabase self-hosted.
Na aplicação mudam duas linhas do `config.js`.

```
gerar-chaves.sh      gera JWT_SECRET, ANON_KEY e SERVICE_ROLE_KEY
instalar.sh          instala tudo numa VPS Ubuntu limpa
copia-seguranca.sh   pg_dump diário, com rotação e envio para fora
migrar.sh            traz os dados do Supabase alojado, se já os tiveres
```

## Aviso honesto sobre o estado disto

O resto do projeto tem 93 verificações automáticas: 47 de permissões contra
um PostgreSQL a sério e 46 de interface num navegador. **Estes ficheiros têm
uma.** Só consegui testar a geração das chaves — que os JWT são válidos, que
a assinatura verifica contra o segredo e que os papéis estão certos. O resto
não corre sem um Docker a funcionar, que o ambiente onde isto foi escrito não
tem.

Não é código verificado como o outro. Conta com ter de corrigir coisas à
primeira tentativa.

## Antes de começar

1. Uma VPS Ubuntu 22.04 ou 24.04, com pelo menos **2 GB de RAM** — a stack
   do Supabase são uns dez contentores e com 1 GB o PostgreSQL é morto pelo
   sistema a meio de uma consulta.
2. No DNS do `maisinfo.site`, um registo A:
   ```
   api.maisinfo.site   A   <IP da VPS>
   ```
   Não mudes os nameservers do domínio para o fornecedor de alojamento: isso
   apaga todos os registos que já tens e tens de os recriar à mão.

## Instalar

```sh
ssh root@<IP da VPS>
curl -fsSL https://mariaestuda.eu/exp/vps/instalar.sh -o instalar.sh
bash instalar.sh api.maisinfo.site
```

O script confirma primeiro que o DNS já aponta para a máquina, e pára com
uma mensagem clara se ainda não propagou — em vez de deixar o Caddy a falhar
a emitir o certificado sem dizer porquê.

Depois instala o Docker, traz a stack oficial do Supabase, gera os segredos,
põe o Caddy à frente para o HTTPS, fecha a porta do PostgreSQL ao exterior
(a stack oficial expõe a 5432, o que numa VPS pública é uma porta aberta
para ataques de dicionário), liga a firewall e arranca tudo.

No fim escreve a `ANON_KEY` que precisas para o `config.js`.

## A seguir

**1. Guardar `/opt/supabase/chaves.env` em sítio seguro.**
Sem o `JWT_SECRET`, as contas que criares deixam de conseguir entrar e não há
como recuperar.

**2. Correr o schema.** Studio em `https://api.maisinfo.site` → SQL Editor →
colar o `exp/schema.sql` → Run.

**3. Instalar as cópias de segurança.**
```sh
bash copia-seguranca.sh --instalar
```
Diário às 4h, guarda 30 dias. **Por omissão ficam só nesta máquina, o que não
é uma cópia de segurança** — define `DESTINO_REMOTO` no topo do ficheiro para
as mandar para fora. Um disco que falhe leva o histórico de pagamentos de
todas as famílias.

**4. Apontar a app para cá.** Em `exp/config.js`:
```js
SUPABASE_URL: 'https://api.maisinfo.site',
SUPABASE_ANON_KEY: '<a ANON_KEY que o instalador escreveu>',
```

## Se já tiveres dados no Supabase alojado

```sh
bash migrar.sh "postgresql://...supabase.co:5432/postgres" api.maisinfo.site
```

Passa alunos, explicações, pagamentos, materiais e TPCs. **As contas não
passam** — as palavras-passe estão cifradas com o segredo do projeto antigo.
Cria-as de novo e comunica as novas.

## O que passa a ser teu

O Supabase alojado fazia isto sozinho. Agora não faz ninguém:

- **Cópias de segurança.** O `copia-seguranca.sh` trata delas, se o
  instalares e se lhe deres um destino fora da máquina.
- **Atualizações de segurança do Ubuntu.** `unattended-upgrades` resolve a
  maior parte, mas os contentores atualizam-se à mão:
  `cd /opt/supabase/docker && docker compose pull && docker compose up -d`.
- **A máquina estar de pé.** Quando um encarregado abre a conta corrente ao
  domingo à noite, ou está de pé, ou não está.
- **Os certificados.** O Caddy renova sozinho, mas só enquanto o contentor
  correr e a porta 443 estiver aberta.

## Voltar atrás

A migração é simétrica. `pg_dump` da VPS, importar no projeto alojado,
trocar as duas linhas do `config.js`. Nada nesta escolha te prende.
