CURRICULO['7'] = {
  subtitulo:'3.º Ciclo', ciclo:'3.º Ciclo', icone:'📘',
  intro:'No 7.º ano entras no 3.º ciclo: a gramática ganha as funções sintáticas completas e a frase complexa por coordenação. Na literatura, estudas o texto dramático (Leandro, Rei da Helíria), contos e poesia.',
  modulos:[
    /* ===== GRAMÁTICA ===== */
    {id:'classes7', area:'gramatica', titulo:'Classes de palavras', icone:'🔤', resumo:'Todas as classes, incl. conjunção',
     html:`<p class="lead">Revisão completa das classes, incluindo conjunção e interjeição.</p>
      <table class="tab"><tr><th>Variáveis</th><th>Invariáveis</th></tr>
      <tr><td>nome, adjetivo, verbo, determinante, quantificador, pronome</td><td>advérbio, preposição, conjunção, interjeição</td></tr></table>
      <h4 class="sub">Conjunção</h4>
      <ul><li><b>Coordenativas</b>: ligam elementos do mesmo nível (e, mas, ou, logo, pois).</li>
      <li><b>Subordinativas</b>: ligam uma oração dependente (porque, quando, se, embora, que).</li></ul>
      <h4 class="sub">Subclasses úteis</h4>
      <p>Determinantes: artigo (o/um), possessivo (meu), demonstrativo (este), indefinido (algum). Pronomes: pessoal, possessivo, demonstrativo, relativo (que), indefinido (ninguém).</p>
      <div class="caixa dica"><b class="rotulo">A mesma palavra, classes diferentes</b> «Ele anda <u>bem</u>» (advérbio) / «O <u>bem</u> e o mal» (nome).</div>`,
     quiz:[
      {q:"«porque» é uma conjunção...",o:["coordenativa copulativa","subordinativa causal","coordenativa adversativa","preposição"],c:1,e:"Liga oração de causa → conjunção subordinativa causal."},
      {q:"«mas» é uma conjunção...",o:["coordenativa adversativa","subordinativa","copulativa","disjuntiva"],c:0,e:"Exprime oposição entre elementos do mesmo nível → coordenativa adversativa."},
      {q:"Em «Que belo dia!», «Que» exprime emoção e a frase tem uma...",o:["preposição","interjeição/exclamação","conjunção causal","pronome relativo"],c:1,e:"Frase exclamativa; «Que» reforça a exclamação (valor expressivo)."},
      {q:"«este», em «este livro», é...",o:["determinante demonstrativo","pronome","advérbio","conjunção"],c:0,e:"Vem antes do nome a especificá-lo → determinante demonstrativo."}
     ]},
    {id:'funcoes7', area:'gramatica', titulo:'Funções sintáticas', icone:'🧩', resumo:'+ oblíquo e modificador',
     html:`<table class="tab"><tr><th>Função</th><th>Teste</th><th>Exemplo</th></tr>
      <tr><td><b>Sujeito</b></td><td>Quem? (concorda c/ verbo)</td><td><b>O atleta</b> venceu.</td></tr>
      <tr><td><b>Complemento direto</b></td><td>o/a/os/as</td><td>Comeu <b>a maçã</b>.</td></tr>
      <tr><td><b>Complemento indireto</b></td><td>lhe/lhes</td><td>Deu o livro <b>à Ana</b>.</td></tr>
      <tr><td><b>Complemento oblíquo</b></td><td>obrigatório (lugar, meio)</td><td>Vive <b>em Braga</b>. Gosto <b>de música</b>.</td></tr>
      <tr><td><b>Predicativo do sujeito</b></td><td>ser/estar/parecer</td><td>Ele é <b>professor</b>.</td></tr>
      <tr><td><b>Modificador</b></td><td>pode retirar-se</td><td>Chegou <b>tarde</b>.</td></tr>
      <tr><td><b>Vocativo</b></td><td>chama (vírgulas)</td><td><b>João</b>, espera!</td></tr></table>
      <div class="caixa atencao"><b class="rotulo">Indireto vs oblíquo</b> CI substitui-se por <b>lhe</b> («dei-lhe»). O oblíquo NÃO («gosto dela», não «gosto-lhe»).</div>`,
     quiz:[
      {q:"Em «Moro <b>em Lisboa</b>.», «em Lisboa» é...",o:["complemento direto","complemento indireto","complemento oblíquo","modificador"],c:2,e:"Completa obrigatoriamente o verbo «morar» (lugar) → complemento oblíquo."},
      {q:"Em «Saímos <b>cedo</b>.», «cedo» é...",o:["complemento oblíquo","modificador","predicativo","sujeito"],c:1,e:"Pode retirar-se sem tornar a frase incorreta → modificador."},
      {q:"Em «Entreguei o teste <b>ao professor</b>.», é...",o:["complemento direto","complemento indireto","modificador","vocativo"],c:1,e:"Substitui-se por «lhe» → complemento indireto."},
      {q:"Em «A água <b>parece</b> fria.», «fria» é...",o:["complemento direto","predicativo do sujeito","modificador","oblíquo"],c:1,e:"Com «parecer» (copulativo) atribui qualidade ao sujeito → predicativo do sujeito."}
     ]},
    {id:'coord7', area:'gramatica', titulo:'Coordenação', icone:'🔗', resumo:'Orações no mesmo nível',
     html:`<p class="lead">As <b>orações coordenadas</b> são independentes e ligam-se por conjunções coordenativas.</p>
      <table class="tab"><tr><th>Tipo</th><th>Conjunções</th><th>Exemplo</th></tr>
      <tr><td><b>Copulativa</b></td><td>e, nem</td><td>Estudei <b>e</b> descansei.</td></tr>
      <tr><td><b>Adversativa</b></td><td>mas, porém, contudo</td><td>Estudei, <b>mas</b> falhei.</td></tr>
      <tr><td><b>Disjuntiva</b></td><td>ou, ou… ou</td><td><b>Ou</b> ficas <b>ou</b> sais.</td></tr>
      <tr><td><b>Conclusiva</b></td><td>logo, portanto, pois</td><td>Penso, <b>logo</b> existo.</td></tr>
      <tr><td><b>Explicativa</b></td><td>pois, porque (justifica)</td><td>Apressa-te, <b>pois</b> é tarde.</td></tr></table>
      <div class="caixa dica"><b class="rotulo">Identificar</b> Conta os verbos principais. Se houver dois ligados por «e/mas/ou…» → orações coordenadas.</div>`,
     quiz:[
      {q:"«Não comi nem bebi.» — coordenação...",o:["copulativa","adversativa","disjuntiva","conclusiva"],c:0,e:"«nem» adiciona (negativamente) → coordenação copulativa."},
      {q:"«Corri muito, mas perdi.» — coordenação...",o:["copulativa","adversativa","conclusiva","explicativa"],c:1,e:"«mas» exprime oposição → adversativa."},
      {q:"«Estuda, portanto terás sucesso.» — coordenação...",o:["disjuntiva","conclusiva","copulativa","adversativa"],c:1,e:"«portanto» introduz conclusão → conclusiva."},
      {q:"«Ou estudas ou reprovas.» — coordenação...",o:["copulativa","disjuntiva","explicativa","adversativa"],c:1,e:"«ou… ou» apresenta alternativa → disjuntiva."}
     ]},
    {id:'sentido7', area:'gramatica', titulo:'Significado e formação', icone:'🌱', resumo:'Campos, relações, formação',
     html:`<table class="tab"><tr><th>Conceito</th><th>O que é</th><th>Exemplo</th></tr>
      <tr><td><b>Sinonímia / Antonímia</b></td><td>sentido igual / oposto</td><td>belo=bonito / alto≠baixo</td></tr>
      <tr><td><b>Hiperónimo / Hipónimo</b></td><td>geral / específico</td><td>fruto → maçã</td></tr>
      <tr><td><b>Campo lexical</b></td><td>palavras de um tema</td><td>escola: aula, recreio, professor</td></tr>
      <tr><td><b>Polissemia</b></td><td>vários sentidos relacionados</td><td>folha (de árvore/papel)</td></tr></table>
      <h4 class="sub">Formação de palavras</h4>
      <p>Derivação (prefixo/sufixo) e composição (morfológica e morfossintática).</p>
      <div class="caixa dica"><b class="rotulo">Campo lexical ≠ família</b> Campo lexical = tema (palavras de classes diferentes). Família = mesmo radical.</div>`,
     quiz:[
      {q:"«veículo» é hiperónimo de...",o:["roda","carro","estrada","motor"],c:1,e:"«carro» é um tipo de veículo (hipónimo)."},
      {q:"«mar, onda, maré, marítimo» formam uma...",o:["campo lexical do mar","família de palavras","par de antónimos","polissemia"],c:0,e:"Palavras ligadas ao tema mar → campo lexical (algumas até da mesma família)."},
      {q:"«banco» (sentar) e «banco» (dinheiro) é...",o:["sinonímia","homonímia/polissemia","antonímia","hiperonímia"],c:1,e:"Mesma forma, sentidos diferentes."},
      {q:"«infelizmente» tem...",o:["só prefixo","só sufixo","prefixo e sufixo","nenhum"],c:2,e:"in- (prefixo) + feliz + -mente (sufixo)."}
     ]},

    /* ===== EDUCAÇÃO LITERÁRIA ===== */
    {id:'narr7', area:'literaria', titulo:'O texto narrativo', icone:'📖', resumo:'Narrador, ação, tempo',
     html:`<p class="lead">Categorias da narrativa, com mais rigor.</p>
      <h4 class="sub">Narrador</h4>
      <ul><li><b>Heterodiegético</b>: fora da história (3.ª pessoa).</li>
      <li><b>Homodiegético</b>: participa (1.ª pessoa).</li>
      <li><b>Autodiegético</b>: é o protagonista e narra a própria história.</li></ul>
      <h4 class="sub">Ação e tempo</h4>
      <ul><li>Ação <b>principal</b> e <b>secundária</b>.</li>
      <li><b>Analepse</b> (recuo) e <b>prolepse</b> (antecipação).</li></ul>
      <h4 class="sub">Espaço</h4>
      <p>Físico (lugar), social (meio), psicológico (interior das personagens).</p>`,
     quiz:[
      {q:"Um narrador protagonista que conta a própria vida é...",o:["heterodiegético","homodiegético","autodiegético","externo"],c:2,e:"É o protagonista e narra-se a si próprio → autodiegético."},
      {q:"Recuar no tempo para contar o passado é...",o:["prolepse","analepse","elipse","sumário"],c:1,e:"Recuo = analepse."},
      {q:"O ambiente social das personagens é o espaço...",o:["físico","social","psicológico","histórico"],c:1,e:"Meio/relações sociais → espaço social."},
      {q:"Narrador na 3.ª pessoa, fora da ação, é...",o:["homodiegético","autodiegético","heterodiegético","participante"],c:2,e:"Fora da história, 3.ª pessoa → heterodiegético."}
     ]},
    {id:'drama7', area:'literaria', titulo:'Texto dramático: Leandro, Rei da Helíria', icone:'🎭', resumo:'Alice Vieira',
     html:`<p class="lead"><b>«Leandro, Rei da Helíria»</b>, de <b>Alice Vieira</b>, é um texto dramático inspirado num conto popular (lembra o «Rei Lear»).</p>
      <h4 class="sub">A história</h4>
      <p>O rei Leandro decide dividir o reino pelas três filhas, perguntando-lhes quanto o amam. Violante e Berengária respondem com elogios exagerados; <b>Tagiana</b>, a mais nova, diz amá-lo «como a comida ama o sal». O rei, ofendido, expulsa-a. Mais tarde percebe a verdade: sem sal, nada tem sabor — como a vida sem o amor sincero da filha.</p>
      <h4 class="sub">Estrutura e marcas</h4>
      <ul><li><b>Falas</b> das personagens (texto principal) e <b>didascálias</b> (texto secundário).</li>
      <li>Divisão em <b>atos</b> e <b>cenas</b>.</li>
      <li>Tema: o <b>amor verdadeiro vs a bajulação</b>; a aparência vs a verdade.</li></ul>
      <div class="caixa exemplo"><b class="rotulo">A frase-chave</b> «Amo-vos como a comida ama o sal» — só no fim o rei compreende que era a prova de amor mais sincera.</div>`,
     quiz:[
      {q:"Quem escreveu «Leandro, Rei da Helíria»?",o:["Sophia de M. B. Andresen","Alice Vieira","Manuel António Pina","Gil Vicente"],c:1,e:"É de Alice Vieira."},
      {q:"O rei Leandro quer saber, das filhas...",o:["quem é mais bela","quanto o amam","quem governa melhor","quem é mais rica"],c:1,e:"Pergunta-lhes quanto o amam para dividir o reino."},
      {q:"Tagiana diz amar o pai «como...»",o:["o ouro","a comida ama o sal","o sol ama a lua","um rei ama o reino"],c:1,e:"«como a comida ama o sal» — amor sincero e essencial."},
      {q:"As indicações cénicas do texto chamam-se...",o:["falas","didascálias","morais","estrofes"],c:1,e:"Didascálias (texto secundário)."},
      {q:"Um tema central da obra é...",o:["a guerra","o amor verdadeiro vs a bajulação","a viagem ao mar","a pobreza"],c:1,e:"Opõe o amor sincero (Tagiana) aos elogios falsos das outras filhas."}
     ]},
    {id:'poesia7', area:'literaria', titulo:'O texto poético', icone:'🪶', resumo:'Estrofe, rima, recursos',
     html:`<h4 class="sub">Estrofe e rima</h4>
      <p>Estrofes: dístico (2), terceto (3), quadra (4), quintilha (5). Rima emparelhada (aabb), cruzada (abab), interpolada (abba). Versos sem rima = brancos.</p>
      <h4 class="sub">Recursos expressivos frequentes</h4>
      <p><span class="tag">comparação</span><span class="tag">metáfora</span><span class="tag">personificação</span><span class="tag">enumeração</span><span class="tag">anáfora</span><span class="tag">aliteração</span><span class="tag">hipérbole</span></p>
      <div class="caixa dica"><b class="rotulo">Sujeito poético</b> A voz que fala no poema (≠ poeta).</div>`,
     quiz:[
      {q:"Esquema de rima abab é rima...",o:["emparelhada","cruzada","interpolada","branca"],c:1,e:"abab → cruzada."},
      {q:"Versos sem rima dizem-se...",o:["brancos","toantes","agudos","graves"],c:0,e:"Sem rima → versos brancos/soltos."},
      {q:"«chorei rios de lágrimas» é...",o:["comparação","hipérbole","metáfora","anáfora"],c:1,e:"Exagero → hipérbole."},
      {q:"A voz que fala no poema é o...",o:["narrador","poeta","sujeito poético","autor real"],c:2,e:"O sujeito poético (eu lírico)."}
     ]},

    /* ===== LEITURA ===== */
    {id:'leit7a', area:'leitura', titulo:'Ler: poema', icone:'🔍', resumo:'Interpreta um poema',
     lead:'Lê o poema e responde, atendendo ao sentido e aos recursos.',
     texto:{titulo:'Pedra filosofal (excerto)', autor:'António Gedeão',
      corpo:`<div class="verso">Eles não sabem que o sonho
é uma constante da vida
tão concreta e definida
como outra coisa qualquer,
como esta pedra cinzenta
em que me sento e descanso,
como este ribeiro manso
em serenos sobressaltos,
como estes pinheiros altos
que em verde e oiro se agitam,
como estas aves que gritam
em bebedeiras de azul.</div>`},
     quiz:[
      {q:"O tema central do poema é o valor...",o:["do dinheiro","do sonho","da guerra","do silêncio"],c:1,e:"Defende que o sonho é «uma constante da vida», tão real como tudo o resto."},
      {q:"«como esta pedra cinzenta» é uma...",o:["metáfora","comparação","personificação","hipérbole"],c:1,e:"Usa «como» para aproximar o sonho de algo concreto → comparação."},
      {q:"A repetição de «como» ao longo dos versos é uma...",o:["anáfora","aliteração","onomatopeia","antítese"],c:0,e:"Repetição no início dos versos → anáfora (aqui em estrutura comparativa)."},
      {q:"«aves que gritam em bebedeiras de azul» atribui às aves...",o:["medo","uma embriaguez/alegria humana (personificação/metáfora)","silêncio","tristeza"],c:1,e:"Linguagem figurada que humaniza e exalta o voo das aves."}
     ]},

    /* ===== ESCRITA ===== */
    {id:'escr7', area:'escrita', titulo:'Descrição e narração', icone:'✍️', resumo:'Descrever com pormenor',
     lead:'Treina a descrição integrada numa narrativa.',
     enunciado:`Escreve um texto (20 a 30 linhas) que conte um episódio e inclua a <b>descrição de uma personagem</b> e de um <b>espaço</b>. Tema livre, mas com início, meio e fim.`,
     criterios:['Inclui descrição física e psicológica de uma personagem.','Descreve um espaço com pormenores sensoriais (cores, sons, cheiros).','Usa pelo menos dois recursos expressivos.','Respeita a estrutura narrativa e os parágrafos.','Pontuação e ortografia corretas.'],
     modelo:`Alterna <b>narração</b> (o que acontece) com <b>descrição</b> (como é a personagem e o lugar). Usa adjetivos expressivos e comparações.`}
,
    /* ===== TREINO EXTRA ===== */
    {id:'extragram7', area:'gramatica', titulo:'Exercícios extra — Gramática', icone:'🎯', resumo:'Classes, funções, coordenação',
     html:`<p class="lead">Mais exercícios para consolidar a gramática do 7.º ano.</p>`,
     quiz:[
      {q:"«quando» (a iniciar uma oração de tempo) é conjunção...",o:["coordenativa","subordinativa","preposição","advérbio"],c:1,e:"Liga uma oração subordinada temporal → subordinativa."},
      {q:"«ou» é conjunção coordenativa...",o:["copulativa","adversativa","disjuntiva","conclusiva"],c:2,e:"Apresenta alternativa → disjuntiva."},
      {q:"Em «Vivo <b>no Porto</b>.», a expressão é...",o:["complemento direto","complemento indireto","complemento oblíquo","modificador"],c:2,e:"Completa obrigatoriamente «viver» (lugar) → complemento oblíquo."},
      {q:"Em «Cheguei <b>tarde</b>.», «tarde» é...",o:["complemento oblíquo","modificador","predicativo","sujeito"],c:1,e:"Pode retirar-se → modificador."},
      {q:"«Estudei e descansei.» — coordenação...",o:["copulativa","adversativa","disjuntiva","conclusiva"],c:0,e:"«e» adiciona → copulativa."},
      {q:"«Tentei, mas não consegui.» — coordenação...",o:["copulativa","adversativa","conclusiva","explicativa"],c:1,e:"«mas» = oposição → adversativa."},
      {q:"«Penso, logo existo.» — coordenação...",o:["disjuntiva","conclusiva","copulativa","adversativa"],c:1,e:"«logo» = conclusão → conclusiva."},
      {q:"«fruto» é hiperónimo de...",o:["árvore","maçã","casca","sumo"],c:1,e:"«maçã» é um tipo de fruto (hipónimo)."},
      {q:"«banco» (de jardim / instituição) é caso de...",o:["sinonímia","homonímia/polissemia","antonímia","hiperonímia"],c:1,e:"Mesma forma, sentidos diferentes."},
      {q:"«felizmente» tem...",o:["só prefixo","só sufixo","prefixo e sufixo","nenhum afixo"],c:1,e:"radical «feliz» + sufixo «-mente»."},
      {q:"Em «Entreguei o livro <b>ao professor</b>.», a expressão é...",o:["complemento direto","complemento indireto","oblíquo","vocativo"],c:1,e:"Substitui-se por «lhe» → complemento indireto."},
      {q:"Em «A água <b>parece</b> gelada.», «gelada» é...",o:["complemento direto","predicativo do sujeito","modificador","oblíquo"],c:1,e:"Com «parecer» (copulativo) → predicativo do sujeito."},
      {q:"«este», em «este caderno», é...",o:["determinante demonstrativo","pronome","advérbio","conjunção"],c:0,e:"Antes do nome, a especificá-lo → determinante demonstrativo."},
      {q:"«escola, recreio, aula, professor» formam um...",o:["campo lexical","par de antónimos","família de palavras","conjugação"],c:0,e:"Palavras ligadas ao tema escola → campo lexical."},
      {q:"«Não comi nem bebi.» — coordenação...",o:["copulativa","adversativa","disjuntiva","conclusiva"],c:0,e:"«nem» adiciona (negativamente) → copulativa."}
     ]},
    {id:'extralit7', area:'literaria', titulo:'Exercícios extra — Leitura e Literatura', icone:'🎯', resumo:'Leandro, narrativa e poesia',
     html:`<p class="lead">Mais exercícios sobre os textos literários do 7.º ano.</p>`,
     quiz:[
      {q:"«Leandro, Rei da Helíria» é da autoria de...",o:["Sophia","Alice Vieira","Gil Vicente","Manuel António Pina"],c:1,e:"É de Alice Vieira."},
      {q:"O rei Leandro pergunta às filhas...",o:["quem é mais bela","quanto o amam","quem é mais rica","quem governa melhor"],c:1,e:"Quer saber quanto o amam para dividir o reino."},
      {q:"Tagiana diz amar o pai «como...»",o:["o ouro","a comida ama o sal","o rei ama o reino","o sol ama a lua"],c:1,e:"«como a comida ama o sal» — amor essencial e sincero."},
      {q:"As indicações cénicas do texto dramático são as...",o:["falas","didascálias","morais","estrofes"],c:1,e:"Didascálias."},
      {q:"Um narrador que é protagonista e conta a própria história é...",o:["heterodiegético","homodiegético","autodiegético","externo"],c:2,e:"Protagonista que se narra → autodiegético."},
      {q:"Recuar no tempo da narrativa para contar o passado é...",o:["prolepse","analepse","elipse","sumário"],c:1,e:"Recuo → analepse."},
      {q:"O ambiente social das personagens é o espaço...",o:["físico","social","psicológico","histórico"],c:1,e:"Meio/relações sociais → espaço social."},
      {q:"O esquema de rima abab é rima...",o:["emparelhada","cruzada","interpolada","branca"],c:1,e:"abab → cruzada."},
      {q:"Versos sem rima dizem-se...",o:["brancos","toantes","agudos","graves"],c:0,e:"Sem rima → versos brancos/soltos."},
      {q:"«chorei rios de lágrimas» é...",o:["comparação","hipérbole","metáfora","anáfora"],c:1,e:"Exagero → hipérbole."},
      {q:"A voz que fala no poema é o...",o:["narrador","poeta","sujeito poético","autor real"],c:2,e:"O sujeito poético (≠ poeta)."},
      {q:"Um tema central de «Leandro, Rei da Helíria» é...",o:["a guerra","o amor verdadeiro vs a bajulação","a viagem ao mar","a pobreza"],c:1,e:"Opõe o amor sincero aos elogios falsos."},
      {q:"Uma estrofe de 4 versos é uma...",o:["terceto","quadra","quintilha","oitava"],c:1,e:"4 → quadra."},
      {q:"Narrador na 3.ª pessoa, fora da ação, é...",o:["homodiegético","autodiegético","heterodiegético","participante"],c:2,e:"Fora da história, 3.ª pessoa → heterodiegético."},
      {q:"Repetir a mesma palavra no início de vários versos é...",o:["aliteração","anáfora","enumeração","antítese"],c:1,e:"Repetição no início de versos → anáfora."}
     ]}
  ],
  obras:[
    {t:'Leandro, Rei da Helíria', a:'Alice Vieira', g:'texto dramático'},
    {t:'Os Piratas', a:'Manuel António Pina', g:'texto dramático'},
    {t:'Contos (ex.: «Sherlock Holmes», contos populares)', a:'autores vários', g:'conto'},
    {t:'Pedra Filosofal e outros poemas', a:'António Gedeão', g:'poesia'},
    {t:'A Aia / Contos', a:'Eça de Queirós (adaptações)', g:'conto'},
    {t:'Poemas', a:'Miguel Torga, Sophia, Eugénio de Andrade', g:'poesia'}
  ],
  glossario:[
    {t:'Complemento oblíquo', d:'Completa obrigatoriamente o verbo (lugar, meio); não se substitui por lhe.'},
    {t:'Modificador', d:'Informação não obrigatória; pode retirar-se da frase.'},
    {t:'Coordenação', d:'Ligação de orações independentes (e, mas, ou, logo).'},
    {t:'Analepse / Prolepse', d:'Recuo / antecipação no tempo da narrativa.'},
    {t:'Autodiegético', d:'Narrador que é o protagonista da história que conta.'},
    {t:'Didascália', d:'Indicação cénica no texto dramático.'},
    {t:'Sujeito poético', d:'A voz que fala no poema, distinta do poeta.'}
  ]
};
