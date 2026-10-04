/* ============================================================
   mariaestuda — recetor das respostas do inquérito (/inquerito)

   Projeto Apps Script na pasta FCH - UCP do Drive, ligado à
   Google Sheet "Inquérito Joana Vasconcelos · respostas" pelo ID
   em FOLHA, e publicado como aplicação web: executar como "Eu",
   acesso "Qualquer pessoa".
   Esta cópia no repositório é só para referência.

   Cada envio acrescenta uma linha à primeira folha. A ordem das
   colunas é a de CAMPOS e tem de bater com o cabeçalho da linha 1.
   ============================================================ */

const FOLHA = '1DGzmx4M_MdWZvOnAWtuv3qZ7vevda35nKhdFOPsYEmA';

const CAMPOS = [
  'idioma', 'idade', 'escolaridade', 'residencia', 'companhia',
  'frequencia_anual', 'ja_visitou', 'como_soube', 'motivo', 'canais_usados',
  'aval_textos', 'aval_orientacao', 'aval_audioguia', 'aval_visita_guiada',
  'aval_pessoal', 'aval_loja', 'mais_gostou', 'aprendeu_1a5',
  'percecao_artista_1a5', 'recomenda_0a10', 'publico_ou_utilizador', 'o_que_mudaria'
];

function doPost(e) {
  try {
    const corpo = e && e.postData ? e.postData.contents : '';
    if (!corpo || corpo.length > 8000) return responder({ok: false, erro: 'tamanho'});
    const r = JSON.parse(corpo);

    const linha = [Utilities.formatDate(new Date(), 'Europe/Lisbon', 'yyyy-MM-dd HH:mm:ss')]
      .concat(CAMPOS.map(c => celula(r[c])));

    // dois envios ao mesmo tempo não podem escrever na mesma linha
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      SpreadsheetApp.openById(FOLHA).getSheets()[0].appendRow(linha);
    } finally {
      lock.releaseLock();
    }
    return responder({ok: true});
  } catch (err) {
    return responder({ok: false, erro: String(err)});
  }
}

// listas viram texto separado por "; ", números inteiros ficam números,
// e texto livre que comece por = + - @ não pode virar fórmula
function celula(v) {
  if (Array.isArray(v)) v = v.join('; ');
  if (v === undefined || v === null) return '';
  v = String(v).slice(0, 1000);
  if (/^\d{1,2}$/.test(v)) return Number(v);
  if (/^[=+\-@]/.test(v)) return "'" + v;
  return v;
}

function responder(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
