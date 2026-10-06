"""Marcadores de texto.

- {chave}: valor calculado pelo script (ver contexto.json para as chaves disponiveis).
- {lit:texto}: texto literal que pode conter algarismos (ex.: {lit:3 segundos}, {lit:Passo 02}).

Qualquer algarismo fora de um marcador e erro: assim nenhum numero entra digitado no PDF.
Travessao longo e emoji tambem sao bloqueados.
"""
import re

MARCADOR = re.compile(r"\{([^{}]+)\}")
PROIBIDOS = ("—", "–")
EMOJI = re.compile("[\U0001F300-\U0001FAFF☀-➿]")


class ErroTexto(Exception):
    pass


def validar_fonte(texto, onde):
    sem_marcadores = MARCADOR.sub("", texto)
    m = re.search(r"\d", sem_marcadores)
    if m:
        ini = max(0, m.start() - 30)
        raise ErroTexto(f"{onde}: algarismo fora de marcador perto de '...{sem_marcadores[ini:m.start() + 10]}...'. "
                        "Use {chave} para valor calculado ou {lit:...} para numero literal.")
    checar_saida(texto, onde)


def checar_saida(texto, onde):
    for c in PROIBIDOS:
        if c in texto:
            raise ErroTexto(f"{onde}: travessao proibido")
    if EMOJI.search(texto):
        raise ErroTexto(f"{onde}: emoji proibido")


def render(texto, ctx, onde):
    if texto is None:
        return ""
    validar_fonte(texto, onde)

    def sub(m):
        chave = m.group(1).strip()
        if chave.startswith("lit:"):
            return chave[4:]
        if chave not in ctx:
            raise ErroTexto(f"{onde}: marcador sem valor: {{{chave}}}")
        return ctx[chave]

    saida = MARCADOR.sub(sub, texto)
    checar_saida(saida, onde)
    return saida
