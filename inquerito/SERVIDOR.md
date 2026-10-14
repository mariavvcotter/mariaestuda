# Pôr o inquérito noutro servidor, com a base de dados dele

Este guia explica como alojar o inquérito sobre a exposição de Joana Vasconcelos (a pasta `inquerito/` deste repositório) num servidor com **PHP** e **MySQL/MariaDB**. É o que oferece quase qualquer alojamento partilhado com cPanel ou phpMyAdmin. As respostas ficam numa tabela da base de dados desse servidor, e o Google Sheets e o Supabase deixam de ser precisos.

Demora uns 20 minutos. Só precisas do gestor de ficheiros (ou FTP) e do phpMyAdmin do alojamento.

---

## O que vai para o servidor

```
(pasta acima da pública, ex.: /home/utilizador/)
├── inquerito-config.php      ← credenciais da base de dados (passo 2)
└── public_html/              ← pasta pública do site
    └── inquerito/
        ├── index.html        ← a página (copiar do repositório)
        ├── hero.jpg          ← imagem do topo
        ├── fonts/            ← as duas fontes (.woff2)
        └── guardar.php       ← recebe e grava as respostas (copiar do repositório)
```

Do repositório **não** é preciso o `apps-script.gs`, que era para o Google Sheets, nem este `SERVIDOR.md`.

A página não depende de nada fora da pasta: as fontes são servidas por ela própria, não há cookies, e o único pedido que faz é para o `guardar.php`.

---

## Passo 1: criar a tabela

No painel do alojamento:
1. Cria uma base de dados (em **Bases de dados MySQL** no cPanel). Se já tens uma, podes usá-la.
2. Cria um utilizador para essa base de dados e dá-lhe permissões sobre ela.
3. No **phpMyAdmin**, abre essa base de dados, vai ao separador **SQL**, cola isto e carrega em **Executar**:

```sql
CREATE TABLE inquerito_respostas (
  id                    INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  criado_em             DATETIME     NOT NULL COMMENT 'hora de Lisboa',
  idioma                CHAR(2)      NOT NULL COMMENT 'pt ou en: língua em que respondeu',
  idade                 VARCHAR(20)  NOT NULL,
  escolaridade          VARCHAR(40)  NOT NULL,
  residencia            VARCHAR(30)  NOT NULL,
  companhia             VARCHAR(30)  NOT NULL,
  frequencia_anual      VARCHAR(20)  NOT NULL,
  ja_visitou            VARCHAR(5)   NOT NULL,
  como_soube            VARCHAR(255) NOT NULL COMMENT 'várias, separadas por "; "',
  motivo                VARCHAR(30)  NOT NULL,
  canais_usados         VARCHAR(100) NOT NULL COMMENT 'várias, separadas por "; "',
  aval_textos           VARCHAR(10)  NOT NULL COMMENT '1 a 5 ou "Não usei"',
  aval_orientacao       VARCHAR(10)  NOT NULL,
  aval_audioguia        VARCHAR(10)  NOT NULL,
  aval_visita_guiada    VARCHAR(10)  NOT NULL,
  aval_pessoal          VARCHAR(10)  NOT NULL,
  aval_loja             VARCHAR(10)  NOT NULL,
  mais_gostou           TEXT         NULL,
  aprendeu_1a5          TINYINT      NOT NULL,
  percecao_artista_1a5  TINYINT      NOT NULL,
  recomenda_0a10        TINYINT      NOT NULL,
  publico_ou_utilizador VARCHAR(20)  NOT NULL,
  o_que_mudaria         TEXT         NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

O `utf8mb4` é importante: sem ele, acentos e emojis nas respostas livres podem ficar estragados.

**Opcional, mas recomendado:** se o alojamento deixar escolher permissões por utilizador, dá ao utilizador do inquérito **só** a permissão `INSERT` nesta tabela. Assim, mesmo que alguém descubra a palavra-passe, não consegue ler nem apagar respostas.

```sql
GRANT INSERT ON nome_da_base.inquerito_respostas TO 'utilizador_do_inquerito'@'localhost';
```

---

## Passo 2: guardar as credenciais fora da pasta pública

Cria o ficheiro `inquerito-config.php` **um nível acima** de `public_html` (no cPanel, a pasta onde está `public_html`, e não dentro dela). Assim ninguém o consegue abrir pelo browser.

```php
<?php
return [
    'dsn'           => 'mysql:host=localhost;dbname=NOME_DA_BASE;charset=utf8mb4',
    'utilizador'    => 'UTILIZADOR_DA_BASE',
    'palavra_passe' => 'PALAVRA_PASSE_DA_BASE',
];
```

Substitui as três palavras em maiúsculas. Em alguns alojamentos o `host` não é `localhost`: o valor certo aparece no painel, junto da base de dados.

O `guardar.php` procura este ficheiro em `../../inquerito-config.php`, ou seja, dois níveis acima de si próprio: `public_html/inquerito/` → `public_html/` → pasta de cima. Se a estrutura do teu servidor for diferente, muda essa linha no `guardar.php`.

---

## Passo 3: copiar os ficheiros

Copia para `public_html/inquerito/`:
- `index.html`, `hero.jpg` e a pasta `fonts/`, que estão na pasta `inquerito/` do repositório;
- `guardar.php`, que também está na pasta `inquerito/` do repositório.

O `guardar.php`:
- só aceita pedidos `POST` com até 8 KB;
- confirma que cada resposta é uma das opções que existem no formulário, e recusa tudo o resto;
- corta as respostas livres em 600 caracteres e põe uma `'` à frente das que começam por `=`, `+`, `-` ou `@`, para não virarem fórmulas quando abrires o CSV no Excel;
- grava a hora de Lisboa;
- **não grava o endereço IP**, como o consentimento promete.

---

## Passo 4: ligar a página ao `guardar.php`

No `index.html`, procura a linha:

```js
const ENDPOINT = "";
```

e muda-a para:

```js
const ENDPOINT = "guardar.php";
```

É só isto. Com o `ENDPOINT` preenchido, a faixa vermelha "Modo de teste" desaparece e as respostas passam a ser enviadas.

**Se a página continuar em `mariaestuda.eu` e só o `guardar.php` ficar noutro servidor:**
- Em vez de `"guardar.php"`, põe o endereço completo, por exemplo `"https://outro-servidor.pt/inquerito/guardar.php"`.
- No `guardar.php`, tira as `//` da linha `header('Access-Control-Allow-Origin: https://mariaestuda.eu');`.

Sem esse cabeçalho, o browser bloqueia a resposta, e quem responde vê "Não foi possível enviar" mesmo que a linha tenha sido gravada.

---

## Passo 5: testar

1. **Do computador**, num terminal, troca o endereço pelo teu e corre:

   ```sh
   curl -X POST https://O-TEU-SERVIDOR/inquerito/guardar.php \
     -d '{"idioma":"pt","idade":"25–34","escolaridade":"Licenciatura","residencia":"Turista","companhia":"Amigos","frequencia_anual":"3 a 5","ja_visitou":"Não","como_soube":["Redes sociais"],"motivo":"A artista","canais_usados":["Nenhum"],"aval_textos":"4","aval_orientacao":"5","aval_audioguia":"Não usei","aval_visita_guiada":"Não usei","aval_pessoal":"4","aval_loja":"3","mais_gostou":"teste","aprendeu_1a5":"4","percecao_artista_1a5":"3","recomenda_0a10":"9","publico_ou_utilizador":"Público","o_que_mudaria":""}'
   ```

   Tem de responder `{"ok":true}`. Se der outra coisa:

   | Resposta | O que quer dizer |
   |---|---|
   | `{"ok":false,"erro":"base de dados"}` | As credenciais do passo 2 estão erradas, ou a tabela não existe. O erro exato fica no registo de erros do PHP, no painel do alojamento. |
   | `{"ok":false,"erro":"<nome de um campo>"}` | Esse campo tem um valor que o formulário não tem. Num teste à mão, é quase sempre uma gralha no comando. |
   | Uma página HTML, ou um erro 500 sem JSON | O PHP não encontrou o `inquerito-config.php`. Revê o caminho do passo 2. |
   | Erro 404 | O `guardar.php` não está na pasta onde o pedido o procura. |

2. **No telemóvel**, abre a página, responde até ao fim e confirma que aparece "Obrigado pela sua participação".
3. No **phpMyAdmin**, abre a tabela `inquerito_respostas` e confirma que as duas linhas lá estão: a do `curl` e a do telemóvel. A coluna `idioma` diz em que língua foi respondida.
4. **Apaga as linhas de teste** antes de divulgar o link:

   ```sql
   DELETE FROM inquerito_respostas;
   ALTER TABLE inquerito_respostas AUTO_INCREMENT = 1;
   ```

---

## Tirar as respostas para CSV

No phpMyAdmin, abre a tabela e carrega em **Exportar → Formato: CSV for MS Excel → Executar**.

Ou, com cabeçalhos legíveis, corre isto no separador SQL e exporta o resultado:

```sql
SELECT criado_em AS `Data e hora (Lisboa)`, idioma AS Idioma, idade AS Idade,
       escolaridade AS Escolaridade, residencia AS `Residência`, companhia AS Companhia,
       frequencia_anual AS `Museus por ano`, ja_visitou AS `Já tinha visitado`,
       como_soube AS `Como soube`, motivo AS `Motivo principal`, canais_usados AS `Canais usados`,
       aval_textos AS `Aval. textos`, aval_orientacao AS `Aval. orientação`,
       aval_audioguia AS `Aval. audioguia/app`, aval_visita_guiada AS `Aval. visita guiada`,
       aval_pessoal AS `Aval. pessoal`, aval_loja AS `Aval. loja`,
       mais_gostou AS `O que mais gostou`, aprendeu_1a5 AS `Aprendeu (1 a 5)`,
       percecao_artista_1a5 AS `Mudou perceção (1 a 5)`, recomenda_0a10 AS `Recomenda (0 a 10)`,
       publico_ou_utilizador AS `Público ou utilizador`, o_que_mudaria AS `O que mudaria`
FROM inquerito_respostas ORDER BY id;
```

As respostas dadas em inglês ficam com os valores em português, por isso cabem nas mesmas colunas. Só as respostas livres (`mais_gostou` e `o_que_mudaria`) ficam na língua em que foram escritas.

---

## Se o servidor não for PHP + MySQL

A página não precisa de saber nada sobre o servidor. Só precisa de um endereço que:
- aceite um `POST` com `Content-Type: text/plain;charset=utf-8` e um corpo em JSON com os campos acima. Envia `text/plain` de propósito, para evitar o pedido prévio de CORS;
- responda com JSON: `{"ok": true}` quando gravou, `{"ok": false, "erro": "..."}` quando não gravou.

Os campos e os valores aceites estão no `guardar.php` (`$OPCOES`, `$LISTAS`, `$TEXTOS`). Com PostgreSQL basta mudar o `dsn` para `pgsql:host=…;dbname=…` e trocar `TINYINT` por `SMALLINT` e `TEXT … COMMENT …` pela sintaxe do Postgres. O resto do `guardar.php` funciona igual.

---

## Lista final

- [ ] Tabela criada (passo 1)
- [ ] `inquerito-config.php` fora da pasta pública, com as credenciais certas (passo 2)
- [ ] `index.html`, `hero.jpg`, `fonts/` e `guardar.php` em `public_html/inquerito/` (passo 3)
- [ ] `ENDPOINT = "guardar.php"` no `index.html` (passo 4)
- [ ] `curl` responde `{"ok":true}` e o teste no telemóvel aparece na tabela (passo 5)
- [ ] Linhas de teste apagadas
