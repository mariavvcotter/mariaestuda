CURRICULO['5'] = {
  subtitulo:'2.º Ciclo', ciclo:'2.º Ciclo', icone:'🌱',
  intro:'No 5.º ano começas a organizar o que já sabes da língua: as classes de palavras, os tipos de frase e os primeiros textos literários — fábulas, lendas, contos e poemas.',
  modulos:[
    /* ===================== GRAMÁTICA ===================== */
    {id:'classes5', area:'gramatica', titulo:'Classes de palavras', icone:'🔤', resumo:'Nome, adjetivo, verbo, determinante…',
     html:`<p class="lead">As palavras agrupam-se em <b>classes</b>, conforme a sua função na frase.</p>
      <table class="tab"><tr><th>Classe</th><th>O que indica</th><th>Exemplos</th></tr>
      <tr><td><b>Nome</b></td><td>seres, coisas, lugares, sentimentos</td><td>cão, escola, alegria, Maria</td></tr>
      <tr><td><b>Adjetivo</b></td><td>uma qualidade do nome</td><td>bonito, alto, simpático</td></tr>
      <tr><td><b>Verbo</b></td><td>ações, estados</td><td>correr, ser, pensar</td></tr>
      <tr><td><b>Determinante</b></td><td>vem antes do nome (artigo, possessivo…)</td><td>o, a, um, meu, este</td></tr>
      <tr><td><b>Quantificador</b></td><td>quantidade</td><td>dois, muitos, alguns</td></tr>
      <tr><td><b>Pronome</b></td><td>substitui o nome</td><td>eu, ele, este, ninguém</td></tr>
      <tr><td><b>Advérbio</b></td><td>modo, tempo, lugar, negação</td><td>bem, hoje, aqui, não</td></tr>
      <tr><td><b>Preposição</b></td><td>liga palavras</td><td>de, em, para, com</td></tr></table>
      <h4 class="sub">Subclasses do nome</h4>
      <ul><li><b>Comum</b> (cão, cidade) vs <b>próprio</b> (Rex, Lisboa)</li>
      <li><b>Concreto</b> (mesa) vs <b>abstrato</b> (amor)</li>
      <li><b>Coletivo</b>: nome no singular que designa um conjunto — <i>cardume</i> (peixes), <i>rebanho</i> (ovelhas), <i>alcateia</i> (lobos).</li></ul>
      <div class="caixa dica"><b class="rotulo">Truque</b> O <b>determinante</b> vem junto de um nome; o <b>pronome</b> aparece sozinho (substitui o nome): «<u>Este</u> livro» (det.) / «Quero <u>este</u>» (pron.).</div>`,
     quiz:[
      {q:"«Lisboa» é um nome...",o:["comum","próprio","coletivo","abstrato"],c:1,e:"Designa um lugar específico → nome próprio (escreve-se com maiúscula)."},
      {q:"«rebanho» é um nome...",o:["próprio","abstrato","coletivo","adjetivo"],c:2,e:"No singular designa um conjunto (de ovelhas) → nome coletivo."},
      {q:"Em «O cão <b>castanho</b> ladrou», «castanho» é...",o:["nome","adjetivo","verbo","advérbio"],c:1,e:"Indica uma qualidade do cão → adjetivo."},
      {q:"Em «Corri <b>muito</b>», «muito» é...",o:["adjetivo","quantificador","advérbio","nome"],c:2,e:"Modifica o verbo «corri» (intensidade) → advérbio."},
      {q:"«amor», «tristeza», «coragem» são nomes...",o:["concretos","abstratos","próprios","coletivos"],c:1,e:"Designam sentimentos/ideias que não se tocam → nomes abstratos."}
     ]},
    {id:'frase5', area:'gramatica', titulo:'Tipos e formas de frase', icone:'❓', resumo:'Declarativa, interrogativa, exclamativa…',
     html:`<h4 class="sub">Tipos de frase</h4>
      <table class="tab"><tr><th>Tipo</th><th>Serve para</th><th>Exemplo</th></tr>
      <tr><td><b>Declarativa</b></td><td>declarar/informar</td><td>O sol brilha.</td></tr>
      <tr><td><b>Interrogativa</b></td><td>perguntar</td><td>Onde estás?</td></tr>
      <tr><td><b>Exclamativa</b></td><td>exprimir emoção</td><td>Que lindo dia!</td></tr>
      <tr><td><b>Imperativa</b></td><td>dar ordem/conselho</td><td>Fecha a porta.</td></tr></table>
      <h4 class="sub">Formas de frase</h4>
      <p>Qualquer frase pode estar na forma <b>afirmativa</b> ou <b>negativa</b>:</p>
      <ul><li>Afirmativa: «Eu gosto de ler.»</li><li>Negativa: «Eu <b>não</b> gosto de ler.»</li></ul>
      <div class="caixa dica"><b class="rotulo">Pista da pontuação</b> Interrogativa → <b>?</b> · Exclamativa → <b>!</b> · Declarativa e imperativa → geralmente <b>.</b></div>`,
     quiz:[
      {q:"«Que confusão!» é uma frase...",o:["declarativa","interrogativa","exclamativa","imperativa"],c:2,e:"Exprime emoção e termina em «!» → exclamativa."},
      {q:"«Arruma o teu quarto.» é uma frase...",o:["imperativa","interrogativa","declarativa","exclamativa"],c:0,e:"Dá uma ordem → imperativa."},
      {q:"«Não vi o filme.» está na forma...",o:["afirmativa","negativa","interrogativa","imperativa"],c:1,e:"Tem «não» → forma negativa."},
      {q:"«Vais à festa?» é do tipo...",o:["exclamativa","declarativa","interrogativa","imperativa"],c:2,e:"Faz uma pergunta e termina em «?» → interrogativa."}
     ]},
    {id:'sujpred5', area:'gramatica', titulo:'Sujeito e predicado', icone:'🧩', resumo:'As duas partes da frase',
     html:`<p class="lead">A frase divide-se, normalmente, em duas partes: o <b>sujeito</b> e o <b>predicado</b>.</p>
      <table class="tab"><tr><th>Sujeito</th><th>Predicado</th></tr>
      <tr><td>de quem ou de que se fala</td><td>o que se diz do sujeito (começa no verbo)</td></tr>
      <tr><td><b>O meu irmão</b></td><td>joga futebol ao sábado.</td></tr></table>
      <h4 class="sub">Como descobrir o sujeito</h4>
      <p>Pergunta «<b>Quem?</b>» ou «<b>O quê?</b>» antes do verbo: <i>Quem joga futebol? → O meu irmão.</i></p>
      <ul><li><b>Sujeito simples</b>: um só núcleo — «<u>A Ana</u> canta.»</li>
      <li><b>Sujeito composto</b>: dois ou mais — «<u>A Ana e o Rui</u> cantam.»</li>
      <li><b>Sujeito subentendido</b> (não escrito): «(Eu) Estudei muito.»</li></ul>
      <div class="caixa dica"><b class="rotulo">Concordância</b> O verbo concorda com o sujeito: sujeito no plural → verbo no plural. «Os cães <b>ladram</b>.»</div>`,
     quiz:[
      {q:"Em «As crianças brincam no parque.», o sujeito é...",o:["no parque","brincam","As crianças","parque"],c:2,e:"«Quem brinca?» → As crianças (sujeito)."},
      {q:"Em «O João e a Rita estudaram.», o sujeito é...",o:["simples","composto","subentendido","nulo"],c:1,e:"Tem dois núcleos (João + Rita) → sujeito composto."},
      {q:"O predicado começa sempre...",o:["por um nome","pelo verbo","por uma preposição","por um adjetivo"],c:1,e:"O predicado contém o verbo e tudo o que se diz do sujeito."},
      {q:"Em «Comemos pizza ao jantar.», o sujeito está...",o:["composto","subentendido (nós)","no fim","ausente para sempre"],c:1,e:"O sujeito «nós» está subentendido na forma verbal «comemos»."}
     ]},
    {id:'flexao5', area:'gramatica', titulo:'Flexão e graus', icone:'📏', resumo:'Género, número e grau',
     html:`<h4 class="sub">Flexão em género e número</h4>
      <p>Nomes e adjetivos variam em <b>género</b> (masculino/feminino) e <b>número</b> (singular/plural): gato → gata → gatos → gatas.</p>
      <h4 class="sub">Graus do adjetivo</h4>
      <table class="tab"><tr><th>Grau</th><th>Exemplo</th></tr>
      <tr><td><b>Normal</b></td><td>A casa é grande.</td></tr>
      <tr><td><b>Comparativo de superioridade</b></td><td>mais grande do que... (→ maior do que)</td></tr>
      <tr><td><b>Comparativo de igualdade</b></td><td>tão grande como...</td></tr>
      <tr><td><b>Comparativo de inferioridade</b></td><td>menos grande do que...</td></tr>
      <tr><td><b>Superlativo absoluto</b></td><td>grandíssima / muito grande</td></tr>
      <tr><td><b>Superlativo relativo</b></td><td>a mais grande de todas (→ a maior)</td></tr></table>
      <div class="caixa atencao"><b class="rotulo">Formas especiais</b> grande→maior · pequeno→menor · bom→melhor · mau→pior.</div>`,
     quiz:[
      {q:"«tão alto como» é grau...",o:["comparativo de superioridade","comparativo de igualdade","superlativo absoluto","normal"],c:1,e:"«tão... como» exprime igualdade."},
      {q:"O comparativo de superioridade de «bom» é...",o:["mais bom","boníssimo","melhor","ótimo"],c:2,e:"«bom» tem forma especial: melhor (do que)."},
      {q:"«grandíssimo» é o grau...",o:["comparativo","superlativo absoluto sintético","superlativo relativo","normal"],c:1,e:"Indica qualidade no máximo, numa só palavra → superlativo absoluto sintético."},
      {q:"O plural de «o animal» é...",o:["os animais","os animales","os animal","as animais"],c:0,e:"Palavras em -al fazem plural em -ais: animal → animais."}
     ]},
    {id:'sentido5', area:'gramatica', titulo:'Palavras e sentido', icone:'🔁', resumo:'Sinónimos, antónimos, família',
     html:`<table class="tab"><tr><th>Relação</th><th>O que é</th><th>Exemplo</th></tr>
      <tr><td><b>Sinónimos</b></td><td>sentido parecido</td><td>contente = feliz</td></tr>
      <tr><td><b>Antónimos</b></td><td>sentido oposto</td><td>claro ≠ escuro</td></tr>
      <tr><td><b>Família de palavras</b></td><td>mesmo radical</td><td>flor, florista, florir, floreira</td></tr></table>
      <h4 class="sub">Palavras simples e complexas</h4>
      <ul><li><b>Simples</b>: um só radical — <i>mar</i>, <i>sol</i>.</li>
      <li><b>Complexas</b>: formadas a partir de outras — <i>marítimo</i>, <i>girassol</i>.</li></ul>
      <div class="caixa dica"><b class="rotulo">Cuidado</b> Sinónimos não servem sempre em todos os contextos — testa na frase!</div>`,
     quiz:[
      {q:"O antónimo de «alegre» é...",o:["contente","triste","feliz","animado"],c:1,e:"Sentido oposto de alegre → triste."},
      {q:"Qual NÃO pertence à família de «terra»?",o:["terreno","enterrar","terrível","aterrar"],c:2,e:"«terrível» vem de «terror», não de «terra» — só parece."},
      {q:"Sinónimo de «iniciar»:",o:["acabar","começar","parar","fechar"],c:1,e:"Iniciar = começar."},
      {q:"«girassol» é uma palavra...",o:["simples","complexa (composta)","sem radical","abstrata"],c:1,e:"Forma-se de «girar» + «sol» → palavra complexa (composta)."}
     ]},

    /* ===================== EDUCAÇÃO LITERÁRIA ===================== */
    {id:'narr5', area:'literaria', titulo:'O texto narrativo', icone:'📖', resumo:'Quem conta, onde, quando',
     html:`<p class="lead">Narrar é <b>contar uma história</b>. Para a compreender, identifica os seus elementos.</p>
      <table class="tab"><tr><th>Elemento</th><th>Pergunta</th></tr>
      <tr><td><b>Narrador</b></td><td>Quem conta a história?</td></tr>
      <tr><td><b>Personagens</b></td><td>Quem participa? (principal, secundária)</td></tr>
      <tr><td><b>Ação</b></td><td>O que acontece?</td></tr>
      <tr><td><b>Espaço</b></td><td>Onde acontece?</td></tr>
      <tr><td><b>Tempo</b></td><td>Quando acontece?</td></tr></table>
      <h4 class="sub">Estrutura da narrativa</h4>
      <p><b>Introdução</b> (apresentação) → <b>desenvolvimento</b> (peripécias/problema) → <b>conclusão</b> (desfecho).</p>
      <div class="caixa nota"><b class="rotulo">Narrador</b> Pode contar na <b>1.ª pessoa</b> (eu, participa) ou na <b>3.ª pessoa</b> (ele, está de fora).</div>`,
     quiz:[
      {q:"O narrador é...",o:["a pessoa que escreve o livro","quem conta a história","a personagem principal sempre","o leitor"],c:1,e:"O narrador é a voz que conta a história (não é o autor)."},
      {q:"A parte da narrativa onde se apresentam as personagens é a...",o:["introdução","conclusão","moral","rima"],c:0,e:"Na introdução conhecemos personagens, espaço e tempo."},
      {q:"«Era uma vez, num reino distante...» indica sobretudo o...",o:["narrador","espaço e tempo","problema","desfecho"],c:1,e:"Situa onde (reino) e quando (era uma vez) → espaço e tempo."},
      {q:"A personagem mais importante chama-se...",o:["secundária","figurante","principal/protagonista","narrador"],c:2,e:"É a protagonista/personagem principal."}
     ]},
    {id:'fabula5', area:'literaria', titulo:'Fábula, lenda e conto', icone:'🦊', resumo:'Géneros narrativos breves',
     html:`<table class="tab"><tr><th>Género</th><th>Características</th></tr>
      <tr><td><b>Fábula</b></td><td>história curta, muitas vezes com <b>animais</b> que falam; termina com uma <b>moral</b> (lição). Ex.: Esopo, La Fontaine.</td></tr>
      <tr><td><b>Lenda</b></td><td>explica a origem de um lugar, nome ou costume, misturando realidade e fantasia. Ex.: Lenda de Ourém.</td></tr>
      <tr><td><b>Conto</b></td><td>narrativa breve, com poucas personagens e uma ação central.</td></tr></table>
      <div class="caixa exemplo"><b class="rotulo">A moral da fábula</b> É o ensinamento final. Na fábula «A cigarra e a formiga», a moral é que devemos ser <b>previdentes</b> e trabalhar a tempo.</div>
      <div class="caixa dica"><b class="rotulo">Reconhece</b> Animais que falam + lição = <b>fábula</b>. Explica a origem de algo = <b>lenda</b>.</div>`,
     quiz:[
      {q:"A lição final de uma fábula chama-se...",o:["rima","moral","título","narrador"],c:1,e:"A fábula termina com uma moral (ensinamento)."},
      {q:"Um texto que explica a origem do nome de uma cidade é uma...",o:["fábula","lenda","notícia","receita"],c:1,e:"Explicar origens misturando real e fantástico → lenda."},
      {q:"Nas fábulas, as personagens são muitas vezes...",o:["reis","animais que falam","cientistas","jornalistas"],c:1,e:"As fábulas usam animais com características humanas."},
      {q:"«A cigarra e a formiga» é uma...",o:["lenda","notícia","fábula","biografia"],c:2,e:"Animais + moral sobre a previdência → fábula."}
     ]},
    {id:'poesia5', area:'literaria', titulo:'O texto poético', icone:'🪶', resumo:'Verso, estrofe e rima',
     html:`<p class="lead">A poesia escreve-se em <b>versos</b> (cada linha) agrupados em <b>estrofes</b> (conjuntos de versos).</p>
      <ul><li><b>Verso</b> = cada linha do poema.</li>
      <li><b>Estrofe</b> = grupo de versos separado por um espaço.</li>
      <li><b>Rima</b> = sons iguais no fim dos versos.</li>
      <li><b>Refrão</b> = verso(s) que se repete(m).</li></ul>
      <h4 class="sub">Estrofes (pelo n.º de versos)</h4>
      <p><span class="tag">2 → dístico</span><span class="tag">3 → terceto</span><span class="tag">4 → quadra</span><span class="tag">5 → quintilha</span></p>
      <div class="caixa exemplo"><b class="rotulo">Rima</b> «O gato subiu ao <b>telhado</b> / e ficou todo <b>molhado</b>» — <i>telhado / molhado</i> rimam.</div>`,
     quiz:[
      {q:"Cada linha de um poema é um...",o:["verso","estrofe","parágrafo","refrão"],c:0,e:"Cada linha = verso. Vários versos = estrofe."},
      {q:"Uma estrofe de 4 versos chama-se...",o:["terceto","quadra","dístico","quintilha"],c:1,e:"4 versos → quadra."},
      {q:"Sons iguais no fim dos versos formam a...",o:["estrofe","rima","sílaba","moral"],c:1,e:"Rima = sons iguais no final dos versos."},
      {q:"O verso que se repete ao longo do poema é o...",o:["título","refrão","dístico","narrador"],c:1,e:"O refrão é o verso/conjunto que se repete."}
     ]},

    /* ===================== LEITURA ===================== */
    {id:'leit5a', area:'leitura', titulo:'Ler: a fábula', icone:'🔍', resumo:'Interpreta uma fábula',
     lead:'Lê a fábula e responde às perguntas de interpretação.',
     texto:{titulo:'O leão e o ratinho', autor:'Adaptado de Esopo',
      corpo:`<p>Um leão dormia tranquilamente quando um pequeno rato lhe correu pela juba. O leão acordou furioso e prendeu o ratinho com a sua enorme pata.</p>
      <p>— Perdoa-me! — suplicou o rato. — Se me deixares viver, um dia poderei ajudar-te.</p>
      <p>O leão riu-se: como poderia um ser tão pequeno ajudá-lo? Mas, divertido, soltou-o.</p>
      <p>Dias depois, o leão caiu numa rede de caçadores. Por mais que rugisse, não conseguia libertar-se. Ouvindo os rugidos, o ratinho acorreu e, com os seus dentes afiados, roeu as cordas até o leão ficar livre.</p>
      <p><i>Moral: não desprezes os pequenos; um dia poderão valer-te mais do que os grandes.</i></p>`},
     quiz:[
      {q:"Por que motivo o leão soltou o rato?",o:["Teve medo dele","Achou graça e divertiu-se","O rato fugiu","Os caçadores chegaram"],c:1,e:"O leão riu-se, divertido com a ideia, e soltou-o."},
      {q:"Como ajudou o ratinho o leão?",o:["Chamou outros leões","Roeu as cordas da rede","Assustou os caçadores","Trouxe comida"],c:1,e:"Com os dentes afiados, roeu as cordas."},
      {q:"A moral ensina-nos a...",o:["fugir do perigo","não desprezar os mais pequenos","caçar leões","dormir tranquilos"],c:1,e:"A lição é que mesmo os pequenos podem ser muito úteis."},
      {q:"Este texto é uma fábula porque tem...",o:["rima e estrofes","animais que falam e uma moral","uma notícia","datas reais"],c:1,e:"Animais com fala + moral → fábula."}
     ]},

    /* ===================== ESCRITA ===================== */
    {id:'escr5', area:'escrita', titulo:'Escrever uma narrativa', icone:'✍️', resumo:'Conta uma pequena história',
     lead:'Treina a escrita criativa respeitando a estrutura da narrativa.',
     enunciado:`Escreve uma <b>narrativa</b> (15 a 25 linhas) a partir do tema: <b>«Um dia em que algo inesperado aconteceu»</b>. A tua história deve ter início, meio e fim, pelo menos uma personagem e indicar o espaço e o tempo.`,
     criterios:['Tem introdução, desenvolvimento e conclusão.','Apresenta personagem(ns), espaço e tempo.','Usa parágrafos e pontuação correta.','Inclui pelo menos uma fala (discurso direto, com travessão).','Vocabulário variado e sem repetições.'],
     modelo:`<b>Introdução:</b> apresenta quem, onde e quando. <br><b>Desenvolvimento:</b> conta o que de inesperado aconteceu (o problema). <br><b>Conclusão:</b> como tudo terminou.`}
,
    /* ===== TREINO EXTRA ===== */
    {id:'extragram5', area:'gramatica', titulo:'Exercícios extra — Gramática', icone:'🎯', resumo:'Bateria de treino de gramática',
     html:`<p class="lead">Mais exercícios para consolidar a gramática do 5.º ano. Responde a cada um e vê logo a correção.</p>`,
     quiz:[
      {q:"«rapidamente» pertence à classe...",o:["adjetivo","advérbio","nome","verbo"],c:1,e:"Indica o modo como se faz algo → advérbio."},
      {q:"O nome coletivo de «lobos» é...",o:["matilha","alcateia","cardume","enxame"],c:1,e:"Conjunto de lobos → alcateia."},
      {q:"Em «três gatos», «três» é um...",o:["determinante artigo","quantificador numeral","pronome","advérbio"],c:1,e:"Indica quantidade exata → quantificador numeral."},
      {q:"«Que horas são?» é uma frase...",o:["declarativa","exclamativa","interrogativa","imperativa"],c:2,e:"Faz uma pergunta → interrogativa."},
      {q:"A forma negativa de «Eu vi tudo» é...",o:["Eu vi tudo!","Eu não vi nada","Vi eu tudo","Eu vi"],c:1,e:"Negativa: «Eu não vi nada»."},
      {q:"Em «Os pássaros cantam de manhã», o sujeito é...",o:["de manhã","cantam","Os pássaros","manhã"],c:2,e:"«Quem canta?» → Os pássaros."},
      {q:"O plural de «o papel» é...",o:["os papeles","os papéis","os papel","os papeis"],c:1,e:"Palavras em -el → -éis: papel → papéis."},
      {q:"O feminino de «o ator» é...",o:["a atora","a atriz","a atoresa","a atrize"],c:1,e:"Forma especial: ator → atriz."},
      {q:"«altíssimo» é o grau...",o:["comparativo","superlativo absoluto sintético","normal","superlativo relativo"],c:1,e:"Qualidade no máximo, numa só palavra → superlativo absoluto sintético."},
      {q:"O antónimo de «começar» é...",o:["iniciar","terminar","principiar","arrancar"],c:1,e:"Oposto de começar → terminar."},
      {q:"Sinónimo de «casa» (lugar onde se vive):",o:["rua","lar","jardim","cidade"],c:1,e:"casa = lar/moradia."},
      {q:"Em «desfazer», «des-» é um...",o:["sufixo","prefixo (negação/inversão)","radical","nome"],c:1,e:"«des-» é prefixo que indica ação contrária."},
      {q:"Em «O João correu muito.», o predicado é...",o:["O João","correu muito","muito","João"],c:1,e:"O predicado começa no verbo: «correu muito»."},
      {q:"Em «pão e queijo», «e» é uma...",o:["preposição","conjunção","interjeição","advérbio"],c:1,e:"Liga dois elementos → conjunção (coordenativa)."},
      {q:"«Ai!» é uma...",o:["preposição","interjeição","conjunção","nome"],c:1,e:"Exprime uma emoção → interjeição."}
     ]},
    {id:'extralit5', area:'literaria', titulo:'Exercícios extra — Leitura e Literatura', icone:'🎯', resumo:'Treino de fábula, poesia e narrativa',
     html:`<p class="lead">Mais exercícios sobre os textos literários do 5.º ano.</p>`,
     quiz:[
      {q:"A lição final de uma fábula é a...",o:["rima","moral","estrofe","didascália"],c:1,e:"A fábula termina com uma moral."},
      {q:"Uma estrofe de 3 versos chama-se...",o:["dístico","terceto","quadra","quintilha"],c:1,e:"3 versos → terceto."},
      {q:"Em «o gato no telhado / ficou todo molhado», rimam...",o:["gato/molhado","telhado/molhado","gato/todo","no/todo"],c:1,e:"telhado / molhado rimam (sons finais iguais)."},
      {q:"Um texto que explica a origem do nome de um lugar é uma...",o:["fábula","lenda","notícia","receita"],c:1,e:"Explicar origens (real+fantasia) → lenda."},
      {q:"Um narrador que diz «eu vi tudo o que aconteceu» conta na...",o:["3.ª pessoa","1.ª pessoa (participante)","2.ª pessoa","sem pessoa"],c:1,e:"«eu» + participa → 1.ª pessoa, narrador participante."},
      {q:"«Era uma vez um rei...» pertence à parte da narrativa chamada...",o:["introdução","conclusão","moral","clímax"],c:0,e:"Apresenta personagens/tempo/espaço → introdução."},
      {q:"«O sol sorriu para nós» é um recurso de...",o:["comparação","personificação","hipérbole","onomatopeia"],c:1,e:"Sorrir (ação humana) ao sol → personificação."},
      {q:"«Corajoso como um leão» é uma...",o:["metáfora","comparação","personificação","enumeração"],c:1,e:"Tem «como» → comparação."},
      {q:"Uma estrofe de 4 versos é uma...",o:["terceto","quadra","quintilha","sextilha"],c:1,e:"4 versos → quadra."},
      {q:"Nas fábulas, as personagens costumam ser...",o:["reis","animais que falam","cientistas","robôs"],c:1,e:"Animais com características humanas."},
      {q:"A personagem mais importante de uma história é a...",o:["figurante","secundária","principal","narrador"],c:2,e:"A personagem principal/protagonista."},
      {q:"Um conto é uma narrativa...",o:["muito longa","breve, com poucas personagens","sem personagens","em verso"],c:1,e:"O conto é breve, com ação central e poucas personagens."},
      {q:"Cada linha de um poema é um...",o:["verso","parágrafo","capítulo","refrão"],c:0,e:"Cada linha = verso."},
      {q:"O conjunto de versos separado por um espaço é uma...",o:["rima","estrofe","sílaba","moral"],c:1,e:"Estrofe = grupo de versos."},
      {q:"«Glub glub», «tic-tac» são exemplos de...",o:["metáfora","onomatopeia","comparação","rima"],c:1,e:"Imitam sons → onomatopeias."}
     ]}
  ],
  obras:[
    {t:'A Fada Oriana', a:'Sophia de Mello Breyner Andresen', g:'narrativa'},
    {t:'Ulisses', a:'Maria Alberta Menéres', g:'narrativa'},
    {t:'Fábulas', a:'Esopo / La Fonteine / Leonardo da Vinci', g:'fábula'},
    {t:'Lendas (ex.: do Bando dos Quatro)', a:'tradição popular / autores vários', g:'lenda'},
    {t:'Poemas', a:'Luísa Ducla Soares, Matilde Rosa Araújo…', g:'poesia'},
    {t:'O Beijo da Palavrinha', a:'Mia Couto', g:'narrativa (língua port.)'}
  ],
  glossario:[
    {t:'Nome coletivo', d:'Nome no singular que designa um conjunto (cardume, rebanho, alcateia).'},
    {t:'Sujeito', d:'De quem ou de que se fala na frase; responde a «quem?».'},
    {t:'Predicado', d:'O que se diz do sujeito; começa no verbo.'},
    {t:'Moral', d:'Ensinamento/lição com que termina uma fábula.'},
    {t:'Lenda', d:'Narrativa que explica a origem de algo, misturando realidade e fantasia.'},
    {t:'Estrofe', d:'Conjunto de versos separado por um espaço.'},
    {t:'Rima', d:'Sons iguais no fim dos versos.'}
  ]
};
