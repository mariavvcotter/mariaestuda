"""Extrai as perguntas de escolha múltipla dos PDF "14 Dias – Itens de Seleção".

Para cada unidade junta o PDF das perguntas com o dos critérios de correção
(as letras certas) e escreve um JSON com enunciado, opções, resposta certa e
exame de origem. Marca as perguntas que dependem de um gráfico ou quadro,
porque o texto extraído do PDF pode não trazer os dados.

  python3 eco/ferramentas/extrair_14dias.py PASTA_DOS_TXT PASTA_DE_SAIDA
"""
import json, re, sys, pathlib

CAB = re.compile(r'14dias\.org\s+14 Dias.*?Página \d+\s*', re.S)
# (não usado)
VISUAL = re.compile(r'gr[áa]fico|figura|quadro|tabela|esquema|imagem|documento \d|dados apresentados|observe|analise o|a partir d[oa]s? (?:dados|valores)', re.I)

def limpa(t):
    t = CAB.sub('\n', t)
    t = t.replace(' ', ' ').replace('�', '')
    return t

def junta(s):
    s = re.sub(r'\s*\n\s*', ' ', s)
    s = re.sub(r'\s{2,}', ' ', s)
    return s.strip()

def opcoes(bloco):
    """Separa enunciado e opções (A)–(D) de um bloco de texto."""
    fonte = re.search(r'(Exame\s*[–-]\s*\d{4}[^\n]*|Teste Intermédio[^\n]*)', bloco)
    sem = bloco[:fonte.start()] if fonte else bloco
    m = re.search(r'\(A\)(.*?)\(B\)(.*?)\(C\)(.*?)\(D\)(.*)', sem, re.S)
    if not m:
        return None
    return junta(sem[:m.start()]), [junta(x) for x in m.groups()], (junta(fonte.group(1)) if fonte else '')

def contexto(txt):
    """Texto de apoio (tabela, excerto): mantém as quebras de linha."""
    linhas = [re.sub(r'\s{2,}', ' ', l).strip() for l in txt.split('\n')]
    out, vazio = [], False
    for l in linhas:
        if not l:
            if not vazio and out: out.append('')
            vazio = True
        else:
            out.append(l); vazio = False
    return '\n'.join(out).strip()

def perguntas(texto):
    t = limpa(texto)
    partes = re.split(r'\n[ \t]*(\d{1,3})\.[ \t]+(?=\S)', '\n' + t)
    # Só é pergunta nova se o número seguir a sequência: "7. Nesse estudo…" no meio de
    # um enunciado, ou as opções numeradas dos itens de completar, voltam ao bloco anterior.
    blocos, ant = [], 0
    for i in range(1, len(partes) - 1, 2):
        n, corpo = int(partes[i]), partes[i + 1]
        if n == ant + 1 or not blocos:
            blocos.append([str(n), corpo]); ant = n
        else:
            blocos[-1][1] += '\n' + str(n) + '. ' + corpo
    out = []
    for n, corpo in blocos:
        fonte_bloco = re.search(r'(Exame\s*[–-]\s*\d{4}[^\n]*|Teste Intermédio[^\n]*)', corpo)
        fonte_txt = junta(fonte_bloco.group(1)) if fonte_bloco else ''
        subs = list(re.finditer(r'\n\s*' + n + r'\.(\d)\.\s+', '\n' + corpo))
        if subs:
            corpo2 = '\n' + corpo
            ctx = contexto(corpo2[:subs[0].start()])
            for j, m in enumerate(subs):
                fim = subs[j + 1].start() if j + 1 < len(subs) else len(corpo2)
                r = opcoes(corpo2[m.end():fim])
                if not r:
                    out.append({'n': f'{n}.{m.group(1)}', 'erro': 'sem opções'}); continue
                p, o, f = r
                out.append({'n': f'{n}.{m.group(1)}', 'ctx': ctx, 'p': p, 'o': o, 'fonte': f or fonte_txt})
            continue
        r = opcoes(corpo)
        if not r:
            out.append({'n': n, 'erro': 'sem opções', 'bruto': junta(corpo)[:300]}); continue
        p, o, f = r
        out.append({'n': n, 'p': p, 'o': o, 'fonte': f})
    for q in out:
        if 'erro' not in q:
            q['grafico'] = bool(re.search(r'gr[áa]fico|figura|esquema', (q.get('ctx', '') + ' ' + q['p']), re.I))
    return out

def chave(texto):
    return {a: 'ABCD'.index(b) for a, b in re.findall(r'(\d{1,3}(?:\.\d)?)\.\s*\(([ABCD])\)', texto)}

def main(pasta, saida):
    pasta, saida = pathlib.Path(pasta), pathlib.Path(saida)
    saida.mkdir(parents=True, exist_ok=True)
    for f in sorted(pasta.glob('14-Dias-U.*-Itens-de-Selecao-Exercicios-de-Exame.txt')):
        u = re.search(r'U\.(\d+)\.', f.name).group(1)
        crit = pasta / f.name.replace('Itens-de-Selecao-Exercicios', 'Itens-de-Selecao-Criterios-de-Correcao-Exercicios')
        if not crit.exists():
            print(f'U{u}: falta o ficheiro dos critérios'); continue
        qs, k = perguntas(f.read_text()), chave(crit.read_text())
        for q in qs:
            if q['n'] in k: q['c'] = k[q['n']]
            elif 'erro' not in q: q['erro'] = 'sem resposta nos critérios'
        ok = [q for q in qs if 'erro' not in q]
        (saida / f'u{u}.json').write_text(json.dumps(qs, ensure_ascii=False, indent=1))
        sem_q = sorted(set(k) - {q['n'] for q in ok}, key=lambda x: [int(v) for v in x.split('.')])
        print(f'U{u}: {len(ok)} perguntas completas de {len(k)} respostas nos critérios · {sum(q["grafico"] for q in ok)} dependem de gráfico · '
              f'com tabela/texto de apoio: {sum(bool(q.get("ctx")) for q in ok)} · respostas sem pergunta: {sem_q}')

if __name__ == '__main__':
    main(*sys.argv[1:3])
