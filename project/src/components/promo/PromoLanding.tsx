"use client";

import Image from "next/image";
import {
  Clock,
  Images,
  Palette,
  Instagram,
  CalendarClock,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/sections/Footer";
import { Container } from "@/components/ui/Container";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { BannerProvider } from "@/contexts/BannerContext";
import { siteConfig } from "@/data/content";
import { formatWhatsAppLink, analytics, trackEvent } from "@/lib/utils";
import { VIDEO_PLACEHOLDER, type Promo } from "@/data/promos";
import { RegulamentoAccordion } from "./RegulamentoAccordion";

interface PromoLandingProps {
  promo: Promo;
}

// Ícones para cada bullet do prêmio (na ordem do array `premio`).
const premioIcons = [Clock, Images, Palette, Instagram];

function formatarDataFim(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  if (!ano || !mes || !dia) return iso;
  return `${dia}/${mes}/${ano}`;
}

export function PromoLanding({ promo }: PromoLandingProps) {
  const temVideo = promo.videoUrl && promo.videoUrl !== VIDEO_PLACEHOLDER;
  const whatsappLink = formatWhatsAppLink(siteConfig.whatsapp, promo.whatsappMensagem);

  const participar = (origem: string) => {
    trackEvent("promo_cta_click", { campanha: promo.slug, origem });
    analytics.metaContact(`promo_${promo.slug}`);
    window.open(whatsappLink, "_blank");
  };

  return (
    <BannerProvider disabled>
      <Header />

      <main className="bg-solie-beige-light pb-28 md:pb-0">
        {/* ---------------- Hero ---------------- */}
        <section className="bg-solie-green pt-24 md:pt-32 pb-14 md:pb-20">
          <Container size="md">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 text-xs md:text-sm uppercase tracking-[0.3em] text-solie-beige/80 font-medium">
                <Sparkles className="w-4 h-4" />
                Campanha Soliê
              </span>
              <div className="w-16 h-px bg-solie-beige/30 mx-auto my-5" />

              <h1 className="font-serif font-light text-white leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                {promo.titulo}
              </h1>
              <p className="mt-5 text-base sm:text-lg text-solie-beige/90 max-w-xl mx-auto leading-relaxed">
                {promo.subtitulo}
              </p>

              {/* Vídeo (com a arte como poster) */}
              <div className="mt-9 mx-auto w-full max-w-[320px]">
                {temVideo ? (
                  <VideoPlayer
                    src={promo.videoUrl}
                    name={`promo_${promo.slug}`}
                    poster={promo.imagemUrl}
                    autoUnmute
                    className="aspect-[9/16]"
                  />
                ) : (
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-lg">
                    <Image
                      src={promo.imagemUrl}
                      alt={promo.titulo}
                      fill
                      className="object-cover"
                      sizes="320px"
                    />
                  </div>
                )}
              </div>

              {/* CTA + prazo (empilhados) */}
              <div className="mt-9 flex flex-col items-center gap-4">
                <button
                  onClick={() => participar("hero")}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold px-9 py-3.5 text-base min-h-[48px] shadow-lg transition-all hover:scale-[1.02]"
                >
                  <MessageCircle className="w-5 h-5" />
                  Quero participar
                </button>
                <span className="inline-flex items-center gap-1.5 text-sm text-solie-beige/70">
                  <CalendarClock className="w-4 h-4" />
                  Campanha até {formatarDataFim(promo.dataFim)}
                </span>
              </div>
            </div>
          </Container>
        </section>

        {/* ---------------- O prêmio ---------------- */}
        <section className="py-14 md:py-20">
          <Container size="lg">
            <div className="text-center mb-10 md:mb-12">
              <span className="text-xs md:text-sm uppercase tracking-[0.3em] text-solie-green font-medium">
                O que você ganha
              </span>
              <div className="w-16 h-px bg-solie-green/30 mx-auto my-4" />
              <h2 className="font-serif font-light text-solie-green text-3xl md:text-4xl leading-tight">
                O prêmio
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              {/* Arte da campanha */}
              <div className="relative aspect-[4/5] max-w-[420px] w-full mx-auto rounded-2xl overflow-hidden shadow-md">
                <Image
                  src={promo.imagemUrl}
                  alt="Arte da campanha de sorteio do ensaio fotográfico, parceria Soliê Pilates e Erica Melo Fotografia"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 420px, 100vw"
                />
              </div>

              {/* Bullets do prêmio */}
              <div>
                <ul className="space-y-4">
                  {promo.premio.map((item, i) => {
                    const Icon = premioIcons[i] ?? Sparkles;
                    return (
                      <li
                        key={item}
                        className="flex items-start gap-4 rounded-2xl bg-white border border-solie-beige-dark/40 px-5 py-4 shadow-sm"
                      >
                        <span className="mt-0.5 flex-shrink-0 w-10 h-10 rounded-full bg-solie-green/10 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-solie-green" />
                        </span>
                        <span className="text-foreground/90 leading-snug self-center">
                          {item}
                        </span>
                      </li>
                    );
                  })}
                </ul>

                <button
                  onClick={() => participar("premio")}
                  className="mt-7 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold px-9 py-3.5 text-base min-h-[48px] shadow transition-all hover:scale-[1.02]"
                >
                  <MessageCircle className="w-5 h-5" />
                  Quero participar
                </button>
              </div>
            </div>
          </Container>
        </section>

        {/* ---------------- Regulamento ---------------- */}
        <section className="pb-16 md:pb-24">
          <Container size="sm">
            <RegulamentoAccordion texto={promo.regulamento} />
          </Container>
        </section>
      </main>

      <Footer />

      {/* CTA sticky (mobile) */}
      <div className="fixed bottom-0 inset-x-0 z-50 md:hidden border-t border-solie-beige-dark/50 bg-white/95 backdrop-blur px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <button
          onClick={() => participar("sticky")}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white font-semibold py-3.5 text-base min-h-[48px] transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          Quero participar
        </button>
      </div>
    </BannerProvider>
  );
}
