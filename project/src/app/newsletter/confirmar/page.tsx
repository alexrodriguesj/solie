import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/sections/Footer";
import { WhatsAppButton } from "@/components/floating";
import { BannerProvider } from "@/contexts/BannerContext";
import { Container } from "@/components/ui/Container";
import { ConfirmarClient } from "./ConfirmarClient";

export const metadata: Metadata = {
  title: "Confirmar cadastro | Soliê Pilates",
  robots: { index: false, follow: false },
};

export default function NewsletterConfirmarPage() {
  return (
    <BannerProvider disabled>
      <Header />
      <main className="pt-24 md:pt-28 pb-16 bg-white min-h-screen flex items-center">
        <Container size="sm">
          <div className="px-4 md:px-0 py-12">
            <Suspense
              fallback={
                <p className="text-center text-foreground/60">Carregando...</p>
              }
            >
              <ConfirmarClient />
            </Suspense>
          </div>
        </Container>
      </main>
      <Footer />
      <WhatsAppButton />
    </BannerProvider>
  );
}
