import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/sections/Footer";
import { WhatsAppButton } from "@/components/floating";
import { BannerProvider } from "@/contexts/BannerContext";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Cadastro confirmado | Soliê Pilates",
  robots: { index: false, follow: false },
};

export default function NewsletterConfirmadoPage() {
  return (
    <BannerProvider disabled>
      <Header />
      <main className="pt-24 md:pt-28 pb-16 bg-white min-h-screen flex items-center">
        <Container size="sm">
          <div className="text-center px-4 md:px-0 py-12">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-solie-green mb-4">
              Cadastro confirmado
            </h1>
            <p className="text-lg text-foreground/70 mb-8">
              Você vai receber nossas novidades.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-solie-green text-white px-6 py-3 font-medium hover:bg-solie-green/90 transition-colors"
            >
              Voltar ao início
            </Link>
          </div>
        </Container>
      </main>
      <Footer />
      <WhatsAppButton />
    </BannerProvider>
  );
}
