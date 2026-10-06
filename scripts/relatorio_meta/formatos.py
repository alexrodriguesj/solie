"""Formatacao pt-BR dos numeros que aparecem no PDF."""

MESES_CURTOS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"]


def _milhar(s):
    return s.replace(",", "X").replace(".", ",").replace("X", ".")


def dinheiro(v):
    if v is None:
        return "sem dado"
    return "R$ " + _milhar(f"{v:,.2f}")


def inteiro(v):
    if v is None:
        return "sem dado"
    return _milhar(f"{int(round(v)):,}")


def pct(v, casas=1):
    if v is None:
        return "sem dado"
    return _milhar(f"{v * 100:,.{casas}f}") + "%"


def por_mil(v):
    """Taxa por mil exibicoes, ex.: '4,2 a cada mil'."""
    if v is None:
        return "sem dado"
    return _milhar(f"{v * 1000:,.1f}") + " a cada mil"


def faixa(ic):
    if ic is None:
        return "sem dado"
    lo, hi = ic
    return f"entre {dinheiro(lo)} e {dinheiro(hi) if hi else 'sem limite'}"


def data(d):
    return f"{d.day:02d}/{d.month:02d}/{d.year}"


def data_curta(d):
    return f"{d.day:02d}/{d.month:02d}"


def hora(h, m=0):
    return f"{h:02d}h" if m == 0 else f"{h:02d}h{m:02d}"


def veredito(v):
    return {
        "mais_barato": "mais barato que o resto, diferença confirmada",
        "mais_caro": "mais caro que o resto, diferença confirmada",
        "incerto": "ainda não dá para saber",
        "pouca": "poucas conversas para concluir",
    }[v]
