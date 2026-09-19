# Contexto para o Claude que corre nesta VPS

Lê isto antes de tocares em alguma coisa. Foi escrito pelo Claude que
trabalhou no projeto de fora da máquina e que, por não ter Docker nem rede,
nunca conseguiu correr nada disto.

## O que é este projeto

Aplicação de gestão das explicações da Maria: alunos, conta corrente,
materiais, TPCs. Segue um caderno de encargos de 18 de setembro de 2026,
descrito em `exp/README.md`. Lê esse ficheiro a seguir a este.

**Quem a vai usar:** a Maria (administradora), os encarregados de educação e
os alunos. Uns dez alunos ativos.

**O que guarda:** nomes de crianças, contactos de encarregados, registos de
pagamento e avaliações. Isto condiciona tudo o resto.

## Objetivo desta máquina

```
https://maisinfo.store   a aplicação e a API, na mesma origem
```

Site e base de dados na mesma máquina e no mesmo domínio. Estarem na mesma
origem elimina o CORS — não é arrumação, é uma classe de problemas que deixa
de existir.

O `mariaestuda.eu` fica onde está, no GitHub Pages, com o CV da Maria. Não
lhe toques.

## Estado da máquina quando este ficheiro foi escrito

Feito, passo a passo, com a Maria ao teclado:

- Ubuntu 26.04 LTS atualizado, kernel 7.0.0-31 a correr
- 3,7 GB de RAM, 2 vCPU, 37 GB de disco
- 2 GB de swap em `/swapfile`, `vm.swappiness=10`
- `ufw` ativo: 22, 80 e 443 abertas, o resto fechado
- Entrada por chave Ed25519; **palavra-passe desligada** em
  `/etc/ssh/sshd_config.d/01-seguranca.conf`
- Utilizador `ubuntu`, com `sudo`. Não há login direto de root por password.

Por fazer:

- Registo A do `maisinfo.store` → `51.77.146.226`
- Correr `exp/vps/instalar.sh`
- Instalar as cópias de segurança

## O que está testado e o que não está

| | |
|---|---|
| `exp/schema.sql` | ✅ 47 verificações contra PostgreSQL real (`exp/testes/correr.sh`) |
| A aplicação, servida na raiz | ✅ 46 verificações de interface (`exp/testes/navegador.mjs`) |
| `exp/vps/gerar-chaves.sh` | ✅ JWT válidos, assinatura verificada, papéis certos |
| `exp/vps/fechar-portas.py` | ✅ validado com `docker compose config` |
| **`exp/vps/instalar.sh`** | ❌ **nunca correu do princípio ao fim** |
| **`copia-seguranca.sh`, `publicar.sh`, `migrar.sh`** | ❌ **nenhuma** |

**Espera que o instalador falhe.** Corrige, volta a correr, e faz commit do
que descobrires. É para isso que estás aí.

## Armadilhas já encontradas (e outras prováveis)

1. **O serviço do gateway chama-se `api-gw`, não `kong`.** A stack oficial do
   Supabase mudou o nome. Se algum ficheiro ainda disser `kong`, é erro.

2. **A porta 5432 é publicada pelo serviço `supavisor`, não pelo `db`.**
   Quem procurar no sítio errado não fecha nada.

3. **O Docker escreve regras de rede por baixo do `ufw`.** Portas publicadas
   por contentores ficam acessíveis de fora mesmo com a firewall a dizer que
   não. O que protege é o `fechar-portas.py`, que as prende ao `127.0.0.1`.
   A firewall é a segunda camada, não a primeira.

4. **Ubuntu 26.04 é recente.** O repositório oficial da Docker pode ainda não
   ter publicado para este nome de código. O instalador confirma antes e cai
   nos pacotes do Ubuntu se for preciso.

5. **3,7 GB de RAM para doze contentores.** Se o arranque falhar por memória,
   os candidatos a desligar são, por esta ordem: `studio`, `imgproxy`,
   `realtime`. A aplicação não usa realtime nem transformação de imagens.

6. **O `supabase/docker` muda.** O que está escrito nos scripts foi lido em
   setembro de 2026. Confirma contra o que estiver lá quando correres.

## Regras que não se negoceiam

Estas não são preferências. São o que impede uma família de ler os dados de
outra, e foram provadas por 47 testes.

- **A segurança vive no `schema.sql`, não na interface.** RLS em todas as
  tabelas, vistas que filtram por `auth.uid()`. A chave anon está no
  JavaScript e tem de estar; qualquer aluno com conta pode falar com o
  PostgREST diretamente. Se alguma vez te parecer que dá para filtrar no
  cliente, a resposta é não.
- **Não exponhas o Studio à internet.** Quem lá entra passa por cima de todo
  o RLS, porque usa a `service_role`. Chega-se lá por túnel SSH:
  `ssh -L 8000:localhost:8000 ubuntu@51.77.146.226`
- **Não voltes a abrir a entrada por palavra-passe no SSH.**
- **`DISABLE_SIGNUP=true`.** O caderno diz que não há auto-inscrição.
- **Nunca commites o `/opt/explicacoes/chaves.env`** nem nada que lá esteja
  dentro. Contém o `JWT_SECRET` e a `service_role`.
- **O site leva `noindex`.** Guarda dados de menores.

## Onde está tudo

```
/opt/explicacoes/app        o repositório (github.com/mariavvcotter/mariaestuda)
/opt/explicacoes/site       o que o Caddy serve
/opt/explicacoes/supabase/docker   a stack
/opt/explicacoes/chaves.env        os segredos — 0600, nunca sai daqui
```

No repositório, o que interessa está em `exp/`:

```
exp/schema.sql     as tabelas, as vistas, as políticas, as funções
exp/index.html     a aplicação; os outros .js e o .css ao lado
exp/testes/        os dois suites — corre-os depois de mexeres
exp/vps/           os scripts que vais executar e corrigir
exp/edge/          a função que cria contas (precisa da service_role)
```

## Como trabalhar

Ramo: `claude/modest-planck-8wkvb9`. Faz commit das correções aí, com
mensagens que expliquem **porque é que estava errado**, não só o que mudou.

Antes de commitares mudanças ao schema ou à aplicação, corre os dois suites:

```sh
./exp/testes/correr.sh          # precisa de um PostgreSQL local
node exp/testes/navegador.mjs   # precisa de um servidor estático e do Playwright
```

Se mexeres nos scripts da VPS, o teste é correrem. Diz sempre o que
verificaste e o que não.

## O que a Maria espera de ti

Ela sabe pouco de linha de comandos e está a aprender pelo caminho. Explica
o propósito de cada passo antes de o dares. Um passo de cada vez, e espera
pelo ok dela antes do seguinte — foi assim que a máquina chegou até aqui.

Quando algo correr mal, diz o que correu mal e o que vais fazer. Não
escondas, não enfeites, e não digas que está feito antes de estar.
