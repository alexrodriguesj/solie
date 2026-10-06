# Relatório de evolução do Meta Ads (PDF em slides)

Gera um PDF 16:9 para as sócias com a evolução da conta `act_248687653`, mês a mês, a partir de dados coletados em modo somente leitura.

## Comando

```bash
python scripts/relatorio_meta/gerar.py --inicio 2026-06-30 --fim 2026-10-05 \
    --dados reports/meta/2026-06-30_2026-10-05
```

Saída em `reports/meta/<inicio>_<fim>/`: `relatorio.pdf`, `contexto.json` (todos os marcadores disponíveis) e `checagem.txt`.
O comando termina com erro (código 1) se a checagem final encontrar divergência.

Dependências: `fpdf2`, `PyYAML`, `scipy`, `PyMuPDF` (checagem). Fonte Lato embutida em `fontes/` (licença OFL).

## Relatório do mês que vem, passo a passo

1. **Análise do mês** com o agente `meta-ads-analyst` (gera `reports/meta/<AAAA-MM>/dados.json` e `raw/`).
2. **Coleta da série completa** (Claude, via MCP `meta-ads`, só leitura), salva em `<pasta de dados>/coleta/`:
   - `anuncios_mensal.json`: `ads_get_ad_entities`, `level=ad`, `time_increment="monthly"`, `time_range` do período inteiro, filtro `ad.amount_spent > 0`, campos `id, name, adset_id, impressions, amount_spent, clicks, link_click, video_play_actions, video_thruplay_watched_actions, video_p25/p50/p75/p100_watched_actions, results, cost_per_video_view, cost_per_action_type`.
   - `anuncios_diario_NN.json`: mesma consulta com `time_increment="1"`, **no máximo 2 anúncios por chamada** via `object_ids` (a API corta em 200 linhas e não devolve cursor). O script aborta se faltar algum dia de algum anúncio.
   - Respostas grandes são gravadas em arquivo pelo próprio Claude Code: copie o arquivo tal como veio, sem editar.
3. **`fontes.yaml`**: aponte `analise_dados_json` para o `dados.json` mais recente e liste os logs de atividade (recargas e status da campanha).
4. **`python gerar.py ... --contexto`** para gerar `contexto.json` com as chaves disponíveis.
5. **`narrativa.yaml`**: textos interpretativos do período (o que deu certo, errado, por quê, ajustes, ideias). Revisão humana antes de gerar o PDF.
6. **`python gerar.py ...`** gera o PDF e roda a checagem.

## Regras dos textos

- Nenhum algarismo digitado: `{chave}` insere um valor calculado; `{lit:3 segundos}` marca um número literal (horário, nome com número, referência ao framework). Algarismo fora de marcador interrompe a geração.
- Travessão longo e emoji são bloqueados.
- Textos fixos da fase 1 ficam em `template_fase1.yaml`; os do período, em `narrativa.yaml`.

## Regras de cálculo

- Meses no fuso da conta (`America/Los_Angeles`). Um primeiro mês com menos de 7 dias é somado ao seguinte; o último mês incompleto aparece como parcial.
- Hook e hold usam só anúncios de vídeo (o formato vem do `dados.json` do analista).
- Plays de 3 s e primeiras respostas são derivados: gasto / custo por ação, arredondado.
- Volume mínimo: 1.000 impressões para taxas, 10 conversas para custo por conversa e taxa de resposta. Faixas a 90% (Wilson e Poisson). "Diferença confirmada" só quando as faixas não se cruzam.
- Dias fora do ar: dias sem impressão. Cada parada é classificada pelo dia em que a entrega voltou (recarga de saldo, religamento manual ou outro).
