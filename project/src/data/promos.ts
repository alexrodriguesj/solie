// =============================================================================
// SISTEMA DE PROMOÇÕES — Soliê Pilates
// =============================================================================
//
// COMO LIGAR/DESLIGAR A PROMO:
//   Mude PROMO_ATIVA abaixo para `true` (liga) ou `false` (desliga).
//   Desligada => a rota /promo-ensaio retorna 404 e o banner do site some.
//
// COMO EDITAR O CONTEÚDO:
//   Edite o objeto dentro de `promos` (título, subtítulo, vídeo, prêmio,
//   regulamento, etc.). Nenhum layout precisa ser tocado.
//
// COMO ADICIONAR UMA PROMO FUTURA:
//   1. Duplique o objeto "promo-ensaio" dentro de `promos` com um novo slug.
//   2. Aponte PROMO_SLUG_ATIVA para o novo slug.
//   3. Crie a rota: copie src/app/promo-ensaio/page.tsx para
//      src/app/<novo-slug>/page.tsx e troque o slug na chamada getPromo().
//   O mecanismo (layout, componentes) é compartilhado — não muda.
// =============================================================================

/** Liga/desliga TODAS as promos de uma vez. */
export const PROMO_ATIVA = false;

/** Slug da promo exibida hoje (precisa existir em `promos`). */
export const PROMO_SLUG_ATIVA = "promo-ensaio";

export interface Promo {
  /** Slug da URL: /<slug> */
  slug: string;
  titulo: string;
  subtitulo: string;
  /**
   * Caminho/URL do vídeo da campanha. Deixe "" (string vazia) ou "VIDEO_URL"
   * para esconder o player e cair na imagem.
   */
  videoUrl: string;
  /** Imagem da campanha (poster do vídeo + arte exibida no bloco do prêmio). */
  imagemUrl: string;
  /** Bullets do bloco "O prêmio". */
  premio: string[];
  /** Mensagem pré-preenchida do WhatsApp (o número vem de siteConfig.whatsapp). */
  whatsappMensagem: string;
  /** Texto curto do banner do site (topo). */
  bannerTexto: string;
  bannerTextoMobile: string;
  /** Data de fim da campanha (ISO). Usada no aviso de prazo. */
  dataFim: string;
  /** Regulamento completo (renderizado com quebras de linha preservadas). */
  regulamento: string;
}

export const promos: Record<string, Promo> = {
  // ENCERRADA: sorteio realizado em 18/07/2026. Mantida como modelo para a
  // próxima campanha. Antes de religar (PROMO_ATIVA = true), atualize datas,
  // prêmio, regulamento e textos do banner.
  "promo-ensaio": {
    slug: "promo-ensaio",
    titulo: "Sorteio de Ensaio Fotográfico",
    subtitulo: "Feche seu plano semestral 2x na semana até 18/07 e concorra",
    // Artes da campanha encerrada foram removidas do repo. Preencha com os
    // arquivos da próxima promo antes de religar.
    videoUrl: "",
    imagemUrl: "",
    premio: [
      "1h de sessão",
      "20 fotos editadas em alta resolução",
      "Estilos à escolha: profissional, casual ou pré-aniversário",
      "Sorteio ao vivo dia 18/07 nos Stories do @soliepilates",
    ],
    whatsappMensagem:
      "Olá! Quero participar do sorteio de ensaio fotográfico e fechar meu plano semestral 2x na semana.",
    bannerTexto: "SORTEIO DE ENSAIO FOTOGRÁFICO: feche seu plano semestral até 18/07 e concorra!",
    bannerTextoMobile: "Sorteio de ensaio fotográfico até 18/07!",
    dataFim: "2026-07-18",
    regulamento: `A Soliê Pilates, em parceria com a fotógrafa Erica, vai sortear um ensaio fotográfico profissional. Confira as regras:

QUEM PODE PARTICIPAR
- Novos alunos que fecharem plano semestral 2x na semana no período da campanha
- Alunos atuais que fizerem upgrade para o plano semestral 2x na semana

PERÍODO DA CAMPANHA
- De 17/06/2026 a 18/07/2026
- Contratos fechados fora desse período não participam

O PRÊMIO
- 1 ensaio fotográfico profissional com a Erica
- Duração: 1 hora
- 20 fotos editadas em alta resolução
- Tipos de ensaio: pré-aniversário, profissional ou casual
- Local: ar livre ou estúdio (por conta do sorteado, valor médio de R$ 130 a R$ 150/hora caso opte por estúdio)
- Ensaio individual, fotos feitas somente com o sorteado

SORTEIO
- Data: 18/07/2026 (ao vivo nos Stories do @soliepilates)
- Cada contrato = 1 número no sorteio
- O sorteado será comunicado por WhatsApp e divulgado nos Stories

CONDIÇÕES
- O contrato precisa estar assinado e com o primeiro pagamento realizado
- O sorteado deve estar com o plano ativo e em dia no momento do sorteio
- O ensaio deve ser realizado em até 30 dias após o sorteio
- O prêmio é transferível para maiores de 18 anos`,
  },
};

/** Retorna a promo do slug se PROMO_ATIVA; senão null (=> 404 na rota). */
export function getPromo(slug: string): Promo | null {
  if (!PROMO_ATIVA) return null;
  return promos[slug] ?? null;
}

/** Promo ativa atual (para o banner do site). */
export function getPromoAtiva(): Promo | null {
  if (!PROMO_ATIVA) return null;
  return promos[PROMO_SLUG_ATIVA] ?? null;
}

/** Marcador de vídeo ainda não preenchido. */
export const VIDEO_PLACEHOLDER = "VIDEO_URL";
