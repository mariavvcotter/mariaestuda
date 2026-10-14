<?php
// guardar.php: recebe uma resposta do inquérito e grava-a na base de dados.
// Responde sempre em JSON: {"ok":true} ou {"ok":false,"erro":"..."}.

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
// Só se a página e este ficheiro estiverem em domínios diferentes (ver o guia, passo 4):
// header('Access-Control-Allow-Origin: https://mariaestuda.eu');

function sair($resposta, $codigo = 200) {
    http_response_code($codigo);
    echo json_encode($resposta, JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') sair(['ok' => false, 'erro' => 'metodo'], 405);

$corpo = file_get_contents('php://input', false, null, 0, 8001);
if ($corpo === false || $corpo === '' || strlen($corpo) > 8000) sair(['ok' => false, 'erro' => 'tamanho'], 413);

$r = json_decode($corpo, true);
if (!is_array($r)) sair(['ok' => false, 'erro' => 'json'], 400);

// Valores aceites, exatamente como estão nos value="" do formulário.
$AVAL = ['1', '2', '3', '4', '5', 'Não usei'];
$OPCOES = [
    'idioma'                => ['pt', 'en'],
    'idade'                 => ['Menos de 18', '18–24', '25–34', '35–44', '45–54', '55–64', '65 ou mais'],
    'escolaridade'          => ['Até ao 9.º ano', 'Ensino secundário', 'Licenciatura', 'Mestrado ou doutoramento'],
    'residencia'            => ['Reside em Portugal', 'Turista'],
    'companhia'             => ['Sozinho/a', 'Família', 'Amigos', 'Grupo organizado'],
    'frequencia_anual'      => ['Menos de 1', '1 a 2', '3 a 5', '6 ou mais'],
    'ja_visitou'            => ['Sim', 'Não'],
    'motivo'                => ['A artista', 'A exposição', 'O espaço', 'Recomendação', 'Outro'],
    'aval_textos'           => $AVAL,
    'aval_orientacao'       => $AVAL,
    'aval_audioguia'        => $AVAL,
    'aval_visita_guiada'    => $AVAL,
    'aval_pessoal'          => $AVAL,
    'aval_loja'             => $AVAL,
    'aprendeu_1a5'          => ['1', '2', '3', '4', '5'],
    'percecao_artista_1a5'  => ['1', '2', '3', '4', '5'],
    'recomenda_0a10'        => ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    'publico_ou_utilizador' => ['Público', 'Utilizador', 'Não sei'],
];
$LISTAS = [
    'como_soube'    => ['Website do museu', 'Redes sociais', 'Cartaz, mupi ou banner', 'Metro ou transportes', 'Imprensa', 'Boca a boca', 'Outro'],
    'canais_usados' => ['Website', 'App', 'Redes sociais', 'Nenhum'],
];
$TEXTOS = ['mais_gostou', 'o_que_mudaria'];
$INTEIROS = ['aprendeu_1a5', 'percecao_artista_1a5', 'recomenda_0a10'];

$linha = [];
foreach ($OPCOES as $campo => $aceites) {
    $v = isset($r[$campo]) ? $r[$campo] : null;
    if (!is_string($v) || !in_array($v, $aceites, true)) sair(['ok' => false, 'erro' => $campo], 422);
    $linha[$campo] = in_array($campo, $INTEIROS, true) ? (int) $v : $v;
}
foreach ($LISTAS as $campo => $aceites) {
    $v = isset($r[$campo]) ? $r[$campo] : null;
    if (!is_array($v) || !$v) sair(['ok' => false, 'erro' => $campo], 422);
    foreach ($v as $item) {
        if (!is_string($item) || !in_array($item, $aceites, true)) sair(['ok' => false, 'erro' => $campo], 422);
    }
    $linha[$campo] = implode('; ', array_unique($v));
}
foreach ($TEXTOS as $campo) {
    $v = isset($r[$campo]) ? $r[$campo] : '';
    if (!is_string($v)) sair(['ok' => false, 'erro' => $campo], 422);
    $v = trim(mb_substr($v, 0, 600));
    // texto que comece por = + - @ viraria fórmula ao abrir o CSV no Excel
    if (preg_match('/^[=+\-@]/u', $v)) $v = "'" . $v;
    $linha[$campo] = $v === '' ? null : $v;
}
$linha['criado_em'] = (new DateTime('now', new DateTimeZone('Europe/Lisbon')))->format('Y-m-d H:i:s');

// Credenciais fora da pasta pública (ver o guia, passo 2).
$cfg = require __DIR__ . '/../../inquerito-config.php';

try {
    $db = new PDO($cfg['dsn'], $cfg['utilizador'], $cfg['palavra_passe'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]);
    $colunas = array_keys($linha);
    $sql = 'INSERT INTO inquerito_respostas (' . implode(', ', $colunas) . ') VALUES (:' . implode(', :', $colunas) . ')';
    $db->prepare($sql)->execute($linha);
} catch (Exception $e) {
    error_log('inquerito: ' . $e->getMessage());
    sair(['ok' => false, 'erro' => 'base de dados'], 500);
}

sair(['ok' => true]);
