"""Montagem dos slides. Cada funcao desenha um slide a partir do modelo, do template e da narrativa."""
from layout import (AZUL_ESCURO, BEGE, BEGE_CLARO, BRANCO, CINZA, COR_CONFIANCA, H, MARGEM, VERDE,
                    VERDE_ESCURO, VERMELHO, VERMELHO_CLARO, W, TEXTO)
import formatos as f
from textos import render

# ordem fixa: os numeros de slide viram marcadores {slide.<id>} para a narrativa
ORDEM = ["capa", "como_ler", "div_fase1", "pecas", "estrutura", "funil", "glossario_1", "glossario_2",
         "glossario_3", "div_fase2", "evolucao"]


def ordem_completa(modelo):
    meses = [f"mes_{m['chave']}" for m in modelo.meses]
    return ORDEM + meses + ["criativos", "conjuntos", "fora_do_ar", "horario", "div_fase3", "ajustes",
                            "ideias_1", "ideias_2", "medir", "fontes"]


class Montador:
    def __init__(self, deck, modelo, template, narrativa, ctx):
        self.d = deck
        self.m = modelo
        self.t = template
        self.n = narrativa
        self.ctx = ctx
        self.tem_leads = modelo.leads_por_mes is not None

    def r(self, texto, onde):
        return render(texto, self.ctx, onde)

    def rl(self, itens, onde):
        return [self.r(x, f"{onde}[{i}]") for i, x in enumerate(itens or [])]

    def nota_resultado(self, y):
        d = self.d
        txt = ("Resultado medido: conversa iniciada no WhatsApp. Ainda não medimos matrícula."
               if not self.tem_leads else "Resultado medido: conversa iniciada no WhatsApp, cruzada com a planilha de matrículas.")
        d.fonte(8.5, "I", CINZA)
        d.set_xy(MARGEM, y)
        d.cell(W - 2 * MARGEM, 4.5, d._txt(txt))

    # ---------------- abertura ----------------
    def capa(self):
        d, t = self.d, self.t["capa"]
        d.novo_slide(fundo=VERDE, rodape=False)
        d.fonte(40, "B", BRANCO)
        d.set_xy(MARGEM + 8, 50)
        d.cell(0, 18, d._txt(self.r(t["titulo"], "capa.titulo")))
        d.fonte(18, "", BEGE_CLARO, "LatoLight")
        d.set_xy(MARGEM + 8, 74)
        d.multi_cell(W - 60, 9, d._txt(self.r(t["subtitulo"], "capa.subtitulo")))
        d.fonte(11, "", BEGE)
        d.set_xy(MARGEM + 8, 120)
        d.multi_cell(W - 80, 6, d._txt(self.r(t["linha"], "capa.linha")))
        d.set_xy(MARGEM + 8, 136)
        d.cell(0, 6, d._txt("Gerado em " + self.ctx["gerado_em"]))

    def como_ler(self):
        d, t = self.d, self.t["como_ler"]
        y = d.novo_slide(self.r(t["titulo"], "como_ler.titulo"))
        itens = self.rl(t["itens"], "como_ler.itens")
        itens.append(self.r(t["com_leads"] if self.tem_leads else t["sem_leads"], "como_ler.leads"))
        d.lista(MARGEM, y + 4, W - 2 * MARGEM - 40, itens, tam=14, espaco=5)

    def divisoria(self, chave):
        t = self.t[chave]
        self.d.divisoria(self.r(t["fase"], chave), self.r(t["titulo"], chave), self.r(t["resumo"], chave))

    # ---------------- fase 1 ----------------
    def pecas(self):
        d, t = self.d, self.t["pecas"]
        y = d.novo_slide(self.r(t["titulo"], "pecas"), self.r(t["subtitulo"], "pecas"))
        x, w, h = MARGEM, W - 2 * MARGEM, 100
        faixa = 30
        cores = [VERDE_ESCURO, VERDE, AZUL_ESCURO]
        for i, nv in enumerate(t["niveis"]):
            px, py = i * 12, i * faixa
            d.set_draw_color(*cores[i])
            d.set_line_width(0.8)
            d.rect(x + px, y + py, w - 2 * px, h - py - i * 4, round_corners=True, corner_radius=3)
            d.fonte(14, "B", cores[i])
            d.set_xy(x + px + 6, y + py + 5)
            d.cell(62, 7, d._txt(nv["nome"]))
            d.paragrafo(x + px + 72, y + py + 5, w - 2 * px - 82, self.r(nv["texto"], "pecas.nivel"), 11.5)
        d.paragrafo(MARGEM, y + h + 6, w, self.r(t["rodape"], "pecas.rodape"), 12, "I", CINZA)

    def estrutura(self):
        d, t, m = self.d, self.t["estrutura"], self.m
        y = d.novo_slide(self.r(t["titulo"], "estrutura"), self.r(t["subtitulo"], "estrutura"))
        d.set_fill_color(*VERDE)
        d.rect(MARGEM, y, W - 2 * MARGEM, 10, style="F", round_corners=True, corner_radius=2)
        d.fonte(12, "B", BRANCO)
        d.set_xy(MARGEM + 4, y + 2)
        d.cell(0, 6, d._txt(f"Campanha: {m.b.campanha_nome}   |   {self.ctx['periodo.gasto']}"))
        cjs = sorted(m.por_conjunto.items(), key=lambda kv: -kv[1]["gasto"])
        n = len(cjs)
        gap = 4
        cw = (W - 2 * MARGEM - gap * (n - 1)) / max(n, 1)
        yy = y + 14
        for j, (cid, tc) in enumerate(cjs):
            cx = MARGEM + j * (cw + gap)
            d.set_fill_color(*BEGE)
            d.rect(cx, yy, cw, 14, style="F", round_corners=True, corner_radius=2)
            d.fonte(11, "B", VERDE_ESCURO)
            d.set_xy(cx + 3, yy + 1.5)
            d.cell(cw - 6, 5.5, d._txt(m.b.conjuntos.get(cid, {}).get("nome", cid)))
            d.fonte(9.5, "", TEXTO)
            d.set_xy(cx + 3, yy + 7)
            d.cell(cw - 6, 5, d._txt("conjunto  |  " + f.dinheiro(tc["gasto"])))
            ads = sorted([(i, a) for i, a in m.por_anuncio.items() if m.b.anuncios[i]["conjunto_id"] == cid],
                         key=lambda kv: -kv[1]["gasto"])
            ay = yy + 17
            for i, ta in ads:
                d.set_fill_color(*BEGE_CLARO)
                d.rect(cx + 3, ay, cw - 6, 9.5, style="F", round_corners=True, corner_radius=1.5)
                d.fonte(8.8, "B", TEXTO)
                nome = m.b.anuncios[i]["nome"]
                d.set_xy(cx + 5, ay + 0.8)
                d.cell(cw - 10, 4.5, d._txt(nome if d.get_string_width(nome) < cw - 12 else nome[:28] + "…"))
                d.fonte(8.3, "", CINZA)
                d.set_xy(cx + 5, ay + 4.8)
                fmt = "vídeo" if m.b.anuncios[i]["formato"] == "video" else "imagem"
                d.cell(cw - 10, 4, d._txt(f"{fmt}  |  {f.dinheiro(ta['gasto'])}"))
                ay += 11

    def funil(self):
        d, t = self.d, self.t["funil"]
        y = d.novo_slide(self.r(t["titulo"], "funil"), self.r(t["subtitulo"], "funil"))
        etapas = t["etapas"]
        n = len(etapas)
        gap = 5
        bw = (W - 2 * MARGEM - gap * (n - 1)) / n
        for i, e in enumerate(etapas):
            x = MARGEM + i * (bw + gap)
            cor = VERDE if i < n - 2 else VERDE_ESCURO
            d.set_fill_color(*BEGE_CLARO)
            d.rect(x, y + 8, bw, 62, style="F", round_corners=True, corner_radius=2.5)
            d.set_fill_color(*cor)
            d.rect(x, y + 8, bw, 3, style="F")
            d.fonte(19, "B", cor)
            d.set_xy(x, y + 18)
            d.cell(bw, 10, d._txt(self.ctx[e["chave"]]), align="C")
            d.fonte(10.5, "B", TEXTO)
            d.set_xy(x + 3, y + 32)
            d.multi_cell(bw - 6, 5, d._txt(self.r(e["rotulo"], "funil.rotulo")), align="C")
            if e.get("nota"):
                d.fonte(9, "I", CINZA)
                d.set_xy(x + 3, d.get_y() + 1.5)
                d.multi_cell(bw - 6, 4.3, d._txt(self.r(e["nota"], "funil.nota")), align="C")
            if i < n - 1:
                d.fonte(14, "B", CINZA)
                d.set_xy(x + bw - 1, y + 36)
                d.cell(gap + 2, 6, d._txt(">"), align="C")
        d.paragrafo(MARGEM, y + 80, W - 2 * MARGEM, self.r(t["rodape"], "funil.rodape"), 12.5, "I", CINZA)

    def glossario(self, chaves, parte):
        d, t = self.d, self.t["glossario"]
        titulo = self.r(t["titulo"], "glossario")
        y = d.novo_slide(titulo, self.r(t["regra_exemplo"], "glossario.regra"))
        mets = [x for x in t["metricas"] if x["chave"] in chaves]
        for met in mets:
            y += self._bloco_metrica(y, met) + 4

    def _bloco_metrica(self, y, met):
        d = self.d
        k = met["chave"]
        col = MARGEM + 78
        cw = (W - MARGEM - col - 6) / 2
        defi = self.r(met["definicao"], f"glossario.{k}")
        serve = self.r(met["serve"], f"glossario.{k}")
        h = max(30.0, 9 + max(d.altura_texto(cw - 4, defi, 11), d.altura_texto(cw - 2, serve, 11)) + 13)
        d.set_fill_color(*BEGE_CLARO)
        d.rect(MARGEM, y, W - 2 * MARGEM, h, style="F", round_corners=True, corner_radius=2.5)
        d.fonte(16, "B", VERDE_ESCURO)
        d.set_xy(MARGEM + 5, y + 4)
        d.cell(70, 8, d._txt(met["nome"]))
        d.fonte(10, "", CINZA)
        d.set_xy(MARGEM + 5, y + 13)
        d.multi_cell(65, 4.6, d._txt("Média da conta no período: " + self.ctx[f"periodo.{met['sufixo']}"]))
        d.fonte(9, "B", CINZA)
        d.set_xy(col, y + 4)
        d.cell(cw, 4.5, d._txt("O QUE É"))
        d.paragrafo(col, y + 9, cw - 4, defi, 11)
        d.fonte(9, "B", CINZA)
        d.set_xy(col + cw + 2, y + 4)
        d.cell(cw, 4.5, d._txt("PARA QUE SERVE"))
        d.paragrafo(col + cw + 2, y + 9, cw - 2, serve, 11)
        ex = self.m.exemplos.get(k)
        yy = y + h - 9
        if ex:
            txt = (f"Foi bem: **{self.ctx[f'exemplo.{k}.bom']}** ({self.ctx[f'exemplo.{k}.bom.valor']}).   "
                   f"Foi mal: **{self.ctx[f'exemplo.{k}.ruim']}** ({self.ctx[f'exemplo.{k}.ruim.valor']}).")
        else:
            txt = "Nenhum anúncio teve volume suficiente para servir de exemplo."
        d.set_fill_color(*BRANCO)
        d.rect(col, yy - 1, W - MARGEM - col - 4, 8, style="F", round_corners=True, corner_radius=1.5)
        d.paragrafo(col + 3, yy + 0.7, W - MARGEM - col - 10, txt, 10.5)
        return h

    # ---------------- fase 2 ----------------
    def evolucao(self):
        d, m = self.d, self.m
        nv = self.n.get("evolucao", {})
        y = d.novo_slide("Evolução geral", self.r(nv.get("subtitulo", "Gasto e conversas por mês."), "evolucao"))
        rot = [self._rotulo_mes(mm) for mm in m.meses]
        gastos = [m.por_mes[mm["chave"]]["gasto"] for mm in m.meses]
        conv = [m.por_mes[mm["chave"]]["conversas"] for mm in m.meses]
        cpr = [f.dinheiro(m.por_mes[mm["chave"]]["cpr"]) + " por conversa" for mm in m.meses]
        rot = [mm["nome"].capitalize() for mm in m.meses]
        wcol = 74
        w2 = (W - 2 * MARGEM - wcol - 16) / 2
        d.barras(MARGEM, y, w2, 68, rot, gastos, f.dinheiro, VERDE, "Gasto da Meta por mês")
        d.barras(MARGEM + w2 + 8, y, w2, 68, rot, conv, f.inteiro, AZUL_ESCURO, "Conversas iniciadas")
        c = self.ctx
        xc = W - MARGEM - wcol
        d.cartao(xc, y, wcol, 24, "Pago em recargas", c["periodo.pago"])
        d.cartao(xc, y + 26, wcol, 24, "Virou anúncio (gasto da Meta)", c["periodo.gasto"])
        d.cartao(xc, y + 52, wcol, 28, "Custo por conversa",
                 c["periodo.cpr_pago"], f"sobre o valor pago. Sobre o gasto da Meta: {c['periodo.cpr']}")
        notas = ["Custo por conversa: " + ", ".join(
            f"{mm['nome']} {f.dinheiro(m.por_mes[mm['chave']]['cpr'])}" for mm in m.meses) + "."]
        primeiro, ultimo = m.meses[0], m.meses[-1]
        if primeiro["inicio"].day != 1:
            notas.append(f"{primeiro['nome'].capitalize()} começa em {f.data_curta(primeiro['inicio'])}.")
        if ultimo["parcial"]:
            notas.append(f"{ultimo['nome'].capitalize()} vai só até {f.data_curta(ultimo['fim'])}: mês parcial.")
        d.fonte(8.5, "I", CINZA)
        d.set_xy(MARGEM, y + 69)
        d.multi_cell(W - 2 * MARGEM - wcol - 8, 4.2, d._txt(" ".join(notas)))
        yy = y + 84
        itens = self.rl(nv.get("leitura", []), "evolucao.leitura")
        d.lista(MARGEM, yy, W - 2 * MARGEM, itens, tam=10.5, espaco=1.2)
        self.nota_resultado(H - 15)

    def _rotulo_mes(self, mm):
        base = mm["nome"].capitalize()
        if mm["inicio"].day != 1:
            base += f" (desde {f.data_curta(mm['inicio'])})"
        if mm["parcial"]:
            base += f" (até {f.data_curta(mm['fim'])}, parcial)"
        return base

    def mes(self, mm):
        d, m = self.d, self.m
        k = mm["chave"]
        t = m.por_mes[k]
        nv = self.n.get("meses", {}).get(k, {})
        titulo = self._rotulo_mes(mm)
        sub = f"{f.data(mm['inicio'])} a {f.data(mm['fim'])}"
        if mm["parcial"]:
            sub += ". Mês ainda em andamento: os números vão mudar até o fim do mês."
        y = d.novo_slide(titulo, sub)
        if mm["parcial"]:
            d.rotulo(W - MARGEM - 34, MARGEM + 1.5, "mês parcial", VERMELHO)
        cw = (W - 2 * MARGEM - 3 * 4) / 4
        cards = [("Investimos", f.dinheiro(t["gasto"]), None),
                 ("Conversas iniciadas", f.inteiro(t["conversas"]),
                  "amostra pequena" if t["conversas"] < 10 else None),
                 ("Custo por conversa", f.dinheiro(t["cpr"]), f.faixa(t["ic_cpr"]) if t["ic_cpr"] else None),
                 ("Dias úteis sem anúncio", f"{f.inteiro(m.uteis_fora_por_mes.get(k, 0))} de {f.inteiro(m.uteis_por_mes.get(k, 0))}",
                  "fim de semana: decisão do estúdio")]
        for i, (r_, v, nota) in enumerate(cards):
            d.cartao(MARGEM + i * (cw + 4), y, cw, 25, r_, v, nota)
        if self.tem_leads:
            lm = m.leads_por_mes.get(k, {"leads": 0, "agendou": 0, "matriculou": 0})
            d.paragrafo(MARGEM, y + 26, W - 2 * MARGEM,
                        f"Planilha do estúdio: {f.inteiro(lm['leads'])} contatos, {f.inteiro(lm['agendou'])} agendamentos, "
                        f"{f.inteiro(lm['matriculou'])} matrículas.", 10, "B", VERDE_ESCURO)
        y += 30
        ads = sorted(m.ads_por_mes[k].items(), key=lambda kv: -kv[1]["gasto"])
        linhas = []
        for i, ta in ads:
            cpr = f.dinheiro(ta["cpr"]) + ("*" if ta["conversas"] < 10 else "") if ta["cpr"] else "sem conversa"
            linhas.append([m.b.anuncios[i]["nome"], f.dinheiro(ta["gasto"]), f.inteiro(ta["conversas"]), cpr])
        tw = 150
        lim = 8
        if len(linhas) > lim:
            outros = ads[lim:]
            g = sum(x[1]["gasto"] for x in outros)
            c = sum(x[1]["conversas"] for x in outros)
            linhas = linhas[:lim] + [[f"outros {len(outros)} anúncios", f.dinheiro(g), f.inteiro(c), ""]]
        d.fonte(10, "B", VERDE_ESCURO)
        d.set_xy(MARGEM, y)
        d.cell(tw, 5, d._txt("Anúncios que rodaram no mês"))
        yt = d.tabela(MARGEM, y + 6, [72, 28, 22, 28], ["Anúncio", "Investido", "Conversas", "Custo/conversa"],
                      linhas, tam=9.5, alt=6.2)
        d.fonte(8, "I", CINZA)
        d.set_xy(MARGEM, yt + 0.5)
        d.cell(tw, 4, d._txt("* menos de dez conversas: poucas para concluir"))
        porque = self.r(nv.get("porque", ""), f"meses.{k}.porque")
        if porque:
            d.caixa(MARGEM, yt + 6, tw, H - 18 - (yt + 6), "Por quê", porque, AZUL_ESCURO, 10.5)
        xr = MARGEM + tw + 6
        wr = W - MARGEM - xr
        certo = "\n".join("- " + x for x in self.rl(nv.get("certo", []), f"meses.{k}.certo")) or "Nada a destacar."
        errado = "\n".join("- " + x for x in self.rl(nv.get("errado", []), f"meses.{k}.errado")) or "Nada a destacar."
        total = H - 18 - y - 4
        a1, a2 = d.altura_texto(wr - 10, certo, 10.5), d.altura_texto(wr - 10, errado, 10.5)
        h1 = min(max(total * a1 / (a1 + a2), 34), total - 34)
        d.caixa(xr, y, wr, h1, "O que deu certo", certo, VERDE, 10.5)
        d.caixa(xr, y + h1 + 4, wr, total - h1, "O que deu errado", errado, VERMELHO, 10.5)
        self.nota_resultado(H - 15)

    def criativos(self):
        d, m = self.d, self.m
        nv = self.n.get("criativos", {})
        y = d.novo_slide("Comparação entre anúncios",
                         self.r(nv.get("subtitulo", "Custo por conversa de cada anúncio no período inteiro."), "criativos"))
        conclusao = self.r(nv.get("conclusao", ""), "criativos.conclusao")
        if conclusao:
            hc = d.altura_texto(W - 2 * MARGEM - 10, conclusao, 10.5) + 13
            d.caixa(MARGEM, y, W - 2 * MARGEM, hc, "O que a tabela mostra, e o que ela ainda não mostra", conclusao,
                    VERMELHO, 10.5)
            y += hc + 3
        linhas = []
        destaques = set()
        for slug, g in (nv.get("grupos") or {}).items():
            tg = m.grupo(set(g["ids"]))
            destaques.add(len(linhas))
            linhas.append([self.r(g["nome"], "criativos.grupo"), f.inteiro(tg["conversas"]), f.dinheiro(tg["cpr"]),
                           f.faixa(tg["ic_cpr"]), f.veredito(tg["veredito"])])
        ads = sorted(m.por_anuncio.items(), key=lambda kv: (kv[1]["cpr"] is None, kv[1]["cpr"] or 0))
        for i, ta in ads:
            linhas.append([m.b.anuncios[i]["nome"], f.inteiro(ta["conversas"]),
                           f.dinheiro(ta["cpr"]) if ta["cpr"] else "sem conversa",
                           f.faixa(ta["ic_cpr"]) if ta["vol_cpr"] else "", f.veredito(ta["veredito"])])
        alt = min(5.6, (H - 17 - y) / (len(linhas) + 1))
        d.tabela(MARGEM, y, [68, 22, 28, 62, 85], ["Anúncio", "Conversas", "Custo/conversa", "Faixa provável",
                                                    "Comparado ao resto da conta"],
                 linhas, tam=8.6 if alt < 5.6 else 8.8, alt=alt, alinhar=["L", "R", "R", "L", "L"],
                 destaque=lambda i: i in destaques)

    def conjuntos(self):
        d, m = self.d, self.m
        nv = self.n.get("conjuntos", {})
        y = d.novo_slide("Comparação entre conjuntos",
                         self.r(nv.get("subtitulo", "Os conjuntos definem para quem, onde e quando o anúncio aparece."), "conjuntos"))
        status_txt = {"ACTIVE": "ativo", "PAUSED": "pausado"}
        loc_txt = {"home": "mora", "recent": "esteve há pouco", "frequently_in": "frequenta"}
        linhas = []
        for cid, tc in sorted(m.por_conjunto.items(), key=lambda kv: -kv[1]["gasto"]):
            cfg = m.b.conjuntos.get(cid, {}).get("config", {})
            linhas.append([m.b.conjuntos.get(cid, {}).get("nome", cid),
                           status_txt.get(cfg.get("status"), "sem dado"),
                           f.dinheiro(tc["gasto"]), f.inteiro(tc["conversas"]), f.dinheiro(tc["cpr"]),
                           f.faixa(tc["ic_cpr"]) if tc["vol_cpr"] else "",
                           self.r(nv["vereditos"][cid], "conjuntos.vereditos") if cid in (nv.get("vereditos") or {})
                           else f.veredito(tc["veredito"])])
        yt = d.tabela(MARGEM, y, [42, 18, 27, 21, 27, 52, 78], ["Conjunto", "Hoje", "Investido", "Conversas",
                                                              "Custo/conversa", "Faixa provável", "Comparado ao resto"],
                      linhas, tam=9, alt=6.2, alinhar=["L", "L", "R", "R", "R", "L", "L"])
        linhas2 = []
        for cid in sorted(m.por_conjunto, key=lambda c: -m.por_conjunto[c]["gasto"]):
            cfg = m.b.conjuntos.get(cid, {}).get("config", {})
            locs = ", ".join(loc_txt.get(x, x) for x in cfg.get("location_types", [])) or "sem dado"
            linhas2.append([m.b.conjuntos.get(cid, {}).get("nome", cid), locs,
                            "sim" if cfg.get("exclusao_publico_engajamento") else "não",
                            "sim" if cfg.get("adset_schedule") else "não"])
        d.fonte(10, "B", VERDE_ESCURO)
        d.set_xy(MARGEM, yt + 4)
        d.cell(0, 5, d._txt("Como cada conjunto está configurado"))
        yt2 = d.tabela(MARGEM, yt + 10, [44, 66, 92, 63], ["Conjunto", "Quem vê, no raio do estúdio",
                                                          "Esconde de quem interagiu com o Instagram no último ano",
                                                          "Tem horário programado"],
                       linhas2, tam=9, alt=6.2, alinhar=["L", "L", "L", "L"])
        leitura = self.r(nv.get("leitura", ""), "conjuntos.leitura")
        if leitura:
            d.caixa(MARGEM, yt2 + 4, W - 2 * MARGEM, H - 16 - (yt2 + 4), "O que isso quer dizer", leitura, AZUL_ESCURO, 10.5)

    def fora_do_ar(self):
        d, m = self.d, self.m
        nv = self.n.get("fora_do_ar", {})
        y = d.novo_slide("Dias sem anúncio no ar",
                         self.r(nv.get("subtitulo", "Cada quadrado é um dia. Verde: anúncio no ar. Bege: fora do ar."), "fora"))
        rec = {r["data"] for r in m.b.recargas}
        yc = d.calendario(MARGEM, y + 2, m.dias, rec)
        legenda = [(VERDE, "anúncio no ar"), (VERMELHO_CLARO, "dia útil sem anúncio (saldo zerado)"),
                   (BEGE, "fim de semana ou feriado sem anúncio (decisão do estúdio)")]
        d.fonte(9, "", CINZA)
        for i, (cor, txt) in enumerate(legenda):
            d.set_fill_color(*cor)
            d.rect(MARGEM, yc + i * 6, 4, 4, style="F")
            d.set_xy(MARGEM + 5.5, yc + i * 6 - 0.3)
            d.cell(80, 4.5, d._txt(txt))
        yl = yc + 3 * 6
        d.set_fill_color(*VERDE)
        d.rect(MARGEM, yl, 4, 4, style="F")
        d.set_fill_color(*BRANCO)
        d.ellipse(MARGEM + 0.9, yl + 0.9, 2.2, 2.2, style="F")
        d.set_xy(MARGEM + 5.5, yl - 0.3)
        d.cell(80, 4.5, d._txt("dia de recarga de saldo"))
        xr = MARGEM + 9 + 5.6 * 15 + 8
        wr = W - MARGEM - xr
        cw = (wr - 8) / 3
        c = self.ctx
        d.cartao(xr, y, cw, 32, "Dias úteis sem anúncio", f"{c['periodo.dias_uteis_fora']} de {c['periodo.dias_uteis']}",
                 "não intencional: saldo zerado")
        d.cartao(xr + cw + 4, y, cw, 32, "Fim de semana e feriado", c["periodo.descanso_fora"],
                 "decisão do estúdio")
        d.cartao(xr + 2 * (cw + 4), y, cw, 32, "Recargas de saldo", c["periodo.recargas"],
                 f"total pago: {c['periodo.pago']}")
        y += 5
        linhas = [[mm["nome"].capitalize() + (" (parcial)" if mm["parcial"] else ""),
                   f"{f.inteiro(m.uteis_fora_por_mes.get(mm['chave'], 0))} de {f.inteiro(m.uteis_por_mes.get(mm['chave'], 0))}",
                   f.inteiro(m.descanso_fora_por_mes.get(mm["chave"], 0))] for mm in m.meses]
        yt = d.tabela(xr, y + 31, [wr * 0.34, wr * 0.33, wr * 0.33],
                      ["Mês", "Dias úteis sem anúncio", "Fim de semana e feriado"], linhas, tam=9.5, alt=6)
        itens = self.rl(nv.get("texto", []), "fora.texto")
        d.lista(xr, yt + 4, wr, itens, tam=10.5, espaco=1.5)

    def horario(self):
        d, m = self.d, self.m
        nv = self.n.get("horario", {})
        y = d.novo_slide("Em que horário os anúncios aparecem",
                         self.r(nv.get("subtitulo", "Programação de cada conjunto, convertida para o horário de Brasília."), "horario"))
        status_txt = {"ACTIVE": "ativo hoje", "PAUSED": "pausado hoje"}
        linhas = []
        for cid in sorted(m.b.conjuntos, key=lambda c: -(m.por_conjunto.get(c, {}).get("gasto", 0))):
            cfg = m.b.conjuntos[cid]["config"]
            prog = m.resumo_programacao(cid)
            linhas.append([m.b.conjuntos[cid]["nome"], status_txt.get(cfg.get("status"), "sem dado"),
                           prog or "sem programação: pode aparecer a qualquer hora"])
        yt = d.tabela(MARGEM, y, [48, 30, W - 2 * MARGEM - 78], ["Conjunto", "Situação", "Quando pode aparecer (Brasília)"],
                      linhas, tam=9.5, alt=6.6, alinhar=["L", "L", "L"])
        w2 = (W - 2 * MARGEM - 6) / 2
        estudio = self.r(nv.get("estudio", ""), "horario.estudio")
        if estudio:
            d.caixa(MARGEM, yt + 5, w2, H - 16 - (yt + 5), "Horário do estúdio", estudio, VERDE, 10.5)
        itens = self.rl(nv.get("texto", []), "horario.texto")
        d.caixa(MARGEM + w2 + 6, yt + 5, w2, H - 16 - (yt + 5), "O que isso quer dizer",
                "\n".join("- " + x for x in itens), AZUL_ESCURO, 10.5)

    # ---------------- fase 3 ----------------
    def ajustes(self):
        d = self.d
        nv = self.n.get("ajustes", {})
        y = d.novo_slide("Ajustes na configuração da conta",
                         self.r(nv.get("subtitulo", "Mudanças de configuração, sem mexer nos vídeos."), "ajustes"))
        itens = nv.get("itens", [])
        h = (H - 16 - y) / max(len(itens), 1) - 3
        for i, it in enumerate(itens):
            self._linha_acao(y, h, it, f"ajustes[{i}]")
            y += h + 3

    def _linha_acao(self, y, h, it, onde):
        d = self.d
        d.set_fill_color(*BEGE_CLARO)
        d.rect(MARGEM, y, W - 2 * MARGEM, h, style="F", round_corners=True, corner_radius=2)
        conf = it["confianca"]
        d.rotulo(MARGEM + 4, y + 3, "confiança " + conf, COR_CONFIANCA[conf])
        acao = self.r(it["acao"], onde + ".acao")
        wa = 122
        tam = d.caber(wa, acao, h - 11, 12, 8.5, "B")
        d.paragrafo(MARGEM + 4, y + 10, wa, acao, tam, "B", VERDE_ESCURO)
        ev = self.r(it["evidencia"], onde + ".evidencia")
        xe = MARGEM + wa + 10
        tam2 = d.caber(W - MARGEM - xe - 4, ev, h - 5, 10.5, 7.5)
        d.paragrafo(xe, y + 3, W - MARGEM - xe - 4, ev, tam2)

    def ideias(self, parte):
        d = self.d
        nv = self.n.get("ideias", {})
        todas = nv.get("itens", [])
        meio = (len(todas) + 1) // 2
        itens = todas[:meio] if parte == 1 else todas[meio:]
        y = d.novo_slide(f"Ideias de novos anúncios ({parte} de 2)",
                         self.r(nv.get("subtitulo", ""), "ideias") or None)
        n = max(len(itens), 1)
        gap = 5
        bw = (W - 2 * MARGEM - gap * (n - 1)) / n
        hb = H - 16 - y
        for i, it in enumerate(itens):
            x = MARGEM + i * (bw + gap)
            onde = f"ideias[{parte}.{i}]"
            d.set_fill_color(*BEGE_CLARO)
            d.rect(x, y, bw, hb, style="F", round_corners=True, corner_radius=2.5)
            d.rotulo(x + 4, y + 3.5, "confiança " + it["confianca"], COR_CONFIANCA[it["confianca"]])
            d.fonte(13, "B", VERDE_ESCURO)
            d.set_xy(x + 4, y + 11)
            d.multi_cell(bw - 8, 6, d._txt(self.r(it["titulo"], onde)))
            yy = d.get_y() + 1.5
            blocos = [("A ideia", it["ideia"]), ("O que a conta mostra", it["evidencia"]),
                      ("Base no framework de marca", it["framework"])]
            alt_disp = (y + hb - 3 - yy) / 3
            for rot, txt in blocos:
                d.fonte(8.5, "B", CINZA)
                d.set_xy(x + 4, yy)
                d.cell(bw - 8, 4.5, d._txt(rot.upper()))
                corpo = self.r(txt, onde)
                tam = d.caber(bw - 8, corpo, alt_disp - 6, 10.5, 7.5)
                d.paragrafo(x + 4, yy + 5, bw - 8, corpo, tam)
                yy += alt_disp

    def medir(self):
        d = self.d
        nv = self.n.get("medir", {})
        y = d.novo_slide("Como vamos saber se funcionou",
                         self.r(nv.get("subtitulo", "Para cada mudança, o número que vamos acompanhar."), "medir"))
        linhas = [[self.r(x["acao"], "medir"), self.r(x["olhar"], "medir"), self.r(x["quando"], "medir")]
                  for x in nv.get("itens", [])]
        larg = [80, 90, W - 2 * MARGEM - 170]
        d.set_fill_color(*VERDE)
        d.fonte(9.5, "B", BRANCO)
        xx = MARGEM
        for w_, c in zip(larg, ["Mudança", "Número para acompanhar", "Quando dá para concluir"]):
            d.set_xy(xx, y)
            d.cell(w_, 7, d._txt(c), fill=True)
            xx += w_
        y += 7
        for i, lin in enumerate(linhas):
            alturas = [d.altura_texto(w_ - 3, c, 10) for w_, c in zip(larg, lin)]
            h = max(alturas) + 4
            d.set_fill_color(*(BEGE_CLARO if i % 2 == 0 else BRANCO))
            d.rect(MARGEM, y, sum(larg), h, style="F")
            xx = MARGEM
            for w_, c in zip(larg, lin):
                d.paragrafo(xx + 1.5, y + 2, w_ - 3, c, 10)
                xx += w_
            y += h
        self.nota_resultado(H - 15)

    def fontes(self):
        d, t = self.d, self.t["fontes"]
        y = d.novo_slide(self.r(t["titulo"], "fontes"))
        m = self.m
        itens = self.rl(t["itens"], "fontes.itens")
        if not self.tem_leads:
            itens.append(self.r(t["sem_leads"], "fontes.sem_leads"))
        itens += self.rl(self.n.get("fontes_extra", []), "fontes_extra")
        yl = d.lista(MARGEM, y, 175, itens, tam=10.5, espaco=2.5)
        xr = MARGEM + 185
        wr = W - MARGEM - xr
        c = self.ctx
        d.cartao(xr, y, wr, 23, "Pago em recargas no período", c["periodo.pago"])
        d.cartao(xr, y + 26, wr, 23, "Virou anúncio no período", c["periodo.gasto"])
        d.cartao(xr, y + 52, wr, 23, "Conversas iniciadas no período", c["periodo.conversas"])
        d.cartao(xr, y + 78, wr, 23, "Período", f"{f.data_curta(m.b.inicio)} a {c['periodo.fim']}")
