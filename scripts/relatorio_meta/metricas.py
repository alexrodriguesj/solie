"""Metricas, intervalos e contexto de marcadores do relatorio.

Regras de volume minimo (as mesmas do meta-ads-analyst):
- taxas de video e de clique: 1.000 impressoes;
- custo por conversa e taxa de resposta: 10 conversas.
Intervalos a 90%: Wilson para taxas, Poisson para contagem de conversas.
"""
import datetime as dt
import math
from collections import defaultdict
from zoneinfo import ZoneInfo

from scipy.stats import chi2

import formatos as f

Z90 = 1.6448536269514722
MIN_IMPRESSOES = 1000
MIN_CONVERSAS = 10
MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho",
         "agosto", "setembro", "outubro", "novembro", "dezembro"]
DIAS_SEMANA = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"]
SOMA = ("gasto", "impressoes", "impressoes_video", "cliques_link", "conversas", "plays_3s", "thruplays",
        "p100", "primeira_resposta")


def wilson(k, n):
    if not n:
        return None
    p = k / n
    den = 1 + Z90 ** 2 / n
    c = (p + Z90 ** 2 / (2 * n)) / den
    h = Z90 * math.sqrt(p * (1 - p) / n + Z90 ** 2 / (4 * n * n)) / den
    return (max(0.0, c - h), min(1.0, c + h))


def poisson90(k):
    lo = 0.0 if k == 0 else chi2.ppf(0.05, 2 * k) / 2
    hi = chi2.ppf(0.95, 2 * k + 2) / 2
    return lo, hi


def ic_cpr(gasto, k):
    if not k:
        return None
    lo, hi = poisson90(k)
    return (gasto / hi, gasto / lo if lo > 0 else None)


def sobrepoe(a, b):
    if a is None or b is None or a[1] is None or b[1] is None:
        return True
    return not (a[1] < b[0] or b[1] < a[0])


def somar(linhas):
    t = {k: 0 for k in SOMA}
    for r in linhas:
        for k in SOMA:
            t[k] += r[k]
    t["gasto"] = round(t["gasto"], 2)
    return t


def taxas(t):
    """Acrescenta taxas e intervalos a um agregado."""
    imp, conv, g = t["impressoes"], t["conversas"], t["gasto"]
    t["cpm"] = g / imp * 1000 if imp else None
    t["cpr"] = g / conv if conv else None
    t["ic_cpr"] = ic_cpr(g, conv)
    imp_v = t["impressoes_video"]
    t["hook"] = t["plays_3s"] / imp_v if imp_v and t["plays_3s"] else None
    t["hold"] = t["thruplays"] / t["plays_3s"] if t["plays_3s"] else None
    t["vol_video"] = imp_v >= MIN_IMPRESSOES
    t["ctr_link"] = t["cliques_link"] / imp if imp else None
    t["taxa_conversa"] = conv / imp if imp else None
    t["taxa_resposta"] = min(t["primeira_resposta"], conv) / conv if conv else None
    t["vol_taxas"] = imp >= MIN_IMPRESSOES
    t["vol_cpr"] = conv >= MIN_CONVERSAS
    t["ic_hook"] = wilson(t["plays_3s"], imp_v) if t["hook"] is not None else None
    t["ic_resposta"] = wilson(min(t["primeira_resposta"], conv), conv) if conv else None
    return t


class Modelo:
    def __init__(self, base):
        self.b = base
        self._meses()
        self._agregados()
        self._calendario()
        self._programacao()
        self._exemplos()

    # ---------- meses ----------
    def _meses(self):
        """Meses do periodo. Um primeiro mes com menos de 7 dias e somado ao seguinte."""
        b = self.b
        chaves = []
        d = b.inicio
        while d <= b.fim:
            k = (d.year, d.month)
            if k not in chaves:
                chaves.append(k)
            d += dt.timedelta(days=1)
        rotulo_de = {}
        if len(chaves) > 1:
            y, m = chaves[0]
            dias_primeiro = sum(1 for i in range((b.fim - b.inicio).days + 1)
                                if (b.inicio + dt.timedelta(days=i)).month == m)
            if dias_primeiro < 7:
                rotulo_de[chaves[0]] = chaves[1]
        self.meses = []
        for k in chaves:
            if k in rotulo_de:
                continue
            origem = [k] + [o for o, dest in rotulo_de.items() if dest == k]
            dias = [b.inicio + dt.timedelta(days=i) for i in range((b.fim - b.inicio).days + 1)]
            dias = [x for x in dias if (x.year, x.month) in origem]
            ini, fim = min(dias), max(dias)
            ultimo_dia_mes = (dt.date(k[0] + (k[1] == 12), k[1] % 12 + 1, 1) - dt.timedelta(days=1))
            parcial = fim < ultimo_dia_mes
            self.meses.append({
                "chave": f"{k[0]:04d}-{k[1]:02d}",
                "nome": MESES[k[1] - 1],
                "inicio": ini, "fim": fim, "parcial": parcial,
                "origens": [f"{o[0]:04d}-{o[1]:02d}" for o in origem],
                "dias": len(dias),
            })
        self._mes_de = {}
        for m in self.meses:
            for o in m["origens"]:
                self._mes_de[o] = m["chave"]

    def mes_de(self, data):
        return self._mes_de[f"{data.year:04d}-{data.month:02d}"]

    # ---------- agregados ----------
    def _agregados(self):
        b = self.b
        self.total = taxas(somar(b.mensal))
        self.por_mes = {}
        self.ads_por_mes = defaultdict(dict)
        por_mes_lin = defaultdict(list)
        por_ad_mes = defaultdict(list)
        for r in b.mensal:
            mk = self.mes_de(r["inicio"])
            por_mes_lin[mk].append(r)
            por_ad_mes[(mk, r["id"])].append(r)
        for m in self.meses:
            self.por_mes[m["chave"]] = taxas(somar(por_mes_lin[m["chave"]]))
        for (mk, i), lin in por_ad_mes.items():
            t = taxas(somar(lin))
            if t["gasto"] > 0:
                self.ads_por_mes[mk][i] = t
        por_ad = defaultdict(list)
        por_cj = defaultdict(list)
        for r in b.mensal:
            por_ad[r["id"]].append(r)
            por_cj[r["conjunto_id"]].append(r)
        self.por_anuncio = {i: taxas(somar(l)) for i, l in por_ad.items() if somar(l)["gasto"] > 0}
        self.por_conjunto = {i: taxas(somar(l)) for i, l in por_cj.items() if somar(l)["gasto"] > 0}
        # veredito de cada anuncio contra o restante da conta
        for i, t in self.por_anuncio.items():
            resto = taxas(somar([r for r in b.mensal if r["id"] != i]))
            t["veredito"] = self._veredito(t, resto)
        for i, t in self.por_conjunto.items():
            resto = taxas(somar([r for r in b.mensal if r["conjunto_id"] != i]))
            t["veredito"] = self._veredito(t, resto)
        # leads (bloco opcional)
        self.leads_por_mes = None
        if b.leads is not None:
            self.leads_por_mes = defaultdict(lambda: {"leads": 0, "agendou": 0, "matriculou": 0})
            for l in b.leads:
                d = dt.date.fromisoformat(l["data"][:10])
                if d < b.inicio or d > b.fim:
                    continue
                x = self.leads_por_mes[self.mes_de(d)]
                x["leads"] += 1
                x["agendou"] += l.get("agendou", "").strip().lower() in ("sim", "s", "1", "true")
                x["matriculou"] += l.get("matriculou", "").strip().lower() in ("sim", "s", "1", "true")

    def grupo(self, ids):
        lin = [r for r in self.b.mensal if r["id"] in ids]
        t = taxas(somar(lin))
        resto = taxas(somar([r for r in self.b.mensal if r["id"] not in ids]))
        t["veredito"] = self._veredito(t, resto)
        t["resto"] = resto
        return t

    @staticmethod
    def _veredito(t, resto):
        if not t["vol_cpr"]:
            return "pouca"
        if sobrepoe(t["ic_cpr"], resto["ic_cpr"]):
            return "incerto"
        return "mais_barato" if t["cpr"] < resto["cpr"] else "mais_caro"

    # ---------- calendario de entrega ----------
    def _calendario(self):
        b = self.b
        por_dia = defaultdict(lambda: [0.0, 0])
        for r in b.diario:
            por_dia[r["data"]][0] += r["gasto"]
            por_dia[r["data"]][1] += r["impressoes"]
        feriados = {dt.date.fromisoformat(x) for x in b.fontes.get("feriados", [])}
        self.dias = []
        d = b.inicio
        while d <= b.fim:
            g, imp = por_dia[d]
            tipo = "fim_de_semana" if d.weekday() >= 5 else ("feriado" if d in feriados else "util")
            self.dias.append({"data": d, "gasto": round(g, 2), "impressoes": imp, "no_ar": imp > 0, "tipo": tipo})
            d += dt.timedelta(days=1)
        rec_dias = {r["data"] for r in b.recargas}
        religadas = {s["data"] for s in b.status_campanha if s["para"] == "Ativa"}
        desligadas = {s["data"] for s in b.status_campanha if s["para"] == "Inativa"}
        self.periodos_fora = []
        atual = None
        for i, x in enumerate(self.dias):
            if not x["no_ar"]:
                if atual is None:
                    atual = {"inicio": x["data"], "fim": x["data"]}
                else:
                    atual["fim"] = x["data"]
            elif atual is not None:
                volta = x["data"]
                atual["volta"] = volta
                ant = atual["inicio"] - dt.timedelta(days=1)
                if volta in religadas or ant in desligadas or atual["inicio"] in desligadas:
                    atual["motivo"] = "manual"
                elif volta in rec_dias:
                    atual["motivo"] = "recarga"
                else:
                    atual["motivo"] = "outro"
                self.periodos_fora.append(atual)
                atual = None
        if atual is not None:
            atual["volta"] = None
            atual["motivo"] = "em_aberto"
            self.periodos_fora.append(atual)
        tipo_de = {x["data"]: x["tipo"] for x in self.dias}
        for p in self.periodos_fora:
            p["dias"] = (p["fim"] - p["inicio"]).days + 1
            dias_p = [p["inicio"] + dt.timedelta(days=i) for i in range(p["dias"])]
            p["uteis"] = sum(1 for x in dias_p if tipo_de[x] == "util")
        self.fora_por_mes = defaultdict(int)
        self.uteis_por_mes = defaultdict(int)
        self.uteis_fora_por_mes = defaultdict(int)
        self.descanso_fora_por_mes = defaultdict(int)
        for x in self.dias:
            mk = self.mes_de(x["data"])
            if x["tipo"] == "util":
                self.uteis_por_mes[mk] += 1
            if not x["no_ar"]:
                self.fora_por_mes[mk] += 1
                if x["tipo"] == "util":
                    self.uteis_fora_por_mes[mk] += 1
                else:
                    self.descanso_fora_por_mes[mk] += 1
        # dias com entrega por anuncio
        dias_ad = defaultdict(int)
        for r in b.diario:
            if r["impressoes"] > 0:
                dias_ad[r["id"]] += 1
        vals = sorted(dias_ad.values())
        n = len(vals)
        self.mediana_dias_anuncio = (vals[n // 2] if n % 2 else (vals[n // 2 - 1] + vals[n // 2]) / 2) if n else None
        self.dias_no_ar_anuncio = dict(dias_ad)
        self.dias_semana_fora = defaultdict(int)
        for x in self.dias:
            if not x["no_ar"]:
                self.dias_semana_fora[(x["data"].isoweekday()) % 7] += 1

    # ---------- programacao de horario ----------
    def _programacao(self):
        """Converte a programacao (fuso da conta) para Brasilia na data final do periodo."""
        tz_conta = ZoneInfo(self.b.fuso_conta)
        tz_br = ZoneInfo("America/Sao_Paulo")
        ref = self.b.fim
        self.programacao = {}
        for cid, c in self.b.conjuntos.items():
            regras = c["config"].get("adset_schedule") or []
            blocos = []
            for r in regras:
                for dia_meta in r["days"]:
                    # Meta: 0 = domingo. Data de referencia na semana de 'ref'.
                    delta = (dia_meta - (ref.isoweekday() % 7)) % 7
                    dia = ref + dt.timedelta(days=delta)
                    ini = dt.datetime.combine(dia, dt.time()) + dt.timedelta(minutes=r["start_minute"])
                    fim = dt.datetime.combine(dia, dt.time()) + dt.timedelta(minutes=r["end_minute"])
                    ini_br = ini.replace(tzinfo=tz_conta).astimezone(tz_br)
                    fim_br = fim.replace(tzinfo=tz_conta).astimezone(tz_br)
                    blocos.append({"dia_conta": dia_meta, "ini_conta": ini, "fim_conta": fim,
                                   "ini_br": ini_br, "fim_br": fim_br})
            self.programacao[cid] = blocos
        self.diferenca_horas = int((dt.datetime.combine(ref, dt.time(12)).replace(tzinfo=tz_br).utcoffset()
                                    - dt.datetime.combine(ref, dt.time(12)).replace(tzinfo=tz_conta).utcoffset())
                                   .total_seconds() // 3600)

    def resumo_programacao(self, cid, fuso="br"):
        """Texto curto: agrupa dias com o mesmo horario."""
        blocos = self.programacao.get(cid) or []
        if not blocos:
            return None
        grupos = defaultdict(list)
        for x in blocos:
            ini = x["ini_br"] if fuso == "br" else x["ini_conta"]
            fim = x["fim_br"] if fuso == "br" else x["fim_conta"]
            dia_ini = ini.isoweekday() % 7
            vira = fim.date() > ini.date()
            grupos[(ini.hour, ini.minute, fim.hour, fim.minute, vira)].append(dia_ini)
        partes = []
        for (h1, m1, h2, m2, vira), dias in sorted(grupos.items(), key=lambda kv: min(kv[1]) or 7):
            dias = sorted(dias)
            nome = (f"{DIAS_SEMANA[dias[0]]} a {DIAS_SEMANA[dias[-1]]}"
                    if len(dias) > 1 and dias == list(range(dias[0], dias[-1] + 1))
                    else ", ".join(DIAS_SEMANA[d] for d in dias))
            fim_txt = f.hora(h2, m2) + (" do dia seguinte" if vira else "")
            partes.append(f"{nome}, das {f.hora(h1, m1)} às {fim_txt}")
        cobertos = {(x["ini_br"] if fuso == "br" else x["ini_conta"]).isoweekday() % 7 for x in blocos}
        sem = [DIAS_SEMANA[d] for d in range(7) if d not in cobertos]
        if sem:
            partes.append("sem anúncio: " + ", ".join(sem))
        return "; ".join(partes)

    # ---------- exemplos para o glossario ----------
    def _exemplos(self):
        ads = self.por_anuncio
        def escolher(chave, cond, maior_e_melhor):
            cand = [(i, t[chave]) for i, t in ads.items() if t.get(chave) is not None and cond(t)]
            if len(cand) < 2:
                return None
            cand.sort(key=lambda x: x[1], reverse=maior_e_melhor)
            return {"bom": cand[0][0], "ruim": cand[-1][0], "n": len(cand)}
        v = lambda t: t["vol_taxas"]
        c = lambda t: t["vol_cpr"]
        self.exemplos = {
            "cpm": escolher("cpm", v, False),
            "cpr": escolher("cpr", c, False),
            "hook": escolher("hook", lambda t: t["vol_video"], True),
            "hold": escolher("hold", lambda t: t["vol_video"], True),
            "ctr_link": escolher("ctr_link", v, True),
            "taxa_conversa": escolher("taxa_conversa", v, True),
            "taxa_resposta": escolher("taxa_resposta", c, True),
        }

    # ---------- contexto de marcadores ----------
    def contexto(self, grupos=None):
        """Dicionario plano chave -> texto formatado, usado pelos marcadores {chave}."""
        ctx = {}
        def put_agg(pref, t):
            ctx[f"{pref}.gasto"] = f.dinheiro(t["gasto"])
            ctx[f"{pref}.conversas"] = f.inteiro(t["conversas"])
            ctx[f"{pref}.impressoes"] = f.inteiro(t["impressoes"])
            ctx[f"{pref}.cliques_link"] = f.inteiro(t["cliques_link"])
            ctx[f"{pref}.plays_3s"] = f.inteiro(t["plays_3s"])
            ctx[f"{pref}.thruplays"] = f.inteiro(t["thruplays"])
            ctx[f"{pref}.cpr"] = f.dinheiro(t["cpr"])
            ctx[f"{pref}.cpm"] = f.dinheiro(t["cpm"])
            ctx[f"{pref}.hook"] = f.pct(t["hook"])
            ctx[f"{pref}.hold"] = f.pct(t["hold"])
            ctx[f"{pref}.ctr_link"] = f.pct(t["ctr_link"], 2)
            ctx[f"{pref}.taxa_conversa_mil"] = f.por_mil(t["taxa_conversa"])
            ctx[f"{pref}.taxa_resposta"] = f.pct(t["taxa_resposta"])
            ctx[f"{pref}.primeira_resposta"] = f.inteiro(min(t["primeira_resposta"], t["conversas"]))
            if t["ic_cpr"]:
                ctx[f"{pref}.cpr_faixa"] = f.faixa(t["ic_cpr"])
            if t.get("veredito"):
                ctx[f"{pref}.veredito"] = f.veredito(t["veredito"])
        put_agg("periodo", self.total)
        ctx["periodo.inicio"] = f.data(self.b.inicio)
        ctx["periodo.fim"] = f.data(self.b.fim)
        ctx["periodo.dias_fora"] = f.inteiro(sum(1 for x in self.dias if not x["no_ar"]))
        ctx["periodo.dias"] = f.inteiro(len(self.dias))
        ctx["periodo.n_anuncios"] = f.inteiro(len(self.por_anuncio))
        ctx["periodo.n_conjuntos"] = f.inteiro(len(self.por_conjunto))
        ctx["periodo.recargas"] = f.inteiro(len(self.b.recargas))
        ctx["periodo.recargas_valor"] = f.dinheiro(sum(r["valor"] for r in self.b.recargas))
        valores = sorted({r["valor"] for r in self.b.recargas})
        ctx["periodo.recarga_valor_tipico"] = f.dinheiro(max(valores, key=lambda v: sum(
            1 for r in self.b.recargas if r["valor"] == v))) if valores else "sem dado"
        ctx["periodo.fora_periodos"] = f.inteiro(len(self.periodos_fora))
        ctx["periodo.fora_recarga"] = f.inteiro(sum(1 for p in self.periodos_fora if p["motivo"] == "recarga"))
        ctx["periodo.fora_manual"] = f.inteiro(sum(1 for p in self.periodos_fora if p["motivo"] == "manual"))
        ctx["periodo.fora_fim_semana"] = f.inteiro(self.dias_semana_fora[0] + self.dias_semana_fora[6])
        ctx["periodo.diferenca_horas"] = f.inteiro(self.diferenca_horas)
        # dias uteis x fins de semana e feriados
        ctx["periodo.dias_uteis"] = f.inteiro(sum(self.uteis_por_mes.values()))
        ctx["periodo.dias_uteis_fora"] = f.inteiro(sum(self.uteis_fora_por_mes.values()))
        ctx["periodo.descanso_fora"] = f.inteiro(sum(self.descanso_fora_por_mes.values()))
        paradas_uteis = [p for p in self.periodos_fora if p["uteis"] > 0]
        ctx["periodo.paradas_uteis"] = f.inteiro(len(paradas_uteis))
        ctx["periodo.paradas_uteis_recarga"] = f.inteiro(sum(1 for p in paradas_uteis if p["motivo"] == "recarga"))
        ctx["periodo.paradas_uteis_manual"] = f.inteiro(sum(1 for p in paradas_uteis if p["motivo"] == "manual"))
        ctx["periodo.mediana_dias_anuncio"] = f.inteiro(self.mediana_dias_anuncio)
        # quanto foi pago x quanto virou anuncio
        pago = sum(r["valor"] for r in self.b.recargas)
        self.pago = pago
        ctx["periodo.pago"] = f.dinheiro(pago)
        ctx["periodo.pago_menos_gasto"] = f.dinheiro(pago - self.total["gasto"])
        ctx["periodo.pago_menos_gasto_pct"] = f.pct((pago - self.total["gasto"]) / pago) if pago else "sem dado"
        ctx["periodo.cpr_pago"] = f.dinheiro(pago / self.total["conversas"]) if self.total["conversas"] else "sem dado"
        # ESTIMATIVA: quanto de cada real pago vira anuncio. Em cada semana completa (seg a dom) com
        # recarga, gasto da semana / valor pago na semana; usa a mediana das semanas.
        razoes = []
        d0 = self.b.inicio + dt.timedelta(days=(7 - self.b.inicio.weekday()) % 7)
        while d0 + dt.timedelta(days=6) <= self.b.fim:
            sem = [d0 + dt.timedelta(days=i) for i in range(7)]
            pago_sem = sum(r["valor"] for r in self.b.recargas if r["data"] in sem)
            gasto_sem = sum(x["gasto"] for x in self.dias if x["data"] in sem)
            if pago_sem > 0:
                razoes.append(gasto_sem / pago_sem)
            d0 += dt.timedelta(days=7)
        if razoes:
            razoes.sort()
            n = len(razoes)
            r = razoes[n // 2] if n % 2 else (razoes[n // 2 - 1] + razoes[n // 2]) / 2
            self.razao_recarga = r
            imposto = pago * (1 - r)
            ctx["estimativa.semanas"] = f.inteiro(n)
            ctx["estimativa.vira_anuncio_por_100"] = f.dinheiro(100 * r)
            ctx["estimativa.imposto_pct"] = f.pct(1 - r, 2)
            ctx["estimativa.imposto"] = f.dinheiro(imposto)
            ctx["estimativa.saldo_nao_usado"] = f.dinheiro(pago - self.total["gasto"] - imposto)
        # fins de semana com anuncio no ar
        fds_no_ar = [x["data"] for x in self.dias if x["no_ar"] and x["tipo"] == "fim_de_semana"]
        ctx["periodo.fds_no_ar"] = f.inteiro(len(fds_no_ar))
        ctx["periodo.fds_no_ar_datas"] = (", ".join(f.data_curta(x) for x in fds_no_ar[:-1]) + " e "
                                          + f.data_curta(fds_no_ar[-1])) if len(fds_no_ar) > 1 else (
            f.data_curta(fds_no_ar[0]) if fds_no_ar else "nenhum")
        for m in self.meses:
            k = m["chave"]
            put_agg(f"mes.{k}", self.por_mes[k])
            ctx[f"mes.{k}.nome"] = m["nome"]
            ctx[f"mes.{k}.dias_fora"] = f.inteiro(self.fora_por_mes.get(k, 0))
            ctx[f"mes.{k}.dias_uteis"] = f.inteiro(self.uteis_por_mes.get(k, 0))
            ctx[f"mes.{k}.dias_uteis_fora"] = f.inteiro(self.uteis_fora_por_mes.get(k, 0))
            ctx[f"mes.{k}.descanso_fora"] = f.inteiro(self.descanso_fora_por_mes.get(k, 0))
            ctx[f"mes.{k}.dias"] = f.inteiro(m["dias"])
            ctx[f"mes.{k}.n_anuncios"] = f.inteiro(len(self.ads_por_mes[k]))
            for i, t in self.ads_por_mes[k].items():
                put_agg(f"mes.{k}.anuncio.{i}", t)
        for i, t in self.por_anuncio.items():
            put_agg(f"anuncio.{i}", t)
            ctx[f"anuncio.{i}.nome"] = self.b.anuncios[i]["nome"]
            ctx[f"anuncio.{i}.dias_no_ar"] = f.inteiro(self.dias_no_ar_anuncio.get(i, 0))
        for i, t in self.por_conjunto.items():
            put_agg(f"conjunto.{i}", t)
            ctx[f"conjunto.{i}.nome"] = self.b.conjuntos.get(i, {}).get("nome", i)
            prog = self.resumo_programacao(i)
            ctx[f"conjunto.{i}.programacao_br"] = prog or "sem programação de horário"
            ctx[f"conjunto.{i}.programacao_conta"] = self.resumo_programacao(i, "conta") or "sem programação de horário"
            sab = [x for x in self.programacao.get(i, []) if x["dia_conta"] == 6]
            if sab:
                ctx[f"conjunto.{i}.prog_sabado_inicio_br"] = f.hora(sab[0]["ini_br"].hour, sab[0]["ini_br"].minute)
                ctx[f"conjunto.{i}.prog_sabado_fim_br"] = f.hora(sab[0]["fim_br"].hour, sab[0]["fim_br"].minute)
            dias_cj = {r["data"] for r in self.b.diario if r["impressoes"] > 0
                       and self.b.anuncios.get(r["id"], {}).get("conjunto_id") == i}
            ctx[f"conjunto.{i}.dias_no_ar"] = f.inteiro(len(dias_cj))
            util = [x for x in self.programacao.get(i, []) if 1 <= x["dia_conta"] <= 5]
            if util:
                ctx[f"conjunto.{i}.prog_util_inicio_br"] = f.hora(util[0]["ini_br"].hour, util[0]["ini_br"].minute)
                ctx[f"conjunto.{i}.prog_util_fim_br"] = f.hora(util[0]["fim_br"].hour, util[0]["fim_br"].minute)
                ctx[f"conjunto.{i}.prog_util_inicio_conta"] = f.hora(util[0]["ini_conta"].hour, util[0]["ini_conta"].minute)
                ctx[f"conjunto.{i}.prog_util_fim_conta"] = f.hora(util[0]["fim_conta"].hour, util[0]["fim_conta"].minute)
            st = self.b.conjuntos.get(i, {}).get("config", {}).get("status")
            ctx[f"conjunto.{i}.status"] = {"ACTIVE": "ativo", "PAUSED": "pausado"}.get(st, "sem dado")
        for slug, ids in (grupos or {}).items():
            g = self.grupo(set(ids))
            put_agg(f"grupo.{slug}", g)
            put_agg(f"grupo.{slug}.resto", g["resto"])
        sufixo = {"cpm": "cpm", "cpr": "cpr", "hook": "hook", "hold": "hold", "ctr_link": "ctr_link",
                  "taxa_conversa": "taxa_conversa_mil", "taxa_resposta": "taxa_resposta"}
        for met, ex in self.exemplos.items():
            if ex:
                for lado in ("bom", "ruim"):
                    i = ex[lado]
                    ctx[f"exemplo.{met}.{lado}"] = self.b.anuncios[i]["nome"]
                    ctx[f"exemplo.{met}.{lado}.valor"] = ctx[f"anuncio.{i}.{sufixo[met]}"]
                ctx[f"exemplo.{met}.n"] = f.inteiro(ex["n"])
        return ctx
