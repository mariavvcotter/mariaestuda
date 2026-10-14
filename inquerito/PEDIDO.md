# Pedido: pôr o inquérito online noutro servidor

## Contexto

O inquérito aos visitantes da exposição de Joana Vasconcelos é um trabalho de aula. A página já está feita e testada. Está na pasta `inquerito/` deste repositório:

- `index.html`: a página completa, com consentimento, 15 perguntas em 5 partes, e português e inglês;
- `hero.jpg`: a imagem do topo;
- `fonts/`: as duas fontes, servidas pela própria página.

Hoje a página está em **modo de teste**: mostra as perguntas mas não guarda nada.

## O que espero

1. **Alojar a página** nesse servidor, tal como está.
2. **Guardar cada resposta** numa tabela da base de dados desse servidor: uma linha por resposta e uma coluna por pergunta.
3. **Ligar a página** a esse armazenamento, para que deixe de estar em modo de teste.
4. **Dar-me forma de tirar as respostas para CSV**, para as analisar em Excel.

## Como a página envia as respostas

Esta parte já está feita e não deve mudar. No fim, a página faz um pedido:

- `POST` para o endereço que estiver em `const ENDPOINT = "…"`, no `index.html`;
- com `Content-Type: text/plain;charset=utf-8`;
- e o corpo em JSON, com estes campos:

| Campo | Valores possíveis |
|---|---|
| `consentimento` | sempre `true` (não é preciso guardar) |
| `idioma` | `pt`, `en` |
| `idade` | `Menos de 18`, `18–24`, `25–34`, `35–44`, `45–54`, `55–64`, `65 ou mais` |
| `escolaridade` | `Até ao 9.º ano`, `Ensino secundário`, `Licenciatura`, `Mestrado ou doutoramento` |
| `residencia` | `Reside em Portugal`, `Turista` |
| `companhia` | `Sozinho/a`, `Família`, `Amigos`, `Grupo organizado` |
| `frequencia_anual` | `Menos de 1`, `1 a 2`, `3 a 5`, `6 ou mais` |
| `ja_visitou` | `Sim`, `Não` |
| `como_soube` | **lista** com uma ou mais de: `Website do museu`, `Redes sociais`, `Cartaz, mupi ou banner`, `Metro ou transportes`, `Imprensa`, `Boca a boca`, `Outro` |
| `motivo` | `A artista`, `A exposição`, `O espaço`, `Recomendação`, `Outro` |
| `canais_usados` | **lista** com uma ou mais de: `Website`, `App`, `Redes sociais`, `Nenhum` |
| `aval_textos`, `aval_orientacao`, `aval_audioguia`, `aval_visita_guiada`, `aval_pessoal`, `aval_loja` | `1` a `5`, ou `Não usei` |
| `mais_gostou` | texto livre, até 600 caracteres, pode vir vazio |
| `aprendeu_1a5` | `1` a `5` |
| `percecao_artista_1a5` | `1` a `5` |
| `recomenda_0a10` | `0` a `10` |
| `publico_ou_utilizador` | `Público`, `Utilizador`, `Não sei` |
| `o_que_mudaria` | texto livre, até 600 caracteres, pode vir vazio |

Os valores chegam sempre em português, mesmo quando a pessoa responde em inglês. Só os dois textos livres vêm na língua em que foram escritos.

O servidor tem de responder em JSON:
- `{"ok": true}` quando gravou;
- `{"ok": false, "erro": "…"}` quando não gravou.

A página mostra "Obrigado" só quando recebe `ok: true`. Em qualquer outro caso, mostra um erro e deixa a pessoa tentar outra vez.

## Regras

- **Anonimato.** A página promete que as respostas são anónimas e que o endereço de internet não fica guardado com elas. Por isso, a tabela não pode ter o IP, cookies, identificadores do browser nem nada que identifique a pessoa.
- **Hora de Lisboa.** Guardar a data e a hora de cada resposta no fuso de Lisboa, pela hora do servidor e não do telemóvel.
- **Validar.** Recusar respostas com valores que não estejam na tabela acima, pedidos maiores que 8 KB, e tudo o que não seja `POST`.
- **Respostas privadas.** Só eu as consigo ler. Não podem ficar acessíveis por nenhum endereço público, e as credenciais da base de dados não podem estar numa pasta pública.
- **Nada de fórmulas no Excel.** Um texto livre que comece por `=`, `+`, `-` ou `@` tem de ficar guardado de forma a não virar fórmula quando abrir o CSV.
- **Não mexer na página**, a não ser na linha `const ENDPOINT = "…"`. Não alterar perguntas, textos, consentimento ou design, e não acrescentar estatísticas de visitas, cookies ou login.
- **Se a página ficar num domínio e o servidor noutro**, o servidor tem de responder com `Access-Control-Allow-Origin` para o domínio da página. Sem isso, o browser bloqueia a resposta.

## Já existe uma versão pronta

Para servidores com **PHP e MySQL**, o `inquerito/guardar.php` deste repositório já faz tudo o que está acima e foi testado com a página verdadeira, nas duas línguas. Usa-o se servir. Se o servidor for outro, usa-o como referência para os campos e as validações.

## Está pronto quando

- [ ] A página abre no endereço novo, sem a faixa vermelha "Modo de teste".
- [ ] Uma resposta feita no telemóvel, até ao fim, aparece como uma linha na tabela, com a hora de Lisboa.
- [ ] Uma resposta em inglês aparece com os valores em português e `idioma = en`.
- [ ] Um pedido com um valor inventado é recusado e não cria nenhuma linha.
- [ ] Consigo descarregar as respostas em CSV.
- [ ] As linhas de teste foram apagadas antes de o link ser divulgado.
