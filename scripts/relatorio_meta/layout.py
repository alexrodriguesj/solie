"""Componentes visuais dos slides (fpdf2). Pagina 16:9 em milimetros."""
import os

from fpdf import FPDF
from fpdf.enums import XPos, YPos

import textos

AQUI = os.path.dirname(os.path.abspath(__file__))
W, H = 297.0, 167.06
MARGEM = 16.0

VERDE = (75, 100, 79)
VERDE_ESCURO = (58, 79, 61)
VERDE_CLARO = (107, 132, 111)
BEGE = (229, 221, 211)
BEGE_CLARO = (245, 241, 237)
AZUL = (122, 155, 168)
AZUL_ESCURO = (90, 123, 136)
VERMELHO = (168, 84, 84)
VERMELHO_CLARO = (214, 160, 160)
TEXTO = (26, 26, 26)
CINZA = (107, 114, 128)
BRANCO = (255, 255, 255)

COR_CONFIANCA = {"alta": VERDE, "média": AZUL_ESCURO, "media": AZUL_ESCURO, "baixa": VERMELHO}


class Deck(FPDF):
    def __init__(self, rodape):
        super().__init__(orientation="L", unit="mm", format=(H, W))
        self.set_auto_page_break(False)
        self.set_margins(MARGEM, MARGEM, MARGEM)
        f = os.path.join(AQUI, "fontes")
        self.add_font("Lato", "", os.path.join(f, "Lato-Regular.ttf"))
        self.add_font("Lato", "B", os.path.join(f, "Lato-Bold.ttf"))
        self.add_font("Lato", "I", os.path.join(f, "Lato-Italic.ttf"))
        self.add_font("LatoLight", "", os.path.join(f, "Lato-Light.ttf"))
        self.rodape_txt = rodape
        self.n_slide = 0
        self.textos_renderizados = []

    # ---------- base ----------
    def multi_cell(self, *args, **kwargs):
        # alinhamento a esquerda por padrao: texto justificado abre buracos em colunas estreitas
        kwargs.setdefault("align", "L")
        return super().multi_cell(*args, **kwargs)

    def _txt(self, s):
        s = "" if s is None else str(s)
        textos.checar_saida(s, f"slide {self.n_slide}")
        self.textos_renderizados.append(s)
        return s

    def fonte(self, tamanho, estilo="", cor=TEXTO, familia="Lato"):
        self.set_font(familia, estilo, tamanho)
        self.set_text_color(*cor)

    def novo_slide(self, titulo=None, subtitulo=None, fundo=BRANCO, rodape=True):
        self.add_page()
        self.n_slide += 1
        self.set_fill_color(*fundo)
        self.rect(0, 0, W, H, style="F")
        y = MARGEM
        if titulo:
            self.set_fill_color(*VERDE)
            self.rect(0, 0, 5, H, style="F")
            self.fonte(22, "B", VERDE_ESCURO)
            self.set_xy(MARGEM, y)
            self.multi_cell(W - 2 * MARGEM, 10, self._txt(titulo))
            y = self.get_y() + 1
            if subtitulo:
                self.fonte(12, "", CINZA)
                self.set_xy(MARGEM, y)
                self.multi_cell(W - 2 * MARGEM, 6, self._txt(subtitulo))
                y = self.get_y() + 2
            y += 3
        if rodape:
            self.fonte(8, "", CINZA)
            self.set_xy(MARGEM, H - 9)
            self.cell(W / 2, 5, self._txt(self.rodape_txt))
            self.set_xy(W - MARGEM - 20, H - 9)
            self.cell(20, 5, self._txt(str(self.n_slide)), align="R")
        return y

    def divisoria(self, fase, titulo, resumo):
        self.add_page()
        self.n_slide += 1
        self.set_fill_color(*VERDE)
        self.rect(0, 0, W, H, style="F")
        self.fonte(14, "", BEGE, "Lato")
        self.set_xy(MARGEM + 8, 52)
        self.cell(0, 8, self._txt(fase))
        self.fonte(34, "B", BRANCO)
        self.set_xy(MARGEM + 8, 64)
        self.multi_cell(W - 2 * MARGEM - 16, 15, self._txt(titulo))
        self.fonte(14, "", BEGE_CLARO, "LatoLight")
        self.set_xy(MARGEM + 8, self.get_y() + 4)
        self.multi_cell(W - 2 * MARGEM - 40, 7, self._txt(resumo))

    # ---------- texto ----------
    def paragrafo(self, x, y, w, texto, tam=12, estilo="", cor=TEXTO, entre=None, familia="Lato"):
        entre = entre or tam * 0.48
        self.fonte(tam, estilo, cor, familia)
        self.set_xy(x, y)
        self.multi_cell(w, entre, self._txt(texto), markdown=True, align="L")
        return self.get_y()

    def altura_texto(self, w, texto, tam=12, estilo="", entre=None):
        entre = entre or tam * 0.48
        self.set_font("Lato", estilo, tam)
        linhas = self.multi_cell(w, entre, texto or "", markdown=True, align="L", dry_run=True, output="LINES")
        return len(linhas) * entre

    def caber(self, w, texto, h_max, tam=12, minimo=8, estilo=""):
        """Maior tamanho de fonte que faz o texto caber em h_max."""
        while tam > minimo and self.altura_texto(w, texto, tam, estilo) > h_max:
            tam -= 0.5
        return tam

    def lista(self, x, y, w, itens, tam=12, marcador_cor=VERDE, espaco=2.2):
        for it in itens:
            self.set_fill_color(*marcador_cor)
            self.ellipse(x, y + tam * 0.17, 2.0, 2.0, style="F")
            y = self.paragrafo(x + 5, y, w - 5, it, tam) + espaco
        return y

    def rotulo(self, x, y, texto, cor=VERDE, tam=8.5):
        self.fonte(tam, "B", BRANCO)
        t = self._txt(texto.upper())
        larg = self.get_string_width(t) + 5
        self.set_fill_color(*cor)
        self.rect(x, y, larg, 5.4, style="F", round_corners=True, corner_radius=1.2)
        self.set_xy(x, y + 0.2)
        self.cell(larg, 5, t, align="C")
        return larg

    # ---------- blocos ----------
    def cartao(self, x, y, w, h, rotulo, valor, nota=None, cor=VERDE):
        self.set_fill_color(*BEGE_CLARO)
        self.rect(x, y, w, h, style="F", round_corners=True, corner_radius=2.5)
        self.fonte(9, "B", CINZA)
        self.set_xy(x + 4, y + 3.5)
        self.multi_cell(w - 8, 4.5, self._txt(rotulo.upper()))
        self.fonte(20, "B", cor)
        self.set_xy(x + 4, self.get_y() + 1)
        self.multi_cell(w - 8, 9, self._txt(valor))
        if nota:
            self.fonte(9, "", CINZA)
            self.set_xy(x + 4, self.get_y() + 0.5)
            self.multi_cell(w - 8, 4.3, self._txt(nota))

    def caixa(self, x, y, w, h, titulo, corpo, cor=VERDE, tam=11):
        self.set_fill_color(*BEGE_CLARO)
        self.rect(x, y, w, h, style="F", round_corners=True, corner_radius=2.5)
        self.set_fill_color(*cor)
        self.rect(x, y, 2.2, h, style="F")
        self.fonte(11.5, "B", cor)
        self.set_xy(x + 6, y + 3.5)
        self.multi_cell(w - 10, 5.5, self._txt(titulo))
        yy = self.get_y() + 1
        disp = h - (yy - y) - 3
        tam = self.caber(w - 10, corpo, disp, tam, 7.5)
        self.paragrafo(x + 6, yy, w - 10, corpo, tam)

    def tabela(self, x, y, larguras, cabecalho, linhas, tam=10, alt=7.2, alinhar=None, destaque=None):
        alinhar = alinhar or ["L"] + ["R"] * (len(larguras) - 1)
        self.set_fill_color(*VERDE)
        self.fonte(tam - 0.5, "B", BRANCO)
        xx = x
        for w, c, a in zip(larguras, cabecalho, alinhar):
            self.set_xy(xx, y)
            self.cell(w, alt, self._txt(c), fill=True, align=a)
            xx += w
        y += alt
        for i, lin in enumerate(linhas):
            fundo = BEGE_CLARO if i % 2 == 0 else BRANCO
            self.set_fill_color(*fundo)
            xx = x
            negrito = destaque and destaque(i)
            for w, c, a in zip(larguras, lin, alinhar):
                self.fonte(tam, "B" if negrito else "", TEXTO)
                self.set_xy(xx, y)
                txt = self._txt(c)
                while self.get_string_width(txt) > w - 2 and len(txt) > 4:
                    txt = txt[:-2].rstrip() + "…"
                self.cell(w, alt, txt, fill=True, align=a)
                xx += w
            y += alt
        return y

    def barras(self, x, y, w, h, rotulos, valores, fmt, cor=VERDE, titulo=None, notas=None):
        if titulo:
            self.fonte(11, "B", VERDE_ESCURO)
            self.set_xy(x, y)
            self.cell(w, 6, self._txt(titulo))
            y += 9
            h -= 9
        base = y + h - 12
        vmax = max(valores) if valores and max(valores) > 0 else 1
        n = len(valores)
        passo = w / n
        larg = passo * 0.55
        self.set_draw_color(*BEGE)
        self.set_line_width(0.3)
        self.line(x, base, x + w, base)
        for i, (r, v) in enumerate(zip(rotulos, valores)):
            bh = (h - 24) * v / vmax
            bx = x + i * passo + (passo - larg) / 2
            self.set_fill_color(*cor)
            self.rect(bx, base - bh, larg, bh, style="F")
            self.fonte(10, "B", TEXTO)
            self.set_xy(bx - 6, base - bh - 6)
            self.cell(larg + 12, 5, self._txt(fmt(v)), align="C")
            self.fonte(9.5, "", CINZA)
            self.set_xy(x + i * passo, base + 1.5)
            self.cell(passo, 5, self._txt(r), align="C")
            if notas:
                self.fonte(8.5, "", CINZA)
                self.set_xy(x + i * passo, base + 6)
                self.cell(passo, 4.5, self._txt(notas[i]), align="C")

    def calendario(self, x, y, dias, recargas, larg_celula=5.6, alt_celula=5.6):
        """Uma coluna por semana, uma linha por dia da semana (seg..dom)."""
        if not dias:
            return y
        primeiro = dias[0]["data"]
        nomes = ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"]
        self.fonte(7.5, "", CINZA)
        for i, n in enumerate(nomes):
            self.set_xy(x, y + i * alt_celula + 0.6)
            self.cell(8, 4, self._txt(n))
        x0 = x + 9
        semana0 = primeiro.toordinal() - primeiro.weekday()
        meses_vistos = set()
        for d in dias:
            dd = d["data"]
            col = (dd.toordinal() - dd.weekday() - semana0) // 7
            lin = dd.weekday()
            cx, cy = x0 + col * larg_celula, y + lin * alt_celula
            if d["no_ar"]:
                cor = VERDE
            elif d.get("tipo", "util") == "util":
                cor = VERMELHO_CLARO
            else:
                cor = BEGE
            self.set_fill_color(*cor)
            self.rect(cx, cy, larg_celula - 0.8, alt_celula - 0.8, style="F")
            if dd in recargas:
                self.set_fill_color(*VERDE_ESCURO if not d["no_ar"] else BRANCO)
                self.ellipse(cx + larg_celula / 2 - 1.6, cy + alt_celula / 2 - 1.6, 2.2, 2.2, style="F")
            if dd.day <= 7 and dd.month not in meses_vistos and lin == 0:
                meses_vistos.add(dd.month)
                self.fonte(7.5, "B", CINZA)
                self.set_xy(cx, y + 7 * alt_celula + 0.5)
                from metricas import MESES
                self.cell(20, 4, self._txt(MESES[dd.month - 1]))
        return y + 7 * alt_celula + 6
