# As explicações numa VPS

Tudo numa máquina só: o site e a base de dados, no mesmo domínio.

```
https://maisinfo.site          a aplicação
https://maisinfo.site/rest/v1  a API (mesmo domínio, logo sem CORS)
https://studio.maisinfo.site   o painel do Supabase (SQL, tabelas)
```

O `mariaestuda.eu` fica onde está, no GitHub Pages, com o CV. Separação
limpa: `maisinfo.site` é o negócio das explicações.

**Estarem na mesma origem não é um detalhe.** É o que faz desaparecer a
configuração de CORS, que é onde estas montagens costumam ficar presas com
um "não funciona" que não diz porquê.

```
gerar-chaves.sh      JWT_SECRET, ANON_KEY, SERVICE_ROLE_KEY
instalar.sh          VPS Ubuntu limpa → tudo a funcionar, num comando
publicar.sh          põe a versão mais recente do repositório a servir
copia-seguranca.sh   pg_dump diário, com rotação e envio para fora
migrar.sh            trazer os dados do Supabase alojado, se os tiveres
```

## O que foi testado e o que não foi

| | |
|---|---|
| Geração das chaves | ✅ assinatura verificada, papéis certos, validade correta |
| A app servida na raiz | ✅ 46 verificações de interface, com os ficheiros que o `publicar.sh` copia |
| O `schema.sql` | ✅ 47 verificações de permissões contra PostgreSQL |
| **O instalador, o Caddy, o Docker** | ❌ **nenhuma** |

O ambiente onde isto foi escrito não tem um daemon Docker. O instalador nunca
correu do princípio ao fim. Conta com corrigir coisas à primeira tentativa.

## Antes de começar

**VPS:** Ubuntu 22.04 ou 24.04, **mínimo 2 GB de RAM**. A stack do Supabase
são uns dez contentores; com 1 GB o PostgreSQL é morto pelo sistema a meio de
uma consulta.

**DNS do maisinfo.site**, dois registos A para o IP da VPS:
```
maisinfo.site          A   <IP>
studio.maisinfo.site   A   <IP>
```

Não mudes os nameservers do domínio para o fornecedor de alojamento: isso
apaga os registos que já lá estiverem.

## Instalar

```sh
ssh root@<IP da VPS>
curl -fsSL https://mariaestuda.eu/exp/vps/instalar.sh -o instalar.sh
bash instalar.sh maisinfo.site o-teu@email
```

Um comando, e no fim está tudo feito: Docker instalado, stack oficial do
Supabase a correr, HTTPS emitido, firewall ligada, **tabelas criadas, a tua
conta feita e promovida a administradora**, e a app a servir. O script
escreve-te a palavra-passe no fim.

Pelo caminho confirma o DNS antes de tentar o certificado, e fecha ao
exterior as portas 5432 e 8000 que a stack oficial expõe — numa VPS pública
são portas abertas para ataques de dicionário.

## Publicar código novo

```sh
bash /opt/explicacoes/app/exp/vps/publicar.sh maisinfo.site
```

Traz o `main`, copia para a pasta servida e reescreve o `config.js` com o
domínio e a chave certos. A troca é um `mv`, não uma cópia ficheiro a
ficheiro: ninguém apanha o site a meio de uma publicação.

Só é copiado o que o browser precisa. O `schema.sql`, os testes, a Edge
Function e estes scripts ficam de fora — não são segredo, o repositório é
público, mas um ficheiro que não é servido não pode ser servido por engano.

## Logo a seguir

**1. Guardar `/opt/explicacoes/chaves.env` fora da máquina.** Sem o
`JWT_SECRET`, nenhuma conta volta a entrar e não há recuperação.

**2. Cópias de segurança.**
```sh
bash /opt/explicacoes/app/exp/vps/copia-seguranca.sh --instalar
```
Diário às 4h, guarda 30 dias. **Por omissão ficam só nesta máquina, o que não
é uma cópia de segurança** — define `DESTINO_REMOTO` no topo do ficheiro. Um
disco que falhe leva o histórico de pagamentos de todas as famílias.

**3. Mudar a palavra-passe** que o instalador gerou, no separador Contas.

## Se já tiveres dados no Supabase alojado

```sh
bash migrar.sh "postgresql://...supabase.co:5432/postgres" maisinfo.site
```

Passa alunos, explicações, pagamentos, materiais e TPCs. **As contas não
passam** — as palavras-passe estão cifradas com o segredo do projeto antigo.

## Motores de busca

O site leva `noindex, nofollow`, no HTML e num cabeçalho HTTP. Escrever
`maisinfo.site` no browser funciona; procurar no Google não devolve nada.

Foi decisão minha: guarda nomes de crianças e contactos de encarregados. Se
querias mesmo aparecer nas pesquisas — por exemplo se `maisinfo.site` vier a
ter também uma página pública de divulgação — diz, e separo as duas coisas.

## O que passa a ser teu

O Supabase alojado e o GitHub Pages faziam isto sozinhos:

- **Cópias de segurança** — o script trata, se o instalares e lhe deres um
  destino fora da máquina.
- **Atualizações.** `unattended-upgrades` para o Ubuntu; os contentores à mão:
  `cd /opt/explicacoes/supabase/docker && docker compose pull && docker compose up -d`
- **A máquina estar de pé.** Agora o site também depende dela, não só a base
  de dados. Se a VPS cair, cai tudo.
- **Os certificados.** O Caddy renova sozinho enquanto correr e a 443 estiver
  aberta.

## Voltar atrás

`pg_dump` da VPS, importar no Supabase alojado, trocar as duas linhas do
`config.js`, repor o site no GitHub Pages. Nada nesta escolha te prende.
