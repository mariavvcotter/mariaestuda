CURRICULO['11'] = {
  subtitulo:'Ensino Secundário', ciclo:'Secundário', icone:'🏛️',
  intro:'No 11.º ano estudas o Barroco (Padre António Vieira), o Romantismo (Almeida Garrett e a narrativa de Camilo/Herculano), o Realismo de Eça de Queirós e a poesia de Antero de Quental e Cesário Verde.',
  modulos:[
    /* ===== GRAMÁTICA ===== */
    {id:'gram11', area:'gramatica', titulo:'Valores aspetuais e modalidade', icone:'⏱️', resumo:'Aspeto, modalidade, dêixis',
     html:`<p class="lead">A gramática do 11.º foca-se em valores que estruturam o sentido do texto.</p>
      <h4 class="sub">Valor aspetual</h4>
      <table class="tab"><tr><th>Aspeto</th><th>Ideia</th><th>Exemplo</th></tr>
      <tr><td>Perfetivo</td><td>ação concluída</td><td>Li o livro.</td></tr>
      <tr><td>Imperfetivo</td><td>ação em curso/não concluída</td><td>Lia o livro.</td></tr>
      <tr><td>Genérico/habitual</td><td>repete-se</td><td>Leio todas as noites.</td></tr>
      <tr><td>Iterativo</td><td>repetição</td><td>Tem lido muito.</td></tr></table>
      <h4 class="sub">Modalidade</h4>
      <p>A atitude do falante: <b>epistémica</b> (certeza/probabilidade: «Deve estar a chover»), <b>deôntica</b> (obrigação/permissão: «Tens de sair»), <b>apreciativa</b> (juízo: «Felizmente, ganhámos»).</p>
      <h4 class="sub">Dêixis</h4>
      <p>Palavras que dependem do contexto: <b>pessoal</b> (eu, tu), <b>espacial</b> (aqui, ali), <b>temporal</b> (hoje, agora).</p>`,
     quiz:[
      {q:"«Quando cheguei, ela já tinha saído.» — «tinha saído» exprime aspeto...",o:["imperfetivo","perfetivo (anterioridade concluída)","habitual","iterativo"],c:1,e:"Ação concluída antes de outra → perfetivo (anterior)."},
      {q:"«Deve estar a chover lá fora.» exprime modalidade...",o:["deôntica","epistémica (probabilidade)","apreciativa","nenhuma"],c:1,e:"Grau de certeza/probabilidade → modalidade epistémica."},
      {q:"«Tens de entregar o trabalho amanhã.» — modalidade...",o:["epistémica","deôntica (obrigação)","apreciativa","aspetual"],c:1,e:"Obrigação → modalidade deôntica."},
      {q:"«aqui», «agora», «eu» são exemplos de...",o:["conectores","dêixis","aspeto","modalidade"],c:1,e:"Dependem do contexto de enunciação → dêixis."}
     ]},

    /* ===== EDUCAÇÃO LITERÁRIA ===== */
    {id:'vieira11', area:'literaria', titulo:'Padre António Vieira — Sermão de Santo António aos Peixes', icone:'🐟', resumo:'Oratória barroca',
     html:`<p class="lead">O <b>«Sermão de Santo António aos Peixes»</b> (1654), de <b>Padre António Vieira</b>, é uma obra-prima da <b>oratória barroca</b>: pregado no Maranhão, critica a exploração dos índios e os vícios dos homens.</p>
      <h4 class="sub">A alegoria</h4>
      <p>Vieira retoma o episódio em que Santo António, não sendo ouvido pelos homens, prega aos <b>peixes</b>. Cada peixe representa, alegoricamente, um <b>vício ou virtude humana</b>.</p>
      <table class="tab"><tr><th>Peixe</th><th>Representa</th></tr>
      <tr><td>Rémora</td><td>os que travam/atrasam o bem comum</td></tr>
      <tr><td>Peixe-voador</td><td>os que sobem demais (ambição) e caem</td></tr>
      <tr><td>Polvo</td><td>a hipocrisia e a traição (abraça para matar; muda de cor)</td></tr>
      <tr><td>Roncadores</td><td>os que muito falam e nada valem</td></tr>
      <tr><td>Pegadores</td><td>os parasitas, que vivem à custa de outros</td></tr></table>
      <h4 class="sub">Estrutura e estilo</h4>
      <ul><li>Estrutura retórica: <b>exórdio</b>, <b>exposição</b>, <b>confirmação</b> (louvor e repreensão dos peixes), <b>peroração</b>.</li>
      <li>Estilo barroco: argumentação cerrada, citações bíblicas, metáforas, antíteses, <b>elogio e crítica</b>.</li></ul>
      <div class="caixa nota"><b class="rotulo">Sentido</b> Sob a aparência de falar aos peixes, Vieira critica a sociedade colonial e os vícios humanos — em especial a injustiça contra os índios.</div>`,
     quiz:[
      {q:"O autor do «Sermão de Santo António aos Peixes» é...",o:["Camões","Padre António Vieira","Almeida Garrett","Eça de Queirós"],c:1,e:"É de Padre António Vieira (séc. XVII, Barroco)."},
      {q:"Os peixes representam, alegoricamente...",o:["santos","vícios e virtudes dos homens","reis","apóstolos"],c:1,e:"Cada peixe simboliza um vício ou virtude humana."},
      {q:"O polvo é criticado por...",o:["preguiça","hipocrisia e traição","gula","avareza"],c:1,e:"Abraça para matar e muda de cor → falsidade/hipocrisia."},
      {q:"O sermão pertence ao movimento...",o:["Realismo","Barroco","Romantismo","Modernismo"],c:1,e:"Século XVII → estética barroca (oratória)."},
      {q:"A intenção crítica de Vieira dirige-se sobretudo...",o:["aos animais","aos vícios humanos e à injustiça (ex.: contra os índios)","aos reis estrangeiros","aos navegadores"],c:1,e:"Critica os vícios dos homens e a exploração dos índios."}
     ]},
    {id:'garrett11', area:'literaria', titulo:'Almeida Garrett — Frei Luís de Sousa', icone:'🎭', resumo:'Drama romântico',
     html:`<p class="lead">O <b>«Frei Luís de Sousa»</b> (1843), de <b>Almeida Garrett</b>, é um drama do Romantismo, marcado pelo <b>fado/destino trágico</b> e pelo patriotismo (o sebastianismo).</p>
      <h4 class="sub">A intriga</h4>
      <p>Madalena de Vilhena casou em segundas núpcias com Manuel de Sousa Coutinho, julgando morto o primeiro marido, D. João de Portugal, desaparecido em <b>Alcácer Quibir</b>. O regresso de um <b>Romeiro</b> (peregrino) que afirma «<b>Ninguém!</b>» revela que D. João está vivo — o segundo casamento é nulo. Maria, a filha, morre; Madalena e Manuel recolhem-se à vida religiosa (ele torna-se Frei Luís de Sousa).</p>
      <h4 class="sub">Temas e símbolos</h4>
      <table class="tab"><tr><th>Elemento</th><th>Sentido</th></tr>
      <tr><td>O fado/destino</td><td>a tragédia é inevitável; pressentimentos e agouros</td></tr>
      <tr><td>Sebastianismo</td><td>esperança no regresso de D. Sebastião / D. João</td></tr>
      <tr><td>O Romeiro</td><td>o passado que regressa e destrói o presente</td></tr>
      <tr><td>Maria</td><td>a inocência condenada (lucidez e doença)</td></tr></table>
      <div class="caixa exemplo"><b class="rotulo">«Ninguém!»</b> Quando perguntam ao Romeiro quem é, responde «Ninguém!» — D. João de Portugal já não é ninguém naquele lar, mas a sua presença destrói a família.</div>`,
     quiz:[
      {q:"«Frei Luís de Sousa» é da autoria de...",o:["Garrett","Camilo","Eça","Vieira"],c:0,e:"É de Almeida Garrett (Romantismo)."},
      {q:"Madalena julga viúva por o 1.º marido ter desaparecido em...",o:["Lisboa","Alcácer Quibir","Roma","Sevilha"],c:1,e:"D. João de Portugal desapareceu na batalha de Alcácer Quibir."},
      {q:"A resposta do Romeiro «Ninguém!» revela que...",o:["mente sempre","D. João de Portugal está vivo e regressou","é um santo","perdeu a memória"],c:1,e:"Revela o regresso do 1.º marido, anulando o 2.º casamento."},
      {q:"O destino trágico e os pressentimentos remetem para o tema...",o:["do fado/destino","da viagem","da ciência","do dinheiro"],c:0,e:"O fado/destino inevitável domina o drama."},
      {q:"A obra inscreve-se no...",o:["Realismo","Romantismo","Barroco","Modernismo"],c:1,e:"É um drama romântico (séc. XIX)."}
     ]},
    {id:'eca11', area:'literaria', titulo:'Eça de Queirós — narrativa realista', icone:'🏛️', resumo:'Os Maias / conto realista',
     html:`<p class="lead"><b>Eça de Queirós</b> é o grande nome do <b>Realismo/Naturalismo</b> português. A sua narrativa faz a <b>crítica social</b> da sociedade portuguesa do século XIX.</p>
      <h4 class="sub">«Os Maias»</h4>
      <p>Romance sobre a decadência de uma família aristocrática. Acompanha <b>Carlos da Maia</b> e a sua relação (incestuosa, sem o saberem) com <b>Maria Eduarda</b>. Através das personagens, Eça critica:</p>
      <ul><li>a <b>educação</b> e a superficialidade das elites (a «Lisboa» mundana);</li>
      <li>a <b>política</b> e o jornalismo corruptos;</li>
      <li>o <b>diletantismo</b> e a falta de ação dos intelectuais.</li></ul>
      <h4 class="sub">Características realistas</h4>
      <table class="tab"><tr><th>Traço</th><th>Como aparece</th></tr>
      <tr><td>Objetividade/observação</td><td>descrição rigorosa de ambientes e personagens</td></tr>
      <tr><td>Determinismo</td><td>o meio e a hereditariedade condicionam as personagens</td></tr>
      <tr><td>Crítica social</td><td>ironia e sátira das instituições e costumes</td></tr>
      <tr><td>Personagens-tipo</td><td>representam grupos sociais (ex.: Ega, Dâmaso)</td></tr></table>
      <div class="caixa dica"><b class="rotulo">Ironia de Eça</b> A arma principal: através do humor e do sarcasmo, expõe a hipocrisia e a futilidade da sociedade.</div>`,
     quiz:[
      {q:"Eça de Queirós é o grande nome do...",o:["Romantismo","Realismo/Naturalismo","Barroco","Modernismo"],c:1,e:"Eça = Realismo/Naturalismo (séc. XIX)."},
      {q:"Em «Os Maias», o protagonista é...",o:["Frei Luís de Sousa","Carlos da Maia","Vasco da Gama","Ricardo Reis"],c:1,e:"Carlos da Maia, neto de Afonso da Maia."},
      {q:"O romance critica sobretudo...",o:["a navegação","a sociedade portuguesa e as suas elites","os deuses","a poesia medieval"],c:1,e:"Crítica social da aristocracia, política e cultura do país."},
      {q:"A principal arma estilística de Eça é a...",o:["epopeia","ironia/sátira","cantiga","didascália"],c:1,e:"A ironia e a sátira expõem os vícios sociais."},
      {q:"O «determinismo» realista defende que as personagens são condicionadas...",o:["pelos deuses","pelo meio e pela hereditariedade","pelo acaso","pela rima"],c:1,e:"Meio social + hereditariedade determinam o comportamento."}
     ]},
    {id:'poesia11', area:'literaria', titulo:'Antero e Cesário Verde', icone:'🌆', resumo:'Poesia do século XIX',
     html:`<h4 class="sub">Antero de Quental</h4>
      <p>Poeta filosófico; os seus <b>sonetos</b> exprimem a angústia metafísica, a procura de sentido, a dúvida e o desejo de paz/«Nirvana». Tom grave e idealista.</p>
      <h4 class="sub">Cesário Verde</h4>
      <p>Poeta da <b>cidade</b> e do quotidiano. Em «O Sentimento dum Ocidental» e «Num Bairro Moderno», capta Lisboa, o trabalho, as ruas, com olhar realista e sensorial.</p>
      <table class="tab"><tr><th>Cesário</th><th>Marcas</th></tr>
      <tr><td>Tema</td><td>a cidade moderna, o campo, o trabalhador, o quotidiano</td></tr>
      <tr><td>Olhar</td><td>visual, pictórico, atento ao pormenor</td></tr>
      <tr><td>Oposição</td><td>cidade (doença, artifício) vs campo (saúde, natureza)</td></tr></table>
      <div class="caixa nota"><b class="rotulo">Influência</b> Cesário Verde influenciou fortemente Fernando Pessoa (sobretudo o heterónimo Alberto Caeiro).</div>`,
     quiz:[
      {q:"Os sonetos de Antero de Quental são marcados por...",o:["humor ligeiro","angústia metafísica e procura de sentido","descrição da cidade","sátira política"],c:1,e:"Antero: inquietação filosófica, dúvida e desejo de paz."},
      {q:"Cesário Verde é, sobretudo, o poeta...",o:["da epopeia","da cidade e do quotidiano","da cantiga de amigo","do sermão"],c:1,e:"Capta Lisboa, as ruas e o quotidiano com olhar realista."},
      {q:"Em Cesário, opõem-se frequentemente...",o:["céu e inferno","cidade e campo","passado e futuro","mar e terra"],c:1,e:"Cidade (artifício/doença) vs campo (saúde/natureza)."},
      {q:"O olhar poético de Cesário é sobretudo...",o:["abstrato","visual e atento ao pormenor","narrativo épico","religioso"],c:1,e:"Olhar pictórico, sensorial, de observador da realidade."}
     ]},

    /* ===== LEITURA ===== */
    {id:'leit11a', area:'leitura', titulo:'Ler: soneto de Antero', icone:'🔍', resumo:'Interpreta poesia filosófica',
     lead:'Lê o soneto e responde, ligando forma e sentido.',
     texto:{titulo:'Mais Luz! (excerto/adaptação temática)', autor:'Antero de Quental',
      corpo:`<div class="verso">Na mão de Deus, na sua mão direita,
descansou afinal meu coração.
Do palácio encantado da Ilusão
desci a passo e passo a escada estreita.

Como quem despe uma vaidosa veste,
deixei o sonho da grandeza humana...
Desci... e a alma, finalmente, ufana,
achou a paz na sombra que me reste.</div>`},
     quiz:[
      {q:"Este poema é um...",o:["soneto","romance","conto","sermão"],c:0,e:"Catorze versos em quartetos/tercetos → soneto."},
      {q:"O tema central é a procura de...",o:["riqueza","paz/sentido espiritual e descanso interior","fama","aventura"],c:1,e:"O «coração» descansa «na mão de Deus»: busca de paz/sentido."},
      {q:"«palácio encantado da Ilusão» é uma...",o:["comparação","metáfora","onomatopeia","didascália"],c:1,e:"Identifica a ilusão com um palácio → metáfora."},
      {q:"«Como quem despe uma vaidosa veste» é uma...",o:["metáfora","comparação","hipérbole","apóstrofe"],c:1,e:"Tem «como» → comparação (abandonar a vaidade)."},
      {q:"O tom do poema é...",o:["cómico","grave e reflexivo","irónico","jornalístico"],c:1,e:"Tom grave, filosófico e introspetivo — típico de Antero."}
     ]},

    /* ===== ESCRITA ===== */
    {id:'escr11', area:'escrita', titulo:'Apreciação crítica', icone:'✍️', resumo:'Avaliar uma obra/excerto',
     lead:'Aprende a escrever uma apreciação crítica fundamentada.',
     enunciado:`Escreve uma <b>apreciação crítica</b> (200 a 280 palavras) sobre um excerto ou obra estudada (à tua escolha: «Frei Luís de Sousa», «Os Maias», um poema de Cesário…). Apresenta o objeto, uma análise fundamentada e um juízo de valor.`,
     criterios:['Identifica e contextualiza o objeto (autor, obra, tema).','Análise fundamentada (recursos, temas, intenção).','Juízo de valor justificado (não apenas «gostei»).','Vocabulário literário rigoroso.','Coesão, parágrafos e registo cuidado.','~200-280 palavras.'],
     modelo:`<b>Apresentação:</b> obra/excerto e tema. <b>Análise:</b> aspetos formais e de conteúdo, com exemplos. <b>Apreciação:</b> juízo crítico fundamentado.`}
,
    /* ===== TREINO EXTRA ===== */
    {id:'extragram11', area:'gramatica', titulo:'Exercícios extra — Gramática', icone:'🎯', resumo:'Aspeto, modalidade, dêixis, orações',
     html:`<p class="lead">Mais exercícios para consolidar a gramática do 11.º ano.</p>`,
     quiz:[
      {q:"«Lia o jornal quando tocou o telefone.» — «Lia» exprime aspeto...",o:["perfetivo","imperfetivo (ação em curso)","habitual","iterativo"],c:1,e:"Ação em curso, não concluída → imperfetivo."},
      {q:"«Leio o jornal todas as manhãs.» — valor aspetual...",o:["perfetivo","habitual/genérico","pontual","iterativo único"],c:1,e:"Ação que se repete habitualmente → habitual/genérico."},
      {q:"«Deves estudar mais.» exprime modalidade...",o:["epistémica","deôntica (obrigação/conselho)","apreciativa","aspetual"],c:1,e:"Dever/obrigação → deôntica."},
      {q:"«Provavelmente vai chover.» exprime modalidade...",o:["deôntica","epistémica (probabilidade)","apreciativa","nenhuma"],c:1,e:"Grau de probabilidade → epistémica."},
      {q:"«Felizmente, ninguém se magoou.» exprime modalidade...",o:["epistémica","deôntica","apreciativa","aspetual"],c:2,e:"Avaliação/juízo do falante → apreciativa."},
      {q:"«ontem», «aqui», «eu» são exemplos de...",o:["conectores","dêixis (deíticos)","aspeto","modalidade"],c:1,e:"Dependem do contexto de enunciação → dêixis."},
      {q:"«Quando saíste, eu já tinha jantado.» — «tinha jantado» exprime...",o:["ação em curso","ação concluída anterior (perfetivo)","ação habitual","ordem"],c:1,e:"Ação concluída antes de outra → perfetivo (anterioridade)."},
      {q:"«Penso que tens razão.» — «que tens razão» é oração...",o:["subordinada substantiva completiva","adjetiva relativa","adverbial","coordenada"],c:0,e:"Completa o verbo «pensar» → substantiva completiva."},
      {q:"«O escritor, que nasceu no Porto, faleceu cedo.» — a relativa é...",o:["restritiva","explicativa","completiva","final"],c:1,e:"Entre vírgulas, acessória → explicativa."},
      {q:"«Aqui» e «ali» são dêixis...",o:["temporal","espacial","pessoal","social"],c:1,e:"Localizam no espaço → dêixis espacial."},
      {q:"«Estudou tanto que adoeceu.» — subordinada...",o:["comparativa","consecutiva","causal","final"],c:1,e:"«tanto... que» → consecutiva."},
      {q:"«Tu» e «vós» são dêixis...",o:["pessoal","espacial","temporal","textual"],c:0,e:"Referem os intervenientes → dêixis pessoal."},
      {q:"«A casa foi vendida pela imobiliária.» — voz...",o:["ativa","passiva","reflexa","média"],c:1,e:"O sujeito sofre a ação → voz passiva."},
      {q:"Conector adequado para introduzir uma conclusão:",o:["por outro lado","em suma/portanto","embora","apesar de"],c:1,e:"«em suma/portanto» introduz conclusão."},
      {q:"«Embora chovesse, fomos passear.» — subordinada...",o:["causal","concessiva","condicional","temporal"],c:1,e:"«embora» → concessiva."}
     ]},
    {id:'extralit11', area:'literaria', titulo:'Exercícios extra — Literatura', icone:'🎯', resumo:'Vieira, Garrett, Eça, poesia XIX',
     html:`<p class="lead">Mais exercícios sobre a literatura do 11.º ano.</p>`,
     quiz:[
      {q:"O «Sermão de Santo António aos Peixes» é de...",o:["Camões","Padre António Vieira","Garrett","Eça"],c:1,e:"Padre António Vieira (Barroco)."},
      {q:"Os peixes do sermão representam, alegoricamente...",o:["santos","vícios e virtudes dos homens","reis","apóstolos"],c:1,e:"Cada peixe simboliza um vício/virtude humana."},
      {q:"O polvo, no sermão, é criticado por...",o:["preguiça","hipocrisia e traição","gula","avareza"],c:1,e:"Abraça para matar e muda de cor → falsidade."},
      {q:"O sermão inscreve-se no movimento...",o:["Realismo","Barroco","Romantismo","Modernismo"],c:1,e:"Século XVII → Barroco (oratória)."},
      {q:"«Frei Luís de Sousa» é de...",o:["Garrett","Camilo","Eça","Vieira"],c:0,e:"Almeida Garrett (Romantismo)."},
      {q:"D. João de Portugal desapareceu na batalha de...",o:["Aljubarrota","Alcácer Quibir","Ourique","Salado"],c:1,e:"Alcácer Quibir (1578)."},
      {q:"A resposta «Ninguém!» do Romeiro revela que...",o:["mente","D. João de Portugal está vivo e regressou","é santo","perdeu a memória"],c:1,e:"Revela o regresso do 1.º marido."},
      {q:"O tema do destino inevitável em «Frei Luís de Sousa» é o...",o:["fado","amor cortês","desconcerto","carpe diem"],c:0,e:"O fado/destino trágico domina a obra."},
      {q:"Eça de Queirós é o grande nome do...",o:["Romantismo","Realismo/Naturalismo","Barroco","Modernismo"],c:1,e:"Realismo/Naturalismo."},
      {q:"Em «Os Maias», o protagonista é...",o:["Frei Luís de Sousa","Carlos da Maia","Vasco da Gama","Ricardo Reis"],c:1,e:"Carlos da Maia."},
      {q:"A principal arma estilística de Eça é a...",o:["epopeia","ironia/sátira","cantiga","didascália"],c:1,e:"A ironia que expõe os vícios sociais."},
      {q:"O «determinismo» realista defende que as personagens são condicionadas...",o:["pelos deuses","pelo meio e pela hereditariedade","pelo acaso","pela rima"],c:1,e:"Meio + hereditariedade."},
      {q:"Os sonetos de Antero de Quental exprimem...",o:["humor ligeiro","angústia metafísica e procura de sentido","descrição da cidade","sátira política"],c:1,e:"Inquietação filosófica e desejo de paz."},
      {q:"Cesário Verde é sobretudo o poeta...",o:["da epopeia","da cidade e do quotidiano","da cantiga de amigo","do sermão"],c:1,e:"Capta Lisboa e o quotidiano com olhar realista."},
      {q:"Em Cesário, opõem-se frequentemente...",o:["céu e inferno","cidade e campo","passado e futuro","mar e terra"],c:1,e:"Cidade (artifício) vs campo (saúde)."}
     ]}
  ],
  obras:[
    {t:'Sermão de Santo António aos Peixes', a:'Padre António Vieira', g:'oratória (Barroco)'},
    {t:'Frei Luís de Sousa', a:'Almeida Garrett', g:'teatro (Romantismo)'},
    {t:'Amor de Perdição (ou Herculano)', a:'Camilo Castelo Branco', g:'romance romântico'},
    {t:'Os Maias (ou outro romance)', a:'Eça de Queirós', g:'romance realista'},
    {t:'Sonetos', a:'Antero de Quental', g:'poesia'},
    {t:'O Livro de Cesário Verde (poemas)', a:'Cesário Verde', g:'poesia'}
  ],
  glossario:[
    {t:'Oratória / sermão', d:'Discurso persuasivo religioso; estrutura: exórdio, exposição, confirmação, peroração.'},
    {t:'Alegoria', d:'Sentido figurado em que cada elemento representa uma ideia (os peixes de Vieira).'},
    {t:'Romantismo', d:'Movimento do séc. XIX: sentimento, individualismo, nacionalismo, fado/destino.'},
    {t:'Realismo/Naturalismo', d:'Observação objetiva, crítica social, determinismo (Eça).'},
    {t:'Valor aspetual', d:'Indica se a ação está concluída (perfetivo) ou em curso (imperfetivo).'},
    {t:'Modalidade', d:'Atitude do falante: epistémica (certeza), deôntica (dever), apreciativa.'},
    {t:'Dêixis', d:'Palavras cujo sentido depende do contexto (eu, aqui, agora).'}
  ]
};
