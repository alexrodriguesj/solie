"""Checagem final: os totais impressos no PDF batem com os dados brutos?

Le o texto do PDF gerado (PyMuPDF) e compara com somas feitas aqui, direto dos arquivos
brutos da coleta, sem passar pelos modulos que montaram o PDF.
"""
import datetime as dt
import glob
import json
import os
import re

import fitz

TOL = 0.05


def _rows(caminho):
    d = json.load(open(caminho, encoding="utf-8"))
    ae = d["ad_entities"]
    return json.loads(ae) if isinstance(ae, str) else ae


def _conv(r):
    x = r.get("results")
    if isinstance(x, dict) and "values" in x:
        return int(float(x["values"][0]["value"]))
    return 0


def _gasto(r):
    return float(r["amount_spent"]["value"]) if r.get("amount_spent") else 0.0


def totais_brutos(pasta, inicio, fim):
    def dentro(r):
        return inicio <= dt.date.fromisoformat(r["date_start"]) <= fim
    diario = [r for a in sorted(glob.glob(os.path.join(pasta, "coleta", "anuncios_diario_*.json")))
              for r in _rows(a) if dentro(r)]
    mensal = [r for r in _rows(os.path.join(pasta, "coleta", "anuncios_mensal.json")) if dentro(r)]
    por_mes_d, por_mes_m = {}, {}
    for fonte, alvo in ((diario, por_mes_d), (mensal, por_mes_m)):
        for r in fonte:
            k = r["date_start"][:7]
            g, c = alvo.get(k, (0.0, 0))
            alvo[k] = (g + _gasto(r), c + _conv(r))
    return {
        "diario": (round(sum(_gasto(r) for r in diario), 2), sum(_conv(r) for r in diario)),
        "mensal": (round(sum(_gasto(r) for r in mensal), 2), sum(_conv(r) for r in mensal)),
        "por_mes_diario": {k: (round(v[0], 2), v[1]) for k, v in por_mes_d.items()},
    }


def recargas_brutas(pasta, inicio, fim):
    """Soma das recargas direto dos logs listados em fontes.yaml (sem usar dados.py)."""
    import yaml
    fontes = yaml.safe_load(open(os.path.join(pasta, "fontes.yaml"), encoding="utf-8"))
    raiz = os.path.normpath(os.path.join(pasta, fontes.get("raiz_projeto", ".")))
    vistos, total = set(), 0.0
    for rel in fontes.get("logs_atividade", []):
        itens = json.load(open(os.path.join(raiz, rel), encoding="utf-8")).get("result", [])
        if isinstance(itens, str):
            itens = json.loads(itens)
        for x in itens:
            if x["event_type"] != "Quantia adicionada ao saldo" or (x["datetime"], x["event_type"]) in vistos:
                continue
            dia, mes, ano = x["datetime"].split(" ")[0].split("/")
            if inicio <= dt.date(int(ano), int(mes), int(dia)) <= fim:
                vistos.add((x["datetime"], x["event_type"]))
                total += json.loads(x["extra_data"])["amount"] / 100.0
    return round(total, 2)


def _dinheiro(s):
    m = re.search(r"R\$\s*([\d.]+,\d{2})", s)
    return float(m.group(1).replace(".", "").replace(",", ".")) if m else None


def _inteiro(s):
    m = re.search(r"^\s*([\d.]+)\s*$", s)
    return int(m.group(1).replace(".", "")) if m else None


def _valor_apos(linhas, rotulo, conv):
    for i, l in enumerate(linhas):
        if l.strip().upper() == rotulo.upper():
            for prox in linhas[i + 1:i + 4]:
                v = conv(prox)
                if v is not None:
                    return v
    return None


def ler_pdf(caminho):
    doc = fitz.open(caminho)
    resumo = {"meses": [], "total": None}
    for p in doc:
        linhas = [l for l in p.get_text().splitlines() if l.strip()]
        if any(l.strip().upper() == "VIROU ANÚNCIO NO PERÍODO" for l in linhas):
            resumo["total"] = (_valor_apos(linhas, "VIROU ANÚNCIO NO PERÍODO", _dinheiro),
                               _valor_apos(linhas, "CONVERSAS INICIADAS NO PERÍODO", _inteiro))
            resumo["pago"] = _valor_apos(linhas, "PAGO EM RECARGAS NO PERÍODO", _dinheiro)
        if any(l.strip().upper() == "INVESTIMOS" for l in linhas):
            resumo["meses"].append((linhas[0].strip(), _valor_apos(linhas, "INVESTIMOS", _dinheiro),
                                    _valor_apos(linhas, "CONVERSAS INICIADAS", _inteiro)))
    resumo["paginas"] = len(doc)
    return resumo


def checar(pdf, pasta, inicio, fim, analise=None):
    bruto = totais_brutos(pasta, inicio, fim)
    lido = ler_pdf(pdf)
    linhas, ok = [], True

    def item(nome, a, b, tol=TOL):
        nonlocal ok
        bate = a is not None and b is not None and abs(a - b) <= tol
        ok &= bate
        linhas.append(f"[{'OK' if bate else 'FALHOU'}] {nome}: PDF={a} | dados={b}")

    g_pdf, c_pdf = lido["total"] or (None, None)
    item("gasto total (slide final) x serie diaria", g_pdf, bruto["diario"][0])
    item("gasto total (slide final) x serie mensal", g_pdf, bruto["mensal"][0])
    item("conversas totais (slide final) x serie diaria", c_pdf, bruto["diario"][1], 0)
    item("conversas totais (slide final) x serie mensal", c_pdf, bruto["mensal"][1], 0)
    item("pago em recargas (slide final) x logs de atividade", lido.get("pago"), recargas_brutas(pasta, inicio, fim))
    soma_g = round(sum(m[1] or 0 for m in lido["meses"]), 2)
    soma_c = sum(m[2] or 0 for m in lido["meses"])
    item(f"soma dos {len(lido['meses'])} slides de mes (gasto) x serie diaria", soma_g, bruto["diario"][0])
    item(f"soma dos {len(lido['meses'])} slides de mes (conversas) x serie diaria", soma_c, bruto["diario"][1], 0)
    if analise:
        cr = analise.get("conta_resumo", {})
        per = analise.get("periodos", {})
        for p in ("p0", "p1"):
            if p in cr and p in per:
                k = per[p]["inicio"][:7]
                mes_pdf = [m for m in lido["meses"] if m[0].lower().startswith(
                    ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro",
                     "outubro", "novembro", "dezembro"][int(k[5:]) - 1])]
                if mes_pdf and per[p]["inicio"].endswith("-01"):
                    item(f"{k} no PDF x analise do meta-ads-analyst (gasto)", mes_pdf[0][1], cr[p]["gasto"])
                    item(f"{k} no PDF x analise do meta-ads-analyst (conversas)", mes_pdf[0][2], cr[p]["conversas"], 0)
    linhas.append(f"Paginas no PDF: {lido['paginas']}")
    linhas.append("Meses lidos no PDF: " + "; ".join(f"{m[0]} = {m[1]} / {m[2]} conversas" for m in lido["meses"]))
    linhas.append("RESULTADO: " + ("todos os totais batem" if ok else "HA DIVERGENCIAS"))
    return ok, "\n".join(linhas)
