// =============================================================================
// SISTEMA DE PROMOÇÕES / CAMPANHAS — Soliê Pilates
// =============================================================================
//
// COMO LIGAR/DESLIGAR A PROMO:
//   Mude PROMO_ATIVA abaixo para `true` (liga) ou `false` (desliga).
//   Desligada => a rota /<slug> retorna 404, o banner do topo e o bloco de
//   destaque na home somem.
//
// COMO EDITAR O CONTEÚDO:
//   Edite o objeto dentro de `promos` (título, subtítulo, vídeo, benefícios,
//   datas, detalhes, textos do banner). Nenhum layout precisa ser tocado — a
//   PromoLanding e o bloco da home são 100% data-driven.
//
// COMO ADICIONAR UMA PROMO FUTURA:
//   1. Duplique o objeto ativo dentro de `promos` com um novo slug.
//   2. Aponte PROMO_SLUG_ATIVA para o novo slug.
//   3. Crie a rota: copie src/app/cafe-com-pilates/page.tsx para
//      src/app/<novo-slug>/page.tsx e troque o slug na constante SLUG.
//   O mecanismo (layout, componentes) é compartilhado — não muda.
//
// O modelo é genérico: serve tanto um EVENTO (recorrência + vagas) quanto um
// SORTEIO (prazo + regulamento). Campos como `recorrencia`, `vagas` e `local`
// são opcionais — deixe "" para escondê-los.
// =============================================================================

/** Liga/desliga TODAS as promos de uma vez. */
export const PROMO_ATIVA = true;

/** Slug da promo exibida hoje (precisa existir em `promos`). */
export const PROMO_SLUG_ATIVA = "cafe-com-pilates";

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
  /** Imagem da campanha (poster do vídeo + arte exibida nos blocos). */
  imagemUrl: string;
  /** Selo curto acima do título no hero. Ex: "Evento Soliê". */
  selo: string;
  /** Bullets do bloco de destaques (o que você vive/ganha). */
  beneficios: string[];
  /** Título da seção de benefícios. Ex: "O que você vai viver". */
  beneficiosTitulo: string;
  /** Data de referência (ISO): próxima edição ou encerramento. */
  data: string;
  /** Rótulo da data no hero. Ex: "Próxima turma" ou "Campanha até". */
  dataLabel: string;
  /** Texto de recorrência (opcional). Ex: "Toda segunda semana do mês". */
  recorrencia: string;
  /** Texto de vagas/escassez (opcional). Ex: "Apenas 4 vagas por turma". */
  vagas: string;
  /** Local curto exibido no hero (opcional). Ex: "Água Verde, Curitiba". */
  local: string;
  /** Texto do botão de CTA. Ex: "Quero minha vaga". */
  ctaTexto: string;
  /** Mensagem pré-preenchida do WhatsApp (o número vem de siteConfig.whatsapp). */
  whatsappMensagem: string;
  /** Texto curto do banner do site (topo). */
  bannerTexto: string;
  bannerTextoMobile: string;
  /**
   * Texto longo do accordion (como funciona / regulamento). Linhas em
   * MAIÚSCULAS viram títulos; linhas começando com "-" viram bullets.
   */
  detalhes: string;
  /** Título do accordion. Ex: "Como funciona" ou "Regulamento completo". */
  detalhesTitulo: string;
}

export const promos: Record<string, Promo> = {
  "cafe-com-pilates": {
    slug: "cafe-com-pilates",
    titulo: "Café com Pilates",
    subtitulo:
      "Uma manhã pra você experimentar o Pilates da Soliê:\naula em turma reduzida, café especial e brindes.\nLeve, acolhedor e 100% personalizado.",
    videoUrl: "/videos/cafe-com-pilates.mp4",
    imagemUrl: "/images/cafe-com-pilates.jpg",
    selo: "Evento Soliê",
    beneficiosTitulo: "O que você vai viver",
    beneficios: [
      "Aula experimental de Pilates, 100% personalizada",
      "Turma reduzida: só 4 pessoas por edição",
      "Café da manhã especial num ambiente leve e acolhedor",
      "Brindes exclusivos pra quem participa (é surpresa!)",
    ],
    data: "2026-08-12",
    dataLabel: "Próxima turma",
    recorrencia: "Acontece na segunda semana de cada mês",
    vagas: "Apenas 4 vagas por edição, e é gratuito",
    local: "Água Verde, Curitiba",
    ctaTexto: "Quero minha vaga",
    whatsappMensagem:
      "Olá! Quero garantir minha vaga no Café com Pilates. Pode me passar as informações da próxima turma?",
    bannerTexto:
      "CAFÉ COM PILATES: aula experimental gratuita, café e brindes em turma de 4 pessoas. Vagas limitadas!",
    bannerTextoMobile: "Café com Pilates: vaga grátis, turma de 4!",
    detalhes: `O QUE É
- Uma manhã pra você experimentar o Pilates da Soliê, sem compromisso
- Aula experimental guiada pelas nossas instrutoras, 100% personalizada
- Café da manhã especial num ambiente leve e acolhedor
- Brindes exclusivos pra quem participa

COMO FUNCIONA
- Turma reduzida: apenas 4 alunos por edição
- Acontece na segunda semana de cada mês
- Próxima edição: 12/08/2026 (próximas datas a confirmar)
- Gratuito, mediante inscrição; as vagas são limitadas

ONDE
- Studio Soliê Pilates
- Av. Rep. Argentina, 1237 - Sala 610, Água Verde, Curitiba - PR

COMO GARANTIR SUA VAGA
- Clique em "Quero minha vaga" e fale com a gente no WhatsApp
- Confirmamos sua vaga e passamos os detalhes da próxima turma`,
    detalhesTitulo: "Como funciona",
  },
};

/** Retorna a promo do slug se PROMO_ATIVA; senão null (=> 404 na rota). */
export function getPromo(slug: string): Promo | null {
  if (!PROMO_ATIVA) return null;
  return promos[slug] ?? null;
}

/** Promo ativa atual (para o banner e o bloco de destaque da home). */
export function getPromoAtiva(): Promo | null {
  if (!PROMO_ATIVA) return null;
  return promos[PROMO_SLUG_ATIVA] ?? null;
}

/** Marcador de vídeo ainda não preenchido. */
export const VIDEO_PLACEHOLDER = "VIDEO_URL";
