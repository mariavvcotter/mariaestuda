CURRICULO['10'] = {
  subtitulo:'Ensino Secundário', ciclo:'Secundário', icone:'🏛️',
  intro:'No 10.º ano percorres as origens da literatura portuguesa: a poesia trovadoresca, a crónica de Fernão Lopes, o teatro de Gil Vicente e a obra de Camões — lírica (Rimas) e épica (Os Lusíadas).',
  modulos:[
    /* ===== GRAMÁTICA ===== */
    {id:'gram10', area:'gramatica', titulo:'Funções sintáticas e frase', icone:'🧩', resumo:'Revisão para o secundário',
     html:`<p class="lead">No secundário, a gramática é instrumento de análise textual. Revê o essencial.</p>
      <h4 class="sub">Funções sintáticas</h4>
      <p>Sujeito, predicado, complementos (direto, indireto, oblíquo, agente da passiva), predicativo (do sujeito e do CD), modificador, complemento do nome e do adjetivo, vocativo.</p>
      <h4 class="sub">Frase complexa</h4>
      <ul><li><b>Coordenação</b>: copulativa, adversativa, disjuntiva, conclusiva, explicativa.</li>
      <li><b>Subordinação</b>: substantivas (completivas, relativas), adjetivas relativas (restritivas/explicativas), adverbiais (causal, temporal, condicional, final, concessiva, comparativa, consecutiva).</li></ul>
      <h4 class="sub">Processos fonológicos</h4>
      <p>Na evolução do latim: <b>síncope</b> (queda no meio: <i>malu</i>→mau), <b>apócope</b> (queda no fim), <b>aférese</b> (queda no início), <b>sonorização</b> (<i>lupu</i>→lobo).</p>`,
     quiz:[
      {q:"«Considero-o <b>competente</b>.» — «competente» é...",o:["predicativo do sujeito","predicativo do complemento direto","modificador","compl. do nome"],c:1,e:"Atribui qualidade ao CD «o» → predicativo do complemento direto."},
      {q:"«Saí, embora estivesse cansado.» — subordinada...",o:["causal","concessiva","final","temporal"],c:1,e:"«embora» → concessiva."},
      {q:"A queda de um som no interior da palavra (malu→mau) é...",o:["aférese","síncope","apócope","prótese"],c:1,e:"No meio → síncope."},
      {q:"«A casa foi construída <b>pelos pedreiros</b>.» — função:",o:["sujeito","compl. agente da passiva","compl. indireto","modificador"],c:1,e:"Voz passiva → complemento agente da passiva."}
     ]},
    {id:'coesao10', area:'gramatica', titulo:'Coesão, coerência e registo', icone:'🧵', resumo:'Texto bem construído',
     html:`<p class="lead">A análise e a produção textual exigem domínio da coesão.</p>
      <table class="tab"><tr><th>Coesão</th><th>Mecanismo</th></tr>
      <tr><td>Referencial/gramatical</td><td>pronomes, possessivos, elipse</td></tr>
      <tr><td>Lexical</td><td>repetição, sinónimos, hiperónimos</td></tr>
      <tr><td>Interfrásica</td><td>conectores (mas, portanto, além disso)</td></tr>
      <tr><td>Temporal</td><td>marcadores e correlação de tempos verbais</td></tr></table>
      <h4 class="sub">Registos de língua</h4>
      <p>Formal vs informal; cuidado vs corrente. O registo adequa-se à situação e ao destinatário.</p>
      <div class="caixa dica"><b class="rotulo">Coerência</b> ausência de contradições, progressão da informação e relação com o tema.</div>`,
     quiz:[
      {q:"Substituir um nome por «este», «aquele» é coesão...",o:["lexical","referencial (gramatical)","temporal","frásica"],c:1,e:"Demonstrativos a retomar referentes → coesão referencial."},
      {q:"«primeiro… em seguida… por fim» garante coesão...",o:["temporal","lexical","referencial","nenhuma"],c:0,e:"Marcadores de tempo → coesão temporal."},
      {q:"Numa entrevista de emprego usa-se registo...",o:["informal","formal/cuidado","calão","familiar"],c:1,e:"Situação formal → registo cuidado."},
      {q:"Um texto que se contradiz falha na...",o:["coesão lexical","coerência","pontuação","métrica"],c:1,e:"Contradição → falta de coerência."}
     ]},

    /* ===== EDUCAÇÃO LITERÁRIA ===== */
    {id:'trovadoresca10', area:'literaria', titulo:'Poesia trovadoresca', icone:'🎵', resumo:'Cantigas medievais',
     html:`<p class="lead">A poesia trovadoresca (séculos XII-XIV) é a primeira poesia em galego-português, cantada nas cortes.</p>
      <table class="tab"><tr><th>Cantiga</th><th>Sujeito / tema</th><th>Marcas</th></tr>
      <tr><td><b>De amigo</b></td><td>voz <b>feminina</b>; saudade do amado («amigo»)</td><td>refrão, paralelismo, natureza, mãe e amigas como confidentes</td></tr>
      <tr><td><b>De amor</b></td><td>voz <b>masculina</b>; a «coita» de amor pela senhora</td><td>amor cortês, vassalagem amorosa, sofrimento</td></tr>
      <tr><td><b>De escárnio</b></td><td>crítica/troça <b>indireta</b> (subtil, com ambiguidade)</td><td>sátira social</td></tr>
      <tr><td><b>De maldizer</b></td><td>crítica <b>direta</b>, nomeando o visado</td><td>sátira agressiva</td></tr></table>
      <div class="caixa exemplo"><b class="rotulo">Cantiga de amigo</b> A donzela lamenta a ausência do amigo (namorado) e desabafa com a mãe, as amigas ou a natureza (as «flores do verde pino»).</div>
      <div class="caixa dica"><b class="rotulo">Distinguir escárnio/maldizer</b> Escárnio = crítica velada/subtil. Maldizer = crítica direta e explícita.</div>`,
     quiz:[
      {q:"Numa cantiga de amigo, quem fala é...",o:["um homem","uma mulher (donzela)","um rei","um juiz"],c:1,e:"Voz feminina, lamentando a ausência do amigo."},
      {q:"A «coita de amor» e a vassalagem amorosa são da cantiga...",o:["de amigo","de amor","de escárnio","de maldizer"],c:1,e:"Cantiga de amor: voz masculina, amor cortês e sofrimento."},
      {q:"Crítica direta, nomeando o visado, é a cantiga...",o:["de amigo","de amor","de escárnio","de maldizer"],c:3,e:"Maldizer = sátira direta e explícita."},
      {q:"O refrão e o paralelismo são marcas típicas da cantiga...",o:["de amor","de amigo","de maldizer","de escárnio"],c:1,e:"A cantiga de amigo usa paralelismo e refrão."},
      {q:"Crítica subtil, ambígua e velada é própria da cantiga...",o:["de escárnio","de amigo","de amor","de maldizer"],c:0,e:"Escárnio = crítica indireta/velada."}
     ]},
    {id:'gilvicente10', area:'literaria', titulo:'Gil Vicente — Farsa de Inês Pereira', icone:'🎭', resumo:'Teatro e crítica de costumes',
     html:`<p class="lead">A <b>«Farsa de Inês Pereira»</b> (1523) é uma comédia de costumes que satiriza a sociedade e os papéis femininos do seu tempo.</p>
      <h4 class="sub">A intriga</h4>
      <p>Inês, jovem ambiciosa e sonhadora, recusa o pretendente humilde (Pero Marques, parvo mas honesto) e casa com o <b>Escudeiro</b>, que parecia fino e culto mas se revela arrogante e a maltrata. Viúva, acaba por casar com Pero Marques — agora útil — e engana-o. Termina com o ditado: <b>«Mais quero asno que me leve que cavalo que me derrube.»</b></p>
      <h4 class="sub">Crítica social</h4>
      <ul><li>Sátira à <b>aparência vs realidade</b> (o Escudeiro fidalgo decaído).</li>
      <li>Crítica à condição da mulher e ao casamento por interesse.</li>
      <li>Comicidade de <b>linguagem, situação e personagem</b>.</li></ul>
      <div class="caixa nota"><b class="rotulo">Personagens-tipo</b> Inês (a ambiciosa), Pero Marques (o pateta honesto), o Escudeiro (o fidalgo arrogante e falso), a Mãe, a alcoviteira Lianor Vaz.</div>`,
     quiz:[
      {q:"O autor da «Farsa de Inês Pereira» é...",o:["Camões","Gil Vicente","Fernão Lopes","Garrett"],c:1,e:"É de Gil Vicente."},
      {q:"Inês recusa inicialmente Pero Marques porque...",o:["é rico demais","o acha pateta e quer um marido fino/culto","é velho","é estrangeiro"],c:1,e:"Despreza-o por parvo; ambiciona um marido refinado."},
      {q:"O Escudeiro revela-se...",o:["honesto e simples","arrogante e falso (maltrata-a)","muito rico","um santo"],c:1,e:"A aparência fina esconde arrogância e maus-tratos."},
      {q:"«Mais quero asno que me leve que cavalo que me derrube» significa...",o:["preferir o útil ao aparentemente brilhante","gostar de cavalos","recusar casar","viajar"],c:0,e:"Vale mais o humilde e útil do que o vistoso e perigoso."},
      {q:"A obra é uma farsa porque...",o:["é uma tragédia","é uma comédia de costumes com crítica satírica","é um poema épico","é um sermão"],c:1,e:"Farsa = comédia de costumes, com crítica e comicidade."}
     ]},
    {id:'camoeslirico10', area:'literaria', titulo:'Camões lírico (Rimas)', icone:'💔', resumo:'Amor, mudança, desconcerto',
     html:`<p class="lead">Na lírica, <b>Camões</b> escreve em <b>medida velha</b> (redondilhas, tradição) e <b>medida nova</b> (decassílabo, sonetos — influência do Renascimento/Petrarca).</p>
      <h4 class="sub">Temas centrais</h4>
      <table class="tab"><tr><th>Tema</th><th>Ideia</th></tr>
      <tr><td><b>Amor</b></td><td>o amor como força contraditória (paradoxo): «Amor é fogo que arde sem se ver».</td></tr>
      <tr><td><b>A mudança</b></td><td>tudo se transforma: «Mudam-se os tempos, mudam-se as vontades».</td></tr>
      <tr><td><b>Desconcerto do mundo</b></td><td>o mundo é injusto: os maus prosperam, os bons sofrem.</td></tr>
      <tr><td><b>A mulher idealizada</b></td><td>beleza espiritual e perfeita (influência platónica).</td></tr></table>
      <div class="caixa exemplo"><b class="rotulo">Soneto «Amor é fogo que arde sem se ver»</b> Define o amor por <b>antíteses e paradoxos</b>: é contentamento descontente, dor que desatina sem doer.</div>
      <div class="caixa dica"><b class="rotulo">Medida velha vs nova</b> Velha = redondilhas (5 ou 7 sílabas), temas tradicionais. Nova = decassílabo, soneto, temas e formas renascentistas.</div>`,
     quiz:[
      {q:"«Mudam-se os tempos, mudam-se as vontades» trata do tema...",o:["do desconcerto do mundo","da mudança/inconstância","da guerra","da viagem"],c:1,e:"O tema da mudança e da inconstância de tudo."},
      {q:"O soneto «Amor é fogo que arde sem se ver» define o amor através de...",o:["enumerações simples","antíteses e paradoxos","onomatopeias","narração"],c:1,e:"Camões usa antíteses/paradoxos para captar a natureza contraditória do amor."},
      {q:"A «medida nova» usa sobretudo o verso...",o:["redondilho (5/7 sílabas)","decassílabo","alexandrino","livre"],c:1,e:"Medida nova = decassílabo (soneto), de inspiração italiana."},
      {q:"O «desconcerto do mundo» exprime que...",o:["o mundo é justo","há uma injustiça: os maus prosperam e os bons sofrem","tudo é alegre","o amor vence sempre"],c:1,e:"A perceção da injustiça e desordem do mundo."}
     ]},
    {id:'lusiadas10', area:'literaria', titulo:'Os Lusíadas (épica)', icone:'⚓', resumo:'Estrutura e Canto I',
     html:`<p class="lead">Camões eleva à epopeia a viagem de Vasco da Gama, fundindo <b>História</b> e <b>mitologia</b>.</p>
      <h4 class="sub">Estrutura</h4>
      <ul><li><b>Proposição</b> (tema: «As armas e os barões assinalados»), <b>Invocação</b> (Tágides), <b>Dedicatória</b> (D. Sebastião), <b>Narração</b>.</li>
      <li><b>Consílio dos Deuses</b> (Canto I): os deuses decidem o destino da viagem; Vénus protege, Baco opõe-se.</li></ul>
      <h4 class="sub">Planos da obra</h4>
      <table class="tab"><tr><th>Plano</th><th>Conteúdo</th></tr>
      <tr><td>Viagem</td><td>a navegação de Vasco da Gama (histórico)</td></tr>
      <tr><td>Mitológico</td><td>os deuses do Olimpo (ajudam ou prejudicam)</td></tr>
      <tr><td>História de Portugal</td><td>narrada às personagens (ex.: a reis estrangeiros)</td></tr>
      <tr><td>Reflexões do poeta</td><td>comentários no fim de alguns cantos</td></tr></table>
      <div class="caixa dica"><b class="rotulo">Vasco da Gama</b> é o herói coletivo: representa todo o povo português («os Lusíadas» = os filhos de Luso).</div>`,
     quiz:[
      {q:"«As armas e os barões assinalados» abre a...",o:["Invocação","Proposição","Dedicatória","Narração"],c:1,e:"A Proposição enuncia o assunto da epopeia."},
      {q:"Na Invocação, o poeta dirige-se...",o:["a D. Sebastião","às Tágides (ninfas do Tejo)","a Vénus","a Vasco da Gama"],c:1,e:"Invoca as Tágides pedindo inspiração."},
      {q:"No Consílio dos Deuses, opõe-se aos portugueses...",o:["Vénus","Júpiter","Baco","Marte"],c:2,e:"Baco teme perder a sua glória no Oriente e opõe-se."},
      {q:"«Os Lusíadas» significa...",o:["os navios","os filhos de Luso (os portugueses)","os deuses","os mares"],c:1,e:"Lusíadas = descendentes de Luso, os portugueses."},
      {q:"A obra combina dois grandes planos:",o:["lírico e dramático","histórico (viagem) e mitológico (deuses)","cómico e trágico","épico e jornalístico"],c:1,e:"Plano da viagem (História) + plano dos deuses (mitologia)."}
     ]},

    /* ===== LEITURA ===== */
    {id:'leit10a', area:'leitura', titulo:'Ler: cantiga de amigo', icone:'🔍', resumo:'Interpreta a lírica medieval',
     lead:'Lê a cantiga e responde, identificando características do género.',
     texto:{titulo:'Cantiga de amigo (adaptada/atualizada)', autor:'D. Dinis (grafia atualizada)',
      corpo:`<div class="verso">Ai flores, ai flores do verde pino,
se sabeis novas do meu amigo?
Ai Deus, e u é?

Ai flores, ai flores do verde ramo,
se sabeis novas do meu amado?
Ai Deus, e u é?

Vós me preguntades polo voss'amigo,
e eu bem vos digo que é são e vivo.
Ai Deus, e u é?</div>`},
     quiz:[
      {q:"A voz que fala nesta cantiga é...",o:["masculina","feminina","de um rei","de um juiz"],c:1,e:"É voz feminina (a donzela) — marca da cantiga de amigo."},
      {q:"Esta cantiga é de...",o:["amor","amigo","escárnio","maldizer"],c:1,e:"Voz feminina + saudade do «amigo» (amado) → cantiga de amigo."},
      {q:"A donzela dirige-se, num apelo (apóstrofe), às...",o:["amigas","flores do verde pino","ondas","estrelas"],c:1,e:"Interpela as flores, confidentes da natureza."},
      {q:"«Ai Deus, e u é?» repete-se como...",o:["título","refrão","moral","didascália"],c:1,e:"É o refrão (verso que se repete em cada estrofe)."},
      {q:"A repetição de estruturas semelhantes entre estrofes chama-se...",o:["paralelismo","metáfora","hipérbole","ironia"],c:0,e:"Paralelismo — marca formal típica da cantiga de amigo."}
     ]},

    /* ===== ESCRITA ===== */
    {id:'escr10', area:'escrita', titulo:'Texto expositivo', icone:'✍️', resumo:'Expor com clareza e rigor',
     lead:'Treina a exposição de informação organizada.',
     enunciado:`Escreve um <b>texto expositivo</b> (200 a 300 palavras) em que apresentes as <b>características da poesia trovadoresca</b>, distinguindo cantiga de amigo, de amor e de escárnio/maldizer. Usa exemplos.`,
     criterios:['Introdução que delimita o tema.','Desenvolvimento organizado por tipos de cantiga.','Informação rigorosa e exemplos pertinentes.','Linguagem objetiva e registo cuidado.','Conectores e progressão temática claros.','Conclusão de síntese.'],
     modelo:`<b>Introdução:</b> o que é a poesia trovadoresca. <b>Desenvolvimento:</b> um parágrafo por tipo de cantiga (características + exemplo). <b>Conclusão:</b> síntese da importância.`}
,
    /* ===== TREINO EXTRA ===== */
    {id:'extragram10', area:'gramatica', titulo:'Exercícios extra — Gramática', icone:'🎯', resumo:'Funções, frase, fonologia, coesão',
     html:`<p class="lead">Mais exercícios para consolidar a gramática do 10.º ano.</p>`,
     quiz:[
      {q:"«Elegeram-no <b>delegado</b>.» — «delegado» é...",o:["predicativo do sujeito","predicativo do complemento direto","modificador","complemento do nome"],c:1,e:"Atribui qualidade ao CD «o» → predicativo do complemento direto."},
      {q:"A evolução «lupu > lobo» é um caso de...",o:["síncope","sonorização","aférese","prótese"],c:1,e:"A consoante surda /p/ torna-se sonora /b/ → sonorização."},
      {q:"A queda de um som no início da palavra é...",o:["síncope","apócope","aférese","epêntese"],c:2,e:"No início → aférese."},
      {q:"A queda de um som no fim da palavra é...",o:["apócope","síncope","aférese","prótese"],c:0,e:"No fim → apócope."},
      {q:"«Saí, embora estivesse a chover.» — subordinada...",o:["causal","concessiva","final","temporal"],c:1,e:"«embora» → concessiva."},
      {q:"«Estuda muito, portanto terá sucesso.» — coordenação...",o:["copulativa","adversativa","conclusiva","disjuntiva"],c:2,e:"«portanto» = conclusão → conclusiva."},
      {q:"Em «Gosto <b>de música clássica</b>.», a expressão é...",o:["complemento direto","complemento oblíquo","complemento indireto","modificador"],c:1,e:"Completa obrigatoriamente «gostar» → complemento oblíquo."},
      {q:"Substituir «o autor» por «este» (para o retomar) é coesão...",o:["lexical","referencial (gramatical)","temporal","frásica"],c:1,e:"Demonstrativo a retomar referente → coesão referencial."},
      {q:"«primeiro... depois... por fim» asseguram coesão...",o:["lexical","temporal","referencial","nenhuma"],c:1,e:"Marcadores temporais → coesão temporal."},
      {q:"Numa carta formal usa-se registo...",o:["calão","informal","cuidado/formal","familiar"],c:2,e:"Situação formal → registo cuidado."},
      {q:"«A proposta foi aprovada <b>pelos deputados</b>.» — a expressão é...",o:["sujeito","complemento agente da passiva","complemento indireto","modificador"],c:1,e:"Voz passiva → complemento agente da passiva."},
      {q:"«Espero que ela venha.» — «que ela venha» é oração...",o:["subordinada substantiva completiva","adjetiva relativa","adverbial","coordenada"],c:0,e:"Completa o verbo → substantiva completiva."},
      {q:"Um texto que se contradiz falha sobretudo na...",o:["coesão lexical","coerência","pontuação","métrica"],c:1,e:"Contradição → falha de coerência."},
      {q:"«A casa de que te falei é antiga.» — «de que te falei» é...",o:["adjetiva relativa","substantiva completiva","adverbial causal","coordenada"],c:0,e:"Refere-se ao nome «casa» → adjetiva relativa."},
      {q:"«Felizmente, tudo correu bem.» — «Felizmente» exprime modalidade...",o:["epistémica","deôntica","apreciativa","aspetual"],c:2,e:"Juízo/avaliação do falante → modalidade apreciativa."}
     ]},
    {id:'extralit10', area:'literaria', titulo:'Exercícios extra — Literatura', icone:'🎯', resumo:'Trovadoresca, Gil Vicente, Camões',
     html:`<p class="lead">Mais exercícios sobre a literatura do 10.º ano.</p>`,
     quiz:[
      {q:"Numa cantiga de amigo, a voz é...",o:["masculina","feminina","de um rei","coletiva"],c:1,e:"Voz feminina, sobre a saudade do amado."},
      {q:"A «coita de amor» e a vassalagem amorosa pertencem à cantiga...",o:["de amigo","de amor","de escárnio","de maldizer"],c:1,e:"Cantiga de amor: voz masculina, amor cortês e sofrimento."},
      {q:"Crítica direta, nomeando o visado, é a cantiga...",o:["de amigo","de amor","de escárnio","de maldizer"],c:3,e:"Maldizer = sátira direta."},
      {q:"Crítica subtil/velada é própria da cantiga...",o:["de escárnio","de amigo","de amor","de maldizer"],c:0,e:"Escárnio = crítica indireta."},
      {q:"O paralelismo e o refrão são marcas típicas da cantiga...",o:["de amor","de amigo","de maldizer","de escárnio"],c:1,e:"Cantiga de amigo."},
      {q:"A «Farsa de Inês Pereira» é de...",o:["Camões","Gil Vicente","Fernão Lopes","Garrett"],c:1,e:"Gil Vicente."},
      {q:"Inês recusa inicialmente Pero Marques porque...",o:["é rico","o acha pateta e quer marido fino","é velho","é estrangeiro"],c:1,e:"Despreza-o por parvo; quer um marido refinado."},
      {q:"«Mais quero asno que me leve que cavalo que me derrube» significa...",o:["preferir o útil ao aparentemente brilhante","gostar de cavalos","recusar casar","ir viajar"],c:0,e:"Vale mais o humilde e útil do que o vistoso e perigoso."},
      {q:"«Mudam-se os tempos, mudam-se as vontades» trata do tema...",o:["do desconcerto do mundo","da mudança/inconstância","da guerra","da viagem"],c:1,e:"O tema da mudança."},
      {q:"O soneto «Amor é fogo que arde sem se ver» define o amor por...",o:["enumerações simples","antíteses e paradoxos","onomatopeias","narração"],c:1,e:"Antíteses/paradoxos captam a contradição do amor."},
      {q:"A «medida nova» usa o verso...",o:["redondilho","decassílabo","alexandrino","livre"],c:1,e:"Decassílabo (soneto), influência renascentista."},
      {q:"No Consílio dos Deuses, opõe-se aos portugueses...",o:["Vénus","Júpiter","Baco","Marte"],c:2,e:"Baco teme perder a glória no Oriente."},
      {q:"«As armas e os barões assinalados» abre a...",o:["Invocação","Proposição","Dedicatória","Narração"],c:1,e:"A Proposição enuncia o assunto."},
      {q:"Vasco da Gama é, n'«Os Lusíadas», o...",o:["vilão","herói coletivo (representa os portugueses)","narrador","deus"],c:1,e:"Herói coletivo: representa o povo português."},
      {q:"O «desconcerto do mundo» exprime que...",o:["o mundo é justo","há injustiça: os maus prosperam, os bons sofrem","tudo é alegre","o amor vence sempre"],c:1,e:"A perceção da injustiça e desordem do mundo."}
     ]}
  ],
  obras:[
    {t:'Poesia trovadoresca (cantigas de amigo, amor, escárnio e maldizer)', a:'D. Dinis, Martin Codax, Paio Soares de Taveirós…', g:'lírica medieval'},
    {t:'Crónica de D. João I', a:'Fernão Lopes', g:'crónica/historiografia'},
    {t:'Farsa de Inês Pereira (ou Auto da Feira)', a:'Gil Vicente', g:'teatro'},
    {t:'Rimas (lírica)', a:'Luís de Camões', g:'poesia lírica'},
    {t:'Os Lusíadas (Canto I e episódios)', a:'Luís de Camões', g:'epopeia'}
  ],
  glossario:[
    {t:'Cantiga de amigo', d:'Cantiga de voz feminina, sobre a saudade do amado; paralelismo e refrão.'},
    {t:'Cantiga de amor', d:'Voz masculina; a «coita» (sofrimento) de amor pela senhora.'},
    {t:'Escárnio vs maldizer', d:'Crítica subtil/velada vs crítica direta e explícita.'},
    {t:'Coita', d:'Sofrimento amoroso na cantiga de amor.'},
    {t:'Medida velha / nova', d:'Verso tradicional (redondilha) / decassílabo renascentista (soneto).'},
    {t:'Desconcerto do mundo', d:'Tema camoniano: a injustiça e desordem do mundo.'},
    {t:'Proposição', d:'Parte inicial da epopeia que anuncia o assunto.'}
  ]
};
