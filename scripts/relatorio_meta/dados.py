"""Carga e agregacao dos dados da conta para o relatorio de evolucao.

Fontes (todas somente leitura, coletadas via MCP meta-ads):
- <dados>/coleta/anuncios_mensal.json: ads_get_ad_entities, nivel ad, time_increment monthly.
- <dados>/coleta/anuncios_diario_*.json: ads_get_ad_entities, nivel ad, time_increment 1.
- <dados>/fontes.yaml: aponta para o dados.json do meta-ads-analyst e para os logs de atividade.

Nenhum numero e digitado aqui: tudo sai das respostas brutas da API.
"""
import csv
import datetime as dt
import glob
import json
import os
from collections import defaultdict

import yaml

CONV = "onsite_conversion.messaging_conversation_started_7d"
CPA = "cost_per_action_type:"


def _ler_json(caminho):
    with open(caminho, encoding="utf-8") as f:
        return json.load(f)


def _entidades(caminho):
    d = _ler_json(caminho)
    ae = d["ad_entities"]
    return json.loads(ae) if isinstance(ae, str) else ae


def num(x):
    """Normaliza numero da API: str, {value,unit}, None, 'Not available'."""
    if x is None:
        return None
    if isinstance(x, dict):
        x = x.get("value")
    if x is None:
        return None
    if isinstance(x, (int, float)):
        return float(x)
    s = str(x).strip()
    if s.startswith("Not available"):
        return None
    try:
        return float(s.replace("%", "").replace(",", "."))
    except ValueError:
        return None


def conversas(row):
    """Conversas iniciadas (campo results). 'Not available' vira 0 so quando houve entrega."""
    r = row.get("results")
    if isinstance(r, dict) and "values" in r:
        return int(num(r["values"][0]["value"]))
    return 0 if (num(row.get("impressions")) or 0) > 0 else None


def derivado(gasto, custo):
    """Contagem derivada de custo por acao: gasto / custo, arredondada."""
    if not gasto or not custo:
        return 0
    return int(round(gasto / custo))


def _data(s):
    return dt.date.fromisoformat(s[:10])


def _data_log(s):
    """Datas do log vem como 'dd/mm/aaaa às hh:mm'."""
    d = s.split(" ")[0]
    dia, mes, ano = d.split("/")
    return dt.date(int(ano), int(mes), int(dia))


class Base:
    """Dados normalizados do periodo [inicio, fim] (fuso da conta)."""

    def __init__(self, pasta_dados, inicio, fim):
        self.pasta = pasta_dados
        self.inicio = inicio
        self.fim = fim
        fontes_path = os.path.join(pasta_dados, "fontes.yaml")
        with open(fontes_path, encoding="utf-8") as f:
            self.fontes = yaml.safe_load(f)
        raiz = self.fontes.get("raiz_projeto", ".")
        self._raiz = os.path.normpath(os.path.join(pasta_dados, raiz))
        self.analise = _ler_json(self._p(self.fontes["analise_dados_json"]))
        self.fuso_conta = self.analise.get("fuso_conta", "America/Los_Angeles")
        self._carregar_mensal()
        self._carregar_diario()
        self._carregar_estrutura()
        self._carregar_eventos()
        self._carregar_leads()

    def _p(self, rel):
        return rel if os.path.isabs(rel) else os.path.join(self._raiz, rel)

    # ---------- series ----------
    def _carregar_mensal(self):
        rows = _entidades(os.path.join(self.pasta, "coleta", "anuncios_mensal.json"))
        # formato: o do criativo (contrato do analista). video_play_actions nao serve: a API
        # devolve valor ate para anuncio de imagem.
        formato_de = {a["id"]: a.get("formato") for a in self.analise["anuncios"]}
        self.mensal = []
        for r in rows:
            d0 = _data(r["date_start"])
            if d0 < self.inicio or d0 > self.fim:
                continue
            g = num(r.get("amount_spent")) or 0.0
            fmt = formato_de.get(r["id"])
            video = (fmt == "video") if fmt else r.get("video_play_actions") is not None
            imp = int(num(r.get("impressions")) or 0)
            self.mensal.append({
                "id": r["id"],
                "nome_api": r["name"],
                "conjunto_id": r.get("adset_id"),
                "inicio": d0,
                "fim": _data(r["date_stop"]),
                "gasto": g,
                "impressoes": imp,
                # metricas de video so contam anuncios de video (imagem distorceria hook e hold)
                "impressoes_video": imp if video else 0,
                "cliques_link": int(num(r.get("link_click")) or 0),
                "conversas": conversas(r) or 0,
                "plays_3s": derivado(g, num(r.get(CPA + "video_view"))) if video else 0,
                "thruplays": int(num(r.get("video_thruplay_watched_actions")) or 0) if video else 0,
                "p100": int(num(r.get("video_p100_watched_actions")) or 0) if video else 0,
                "primeira_resposta": derivado(g, num(r.get(CPA + "onsite_conversion.messaging_first_reply"))),
                "eh_video": video,
            })

    def _carregar_diario(self):
        arquivos = sorted(glob.glob(os.path.join(self.pasta, "coleta", "anuncios_diario_*.json")))
        if not arquivos:
            raise SystemExit("coleta/anuncios_diario_*.json nao encontrado")
        vistos = set()
        self.diario = []
        for a in arquivos:
            for r in _entidades(a):
                d = _data(r["date_start"])
                if d < self.inicio or d > self.fim:
                    continue
                chave = (r["id"], d)
                if chave in vistos:
                    raise SystemExit(f"linha diaria duplicada: {chave} em {a}")
                vistos.add(chave)
                self.diario.append({
                    "id": r["id"],
                    "data": d,
                    "gasto": num(r.get("amount_spent")) or 0.0,
                    "impressoes": int(num(r.get("impressions")) or 0),
                    "conversas": conversas(r) or 0,
                })
        # cobertura: todo anuncio da serie mensal precisa ter todos os dias
        n_dias = (self.fim - self.inicio).days + 1
        por_ad = defaultdict(int)
        for r in self.diario:
            por_ad[r["id"]] += 1
        faltando = {i: n_dias - por_ad.get(i, 0) for i in {m["id"] for m in self.mensal}
                    if por_ad.get(i, 0) != n_dias}
        if faltando:
            raise SystemExit(f"serie diaria incompleta (dias faltando por anuncio): {faltando}")

    # ---------- estrutura ----------
    def _carregar_estrutura(self):
        an = {a["id"]: a for a in self.analise["anuncios"]}
        cj = {c["id"]: c for c in self.analise["conjuntos"]}
        self.conjuntos = {}
        for cid, c in cj.items():
            self.conjuntos[cid] = {"id": cid, "nome": c["nome"], "config": c.get("config", {})}
        self.anuncios = {}
        for m in self.mensal:
            i = m["id"]
            if i in self.anuncios:
                continue
            a = an.get(i, {})
            cid = m["conjunto_id"]
            self.anuncios[i] = {
                "id": i,
                "nome": (a.get("nome") or m["nome_api"]).replace("—", "-"),
                "conjunto_id": cid,
                "conjunto": self.conjuntos.get(cid, {}).get("nome", "sem nome"),
                "formato": "video" if m["eh_video"] else "imagem",
                "duracao_s": a.get("duracao_s"),
                "texto": a.get("texto"),
                "status": a.get("status"),
                "status_efetivo": a.get("status_efetivo"),
                "no_contrato_analise": bool(a),
            }
        self.campanha_nome = self.fontes.get("campanha_nome", "Campanha")

    # ---------- eventos ----------
    def _carregar_eventos(self):
        self.recargas = []
        self.status_campanha = []
        vistos = set()
        for rel in self.fontes.get("logs_atividade", []):
            d = _ler_json(self._p(rel))
            itens = d.get("result", [])
            if isinstance(itens, str):
                itens = json.loads(itens)
            for x in itens:
                ev = x["event_type"]
                dia = _data_log(x["datetime"])
                if dia < self.inicio or dia > self.fim:
                    continue
                chave = (ev, x["datetime"], x.get("object_name"))
                if chave in vistos:
                    continue
                vistos.add(chave)
                extra = json.loads(x["extra_data"]) if x.get("extra_data") else {}
                if ev == "Quantia adicionada ao saldo":
                    self.recargas.append({"data": dia, "valor": extra["amount"] / 100.0})
                elif ev == "Status da campanha atualizado":
                    self.status_campanha.append({"data": dia, "de": extra.get("old_value"),
                                                 "para": extra.get("new_value")})
        self.recargas.sort(key=lambda r: r["data"])
        self.status_campanha.sort(key=lambda r: r["data"])

    def _carregar_leads(self):
        rel = self.fontes.get("leads_csv")
        self.leads = None
        if rel and os.path.exists(self._p(rel)):
            with open(self._p(rel), encoding="utf-8") as f:
                self.leads = list(csv.DictReader(f))
