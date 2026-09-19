#!/usr/bin/env python3
"""
Fecha ao exterior as portas que a stack oficial do Supabase publica.

Numa VPS pública, `- "5432:5432"` significa que o PostgreSQL responde a
quem quer que lhe bata à porta. O mesmo para o pooler e para o gateway da
API, que deixa de precisar de estar exposto assim que o Caddy trata do
HTTPS. O que fica aberto ao mundo é o Caddy, e mais nada.

Prender a 127.0.0.1 não impede o acesso: impede o acesso SEM SSH. Um
`ssh -L 5432:localhost:5432` continua a levar-te lá.

    python3 fechar-portas.py docker-compose.yml
"""
import sys
import pathlib
import yaml

# O que fica acessível de fora, e o que só responde a quem já está na
# máquina (ou entra por um túnel SSH).
SO_LOCAL = {"db", "supavisor", "api-gw", "kong", "studio", "analytics"}


def prender(porta):
    """Acrescenta 127.0.0.1 a uma porta publicada, se ainda não o tiver."""
    if not isinstance(porta, str):
        return porta, False
    corpo, _, protocolo = porta.partition("/")
    # Já está presa a um endereço concreto.
    if corpo.startswith("127.0.0.1:") or corpo.startswith("localhost:"):
        return porta, False
    # `${VAR}:8000` tem duas partes; `1.2.3.4:80:80` tem três e já traz
    # endereço. A contagem não serve porque as variáveis podem ter `:-`
    # lá dentro, por isso conta-se só o que está fora das chavetas.
    fora = []
    profundidade = 0
    for c in corpo:
        if c == "{":
            profundidade += 1
        elif c == "}":
            profundidade -= 1
        elif c == ":" and profundidade == 0:
            fora.append(c)
    if len(fora) >= 2:
        return porta, False
    novo = "127.0.0.1:" + corpo + (("/" + protocolo) if protocolo else "")
    return novo, True


def main():
    caminho = pathlib.Path(sys.argv[1])
    doc = yaml.safe_load(caminho.read_text(encoding="utf-8"))
    mudadas = []

    for nome, servico in (doc.get("services") or {}).items():
        if nome not in SO_LOCAL or not isinstance(servico, dict):
            continue
        portas = servico.get("ports")
        if not portas:
            continue
        novas = []
        for p in portas:
            nova, mudou = prender(p)
            novas.append(nova)
            if mudou:
                mudadas.append(f"{nome}: {p} → {nova}")
        servico["ports"] = novas

    caminho.write_text(
        yaml.safe_dump(doc, sort_keys=False, default_flow_style=False, width=1000),
        encoding="utf-8",
    )
    if mudadas:
        for m in mudadas:
            print("   " + m)
    else:
        print("   nada a fechar (já estava tudo preso ao localhost)")


if __name__ == "__main__":
    main()
