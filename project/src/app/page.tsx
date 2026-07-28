import {
  Hero,
  PromoDestaque,
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
      <PromoDestaque />
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
