"""Gera o relatorio de evolucao do Meta Ads em PDF (slides 16:9).

Uso:
  python scripts/relatorio_meta/gerar.py --inicio 2026-06-30 --fim 2026-10-05 \
      --dados reports/meta/2026-06-30_2026-10-05

  --contexto   so gera <saida>/contexto.json (lista de marcadores) para escrever a narrativa.

A pasta de dados precisa ter:
  coleta/anuncios_mensal.json, coleta/anuncios_diario_*.json   (ver README.md)
  fontes.yaml                                                   (aponta para o dados.json do analista e logs)
  narrativa.yaml                                                (textos interpretativos do periodo)
Saida: reports/meta/<inicio>_<fim>/relatorio.pdf, contexto.json, checagem.txt
"""
import argparse
import datetime as dt
import json
import os
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)

import yaml  # noqa: E402

import checagem  # noqa: E402
from dados import Base  # noqa: E402
from layout import Deck  # noqa: E402
from metricas import Modelo  # noqa: E402
from slides import Montador, ordem_completa  # noqa: E402

CONFIANCAS = {"alta", "média", "baixa"}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--inicio", required=True, type=dt.date.fromisoformat)
    ap.add_argument("--fim", required=True, type=dt.date.fromisoformat)
    ap.add_argument("--dados", required=True)
    ap.add_argument("--saida", default=None)
    ap.add_argument("--contexto", action="store_true")
    a = ap.parse_args()
    raiz = os.path.normpath(os.path.join(AQUI, "..", ".."))
    saida = a.saida or os.path.join(raiz, "reports", "meta", f"{a.inicio}_{a.fim}")
    os.makedirs(saida, exist_ok=True)

    base = Base(a.dados, a.inicio, a.fim)
    modelo = Modelo(base)
    narr_path = os.path.join(a.dados, "narrativa.yaml")
    narrativa = {}
    if os.path.exists(narr_path):
        with open(narr_path, encoding="utf-8") as fh:
            narrativa = yaml.safe_load(fh) or {}
    grupos = {k: v["ids"] for k, v in (narrativa.get("criativos", {}).get("grupos") or {}).items()}
    ctx = modelo.contexto(grupos)
    ctx["gerado_em"] = dt.date.today().strftime("%d/%m/%Y")
    for i, sid in enumerate(ordem_completa(modelo), start=1):
        ctx[f"slide.{sid}"] = str(i)
    with open(os.path.join(saida, "contexto.json"), "w", encoding="utf-8") as fh:
        json.dump(dict(sorted(ctx.items())), fh, ensure_ascii=False, indent=1)
    if a.contexto:
        print(f"contexto.json gerado com {len(ctx)} marcadores em {saida}")
        return 0
    if not narrativa:
        sys.exit(f"narrativa.yaml nao encontrada em {a.dados}. Gere com --contexto e escreva a narrativa.")
    for sec in ("ajustes", "ideias"):
        for it in narrativa.get(sec, {}).get("itens", []):
            if it.get("confianca") not in CONFIANCAS:
                sys.exit(f"{sec}: confianca invalida '{it.get('confianca')}' (use alta, média ou baixa)")

    with open(os.path.join(AQUI, "template_fase1.yaml"), encoding="utf-8") as fh:
        template = yaml.safe_load(fh)
    deck = Deck(f"Soliê Pilates  |  Meta Ads  |  {ctx['periodo.inicio']} a {ctx['periodo.fim']}")
    mt = Montador(deck, modelo, template, narrativa, ctx)
    mt.capa()
    mt.como_ler()
    mt.divisoria("fase1")
    mt.pecas()
    mt.estrutura()
    mt.funil()
    mt.glossario({"cpm", "cpr"}, 1)
    mt.glossario({"hook", "hold"}, 2)
    mt.glossario({"ctr_link", "taxa_conversa", "taxa_resposta"}, 3)
    mt.divisoria("fase2")
    mt.evolucao()
    for mm in modelo.meses:
        mt.mes(mm)
    mt.criativos()
    mt.conjuntos()
    mt.fora_do_ar()
    mt.horario()
    mt.divisoria("fase3")
    mt.ajustes()
    mt.ideias(1)
    mt.ideias(2)
    mt.medir()
    mt.fontes()
    esperado = len(ordem_completa(modelo))
    if deck.n_slide != esperado:
        sys.exit(f"numero de slides ({deck.n_slide}) diferente da ordem declarada ({esperado})")
    pdf = os.path.join(saida, "relatorio.pdf")
    try:
        deck.output(pdf)
    except PermissionError:
        # arquivo aberto em um leitor de PDF: grava com outro nome em vez de falhar
        pdf = os.path.join(saida, f"relatorio_{dt.datetime.now():%H%M%S}.pdf")
        deck.output(pdf)
        print(f"AVISO: relatorio.pdf estava aberto e bloqueado; PDF gravado como {os.path.basename(pdf)}")

    ok, rel = checagem.checar(pdf, a.dados, a.inicio, a.fim, base.analise)
    with open(os.path.join(saida, "checagem.txt"), "w", encoding="utf-8") as fh:
        fh.write(rel + "\n")
    print(f"PDF: {pdf} ({deck.n_slide} slides)")
    print(rel)
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
