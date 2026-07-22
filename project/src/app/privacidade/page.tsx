import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/sections/Footer";
import { WhatsAppButton } from "@/components/floating";
import { BannerProvider } from "@/contexts/BannerContext";
import { Container } from "@/components/ui/Container";
import { getPrivacidadeHtml } from "@/lib/privacidade";

export const metadata: Metadata = {
  title: "Política de Privacidade | Soliê Pilates",
  description:
    "Como a Soliê Pilates trata os dados pessoais de quem visita o site, conforme a LGPD: cookies, newsletter, seus direitos e como exercê-los.",
  alternates: {
    canonical: "https://soliepilates.com.br/privacidade",
  },
  openGraph: {
    title: "Política de Privacidade | Soliê Pilates",
    description:
      "Como a Soliê Pilates trata os dados pessoais de quem visita o site, conforme a LGPD.",
    type: "website",
    locale: "pt_BR",
    siteName: "Soliê Pilates",
    url: "https://soliepilates.com.br/privacidade",
  },
};

export default async function PrivacidadePage() {
  const content = await getPrivacidadeHtml();

  return (
    <BannerProvider disabled>
      <Header />
      <main className="pt-24 md:pt-28 pb-16 bg-white min-h-screen">
        <Container size="md">
          <div
            className="prose prose-lg max-w-none px-4 md:px-0
              prose-headings:font-serif prose-headings:text-solie-green prose-headings:font-bold
              prose-h1:text-3xl md:prose-h1:text-4xl prose-h1:mb-4 prose-h1:leading-tight
              prose-h2:border-l-[3px] prose-h2:border-solie-green prose-h2:pl-4 prose-h2:mt-10 prose-h2:mb-4
              prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-foreground/80 prose-p:leading-relaxed prose-p:mb-6
              prose-strong:text-foreground
              prose-li:text-foreground/80 prose-li:leading-relaxed
              prose-a:text-solie-green prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </Container>
      </main>
      <Footer />
      <WhatsAppButton />
    </BannerProvider>
  );
}
