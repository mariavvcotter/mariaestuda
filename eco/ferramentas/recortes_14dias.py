"""Recorta dos PDF "14 Dias" a imagem do documento de apoio (tabela, gráfico)
de cada pergunta que depende dele, e acrescenta o caminho ao JSON.

Recorta do número da pergunta até à opção (A) (ou até à primeira alínea,
N.1., quando o documento é partilhado por várias). Se o bloco passar de uma
página para a seguinte, sai uma imagem por página.

  python3 eco/ferramentas/recortes_14dias.py PASTA_PDF PASTA_JSON PASTA_IMAGENS
"""
import json, re, sys, pathlib, pymupdf

TOPO, FUNDO, X0, X1 = 60, 770, 80, 518   # margens úteis das páginas do 14 Dias

def linhas(doc):
    out = []
    for i, pg in enumerate(doc):
        for b in pg.get_text('dict')['blocks']:
            for l in b.get('lines', []):
                t = ''.join(s['text'] for s in l['spans']).strip()
                if t and TOPO < l['bbox'][1] < FUNDO:
                    out.append((i, l['bbox'][0], l['bbox'][1], t))
    out.sort(key=lambda x: (x[0], x[2], x[1]))
    return out

def recorta(doc, ini, fim, destino, zoom=2.0):
    """Da linha ini (inclusive) até à linha fim (exclusive)."""
    (p0, _, y0, _), (p1, _, y1, _) = ini, fim
    partes = [(p0, y0 - 4, (y1 - 4) if p1 == p0 else FUNDO)]
    for p in range(p0 + 1, p1 + 1):
        partes.append((p, TOPO, (y1 - 4) if p == p1 else FUNDO))
    ficheiros = []
    for k, (p, a, b) in enumerate(partes):
        if b - a < 14: continue
        pix = doc[p].get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), clip=pymupdf.Rect(X0, a, X1, b), colorspace=pymupdf.csGRAY)   # os exames são a preto e branco
        nome = destino.with_name(destino.stem + (f'-{k + 1}' if len(partes) > 1 else '') + '.jpg')
        pix.save(nome, jpg_quality=72); ficheiros.append(nome)
    return ficheiros

def main(pasta_pdf, pasta_json, pasta_img):
    pasta_img = pathlib.Path(pasta_img); pasta_img.mkdir(parents=True, exist_ok=True)
    for js in sorted(pathlib.Path(pasta_json).glob('u*.json')):
        u = js.stem[1:]
        pdf = [p for p in pathlib.Path(pasta_pdf).glob(f'*14-Dias-U.{u}.-Itens-de-Selecao-Exercicios-de-Exame.pdf')]
        if not pdf: print(f'U{u}: sem PDF'); continue
        doc, qs = pymupdf.open(pdf[0]), json.loads(js.read_text())
        L = linhas(doc); pos = 0; feitas = 0; falhas = []
        vistos = {}
        for q in qs:
            if 'erro' in q: continue
            n = str(q['n']); top = n.split('.')[0]
            precisa = bool(q.get('ctx')) or q.get('grafico') or re.search(r'\b(Tabela|Quadro|Gráfico|Figura)\s*\d', q['p'])
            # avança sempre pelo documento, para as perguntas seguintes não se enganarem
            ini = next((i for i in range(pos, len(L)) if L[i][1] < 115 and L[i][3].startswith(top + '. ')), None)
            if ini is None:
                falhas.append(n); continue
            if '.' in n:
                fim = next((i for i in range(ini + 1, len(L)) if L[i][1] < 125 and L[i][3].startswith(top + '.1.')), None)
            else:
                fim = next((i for i in range(ini + 1, len(L)) if L[i][3].startswith('(A)')), None)
            pos = ini if '.' in n else (fim or ini)
            if not precisa: continue
            if fim is None: falhas.append(n); continue
            if '.' in n and top in vistos:
                q['img'] = vistos[top]; continue
            dest = pasta_img / f'u{u}-{top}.jpg'
            fs = recorta(doc, L[ini], L[fim], dest)
            q['img'] = [f'img/perguntas/{f.name}' for f in fs]
            if '.' in n: vistos[top] = q['img']
            feitas += 1
        js.write_text(json.dumps(qs, ensure_ascii=False, indent=1))
        print(f'U{u}: {feitas} recortes · não localizadas: {falhas}')

if __name__ == '__main__':
    main(*sys.argv[1:4])
