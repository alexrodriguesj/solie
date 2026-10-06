# Meta Ads - Soliê Pilates - análise técnica de setembro de 2026

- Conta `act_248687653` (BRL, fuso America/Los_Angeles). Pedido: "use o meta-ads-analyst para analisar setembro de 2026".
- P1 = 2026-09-01 a 2026-09-30; P0 = 2026-08-01 a 2026-08-31; H = last_90d (2026-07-08 a 2026-10-05); vida = maximum. Datas no fuso da conta.
- Gerado em 2026-10-06. Fonte: MCP meta-ads, somente leitura. Respostas brutas em `raw/`, scripts em `calc/` (`analise.py`, `impactos.py`, `gera_dados.py`, `gera_analise.py`).
- Convenções: FATO = dado da API ou cálculo direto; LEITURA = interpretação; HIPÓTESE = a testar. Intervalos de confiança a 90% (Wilson para taxas, Poisson para custo por conversa). Contagens derivadas de custo por ação estão marcadas como derivadas em `dados.json`.
- Todo o gasto da conta em H é de anúncios da página Soliê Pilates (`858008294053600`); não há gasto de outras páginas a listar à parte.

## Sumário: achados ordenados por impacto estimado

1. **A entrega e limitada pelo saldo pre-pago: cada recarga vira R$ 87,85 de anuncio e a conta para quando o saldo zera** (LEITURA, confiança alta).
   - Evidência: FATO: nas 12 semanas completas de H, gasto semanal / numero de recargas = R$ 87,83 a R$ 87,88; os 15 blocos de dias sem entrega em H terminaram todos no dia de uma recarga (15/15). Em setembro houve 10 dias sem nenhuma impressao (todos os sabados e domingos, 07/09 e 11/09). LEITURA: o orcamento diario de R$ 30 dos conjuntos nao e a restricao efetiva; quem define volume e calendario e a recarga.
   - Impacto estimado: HIPOTESE: R$ 272,86 de veiculacao nao realizada em P1 (10 dias x R$ 27,29 por dia com entrega), equivalente a ~21 conversas ao custo de P1, se fim de semana rendesse igual (nao medido).
2. **Cafe com Pilates e o unico criativo com custo por conversa conclusivamente menor que o resto da conta** (FATO, confiança alta).
   - Evidência: H: os dois criativos Cafe com Pilates somam 51 conversas a R$ 7,44 (IC 90% R$ 5,90 a R$ 9,53) contra R$ 14,43 (IC R$ 12,26 a R$ 17,09) no restante; intervalos nao se sobrepoem. Em P1, Cafe com Pilates - Setembro fez 14 conversas a R$ 7,97 contra R$ 15,51 no resto de P1 (nao conclusivo isoladamente). Diagnostico dos dois: D4, hook abaixo da mediana com hold e taxa de conversa acima.
   - Impacto estimado: 6,8 conversas a mais em P1 que o mesmo gasto teria gerado ao custo do restante de P1 (~R$ 105,57 equivalentes).
3. **O unico anuncio em veiculacao hoje (Novo Horario - Almoco) publica uma nota interna no texto e tem abertura fraca** (FATO, confiança alta para o texto; media para o hook).
   - Evidência: O texto principal comeca com 'Resolve a objecao de tempo, que e a mais comum em quem trabalha sentado.' (briefing interno). Hook 22,2% contra mediana 27,3% dos videos de H (IC 90% 21,1% a 23,3%, exclui a mediana); 8 conversas a R$ 18,79 (abaixo do volume minimo de 10 para custo por conversa).
   - Impacto estimado: R$ 150,28 ja veiculados com esse texto (01/10 a 06/10); fora de P1, mas e o anuncio que recebe todo o gasto agora.
4. **Roberto e Duda concentrou metade do gasto de setembro com CPM alto e taxa de resposta abaixo da mediana** (LEITURA, confiança media).
   - Evidência: P1: R$ 268,85 (49,3% do gasto), 21 conversas a R$ 12,80 (IC R$ 8,89 a R$ 19,11); CPM R$ 62,93 contra mediana R$ 43,02; primeira resposta em 17 de 21 (81,0%) contra mediana 92,8%; no ciclo de vida o IC da taxa de resposta (65,1% a 88,1%) fica abaixo da mediana. Diagnostico de vida: D6 (pela matriz base seria D5, com hook, hold e taxa de conversa acima da mediana e IC excluindo a mediana; rebaixado pela taxa de resposta). Unico conjunto sem exclusao do publico de engajamento (Casal).
   - Impacto estimado: R$ 85,08 pagos acima do CPM mediano em P1; ~2,5 conversas com resposta a menos que a mediana (~R$ 31,77).
5. **O conjunto Setembro - Novo custou o dobro por conversa do Casal, mas a diferenca nao e conclusiva** (LEITURA, confiança baixa).
   - Evidência: P1: Setembro - Novo R$ 22,32 (IC R$ 11,88 a R$ 47,56, 7 conversas) contra Casal R$ 10,87 (IC R$ 8,20 a R$ 14,70, 35 conversas). Intervalos se sobrepoem. 4-motivos-solie: 3 conversas a R$ 29,52; bem-vindos-Solie: 4 a R$ 16,92. Os dois foram pausados em 30/09 apos 9 dias.
   - Impacto estimado: Se a diferenca for real: ~7,4 conversas a menos em P1 (~R$ 80,15).
6. **A programacao de horario dos conjuntos esta no fuso de Los Angeles: os anuncios so rodam das 11h a 01h de Brasilia** (FATO, confiança alta).
   - Evidência: adset_schedule de Casal, Inverno-Julho-Frio e Persona Programador: seg-sex 07:00-21:00 e sab 08:00-12:00 com timezone_type ADVERTISER (America/Los_Angeles). Em setembro isso equivale a seg-sex 11:00-01:00 e sab 12:00-16:00 em Brasilia, sem domingo. Esses conjuntos responderam por 71,4% do gasto de P1 (R$ 389,48); a quebra horaria confirma zero impressao deles entre 01h e 11h de Brasilia. Setembro - Novo nao tem programacao. A partir de 01/11/2026 o deslocamento passa a +5 h.
   - Impacto estimado: Nao estimavel: a janela 06h-10h59 de Brasilia so foi testada por Setembro - Novo (R$ 38,80, 0 conversas, amostra insuficiente).
7. **Custo por conversa estavel entre agosto e setembro; CPM subiu e foi compensado pela conversao clique para conversa** (FATO, confiança alta para a estabilidade; baixa para atribuir causa ao CPM).
   - Evidência: CPR P1 R$ 12,99 (IC R$ 10,05 a R$ 17,09) contra P0 R$ 13,25 (IC R$ 10,34 a R$ 17,26): -1,96%, dentro da variabilidade semanal de H (CV semanal 0,39; CV esperado para a media de um mes 0,19). Decomposicao: CPM +13,0%, CTR de link +1,8%, clique para conversa +13,3% (fator dominante em modulo: clique para conversa).
   - Impacto estimado: R$ 0: sem variacao relevante de eficiencia; volume caiu de 45 para 42 conversas junto com o gasto (-8,5%).

## Bloco 1: visão da conta

| Métrica | P1 (set) | P0 (ago) | Variação P1/P0 | H (90 dias) | H por 30 dias |
|---|---|---|---|---|---|
| Gasto | R$ 545,72 | R$ 596,39 | -8,5% | R$ 1.880,76 | R$ 626,92 |
| Impressões | 9.988 | 12.336 | -19,0% | 42.046 | 14.015 |
| Alcance | 5.934 | 7.825 | -24,2% | 20.961 | não somável |
| Frequência | 1,68 | 1,58 | +6,8% | 2,01 | - |
| CPM | R$ 54,64 | R$ 48,35 | +13,0% | R$ 44,73 | - |
| Cliques no link | 89 | 108 | -17,6% | 334 | 111,3 |
| CTR de link | 0,89% | 0,88% | +1,8% | 0,79% | - |
| Conversas iniciadas | 42 | 45 | -6,7% | 155 | 51,7 |
| Clique para conversa | 47,2% | 41,7% | +13,3% | 46,4% | - |
| Custo por conversa | R$ 12,99 | R$ 13,25 | -2,0% | R$ 12,13 | - |
| IC 90% do custo por conversa | R$ 10,05 a R$ 17,09 | R$ 10,34 a R$ 17,26 | - | R$ 10,62 a R$ 13,92 | - |

Decomposição do custo por conversa (CPR = CPM/1000 / (CTR de link x clique para conversa)), em log:

| Fator | Variação P1/P0 | Efeito no CPR | Efeito em log |
|---|---|---|---|
| CPM | 13,01% | 13,01% | 0,1223 |
| CTR de link | 1,78% | -1,75% | -0,0176 |
| Clique para conversa | 13,26% | -11,71% | -0,1245 |
| Total | | -1,96% | -0,0198 |

- FATO: o custo por conversa caiu 1,96% (R$ 13,25 para R$ 12,99). Os IC 90% se sobrepõem quase inteiros. O fator de maior módulo foi o clique para conversa (+13,3%), que compensou a alta do CPM (+13,0%). O CTR de link quase não mudou.
- FATO: na série semanal de H (12 semanas completas, seg a dom), o custo por conversa tem CV de 0,39; para a média de um mês o CV esperado é ~0,19. A variação de P1 equivale a ~0,1 desvio: dentro da variabilidade. O CPM subiu 13,0% (~1,4 desvio do CV mensal esperado de 0,09) e está 22,2% acima do CPM de H: sinal fraco, não conclusivo.
- LEITURA: setembro foi um mês de eficiência igual a agosto com menos volume. O volume é decidido pelas recargas de saldo (ver Bloco 8), não pelo leilão.

Série semanal da conta em H (soma diária dos anúncios; conversas pelo campo `results`):

| Semana (seg) | Completa em H | Dias com entrega | Recargas | Gasto | Impressões | CPM | CTR de link | Conversas | Custo por conversa |
|---|---|---|---|---|---|---|---|---|---|
| 2026-07-06 | não | 2 | 1 | R$ 87,85 | 3.094 | R$ 28,39 | 0,55% | 8 | R$ 10,98 |
| 2026-07-13 | sim | 5 | 2 | R$ 175,69 | 5.321 | R$ 33,02 | 0,62% | 15 | R$ 11,71 |
| 2026-07-20 | sim | 4 | 2 | R$ 175,70 | 3.374 | R$ 52,07 | 0,86% | 12 | R$ 14,64 |
| 2026-07-27 | sim | 5 | 2 | R$ 175,74 | 4.702 | R$ 37,38 | 0,83% | 26 | R$ 6,76 |
| 2026-08-03 | sim | 3 | 1 | R$ 87,86 | 2.248 | R$ 39,08 | 0,58% | 8 | R$ 10,98 |
| 2026-08-10 | sim | 6 | 2 | R$ 175,73 | 4.355 | R$ 40,35 | 0,85% | 14 | R$ 12,55 |
| 2026-08-17 | sim | 3 | 1 | R$ 87,83 | 1.459 | R$ 60,20 | 1,37% | 6 | R$ 14,64 |
| 2026-08-24 | sim | 4 | 2 | R$ 175,71 | 3.311 | R$ 53,07 | 0,88% | 10 | R$ 17,57 |
| 2026-08-31 | sim | 5 | 2 | R$ 175,69 | 2.688 | R$ 65,36 | 1,12% | 17 | R$ 10,33 |
| 2026-09-07 | sim | 3 | 1 | R$ 87,88 | 1.571 | R$ 55,94 | 0,89% | 7 | R$ 12,55 |
| 2026-09-14 | sim | 5 | 2 | R$ 175,68 | 3.304 | R$ 53,17 | 0,94% | 17 | R$ 10,33 |
| 2026-09-21 | sim | 5 | 1 | R$ 87,86 | 1.887 | R$ 46,56 | 0,58% | 3 | R$ 29,29 |
| 2026-09-28 | sim | 6 | 2 | R$ 175,69 | 3.867 | R$ 45,43 | 0,70% | 11 | R$ 15,97 |
| 2026-10-05 | não | 1 | 1 | R$ 35,85 | 865 | R$ 41,45 | 0,46% | 0 | n/d |

## Bloco 2: análise de cada vídeo

Referência (medianas dos 10 vídeos com pelo menos 1.000 impressões em H): hook 27,3%, hold 21,3%, ThruPlay rate 5,9%, CTR de link 0,77%, taxa de conversa 0,33%, custo por conversa R$ 14,20, CPM R$ 43,02, taxa de resposta 92,8%. Todos os vídeos têm mais de 15 s, então ThruPlay = 15 s assistidos em todos; durações vão de 18,7 s a 43,6 s, o que pesa na comparação de ThruPlay rate e de taxa de conclusão.

Percentis: posição do valor de ciclo de vida do anúncio dentro da distribuição de H (0 a 100; para CPM e custo por conversa, percentil alto = mais barato).

### Roberto e Duda

- Identificação: id `52558011875148`, conjunto Casal, criado em 2026-08-24, status ACTIVE / ADSET_PAUSED. Entrega em H de 2026-08-24 a 2026-09-22 (30 dias de calendário, 17 com impressão). Duração do vídeo: 27,9 s. CTA WHATSAPP_MESSAGE. Título: "Pilates a dois na Soliê".
- Texto (abertura): "Já imaginou treinar Pilates ao lado de quem você ama?"

| Métrica | P1 | Vida | IC 90% (vida) |
|---|---|---|---|
| Gasto | R$ 268,85 | R$ 380,09 |  |
| Impressões | 4.272 | 6.352 |  |
| Alcance | 2.493 | 3.777 |  |
| Frequência | 1,71 | 1,68 |  |
| CPM | R$ 62,93 | R$ 59,84 |  |
| Plays de 3 s (derivado) | 1.235 | 1.846 |  |
| Hook rate | 28,9% | 29,1% | 28,1% a 30,0% |
| Hold rate | 24,0% | 23,8% | 22,2% a 25,5% |
| ThruPlay rate | 6,95% | 6,93% | 6,42% a 7,47% |
| Taxa de conclusão | 8,0% | 8,2% | 7,2% a 9,3% |
| Tempo médio (s) / relativo | 4 / 14,3% | 4 / 14,3% |  |
| CTR de link | 0,91% | 0,95% | 0,77% a 1,17% |
| Clique para conversa | 53,8% | 55,0% | 44,4% a 65,1% |
| Taxa de conversa | 0,49% | 0,52% | 0,39% a 0,69% |
| Conversas iniciadas | 21 | 33 |  |
| Custo por conversa | R$ 12,80 | R$ 11,52 | R$ 8,61 a R$ 15,74 |
| Taxa de resposta (derivada) | 81,0% | 78,8% | 65,1% a 88,1% |

Curva de retenção (vida, base = plays de 3 s) e queda por trecho:

| Ponto | 3 s | 25% | 50% | 75% | 95% | 100% |
|---|---|---|---|---|---|---|
| Segundo | 3,0 | 7,0 | 14,0 | 21,0 | 26,5 | 27,9 |
| Retenção | 100% | 51,0% | 25,7% | 19,0% | 9,3% | 8,2% |
| Queda no trecho | - | 49,0% | 49,5% | 26,3% | 50,8% | 12,2% |

- Maior queda: trecho p75->p95 (50,8%), entre 21,0 s e 26,5 s do vídeo.
- Funil de conversa derivado (vida): conexões 41, iniciadas 33, primeira resposta 26, profundidade 2 21, profundidade 3 12, profundidade 5 21. Não monotônico: profundidade_5 (21) > profundidade_3 (12); degraus de profundidade não interpretados.
- Funil em P1: iniciadas 21, primeira resposta 17, profundidade 2 15, profundidade 3 9, profundidade 5 11.
- Percentis (vida vs vídeos de H): hook 65, hold 75, ThruPlay rate 85, conclusão 55, tempo relativo 65, CTR de link 75, clique para conversa 85, taxa de conversa 85, custo por conversa 75, CPM 5, taxa de resposta 5.
- Diagnóstico (vida): **D6_conversa_de_baixa_qualidade**, confiança alta. Evidência: hook 0.291 (alto, mediana 0.273, IC 90% exclui a mediana: True); hold 0.238 (alto, mediana 0.213, IC exclui: True); taxa de conversa 0.0052 (alto, mediana 0.0033, IC exclui: True); taxa de resposta 0.7879 (mediana 0.9277, IC [0.65144, 0.88069]); conversas 33.
- Diagnóstico (P1): D6_conversa_de_baixa_qualidade, confiança alta.

- LEITURA: pela matriz base é um vencedor (hook, hold e taxa de conversa acima da mediana, com IC excluindo a mediana). O que o rebaixa para D6 é a taxa de resposta derivada, a menor entre os vídeos com volume. O CPM é o mais alto da conta (percentil 5 de custo). HIPÓTESE: o conjunto Casal é o único sem exclusão do público de engajamento de 365 dias; parte das conversas pode vir de seguidores ou alunos que já conhecem o estúdio, o que explicaria CPM alto e resposta menor. Teste 4.
- A maior queda está no trecho final (75% a 95%), e a retenção no início é a melhor entre os vídeos de P1: o problema não é a abertura.

### Café com Pilates - Setembro

- Identificação: id `52561700135948`, conjunto Casal, criado em 2026-09-09, status PAUSED / PAUSED. Entrega em H de 2026-09-09 a 2026-09-16 (8 dias de calendário, 5 com impressão). Duração do vídeo: 43,6 s. CTA WHATSAPP_MESSAGE. Título: "Café com Pilates no Água Verde".
- Texto (abertura): "O que é o Café com Pilates?"

| Métrica | P1 | Vida | IC 90% (vida) |
|---|---|---|---|
| Gasto | R$ 111,53 | R$ 111,53 |  |
| Impressões | 2.496 | 2.496 |  |
| Alcance | 1.870 | 1.870 |  |
| Frequência | 1,33 | 1,33 |  |
| CPM | R$ 44,68 | R$ 44,68 |  |
| Plays de 3 s (derivado) | 617 | 617 |  |
| Hook rate | 24,7% | 24,7% | 23,3% a 26,2% |
| Hold rate | 29,3% | 29,3% | 26,4% a 32,4% |
| ThruPlay rate | 7,25% | 7,25% | 6,44% a 8,15% |
| Taxa de conclusão | 6,3% | 6,3% | 4,9% a 8,1% |
| Tempo médio (s) / relativo | 5 / 11,5% | 5 / 11,5% |  |
| CTR de link | 1,04% | 1,04% | 0,76% a 1,43% |
| Clique para conversa | 53,8% | 53,8% | 38,2% a 68,8% |
| Taxa de conversa | 0,56% | 0,56% | 0,36% a 0,87% |
| Conversas iniciadas | 14 | 14 |  |
| Custo por conversa | R$ 7,97 | R$ 7,97 | R$ 5,10 a R$ 13,18 |
| Taxa de resposta (derivada) | 85,7% | 85,7% | 64,7% a 95,2% |

Curva de retenção (vida, base = plays de 3 s) e queda por trecho:

| Ponto | 3 s | 25% | 50% | 75% | 95% | 100% |
|---|---|---|---|---|---|---|
| Segundo | 3,0 | 10,9 | 21,8 | 32,7 | 41,4 | 43,6 |
| Retenção | 100% | 34,4% | 24,3% | 15,4% | 8,4% | 6,3% |
| Queda no trecho | - | 65,6% | 29,2% | 36,6% | 45,3% | 25,0% |

- Maior queda: trecho p3s->p25 (65,6%), entre 3,0 s e 10,9 s do vídeo.
- Funil de conversa derivado (vida): conexões 17, iniciadas 14, primeira resposta 12, profundidade 2 9, profundidade 3 4, profundidade 5 7. Não monotônico: profundidade_5 (7) > profundidade_3 (4); degraus de profundidade não interpretados.
- Funil em P1: iniciadas 14, primeira resposta 12, profundidade 2 9, profundidade 3 4, profundidade 5 7.
- Percentis (vida vs vídeos de H): hook 25, hold 95, ThruPlay rate 95, conclusão 35, tempo relativo 35, CTR de link 95, clique para conversa 75, taxa de conversa 95, custo por conversa 85, CPM 45, taxa de resposta 35.
- Diagnóstico (vida): **D4_mensagem_certa_embalagem_fraca**, confiança alta. Evidência: hook 0.247 (baixo, mediana 0.273, IC 90% exclui a mediana: True); hold 0.293 (alto, mediana 0.213, IC exclui: True); taxa de conversa 0.0056 (alto, mediana 0.0033, IC exclui: True); taxa de resposta 0.8571 (mediana 0.9277, IC [0.64706, 0.95154]); conversas 14. Nota: taxa de resposta abaixo da mediana, mas o IC 90% inclui a mediana: alerta D6 nao conclusivo.
- Diagnóstico (P1): D4_mensagem_certa_embalagem_fraca, confiança alta.

- LEITURA: mesmo vídeo do Café com Pilates de julho (43,6 s), com outra data no texto. Hook abaixo da mediana, mas hold e conversão acima: a mensagem (convite para um evento com data) funciona e a embalagem dos 3 primeiros segundos é fraca. Entregou só de 09/09 a 16/09 (o encontro era 16/09) e foi pausado em 17/09.

### 4-motivos-solie

- Identificação: id `52564360311148`, conjunto Setembro - Novo, criado em 2026-09-22, status PAUSED / PAUSED. Entrega em H de 2026-09-22 a 2026-09-30 (9 dias de calendário, 7 com impressão). Duração do vídeo: 32,5 s. CTA WHATSAPP_MESSAGE. Título: "Pilates para dor nas costas no Água Verde".
- Texto (abertura): "Sua dor nas costas piora no fim do dia de trabalho?"

| Métrica | P1 | Vida | IC 90% (vida) |
|---|---|---|---|
| Gasto | R$ 88,55 | R$ 88,55 |  |
| Impressões | 1.964 | 1.964 |  |
| Alcance | 1.608 | 1.608 |  |
| Frequência | 1,22 | 1,22 |  |
| CPM | R$ 45,09 | R$ 45,09 |  |
| Plays de 3 s (derivado) | 575 | 575 |  |
| Hook rate | 29,3% | 29,3% | 27,6% a 31,0% |
| Hold rate | 20,2% | 20,2% | 17,6% a 23,1% |
| ThruPlay rate | 5,91% | 5,91% | 5,09% a 6,84% |
| Taxa de conclusão | 5,0% | 5,0% | 3,7% a 6,8% |
| Tempo médio (s) / relativo | 4 / 12,3% | 4 / 12,3% |  |
| CTR de link | 0,71% | 0,71% | 0,46% a 1,10% |
| Clique para conversa | 21,4% | 21,4% | 8,9% a 43,2% |
| Taxa de conversa | 0,15% | 0,15% | 0,06% a 0,38% |
| Conversas iniciadas | 3 | 3 |  |
| Custo por conversa | R$ 29,52 | R$ 29,52 | R$ 11,42 a R$ 108,29 |
| Taxa de resposta (derivada) | 100,0% | 100,0% | 52,6% a 100,0% |

Curva de retenção (vida, base = plays de 3 s) e queda por trecho:

| Ponto | 3 s | 25% | 50% | 75% | 95% | 100% |
|---|---|---|---|---|---|---|
| Segundo | 3,0 | 8,1 | 16,3 | 24,4 | 30,9 | 32,5 |
| Retenção | 100% | 38,6% | 21,0% | 15,7% | 5,2% | 5,0% |
| Queda no trecho | - | 61,4% | 45,5% | 25,6% | 66,6% | 3,5% |

- Maior queda: trecho p75->p95 (66,6%), entre 24,4 s e 30,9 s do vídeo.
- Funil de conversa derivado (vida): conexões 3, iniciadas 3, primeira resposta 3, profundidade 2 2, profundidade 3 2, profundidade 5 4. Não monotônico: profundidade_5 (4) > profundidade_3 (2); degraus de profundidade não interpretados.
- Funil em P1: iniciadas 3, primeira resposta 3, profundidade 2 2, profundidade 3 2, profundidade 5 4.
- Percentis (vida vs vídeos de H): hook 75, hold 45, ThruPlay rate 55, conclusão 15, tempo relativo 45, CTR de link 35, clique para conversa 5, taxa de conversa 5, custo por conversa 5, CPM 35, taxa de resposta 80.
- Diagnóstico (vida): **D2_promete_e_nao_entrega**, confiança baixa. Evidência: hook 0.293 (alto, mediana 0.273, IC 90% exclui a mediana: True); hold 0.202 (baixo, mediana 0.213, IC exclui: False); taxa de conversa 0.0015 (baixo, mediana 0.0033, IC exclui: False); taxa de resposta 1.0 (mediana 0.9277, IC [0.5258, 1.0]); conversas 3.
- Diagnóstico (P1): D2_promete_e_nao_entrega, confiança baixa.

- LEITURA: volume abaixo do mínimo de 10 conversas; diagnóstico com confiança baixa. Ficou 9 dias no ar (22/09 a 30/09), no conjunto Setembro - Novo, que estreou em 22/09 (fase de aprendizado) e não tem programação horária.

### bem-vindos-Solie

- Identificação: id `52564366362948`, conjunto Setembro - Novo, criado em 2026-09-22, status PAUSED / PAUSED. Entrega em H de 2026-09-22 a 2026-09-30 (9 dias de calendário, 5 com impressão). Duração do vídeo: 43,3 s. CTA WHATSAPP_MESSAGE. Título: "Pilates de 50 min que cabe na sua rotina".
- Texto (abertura): "Você termina o dia de trabalho com dor nas costas?"

| Métrica | P1 | Vida | IC 90% (vida) |
|---|---|---|---|
| Gasto | R$ 67,69 | R$ 67,69 |  |
| Impressões | 1.144 | 1.144 |  |
| Alcance | 943 | 943 |  |
| Frequência | 1,21 | 1,21 |  |
| CPM | R$ 59,17 | R$ 59,17 |  |
| Plays de 3 s (derivado) | 351 | 351 |  |
| Hook rate | 30,7% | 30,7% | 28,5% a 33,0% |
| Hold rate | 18,5% | 18,5% | 15,4% a 22,2% |
| ThruPlay rate | 5,68% | 5,68% | 4,66% a 6,92% |
| Taxa de conclusão | 2,3% | 2,3% | 1,3% a 4,0% |
| Tempo médio (s) / relativo | 4 / 9,2% | 4 / 9,2% |  |
| CTR de link | 0,79% | 0,79% | 0,46% a 1,35% |
| Clique para conversa | 44,4% | 44,4% | 21,8% a 69,7% |
| Taxa de conversa | 0,35% | 0,35% | 0,16% a 0,78% |
| Conversas iniciadas | 4 | 4 |  |
| Custo por conversa | R$ 16,92 | R$ 16,92 | R$ 7,39 a R$ 49,54 |
| Taxa de resposta (derivada) | 100,0% | 100,0% | 59,7% a 100,0% |

Curva de retenção (vida, base = plays de 3 s) e queda por trecho:

| Ponto | 3 s | 25% | 50% | 75% | 95% | 100% |
|---|---|---|---|---|---|---|
| Segundo | 3,0 | 10,8 | 21,7 | 32,5 | 41,1 | 43,3 |
| Retenção | 100% | 24,8% | 14,2% | 7,7% | 3,1% | 2,3% |
| Queda no trecho | - | 75,2% | 42,5% | 46,0% | 59,3% | 27,2% |

- Maior queda: trecho p3s->p25 (75,2%), entre 3,0 s e 10,8 s do vídeo.
- Funil de conversa derivado (vida): conexões 5, iniciadas 4, primeira resposta 4, profundidade 2 2, profundidade 3 2, profundidade 5 None.
- Funil em P1: iniciadas 4, primeira resposta 4, profundidade 2 1, profundidade 3 1, profundidade 5 None.
- Percentis (vida vs vídeos de H): hook 85, hold 15, ThruPlay rate 35, conclusão 5, tempo relativo 15, CTR de link 55, clique para conversa 55, taxa de conversa 65, custo por conversa 35, CPM 15, taxa de resposta 80.
- Diagnóstico (vida): **FORA_DA_MATRIZ_hook_alto_hold_baixo_conversa_alta**, confiança baixa. Evidência: hook 0.307 (alto, mediana 0.273, IC 90% exclui a mediana: True); hold 0.185 (baixo, mediana 0.213, IC exclui: False); taxa de conversa 0.0035 (alto, mediana 0.0033, IC exclui: False); taxa de resposta 1.0 (mediana 0.9277, IC [0.59652, 1.0]); conversas 4.
- Diagnóstico (P1): FORA_DA_MATRIZ_hook_alto_hold_baixo_conversa_alta, confiança baixa.

- LEITURA: volume abaixo do mínimo de 10 conversas; diagnóstico com confiança baixa. Ficou 9 dias no ar (22/09 a 30/09), no conjunto Setembro - Novo, que estreou em 22/09 (fase de aprendizado) e não tem programação horária.

### Depoimento Luciane

- Identificação: id `52554793339548`, conjunto Inverno-Julho-Frio, criado em 2026-08-13, status ACTIVE / ADSET_PAUSED. Entrega em H de 2026-08-13 a 2026-09-01 (20 dias de calendário, 12 com impressão). Duração do vídeo: 36,3 s. CTA WHATSAPP_MESSAGE. Título: "Tratam cada aluno como se fosse único".
- Texto (abertura): "Tratam cada aluno como se fosse único."

| Métrica | P1 | Vida | IC 90% (vida) |
|---|---|---|---|
| Gasto | R$ 9,10 | R$ 304,74 |  |
| Impressões | 112 | 5.330 |  |
| Alcance | 101 | 3.759 |  |
| Frequência | 1,11 | 1,42 |  |
| CPM | R$ 81,25 | R$ 57,17 |  |
| Plays de 3 s (derivado) | 43 | 1.935 |  |
| Hook rate | 38,4% | 36,3% | 35,2% a 37,4% |
| Hold rate | 16,3% | 18,9% | 17,4% a 20,4% |
| ThruPlay rate | 6,25% | 6,85% | 6,30% a 7,44% |
| Taxa de conclusão | 11,6% | 7,3% | 6,4% a 8,4% |
| Tempo médio (s) / relativo | 14 / 38,6% | 5 / 13,8% |  |
| CTR de link | 0,89% | 1,01% | 0,81% a 1,26% |
| Clique para conversa | 0,0% | 31,5% | 22,2% a 42,5% |
| Taxa de conversa | 0,00% | 0,32% | 0,21% a 0,47% |
| Conversas iniciadas | 0 | 17 |  |
| Custo por conversa | n/d | R$ 17,93 | R$ 11,95 a R$ 28,13 |
| Taxa de resposta (derivada) | n/d | 88,2% | 69,9% a 96,0% |

Curva de retenção (vida, base = plays de 3 s) e queda por trecho:

| Ponto | 3 s | 25% | 50% | 75% | 95% | 100% |
|---|---|---|---|---|---|---|
| Segundo | 3,0 | 9,1 | 18,1 | 27,2 | 34,5 | 36,3 |
| Retenção | 100% | 28,9% | 16,6% | 11,7% | 8,2% | 7,3% |
| Queda no trecho | - | 71,1% | 42,6% | 29,6% | 30,0% | 10,2% |

- Maior queda: trecho p3s->p25 (71,1%), entre 3,0 s e 9,1 s do vídeo.
- Funil de conversa derivado (vida): conexões 16, iniciadas 17, primeira resposta 15, profundidade 2 13, profundidade 3 8, profundidade 5 6.
- Percentis (vida vs vídeos de H): hook 95, hold 25, ThruPlay rate 65, conclusão 45, tempo relativo 55, CTR de link 85, clique para conversa 15, taxa de conversa 45, custo por conversa 25, CPM 25, taxa de resposta 45.
- Diagnóstico (vida): **D2_promete_e_nao_entrega**, confiança media. Evidência: hook 0.363 (alto, mediana 0.273, IC 90% exclui a mediana: True); hold 0.189 (baixo, mediana 0.213, IC exclui: True); taxa de conversa 0.0032 (baixo, mediana 0.0033, IC exclui: False); taxa de resposta 0.8824 (mediana 0.9277, IC [0.69944, 0.96027]); conversas 17.
- Diagnóstico (P1): AMOSTRA_INSUFICIENTE, confiança baixa.

- Em P1 só entregou em 01/09 (112 impressões, R$ 9,10, 0 conversas): amostra insuficiente; a ficha vale pelo ciclo de vida, quase todo em agosto. LEITURA: o hook é o mais alto da conta, mas a retenção despenca até 25% do vídeo (9 s) e a conversão é mediana: D2, promete e não entrega.

Demais anúncios com entrega em H (sem entrega em P1), diagnóstico pelo ciclo de vida:

| Anúncio | Conjunto | Duração | Gasto vida | Conversas | Custo por conversa (IC 90%) | Hook | Hold | Taxa de conversa | Diagnóstico | Confiança |
|---|---|---|---|---|---|---|---|---|---|---|
| Café com Pilates | Inverno-Julho-Frio | 43,6 s | R$ 268,16 | 37 | R$ 7,25 (R$ 5,51 a R$ 9,72) | 24,6% | 27,9% | 0,51% | D4_mensagem_certa_embalagem_fraca | alta |
| Por que 2 alunos por aula? | Inverno-Julho-Frio | 24,2 s | R$ 253,36 | 21 | R$ 12,06 (R$ 8,38 a R$ 18,00) | 24,9% | 22,4% | 0,34% | D4_mensagem_certa_embalagem_fraca | baixa |
| Inverno-Julho-Frio - Erica | Inverno-Julho-Frio | 19,7 s | R$ 202,03 | 15 | R$ 13,47 (R$ 8,75 a R$ 21,85) | 27,7% | 17,9% | 0,20% | D2_promete_e_nao_entrega | media |
| Ecobag | Inverno-Julho-Frio | 18,7 s | R$ 77,44 | 5 | R$ 15,49 (R$ 7,37 a R$ 39,31) | 25,6% | 17,7% | 0,27% | D1_abertura_nao_para_o_scroll | media |
| Novo Horário - Almoço | Setembro - Novo | 29,5 s | R$ 150,28 | 8 | R$ 18,79 (R$ 10,41 a R$ 37,75) | 22,2% | 23,8% | 0,21% | D1_abertura_nao_para_o_scroll | media |
| Persona - Programador | Persona Programador | 21,9 s | R$ 57,19 | 3 | R$ 19,06 (R$ 7,38 a R$ 69,94) | 32,7% | 16,2% | 0,36% | AMOSTRA_INSUFICIENTE | baixa |
| Inverno-Julho-Frio - Imagem | Inverno-Julho-Frio | imagem | R$ 39,27 | 3 | R$ 13,09 (R$ 5,06 a R$ 48,03) | n/a | n/d | 0,19% | NAO_APLICAVEL_IMAGEM | baixa |

- Novo Horário - Almoço (o único anúncio em veiculação hoje): o texto publicado começa com uma nota de briefing ("Resolve a objeção de tempo, que é a mais comum em quem trabalha sentado."). Hook 22,2%, o menor entre os vídeos de H (IC 21,1% a 23,3%). Foi criado como cópia de bem-vindos-Solie (activity log: nome antigo "bem-vindos-Solie - Cópia").

Comparações de custo por conversa entre anúncios de P1 (IC 90% de Poisson):

| A | B | CPR A (IC) | CPR B (IC) | Conclusão | Conversas a mais para separar |
|---|---|---|---|---|---|
| Roberto e Duda | 4-motivos-solie | R$ 12,80 (R$ 8,89 a R$ 19,11) | R$ 29,52 (R$ 11,42 a R$ 108,29) | diferenca nao conclusiva | 36 |
| Roberto e Duda | bem-vindos-Solie | R$ 12,80 (R$ 8,89 a R$ 19,11) | R$ 16,92 (R$ 7,39 a R$ 49,54) | diferenca nao conclusiva | 421 |
| Roberto e Duda | Café com Pilates - Setembro | R$ 12,80 (R$ 8,89 a R$ 19,11) | R$ 7,97 (R$ 5,10 a R$ 13,18) | diferenca nao conclusiva | 72 |
| 4-motivos-solie | bem-vindos-Solie | R$ 29,52 (R$ 11,42 a R$ 108,29) | R$ 16,92 (R$ 7,39 a R$ 49,54) | diferenca nao conclusiva | 71 |
| 4-motivos-solie | Café com Pilates - Setembro | R$ 29,52 (R$ 11,42 a R$ 108,29) | R$ 7,97 (R$ 5,10 a R$ 13,18) | diferenca nao conclusiva | 3 |
| bem-vindos-Solie | Café com Pilates - Setembro | R$ 16,92 (R$ 7,39 a R$ 49,54) | R$ 7,97 (R$ 5,10 a R$ 13,18) | diferenca nao conclusiva | 33 |

- FATO: nenhuma diferença entre anúncios de P1 é conclusiva. Em H, o Café com Pilates de julho e agosto (R$ 7,25, IC R$ 5,51 a R$ 9,72) é o único anúncio cujo IC não se sobrepõe ao do restante da conta (R$ 13,67, IC R$ 11,73 a R$ 16,01). Somando os dois criativos do Café: 51 conversas a R$ 7,44 (IC R$ 5,90 a R$ 9,53) contra R$ 14,43 (IC R$ 12,26 a R$ 17,09).

## Bloco 3: fadiga e ciclo de vida

Série por semana de vida (semana 1 = primeiro dia com impressão em H). Frequência = média diária (impressões / soma do alcance diário), porque alcance não soma entre dias. Hook semanal usa `cost_per_video_view` diário arredondado (derivado, impreciso).

| Anúncio | Semana | Início | Dias com entrega | Gasto | Impressões | Freq. média diária | Hook | CTR de link | CPM | Conversas | Custo por conversa | Volume >= 1.000 imp. |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Roberto e Duda | 1 | 2026-08-24 | 4 | R$ 77,40 | 1.608 | 1,13 | 26,9% | 1,00% | R$ 48,13 | 8 | R$ 9,68 | sim |
| Roberto e Duda | 2 | 2026-08-31 | 5 | R$ 131,17 | 2.085 | 1,24 | 31,1% | 1,20% | R$ 62,91 | 14 | R$ 9,37 | sim |
| Roberto e Duda | 3 | 2026-09-07 | 3 | R$ 60,35 | 941 | 1,27 | 25,7% | 0,74% | R$ 64,13 | 4 | R$ 15,09 | não |
| Roberto e Duda | 4 | 2026-09-14 | 3 | R$ 91,68 | 1.438 | 1,22 | 29,4% | 0,83% | R$ 63,76 | 6 | R$ 15,28 | sim |
| Roberto e Duda | 5 | 2026-09-21 | 2 | R$ 19,49 | 280 | 1,18 | 30,7% | 0,00% | R$ 69,61 | 1 | R$ 19,49 | não |
| Depoimento Luciane | 1 | 2026-08-13 | 6 | R$ 161,91 | 3.024 | 1,11 | 34,1% | 1,19% | R$ 53,54 | 12 | R$ 13,49 | sim |
| Depoimento Luciane | 2 | 2026-08-20 | 2 | R$ 47,82 | 818 | 1,05 | 36,9% | 0,73% | R$ 58,46 | 2 | R$ 23,91 | não |
| Depoimento Luciane | 3 | 2026-08-27 | 4 | R$ 95,01 | 1.488 | 1,11 | 39,2% | 0,81% | R$ 63,85 | 3 | R$ 31,67 | sim |
| Café com Pilates | 1 | 2026-07-27 | 5 | R$ 156,09 | 4.043 | 1,13 | 25,2% | 0,89% | R$ 38,61 | 26 | R$ 6,00 | sim |
| Café com Pilates | 2 | 2026-08-03 | 2 | R$ 36,55 | 1.068 | 1,09 | 22,9% | 0,56% | R$ 34,22 | 4 | R$ 9,14 | sim |
| Café com Pilates | 3 | 2026-08-10 | 3 | R$ 75,52 | 2.097 | 1,14 | 23,3% | 0,71% | R$ 36,01 | 7 | R$ 10,79 | sim |
| Por que 2 alunos por aula? | 1 | 2026-07-14 | 5 | R$ 179,24 | 4.846 | 1,15 | 23,6% | 0,70% | R$ 36,99 | 16 | R$ 11,20 | sim |
| Por que 2 alunos por aula? | 2 | 2026-07-21 | 3 | R$ 71,62 | 1.336 | 1,10 | 28,7% | 0,82% | R$ 53,61 | 4 | R$ 17,91 | sim |
| Por que 2 alunos por aula? | 3 | 2026-07-28 | 1 | R$ 2,50 | 75 | 1,15 | 33,3% | 2,67% | R$ 33,33 | 0 | n/d | não |
| Inverno-Julho-Frio - Erica | 1 | 2026-07-09 | 2 | R$ 87,85 | 3.094 | 1,06 | 29,7% | 0,55% | R$ 28,39 | 8 | R$ 10,98 | sim |
| Inverno-Julho-Frio - Erica | 2 | 2026-07-16 | 2 | R$ 14,84 | 501 | 1,05 | 25,4% | 0,40% | R$ 29,62 | 1 | R$ 14,84 | não |
| Inverno-Julho-Frio - Erica | 3 | 2026-07-23 | 3 | R$ 26,29 | 942 | 1,05 | 25,4% | 0,43% | R$ 27,91 | 1 | R$ 26,29 | não |
| Novo Horário - Almoço | 1 | 2026-10-01 | 4 | R$ 123,67 | 3.231 | 1,08 | 22,5% | 0,59% | R$ 38,28 | 6 | R$ 20,61 | sim |
| Café com Pilates - Setembro | 1 | 2026-09-09 | 4 | R$ 108,73 | 2.407 | 1,18 | 25,0% | 1,08% | R$ 45,17 | 14 | R$ 7,77 | sim |
| Café com Pilates - Setembro | 2 | 2026-09-16 | 1 | R$ 2,80 | 89 | 1,06 | 16,9% | 0,00% | R$ 31,46 | 0 | n/d | não |
| 4-motivos-solie | 1 | 2026-09-22 | 5 | R$ 81,70 | 1.822 | 1,11 | 28,8% | 0,71% | R$ 44,84 | 3 | R$ 27,23 | sim |
| 4-motivos-solie | 2 | 2026-09-29 | 2 | R$ 6,85 | 142 | 1,03 | 36,6% | 0,70% | R$ 48,24 | 0 | n/d | não |
| Ecobag | 1 | 2026-08-03 | 3 | R$ 51,31 | 1.180 | 1,17 | 26,2% | 0,59% | R$ 43,48 | 4 | R$ 12,83 | sim |
| Ecobag | 2 | 2026-08-10 | 3 | R$ 26,13 | 693 | 1,13 | 23,9% | 0,87% | R$ 37,71 | 1 | R$ 26,13 | não |
| bem-vindos-Solie | 1 | 2026-09-22 | 3 | R$ 22,82 | 348 | 1,08 | 33,6% | 1,44% | R$ 65,57 | 1 | R$ 22,82 | não |
| bem-vindos-Solie | 2 | 2026-09-29 | 2 | R$ 44,87 | 796 | 1,18 | 29,9% | 0,50% | R$ 56,37 | 3 | R$ 14,96 | não |
| Persona - Programador | 1 | 2026-07-21 | 4 | R$ 57,19 | 833 | 1,13 | 32,6% | 0,96% | R$ 68,66 | 3 | R$ 19,06 | não |
| Inverno-Julho-Frio - Imagem | 1 | 2026-07-13 | 2 | R$ 19,36 | 821 | 1,17 | 0,5% | 0,49% | R$ 23,58 | 2 | R$ 9,68 | não |

- FATO: nenhum anúncio cumpriu o critério de fadiga (frequência subindo e CTR ou hook caindo por duas semanas seguidas com pelo menos 1.000 impressões por semana). Os anúncios ficam pouco no ar: mediana de 6,5 dias com entrega e 10 dias de calendário; o máximo foi Roberto e Duda, com 17 dias com entrega em 5 semanas.
- LEITURA: a troca de criativo é decidida pelo calendário de conteúdo (um tema por quinzena), não por desgaste. Não há dado para estimar a vida útil por fadiga nesta conta; a vida útil observada é de 1 a 2 semanas.
- Sinais isolados, sem volume para concluir: Depoimento Luciane teve custo por conversa subindo semana a semana (R$ 13,49, R$ 23,91, R$ 31,67) com frequência diária estável; Roberto e Duda passou de R$ 9,68 e R$ 9,37 nas semanas 1 e 2 para R$ 15,09 e R$ 15,28 nas semanas 3 e 4, com CPM subindo de R$ 48,13 para R$ 63,76.
- Saturação: o alcance da conta em H foi de 20.961 pessoas com frequência 2,01 (42.046 impressões). O tamanho estimado do público do raio de 3 km não é exposto pelas tools liberadas, então a razão alcance / público não é calculável. Frequências de 1,2 a 1,7 por anúncio e mensal não indicam saturação.

## Bloco 4: públicos e conjuntos

| Conjunto | Período | Gasto | Impressões | CPM | Conversas | Custo por conversa (IC 90%) | Taxa de resposta (IC 90%) |
|---|---|---|---|---|---|---|---|
| Inverno-Julho-Frio | P0 | R$ 485,15 | 10.256 | R$ 47,30 | 33 | R$ 14,70 (R$ 10,99 a R$ 20,09) | 90,9% (79,3% a 96,3%) |
| Inverno-Julho-Frio | P1 | R$ 9,10 | 112 | R$ 81,25 | 0 | n/d (n/d) | n/d (n/d) |
| Inverno-Julho-Frio | H | R$ 1.052,04 | 26.026 | R$ 40,42 | 92 | R$ 11,44 (R$ 9,62 a R$ 13,70) | 95,7% (90,7% a 98,0%) |
| Casal | P0 | R$ 111,24 | 2.080 | R$ 53,48 | 12 | R$ 9,27 (R$ 5,72 a R$ 16,07) | 75,0% (51,3% a 89,5%) |
| Casal | P1 | R$ 380,38 | 6.768 | R$ 56,20 | 35 | R$ 10,87 (R$ 8,20 a R$ 14,70) | 82,9% (70,1% a 90,9%) |
| Casal | H | R$ 491,62 | 8.848 | R$ 55,56 | 47 | R$ 10,46 (R$ 8,20 a R$ 13,54) | 80,8% (69,8% a 88,5%) |
| Setembro - Novo | P1 | R$ 156,24 | 3.108 | R$ 50,27 | 7 | R$ 22,32 (R$ 11,88 a R$ 47,56) | 100,0% (72,1% a 100,0%) |
| Setembro - Novo | H | R$ 279,91 | 6.339 | R$ 44,16 | 13 | R$ 21,53 (R$ 13,54 a R$ 36,40) | 92,3% (71,8% a 98,3%) |
| Persona Programador | H | R$ 57,19 | 833 | R$ 68,66 | 3 | R$ 19,06 (R$ 7,38 a R$ 69,94) | 100,0% (52,6% a 100,0%) |

Configuração (todos: otimização CONVERSATIONS para WhatsApp, R$ 30/dia, raio de 3 km na Av. República Argentina 1237, só mobile, Advantage+ Audience ligado com `expansion_all`, `publisher_platforms = instagram`):

| Conjunto | Status | Tipos de localização | Idade | Exclusão do público de engajamento 365d | Programação horária | Posições extras em page_types |
|---|---|---|---|---|---|---|
| Inverno-Julho-Frio | PAUSED | home, recent | 25-65 | sim | seg-sex 07-21h e sab 08-12h (fuso da conta) | mobileexternal, mobilefeed, mobile-instream-video, mobile-marketplace, mobile-fb-story, whatsapp-status, mobile_marketplace_search_ads, mobile_search_serp_ads, mobile-fb-profile-feed, mobile-fb-reels, watch_search_ads_mobile, mobile_fb_notifs_jewel |
| Casal | PAUSED | frequently_in, home, recent | 25-65 (age_range 25-60) | não | seg-sex 07-21h e sab 08-12h (fuso da conta) | mobileexternal, mobilefeed, mobile-instream-video, mobile-marketplace, mobile-fb-story, mobile_marketplace_search_ads, mobile_search_serp_ads, mobile-fb-profile-feed, mobile-fb-reels, watch_search_ads_mobile, mobile_fb_notifs_jewel |
| Setembro - Novo | ACTIVE | frequently_in, home, recent | 25-65 | sim | nenhuma | whatsapp-status |
| Persona Programador | PAUSED | home, recent | 25-65 | sim | seg-sex 07-21h e sab 08-12h (fuso da conta) | mobileexternal, mobilefeed, mobile-instream-video, mobile-marketplace, mobile-fb-story, mobile_marketplace_search_ads, mobile_search_serp_ads, mobile-fb-profile-feed, mobile-fb-reels, watch_search_ads_mobile, mobile_fb_notifs_jewel |

- FATO: em P1, Setembro - Novo (R$ 22,32, IC R$ 11,88 a R$ 47,56) contra Casal (R$ 10,87, IC R$ 8,20 a R$ 14,70): diferença não conclusiva. Os dois também não são comparáveis no tempo: Casal rodou de 01/09 a 22/09 e Setembro - Novo de 22/09 a 30/09, em fase de aprendizado.
- FATO: a taxa de resposta do Casal em H (80,8%, IC 69,8% a 88,5%) fica abaixo da do Inverno-Julho-Frio (95,7%, IC 90,7% a 98,0%); os intervalos não se sobrepõem. É a única diferença conclusiva entre conjuntos. O Casal é o único sem a exclusão do público de engajamento e o único que usa `frequently_in` junto com o Setembro - Novo. LEITURA: a diferença de resposta acompanha a falta de exclusão, mas também coincide com outro criativo (Roberto e Duda) e outro período; não dá para separar as causas.
- Advantage+ Audience: a quebra por idade não mostra nenhuma impressão abaixo de 25 anos. A faixa 65+ recebeu R$ 78,22 em P1 (14,3% do gasto); ela mistura 65 anos (dentro do alvo) com 66+ (fora), então a entrega fora da faixa não é mensurável. Entrega fora dos interesses não é observável pela API.
- Sobreposição entre conjuntos: `ads_insights_auction_ranking_benchmarks` não devolveu dados; `ads_insights_anomaly_signal` diz ter checado sobreposição de leilão, fadiga e público estreito, sem alerta. Em P1 os conjuntos quase não rodaram ao mesmo tempo (Inverno-Julho-Frio só em 01/09).

Idade e gênero em P1 (células com menos de 5 conversas marcadas):

| Idade | Gasto | Impressões | CPM | Hook (derivado) | CTR de link | Conversas | Custo por conversa (IC 90%) | Amostra |
|---|---|---|---|---|---|---|---|---|
| 25-34 | R$ 98,87 | 2.505 | R$ 39,47 | 18,0% | 0,64% | 8 | R$ 12,36 (R$ 6,85 a R$ 24,84) | ok |
| 35-44 | R$ 90,02 | 1.835 | R$ 49,06 | 26,1% | 0,65% | 5 | R$ 18,00 (R$ 8,56 a R$ 45,69) | ok |
| 45-54 | R$ 151,01 | 2.464 | R$ 61,29 | 28,4% | 0,81% | 13 | R$ 11,62 (R$ 7,31 a R$ 19,64) | ok |
| 55-64 | R$ 127,60 | 1.974 | R$ 64,64 | 35,8% | 1,27% | 11 | R$ 11,60 (R$ 7,01 a R$ 20,68) | ok |
| 65+ | R$ 78,22 | 1.210 | R$ 64,64 | 39,8% | 1,32% | 5 | R$ 15,64 (R$ 7,44 a R$ 39,70) | ok |

| Gênero | Gasto | Impressões | Conversas | Custo por conversa (IC 90%) | Amostra |
|---|---|---|---|---|---|
| female | R$ 505,74 | 9.127 | 38 | R$ 13,31 (R$ 10,15 a R$ 17,77) | ok |
| male | R$ 38,10 | 809 | 4 | R$ 9,52 (R$ 4,16 a R$ 27,89) | insuficiente |
| unknown | R$ 1,88 | 52 | 0 | n/d (n/d) | insuficiente |

- FATO: 92,7% do gasto de P1 foi para mulheres. Os custos por conversa por faixa etária têm IC sobrepostos: nenhuma faixa é melhor de forma conclusiva. O hook cresce com a idade (18,0% em 25-34 até 39,8% em 65+, IC sem sobreposição entre os extremos), assim como o CTR de link e o CPM. Só 4 células idade x gênero têm 5 ou mais conversas (mulheres 25-34, 45-54, 55-64 e 65+), todas entre R$ 11,57 e R$ 14,05, com IC sobrepostos.
- LEITURA: o hook maior entre pessoas mais velhas pode refletir o posicionamento (feed concentra o público mais velho e tem hook maior) e não a idade em si; não foi isolado.

## Bloco 5: posicionamentos

| Plataforma e posição | Gasto | Impressões | CPM | Hook (derivado) | CTR de link | Conversas | Custo por conversa (IC 90%) | Amostra |
|---|---|---|---|---|---|---|---|---|
| instagram / feed | R$ 289,93 | 4.971 | R$ 58,32 | 35,1% | 0,86% | 22 | R$ 13,18 (R$ 9,23 a R$ 19,47) | ok |
| instagram / instagram_stories | R$ 112,07 | 2.023 | R$ 55,40 | 17,8% | 1,14% | 9 | R$ 12,45 (R$ 7,14 a R$ 23,87) | ok |
| instagram / instagram_reels | R$ 105,63 | 1.957 | R$ 53,98 | 22,5% | 0,71% | 7 | R$ 15,09 (R$ 8,03 a R$ 32,15) | ok |
| whatsapp / status | R$ 20,12 | 639 | R$ 31,49 | 21,0% | 0,63% | 0 | n/d (n/d) | insuficiente |
| facebook / feed | R$ 12,66 | 283 | R$ 44,73 | 32,2% | 1,41% | 3 | R$ 4,22 (R$ 1,63 a R$ 15,48) | insuficiente |
| facebook / facebook_reels | R$ 4,52 | 103 | R$ 43,88 | 25,2% | 0,97% | 1 | R$ 4,52 (R$ 0,95 a R$ 88,12) | insuficiente |
| facebook / facebook_stories | R$ 0,79 | 10 | R$ 79,00 | 10,0% | 0,00% | 0 | n/d (n/d) | insuficiente |
| instagram / instagram_explore_grid_home | R$ 0,00 | 2 | R$ 0,00 | n/d | 0,00% | 0 | n/d (n/d) | insuficiente |

- FATO: R$ 38,09 (7,0% do gasto de P1) foram entregues fora do Instagram: Facebook R$ 17,97 (4 conversas) e Status do WhatsApp R$ 20,12 (0 conversas em 639 impressões). Fora do Instagram: R$ 9,52 (IC R$ 4,16 a R$ 27,88); Instagram: R$ 13,36 (IC R$ 10,19 a R$ 17,84). Não conclusivo e abaixo do mínimo de 5 conversas.
- FATO: a causa está na configuração. Apesar de `publisher_platforms = instagram`, o campo `page_types` dos conjuntos inclui posições de Facebook e Status do WhatsApp, e a entrega segue esse campo: Casal (page_types com Facebook, sem WhatsApp) entregou só em Facebook fora do Instagram; Setembro - Novo (page_types só com `whatsapp-status` além do Instagram) entregou só no Status do WhatsApp.
- LEITURA: não é possível afirmar que é vazamento ruim. O Facebook teve custo por conversa menor (4 conversas); o Status do WhatsApp gastou R$ 20,12 sem conversa, o que com 639 impressões ainda é compatível com acaso (a taxa de conversa da conta prevê ~2,7 conversas).
- Dentro do Instagram: feed tem hook de 35,1% contra 22,5% em Reels e 17,8% em Stories (IC sem sobreposição), mas custo por conversa sem diferença conclusiva entre as três posições.

## Bloco 6: tempo

Conversão de fuso: a API corta horas e dias em America/Los_Angeles. Em todo setembro (PDT, UTC-7), Brasília (UTC-3) está 4 h à frente; conversão feita com zoneinfo. O dia D da API corresponde a D 04:00 até D+1 03:59 em Brasília. A partir de 01/11/2026 (PST) o deslocamento passa a 5 h.

| Hora (Brasília) | Gasto | Impressões | Conversas | Custo por conversa |
|---|---|---|---|---|
| 00h | R$ 12,96 | 233 | 1 | R$ 12,96 |
| 01h | R$ 0,68 | 18 | 0 | n/d |
| 02h | R$ 0,92 | 19 | 0 | n/d |
| 03h | R$ 0,29 | 6 | 0 | n/d |
| 04h | R$ 0,48 | 8 | 0 | n/d |
| 05h | R$ 1,68 | 42 | 0 | n/d |
| 06h | R$ 8,96 | 212 | 0 | n/d |
| 07h | R$ 4,46 | 115 | 0 | n/d |
| 08h | R$ 9,48 | 123 | 0 | n/d |
| 09h | R$ 8,78 | 156 | 0 | n/d |
| 10h | R$ 7,12 | 123 | 0 | n/d |
| 11h | R$ 47,56 | 794 | 4 | R$ 11,89 |
| 12h | R$ 35,93 | 646 | 2 | R$ 17,96 |
| 13h | R$ 35,27 | 597 | 2 | R$ 17,63 |
| 14h | R$ 26,17 | 402 | 5 | R$ 5,23 |
| 15h | R$ 34,49 | 601 | 1 | R$ 34,49 |
| 16h | R$ 28,32 | 570 | 2 | R$ 14,16 |
| 17h | R$ 33,58 | 646 | 3 | R$ 11,19 |
| 18h | R$ 42,22 | 818 | 2 | R$ 21,11 |
| 19h | R$ 61,66 | 1.202 | 9 | R$ 6,85 |
| 20h | R$ 40,93 | 807 | 3 | R$ 13,64 |
| 21h | R$ 42,95 | 762 | 4 | R$ 10,74 |
| 22h | R$ 34,76 | 643 | 3 | R$ 11,59 |
| 23h | R$ 26,07 | 445 | 1 | R$ 26,07 |

Horas agregadas em blocos (mínimo de 5 conversas por célula):

| Bloco (Brasília) | Gasto | Impressões | CTR de link | Conversas | Custo por conversa (IC 90%) | Amostra |
|---|---|---|---|---|---|---|
| 06-10h59 BR | R$ 38,80 | 729 | 0,41% | 0 | n/d (n/d) | insuficiente |
| 11-13h59 BR | R$ 118,76 | 2.037 | 1,18% | 8 | R$ 14,85 (R$ 8,23 a R$ 29,83) | ok |
| 14-17h59 BR | R$ 122,56 | 2.219 | 0,86% | 11 | R$ 11,14 (R$ 6,73 a R$ 19,87) | ok |
| 18-21h59 BR | R$ 187,76 | 3.589 | 0,97% | 18 | R$ 10,43 (R$ 7,03 a R$ 16,14) | ok |
| 22-05h59 BR | R$ 77,84 | 1.414 | 0,57% | 5 | R$ 15,57 (R$ 7,40 a R$ 39,51) | ok |

| Dia da semana (corte da API) | Dias com entrega | Gasto | Impressões | Conversas | Custo por conversa (IC 90%) | Amostra |
|---|---|---|---|---|---|---|
| seg | 3 | R$ 94,69 | 1.690 | 4 | R$ 23,67 (R$ 10,34 a R$ 69,30) | insuficiente |
| ter | 5 | R$ 196,55 | 3.616 | 16 | R$ 12,28 (R$ 8,09 a R$ 19,58) | ok |
| qua | 5 | R$ 126,92 | 2.387 | 15 | R$ 8,46 (R$ 5,50 a R$ 13,73) | ok |
| qui | 4 | R$ 84,00 | 1.618 | 5 | R$ 16,80 (R$ 7,99 a R$ 42,64) | ok |
| sex | 3 | R$ 43,56 | 677 | 2 | R$ 21,78 (R$ 6,92 a R$ 122,58) | insuficiente |
| sab | 0 | R$ 0,00 | 0 | 0 | n/d (n/d) | insuficiente |
| dom | 0 | R$ 0,00 | 0 | 0 | n/d (n/d) | insuficiente |

- FATO: Casal, Inverno-Julho-Frio e Persona Programador têm `adset_schedule` seg-sex 07:00-21:00 e sáb 08:00-12:00 com `timezone_type = ADVERTISER`, ou seja, no fuso de Los Angeles. Em Brasília: seg-sex 11:00-01:00 e sab 12:00-16:00 (deslocamento +4 h, PDT); depois de 01/11: seg-sex 12:00-02:00 e sab 13:00-17:00 (PST, deslocamento +5 h). A quebra horária confirma: Roberto e Duda, Café com Pilates - Setembro e Depoimento Luciane não têm nenhuma impressão entre 01h e 10h59 de Brasília. Esses conjuntos responderam por 71,4% do gasto de P1.
- HIPÓTESE: a programação foi pensada como 07h-21h de Brasília e ficou deslocada pelo fuso da conta. A janela da manhã (06h-10h59) só foi exposta pelo Setembro - Novo: R$ 38,80, 729 impressões, 0 conversas, amostra insuficiente.
- FATO: não houve entrega em nenhum sábado ou domingo de setembro; a programação permitiria sábado de manhã, mas o saldo pré-pago já estava zerado (Bloco 8). Entre os dias com entrega, quarta-feira tem o menor custo por conversa e segunda e sexta o maior, mas todos os IC se sobrepõem.
- Horário de atendimento do estúdio não informado: o cruzamento com o atendimento do WhatsApp fica pendente (pergunta ao usuário). Pelo dado, 18h-21h59 de Brasília concentrou 18 das 42 conversas de P1.

## Bloco 7: leilão e benchmarks

- Contexto do anunciante (Meta): vertical Professional Services, subvertical Fitness, funil de etapa única (consideração), foco em volume.
- Benchmark do setor (2026-09-01 a 2026-09-30; só o conjunto Setembro - Novo (52564360311348) foi avaliado): CTR 54.59% acima do benchmark; CPR 86.05% abaixo do benchmark (custo menor); CPM 86.81% abaixo do benchmark (custo menor); CPC 91.20% abaixo do benchmark (custo menor); CVR 98.40% abaixo do benchmark. A tool não devolve valores absolutos.
  - Avaliação crítica: a coorte é otimizada para `messaging_deep_conversation`, evento diferente do desta conta (`messaging_conversation_started_7d`). Custos ~86% a 91% abaixo da coorte e CVR 98% abaixo são consistentes com comparar conversas iniciadas contra conversas profundas, não com eficiência excepcional. Não usar como referência de custo.
- Ranking de leilão: "No auction ranking benchmarks data available for the given criteria." (volume da conta provavelmente abaixo do mínimo da tool).
- Tendência (Meta): Novo Horário - Almoço com CTR +46,6% nos últimos 4 dias e Setembro - Novo com CTR +39,4% em 11 dias, alcance +97,4% e CPM +7,0%; CPR e CVR com variação 0,00%. Janela curta e volume baixo: tratar como ruído até ter 10 ou mais conversas.
- Anomalias: "No anomaly signal issues found in the analyzed ad sets. Checked for auction overlap, creative fatigue, and narrow audience."
- Opportunity Score: 98 de 100 (nível conta). Recomendação única: `performant_creative_reels_opt_in` para o conjunto Setembro - Novo, com estimativa de "Selecione os posicionamentos no Reels para ajudar a conseguir Redução de 1.4% no custo por resultado".
  - Avaliação crítica: o conjunto já tem Reels do Instagram nas posições; a recomendação provavelmente se refere a Reels do Facebook. O ganho estimado (1,4% no custo por conversa, cerca de R$ 0,18 por conversa no custo de setembro) está muito abaixo do ruído mensal (~19%). Em P1, Reels do Instagram teve hook menor que o feed e custo por conversa sem diferença conclusiva. Faz sentido aceitar só se não abrir posições fora do raio de interesse; não é prioridade. O score de 98 mede aderência a boas práticas de configuração e não captura os problemas reais desta conta (saldo, fuso da programação, texto do anúncio ativo).

## Bloco 8: alterações e higiene da conta

Linha do tempo (activity logs; recargas e cobranças diárias resumidas abaixo):

| Data | Mudança | Efeito observado na série |
|---|---|---|
| 2026-07-14 | Cria Por que 2 alunos por aula?; pausa Inverno-Julho-Frio e a versão Imagem | semana de 13/07: R$ 11,71 por conversa |
| 2026-07-21 | Cria conjunto Persona Programador (R$ 30/dia, com programação horária); pausado em 27/07 | 3 conversas a R$ 19,06; descontinuado |
| 2026-07-27 | Cria Café com Pilates (Inverno-Julho-Frio) | semana de 27/07: menor custo por conversa de H (R$ 6,76, 26 conversas) |
| 2026-07-28 | Pausa Inverno-Julho-Frio - Erica |  |
| 2026-08-03 | Cria Ecobag; pausa Por que 2 alunos por aula? | semana de 03/08: 8 conversas, 1 recarga |
| 2026-08-12 | Pausa Café com Pilates (dia do encontro) |  |
| 2026-08-13 | Cria Depoimento Luciane; pausa Ecobag | Luciane: custo por conversa sobe nas semanas seguintes |
| 2026-08-24 | Cria conjunto Casal com Roberto e Duda (sem exclusão de engajamento, com frequently_in); renomeia a campanha de 'Campanha - Inverno - Julho' para 'Campanha - Setembro' | novo conjunto: reinicia aprendizado; CPM sobe de R$ 40,35 (semana de 10/08) para R$ 53,07 |
| 2026-09-01 | Pausa o conjunto Inverno-Julho-Frio | todo o gasto passa ao Casal |
| 2026-09-09 | Cria Café com Pilates - Setembro no Casal; reativa o anúncio Café com Pilates e liga/desliga o conjunto Inverno-Julho-Frio no mesmo minuto | anúncio novo no conjunto (edição significativa); semana de 14/09: R$ 10,33 por conversa |
| 2026-09-17 | Pausa Café com Pilates - Setembro (encontro em 16/09) |  |
| 2026-09-22 | Cria conjunto Setembro - Novo (sem programação horária, com exclusão) com 4-motivos-solie e bem-vindos-Solie; pausa o Casal | novo conjunto: semana de 21/09 com 3 conversas a R$ 29,29, a pior de H |
| 2026-09-30 | Pausa 4-motivos-solie e bem-vindos-Solie |  |
| 2026-10-01 | Cria Novo Horário - Almoço (cópia de bem-vindos-Solie) no Setembro - Novo | único anúncio ativo hoje |

- FATO: a conta é pré-paga. Houve 22 eventos "Quantia adicionada ao saldo" em H e 54 cobranças diárias. Em todas as 12 semanas completas de H o gasto semanal dividido pelo número de recargas da semana ficou entre R$ 87,83 e R$ 87,88. Os 15 blocos de dias sem entrega em H terminam no dia de uma recarga (15 de 15).
- LEITURA: cada recarga rende R$ 87,85 de veiculação (valor da recarga não aparece no log; R$ 87,85 é consistente com R$ 100 menos tributos, a confirmar). Com dois conjuntos ativos ou orçamento de R$ 30/dia, o saldo acaba em 2 a 4 dias e a conta fica parada até a próxima recarga. Em setembro foram 10 dias sem entrega: 2026-09-05, 2026-09-06, 2026-09-07, 2026-09-11, 2026-09-12, 2026-09-13, 2026-09-19, 2026-09-20, 2026-09-26, 2026-09-27.
- Mudanças que reiniciaram aprendizado: criação dos conjuntos Casal (24/08) e Setembro - Novo (22/09), e inclusão de anúncios novos em conjunto ativo (09/09 e 01/10). As paradas por saldo zerado (2 a 4 dias) também interrompem a entrega a cada semana. As piores semanas de H coincidem com estreias de conjunto (24/08: R$ 17,57; 21/09: R$ 29,29) e a melhor com a estreia do Café com Pilates (27/07: R$ 6,76).

Problemas estruturais observados:

1. Orçamento real definido por recargas avulsas de saldo pré-pago, com parada de entrega em todo fim de semana e em parte dos dias úteis (07/09 e 11/09 em setembro).
2. Programação horária no fuso da conta (Los Angeles) em três conjuntos: entrega em Brasília das 11h à 01h, nunca de manhã nem aos domingos; o deslocamento muda de 4 h para 5 h em 01/11.
3. Uma única campanha desde 30/06, renomeada de 'Campanha - Inverno - Julho' para 'Campanha - Setembro', com nome que não descreve conteúdo nem público; objetivo OUTCOME_ENGAGEMENT.
4. Quatro anúncios com status ACTIVE dentro de conjuntos pausados (Roberto e Duda, Depoimento Luciane, Café com Pilates, Persona - Programador): reativar o conjunto religa os anúncios sem revisão.
5. Critério de exclusão inconsistente: o público 'IG Soliê - Qualquer interação 365d' (5.400 a 6.300 pessoas, ativo) é excluído em três conjuntos e não no Casal.
6. Tipos de localização diferentes entre conjuntos (Casal e Setembro - Novo incluem `frequently_in`); Casal informa age_range 25-60 e age_max 65 ao mesmo tempo.
7. `page_types` com posições de Facebook e Status do WhatsApp em conjuntos declarados só para Instagram, com entrega real fora do Instagram (7,0% do gasto de P1).
8. Texto do único anúncio em veiculação (Novo Horário - Almoço) com nota interna de briefing publicada.
9. Hoje há 1 anúncio em veiculação (Novo Horário - Almoço, conjunto Setembro - Novo). Nenhum erro de entrega (`ads_get_errors` vazio).
10. Conta pessoal sem Business Manager e fuso America/Los_Angeles, divergente do negócio em Curitiba.
11. A Meta criou 23 públicos automáticos `asa_auto_custom_audience` em H; não aparecem na listagem de públicos e não estão em uso declarado.

## Bloco 9: pós-clique

Não executado: `data/leads.csv` não existe. Sem ele não há custo por agendamento, comparecimento ou matrícula, e o ranking de anúncios fica só no custo por conversa. Ver pergunta ao usuário.

## Testes propostos (priorizados)

1. **Hipótese:** Entrega diaria continua (sem dias de saldo zero) gera mais conversas por mes sem elevar o custo por conversa.
   - Mudança: Manter saldo positivo a semana inteira (recarga unica maior no inicio da semana ou forma de pagamento automatica), com o mesmo gasto mensal-alvo distribuido em orcamento diario menor.
   - Métrica: dias com entrega por semana, conversas por semana e custo por conversa
   - Amostra mínima: 39 conversas por periodo detectam diferenca de custo da ordem de 7,44 x 12,99; diferencas de 10 x 13 exigem 165 por periodo
   - Duração estimada: 4 semanas contra as 4 semanas anteriores (media de H: 12,2 conversas por semana)
2. **Hipótese:** O formato Cafe com Pilates (convite para evento com data) gera conversa mais barata que os demais temas; uma abertura mais forte melhora o hook sem perder conversao.
   - Mudança: Nova peca do Cafe com Pilates para o proximo encontro com novo primeiro quadro, rodando contra o melhor anuncio nao-Cafe no mesmo conjunto.
   - Métrica: custo por conversa (principal) e hook rate (secundaria)
   - Amostra mínima: 39 conversas por braco
   - Duração estimada: ~6,4 semanas no ritmo de H
3. **Hipótese:** Remover a nota interna e trocar a abertura do Novo Horario - Almoco eleva o hook ao nivel da mediana da conta.
   - Mudança: Duplicar o anuncio com o texto corrigido e novo primeiro quadro; manter o original como controle por poucos dias.
   - Métrica: hook rate
   - Amostra mínima: 810 impressoes por braco para separar 22% de 27%
   - Duração estimada: ~0,5 semana
4. **Hipótese:** Excluir o publico de engajamento de 365 dias (como nos demais conjuntos) reduz CPM e eleva a taxa de resposta das conversas.
   - Mudança: Teste A/B do mesmo criativo com e sem a exclusao de 'IG Solie - Qualquer interacao 365d'.
   - Métrica: taxa de resposta (primeira resposta / iniciadas) e CPM
   - Amostra mínima: 60 conversas por braco para separar 79% de 93%
   - Duração estimada: ~9,9 semanas no ritmo de H; viavel so com gasto maior
5. **Hipótese:** A janela da manha em Brasilia (06h-11h), hoje bloqueada pela programacao no fuso da conta, gera conversas a custo semelhante ao resto do dia.
   - Mudança: Remover a programacao horaria ou recria-la convertendo para o fuso da conta (07h-21h de Brasilia = 03h-17h em Los Angeles ate 31/10 e 02h-16h depois de 01/11).
   - Métrica: conversas e custo por conversa no bloco 06h-10h59 de Brasilia
   - Amostra mínima: 5 conversas no bloco (minimo por celula de quebra)
   - Duração estimada: ~R$ 261,54 de gasto total (o bloco recebeu 24,8% do gasto de Setembro - Novo), cerca de 1,8 semanas no ritmo de H

## Limitações

- data/leads.csv nao existe: Bloco 9 (pos-clique, custo por agendamento, comparecimento e matricula) nao executado.
- Equivalencia video_view = play de 3 s vem da documentacao da Meta e da descricao de cost_per_video_view em ads_get_field_context ('cost per 3-second video play'); a contagem nao foi auditada na conta. Plays de 3 s sao derivados (gasto / custo por video_view).
- Contagens derivadas (plays de 3 s, conexoes, primeira resposta, profundidade 2, 3 e 5, respondidas) sao gasto / custo por acao arredondados; marcadas com derivado: true.
- Funil de conversa nao monotonico: profundidade 5 maior que profundidade 3 na conta (P1 22 x 16, P0 23 x 22, H 91 x 65) e em varios anuncios; Inverno-Julho-Frio - Erica tem profundidade 5 = 36 com 15 conversas iniciadas. Nenhuma conclusao foi tirada dos degraus de profundidade.
- O mesmo anuncio com o mesmo gasto devolveu custos de funil diferentes entre P1 e maximum (bem-vindos-Solie: profundidade 2 de R$ 67,69 em P1 e R$ 33,85 em maximum), indicando que as acoes de mensagem sao reatribuidas apos o fim do periodo.
- Taxa de resposta usa primeira resposta derivada como proxy de lead real; a definicao exata do evento messaging_first_reply nao foi auditada.
- Hook semanal (Bloco 3) usa cost_per_video_view diario arredondado a 2 casas; erro tipico de alguns pontos percentuais. Frequencia acumulada por semana de vida nao e calculavel (alcance nao e somavel por dia); usada frequencia media diaria como proxy.
- Conversas sao atribuidas ao dia do evento, nao ao dia da impressao: ha dias com R$ 0,02 de gasto e 1 conversa. Custo por conversa diario e semanal e ruidoso.
- raw/10_ads_diario_last90d.json veio truncado no limite de 1000 linhas; Novo Horario - Almoco completado com raw/11.
- Campos pedidos e descartados em silencio: end_time (conjuntos), link_url (criativos), bid_strategy, spend_cap, daily_budget e pacing_type (campanha).
- Tamanho estimado do publico do raio de 3 km nao disponivel nas tools liberadas: saturacao nao quantificada como razao. Alcance da conta em H: 20.961 pessoas com frequencia 2,01.
- Quebra horaria so traz conversas no fuso do anunciante; convertida para Brasilia com zoneinfo (+4 h em setembro). Dia da semana segue o corte da API: dia D em Los Angeles = D 04:00 ate D+1 03:59 em Brasilia.
- Benchmarks da Meta: so o conjunto Setembro - Novo foi avaliado; a coorte e otimizada para messaging_deep_conversation (evento diferente do da conta), sem valores absolutos; auction ranking sem dados; nenhuma checagem de sobreposicao entre conjuntos disponivel alem do anomaly_signal (sem alerta).
- Advantage+ Audience: a quebra por idade nao mostra entrega abaixo de 25 anos; nao ha como verificar entrega fora dos interesses. A faixa 65+ mistura 65 (dentro do alvo) com 66+ (fora); Casal tem age_range 25-60 e age_max 65 na mesma resposta.
- Activity logs: valor das recargas nao informado (inferido R$ 87,85 pelo gasto semanal); fuso dos horarios do log nao declarado; campos de IP, cookie e ids de requisicao removidos do bruto por privacidade.
- H (last_90d) inclui 01/10 a 05/10; a populacao de comparacao de videos inclui Novo Horario - Almoco. Metricas de vida (maximum) incluem 06/10 parcial.
- Percentis e medianas usam so 10 videos com pelo menos 1.000 impressoes em H; posicoes relativas tem baixa resolucao (passos de 10 pontos).
- Tempo medio assistido vem em segundos inteiros; tempo medio relativo e ordem de grandeza.

## Validações

- 73 checagens automáticas em `calc/analise.py`; 19 falharam.
- Passaram: soma do gasto por anúncio = total da conta em P1, P0 e H (tolerância R$ 0,05); soma das conversas por anúncio = conversas derivadas da conta; soma das quebras de idade e gênero, posicionamento e hora = total de cada anúncio em gasto e conversas; soma do gasto por dia da semana = conta em P1; série diária por anúncio = total de H; nenhuma taxa acima de 100%; nenhuma curva de retenção crescente; decomposição do CPR fecha; deslocamento de fuso constante em setembro.
- Falharam (todas de monotonicidade do funil de conversa derivado; registradas em limitações, nenhum valor corrigido):
  - funil monotonico (p1, Roberto e Duda): profundidade_5 (11) > profundidade_3 (9)
  - funil monotonico (p1, 4-motivos-solie): profundidade_5 (4) > profundidade_3 (2)
  - funil monotonico (p1, Café com Pilates - Setembro): profundidade_5 (7) > profundidade_3 (4)
  - funil monotonico (p0, Roberto e Duda): profundidade_5 (10) > profundidade_3 (3)
  - funil monotonico (p0, Ecobag): profundidade_5 (3) > profundidade_3 (2)
  - funil monotonico (vida, Roberto e Duda): profundidade_5 (21) > profundidade_3 (12)
  - funil monotonico (vida, Por que 2 alunos por aula?): profundidade_5 (19) > profundidade_3 (10)
  - funil monotonico (vida, Inverno-Julho-Frio - Erica): profundidade_5 (36) > profundidade_3 (7)
  - funil monotonico (vida, Novo Horário - Almoço): profundidade_5 (13) > profundidade_3 (5)
  - funil monotonico (vida, Café com Pilates - Setembro): profundidade_5 (7) > profundidade_3 (4)
  - funil monotonico (vida, 4-motivos-solie): profundidade_5 (4) > profundidade_3 (2)
  - funil monotonico (vida, Ecobag): profundidade_5 (3) > profundidade_3 (2)
  - funil monotonico (h, Novo Horário - Almoço): profundidade_5 (5) > profundidade_3 (3)
  - funil monotonico (h, Roberto e Duda): profundidade_5 (21) > profundidade_3 (12)
  - funil monotonico (h, 4-motivos-solie): profundidade_5 (4) > profundidade_3 (2)
  - funil monotonico (h, Café com Pilates - Setembro): profundidade_5 (7) > profundidade_3 (4)
  - funil monotonico (h, Ecobag): profundidade_5 (3) > profundidade_3 (2)
  - funil monotonico (h, Por que 2 alunos por aula?): profundidade_5 (19) > profundidade_3 (10)
  - funil monotonico (h, Inverno-Julho-Frio - Erica): profundidade_3 (5) > profundidade_2 (4); profundidade_5 (16) > profundidade_3 (5)

