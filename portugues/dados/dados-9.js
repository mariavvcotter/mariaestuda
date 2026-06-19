CURRICULO['9'] = {
  subtitulo:'3.º Ciclo', ciclo:'3.º Ciclo', icone:'📙',
  intro:'No 9.º ano, ano de exame final de ciclo, consolidas as orações subordinadas e a coesão textual. Na literatura, estudas dois pilares: «Os Lusíadas», de Camões, e o «Auto da Barca do Inferno», de Gil Vicente.',
  modulos:[
    /* ===== GRAMÁTICA ===== */
    {id:'subord9', area:'gramatica', titulo:'Orações subordinadas', icone:'🔗', resumo:'Substantivas, adjetivas, adverbiais',
     html:`<p class="lead">A oração subordinada depende de outra (a subordinante). Há três grandes grupos.</p>
      <h4 class="sub">1. Subordinadas substantivas</h4>
      <ul><li><b>Completivas</b>: completam o verbo, como um CD — «Disse <b>que vinha</b>.»</li>
      <li><b>Relativas sem antecedente</b>: «<b>Quem tudo quer</b> tudo perde.»</li></ul>
      <h4 class="sub">2. Subordinadas adjetivas relativas</h4>
      <ul><li><b>Restritiva</b> (sem vírgulas, restringe): «Os alunos <b>que estudam</b> passam.»</li>
      <li><b>Explicativa</b> (entre vírgulas): «O João, <b>que é meu amigo</b>, chegou.»</li></ul>
      <h4 class="sub">3. Subordinadas adverbiais</h4>
      <p>Causal, temporal, condicional, final, concessiva, comparativa, consecutiva.</p>
      <div class="caixa dica"><b class="rotulo">Relativas</b> Introduzidas por <i>que, o qual, quem, cujo, onde</i>. Restritiva = essencial; explicativa = acessória (entre vírgulas).</div>`,
     quiz:[
      {q:"«Espero que venhas.» — a oração «que venhas» é...",o:["subordinada substantiva completiva","adjetiva relativa","adverbial causal","coordenada"],c:0,e:"Completa o verbo «esperar», como um CD → substantiva completiva."},
      {q:"«O livro que li é ótimo.» — «que li» é...",o:["substantiva","adjetiva relativa restritiva","adverbial","coordenada"],c:1,e:"Refere-se ao nome «livro» e restringe-o (sem vírgulas) → adjetiva relativa restritiva."},
      {q:"«A Ana, que mora em Faro, ligou.» — a relativa é...",o:["restritiva","explicativa","completiva","final"],c:1,e:"Entre vírgulas, acrescenta informação acessória → explicativa."},
      {q:"«Saí embora chovesse.» — subordinada...",o:["causal","concessiva","temporal","final"],c:1,e:"«embora» admite um obstáculo → concessiva."},
      {q:"«Estudou tanto que adormeceu.» — subordinada...",o:["consecutiva","comparativa","condicional","causal"],c:0,e:"«tanto... que» exprime consequência → consecutiva."}
     ]},
    {id:'funcoes9', area:'gramatica', titulo:'Funções sintáticas (revisão)', icone:'🧩', resumo:'Todas, incl. compl. do nome/adjetivo',
     html:`<table class="tab"><tr><th>Função</th><th>Teste/Exemplo</th></tr>
      <tr><td>Sujeito</td><td>Quem? — <b>O atleta</b> venceu.</td></tr>
      <tr><td>Compl. direto</td><td>o/a — viu <b>o filme</b></td></tr>
      <tr><td>Compl. indireto</td><td>lhe — deu <b>ao Rui</b></td></tr>
      <tr><td>Compl. oblíquo</td><td>obrigatório — mora <b>em Évora</b></td></tr>
      <tr><td>Compl. agente da passiva</td><td>foi pintado <b>pelo artista</b></td></tr>
      <tr><td>Predicativo do sujeito</td><td>ser/estar — é <b>justo</b></td></tr>
      <tr><td>Predicativo do compl. direto</td><td>considero-o <b>injusto</b></td></tr>
      <tr><td>Compl. do nome</td><td>o medo <b>do escuro</b></td></tr>
      <tr><td>Compl. do adjetivo</td><td>cheio <b>de alegria</b></td></tr>
      <tr><td>Modificador (do nome / de frase)</td><td>o rapaz <b>de óculos</b> / <b>Felizmente</b>, ganhou.</td></tr></table>
      <h4 class="sub">Voz ativa e passiva</h4>
      <p>Ativa: «O Rui leu o livro.» → Passiva: «O livro foi lido <b>pelo Rui</b>.» (o sujeito passa a complemento agente da passiva).</p>`,
     quiz:[
      {q:"«Considero o filme <b>excelente</b>.» — «excelente» é...",o:["predicativo do sujeito","predicativo do complemento direto","modificador","compl. do nome"],c:1,e:"Atribui qualidade ao CD «o filme» → predicativo do complemento direto."},
      {q:"«Tenho medo <b>do escuro</b>.» — «do escuro» é...",o:["compl. direto","compl. do nome","compl. indireto","modificador"],c:1,e:"Completa o nome «medo» → complemento do nome."},
      {q:"Na passiva «A casa foi vendida <b>pelo dono</b>.», «pelo dono» é...",o:["sujeito","compl. agente da passiva","compl. indireto","modificador"],c:1,e:"Quem pratica a ação na voz passiva → complemento agente da passiva."},
      {q:"«<b>Infelizmente</b>, perdemos.» — «Infelizmente» é...",o:["modificador de frase","predicativo","compl. oblíquo","vocativo"],c:0,e:"Modifica toda a frase (atitude do falante) → modificador de frase."}
     ]},
    {id:'coesao9', area:'gramatica', titulo:'Coesão e coerência', icone:'🧵', resumo:'Ligar o texto',
     html:`<p class="lead">Um bom texto é <b>coerente</b> (faz sentido, sem contradições) e <b>coeso</b> (bem ligado).</p>
      <h4 class="sub">Mecanismos de coesão</h4>
      <table class="tab"><tr><th>Tipo</th><th>Como</th><th>Exemplo</th></tr>
      <tr><td>Gramatical (referencial)</td><td>pronomes/possessivos que retomam</td><td>O Rui... <b>ele</b>... a <b>sua</b> casa</td></tr>
      <tr><td>Lexical</td><td>sinónimos, repetição, hiperónimos</td><td>o cão... o <b>animal</b></td></tr>
      <tr><td>Interfrásica</td><td>conectores</td><td><b>porém, além disso, por isso</b></td></tr>
      <tr><td>Temporal</td><td>marcadores de tempo</td><td><b>primeiro... depois... por fim</b></td></tr></table>
      <div class="caixa dica"><b class="rotulo">Conectores úteis</b> Adição: além disso. Oposição: contudo. Causa: porque. Conclusão: portanto. Tempo: em seguida.</div>`,
     quiz:[
      {q:"Usar «ele», «a sua» para retomar «o Rui» é coesão...",o:["lexical","gramatical/referencial","temporal","nula"],c:1,e:"Pronomes/possessivos a retomar → coesão gramatical (referencial)."},
      {q:"«contudo», «por isso», «além disso» são...",o:["nomes","conectores (coesão interfrásica)","verbos","adjetivos"],c:1,e:"Ligam frases/parágrafos → conectores."},
      {q:"Repetir uma ideia com um sinónimo é coesão...",o:["lexical","gramatical","temporal","frásica"],c:0,e:"Recurso ao vocabulário (sinónimos) → coesão lexical."},
      {q:"Um texto sem contradições e com sentido global é...",o:["coeso só","coerente","incoerente","ambíguo"],c:1,e:"Faz sentido como um todo → coerente."}
     ]},

    /* ===== EDUCAÇÃO LITERÁRIA ===== */
    {id:'lusiadas9', area:'literaria', titulo:'Os Lusíadas — Camões', icone:'⚓', resumo:'A epopeia e os episódios',
     html:`<p class="lead"><b>«Os Lusíadas»</b> (1572), de <b>Luís de Camões</b>, é a epopeia que canta a viagem de <b>Vasco da Gama</b> à Índia e a glória do povo português.</p>
      <h4 class="sub">Estrutura formal</h4>
      <ul><li>10 cantos, em <b>oitavas</b> (estrofes de 8 versos), <b>decassílabos</b>, rima <b>abababcc</b>.</li>
      <li>Quatro partes: <b>Proposição</b> (apresenta o assunto), <b>Invocação</b> (pede inspiração às Tágides/ninfas), <b>Dedicatória</b> (a D. Sebastião), <b>Narração</b> (a viagem).</li>
      <li>Dois planos: <b>plano da viagem</b> (histórico) e <b>plano dos deuses</b> (mitológico — Júpiter, Vénus protegem; Baco opõe-se).</li></ul>
      <h4 class="sub">Episódios essenciais</h4>
      <table class="tab"><tr><th>Episódio</th><th>O que conta</th></tr>
      <tr><td><b>Consílio dos Deuses</b></td><td>os deuses do Olimpo decidem o destino dos portugueses.</td></tr>
      <tr><td><b>Inês de Castro</b></td><td>o trágico amor de Pedro e Inês, morta por «amor» — episódio lírico e sentimental.</td></tr>
      <tr><td><b>Adamastor</b></td><td>o gigante do Cabo das Tormentas ameaça os navegadores — o medo do desconhecido.</td></tr>
      <tr><td><b>Velho do Restelo</b></td><td>um ancião critica a aventura marítima e a ambição («Ó glória de mandar!»).</td></tr>
      <tr><td><b>Tempestade e chegada à Índia</b></td><td>Vénus acalma o mar; os portugueses alcançam Calecute.</td></tr></table>
      <div class="caixa exemplo"><b class="rotulo">Início (Proposição)</b> «As armas e os barões assinalados...» — anuncia que vai cantar os heróis portugueses.</div>`,
     quiz:[
      {q:"«Os Lusíadas» narra sobretudo a viagem de...",o:["Pedro Álvares Cabral ao Brasil","Vasco da Gama à Índia","Fernão de Magalhães","Bartolomeu Dias"],c:1,e:"Canta a viagem de Vasco da Gama à Índia."},
      {q:"As estrofes da epopeia são...",o:["quadras","tercetos","oitavas (8 versos)","sonetos"],c:2,e:"Oitavas: estrofes de 8 versos decassílabos."},
      {q:"Na «Proposição», o poeta...",o:["pede inspiração","apresenta o assunto que vai cantar","dedica a obra ao rei","narra a tempestade"],c:1,e:"A Proposição apresenta o tema/assunto da epopeia."},
      {q:"O gigante que ameaça os navegadores no Cabo é...",o:["Baco","Adamastor","Júpiter","o Velho do Restelo"],c:1,e:"O Adamastor, gigante do Cabo das Tormentas."},
      {q:"O Velho do Restelo representa...",o:["o entusiasmo pela viagem","a crítica/aviso contra a ambição e os perigos","a ajuda dos deuses","o amor de Inês"],c:1,e:"Voz crítica que adverte contra a ambição («cobiça») e os riscos."},
      {q:"O episódio de amor trágico é o de...",o:["Adamastor","Inês de Castro","Consílio dos Deuses","Tempestade"],c:1,e:"Inês de Castro: amor e morte, o tom lírico da epopeia."}
     ]},
    {id:'auto9', area:'literaria', titulo:'Auto da Barca do Inferno', icone:'⛵', resumo:'Gil Vicente — alegoria e sátira',
     html:`<p class="lead">O <b>«Auto da Barca do Inferno»</b> (1517), de <b>Gil Vicente</b>, é uma peça de teatro <b>alegórica</b> e satírica: várias personagens, depois de mortas, chegam a um cais onde têm de escolher entre a <b>barca do Inferno</b> (Diabo) e a <b>barca da Glória</b> (Anjo).</p>
      <h4 class="sub">Sentido alegórico</h4>
      <p>É um <b>juízo final</b>: cada personagem é julgada pelos seus atos em vida. Gil Vicente faz a <b>crítica social</b> dos vícios de cada grupo da sociedade.</p>
      <table class="tab"><tr><th>Personagem</th><th>Vício criticado</th><th>Destino</th></tr>
      <tr><td>Fidalgo</td><td>vaidade, soberba, exploração do povo</td><td>Inferno</td></tr>
      <tr><td>Onzeneiro</td><td>usura, ganância (emprestava a juros)</td><td>Inferno</td></tr>
      <tr><td>Sapateiro</td><td>roubava os clientes</td><td>Inferno</td></tr>
      <tr><td>Frade</td><td>quebrou os votos (mulher, armas)</td><td>Inferno</td></tr>
      <tr><td>Alcoviteira (Brísida Vaz)</td><td>feitiçaria, alcovitice</td><td>Inferno</td></tr>
      <tr><td>Judeu</td><td>—</td><td>Inferno (reboque)</td></tr>
      <tr><td>Corregedor e Procurador</td><td>corrupção da justiça</td><td>Inferno</td></tr>
      <tr><td>Enforcado (Parvo / Joane)</td><td>—</td><td>indeciso / o Parvo salva-se pela inocência</td></tr>
      <tr><td><b>Cavaleiros (que morreram pela Fé)</b></td><td>—</td><td><b>Glória</b> (salvam-se)</td></tr></table>
      <div class="caixa nota"><b class="rotulo">Crítica social</b> Gil Vicente critica o clero, a nobreza, a justiça e os ofícios corruptos. Salvam-se a inocência (Parvo) e o sacrifício pela Fé (Cavaleiros).</div>`,
     quiz:[
      {q:"O autor do «Auto da Barca do Inferno» é...",o:["Luís de Camões","Gil Vicente","Almeida Garrett","Padre António Vieira"],c:1,e:"É de Gil Vicente (séc. XV-XVI)."},
      {q:"A peça representa, alegoricamente, um...",o:["casamento","juízo final / julgamento das almas","banquete","torneio"],c:1,e:"As almas são julgadas pelos seus atos → juízo final."},
      {q:"O Fidalgo é condenado por...",o:["roubar sapatos","vaidade e soberba (e maus-tratos ao povo)","usura","feitiçaria"],c:1,e:"Personifica a vaidade/soberba da nobreza."},
      {q:"O Onzeneiro simboliza o vício da...",o:["preguiça","usura/ganância","gula","luxúria"],c:1,e:"Emprestava dinheiro a juros altos → usura/avareza."},
      {q:"Quem se salva e vai para a Glória são os...",o:["Fidalgos","Cavaleiros mortos pela Fé","Frades","Corregedores"],c:1,e:"Os Cavaleiros que morreram a defender a Fé salvam-se."},
      {q:"A personagem cuja inocência o aproxima da salvação é o...",o:["Sapateiro","Parvo (Joane)","Onzeneiro","Corregedor"],c:1,e:"O Parvo, pela sua simplicidade/inocência, escapa à condenação."}
     ]},
    {id:'sec20_9', area:'literaria', titulo:'Conto e poesia do século XX', icone:'🪶', resumo:'Narrativas e poemas modernos',
     html:`<p class="lead">Leem-se também <b>contos</b> e <b>poesia</b> de autores portugueses do século XX.</p>
      <h4 class="sub">Conto</h4>
      <p>Autores como <b>Vergílio Ferreira</b>, <b>Manuel da Fonseca</b>, <b>Sophia de M. B. Andresen</b>, <b>Jorge de Sena</b>, <b>Mário de Carvalho</b>. Analisa narrador, personagens, espaço, tempo e a <b>mensagem/crítica</b>.</p>
      <h4 class="sub">Poesia</h4>
      <p><b>Fernando Pessoa</b>, <b>Miguel Torga</b>, <b>Eugénio de Andrade</b>, <b>Sophia</b>, <b>Alexandre O'Neill</b>… Atende ao tema, ao sujeito poético, à estrutura e aos recursos expressivos.</p>
      <div class="caixa dica"><b class="rotulo">Na análise</b> Liga a <b>forma</b> (estrofes, rima, recursos) ao <b>sentido</b> (o que o poema transmite e porquê).</div>`,
     quiz:[
      {q:"Na análise de um conto, identificamos...",o:["estrofe e métrica","narrador, personagens, espaço, tempo","atos e cenas","tese e argumentos"],c:1,e:"Conto = narrativa → categorias da narrativa."},
      {q:"A voz que fala num poema é o...",o:["narrador","poeta","sujeito poético","autor"],c:2,e:"O sujeito poético."},
      {q:"Um bom comentário de poema deve ligar...",o:["só a biografia do autor","a forma ao sentido","apenas a rima","só o título"],c:1,e:"Relacionar recursos/forma com o significado."},
      {q:"Sophia de M. B. Andresen é autora de...",o:["só teatro","contos e poesia","só romances","notícias"],c:1,e:"Escreveu contos e poesia (entre outros)."}
     ]},

    /* ===== LEITURA ===== */
    {id:'leit9a', area:'leitura', titulo:'Ler: Os Lusíadas (Velho do Restelo)', icone:'🔍', resumo:'Interpreta o episódio',
     lead:'Lê a estrofe e responde, ligando forma e sentido.',
     texto:{titulo:'Os Lusíadas — o Velho do Restelo (Canto IV)', autor:'Luís de Camões',
      corpo:`<div class="verso">«Ó glória de mandar! Ó vã cobiça
desta vaidade a quem chamamos Fama!
Ó fraudulento gosto, que se atiça
c'uma aura popular, que honra se chama!
Que castigo tamanho e que justiça
fazes no peito vão que muito te ama!
Que mortes, que perigos, que tormentas,
que crueldades neles experimentas!»</div>`},
     quiz:[
      {q:"Quem profere estas palavras?",o:["Vasco da Gama","O Velho do Restelo","O Adamastor","Júpiter"],c:1,e:"É o Velho do Restelo, no momento da partida das naus."},
      {q:"«Ó glória de mandar! Ó vã cobiça» é um recurso de...",o:["comparação","apóstrofe (invocação)","eufemismo","metonímia"],c:1,e:"Invoca/interpela diretamente a «glória» e a «cobiça» → apóstrofe."},
      {q:"A atitude do Velho perante a viagem é de...",o:["entusiasmo","crítica e advertência","indiferença","alegria"],c:1,e:"Critica a ambição («cobiça», «vaidade») e alerta para os perigos."},
      {q:"A repetição «Que mortes, que perigos, que tormentas» é uma...",o:["enumeração com anáfora","metáfora","onomatopeia","ironia"],c:0,e:"Enumera os males, repetindo «que» (anáfora), para reforçar o aviso."},
      {q:"«vã cobiça» e «vaidade» exprimem que a Fama, para o Velho, é...",o:["um bem supremo","vazia e perigosa","divina","necessária"],c:1,e:"Considera a Fama «vã» (vazia) e fonte de sofrimento."}
     ]},

    /* ===== ESCRITA ===== */
    {id:'escr9', area:'escrita', titulo:'Texto de opinião (exame)', icone:'✍️', resumo:'Estrutura argumentativa completa',
     lead:'Prepara o tipo de texto pedido no exame final de ciclo.',
     enunciado:`Escreve um <b>texto de opinião</b> (180 a 240 palavras) sobre: <b>«A leitura continua a ser importante numa época dominada pelos ecrãs?»</b>. Apresenta uma posição clara, três argumentos com exemplos e uma conclusão.`,
     criterios:['Introdução com a tese (tomada de posição).','Três argumentos, cada um desenvolvido com exemplo ou explicação.','Uso correto de conectores (em primeiro lugar, além disso, por outro lado, em suma).','Parágrafos bem delimitados.','Conclusão que sintetiza e reforça a posição.','Ortografia, pontuação e ~180-240 palavras.'],
     modelo:`<b>1.º §</b> introdução + tese. <b>2.º-4.º §</b> um argumento por parágrafo (afirmação + explicação + exemplo). <b>5.º §</b> conclusão.`}
,
    /* ===== TREINO EXTRA ===== */
    {id:'extragram9', area:'gramatica', titulo:'Exercícios extra — Gramática', icone:'🎯', resumo:'Subordinadas, funções, coesão',
     html:`<p class="lead">Mais exercícios para consolidar a gramática do 9.º ano.</p>`,
     quiz:[
      {q:"«Disse que viria.» — «que viria» é oração...",o:["subordinada substantiva completiva","adjetiva relativa","adverbial causal","coordenada"],c:0,e:"Completa o verbo «dizer» (como CD) → substantiva completiva."},
      {q:"«Os livros que comprei são caros.» — «que comprei» é...",o:["substantiva","adjetiva relativa restritiva","adverbial","coordenada"],c:1,e:"Refere-se ao nome «livros» e restringe-o (sem vírgulas) → adjetiva relativa restritiva."},
      {q:"«O Rui, que é médico, ajudou.» — a relativa é...",o:["restritiva","explicativa","completiva","final"],c:1,e:"Entre vírgulas, acessória → explicativa."},
      {q:"«Vou-me embora porque está tarde.» — subordinada...",o:["temporal","causal","final","condicional"],c:1,e:"«porque» = causa → causal."},
      {q:"«Quem tudo quer tudo perde.» — «Quem tudo quer» é subordinada...",o:["substantiva relativa (sem antecedente)","adjetiva relativa","adverbial","coordenada"],c:0,e:"Relativa sem antecedente, com valor de sujeito → substantiva."},
      {q:"«Considero-o <b>responsável</b>.» — «responsável» é...",o:["predicativo do sujeito","predicativo do complemento direto","modificador","complemento do nome"],c:1,e:"Atribui qualidade ao CD → predicativo do complemento direto."},
      {q:"«Tenho a certeza <b>da tua vitória</b>.» — a expressão é...",o:["complemento do nome","complemento do adjetivo","complemento direto","modificador"],c:0,e:"Completa o nome «certeza» → complemento do nome."},
      {q:"«Estou orgulhoso <b>de ti</b>.» — a expressão é...",o:["complemento do nome","complemento do adjetivo","complemento indireto","oblíquo"],c:1,e:"Completa o adjetivo «orgulhoso» → complemento do adjetivo."},
      {q:"Voz passiva de «O artista pintou o quadro.»:",o:["O quadro pintou o artista.","O quadro foi pintado pelo artista.","O artista foi pintado.","Pintou-se o quadro do artista."],c:1,e:"Passiva: «O quadro foi pintado pelo artista.»"},
      {q:"Usar «ele», «o seu» para retomar «o autor» é coesão...",o:["lexical","referencial (gramatical)","temporal","frásica"],c:1,e:"Pronomes/possessivos a retomar → coesão referencial."},
      {q:"«além disso», «por isso», «contudo» são...",o:["nomes","conectores (coesão interfrásica)","verbos","adjetivos"],c:1,e:"Ligam frases → conectores."},
      {q:"«Infelizmente, perdemos o jogo.» — «Infelizmente» é...",o:["modificador de frase","predicativo","complemento oblíquo","vocativo"],c:0,e:"Modifica toda a frase (atitude do falante) → modificador de frase."},
      {q:"«Mal cheguei, telefonei-te.» — «Mal cheguei» é subordinada...",o:["causal","temporal","condicional","final"],c:1,e:"«mal» (= assim que) situa no tempo → temporal."},
      {q:"Retomar «o cão» por «o animal» é coesão...",o:["lexical","referencial","temporal","frásica"],c:0,e:"Recurso a hiperónimo/sinónimo → coesão lexical."},
      {q:"«Se tivesses estudado, terias passado.» — subordinada...",o:["causal","condicional","concessiva","temporal"],c:1,e:"«se» = condição → condicional."}
     ]},
    {id:'extralit9', area:'literaria', titulo:'Exercícios extra — Os Lusíadas e o Auto', icone:'🎯', resumo:'Camões e Gil Vicente',
     html:`<p class="lead">Mais exercícios sobre as obras do 9.º ano.</p>`,
     quiz:[
      {q:"As estrofes d'«Os Lusíadas» têm...",o:["4 versos","8 versos (oitavas)","3 versos","14 versos"],c:1,e:"Oitavas: 8 versos decassílabos, rima abababcc."},
      {q:"Na «Invocação», Camões dirige-se...",o:["a D. Sebastião","às Tágides (ninfas do Tejo)","a Baco","a Vasco da Gama"],c:1,e:"Invoca as Tágides pedindo inspiração."},
      {q:"O episódio do amor trágico de Pedro e Inês é o de...",o:["Adamastor","Inês de Castro","Consílio dos Deuses","Tempestade"],c:1,e:"Inês de Castro: amor e morte."},
      {q:"O Adamastor é o gigante que ameaça os navegadores no...",o:["Cabo das Tormentas (Boa Esperança)","Tejo","Mediterrâneo","Índico interior"],c:0,e:"Surge no Cabo das Tormentas, simbolizando o medo do desconhecido."},
      {q:"O Velho do Restelo representa...",o:["o entusiasmo pela viagem","a crítica à ambição e o aviso dos perigos","a ajuda dos deuses","o amor de Inês"],c:1,e:"Voz crítica contra a «cobiça» e os riscos."},
      {q:"O deus que protege os portugueses é...",o:["Baco","Vénus","Netuno (sempre)","Marte (contra)"],c:1,e:"Vénus protege; Baco opõe-se."},
      {q:"O autor do «Auto da Barca do Inferno» é...",o:["Camões","Gil Vicente","Garrett","Vieira"],c:1,e:"Gil Vicente."},
      {q:"A peça representa, alegoricamente, um...",o:["casamento","juízo final (julgamento das almas)","torneio","banquete"],c:1,e:"As almas são julgadas pelos seus atos → juízo final."},
      {q:"O Onzeneiro é condenado pelo vício da...",o:["preguiça","usura/ganância","gula","vaidade"],c:1,e:"Emprestava a juros → usura/avareza."},
      {q:"O Fidalgo personifica sobretudo a...",o:["humildade","vaidade e soberba","caridade","coragem"],c:1,e:"A vaidade/soberba da nobreza."},
      {q:"Quem se salva e vai para a Glória são os...",o:["Frades","Cavaleiros mortos pela Fé","Corregedores","Sapateiros"],c:1,e:"Os Cavaleiros que morreram a defender a Fé."},
      {q:"A personagem cuja inocência o aproxima da salvação é o...",o:["Sapateiro","Parvo (Joane)","Onzeneiro","Fidalgo"],c:1,e:"O Parvo, pela sua simplicidade/inocência."},
      {q:"«Os Lusíadas» significa...",o:["os navios","os filhos de Luso (os portugueses)","os deuses","os mares"],c:1,e:"Descendentes de Luso → os portugueses."},
      {q:"A «Proposição» d'«Os Lusíadas»...",o:["pede inspiração","apresenta o assunto da obra","dedica ao rei","narra a tempestade"],c:1,e:"Enuncia o tema («As armas e os barões...»)."},
      {q:"O Auto da Barca do Inferno faz, sobretudo, uma...",o:["exaltação dos navegadores","crítica social dos vícios de cada grupo","descrição da natureza","narração de uma viagem real"],c:1,e:"Sátira/crítica social dos vícios das várias classes."}
     ]}
  ],
  obras:[
    {t:'Os Lusíadas (episódios)', a:'Luís de Camões', g:'epopeia'},
    {t:'Auto da Barca do Inferno', a:'Gil Vicente', g:'texto dramático'},
    {t:'Contos do século XX', a:'Vergílio Ferreira, Sophia, Manuel da Fonseca, Mário de Carvalho', g:'conto'},
    {t:'Poemas do século XX', a:'Fernando Pessoa, Miguel Torga, Eugénio de Andrade', g:'poesia'},
    {t:'Narrativa juvenil (escolha)', a:'autores vários', g:'narrativa'}
  ],
  glossario:[
    {t:'Epopeia', d:'Longo poema narrativo que canta feitos heroicos (Os Lusíadas).'},
    {t:'Oitava', d:'Estrofe de 8 versos (decassílabos) usada n\'Os Lusíadas.'},
    {t:'Proposição / Invocação / Dedicatória', d:'Partes iniciais da epopeia: tema / pedido de inspiração / oferta ao rei.'},
    {t:'Alegoria', d:'Representação de uma ideia abstrata através de figuras concretas (o Auto é um juízo final).'},
    {t:'Subordinada relativa', d:'Oração introduzida por que/o qual… que se refere a um nome (restritiva ou explicativa).'},
    {t:'Coesão', d:'Mecanismos que ligam as partes do texto (referência, conectores, sinónimos).'},
    {t:'Voz passiva', d:'O sujeito sofre a ação; quem a pratica é o complemento agente da passiva.'}
  ]
};
