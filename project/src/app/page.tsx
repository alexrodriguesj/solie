import {
  Hero,
  // PromoDestaque, // pausado com o Café com Pilates (ver PROMO_ATIVA em src/data/promos.ts)
  Diferenciais,
  OQueEPilates,
  ConhecaStudio,
  GoogleReviews,
  Agendamento,
  Footer,
} from "@/components/sections";
import { WhatsAppButton } from "@/components/floating";
import { Header } from "@/components/Header";
import { PromoBanner } from "@/components/PromoBanner";
import { BannerProvider } from "@/contexts/BannerContext";

export default function Home() {
  return (
    <BannerProvider>
      <PromoBanner />
      <Header />
      <Hero />
      {/* <PromoDestaque /> pausado com o Café com Pilates; religue junto com PROMO_ATIVA */}
      <Diferenciais />
      <OQueEPilates />
      <ConhecaStudio />
      <GoogleReviews />
      <Agendamento />
      <Footer />
      <WhatsAppButton />
    </BannerProvider>
  );
}
