CURRICULO['12'] = {
  subtitulo:'Ensino Secundário', ciclo:'Secundário', icone:'🎓',
  intro:'No 12.º ano, ano de exame nacional, o centro é Fernando Pessoa — ortónimo e heterónimos (Caeiro, Reis, Campos) e a «Mensagem» — a par da poesia do século XX e do romance de José Saramago.',
  modulos:[
    /* ===== GRAMÁTICA ===== */
    {id:'gram12', area:'gramatica', titulo:'Gramática para o exame', icone:'🧩', resumo:'Coesão, dêixis, aspeto, orações',
     html:`<p class="lead">Revisão dos conteúdos gramaticais mais avaliados no exame nacional.</p>
      <h4 class="sub">Coesão e coerência</h4>
      <p>Referencial (pronomes), lexical (sinónimos/reiteração), interfrásica (conectores), temporal (correlação de tempos). Coerência = sentido global sem contradições.</p>
      <h4 class="sub">Dêixis</h4>
      <p>Pessoal (eu/tu), espacial (aqui/aí/ali), temporal (agora/ontem). Os deíticos «ancoram» o texto no contexto de enunciação.</p>
      <h4 class="sub">Valor aspetual e modalidade</h4>
      <p>Perfetivo vs imperfetivo; modalidade epistémica, deôntica e apreciativa.</p>
      <h4 class="sub">Orações e funções</h4>
      <p>Distinção entre coordenadas e subordinadas (substantivas, adjetivas, adverbiais) e identificação de funções sintáticas.</p>
      <div class="caixa dica"><b class="rotulo">No exame</b> Lê o enunciado com atenção: pedem frequentemente o <b>tipo de oração</b>, a <b>função sintática</b>, o <b>processo de coesão</b> ou o <b>valor</b> (aspetual/modal) de uma expressão.</div>`,
     quiz:[
      {q:"«O poeta... ele... a sua obra» — a retoma por pronomes/possessivos é coesão...",o:["lexical","referencial (gramatical)","temporal","interfrásica"],c:1,e:"Pronomes e possessivos a retomar → coesão referencial."},
      {q:"«Talvez ele tenha razão.» exprime modalidade...",o:["deôntica","epistémica","apreciativa","aspetual"],c:1,e:"Probabilidade/incerteza → epistémica."},
      {q:"«Espero que compreendas.» — «que compreendas» é oração...",o:["subordinada substantiva completiva","adjetiva relativa","adverbial causal","coordenada"],c:0,e:"Completa o verbo (como CD) → substantiva completiva."},
      {q:"«agora», «aqui», «eu» são...",o:["conectores","deíticos (dêixis)","aspetos","modais"],c:1,e:"Dependem do contexto → deíticos."}
     ]},

    /* ===== EDUCAÇÃO LITERÁRIA ===== */
    {id:'ortonimo12', area:'literaria', titulo:'Fernando Pessoa ortónimo', icone:'🪞', resumo:'O «eu» múltiplo e a dor de pensar',
     html:`<p class="lead">Sob o seu próprio nome (<b>ortónimo</b>), Pessoa escreve uma poesia <b>intelectual e melancólica</b>, marcada pela <b>fragmentação do eu</b> e pelo conflito entre <b>razão e sentimento</b>.</p>
      <h4 class="sub">Temas centrais</h4>
      <table class="tab"><tr><th>Tema</th><th>Ideia</th></tr>
      <tr><td><b>Fingimento poético</b></td><td>«O poeta é um fingidor» — finge tão completamente que chega a fingir a dor que sente.</td></tr>
      <tr><td><b>Dor de pensar</b></td><td>a razão analisa tudo e impede o sentir espontâneo.</td></tr>
      <tr><td><b>Fragmentação/despersonalização</b></td><td>o «eu» divide-se, não se reconhece, sente-se múltiplo.</td></tr>
      <tr><td><b>Nostalgia da infância</b></td><td>perda da inocência e da felicidade simples.</td></tr>
      <tr><td><b>Sonho e tédio</b></td><td>refúgio no sonho; o «tédio» (spleen) da existência.</td></tr></table>
      <div class="caixa exemplo"><b class="rotulo">«Autopsicografia»</b> «O poeta é um fingidor. / Finge tão completamente / Que chega a fingir que é dor / A dor que deveras sente.» — o fingimento como essência da arte.</div>`,
     quiz:[
      {q:"«O poeta é um fingidor» exprime a ideia de...",o:["mentira na vida","fingimento poético (arte = transformar o sentir em arte)","ódio à poesia","amor romântico"],c:1,e:"O fingimento é a arte de transformar a emoção em poesia."},
      {q:"A «dor de pensar» traduz o conflito entre...",o:["passado e futuro","razão e sentimento","cidade e campo","Deus e o Diabo"],c:1,e:"A razão (pensar demais) sufoca o sentir espontâneo."},
      {q:"A «despersonalização» refere-se à...",o:["unidade do eu","fragmentação/multiplicação do eu","alegria","epopeia"],c:1,e:"O «eu» divide-se e sente-se múltiplo."},
      {q:"Um tema recorrente do ortónimo é a nostalgia...",o:["da guerra","da infância perdida","do mar","da cidade"],c:1,e:"Saudade da infância e da inocência perdidas."}
     ]},
    {id:'heteronimos12', area:'literaria', titulo:'Os heterónimos', icone:'🎭', resumo:'Caeiro, Reis, Campos',
     html:`<p class="lead">Pessoa criou <b>heterónimos</b>: poetas fictícios com biografia, estilo e filosofia próprios. Os três principais:</p>
      <table class="tab"><tr><th>Heterónimo</th><th>«Filosofia»</th><th>Marcas</th></tr>
      <tr><td><b>Alberto Caeiro</b><br>«o mestre»</td><td>ver sem pensar; a natureza tal como é; objetividade</td><td>verso livre, linguagem simples, anti-metafísico («Pensar é estar doente dos olhos»)</td></tr>
      <tr><td><b>Ricardo Reis</b></td><td>epicurismo/estoicismo; aceitar o destino; viver sereno o momento</td><td>odes clássicas, paganismo, «carpe diem», forma contida</td></tr>
      <tr><td><b>Álvaro de Campos</b></td><td>do entusiasmo futurista («Ode Triunfal») ao tédio e abatimento («Tabacaria»)</td><td>verso livre, longo, exaltação e depois náusea existencial</td></tr></table>
      <div class="caixa exemplo"><b class="rotulo">«Tabacaria» (Campos)</b> «Não sou nada. / Nunca serei nada. / Não posso querer ser nada. / À parte isso, tenho em mim todos os sonhos do mundo.» — o fracasso entre o sonho e a realidade.</div>
      <div class="caixa dica"><b class="rotulo">Como distinguir</b> Caeiro = simplicidade e natureza. Reis = serenidade clássica e destino. Campos = excesso, modernidade e angústia.</div>`,
     quiz:[
      {q:"O heterónimo considerado «o mestre», que defende ver sem pensar, é...",o:["Ricardo Reis","Álvaro de Campos","Alberto Caeiro","Bernardo Soares"],c:2,e:"Alberto Caeiro, o poeta da natureza e da objetividade."},
      {q:"As odes clássicas, o «carpe diem» e a serenidade pertencem a...",o:["Caeiro","Ricardo Reis","Álvaro de Campos","ortónimo"],c:1,e:"Ricardo Reis: epicurismo/estoicismo e forma clássica."},
      {q:"«Tabacaria» e a «Ode Triunfal» são de...",o:["Caeiro","Reis","Álvaro de Campos","Antero"],c:2,e:"Álvaro de Campos, do entusiasmo futurista ao tédio existencial."},
      {q:"«Não sou nada. Nunca serei nada.» (Tabacaria) exprime...",o:["euforia","frustração entre o sonho e a realidade","amor","fé religiosa"],c:1,e:"O abismo entre os sonhos imensos e o nada da realidade."},
      {q:"O verso livre, simples e anti-metafísico é típico de...",o:["Ricardo Reis","Alberto Caeiro","Cesário","Vieira"],c:1,e:"Caeiro: linguagem simples, recusa da metafísica."}
     ]},
    {id:'mensagem12', area:'literaria', titulo:'Mensagem', icone:'⭐', resumo:'O épico-lírico de Pessoa',
     html:`<p class="lead">A <b>«Mensagem»</b> (1934) é o único livro que Pessoa publicou em vida. É um poema <b>épico-lírico</b> e <b>simbólico</b> sobre a história e o destino de Portugal, com tom <b>profético</b> (sebanstianismo, Quinto Império).</p>
      <h4 class="sub">As três partes</h4>
      <table class="tab"><tr><th>Parte</th><th>Símbolo</th><th>Conteúdo</th></tr>
      <tr><td><b>Brasão</b></td><td>os campos do escudo</td><td>figuras fundadoras (D. Afonso Henriques, D. Dinis…) — o passado glorioso</td></tr>
      <tr><td><b>Mar Português</b></td><td>o mar</td><td>os Descobrimentos: o esforço, a dor e a glória («Ó mar salgado…»)</td></tr>
      <tr><td><b>O Encoberto</b></td><td>o nevoeiro</td><td>o futuro: o regresso do mito (D. Sebastião) e o Quinto Império</td></tr></table>
      <div class="caixa exemplo"><b class="rotulo">«Mar Português»</b> «Tudo vale a pena / Se a alma não é pequena.» — só a grandeza de alma justifica o sacrifício.</div>
      <div class="caixa nota"><b class="rotulo">Sentido</b> Pessoa reescreve a epopeia camoniana num registo simbólico: não celebra apenas o passado, anuncia um <b>renascimento espiritual</b> de Portugal.</div>`,
     quiz:[
      {q:"«Mensagem» é um poema...",o:["puramente lírico-amoroso","épico-lírico e simbólico sobre Portugal","dramático","satírico"],c:1,e:"Épico-lírico e simbólico: a história e o destino da nação."},
      {q:"As três partes da «Mensagem» são...",o:["Proposição, Invocação, Narração","Brasão, Mar Português, O Encoberto","Inferno, Purgatório, Paraíso","Caeiro, Reis, Campos"],c:1,e:"Brasão (passado), Mar Português (Descobrimentos), O Encoberto (futuro)."},
      {q:"«Tudo vale a pena / Se a alma não é pequena» sugere que...",o:["nada vale a pena","só a grandeza de alma justifica o sacrifício","o mar é perigoso","Portugal acabou"],c:1,e:"A grandeza interior dá sentido ao sacrifício."},
      {q:"O tom profético da 3.ª parte («O Encoberto») liga-se ao...",o:["realismo","sebastianismo/Quinto Império","barroco","futurismo"],c:1,e:"Anuncia o regresso do mito e um futuro espiritual (Quinto Império)."},
      {q:"«Mensagem» dialoga com qual epopeia clássica?",o:["Auto da Barca do Inferno","Os Lusíadas","Frei Luís de Sousa","Os Maias"],c:1,e:"Reescreve simbolicamente a matéria d'Os Lusíadas."}
     ]},
    {id:'saramago12', area:'literaria', titulo:'Saramago — Memorial do Convento', icone:'📜', resumo:'Romance contemporâneo',
     html:`<p class="lead">O <b>«Memorial do Convento»</b> (1982), de <b>José Saramago</b> (Nobel da Literatura), cruza a <b>História</b> (a construção do Convento de Mafra, no reinado de D. João V) com a <b>ficção</b> (o amor de Baltasar e Blimunda e a «passarola» do Padre Bartolomeu de Gusmão).</p>
      <h4 class="sub">Os dois planos</h4>
      <table class="tab"><tr><th>Plano histórico</th><th>Plano ficcional</th></tr>
      <tr><td>D. João V, a corte, a Inquisição, a obra de Mafra paga com sofrimento do povo</td><td>Baltasar (Sete-Sóis), Blimunda (Sete-Luas) e o sonho de voar (a passarola)</td></tr></table>
      <h4 class="sub">Temas e crítica</h4>
      <ul><li>Crítica ao <b>poder absoluto</b> e à <b>Inquisição</b> (intolerância religiosa).</li>
      <li>Valorização do <b>povo</b> e do trabalho anónimo que ergueu o convento.</li>
      <li>O <b>amor</b> (Baltasar e Blimunda) e a <b>vontade</b> humana de transcender (voar).</li>
      <li>Estilo único: <b>narrador interventivo/irónico</b>, frases longas, pontuação própria (diálogos sem travessão, integrados no texto).</li></ul>
      <div class="caixa nota"><b class="rotulo">Blimunda</b> Vê as vontades das pessoas (em jejum) e recolhe-as para a passarola voar — símbolo da força do sonho e do desejo humano.</div>`,
     quiz:[
      {q:"O autor de «Memorial do Convento» é...",o:["Fernando Pessoa","José Saramago","Eça de Queirós","Camilo"],c:1,e:"José Saramago, Prémio Nobel da Literatura."},
      {q:"O plano histórico passa-se no reinado de...",o:["D. Sebastião","D. João V (construção de Mafra)","D. Dinis","D. Afonso Henriques"],c:1,e:"D. João V e a construção do Convento de Mafra."},
      {q:"O par amoroso ficcional é...",o:["Pedro e Inês","Baltasar e Blimunda","Carlos e Maria Eduarda","Romeu e Julieta"],c:1,e:"Baltasar (Sete-Sóis) e Blimunda (Sete-Luas)."},
      {q:"A «passarola» representa o sonho de...",o:["construir um convento","voar / transcender a condição humana","fazer guerra","enriquecer"],c:1,e:"A máquina de voar do Padre Bartolomeu de Gusmão: o desejo de transcendência."},
      {q:"O romance critica, sobretudo...",o:["a navegação","o poder absoluto e a Inquisição, valorizando o povo","a poesia trovadoresca","a ciência moderna"],c:1,e:"Crítica ao absolutismo e à Inquisição; exaltação do povo trabalhador."},
      {q:"O estilo de Saramago caracteriza-se por...",o:["sonetos clássicos","frases longas, narrador interventivo e pontuação própria","didascálias","linguagem medieval"],c:1,e:"Frases longas, narrador irónico/interventivo, diálogos integrados sem travessão."}
     ]},

    /* ===== LEITURA ===== */
    {id:'leit12a', area:'leitura', titulo:'Ler: «Tabacaria» (excerto)', icone:'🔍', resumo:'Álvaro de Campos',
     lead:'Lê o excerto e responde, identificando temas e marcas do heterónimo.',
     texto:{titulo:'Tabacaria (excerto)', autor:'Álvaro de Campos (Fernando Pessoa)',
      corpo:`<div class="verso">Não sou nada.
Nunca serei nada.
Não posso querer ser nada.
À parte isso, tenho em mim todos os sonhos do mundo.

Janelas do meu quarto,
Do meu quarto de um dos milhões do mundo que ninguém sabe quem é
(E se soubessem quem é, o que saberiam?),
Dais para o mistério de uma rua cruzada constantemente por gente,
Para uma rua inacessível a todos os pensamentos...</div>`},
     quiz:[
      {q:"Este texto é da autoria do heterónimo...",o:["Alberto Caeiro","Ricardo Reis","Álvaro de Campos","ortónimo"],c:2,e:"«Tabacaria» é de Álvaro de Campos."},
      {q:"«Não sou nada. / Nunca serei nada.» exprime...",o:["euforia","frustração/náusea existencial","fé","amor"],c:1,e:"O sentimento de fracasso e vazio existencial."},
      {q:"O contraste «não sou nada» / «tenho em mim todos os sonhos do mundo» revela...",o:["o abismo entre o sonho e a realidade","alegria","indiferença","humor"],c:0,e:"A tensão entre a grandeza do sonho e o nada da realidade."},
      {q:"O verso livre, longo e o tom de desabafo são marcas de...",o:["Ricardo Reis","Álvaro de Campos","Cesário Verde","Camões"],c:1,e:"Verso livre e tom intenso/confessional → Campos."},
      {q:"«um dos milhões do mundo que ninguém sabe quem é» reforça o tema da...",o:["fama","insignificância/anonimato do indivíduo moderno","riqueza","natureza"],c:1,e:"A solidão e insignificância do homem na cidade moderna."}
     ]},

    /* ===== ESCRITA ===== */
    {id:'escr12', area:'escrita', titulo:'Exposição sobre tema (exame)', icone:'✍️', resumo:'Texto de opinião/exposição nacional',
     lead:'Prepara o texto de produção do exame nacional (≈200-350 palavras).',
     enunciado:`Escreve um <b>texto de opinião</b> bem estruturado (200 a 350 palavras) sobre: <b>«Continua a fazer sentido ler os clássicos da literatura no século XXI?»</b>. Define uma posição, fundamenta com argumentos e exemplos (podes recorrer às obras estudadas) e conclui.`,
     criterios:['Introdução com tese clara.','Pelo menos três argumentos desenvolvidos com exemplos (literários ou da atualidade).','Eventual contra-argumento refutado.','Conectores e progressão lógica.','Vocabulário rico e registo cuidado.','Conclusão coerente; ortografia e ~200-350 palavras.'],
     modelo:`<b>Introdução:</b> tema + tese. <b>Desenvolvimento:</b> argumentos (afirmação + explicação + exemplo) e refutação. <b>Conclusão:</b> síntese e fecho.`}
,
    /* ===== TREINO EXTRA ===== */
    {id:'extragram12', area:'gramatica', titulo:'Exercícios extra — Gramática', icone:'🎯', resumo:'Coesão, dêixis, aspeto, orações',
     html:`<p class="lead">Mais exercícios para consolidar a gramática do 12.º ano (preparação para exame).</p>`,
     quiz:[
      {q:"«O poeta... ele... a sua obra» — a retoma por pronomes é coesão...",o:["lexical","referencial (gramatical)","temporal","frásica"],c:1,e:"Pronomes/possessivos a retomar → coesão referencial."},
      {q:"«contudo», «por conseguinte», «além disso» são...",o:["deíticos","conectores (coesão interfrásica)","aspetos","modais"],c:1,e:"Ligam frases/parágrafos → conectores."},
      {q:"«Talvez ele tenha partido.» exprime modalidade...",o:["deôntica","epistémica","apreciativa","aspetual"],c:1,e:"Probabilidade/incerteza → epistémica."},
      {q:"«É proibido fumar aqui.» exprime modalidade...",o:["epistémica","deôntica","apreciativa","nenhuma"],c:1,e:"Proibição/permissão → deôntica."},
      {q:"«Quando entrei, ela já tinha saído.» — «tinha saído» exprime aspeto...",o:["imperfetivo","perfetivo (anterior concluído)","habitual","iterativo"],c:1,e:"Ação concluída antes de outra → perfetivo."},
      {q:"«Espero que compreendas.» — «que compreendas» é oração...",o:["subordinada substantiva completiva","adjetiva relativa","adverbial causal","coordenada"],c:0,e:"Completa o verbo → substantiva completiva."},
      {q:"«amanhã», «agora», «hoje» são dêixis...",o:["espacial","temporal","pessoal","social"],c:1,e:"Localizam no tempo → dêixis temporal."},
      {q:"«O livro de que falámos esgotou.» — «de que falámos» é oração...",o:["adjetiva relativa","substantiva completiva","adverbial","coordenada"],c:0,e:"Refere-se ao nome «livro» → adjetiva relativa."},
      {q:"Coerência textual significa...",o:["frases bem ligadas só","sentido global sem contradições e com progressão","uso de rima","pontuação correta apenas"],c:1,e:"Coerência = sentido global, lógico e sem contradições."},
      {q:"«Felizmente, o exame correu bem.» exprime modalidade...",o:["epistémica","deôntica","apreciativa","aspetual"],c:2,e:"Avaliação/juízo do falante → apreciativa."},
      {q:"«eu / tu / nós» são dêixis...",o:["pessoal","espacial","temporal","textual"],c:0,e:"Referem os intervenientes → dêixis pessoal."},
      {q:"«Estudou tanto que ficou exausto.» — subordinada...",o:["comparativa","consecutiva","final","causal"],c:1,e:"«tanto... que» → consecutiva."},
      {q:"«Embora estivesse cansado, terminou o trabalho.» — subordinada...",o:["causal","concessiva","condicional","temporal"],c:1,e:"«embora» → concessiva."},
      {q:"Retomar «Fernando Pessoa» por «o poeta português» é coesão...",o:["lexical","referencial","temporal","frásica"],c:0,e:"Recurso a expressão sinónima/descritiva → coesão lexical."},
      {q:"«Caso chova, fica em casa.» — subordinada...",o:["temporal","condicional","causal","final"],c:1,e:"«caso» = condição → condicional."}
     ]},
    {id:'extralit12', area:'literaria', titulo:'Exercícios extra — Pessoa e Saramago', icone:'🎯', resumo:'Ortónimo, heterónimos, Mensagem, Memorial',
     html:`<p class="lead">Mais exercícios sobre a literatura do 12.º ano.</p>`,
     quiz:[
      {q:"«O poeta é um fingidor» exprime a ideia de...",o:["mentira na vida","fingimento poético (transformar o sentir em arte)","ódio à poesia","amor romântico"],c:1,e:"O fingimento é a essência da criação poética."},
      {q:"A «dor de pensar» traduz o conflito entre...",o:["passado e futuro","razão e sentimento","cidade e campo","Deus e o Diabo"],c:1,e:"A razão sufoca o sentir espontâneo."},
      {q:"O heterónimo «mestre», que defende ver sem pensar, é...",o:["Ricardo Reis","Álvaro de Campos","Alberto Caeiro","Bernardo Soares"],c:2,e:"Alberto Caeiro."},
      {q:"As odes clássicas, o «carpe diem» e a serenidade são de...",o:["Caeiro","Ricardo Reis","Álvaro de Campos","ortónimo"],c:1,e:"Ricardo Reis (epicurismo/estoicismo)."},
      {q:"«Tabacaria» e a «Ode Triunfal» são de...",o:["Caeiro","Reis","Álvaro de Campos","Antero"],c:2,e:"Álvaro de Campos."},
      {q:"O verso livre, simples e anti-metafísico é típico de...",o:["Ricardo Reis","Alberto Caeiro","Cesário","Vieira"],c:1,e:"Caeiro: linguagem simples, recusa da metafísica."},
      {q:"«Mensagem» é um poema...",o:["lírico-amoroso","épico-lírico e simbólico sobre Portugal","dramático","satírico"],c:1,e:"Épico-lírico e simbólico."},
      {q:"As três partes da «Mensagem» são...",o:["Proposição, Invocação, Narração","Brasão, Mar Português, O Encoberto","Inferno, Purgatório, Paraíso","Caeiro, Reis, Campos"],c:1,e:"Brasão, Mar Português, O Encoberto."},
      {q:"O tom profético de «O Encoberto» liga-se ao...",o:["realismo","sebastianismo / Quinto Império","barroco","futurismo"],c:1,e:"Anuncia o regresso do mito e um futuro espiritual."},
      {q:"O autor de «Memorial do Convento» é...",o:["Fernando Pessoa","José Saramago","Eça","Camilo"],c:1,e:"José Saramago (Nobel)."},
      {q:"O plano histórico de «Memorial do Convento» passa-se no reinado de...",o:["D. Sebastião","D. João V (Mafra)","D. Dinis","D. Afonso Henriques"],c:1,e:"D. João V e a construção de Mafra."},
      {q:"O par amoroso ficcional do romance é...",o:["Pedro e Inês","Baltasar e Blimunda","Carlos e Maria Eduarda","Romeu e Julieta"],c:1,e:"Baltasar (Sete-Sóis) e Blimunda (Sete-Luas)."},
      {q:"A «passarola» representa o sonho de...",o:["construir um convento","voar / transcender a condição humana","fazer guerra","enriquecer"],c:1,e:"O desejo de voar e de transcendência."},
      {q:"O estilo de Saramago caracteriza-se por...",o:["sonetos clássicos","frases longas, narrador interventivo e pontuação própria","didascálias","linguagem medieval"],c:1,e:"Frases longas, narrador irónico, diálogos sem travessão."},
      {q:"A «despersonalização» em Pessoa refere-se à...",o:["unidade do eu","fragmentação/multiplicação do eu","alegria","epopeia"],c:1,e:"O «eu» divide-se e multiplica-se (heterónimos incluídos)."}
     ]}
  ],
  obras:[
    {t:'Poesia do ortónimo', a:'Fernando Pessoa', g:'poesia'},
    {t:'Poemas de Alberto Caeiro', a:'Fernando Pessoa (heterónimo)', g:'poesia'},
    {t:'Odes de Ricardo Reis', a:'Fernando Pessoa (heterónimo)', g:'poesia'},
    {t:'Poemas de Álvaro de Campos (Tabacaria, Ode Triunfal)', a:'Fernando Pessoa (heterónimo)', g:'poesia'},
    {t:'Mensagem', a:'Fernando Pessoa', g:'poesia épico-lírica'},
    {t:'Memorial do Convento (ou conto de Mário de Carvalho)', a:'José Saramago', g:'romance'},
    {t:'Poesia do século XX (escolha)', a:'Miguel Torga, Eugénio de Andrade, Sophia, O\'Neill…', g:'poesia'}
  ],
  glossario:[
    {t:'Ortónimo', d:'Pessoa a escrever sob o seu próprio nome.'},
    {t:'Heterónimo', d:'Poeta fictício criado por Pessoa, com biografia e estilo próprios (Caeiro, Reis, Campos).'},
    {t:'Fingimento poético', d:'A arte de transformar a emoção em poesia («O poeta é um fingidor»).'},
    {t:'Despersonalização', d:'Fragmentação e multiplicação do «eu».'},
    {t:'Mensagem', d:'Poema épico-lírico de Pessoa sobre o passado e o destino de Portugal.'},
    {t:'Sebastianismo / Quinto Império', d:'Mito do regresso de D. Sebastião e de um futuro espiritual de Portugal.'},
    {t:'Narrador interventivo', d:'Narrador que comenta e opina na narração (Saramago).'}
  ]
};
