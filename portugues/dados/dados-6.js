CURRICULO['6'] = {
  subtitulo:'2.º Ciclo', ciclo:'2.º Ciclo', icone:'🌿',
  intro:'No 6.º ano aprofundas as funções sintáticas, os tempos e modos verbais e os pronomes. Na literatura, lês narrativas mais longas, poesia com recursos expressivos e os primeiros textos dramáticos.',
  modulos:[
    /* ===== GRAMÁTICA ===== */
    {id:'funcoes6', area:'gramatica', titulo:'Funções sintáticas', icone:'🧩', resumo:'CD, CI, vocativo, predicativo',
     html:`<p class="lead">Cada grupo de palavras tem um «papel» na frase — a sua <b>função sintática</b>.</p>
      <table class="tab"><tr><th>Função</th><th>Pergunta / teste</th><th>Exemplo</th></tr>
      <tr><td><b>Sujeito</b></td><td>Quem? (concorda com o verbo)</td><td><b>O Rui</b> comprou um gelado.</td></tr>
      <tr><td><b>Predicado</b></td><td>o que se diz do sujeito</td><td>O Rui <b>comprou um gelado</b>.</td></tr>
      <tr><td><b>Complemento direto</b></td><td>O quê? (substitui-se por <i>o, a, os, as</i>)</td><td>comprou <b>um gelado</b> → comprou-<b>o</b></td></tr>
      <tr><td><b>Complemento indireto</b></td><td>A quem? (substitui-se por <i>lhe, lhes</i>)</td><td>deu o gelado <b>à irmã</b> → deu-<b>lhe</b></td></tr>
      <tr><td><b>Predicativo do sujeito</b></td><td>com ser/estar/parecer</td><td>O Rui está <b>feliz</b>.</td></tr>
      <tr><td><b>Vocativo</b></td><td>chama alguém (entre vírgulas)</td><td><b>Rui</b>, anda cá!</td></tr></table>
      <div class="caixa dica"><b class="rotulo">Testes rápidos</b> CD → troca por <b>o/a</b>. CI → troca por <b>lhe</b>. Predicativo → aparece com <b>ser, estar, parecer, ficar</b>.</div>`,
     quiz:[
      {q:"Em «A Maria leu <b>o livro</b>.», «o livro» é...",o:["sujeito","complemento direto","complemento indireto","vocativo"],c:1,e:"«Leu o quê?» e substitui-se por «o» → complemento direto."},
      {q:"Em «Ofereci flores <b>ao avô</b>.», «ao avô» é...",o:["complemento direto","complemento indireto","predicativo","sujeito"],c:1,e:"«A quem?» e substitui-se por «lhe» → complemento indireto."},
      {q:"Em «O céu está <b>limpo</b>.», «limpo» é...",o:["complemento direto","predicativo do sujeito","vocativo","sujeito"],c:1,e:"Com o verbo «estar», atribui qualidade ao sujeito → predicativo do sujeito."},
      {q:"Em «<b>Ana</b>, fecha a janela.», «Ana» é...",o:["sujeito","vocativo","complemento direto","predicado"],c:1,e:"Chama-se alguém, está isolado por vírgula → vocativo."},
      {q:"Em «Comprei-<b>o</b> ontem.», o «-o» é...",o:["sujeito","complemento direto","complemento indireto","advérbio"],c:1,e:"O pronome «o» substitui o complemento direto."}
     ]},
    {id:'verbos6', area:'gramatica', titulo:'Verbos: tempos e modos', icone:'⏱️', resumo:'Indicativo, conjuntivo, imperativo',
     html:`<h4 class="sub">As três conjugações</h4>
      <p>1.ª (-<b>ar</b>: cantar) · 2.ª (-<b>er</b>: comer) · 3.ª (-<b>ir</b>: partir).</p>
      <h4 class="sub">Modos verbais</h4>
      <table class="tab"><tr><th>Modo</th><th>Exprime</th><th>Exemplo</th></tr>
      <tr><td><b>Indicativo</b></td><td>factos/certezas</td><td>Eu estudo.</td></tr>
      <tr><td><b>Conjuntivo</b></td><td>desejo/dúvida/hipótese</td><td>Talvez eu estude.</td></tr>
      <tr><td><b>Imperativo</b></td><td>ordem/pedido</td><td>Estuda!</td></tr></table>
      <h4 class="sub">Tempos do indicativo</h4>
      <table class="tab"><tr><th>Tempo</th><th>Quando</th><th>Exemplo</th></tr>
      <tr><td><b>Presente</b></td><td>agora</td><td>canto</td></tr>
      <tr><td><b>Pret. perfeito</b></td><td>passado concluído</td><td>cantei</td></tr>
      <tr><td><b>Pret. imperfeito</b></td><td>passado em curso/habitual</td><td>cantava</td></tr>
      <tr><td><b>Futuro</b></td><td>ainda vai acontecer</td><td>cantarei</td></tr></table>
      <div class="caixa dica"><b class="rotulo">Perfeito vs imperfeito</b> «Ontem <b>li</b> (perfeito, terminou) um livro que <b>tinha</b> capa azul (imperfeito, descrição).»</div>`,
     quiz:[
      {q:"«Comeríamos» está no...",o:["presente","pretérito perfeito","condicional/futuro do pretérito","imperativo"],c:2,e:"Indica uma ação dependente de condição → condicional."},
      {q:"O verbo «partir» pertence à...",o:["1.ª conjugação","2.ª conjugação","3.ª conjugação","nenhuma"],c:2,e:"Termina em -ir → 3.ª conjugação."},
      {q:"«Estuda para o teste!» está no modo...",o:["indicativo","conjuntivo","imperativo","infinitivo"],c:2,e:"Dá uma ordem → modo imperativo."},
      {q:"«Quando eu era pequeno, brincava muito.» — «brincava» está no...",o:["pretérito perfeito","pretérito imperfeito","presente","futuro"],c:1,e:"Ação habitual no passado → pretérito imperfeito."},
      {q:"«Talvez ele venha amanhã.» — «venha» está no modo...",o:["indicativo","conjuntivo","imperativo","condicional"],c:1,e:"Exprime hipótese/dúvida («talvez») → conjuntivo."}
     ]},
    {id:'pronomes6', area:'gramatica', titulo:'Pronomes pessoais', icone:'📍', resumo:'Substituir e colocar',
     html:`<p class="lead">Os pronomes pessoais substituem nomes e evitam repetições.</p>
      <table class="tab"><tr><th>Função</th><th>Pronomes</th><th>Exemplo</th></tr>
      <tr><td>Sujeito</td><td>eu, tu, ele/ela, nós, vós, eles</td><td><b>Ela</b> chegou.</td></tr>
      <tr><td>Compl. direto</td><td>me, te, o, a, nos, vos, os, as</td><td>Vi o filme → Vi-<b>o</b>.</td></tr>
      <tr><td>Compl. indireto</td><td>me, te, lhe, nos, vos, lhes</td><td>Dei à Ana → Dei-<b>lhe</b>.</td></tr></table>
      <h4 class="sub">Colocação (noções)</h4>
      <ul><li>Normalmente <b>depois</b> do verbo, com hífen: «Vi-o.»</li>
      <li>Com <b>negação</b> ou palavras como <i>não, nunca, já, sempre</i>, vai <b>antes</b>: «<u>Não</u> o vi.»</li></ul>
      <div class="caixa atencao"><b class="rotulo">Atenção</b> Verbos terminados em -r/-s/-z perdem essa letra: comprar + o → comprá-<b>lo</b>.</div>`,
     quiz:[
      {q:"«Comprei o bolo.» → substituindo o CD:",o:["Comprei-lhe.","Comprei-o.","Comprei lo.","Comprei-se."],c:1,e:"O CD «o bolo» → pronome «o»: Comprei-o."},
      {q:"«Telefonei à Joana.» → substituindo o CI:",o:["Telefonei-a.","Telefonei-o.","Telefonei-lhe.","Telefonei-se."],c:2,e:"O CI «à Joana» → pronome «lhe»."},
      {q:"Em «Não <b>me</b> viste.», o pronome está...",o:["depois do verbo","antes do verbo","no meio","ausente"],c:1,e:"A negação «não» atrai o pronome para antes do verbo."},
      {q:"«Vou ver o filme.» → «Vou vê-...» :",o:["vê-o","vê-lo","ve-o","vê-le"],c:1,e:"«ver» perde o -r e o pronome torna-se «lo»: vê-lo."}
     ]},
    {id:'formacao6', area:'gramatica', titulo:'Formação de palavras', icone:'🌱', resumo:'Derivação e composição',
     html:`<table class="tab"><tr><th>Processo</th><th>Como</th><th>Exemplo</th></tr>
      <tr><td><b>Derivação (prefixo)</b></td><td>prefixo + palavra</td><td><b>in</b>feliz, <b>des</b>fazer</td></tr>
      <tr><td><b>Derivação (sufixo)</b></td><td>palavra + sufixo</td><td>feliz<b>mente</b>, livr<b>aria</b></td></tr>
      <tr><td><b>Composição</b></td><td>juntar palavras/radicais</td><td>guarda-chuva, girassol</td></tr></table>
      <h4 class="sub">Radical e família</h4>
      <p>O <b>radical</b> é a parte comum: <i>flor</i> em flor, florista, florir, floreira → mesma <b>família de palavras</b>.</p>
      <div class="caixa dica"><b class="rotulo">Prefixos úteis</b> <i>des-</i> (negação: desfazer) · <i>re-</i> (repetição: reler) · <i>in-/im-</i> (negação: incapaz).</div>`,
     quiz:[
      {q:"«infeliz» formou-se por...",o:["composição","derivação por prefixação","derivação por sufixação","onomatopeia"],c:1,e:"prefixo «in-» + «feliz» → derivação por prefixação."},
      {q:"«guarda-chuva» formou-se por...",o:["derivação","composição","conversão","abreviatura"],c:1,e:"Junção de duas palavras → composição."},
      {q:"O sufixo de «livraria» é...",o:["livr-","-aria","li-","-ria apenas"],c:1,e:"radical «livr-» + sufixo «-aria»."},
      {q:"«rever» significa «ver de novo» graças ao prefixo...",o:["re- (repetição)","des- (negação)","in- (negação)","sub-"],c:0,e:"«re-» indica repetição."}
     ]},
    {id:'discurso6', area:'gramatica', titulo:'Discurso direto e indireto', icone:'💬', resumo:'Reproduzir falas',
     html:`<table class="tab"><tr><th></th><th>Discurso direto</th><th>Discurso indireto</th></tr>
      <tr><td>Como</td><td>palavras exatas</td><td>conta-se o que foi dito</td></tr>
      <tr><td>Marcas</td><td>dois pontos + travessão/aspas</td><td>introduz-se por «que»</td></tr>
      <tr><td>Exemplo</td><td>O Rui disse: «Estou cansado.»</td><td>O Rui disse que estava cansado.</td></tr></table>
      <div class="caixa exemplo"><b class="rotulo">O que muda</b> presente→imperfeito (estou→estava) · hoje→naquele dia · aqui→ali · eu→ele.</div>
      <div class="caixa atencao"><b class="rotulo">Cuidado</b> No discurso indireto desaparecem o travessão e as aspas.</div>`,
     quiz:[
      {q:"«Ele disse: “Vou já.”» em discurso indireto:",o:["Ele disse que vou já.","Ele disse que ia já.","Ele disse vou já.","Ele disse que irá já."],c:1,e:"«vou» (presente) → «ia» (imperfeito) e introduz-se «que»."},
      {q:"O discurso direto usa, tipicamente...",o:["só vírgulas","dois pontos e travessão/aspas","parênteses","reticências"],c:1,e:"Reproduz a fala com dois pontos + travessão ou aspas."},
      {q:"Ao passar a indireto, «amanhã» muda para...",o:["ontem","no dia seguinte","hoje","agora"],c:1,e:"amanhã → no dia seguinte."},
      {q:"Em discurso indireto, «aqui» costuma mudar para...",o:["ali/lá","cá","aí","aqui mesmo"],c:0,e:"aqui → ali/lá."}
     ]},

    /* ===== EDUCAÇÃO LITERÁRIA ===== */
    {id:'narr6', area:'literaria', titulo:'Categorias da narrativa', icone:'📖', resumo:'Narrador, personagens, ação',
     html:`<p class="lead">Aprofundamos a análise da narrativa.</p>
      <h4 class="sub">Narrador</h4>
      <ul><li><b>Participante</b> (1.ª pessoa): conta uma história em que entra.</li>
      <li><b>Não participante</b> (3.ª pessoa): está de fora.</li></ul>
      <h4 class="sub">Personagens</h4>
      <ul><li>Relevo: <b>principal</b>, secundária, figurante.</li>
      <li>Caracterização <b>física</b> (como é por fora) e <b>psicológica</b> (como é por dentro).</li>
      <li>Caracterização <b>direta</b> (diz-se) e <b>indireta</b> (deduz-se das ações e falas).</li></ul>
      <h4 class="sub">Espaço e tempo</h4>
      <p>Espaço (onde) e tempo (quando) podem ser reais ou imaginários.</p>
      <div class="caixa nota"><b class="rotulo">Momentos da ação</b> situação inicial → desenvolvimento (problema) → desenlace.</div>`,
     quiz:[
      {q:"Um narrador que conta na 1.ª pessoa e participa na história é...",o:["não participante","participante","ausente","figurante"],c:1,e:"1.ª pessoa + participa → narrador participante."},
      {q:"Dizer «era alta e tinha olhos verdes» é caracterização...",o:["psicológica","física","indireta","social"],c:1,e:"Descreve o aspeto exterior → caracterização física."},
      {q:"Deduzir que uma personagem é generosa pelas suas ações é caracterização...",o:["direta","indireta","física","nula"],c:1,e:"Deduzida das ações → caracterização indireta."},
      {q:"A personagem que aparece pouco e sem importância é...",o:["principal","figurante","narrador","protagonista"],c:1,e:"Pouca importância → figurante."}
     ]},
    {id:'recursos6', area:'literaria', titulo:'Recursos expressivos', icone:'✨', resumo:'Comparação, metáfora…',
     html:`<table class="tab"><tr><th>Recurso</th><th>O que é</th><th>Exemplo</th></tr>
      <tr><td><b>Comparação</b></td><td>aproxima dois elementos com «como»</td><td>Forte <b>como</b> um touro.</td></tr>
      <tr><td><b>Metáfora</b></td><td>identifica sem «como»</td><td>Os teus olhos são <b>estrelas</b>.</td></tr>
      <tr><td><b>Personificação</b></td><td>dá vida humana a seres/coisas</td><td>O vento <b>chorava</b>.</td></tr>
      <tr><td><b>Enumeração</b></td><td>sucessão de elementos</td><td>Levei livros, canetas, lápis...</td></tr>
      <tr><td><b>Onomatopeia</b></td><td>imita sons</td><td><b>Tic-tac</b>, <b>miau</b></td></tr>
      <tr><td><b>Repetição/anáfora</b></td><td>repete palavras para reforçar</td><td><b>Corre, corre, corre!</b></td></tr></table>
      <div class="caixa dica"><b class="rotulo">Comparação ou metáfora?</b> Tem «como» → comparação. Não tem → metáfora.</div>`,
     quiz:[
      {q:"«As ondas dançavam no mar.» é uma...",o:["comparação","personificação","metáfora","enumeração"],c:1,e:"Dançar (ação humana) atribuído às ondas → personificação."},
      {q:"«Os teus cabelos são ouro.» é uma...",o:["comparação","metáfora","onomatopeia","anáfora"],c:1,e:"Identificação direta, sem «como» → metáfora."},
      {q:"«Doce como o mel» é uma...",o:["metáfora","comparação","personificação","enumeração"],c:1,e:"Usa «como» → comparação."},
      {q:"«Tique-taque» do relógio é uma...",o:["metáfora","onomatopeia","comparação","anáfora"],c:1,e:"Imita um som → onomatopeia."}
     ]},
    {id:'drama6', area:'literaria', titulo:'O texto dramático', icone:'🎭', resumo:'Falas e didascálias',
     html:`<p class="lead">O texto dramático é escrito para ser <b>representado</b>. Não tem narrador: a história avança pelas <b>falas</b>.</p>
      <table class="tab"><tr><th>Texto principal</th><th>Texto secundário</th></tr>
      <tr><td>as <b>falas</b> das personagens (diálogo)</td><td>as <b>didascálias</b>: indicações de cenário, gestos, entoação (em itálico)</td></tr></table>
      <ul><li><b>Ato</b> — grande divisão (muda o cenário).</li>
      <li><b>Cena</b> — muda com a entrada/saída de personagens.</li>
      <li><b>Diálogo</b> (entre personagens) · <b>Monólogo</b> (uma só, em voz alta).</li></ul>
      <div class="caixa exemplo"><b class="rotulo">Didascália</b> <i>(Entra a correr e fecha a porta.)</i> — descreve o que se faz, não o que se diz.</div>`,
     quiz:[
      {q:"As indicações de cenário e gestos chamam-se...",o:["falas","didascálias","atos","rimas"],c:1,e:"As didascálias são as indicações cénicas (em itálico)."},
      {q:"O texto dramático NÃO tem...",o:["personagens","falas","narrador","cenas"],c:2,e:"Não há narrador: a ação avança pelas falas."},
      {q:"Uma personagem sozinha que fala em voz alta faz um...",o:["diálogo","monólogo","aparte","ato"],c:1,e:"Sozinha, em voz alta → monólogo."},
      {q:"A divisão que muda com a entrada/saída de personagens é a...",o:["cena","moral","estrofe","rima"],c:0,e:"A cena muda com entradas e saídas; o ato é a grande divisão."}
     ]},

    /* ===== LEITURA ===== */
    {id:'leit6a', area:'leitura', titulo:'Ler: narrativa', icone:'🔍', resumo:'Interpreta um excerto',
     lead:'Lê o excerto e responde, treinando a interpretação.',
     texto:{titulo:'A gaivota e o gato (excerto)', autor:'Adaptado de Luís Sepúlveda, «História de uma gaivota e do gato que a ensinou a voar»',
      corpo:`<p>Zorbas, o gato grande, preto e gordo, prometera três coisas à gaivota moribunda: não comer o ovo, cuidar do filhote até nascer e, a mais difícil de todas, ensiná-lo a voar.</p>
      <p>Quando a pequena gaivota finalmente partiu a casca, olhou para Zorbas e disse a primeira palavra: «Mamã». O gato suspirou. Não era bem o que esperava, mas naquele instante percebeu que cumpriria a sua promessa até ao fim, custasse o que custasse.</p>
      <p>Durante semanas, os gatos do porto guardaram o segredo de Ditosa, a gaivota que crescia entre felinos, sonhando com o dia em que abriria as asas sobre o céu de Hamburgo.</p>`},
     quiz:[
      {q:"Quantas promessas fez Zorbas à gaivota?",o:["Uma","Duas","Três","Quatro"],c:2,e:"Não comer o ovo, cuidar do filhote e ensiná-lo a voar → três."},
      {q:"A primeira palavra da pequena gaivota foi...",o:["«Voar»","«Mamã»","«Zorbas»","«Gato»"],c:1,e:"Olhou para Zorbas e disse «Mamã»."},
      {q:"O narrador deste texto é...",o:["participante (1.ª pessoa)","não participante (3.ª pessoa)","a gaivota","o gato"],c:1,e:"Conta na 3.ª pessoa, de fora da ação → não participante."},
      {q:"«custasse o que custasse» mostra que Zorbas era...",o:["preguiçoso","determinado e fiel à palavra","medroso","distraído"],c:1,e:"Decidiu cumprir a promessa a todo o custo → determinado/leal."}
     ]},

    /* ===== ESCRITA ===== */
    {id:'escr6', area:'escrita', titulo:'Escrever um texto de opinião', icone:'✍️', resumo:'Defende um ponto de vista',
     lead:'Aprende a organizar e a justificar a tua opinião.',
     enunciado:`Escreve um pequeno <b>texto de opinião</b> (15 a 20 linhas) sobre: <b>«Os animais devem ou não ser autorizados nas escolas?»</b>. Apresenta a tua opinião e justifica com, pelo menos, <b>dois argumentos</b> e um exemplo.`,
     criterios:['Apresenta claramente a tua opinião (tese).','Dá pelo menos dois argumentos que a justifiquem.','Inclui um exemplo concreto.','Usa conectores (porque, além disso, por isso, em conclusão).','Termina com uma conclusão.'],
     modelo:`<b>Introdução:</b> apresenta o tema e a tua opinião. <br><b>Desenvolvimento:</b> argumento 1 + argumento 2 + exemplo. <br><b>Conclusão:</b> reforça a tua posição.`}
,
    /* ===== TREINO EXTRA ===== */
    {id:'extragram6', area:'gramatica', titulo:'Exercícios extra — Gramática', icone:'🎯', resumo:'Funções, verbos, pronomes',
     html:`<p class="lead">Mais exercícios para consolidar a gramática do 6.º ano.</p>`,
     quiz:[
      {q:"Em «O Rui leu <b>a banda desenhada</b>.», a expressão destacada é...",o:["complemento indireto","complemento direto","predicativo","vocativo"],c:1,e:"«leu o quê?», substitui-se por «a» → complemento direto."},
      {q:"Em «Telefonei <b>à minha avó</b>.», a expressão é...",o:["complemento direto","complemento indireto","sujeito","modificador"],c:1,e:"«a quem?», substitui-se por «lhe» → complemento indireto."},
      {q:"Em «O bolo está <b>delicioso</b>.», «delicioso» é...",o:["complemento direto","predicativo do sujeito","vocativo","modificador"],c:1,e:"Com «estar», qualidade do sujeito → predicativo do sujeito."},
      {q:"«Cantaríamos» está no...",o:["presente","pretérito perfeito","condicional","imperativo"],c:2,e:"Ação dependente de condição → condicional."},
      {q:"«Talvez ele chegue cedo.» — «chegue» está no modo...",o:["indicativo","conjuntivo","imperativo","infinitivo"],c:1,e:"«Talvez» + hipótese → conjuntivo."},
      {q:"«Fecha a janela!» está no modo...",o:["indicativo","conjuntivo","imperativo","condicional"],c:2,e:"Ordem → imperativo."},
      {q:"«Comprei o jornal.» → substituindo o complemento direto:",o:["Comprei-lhe.","Comprei-o.","Comprei lo.","Comprei-se."],c:1,e:"«o jornal» → «o»: Comprei-o."},
      {q:"Em «Não <b>te</b> ouvi.», o pronome está...",o:["depois do verbo","antes do verbo (próclise)","no meio","ausente"],c:1,e:"A negação atrai o pronome para antes do verbo."},
      {q:"«infeliz» formou-se por...",o:["composição","derivação por prefixação","sufixação","onomatopeia"],c:1,e:"prefixo «in-» + feliz → prefixação."},
      {q:"«guarda-redes» formou-se por...",o:["derivação","composição","conversão","abreviatura"],c:1,e:"Junção de palavras → composição."},
      {q:"O verbo «partir» é da...",o:["1.ª conjugação","2.ª conjugação","3.ª conjugação","nenhuma"],c:2,e:"Termina em -ir → 3.ª conjugação."},
      {q:"«Ele disse: “Estou doente.”» em discurso indireto:",o:["disse que está doente","disse que estava doente","disse estou doente","disse que estará doente"],c:1,e:"presente «estou» → imperfeito «estava» + «que»."},
      {q:"Em discurso indireto, «hoje» muda para...",o:["amanhã","naquele dia","ontem","já"],c:1,e:"hoje → naquele dia."},
      {q:"«Comprar o pão» → «Vou comprá-...»:",o:["compra-o","comprá-lo","comprar-o","comprá-le"],c:1,e:"«comprar» perde o -r e o pronome torna-se «lo» → comprá-lo."},
      {q:"Em «Lê o livro, <b>Ana</b>.», «Ana» é...",o:["sujeito","vocativo","complemento direto","predicativo"],c:1,e:"Chama-se a interlocutora, isolada por vírgula → vocativo."}
     ]},
    {id:'extralit6', area:'literaria', titulo:'Exercícios extra — Leitura e Literatura', icone:'🎯', resumo:'Narrativa, recursos, teatro',
     html:`<p class="lead">Mais exercícios sobre os textos literários do 6.º ano.</p>`,
     quiz:[
      {q:"Um narrador que participa na história e conta na 1.ª pessoa é...",o:["não participante","participante","ausente","figurante"],c:1,e:"1.ª pessoa + participa → narrador participante."},
      {q:"«Tinha olhos castanhos e cabelo comprido» é caracterização...",o:["psicológica","física","social","indireta"],c:1,e:"Aspeto exterior → caracterização física."},
      {q:"Deduzir que uma personagem é corajosa pelas suas ações é caracterização...",o:["direta","física","indireta","social"],c:2,e:"Deduzida das ações → indireta."},
      {q:"«O mar rugia furioso» é um recurso de...",o:["comparação","personificação","metáfora","enumeração"],c:1,e:"Rugir + furioso (humano) ao mar → personificação."},
      {q:"«Os teus olhos são duas estrelas» é uma...",o:["comparação","metáfora","onomatopeia","anáfora"],c:1,e:"Identificação direta, sem «como» → metáfora."},
      {q:"As indicações de cenário e gestos no teatro chamam-se...",o:["falas","didascálias","atos","morais"],c:1,e:"Didascálias (texto secundário)."},
      {q:"O texto dramático NÃO tem...",o:["personagens","falas","narrador","cenas"],c:2,e:"Não há narrador: a ação avança pelas falas."},
      {q:"Uma personagem sozinha que fala em voz alta faz um...",o:["diálogo","monólogo","aparte","ato"],c:1,e:"Sozinha + voz alta → monólogo."},
      {q:"«Frio como o gelo» é uma...",o:["metáfora","comparação","personificação","hipérbole"],c:1,e:"Tem «como» → comparação."},
      {q:"A sucessão «trouxe pão, leite, fruta e mel» é uma...",o:["enumeração","metáfora","anáfora","ironia"],c:0,e:"Sequência de elementos → enumeração."},
      {q:"O primeiro momento da ação narrativa é a...",o:["situação inicial","desenlace","clímax","moral"],c:0,e:"A história começa pela situação inicial."},
      {q:"A divisão do teatro que muda com a entrada/saída de personagens é a...",o:["cena","moral","estrofe","rima"],c:0,e:"A cena muda com entradas/saídas; o ato é a grande divisão."},
      {q:"«Miau», «au-au» são exemplos de...",o:["metáfora","onomatopeia","comparação","rima"],c:1,e:"Imitam sons → onomatopeias."},
      {q:"A personagem que aparece pouco e sem importância é...",o:["principal","figurante","narrador","protagonista"],c:1,e:"Pouca importância → figurante."},
      {q:"«Corre, corre, corre sem parar!» repete a palavra para...",o:["criar rima","reforçar a ideia (repetição)","fazer uma pergunta","descrever o espaço"],c:1,e:"A repetição reforça/intensifica a ideia."}
     ]}
  ],
  obras:[
    {t:'O Cavaleiro da Dinamarca', a:'Sophia de Mello Breyner Andresen', g:'narrativa'},
    {t:'Rosa, minha irmã Rosa', a:'Alice Vieira', g:'narrativa'},
    {t:'História de uma gaivota e do gato que a ensinou a voar', a:'Luís Sepúlveda', g:'narrativa'},
    {t:'Saga', a:'Sophia de M. B. Andresen', g:'conto'},
    {t:'Poemas', a:'Eugénio de Andrade, José Jorge Letria…', g:'poesia'},
    {t:'O Pássaro da Cabeça (poemas)', a:'Manuel António Pina', g:'poesia'}
  ],
  glossario:[
    {t:'Complemento direto', d:'Completa o verbo respondendo a «o quê?»; substitui-se por o/a/os/as.'},
    {t:'Complemento indireto', d:'Responde a «a quem?»; substitui-se por lhe/lhes.'},
    {t:'Predicativo do sujeito', d:'Qualidade do sujeito ligada por ser/estar/parecer.'},
    {t:'Modo conjuntivo', d:'Exprime desejo, dúvida ou hipótese (talvez venha).'},
    {t:'Didascália', d:'Indicação cénica no texto dramático (cenário, gestos).'},
    {t:'Personificação', d:'Atribuir características humanas a seres não humanos.'},
    {t:'Discurso indireto', d:'Relatar o que alguém disse, introduzido por «que».'}
  ]
};
