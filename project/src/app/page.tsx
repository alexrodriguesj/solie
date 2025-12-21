import {
  Hero,
  Diferenciais,
  OQueEPilates,
  ConhecaStudio,
  GoogleReviews,
  Agendamento,
  Footer,
} from "@/components/sections";
import { WhatsAppButton } from "@/components/floating";
import { Header } from "@/components/Header";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Diferenciais />
      <OQueEPilates />
      <ConhecaStudio />
      <GoogleReviews />
      <Agendamento />
      <Footer />
      <WhatsAppButton />
    </>
  );
}
