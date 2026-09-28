/* Perguntas de escolha múltipla — Economia A, unidades 9 a 12 */
(window.ECO_PERGUNTAS = window.ECO_PERGUNTAS || []).push(
  /* ---------- u8 — A contabilidade nacional ---------- */
  { id: 'u9-01', u: 'u9', p: 'A contabilidade nacional tem como principal finalidade',
    o: ['quantificar e organizar a informação sobre a atividade económica de um país num dado período.', 'registar as receitas e despesas de cada empresa para efeitos de cálculo de impostos.', 'fixar os preços dos bens essenciais de modo a controlar a inflação.', 'contabilizar apenas as transações realizadas entre o Estado e as famílias.'],
    c: 0, e: 'A contabilidade nacional mede, com regras comuns, agregados como a produção, o rendimento e a despesa de toda a economia, permitindo comparações e a definição de políticas. Não se confunde com a contabilidade das empresas (microeconómica), que regista as contas de cada unidade.' },

  { id: 'u9-02', u: 'u9', p: 'O Produto Interno Bruto (PIB) de Portugal corresponde ao valor dos bens e serviços finais produzidos, num dado período,',
    o: ['pelas unidades residentes em Portugal, qualquer que seja o local onde produzam.', 'por empresas de capital exclusivamente português, dentro ou fora do país.', 'no território económico português, por unidades residentes e não residentes.', 'no território português, incluindo os bens intermédios incorporados na produção.'],
    c: 2, e: 'O critério do PIB é geográfico (interno): conta tudo o que é produzido no território, seja por residentes ou não residentes. A opção sobre «unidades residentes, qualquer que seja o local» descreve o critério nacional (PNB/RNB), não o interno.' },

  { id: 'u9-03', u: 'u9', p: 'No cálculo do PIB pela ótica do produto, subtrai-se ao valor bruto da produção o consumo intermédio porque',
    o: ['os bens intermédios são produzidos no estrangeiro e não pertencem à economia nacional.', 'desse modo se evita contar mais do que uma vez o valor dos bens intermédios.', 'o consumo intermédio corresponde ao desgaste do capital fixo durante o ano.', 'os bens intermédios estão isentos de impostos e não têm preço de mercado.'],
    c: 1, e: 'O valor dos bens intermédios já está incluído no preço dos bens finais; somá-los de novo originaria dupla contagem. O desgaste do capital fixo corresponde às amortizações, que distinguem o bruto do líquido, e não ao consumo intermédio.' },

  { id: 'u9-04', u: 'u9', p: 'Numa economia existem três empresas: um agricultor vende trigo a uma moagem por 100 €; a moagem vende farinha a uma padaria por 250 €; a padaria vende pão aos consumidores por 400 €. O contributo destas atividades para o PIB é de',
    o: ['750 €.', '650 €.', '250 €.', '400 €.'],
    c: 3, e: 'Pela ótica do produto somam-se os VAB: agricultor 100 − 0 = 100; moagem 250 − 100 = 150; padaria 400 − 250 = 150; total = 400 €, igual ao valor do bem final. Os 750 € resultariam de somar todas as vendas, contando os bens intermédios mais do que uma vez.' },

  { id: 'u9-05', u: 'u9', p: 'Considere os seguintes dados de uma economia (em mil M€): consumo privado 120; consumo público 40; formação bruta de capital 50; exportações 80; importações 90. O PIB a preços de mercado, pela ótica da despesa, é de',
    o: ['200 mil M€.', '380 mil M€.', '290 mil M€.', '210 mil M€.'],
    c: 0, e: 'PIBpm = C + FBC + (X − M) = (120 + 40) + 50 + (80 − 90) = 200 mil M€. Os 380 mil M€ resultariam de somar as importações em vez de as subtrair; as importações correspondem a produção de outros países.' },

  { id: 'u9-06', u: 'u9', p: 'Num país, o PIB a preços de mercado foi de 500 M€, os impostos indiretos de 70 M€ e os subsídios à produção de 20 M€. O PIB a custo de fatores foi de',
    o: ['550 M€.', '450 M€.', '410 M€.', '590 M€.'],
    c: 1, e: 'PIBcf = PIBpm − impostos indiretos + subsídios = 500 − 70 + 20 = 450 M€. O valor 410 M€ resultaria de subtrair também os subsídios, mas estes reduzem os preços de mercado, por isso têm de ser somados para chegar ao custo de fatores.' },

  { id: 'u9-07', u: 'u9', p: 'Num país, o PIB foi de 1000 mil M€. Os rendimentos primários recebidos do resto do mundo foram de 30 mil M€ e os pagos ao resto do mundo de 50 mil M€. O PNB (RNB) foi de',
    o: ['1020 mil M€.', '1080 mil M€.', '980 mil M€.', '950 mil M€.'],
    c: 2, e: 'PNB = PIB + rendimentos recebidos do RM − rendimentos pagos ao RM = 1000 + 30 − 50 = 980 mil M€. Os 1020 mil M€ resultariam de trocar os sinais: os rendimentos pagos a não residentes saem do rendimento nacional.' },

  { id: 'u9-08', u: 'u9', p: 'Se o PIBpm de um país foi de 800 M€ e as amortizações (consumo de capital fixo) de 100 M€, então',
    o: ['o PNBpm foi de 700 M€.', 'o PIBcf foi de 700 M€.', 'o PILpm foi de 900 M€.', 'o PILpm foi de 700 M€.'],
    c: 3, e: 'PIL = PIB − amortizações = 800 − 100 = 700 M€, mantendo-se a avaliação a preços de mercado. As amortizações servem para passar de bruto a líquido; para passar a custo de fatores seriam necessários os impostos indiretos e os subsídios, e para o PNB os rendimentos com o resto do mundo.' },

  { id: 'u9-09', u: 'u9', p: 'Os lucros obtidos por uma fábrica de automóveis localizada em Palmela, detida por um grupo alemão, e distribuídos aos seus acionistas na Alemanha',
    o: ['contam para o PIB português, mas não para o PNB português.', 'contam para o PNB português, mas não para o PIB português.', 'contam para o PIB e para o PNB portugueses.', 'não contam nem para o PIB nem para o PNB portugueses.'],
    c: 0, e: 'A produção ocorre no território português, logo entra no PIB de Portugal; mas os lucros pertencem a não residentes, pelo que são rendimentos pagos ao resto do mundo e saem do PNB português (entram no da Alemanha). A opção inversa confunde o critério geográfico (interno) com o da residência (nacional).' },

  { id: 'u9-10', u: 'u9', p: 'Em Portugal, o PNB (RNB) tem sido inferior ao PIB. Tal significa que',
    o: ['as importações de bens e serviços são superiores às exportações.', 'os rendimentos primários pagos ao resto do mundo superam os recebidos do resto do mundo.', 'os impostos indiretos cobrados são superiores aos subsídios concedidos.', 'as amortizações do capital fixo são superiores ao investimento realizado.'],
    c: 1, e: 'PNB − PIB = rendimentos primários recebidos do RM − pagos ao RM; se o PNB é menor, o saldo destes rendimentos é negativo (por exemplo, juros da dívida externa e lucros de empresas estrangeiras). O saldo entre exportações e importações afeta o PIB pela ótica da despesa, não a diferença entre PIB e PNB.' },

  { id: 'u9-11', u: 'u9', p: 'Em 2024, o PIB nominal de um país foi de 220 mil M€ e o deflator do PIB foi de 110 (ano-base 2020 = 100). O PIB real de 2024, a preços de 2020, foi de',
    o: ['242 mil M€.', '110 mil M€.', '200 mil M€.', '198 mil M€.'],
    c: 2, e: 'PIB real = PIB nominal ÷ deflator × 100 = 220 ÷ 110 × 100 = 200 mil M€. Os 242 mil M€ resultariam de multiplicar pelo deflator, o que acrescentaria (em vez de retirar) o efeito da subida dos preços.' },

  { id: 'u9-12', u: 'u9', p: 'Num dado ano, o PIB nominal de um país cresceu 6% e o deflator do PIB aumentou 4%. A taxa de crescimento real do PIB foi de cerca de',
    o: ['10,2%.', '6,0%.', '−1,9%.', '1,9%.'],
    c: 3, e: 'Taxa real = (1,06 ÷ 1,04) − 1 ≈ 0,019, ou seja, cerca de 1,9% (aproximadamente 6% − 4% = 2%). A opção 6% ignora a subida dos preços: parte do crescimento nominal deveu-se apenas ao aumento dos preços, não a mais produção.' },

  { id: 'u9-13', u: 'u9', p: 'Um jornal noticia que «o PIB nominal aumentou 3% este ano». Com base apenas nesta informação, pode concluir-se que',
    o: ['o valor da produção a preços correntes aumentou, mas não se sabe se a quantidade produzida aumentou.', 'a quantidade de bens e serviços produzidos aumentou 3%.', 'o nível de vida da população melhorou 3%.', 'os preços aumentaram 3% e a produção manteve-se constante.'],
    c: 0, e: 'O PIB nominal é avaliado a preços correntes, pelo que o seu aumento pode dever-se à subida de preços, ao aumento da produção ou a ambos. Para saber se a produção aumentou 3% seria preciso o PIB real (a preços constantes).' },

  { id: 'u9-14', u: 'u9', p: 'Um país com 10,5 milhões de habitantes registou um PIB de 250 mil milhões de euros. O seu PIB per capita foi de aproximadamente',
    o: ['2381 €.', '23 810 €.', '238 095 €.', '42 000 €.'],
    c: 1, e: 'PIB per capita = 250 000 000 000 € ÷ 10 500 000 ≈ 23 810 €. As opções 2381 € e 238 095 € resultam de erros de ordem de grandeza (mil milhões vs. milhões) na divisão.' },

  { id: 'u9-15', u: 'u9', p: 'Qual das seguintes atividades NÃO é contabilizada no PIB?',
    o: ['O serviço de limpeza prestado por uma empregada doméstica contratada e declarada.', 'A produção de vinho de uma cooperativa vendido no mercado interno.', 'A limpeza e as refeições feitas pelos membros de uma família na sua própria casa.', 'Os serviços de saúde prestados gratuitamente nos hospitais públicos.'],
    c: 2, e: 'O trabalho doméstico não remunerado não passa pelo mercado e não é contabilizado no PIB, o que constitui uma das suas limitações. Os serviços dos hospitais públicos, apesar de gratuitos para o utente, são contabilizados pelo seu custo de produção (salários, consumos), enquanto a mesma limpeza feita por uma empregada declarada entra no PIB.' },

  { id: 'u9-16', u: 'u9', p: 'A existência de uma economia não registada (paralela) significativa leva a que o PIB oficial',
    o: ['sobrestime a produção efetivamente realizada no país.', 'reflita com exatidão a produção, embora a preços mais elevados.', 'inclua automaticamente essas atividades através do IVA cobrado.', 'subestime a produção efetivamente realizada no país.'],
    c: 3, e: 'As atividades não declaradas (para fugir a impostos e contribuições) escapam aos registos estatísticos, pelo que o PIB oficial fica abaixo da produção real. Não há sobrestimação: o que falta nos registos é precisamente essa produção oculta.' },

  { id: 'u9-17', u: 'u9', p: 'Após um grande incêndio florestal, as despesas com a reconstrução de casas e equipamentos fizeram aumentar o PIB da região. Este facto ilustra que o PIB',
    o: ['não desconta os danos ambientais e a destruição de riqueza, sendo um indicador limitado de bem-estar.', 'mede o bem-estar, pois a reconstrução aumenta a qualidade de vida face à situação anterior ao incêndio.', 'só contabiliza a produção de bens, excluindo os serviços prestados após catástrofes.', 'é calculado a custo de fatores, o que exclui o valor dos bens destruídos.'],
    c: 0, e: 'O PIB regista a produção de reconstrução, mas não subtrai a perda de património natural e de bens, nem os custos ambientais; por isso pode subir sem que o bem-estar aumente. A população não fica melhor do que antes do incêndio — apenas repõe parte do que perdeu.' },

  { id: 'u9-18', u: 'u9', p: 'O Índice de Desenvolvimento Humano (IDH) combina indicadores relativos a',
    o: ['taxa de desemprego, taxa de inflação e PIB per capita.', 'esperança de vida à nascença, escolaridade e RNB per capita em paridades de poder de compra.', 'mortalidade infantil, emissões de CO2 e taxa de pobreza.', 'esperança de vida, número de médicos por habitante e exportações per capita.'],
    c: 1, e: 'O IDH (PNUD) agrega três dimensões: saúde (esperança de vida à nascença), educação (anos médios e esperados de escolaridade) e padrão de vida (RNB per capita em PPC). Desemprego e inflação são indicadores conjunturais que não fazem parte do IDH.' },

  { id: 'u9-19', u: 'u9', p: 'No cálculo do PIB pela ótica do rendimento somam-se',
    o: ['todos os rendimentos recebidos pelas famílias, incluindo pensões e subsídios de desemprego.', 'as despesas de consumo, de investimento e as exportações líquidas.', 'os rendimentos gerados na produção e distribuídos aos fatores produtivos: salários, rendas, juros e lucros.', 'os valores acrescentados de todos os ramos de atividade da economia.'],
    c: 2, e: 'A ótica do rendimento soma as remunerações dos fatores que participaram na produção (trabalho e capital). Pensões e subsídios de desemprego são transferências (redistribuição), não rendimentos gerados na produção, pelo que não entram. As outras duas opções descrevem as óticas da despesa e do produto.' },

  { id: 'u9-20', u: 'u9', p: 'Qual das seguintes transações realizadas em 2025 é contabilizada no PIB português de 2025?',
    o: ['O valor pago pela compra de uma casa usada construída em 1990.', 'A compra de ações de uma empresa cotada na bolsa de Lisboa.', 'A pensão de reforma paga pela Segurança Social a um reformado.', 'A comissão cobrada pela agência imobiliária que intermediou a venda de uma casa usada.'],
    c: 3, e: 'A comissão da imobiliária remunera um serviço produzido em 2025, logo entra no PIB. A casa usada já foi contabilizada no PIB de 1990, quando foi construída; a compra de ações é uma operação financeira e a pensão é uma transferência, nenhuma delas corresponde a produção nova.' },

  /* ---------- u9 — As relações económicas com o resto do mundo ---------- */
  { id: 'u10-01', u: 'u10', p: 'Segundo a teoria das vantagens comparativas de David Ricardo, um país deve especializar-se na produção',
    o: ['dos bens em que tem um custo de oportunidade relativamente mais baixo, mesmo que não tenha vantagem absoluta.', 'apenas dos bens em que produz com menos recursos do que todos os outros países.', 'de todos os bens de que necessita, para não depender do exterior.', 'dos bens com maior preço no mercado internacional, independentemente dos custos.'],
    c: 0, e: 'Para Ricardo, o que conta é o custo relativo: cada país ganha com a troca se se especializar onde a sua eficiência é relativamente maior. A ideia de produzir apenas onde se usa menos recursos do que os outros corresponde às vantagens absolutas de Adam Smith.' },

  { id: 'u10-02', u: 'u10', p: 'Para produzir uma unidade de vinho, Portugal precisa de 80 horas de trabalho e a Inglaterra de 120; para uma unidade de tecido, Portugal precisa de 90 horas e a Inglaterra de 100. De acordo com Ricardo,',
    o: ['Portugal deve produzir os dois bens, pois tem vantagem absoluta em ambos.', 'Portugal deve especializar-se em tecido e a Inglaterra em vinho.', 'não há vantagem na troca, porque a Inglaterra é menos eficiente em ambos os bens.', 'Portugal deve especializar-se em vinho e a Inglaterra em tecido.'],
    c: 3, e: 'Portugal é mais eficiente nos dois bens, mas relativamente mais no vinho (80/120 ≈ 0,67 contra 90/100 = 0,9). Em Portugal, 1 vinho custa 80/90 ≈ 0,89 tecidos, contra 1,2 na Inglaterra, pelo que Portugal tem vantagem comparativa no vinho e a Inglaterra no tecido. A vantagem absoluta em ambos não impede ganhos com a especialização.' },

  { id: 'u10-03', u: 'u10', p: 'Um contingente à importação consiste',
    o: ['num imposto cobrado sobre o valor dos bens importados.', 'num limite à quantidade de um bem que pode ser importada num dado período.', 'num subsídio concedido às empresas nacionais que exportam.', 'na exigência de normas técnicas e sanitárias aos produtos estrangeiros.'],
    c: 1, e: 'O contingente (quota) é uma restrição quantitativa às importações. O imposto sobre bens importados é um direito aduaneiro (barreira pautal), e as normas técnicas são barreiras não pautais.' },

  { id: 'u10-04', u: 'u10', p: 'A introdução de um direito aduaneiro sobre as importações de calçado tende a',
    o: ['baixar o preço do calçado importado e beneficiar os consumidores nacionais.', 'aumentar as importações de calçado, por serem mais rentáveis.', 'aumentar o preço do calçado importado, favorecendo os produtores nacionais em prejuízo dos consumidores.', 'eliminar as receitas do Estado provenientes do comércio externo.'],
    c: 2, e: 'O direito aduaneiro é um imposto sobre as importações que encarece os bens estrangeiros, tornando os produtores nacionais mais competitivos; os consumidores perdem porque pagam mais. O Estado, pelo contrário, obtém receita com esse imposto.' },

  { id: 'u10-05', u: 'u10', p: 'Qual das seguintes medidas constitui uma barreira não pautal ao comércio?',
    o: ['A exigência de certificações sanitárias muito rigorosas e morosas para os produtos alimentares importados.', 'Um imposto de 15% sobre o valor das bicicletas importadas.', 'A cobrança de um direito aduaneiro fixo por tonelada de aço importado.', 'A redução para zero dos direitos aduaneiros entre dois países.'],
    c: 0, e: 'As barreiras não pautais dificultam as importações sem recorrer a impostos: normas técnicas, sanitárias, burocracia. Os impostos sobre importações, seja em percentagem ou por tonelada, são barreiras pautais (direitos aduaneiros).' },

  { id: 'u10-06', u: 'u10', p: 'A Organização Mundial do Comércio (OMC)',
    o: ['é uma instituição da União Europeia que fixa a pauta aduaneira comum.', 'concede empréstimos aos países com dificuldades na balança de pagamentos.', 'define a taxa de câmbio entre as principais moedas mundiais.', 'sucedeu ao GATT em 1995 e promove a liberalização do comércio e a resolução de litígios comerciais.'],
    c: 3, e: 'A OMC foi criada em 1995 para suceder ao GATT, negociando a redução de barreiras e resolvendo conflitos entre membros. A concessão de empréstimos a países com problemas de balança de pagamentos é função do FMI, não da OMC.' },

  { id: 'u10-07', u: 'u10', p: 'O argumento protecionista da «indústria nascente» defende que',
    o: ['as indústrias antigas devem ser protegidas para manter os postos de trabalho existentes.', 'setores novos devem ser protegidos temporariamente até conseguirem competir com empresas estrangeiras já consolidadas.', 'todas as indústrias devem ser protegidas permanentemente para garantir a autossuficiência.', 'as novas indústrias devem ser expostas de imediato à concorrência para ganharem eficiência.'],
    c: 1, e: 'O argumento da indústria nascente justifica uma proteção temporária de setores recentes, enquanto ganham escala e experiência. A proteção de indústrias antigas para salvar empregos é um argumento diferente (defesa do emprego), e a proteção permanente contraria a ideia de ser apenas transitória.' },

  { id: 'u10-08', u: 'u10', p: 'As remessas enviadas por emigrantes portugueses residentes em França para as suas famílias em Portugal são registadas na balança de pagamentos portuguesa',
    o: ['na balança de serviços, a crédito.', 'na balança de rendimento primário, a crédito.', 'na balança de rendimento secundário, a crédito.', 'na balança de capital, a crédito.'],
    c: 2, e: 'As remessas de emigrantes são transferências correntes sem contrapartida, registadas no rendimento secundário; como entram em Portugal, são um crédito. Não pertencem ao rendimento primário, porque este abrange rendimentos de fatores (trabalho de não residentes, juros, dividendos, lucros) e os emigrantes são residentes em França.' },

  { id: 'u10-09', u: 'u10', p: 'Os juros pagos pelo Estado português a investidores estrangeiros detentores de dívida pública são registados',
    o: ['a débito, na balança de rendimento primário.', 'a débito, na balança de rendimento secundário.', 'a débito, na balança financeira, como investimento de carteira.', 'a débito, na balança de serviços, como serviços financeiros.'],
    c: 0, e: 'Os juros são rendimentos de investimento, parte do rendimento primário; como saem para não residentes, são um débito. A balança financeira regista a compra e venda dos próprios títulos (o capital), não os juros que eles geram.' },

  { id: 'u10-10', u: 'u10', p: 'As despesas feitas em Portugal por turistas estrangeiros em hotéis e restaurantes correspondem, na balança de pagamentos portuguesa, a',
    o: ['importações de serviços.', 'exportações de bens.', 'transferências recebidas no rendimento secundário.', 'exportações de serviços.'],
    c: 3, e: 'Ao prestar serviços (alojamento, restauração) a não residentes, Portugal está a exportar serviços (rubrica «viagens e turismo»), o que gera entrada de divisas. Não são exportações de bens, porque não há saída de mercadorias do território.' },

  { id: 'u10-11', u: 'u10', p: 'As verbas recebidas por Portugal de fundos europeus destinadas a financiar a construção de infraestruturas são registadas, na balança de pagamentos,',
    o: ['na balança de rendimento secundário, a crédito.', 'na balança de capital, a crédito.', 'na balança financeira, como investimento direto.', 'na balança de bens, como exportações.'],
    c: 1, e: 'Transferências sem contrapartida destinadas a investimento são transferências de capital, registadas na balança de capital. Se as transferências da UE se destinassem a despesa corrente (por exemplo, certos apoios à formação), seriam registadas no rendimento secundário.' },

  { id: 'u10-12', u: 'u10', p: 'Uma empresa espanhola adquiriu 60% do capital de uma empresa portuguesa, passando a controlar a sua gestão. Esta operação regista-se na balança financeira portuguesa como',
    o: ['investimento de carteira do exterior em Portugal.', 'outro investimento, na forma de empréstimo.', 'investimento direto do exterior em Portugal.', 'variação dos ativos de reserva do Banco de Portugal.'],
    c: 2, e: 'Uma participação de 10% ou mais com influência na gestão corresponde a investimento direto; aqui aumentam os passivos de Portugal face ao exterior. O investimento de carteira envolve participações que não dão controlo sobre a gestão, como a compra de uma pequena percentagem de ações.' },

  { id: 'u10-13', u: 'u10', p: 'Num país registaram-se os seguintes saldos (M€): bens −5000; serviços +8000; rendimento primário −3000; rendimento secundário +2500; balança de capital +1500. O saldo da balança corrente foi de',
    o: ['+5500 M€.', '−2500 M€.', '+4000 M€.', '+2500 M€.'],
    c: 3, e: 'Balança corrente = bens + serviços + rendimento primário + rendimento secundário = −5000 + 8000 − 3000 + 2500 = +2500 M€. Os +4000 M€ resultariam de incluir a balança de capital, que não faz parte da balança corrente (4000 M€ é a capacidade de financiamento).' },

  { id: 'u10-14', u: 'u10', p: 'Num dado ano, a balança corrente de um país registou um saldo de −1200 M€ e a balança de capital um saldo de +1500 M€. Pode concluir-se que a economia',
    o: ['teve uma necessidade de financiamento de 2700 M€ face ao resto do mundo.', 'teve uma capacidade de financiamento de 300 M€ face ao resto do mundo.', 'teve uma necessidade de financiamento de 1200 M€ face ao resto do mundo.', 'registou um excedente da balança corrente de 300 M€.'],
    c: 1, e: 'Capacidade/necessidade de financiamento = saldo da balança corrente + saldo da balança de capital = −1200 + 1500 = +300 M€, ou seja, capacidade de financiamento. A balança corrente continua deficitária (−1200 M€); é a balança de capital que compensa esse défice.' },

  { id: 'u10-15', u: 'u10', p: 'Um país exportou bens no valor de 80 000 M€ e importou bens no valor de 100 000 M€. A taxa de cobertura das importações pelas exportações foi de',
    o: ['80%, o que indica um saldo negativo da balança de bens.', '125%, o que indica um saldo positivo da balança de bens.', '80%, o que indica um saldo positivo da balança de bens.', '20%, o que corresponde ao défice da balança de bens.'],
    c: 0, e: 'Taxa de cobertura = X ÷ M × 100 = 80 000 ÷ 100 000 × 100 = 80%. Sendo inferior a 100%, as exportações não pagam todas as importações e o saldo é negativo (−20 000 M€). Os 125% resultariam de inverter a fórmula (M ÷ X).' },

  { id: 'u10-16', u: 'u10', p: 'Num regime de câmbios fixos, as autoridades monetárias decidem reduzir o valor oficial da moeda nacional face às outras moedas. Esta decisão designa-se',
    o: ['depreciação, e tende a reduzir as exportações.', 'valorização, e tende a encarecer as exportações.', 'apreciação, e tende a aumentar as importações.', 'desvalorização, e tende a estimular as exportações.'],
    c: 3, e: 'A redução deliberada do valor da moeda num regime de câmbios fixos é uma desvalorização, que torna os bens nacionais mais baratos no estrangeiro e estimula as exportações. O termo depreciação refere-se à perda de valor resultante do mercado em câmbios flexíveis e, além disso, tenderia a aumentar, não a reduzir, as exportações.' },

  { id: 'u10-17', u: 'u10', p: 'Num país, as exportações foram de 90 mil M€, as importações de 95 mil M€ e o PIB de 250 mil M€. O grau de abertura, calculado como (X + M) ÷ PIB × 100, foi de',
    o: ['38%.', '2%.', '74%.', '135%.'],
    c: 2, e: 'Grau de abertura = (90 + 95) ÷ 250 × 100 = 185 ÷ 250 × 100 = 74%. O valor 2% corresponde ao saldo comercial (90 − 95 = −5) dividido pelo PIB, que mede o défice comercial e não a abertura da economia.' },

  { id: 'u10-18', u: 'u10', p: 'Uma apreciação do euro face ao dólar tende a',
    o: ['tornar as exportações da área do euro mais caras em dólares e as importações dos EUA mais baratas em euros.', 'tornar as exportações da área do euro mais baratas em dólares, estimulando-as.', 'encarecer as importações provenientes dos EUA, reduzindo-as.', 'não ter efeito sobre o comércio, porque os preços em euros não se alteram.'],
    c: 0, e: 'Com o euro mais forte, cada euro custa mais dólares: os bens europeus ficam mais caros para os compradores americanos (as exportações tendem a diminuir) e os bens americanos ficam mais baratos em euros (as importações tendem a aumentar). O efeito oposto verificar-se-ia com uma depreciação do euro.' },

  { id: 'u10-19', u: 'u10', p: 'A taxa de câmbio EUR/USD passou de 1,10 para 1,20 (dólares por euro). Uma garrafa de vinho do Porto que custa 20 € em Portugal passa a custar a um consumidor americano (sem outros custos)',
    o: ['22 dólares, pois o euro se depreciou.', '24 dólares, pois o euro se apreciou.', '16,67 dólares, pois o euro se apreciou.', '18 dólares, pois o dólar se apreciou.'],
    c: 1, e: 'Antes custava 20 × 1,10 = 22 dólares; agora custa 20 × 1,20 = 24 dólares. Como cada euro passou a valer mais dólares, o euro apreciou-se, o que encarece as exportações portuguesas para os EUA. Os 22 dólares correspondem ao preço à taxa antiga.' },

  { id: 'u10-20', u: 'u10', p: 'Qual das seguintes afirmações caracteriza corretamente o processo de globalização?',
    o: ['Traduziu-se numa diminuição do papel das empresas multinacionais na economia mundial.', 'Resultou sobretudo do aumento dos direitos aduaneiros e dos contingentes.', 'Intensificou os fluxos de bens, serviços, capitais e informação, favorecido pelas tecnologias de informação e comunicação.', 'Tornou as economias nacionais mais independentes umas das outras, reduzindo o contágio de crises.'],
    c: 2, e: 'A globalização é marcada pela intensificação e aceleração dos fluxos internacionais, apoiada nas TIC, na redução dos custos de transporte e na liberalização. Ao aumentar a interdependência, facilita o contágio de crises (como em 2008), em vez de o reduzir.' },

  /* ---------- u10 — A intervenção do Estado na economia ---------- */
  { id: 'u11-01', u: 'u11', p: 'A atribuição do Rendimento Social de Inserção a famílias em situação de pobreza enquadra-se na função de',
    o: ['afetação de recursos.', 'estabilização da economia.', 'regulação dos mercados.', 'redistribuição do rendimento.'],
    c: 3, e: 'O RSI transfere rendimento para as famílias mais pobres, reduzindo desigualdades — função de redistribuição. A função de afetação diz respeito à utilização dos recursos na produção de bens que o mercado não fornece adequadamente, como a defesa.' },

  { id: 'u11-02', u: 'u11', p: 'Quando o Estado assegura a defesa nacional e a justiça, está sobretudo a exercer a função de',
    o: ['afetação de recursos.', 'redistribuição do rendimento.', 'estabilização da economia.', 'controlo da política monetária.'],
    c: 0, e: 'Defesa e justiça são bens públicos que o mercado não produziria em quantidade adequada; o Estado afeta recursos à sua produção. Não se trata de redistribuição, porque o objetivo principal não é alterar a repartição do rendimento.' },

  { id: 'u11-03', u: 'u11', p: 'Perante uma forte recessão, o Governo decide aumentar o investimento público em infraestruturas para estimular a atividade e o emprego. Esta medida ilustra a função de',
    o: ['redistribuição.', 'estabilização.', 'afetação monetária.', 'regulação da concorrência.'],
    c: 1, e: 'A função de estabilização procura atenuar as flutuações da atividade (desemprego, inflação), estimulando a procura em recessão. Embora as infraestruturas também tenham uma dimensão de afetação, o objetivo explícito aqui é combater a recessão.' },

  { id: 'u11-04', u: 'u11', p: 'A iluminação pública é considerada um bem público porque',
    o: ['é sempre produzida por empresas públicas.', 'o seu preço é fixado pelo Estado.', 'é não rival e não exclusiva no consumo.', 'só pode ser consumida por quem paga impostos.'],
    c: 2, e: 'Um bem público caracteriza-se pela não rivalidade (o uso por uma pessoa não reduz o dos outros) e pela não exclusão (não se consegue impedir quem não paga de beneficiar). O que o define são estas características, não o facto de ser produzido por uma empresa pública.' },

  { id: 'u11-05', u: 'u11', p: 'Uma fábrica descarrega resíduos num rio, prejudicando os pescadores a jusante, sem os compensar. Nesta situação,',
    o: ['existe uma externalidade positiva, e o Estado deve subsidiar a fábrica.', 'não há falha de mercado, porque os preços refletem todos os custos.', 'existe um monopólio natural, que o Estado deve nacionalizar.', 'existe uma externalidade negativa, e o Estado pode aplicar um imposto ou regras ambientais.'],
    c: 3, e: 'A poluição impõe custos a terceiros que não se refletem no preço do produto: é uma externalidade negativa, que leva o mercado a produzir demasiado. O Estado pode corrigi-la com impostos, multas ou regulamentação. Subsidiar seria adequado para externalidades positivas.' },

  { id: 'u11-06', u: 'u11', p: 'O Estado financia a vacinação gratuita da população porque, entre outras razões,',
    o: ['a vacinação gera externalidades positivas, e o mercado, por si só, levaria a um nível de vacinação inferior ao socialmente desejável.', 'a vacinação é um bem rival e exclusivo, pelo que as empresas privadas não a conseguem vender.', 'a vacinação gera externalidades negativas que é necessário compensar.', 'as vacinas são bens intermédios que não entram no PIB.'],
    c: 0, e: 'Quem se vacina protege também os outros (benefício externo), mas cada pessoa só tem em conta o seu próprio benefício, pelo que o mercado produziria vacinação a menos. Uma vacina, sendo rival e exclusiva, pode ser vendida no mercado; o problema está no benefício externo, não na impossibilidade de venda.' },

  { id: 'u11-07', u: 'u11', p: 'A obrigatoriedade de indicar a composição e o prazo de validade nos rótulos dos alimentos pretende corrigir uma falha de mercado relacionada com',
    o: ['a existência de bens públicos.', 'a informação imperfeita ou assimétrica.', 'as externalidades negativas da produção.', 'o poder de monopólio dos produtores.'],
    c: 1, e: 'O produtor conhece melhor o produto do que o consumidor; a rotulagem obrigatória reduz esta assimetria de informação. Não se trata de um bem público: os alimentos são bens rivais e exclusivos.' },

  { id: 'u11-08', u: 'u11', p: 'São exemplos de impostos indiretos',
    o: ['o IRS e o IRC.', 'o IRC e o IVA.', 'o IVA e o imposto sobre produtos petrolíferos.', 'o IRS e as contribuições para a Segurança Social.'],
    c: 2, e: 'Os impostos indiretos incidem sobre o consumo ou a despesa, como o IVA e o ISP. O IRS e o IRC incidem sobre o rendimento (de pessoas e empresas) e são impostos diretos.' },

  { id: 'u11-09', u: 'u11', p: 'Diz-se que o IRS é um imposto progressivo porque',
    o: ['o seu valor aumenta todos os anos com a inflação.', 'todos os contribuintes pagam a mesma percentagem do seu rendimento.', 'incide sobre o consumo das famílias com rendimentos mais elevados.', 'a taxa média de imposto aumenta à medida que o rendimento aumenta.'],
    c: 3, e: 'Num imposto progressivo, quem tem mais rendimento paga uma percentagem maior desse rendimento, o que contribui para a redistribuição. Se todos pagassem a mesma percentagem, o imposto seria proporcional, não progressivo.' },

  { id: 'u11-10', u: 'u11', p: 'Qual das seguintes despesas do Estado é uma despesa de capital?',
    o: ['A construção de um novo hospital.', 'O pagamento dos salários dos médicos do Serviço Nacional de Saúde.', 'O pagamento de juros da dívida pública.', 'O pagamento de pensões de reforma.'],
    c: 0, e: 'As despesas de capital aumentam o capital fixo do país, como a construção de hospitais, escolas e estradas. Salários, juros e pensões repetem-se todos os anos e não criam capital, sendo despesas correntes.' },

  { id: 'u11-11', u: 'u11', p: 'Num dado ano, as receitas efetivas do Estado foram de 90 mil M€ e as despesas efetivas de 95 mil M€, com um PIB de 200 mil M€. O saldo orçamental foi',
    o: ['um excedente de 5 mil M€, ou seja, 2,5% do PIB.', 'um défice de 5 mil M€, ou seja, 2,5% do PIB.', 'um défice de 5 mil M€, ou seja, 5% do PIB.', 'um défice de 95 mil M€, ou seja, 47,5% do PIB.'],
    c: 1, e: 'Saldo = receitas − despesas = 90 − 95 = −5 mil M€ (défice); em % do PIB: 5 ÷ 200 × 100 = 2,5%. O valor de 5% resultaria de dividir o défice por 100 em vez de pelo PIB; e o saldo não pode ser excedentário, pois as despesas superaram as receitas.' },

  { id: 'u11-12', u: 'u11', p: 'Um país registou um saldo orçamental de −4 mil M€, tendo pago 6 mil M€ de juros da dívida pública. O seu saldo primário foi de',
    o: ['−10 mil M€.', '−2 mil M€.', '+2 mil M€.', '+6 mil M€.'],
    c: 2, e: 'Saldo primário = saldo orçamental + juros = −4 + 6 = +2 mil M€: sem os encargos com juros, as receitas teriam superado as despesas. O valor de −10 mil M€ resultaria de subtrair os juros, quando o objetivo é precisamente excluí-los da despesa.' },

  { id: 'u11-13', u: 'u11', p: 'Quando o Estado regista um défice orçamental e o financia através da emissão de obrigações do Tesouro,',
    o: ['o montante da dívida pública diminui.', 'o défice é convertido em excedente no ano seguinte.', 'o montante da dívida pública mantém-se, porque o défice é anual.', 'o montante da dívida pública aumenta.'],
    c: 3, e: 'O défice é financiado com novos empréstimos, que se acumulam no stock de dívida; por isso a dívida aumenta. O facto de o défice ser um fluxo anual não impede essa acumulação: é precisamente a soma dos défices que faz crescer a dívida.' },

  { id: 'u11-14', u: 'u11', p: 'Um país tinha uma dívida pública de 270 mil M€ e um PIB nominal de 300 mil M€. No ano seguinte teve um défice de 6 mil M€ (financiado com nova dívida) e o PIB nominal subiu para 315 mil M€. O rácio da dívida pública no PIB',
    o: ['desceu de 90% para cerca de 87,6%, apesar do défice.', 'subiu de 90% para cerca de 92%, devido ao défice.', 'manteve-se em 90%, porque a dívida e o PIB aumentaram.', 'desceu de 90% para cerca de 85,7%, porque o PIB cresceu 5%.'],
    c: 0, e: 'Rácio inicial = 270 ÷ 300 = 90%; nova dívida = 270 + 6 = 276; novo rácio = 276 ÷ 315 ≈ 87,6%. A dívida aumentou em montante, mas menos (≈ 2,2%) do que o PIB nominal (5%). O valor 85,7% (270 ÷ 315) esquece que o défice aumenta a dívida.' },

  { id: 'u11-15', u: 'u11', p: 'Constitui uma medida de política orçamental expansionista',
    o: ['o aumento das taxas de IVA.', 'a redução das taxas de IRS.', 'a subida das taxas de juro diretoras pelo BCE.', 'o corte no investimento público.'],
    c: 1, e: 'Uma política orçamental expansionista reduz impostos e/ou aumenta a despesa pública, estimulando a procura; baixar o IRS aumenta o rendimento disponível das famílias. A subida das taxas de juro é uma medida de política monetária (e restritiva), não orçamental.' },

  { id: 'u11-16', u: 'u11', p: 'Na área do euro, a política monetária aplicada em Portugal é',
    o: ['definida pelo Banco de Portugal, de acordo com a situação da economia portuguesa.', 'definida pelo Governo português, com aprovação da Assembleia da República.', 'definida pelo Banco Central Europeu, para o conjunto da área do euro.', 'definida pela Comissão Europeia, através do Orçamento da UE.'],
    c: 2, e: 'Com a adesão ao euro, a política monetária passou a ser única e é decidida pelo BCE para todos os países da área do euro; o Banco de Portugal participa no Eurosistema, mas não a define autonomamente. A Comissão Europeia não tem competências de política monetária.' },

  { id: 'u11-17', u: 'u11', p: 'Perante uma inflação muito acima de 2%, o BCE decide subir as taxas de juro diretoras. O efeito esperado é',
    o: ['o crédito ficar mais barato, estimulando o consumo e o investimento.', 'o aumento da quantidade de moeda em circulação e dos preços.', 'o aumento das despesas públicas e da procura agregada.', 'o crédito ficar mais caro, reduzindo o consumo e o investimento e, assim, a pressão sobre os preços.'],
    c: 3, e: 'Taxas diretoras mais altas encarecem o crédito, o que reduz a procura de bens de consumo e de investimento e ajuda a travar a inflação: trata-se de política monetária restritiva. Crédito mais barato seria o efeito de uma descida das taxas, ou seja, de uma política expansionista.' },

  { id: 'u11-18', u: 'u11', p: 'Qual das seguintes medidas é um exemplo de política estrutural?',
    o: ['Um programa de longo prazo para melhorar a qualificação e a formação profissional dos trabalhadores.', 'Uma redução temporária do IVA para relançar o consumo durante uma recessão.', 'Uma descida das taxas de juro diretoras para estimular o crédito.', 'Um aumento pontual do investimento público para combater o desemprego conjuntural.'],
    c: 0, e: 'As políticas estruturais atuam a médio e longo prazo sobre a capacidade produtiva (qualificações, inovação, instituições), aumentando o crescimento potencial. As restantes medidas procuram estabilizar a atividade no curto prazo, sendo políticas conjunturais.' },

  { id: 'u11-19', u: 'u11', p: 'Os subsídios de desemprego funcionam como estabilizadores automáticos porque',
    o: ['são decididos pelo Governo sempre que o desemprego ultrapassa um certo limite.', 'aumentam automaticamente numa recessão, sustentando o rendimento e a procura sem nova decisão política.', 'reduzem o défice orçamental em períodos de recessão.', 'diminuem automaticamente quando a economia entra em recessão.'],
    c: 1, e: 'Numa recessão, mais pessoas ficam desempregadas e a despesa com subsídios sobe por si, amortecendo a quebra do rendimento e da procura, sem necessidade de nova medida. Por isso, estes estabilizadores tendem a agravar (não a reduzir) o défice em recessão.' },

  { id: 'u11-20', u: 'u11', p: 'Um Governo aplica uma política orçamental fortemente expansionista para reduzir o desemprego. Um possível efeito negativo desta política sobre outro objetivo da política económica é',
    o: ['a descida da taxa de inflação abaixo do objetivo.', 'a melhoria automática do saldo da balança corrente.', 'o agravamento do saldo externo, devido ao aumento das importações.', 'a redução do défice orçamental e da dívida pública.'],
    c: 2, e: 'O aumento da procura estimula também as importações, podendo deteriorar o saldo da balança corrente (conflito entre emprego e equilíbrio externo), além de poder aumentar a inflação. A inflação tenderia a subir, e não a descer, com mais procura; e a política expansionista agrava, em regra, o défice.' },

  /* ---------- u11 — A economia portuguesa no contexto da União Europeia ---------- */
  { id: 'u12-01', u: 'u12', p: 'Uma união aduaneira distingue-se de uma zona de comércio livre porque',
    o: ['permite a livre circulação de trabalhadores e capitais.', 'adota uma moeda única e uma política monetária comum.', 'elimina as barreiras alfandegárias entre os países membros.', 'estabelece uma pauta aduaneira exterior comum face a países terceiros.'],
    c: 3, e: 'Ambas eliminam as barreiras ao comércio entre membros, mas na união aduaneira todos aplicam a mesma pauta face ao exterior; na zona de comércio livre, cada país mantém a sua. A livre circulação de fatores caracteriza o mercado comum, uma etapa posterior.' },

  { id: 'u12-02', u: 'u12', p: 'A passagem de uma união aduaneira a um mercado comum implica',
    o: ['a livre circulação dos fatores produtivos, como o trabalho e o capital.', 'a criação de uma pauta aduaneira comum face a países terceiros.', 'a adoção de uma moeda única.', 'a abolição dos direitos aduaneiros entre os países membros.'],
    c: 0, e: 'O mercado comum acrescenta à união aduaneira a livre circulação de fatores produtivos. A pauta exterior comum já existe na união aduaneira, e a moeda única só surge na união económica e monetária.' },

  { id: 'u12-03', u: 'u12', p: 'Qual das seguintes sequências apresenta as formas de integração económica por ordem crescente de profundidade?',
    o: ['União aduaneira, zona de comércio livre, mercado comum, união económica e monetária.', 'Zona de comércio livre, união aduaneira, mercado comum, união económica e monetária.', 'Zona de comércio livre, mercado comum, união aduaneira, união económica e monetária.', 'Mercado comum, zona de comércio livre, união aduaneira, união económica e monetária.'],
    c: 1, e: 'Cada etapa acrescenta algo à anterior: comércio livre entre membros, depois pauta externa comum, depois livre circulação de fatores, depois coordenação de políticas e moeda única. O mercado comum pressupõe a pauta exterior comum, por isso não pode vir antes da união aduaneira.' },

  { id: 'u12-04', u: 'u12', p: 'A Comunidade Económica Europeia (CEE) foi criada em 1957 pelo',
    o: ['Tratado de Maastricht.', 'Tratado de Lisboa.', 'Tratado de Roma.', 'Ato Único Europeu.'],
    c: 2, e: 'Os Tratados de Roma (1957) criaram a CEE e a Euratom, com o objetivo de estabelecer um mercado comum. O Tratado de Maastricht (1992) criou a União Europeia e lançou a UEM.' },

  { id: 'u12-05', u: 'u12', p: 'Portugal tornou-se membro das Comunidades Europeias em',
    o: ['1973, em conjunto com o Reino Unido.', '1981, em conjunto com a Grécia.', '1992, com a assinatura do Tratado de Maastricht.', '1986, em conjunto com a Espanha.'],
    c: 3, e: 'Portugal e Espanha aderiram a 1 de janeiro de 1986, depois de assinado o tratado de adesão em 1985. Em 1973 aderiram o Reino Unido, a Irlanda e a Dinamarca, e em 1981 a Grécia.' },

  { id: 'u12-06', u: 'u12', p: 'Antes de aderir às Comunidades Europeias, Portugal integrava',
    o: ['a EFTA, uma zona de comércio livre de que foi membro fundador em 1960.', 'a CECA, como membro fundador em 1951.', 'a união aduaneira da CEE, sem participar nas suas instituições.', 'a União Económica e Monetária, sem moeda única.'],
    c: 0, e: 'Portugal foi membro fundador da EFTA (Associação Europeia de Comércio Livre), criada em 1960, que é uma zona de comércio livre. A CECA foi fundada em 1951 por seis países (França, RFA, Itália e Benelux), sem Portugal.' },

  { id: 'u12-07', u: 'u12', p: 'O Ato Único Europeu, que entrou em vigor em 1987, teve como principal objetivo',
    o: ['criar a moeda única europeia.', 'concretizar o mercado único até 1 de janeiro de 1993.', 'fundar a Comunidade Europeia do Carvão e do Aço.', 'estabelecer os critérios de convergência nominal.'],
    c: 1, e: 'O Ato Único Europeu relançou a integração com o objetivo de completar o mercado interno (livre circulação de pessoas, mercadorias, serviços e capitais), realizado em 1993. A moeda única e os critérios de convergência resultam do Tratado de Maastricht.' },

  { id: 'u12-08', u: 'u12', p: 'O Tratado de Maastricht (1992)',
    o: ['criou a CEE e a pauta aduaneira comum.', 'determinou a saída do Reino Unido da União.', 'criou a União Europeia e definiu as etapas e os critérios para a União Económica e Monetária.', 'instituiu a Política Agrícola Comum.'],
    c: 2, e: 'Maastricht criou a União Europeia, instituiu a cidadania europeia e fixou o calendário e os critérios de convergência para a UEM e o euro. A CEE e o projeto de pauta aduaneira comum vêm do Tratado de Roma de 1957.' },

  { id: 'u12-09', u: 'u12', p: 'Na União Europeia, a instituição que detém, em regra, o poder de iniciativa legislativa (propor nova legislação) é',
    o: ['o Parlamento Europeu.', 'o Conselho Europeu.', 'o Tribunal de Justiça da União Europeia.', 'a Comissão Europeia.'],
    c: 3, e: 'A Comissão Europeia propõe a legislação, executa o orçamento e zela pelo cumprimento dos tratados. O Parlamento Europeu aprova a legislação em conjunto com o Conselho da UE, mas, em regra, não a propõe.' },

  { id: 'u12-10', u: 'u12', p: 'O Parlamento Europeu',
    o: ['é eleito por sufrágio universal direto e partilha o poder legislativo e orçamental com o Conselho da UE.', 'é composto pelos chefes de Estado ou de Governo dos Estados-membros.', 'é composto por deputados nomeados pelos parlamentos nacionais, sem poder legislativo.', 'é responsável pela política monetária da área do euro.'],
    c: 0, e: 'Desde 1979 os deputados europeus são eleitos diretamente pelos cidadãos, por 5 anos, e o Parlamento aprova a legislação e o orçamento com o Conselho da UE. A reunião dos chefes de Estado ou de Governo corresponde ao Conselho Europeu.' },

  { id: 'u12-11', u: 'u12', p: 'O Conselho Europeu',
    o: ['reúne os ministros de cada Estado-membro e aprova a legislação com o Parlamento Europeu.', 'reúne os chefes de Estado ou de Governo e define as orientações e prioridades políticas gerais da UE.', 'é um órgão do Conselho da Europa responsável pelos direitos humanos.', 'é composto por um comissário de cada Estado-membro e executa o orçamento.'],
    c: 1, e: 'O Conselho Europeu reúne os líderes (chefes de Estado ou de Governo), o seu presidente e a presidente da Comissão, e define a orientação política geral, sem funções legislativas. Os ministros que legislam com o Parlamento formam o Conselho da UE, uma instituição diferente.' },

  { id: 'u12-12', u: 'u12', p: 'O objetivo principal do Banco Central Europeu é',
    o: ['assegurar o pleno emprego em todos os países da área do euro.', 'financiar os défices orçamentais dos Estados-membros.', 'manter a estabilidade de preços na área do euro.', 'fixar as taxas de IVA aplicadas em cada Estado-membro.'],
    c: 2, e: 'O mandato principal do BCE é a estabilidade de preços, com um objetivo de inflação de 2% no médio prazo. O BCE está proibido de financiar diretamente os défices dos Estados, e a fiscalidade é da competência de cada país.' },

  { id: 'u12-13', u: 'u12', p: 'Um país da UE que pretende adotar o euro apresenta um défice orçamental de 2,5% do PIB, uma dívida pública de 55% do PIB e uma inflação 4 pontos percentuais acima da média dos três Estados-membros com melhores resultados. Face aos critérios de convergência, este país',
    o: ['cumpre todos os critérios orçamentais e de preços, podendo adotar o euro.', 'não cumpre o critério do défice, que não pode ultrapassar 2% do PIB.', 'não cumpre o critério da dívida, que não pode ultrapassar 50% do PIB.', 'não cumpre o critério da estabilidade de preços, que admite no máximo 1,5 pontos percentuais acima dessa média.'],
    c: 3, e: 'O défice (2,5%) está abaixo do limite de 3% e a dívida (55%) abaixo de 60%, mas a inflação excede em mais de 1,5 pontos percentuais a média dos três melhores. Os limites de 2% para o défice e 50% para a dívida não existem nos critérios de Maastricht.' },

  { id: 'u12-14', u: 'u12', p: 'O Pacto de Estabilidade e Crescimento tem como objetivo principal',
    o: ['assegurar a disciplina orçamental dos Estados-membros depois da adoção do euro.', 'distribuir os fundos estruturais pelas regiões menos desenvolvidas.', 'fixar as taxas de juro diretoras da área do euro.', 'eliminar as barreiras alfandegárias entre os Estados-membros.'],
    c: 0, e: 'O PEC (1997) prolonga a disciplina orçamental exigida pelos critérios de convergência, com as referências de 3% (défice) e 60% (dívida) e o procedimento por défices excessivos. As taxas de juro diretoras são fixadas pelo BCE, não pelo PEC.' },

  { id: 'u12-15', u: 'u12', p: 'Com a participação de Portugal na área do euro, perante um choque que afete apenas a economia portuguesa, o principal instrumento de política económica de curto prazo que permanece sob controlo nacional é',
    o: ['a política cambial, através da desvalorização do escudo.', 'a política orçamental, dentro dos limites das regras europeias.', 'a política monetária, através das taxas de juro fixadas pelo Banco de Portugal.', 'a política aduaneira, através de direitos sobre as importações da UE.'],
    c: 1, e: 'Com o euro, Portugal perdeu a política monetária e cambial, que passaram para o BCE/UE; resta-lhe sobretudo a política orçamental, condicionada pelas regras do PEC. A política aduaneira também não é nacional: há livre comércio na UE e uma pauta exterior comum.' },

  { id: 'u12-16', u: 'u12', p: 'Uma das vantagens da moeda única para as empresas portuguesas que exportam para outros países da área do euro é',
    o: ['a possibilidade de desvalorizar a moeda para ganhar competitividade.', 'a proteção face à concorrência das empresas de outros Estados-membros.', 'a eliminação dos custos de conversão de moeda e do risco cambial nessas trocas.', 'a fixação de taxas de juro diferentes para cada país de acordo com as suas necessidades.'],
    c: 2, e: 'Com a mesma moeda, deixa de haver custos de câmbio e incerteza quanto à taxa de câmbio nas trocas dentro da área do euro. A possibilidade de desvalorizar foi, pelo contrário, perdida com a adesão ao euro.' },

  { id: 'u12-17', u: 'u12', p: 'A política de coesão da União Europeia, financiada pelos fundos estruturais e de investimento, tem como objetivo principal',
    o: ['garantir preços mínimos aos produtos agrícolas europeus.', 'financiar a política monetária do BCE.', 'aumentar as receitas aduaneiras da União.', 'reduzir as disparidades de desenvolvimento entre as regiões da União.'],
    c: 3, e: 'A política de coesão (FEDER, FSE+, Fundo de Coesão) apoia as regiões e países menos desenvolvidos, promovendo a convergência económica, social e territorial. A garantia de rendimentos aos agricultores é um objetivo da Política Agrícola Comum.' },

  { id: 'u12-18', u: 'u12', p: 'A Política Agrícola Comum (PAC), criada em 1962, tem entre os seus objetivos',
    o: ['assegurar um nível de vida digno aos agricultores e garantir o abastecimento a preços razoáveis.', 'fixar a taxa de câmbio do euro face às moedas dos países exportadores de produtos agrícolas.', 'financiar a construção de autoestradas nas regiões rurais através do Fundo de Coesão.', 'proibir as importações de produtos agrícolas de países terceiros.'],
    c: 0, e: 'A PAC visa aumentar a produtividade agrícola, assegurar rendimentos aos agricultores, estabilizar mercados e garantir o abastecimento a preços razoáveis, hoje com fortes preocupações ambientais. Não proíbe as importações de países terceiros: estas estão sujeitas à pauta exterior comum e às regras da OMC.' },

  { id: 'u12-19', u: 'u12', p: 'O Plano de Recuperação e Resiliência (PRR) português',
    o: ['é financiado exclusivamente por receitas de impostos nacionais.', 'é financiado pelo instrumento europeu NextGenerationEU e organiza-se nas dimensões resiliência, transição climática e transição digital.', 'substituiu definitivamente a política de coesão e os fundos estruturais.', 'foi criado em 1986 para apoiar a adesão de Portugal à CEE.'],
    c: 1, e: 'O PRR resulta do NextGenerationEU, criado pela UE após a pandemia de COVID-19, combinando subvenções e empréstimos para investimentos e reformas até 2026. Não substitui a política de coesão, que continua através do Portugal 2030.' },

  { id: 'u12-20', u: 'u12', p: 'Atualmente, a principal fonte de receita do orçamento da União Europeia é',
    o: ['os direitos aduaneiros cobrados nas fronteiras externas da União.', 'uma percentagem do IVA cobrado em cada Estado-membro.', 'o recurso próprio baseado no Rendimento Nacional Bruto de cada Estado-membro.', 'os impostos sobre o rendimento pagos diretamente pelos cidadãos europeus à UE.'],
    c: 2, e: 'O recurso baseado no RNB, proporcional à riqueza de cada Estado-membro, é de longe a maior fonte de receita do orçamento da UE. Os direitos aduaneiros (recursos próprios tradicionais) e o recurso IVA têm um peso muito menor; e não existe um imposto sobre o rendimento cobrado diretamente pela UE aos cidadãos.' }
);
