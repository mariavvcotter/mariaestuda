CURRICULO['8'] = {
  subtitulo:'3.º Ciclo', ciclo:'3.º Ciclo', icone:'📗',
  intro:'No 8.º ano dominas a frase complexa (coordenação e subordinação), a colocação dos pronomes e o discurso indireto. Na literatura, trabalhas narrativa, poesia, texto dramático, recursos expressivos e textos dos media.',
  modulos:[
    /* ===== GRAMÁTICA ===== */
    {id:'classes8', area:'gramatica', titulo:'Classes de palavras', icone:'🔤', resumo:'Revisão completa e armadilhas',
     html:`<h3 class="bloco">Variáveis</h3>
      <table class="tab"><tr><th>Classe</th><th>O que é</th><th>Exemplos</th></tr>
      <tr><td><b>Nome</b></td><td>seres, coisas, ideias</td><td>cão, amor, Maria</td></tr>
      <tr><td><b>Adjetivo</b></td><td>qualidade do nome</td><td>bonito, rápido</td></tr>
      <tr><td><b>Verbo</b></td><td>ação, estado</td><td>correr, ser</td></tr>
      <tr><td><b>Determinante</b></td><td>antecede o nome</td><td>o, uma, meu, aquele</td></tr>
      <tr><td><b>Quantificador</b></td><td>quantidade</td><td>dois, muitos</td></tr>
      <tr><td><b>Pronome</b></td><td>substitui o nome</td><td>eu, este, que, ninguém</td></tr></table>
      <h3 class="bloco">Invariáveis</h3>
      <table class="tab"><tr><th>Classe</th><th>O que é</th><th>Exemplos</th></tr>
      <tr><td><b>Advérbio</b></td><td>modifica verbo/adjetivo/frase</td><td>bem, hoje, não, talvez</td></tr>
      <tr><td><b>Preposição</b></td><td>liga, estabelece relações</td><td>de, em, para, com</td></tr>
      <tr><td><b>Conjunção</b></td><td>liga orações/palavras</td><td>e, mas, porque, quando</td></tr>
      <tr><td><b>Interjeição</b></td><td>exprime emoções</td><td>Ah! Olá! Ui!</td></tr></table>
      <div class="caixa dica"><b class="rotulo">Determinante vs pronome</b> O determinante vem junto de um nome; o pronome substitui o nome (vem sozinho).</div>`,
     quiz:[
      {q:"Em «O <b>velho</b> sorriu», «velho» é...",o:["adjetivo","nome","verbo","advérbio"],c:1,e:"Tem determinante («O») e é o núcleo do grupo → nome."},
      {q:"Qual é um quantificador?",o:["aquele","muitos (livros)","rapidamente","embora"],c:1,e:"«Muitos» indica quantidade → quantificador."},
      {q:"«Ah, que dia!» — «Ah» é uma...",o:["preposição","interjeição","conjunção","pronome"],c:1,e:"Exprime emoção → interjeição."},
      {q:"«porque» é conjunção...",o:["coordenativa","subordinativa","copulativa","disjuntiva"],c:1,e:"Liga oração subordinada (causa)."},
      {q:"Em «Ela ofereceu-<b>lhe</b> um livro», «lhe» é...",o:["pronome pessoal","determinante","advérbio","preposição"],c:0,e:"Pronome pessoal (CI)."}
     ]},
    {id:'funcoes8', area:'gramatica', titulo:'Funções sintáticas', icone:'🧩', resumo:'Sujeito, complementos, predicativo…',
     html:`<table class="tab"><tr><th>Função</th><th>Pergunta-teste</th><th>Exemplo</th></tr>
      <tr><td><b>Sujeito</b></td><td>Quem? (concorda c/ verbo)</td><td><b>O João</b> chegou.</td></tr>
      <tr><td><b>Complemento direto</b></td><td>o/a/os/as</td><td>Comprei <b>um livro</b>.</td></tr>
      <tr><td><b>Complemento indireto</b></td><td>lhe/lhes</td><td>Dei <b>ao João</b>.</td></tr>
      <tr><td><b>Complemento oblíquo</b></td><td>obrigatório (lugar/meio)</td><td>Moro <b>em Lisboa</b>.</td></tr>
      <tr><td><b>Predicativo do sujeito</b></td><td>ser/estar/parecer</td><td>A Ana é <b>médica</b>.</td></tr>
      <tr><td><b>Modificador</b></td><td>pode retirar-se</td><td>Saímos <b>ontem</b>.</td></tr>
      <tr><td><b>Vocativo</b></td><td>chama (vírgulas)</td><td><b>Maria</b>, anda cá!</td></tr>
      <tr><td><b>Compl. do nome</b></td><td>completa um nome</td><td>o livro <b>de história</b></td></tr>
      <tr><td><b>Compl. agente da passiva</b></td><td>«por» na voz passiva</td><td>feito <b>pela avó</b></td></tr></table>
      <div class="caixa atencao"><b class="rotulo">CI vs oblíquo</b> CI substitui-se por «lhe» (telefonei-lhe). O oblíquo não (gosto dela).</div>`,
     quiz:[
      {q:"«A Maria ofereceu <b>flores</b> à avó.» — «flores» é...",o:["compl. indireto","compl. direto","predicativo","modificador"],c:1,e:"«ofereceu o quê?» → CD."},
      {q:"«...<b>à avó</b>.» é...",o:["compl. direto","compl. indireto","sujeito","vocativo"],c:1,e:"«a quem?», substitui-se por «lhe» → CI."},
      {q:"«O João está <b>cansado</b>.» — «cansado» é...",o:["modificador","predicativo do sujeito","CD","sujeito"],c:1,e:"Com «estar» (copulativo) → predicativo do sujeito."},
      {q:"«Os alunos saíram <b>cedo</b>.» — «cedo» é...",o:["compl. oblíquo","modificador","predicativo","CD"],c:1,e:"Pode retirar-se → modificador."},
      {q:"«<b>João</b>, fecha a porta!» — «João» é...",o:["sujeito","vocativo","CD","predicativo"],c:1,e:"Interpela alguém, isolado por vírgula → vocativo."}
     ]},
    {id:'frase8', area:'gramatica', titulo:'Coordenação e subordinação', icone:'🔗', resumo:'Frase complexa',
     html:`<h4 class="sub">Coordenação (orações independentes)</h4>
      <table class="tab"><tr><th>Tipo</th><th>Conjunções</th></tr>
      <tr><td>Copulativa</td><td>e, nem</td></tr><tr><td>Adversativa</td><td>mas, porém, contudo</td></tr>
      <tr><td>Disjuntiva</td><td>ou, ou… ou</td></tr><tr><td>Conclusiva</td><td>logo, portanto</td></tr>
      <tr><td>Explicativa</td><td>pois, porque</td></tr></table>
      <h4 class="sub">Subordinação adverbial</h4>
      <table class="tab"><tr><th>Tipo</th><th>Conjunção</th><th>Exemplo</th></tr>
      <tr><td>Causal</td><td>porque, visto que</td><td>Fiquei <b>porque</b> chovia.</td></tr>
      <tr><td>Temporal</td><td>quando, enquanto</td><td><b>Quando</b> chegares, avisa.</td></tr>
      <tr><td>Condicional</td><td>se, caso</td><td><b>Se</b> estudares, passas.</td></tr>
      <tr><td>Final</td><td>para que</td><td>Falei baixo <b>para que</b> dormisse.</td></tr>
      <tr><td>Concessiva</td><td>embora, ainda que</td><td><b>Embora</b> chovesse, saímos.</td></tr>
      <tr><td>Comparativa</td><td>como, tal como</td><td>Corre <b>como</b> o vento.</td></tr>
      <tr><td>Consecutiva</td><td>tão… que</td><td><b>Tão</b> cansado <b>que</b> adormeceu.</td></tr></table>
      <div class="caixa nota"><b class="rotulo">Também</b> subordinadas substantivas («Disse que vinha») e adjetivas relativas («O livro que li»).</div>`,
     quiz:[
      {q:"«Estudei muito e tive boa nota.» — coordenação...",o:["copulativa","adversativa","subordinação causal","temporal"],c:0,e:"«e» adiciona → coordenação copulativa."},
      {q:"«Não fui porque chovia.» — subordinada...",o:["temporal","causal","final","condicional"],c:1,e:"«porque» = causa → subordinada causal."},
      {q:"«Quando chegares, telefona.» — subordinada...",o:["causal","condicional","temporal","concessiva"],c:2,e:"«quando» = tempo → temporal."},
      {q:"«Estudei, mas não tive nota.» — relação de...",o:["coord. adversativa","coord. disjuntiva","subordinação","coord. conclusiva"],c:0,e:"«mas» = oposição → adversativa."},
      {q:"«Se estudares, terás sucesso.» — subordinada...",o:["final","condicional","causal","comparativa"],c:1,e:"«se» = condição → condicional."}
     ]},
    {id:'pronomes8', area:'gramatica', titulo:'Pronomes: colocação', icone:'📍', resumo:'Ênclise, próclise, mesóclise',
     html:`<table class="tab"><tr><th>Colocação</th><th>Posição</th><th>Exemplo</th></tr>
      <tr><td><b>Ênclise</b></td><td>depois do verbo (hífen) — por defeito</td><td>Vi-<b>o</b>.</td></tr>
      <tr><td><b>Próclise</b></td><td>antes do verbo</td><td>Não <b>o</b> vi.</td></tr>
      <tr><td><b>Mesóclise</b></td><td>no meio (futuro/condicional)</td><td>Vê-l<b>o</b>-ei.</td></tr></table>
      <h4 class="sub">Próclise — palavras atrativas</h4>
      <ul><li>Negação: não, nunca, ninguém → «Não <b>me</b> viu.»</li>
      <li>Advérbios: sempre, também, só, já → «Sempre <b>te</b> ajudei.»</li>
      <li>Interrogativos: quem, que, onde → «Quem <b>te</b> avisou?»</li>
      <li>Conjunções subordinativas: que, porque, quando → «Disse que <b>me</b> esperava.»</li></ul>
      <div class="caixa atencao"><b class="rotulo">Formas lo/la e no/na</b> verbos em -r/-s/-z → lo/la (amá-lo); verbos em ditongo nasal → no/na (dão-no).</div>`,
     quiz:[
      {q:"«O João viu o livro.» → substituindo o CD:",o:["O João viu-o.","O João o viu.","O João lo viu.","O João viu lhe."],c:0,e:"Frase afirmativa neutra → ênclise: «viu-o»."},
      {q:"«Não o vi.» — colocação:",o:["ênclise","próclise","mesóclise","tmese"],c:1,e:"A negação atrai → próclise."},
      {q:"«Convidá-lo-ei.» — colocação:",o:["ênclise","próclise","mesóclise","apócope"],c:2,e:"Futuro, pronome no meio → mesóclise."},
      {q:"«Ela deu o presente a mim.» → forma átona:",o:["Deu-me o presente.","Deu-lhe o presente.","Deu-o o presente.","Deu-se."],c:0,e:"«a mim» (CI, 1.ª pessoa) → me."},
      {q:"«Quem te avisou?» — colocação:",o:["ênclise","próclise","mesóclise","nenhuma"],c:1,e:"Interrogativo «quem» atrai → próclise."}
     ]},
    {id:'palavras8', area:'gramatica', titulo:'Palavras e significado', icone:'🌱', resumo:'Formação e relações semânticas',
     html:`<h4 class="sub">Formação</h4>
      <table class="tab"><tr><th>Processo</th><th>Exemplo</th></tr>
      <tr><td>Derivação (prefixo)</td><td>infeliz, refazer</td></tr>
      <tr><td>Derivação (sufixo)</td><td>felizmente, livraria</td></tr>
      <tr><td>Composição morfológica</td><td>agricultura, pluviómetro</td></tr>
      <tr><td>Composição morfossintática</td><td>guarda-chuva, fim de semana</td></tr></table>
      <h4 class="sub">Relações de significado</h4>
      <table class="tab"><tr><th>Relação</th><th>Exemplo</th></tr>
      <tr><td>Sinonímia / Antonímia</td><td>belo=bonito / alto≠baixo</td></tr>
      <tr><td>Hiperonímia / Hiponímia</td><td>flor → rosa</td></tr>
      <tr><td>Holonímia / Meronímia</td><td>árvore → folha</td></tr>
      <tr><td>Homonímia / Polissemia</td><td>são / folha</td></tr>
      <tr><td>Paronímia</td><td>comprimento / cumprimento</td></tr></table>
      <div class="caixa dica"><b class="rotulo">Campo lexical vs semântico</b> Lexical = palavras de um tema. Semântico = sentidos de uma mesma palavra.</div>`,
     quiz:[
      {q:"«feliz / infeliz» são...",o:["sinónimos","antónimos","homónimos","hiperónimos"],c:1,e:"Sentido oposto → antónimos."},
      {q:"«flor» é hiperónimo de...",o:["planta","rosa","jardim","pétala"],c:1,e:"«rosa» é tipo de flor (hipónimo)."},
      {q:"«guarda-chuva» forma-se por...",o:["derivação","composição","conversão","abreviatura"],c:1,e:"Junção de palavras → composição."},
      {q:"«banco» (jardim) e «banco» (instituição) são...",o:["sinónimos","antónimos","homónimos/polissémicos","parónimos"],c:2,e:"Mesma forma, sentidos diferentes."},
      {q:"«escola, professor, recreio, caderno» formam um...",o:["campo lexical","família","par de sinónimos","campo morfológico"],c:0,e:"Tema comum → campo lexical."}
     ]},
    {id:'discurso8', area:'gramatica', titulo:'Discurso direto e indireto', icone:'💬', resumo:'Transformações',
     html:`<table class="tab"><tr><th>Elemento</th><th>Direto</th><th>Indireto</th></tr>
      <tr><td>Verbo</td><td>presente</td><td>imperfeito (estou→estava)</td></tr>
      <tr><td>Verbo</td><td>pret. perfeito</td><td>mais-que-perfeito (fiz→fizera)</td></tr>
      <tr><td>Verbo</td><td>futuro</td><td>condicional (irei→iria)</td></tr>
      <tr><td>Verbo</td><td>imperativo</td><td>conjuntivo (vem→que viesse)</td></tr>
      <tr><td>Tempo</td><td>hoje, ontem, amanhã</td><td>naquele dia, no dia anterior, no dia seguinte</td></tr>
      <tr><td>Lugar</td><td>aqui, este, cá</td><td>ali, aquele, lá</td></tr></table>
      <div class="caixa exemplo"><b class="rotulo">Exemplo</b> «Onde vais hoje?» → perguntou onde ele ia naquele dia.</div>`,
     quiz:[
      {q:"«O João disse: “Estou cansado.”» →",o:["disse que estava cansado","disse que estou cansado","disse estou cansado","disse que estará cansado"],c:0,e:"presente→imperfeito + «que»."},
      {q:"Ao passar a indireto, «hoje» →",o:["amanhã","naquele/nesse dia","ontem","agora"],c:1,e:"hoje → naquele dia."},
      {q:"O discurso direto usa...",o:["dois pontos + travessão/aspas","só vírgulas","parênteses","reticências"],c:0,e:"Reproduz a fala com dois pontos + travessão/aspas."},
      {q:"«Vem cá!» → indireto:",o:["disse que viesse lá","disse vem cá","disse que vinha lá","mandou vir cá"],c:0,e:"imperativo→conjuntivo (viesse) e cá→lá."}
     ]},

    /* ===== EDUCAÇÃO LITERÁRIA ===== */
    {id:'narr8', area:'literaria', titulo:'Texto narrativo', icone:'📖', resumo:'Categorias da narrativa',
     html:`<h4 class="sub">Narrador</h4>
      <table class="tab"><tr><th>Tipo</th><th>Posição</th><th>Pessoa</th></tr>
      <tr><td>Heterodiegético</td><td>fora da história</td><td>3.ª</td></tr>
      <tr><td>Homodiegético</td><td>participa</td><td>1.ª</td></tr>
      <tr><td>Autodiegético</td><td>é o protagonista</td><td>1.ª</td></tr></table>
      <h4 class="sub">Ação, personagens, espaço, tempo</h4>
      <ul><li>Ação principal e secundária; analepse e prolepse.</li>
      <li>Personagem plana (não evolui) vs modelada/redonda (evolui).</li>
      <li>Espaço físico, social, psicológico.</li>
      <li>Tempo cronológico, histórico, psicológico.</li></ul>
      <div class="caixa nota"><b class="rotulo">Focalização</b> omnisciente (sabe tudo), interna (vê por uma personagem), externa (só o exterior).</div>`,
     quiz:[
      {q:"Narrador protagonista (1.ª pessoa) é...",o:["heterodiegético","autodiegético","externo","objeto"],c:1,e:"Protagonista que se narra → autodiegético."},
      {q:"As categorias da narrativa são...",o:["rima, métrica, estrofe","ação, personagens, espaço, tempo, narrador","ato, cena, didascália","tese, argumentos, conclusão"],c:1,e:"São essas cinco categorias."},
      {q:"Recuar no tempo é...",o:["prolepse","analepse","elipse","sumário"],c:1,e:"Recuo → analepse."},
      {q:"Personagem que evolui é...",o:["plana","modelada/redonda","figurante","tipo"],c:1,e:"Evolui → modelada/redonda."}
     ]},
    {id:'poetico8', area:'literaria', titulo:'Texto poético', icone:'🪶', resumo:'Estrofe, métrica, rima',
     html:`<h4 class="sub">Estrofe</h4>
      <p>2 dístico · 3 terceto · 4 quadra · 5 quintilha · 6 sextilha · 8 oitava · 10 décima.</p>
      <h4 class="sub">Métrica</h4>
      <p>Contam-se sílabas métricas até à <b>última sílaba tónica</b> (com elisões). 5 = redondilha menor · 7 = redondilha maior · 10 = decassílabo · 12 = alexandrino.</p>
      <h4 class="sub">Rima</h4>
      <p>Emparelhada (aabb) · cruzada (abab) · interpolada (abba). Consoante vs toante. Versos brancos = sem rima.</p>
      <div class="caixa dica"><b class="rotulo">Soneto</b> 14 versos: 2 quartetos + 2 tercetos.</div>`,
     quiz:[
      {q:"Estrofe de 4 versos é...",o:["terceto","quadra","quintilha","sextilha"],c:1,e:"4 → quadra."},
      {q:"Verso de 7 sílabas métricas é...",o:["decassílabo","redondilha maior","redondilha menor","alexandrino"],c:1,e:"7 → redondilha maior."},
      {q:"Conta-se até à...",o:["primeira sílaba","última sílaba","última sílaba tónica","número de palavras"],c:2,e:"Até à última sílaba tónica."},
      {q:"abab é rima...",o:["emparelhada","cruzada","interpolada","branca"],c:1,e:"abab → cruzada."},
      {q:"14 versos (2 quartetos + 2 tercetos) é um...",o:["romance","soneto","ode","écloga"],c:1,e:"→ soneto."}
     ]},
    {id:'dramatico8', area:'literaria', titulo:'Texto dramático', icone:'🎭', resumo:'Didascálias, atos, falas',
     html:`<table class="tab"><tr><th>Texto principal</th><th>Texto secundário</th></tr>
      <tr><td>falas/réplicas das personagens</td><td>didascálias (cenário, gestos, entoação)</td></tr></table>
      <ul><li><b>Ato</b> (grande divisão) · <b>cena</b> (muda c/ entrada/saída).</li>
      <li><b>Diálogo</b>, <b>monólogo</b>, <b>aparte</b> (ao público).</li></ul>
      <p>Estrutura interna: exposição → conflito → clímax → desenlace.</p>
      <div class="caixa nota"><b class="rotulo">Géneros</b> tragédia, comédia, drama.</div>`,
     quiz:[
      {q:"Indicações de cenário e gestos são...",o:["falas","didascálias","réplicas","apartes"],c:1,e:"Didascálias."},
      {q:"A divisão marcada por mudança de cenário é o...",o:["a cena","o ato","o quadro","a fala"],c:1,e:"O ato (grande divisão)."},
      {q:"Fala dirigida ao público, não ouvida pelas outras personagens:",o:["monólogo","aparte","diálogo","solilóquio"],c:1,e:"Aparte."},
      {q:"Uma personagem sozinha em voz alta faz um...",o:["diálogo","aparte","monólogo","didascália"],c:2,e:"Monólogo."}
     ]},
    {id:'recursos8', area:'literaria', titulo:'Recursos expressivos', icone:'✨', resumo:'Figuras de estilo',
     html:`<table class="tab"><tr><th>Recurso</th><th>Exemplo</th></tr>
      <tr><td>Comparação</td><td>forte como um touro</td></tr>
      <tr><td>Metáfora</td><td>os teus olhos são dois sóis</td></tr>
      <tr><td>Personificação</td><td>o vento sussurrava</td></tr>
      <tr><td>Hipérbole</td><td>chorei rios de lágrimas</td></tr>
      <tr><td>Eufemismo</td><td>partiu desta vida</td></tr>
      <tr><td>Ironia</td><td>que bela trapalhada!</td></tr>
      <tr><td>Antítese</td><td>o melhor e o pior</td></tr>
      <tr><td>Enumeração</td><td>livros, cadernos, canetas...</td></tr>
      <tr><td>Anáfora</td><td>tudo vale, tudo conta</td></tr>
      <tr><td>Aliteração</td><td>o silêncio sussurra</td></tr>
      <tr><td>Apóstrofe</td><td>ó mar salgado...</td></tr></table>
      <div class="caixa atencao"><b class="rotulo">Explica o efeito</b> Não basta nomear: diz o que o recurso transmite.</div>`,
     quiz:[
      {q:"«As estrelas choravam» é...",o:["comparação","personificação","hipérbole","metáfora"],c:1,e:"Ação humana a algo não humano → personificação."},
      {q:"«És forte como um leão» é...",o:["metáfora","comparação","antítese","ironia"],c:1,e:"Tem «como» → comparação."},
      {q:"«Chorei rios de lágrimas» é...",o:["hipérbole","eufemismo","metonímia","anáfora"],c:0,e:"Exagero → hipérbole."},
      {q:"Repetição no início de versos é...",o:["aliteração","anáfora","enumeração","antítese"],c:1,e:"Anáfora."},
      {q:"«Partiu desta vida» (=morreu) é...",o:["eufemismo","hipérbole","ironia","pleonasmo"],c:0,e:"Suaviza → eufemismo."}
     ]},
    {id:'media8', area:'literaria', titulo:'Autobiografia e textos dos media', icone:'📰', resumo:'Diário, notícia, crónica',
     html:`<h4 class="sub">Autobiográficos</h4>
      <table class="tab"><tr><th>Tipo</th><th>Característica</th></tr>
      <tr><td>Autobiografia</td><td>o autor narra a própria vida (1.ª pessoa)</td></tr>
      <tr><td>Biografia</td><td>vida de outra pessoa (3.ª pessoa)</td></tr>
      <tr><td>Diário</td><td>registo pessoal datado</td></tr>
      <tr><td>Memórias</td><td>recordações marcantes</td></tr></table>
      <h4 class="sub">Media</h4>
      <table class="tab"><tr><th>Tipo</th><th>Função</th></tr>
      <tr><td>Notícia</td><td>informar (quem, o quê, quando, onde, como, porquê)</td></tr>
      <tr><td>Reportagem</td><td>informar em profundidade</td></tr>
      <tr><td>Entrevista</td><td>perguntas e respostas</td></tr>
      <tr><td>Crónica</td><td>informar + opinar (subjetiva)</td></tr></table>
      <div class="caixa dica"><b class="rotulo">Objetivo vs subjetivo</b> Notícia = objetiva. Crónica/opinião = subjetiva.</div>`,
     quiz:[
      {q:"Texto em que o autor narra a própria vida:",o:["biografia","autobiografia","reportagem","crónica"],c:1,e:"Autobiografia (1.ª pessoa)."},
      {q:"Registo pessoal datado:",o:["memórias","diário","comentário","entrevista"],c:1,e:"Diário."},
      {q:"Responde a quem/o quê/quando/onde/como/porquê:",o:["crónica","notícia","opinião","conto"],c:1,e:"Notícia."},
      {q:"Texto subjetivo do quotidiano, por vezes com humor:",o:["notícia","crónica","relatório","biografia"],c:1,e:"Crónica."}
     ]},

    /* ===== LEITURA ===== */
    {id:'leit8a', area:'leitura', titulo:'Ler: poema (Mar Português)', icone:'🔍', resumo:'Fernando Pessoa',
     lead:'Lê o poema e responde, atendendo ao sentido e aos recursos.',
     texto:{titulo:'Mar Português', autor:'Fernando Pessoa, in «Mensagem»',
      corpo:`<div class="verso">Ó mar salgado, quanto do teu sal
São lágrimas de Portugal!
Por te cruzarmos, quantas mães choraram,
Quantos filhos em vão rezaram!
Quantas noivas ficaram por casar
Para que fosses nosso, ó mar!

Valeu a pena? Tudo vale a pena
Se a alma não é pequena.
Quem quer passar além do Bojador
Tem que passar além da dor.
Deus ao mar o perigo e o abismo deu,
Mas nele é que espelhou o céu.</div>`},
     quiz:[
      {q:"«quanto do teu sal / São lágrimas de Portugal» é...",o:["comparação","metáfora","onomatopeia","pleonasmo"],c:1,e:"Identifica o sal com lágrimas, sem conector → metáfora."},
      {q:"«Valeu a pena?» + resposta é uma...",o:["apóstrofe","interrogação retórica respondida","anáfora","ironia"],c:1,e:"Pergunta e resposta reflexiva."},
      {q:"A repetição de «Quantas/Quantos» é uma...",o:["aliteração","anáfora","enumeração","hipérbole"],c:1,e:"Repetição no início dos versos → anáfora."},
      {q:"«Ó mar salgado» é uma...",o:["apóstrofe","comparação","metonímia","eufemismo"],c:0,e:"Invoca o mar → apóstrofe."},
      {q:"O tema central é...",o:["o medo do mar","o sacrifício e a glória dos Descobrimentos","umas férias","a pesca"],c:1,e:"Exalta o esforço/dor que conquistou o mar."}
     ]},

    /* ===== ESCRITA ===== */
    {id:'escr8', area:'escrita', titulo:'Texto de opinião', icone:'✍️', resumo:'Tese, argumentos, conclusão',
     lead:'Estrutura um texto argumentativo claro e convincente.',
     enunciado:`Escreve um <b>texto de opinião</b> (25 a 35 linhas) sobre: <b>«Os telemóveis deviam ser proibidos nas escolas?»</b>. Apresenta a tua tese, defende-a com pelo menos <b>três argumentos</b> (com exemplos) e responde a um contra-argumento.`,
     criterios:['Tese clara na introdução.','Três argumentos distintos, cada um num parágrafo.','Pelo menos um exemplo concreto por argumento.','Refuta um contra-argumento (admite a opinião contrária e responde).','Conectores variados e conclusão que reforça a tese.'],
     modelo:`<b>Introdução:</b> tema + tese. <br><b>Desenvolvimento:</b> arg. 1, arg. 2, arg. 3 + contra-argumento e refutação. <br><b>Conclusão:</b> síntese e reforço.`}
,
    /* ===== TREINO EXTRA ===== */
    {id:'extragram8', area:'gramatica', titulo:'Exercícios extra — Gramática', icone:'🎯', resumo:'Subordinação, pronomes, discurso',
     html:`<p class="lead">Mais exercícios para consolidar a gramática do 8.º ano.</p>`,
     quiz:[
      {q:"«Saí cedo para que apanhasse o comboio.» — subordinada...",o:["causal","final","temporal","condicional"],c:1,e:"«para que» exprime finalidade → subordinada final."},
      {q:"«Embora estivesse cansado, continuei.» — subordinada...",o:["concessiva","causal","condicional","comparativa"],c:0,e:"«embora» admite um obstáculo → concessiva."},
      {q:"«Estava tão cansado que adormeceu.» — subordinada...",o:["comparativa","consecutiva","final","temporal"],c:1,e:"«tão... que» exprime consequência → consecutiva."},
      {q:"«Ela viu o filme.» → substituindo o complemento direto:",o:["viu-lhe","viu-o","viu-se","vi-lo"],c:1,e:"«o filme» → «o»: viu-o."},
      {q:"«Nunca o encontrei.» — colocação do pronome:",o:["ênclise","próclise","mesóclise","nenhuma"],c:1,e:"«Nunca» (negação) atrai → próclise."},
      {q:"«Dir-te-ei a verdade.» — colocação:",o:["ênclise","próclise","mesóclise","tmese"],c:2,e:"Futuro, pronome no meio → mesóclise."},
      {q:"«O João disse: “Vou sair.”» → discurso indireto:",o:["disse que vou sair","disse que ia sair","disse vou sair","disse que irá sair"],c:1,e:"futuro próximo «vou» → «ia» + «que»."},
      {q:"«alto / baixo» são...",o:["sinónimos","antónimos","homónimos","hiperónimos"],c:1,e:"Sentido oposto → antónimos."},
      {q:"«árvore» é holónimo (todo) de...",o:["floresta","folha","planta","jardim"],c:1,e:"A folha é parte da árvore → relação holónimo/merónimo."},
      {q:"«comprimento / cumprimento» são...",o:["sinónimos","parónimos","antónimos","homónimos"],c:1,e:"Formas parecidas, sentidos diferentes → parónimos."},
      {q:"Em «O bolo foi feito <b>pela avó</b>.», a expressão é...",o:["sujeito","complemento agente da passiva","complemento indireto","modificador"],c:1,e:"Voz passiva, quem pratica a ação → complemento agente da passiva."},
      {q:"Em «o medo <b>do escuro</b>», a expressão é...",o:["complemento direto","complemento do nome","complemento indireto","modificador"],c:1,e:"Completa o nome «medo» → complemento do nome."},
      {q:"«Ou ficas ou sais.» — coordenação...",o:["copulativa","disjuntiva","adversativa","conclusiva"],c:1,e:"«ou... ou» → disjuntiva."},
      {q:"«pluviómetro» formou-se por...",o:["derivação","composição morfológica","conversão","abreviatura"],c:1,e:"Junção de radicais (pluvio + metro) → composição morfológica."},
      {q:"Ao passar a discurso indireto, «aqui» muda para...",o:["aí","ali/lá","cá","aqui"],c:1,e:"aqui → ali/lá."}
     ]},
    {id:'extralit8', area:'literaria', titulo:'Exercícios extra — Leitura e Literatura', icone:'🎯', resumo:'Narrativa, poesia, recursos, media',
     html:`<p class="lead">Mais exercícios sobre os textos literários do 8.º ano.</p>`,
     quiz:[
      {q:"Um narrador protagonista (1.ª pessoa) é...",o:["heterodiegético","autodiegético","externo","objeto"],c:1,e:"Protagonista que se narra → autodiegético."},
      {q:"Uma personagem que evolui ao longo da história é...",o:["plana","modelada/redonda","figurante","tipo"],c:1,e:"Evolui → modelada/redonda."},
      {q:"Um verso de 10 sílabas métricas é...",o:["redondilha maior","decassílabo","alexandrino","redondilha menor"],c:1,e:"10 sílabas → decassílabo."},
      {q:"Um poema de 14 versos (2 quartetos + 2 tercetos) é um...",o:["romance","soneto","ode","écloga"],c:1,e:"→ soneto."},
      {q:"«As estrelas choravam de saudade» é...",o:["comparação","personificação","metáfora","hipérbole"],c:1,e:"Ação humana às estrelas → personificação."},
      {q:"«Ele partiu desta vida» (=morreu) é um...",o:["eufemismo","hipérbole","ironia","pleonasmo"],c:0,e:"Suaviza uma ideia desagradável → eufemismo."},
      {q:"«Que belíssima confusão!» (a criticar) é...",o:["elogio","ironia","eufemismo","comparação"],c:1,e:"Dizer o contrário do que se pensa → ironia."},
      {q:"Repetir um som consonântico («o sino soa só») é...",o:["anáfora","aliteração","enumeração","antítese"],c:1,e:"Repetição de sons consonânticos → aliteração."},
      {q:"«Ó mar salgado» (interpelar o mar) é uma...",o:["apóstrofe","metonímia","comparação","eufemismo"],c:0,e:"Invocar/interpelar algo → apóstrofe."},
      {q:"Texto em que o autor narra a própria vida é...",o:["biografia","autobiografia","reportagem","crónica"],c:1,e:"Autobiografia (1.ª pessoa)."},
      {q:"Texto jornalístico objetivo que responde a quem/quando/onde é a...",o:["crónica","notícia","opinião","entrevista"],c:1,e:"A notícia informa objetivamente."},
      {q:"Texto subjetivo do quotidiano, com estilo pessoal e humor, é a...",o:["notícia","crónica","relatório","biografia"],c:1,e:"Crónica."},
      {q:"Indicação como «(entra, nervoso)» no teatro é uma...",o:["fala","didascália","réplica","aparte"],c:1,e:"Indicação cénica → didascália."},
      {q:"Uma fala dirigida ao público, não ouvida pelas outras personagens, é um...",o:["monólogo","aparte","diálogo","solilóquio"],c:1,e:"Aparte."},
      {q:"«forte como um touro» é uma...",o:["metáfora","comparação","antítese","ironia"],c:1,e:"Tem «como» → comparação."}
     ]}
  ],
  obras:[
    {t:'Contos (Sophia, Miguel Torga «Vicente», Mário de Carvalho)', a:'autores portugueses', g:'narrativa'},
    {t:'História Breve da Lua', a:'António Gedeão', g:'texto dramático'},
    {t:'Vanessa Vai à Luta', a:'Luísa Costa Gomes', g:'texto dramático'},
    {t:'O Hobbit', a:'J. R. R. Tolkien', g:'narrativa (estrangeira)'},
    {t:'Diário de Anne Frank', a:'Anne Frank', g:'autobiográfico'},
    {t:'Poemas (António Nobre, Sophia, Pessoa)', a:'autores vários', g:'poesia'}
  ],
  glossario:[
    {t:'Subordinação', d:'Uma oração depende de outra (causal, temporal, condicional…).'},
    {t:'Ênclise/Próclise/Mesóclise', d:'Pronome depois/antes/no meio do verbo.'},
    {t:'Analepse', d:'Recuo no tempo da narrativa.'},
    {t:'Narrador heterodiegético', d:'Está fora da história; 3.ª pessoa.'},
    {t:'Apóstrofe', d:'Recurso que invoca/interpela alguém ou algo.'},
    {t:'Redondilha maior', d:'Verso de 7 sílabas métricas.'},
    {t:'Crónica', d:'Texto dos media que cruza informação e opinião sobre o quotidiano.'}
  ]
};
