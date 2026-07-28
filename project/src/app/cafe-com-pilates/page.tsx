import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPromo } from "@/data/promos";
import { PromoLanding } from "@/components/promo/PromoLanding";

// Slug desta rota. Para uma promo futura, copie este arquivo para
// src/app/<novo-slug>/page.tsx e troque o valor abaixo.
const SLUG = "cafe-com-pilates";

export async function generateMetadata(): Promise<Metadata> {
  const promo = getPromo(SLUG);
  if (!promo) return { robots: { index: false, follow: false } };

  // O subtítulo tem quebras de linha (\n) para exibição; no metadata vira espaço.
  const descricao = promo.subtitulo.replace(/\s*\n\s*/g, " ");

  return {
    title: `${promo.titulo} | Soliê Pilates`,
    description: descricao,
    // Campanha temporária: não deve ser indexada nem competir no SEO do domínio.
    robots: { index: false, follow: false },
    openGraph: {
      title: promo.titulo,
      description: descricao,
      type: "website",
      locale: "pt_BR",
      siteName: "Soliê Pilates",
    },
  };
}

export default function CafeComPilatesPage() {
  const promo = getPromo(SLUG);
  // PROMO_ATIVA=false ou slug inexistente => 404 (reusa not-found.tsx).
  if (!promo) notFound();

  return <PromoLanding promo={promo} />;
}
