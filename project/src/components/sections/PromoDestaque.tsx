"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, CalendarClock, Ticket, ArrowRight, PlayCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { getPromoAtiva } from "@/data/promos";
import { trackEvent } from "@/lib/utils";

function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  if (!ano || !mes || !dia) return iso;
  return `${dia}/${mes}/${ano}`;
}

export function PromoDestaque() {
  const promo = getPromoAtiva();
  if (!promo) return null;

  const handleClick = () => {
    trackEvent("promo_home_destaque_click", { campanha: promo.slug });
  };

  return (
    <section className="py-12 md:py-16 bg-solie-beige-light">
      <Container size="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-3xl bg-solie-green shadow-xl"
        >
          <div className="grid md:grid-cols-2 items-stretch">
            {/* Poster (linka pra página, sem autoplay) */}
            <Link
              href={`/${promo.slug}`}
              onClick={handleClick}
              aria-label={`Saiba mais sobre ${promo.titulo}`}
              className="relative block min-h-[280px] md:min-h-[420px] group"
            >
              <Image
                src={promo.imagemUrl}
                alt={`${promo.titulo}, evento experimental da Soliê Pilates`}
                fill
                className="object-cover md:object-[center_40%] group-hover:scale-[1.03] transition-transform duration-500"
                sizes="(min-width: 768px) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-black/45 backdrop-blur px-3 py-1.5 text-white text-sm font-medium">
                <PlayCircle className="w-4 h-4" />
                Assista ao convite
              </span>
            </Link>

            {/* Conteúdo */}
            <div className="p-8 md:p-12 flex flex-col justify-center text-center md:text-left">
              <span className="inline-flex items-center justify-center md:justify-start gap-2 text-xs uppercase tracking-[0.25em] text-solie-beige/80 font-medium">
                <Sparkles className="w-4 h-4" />
                {promo.selo}
              </span>

              <h2 className="mt-4 font-serif font-light text-white text-3xl md:text-4xl lg:text-5xl leading-tight">
                {promo.titulo}
              </h2>

              <p className="mt-4 text-solie-beige/90 leading-relaxed max-w-md mx-auto md:mx-0 whitespace-normal md:whitespace-pre-line">
                {promo.subtitulo}
              </p>

              {/* Chips de data e vagas */}
              <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-2">
                <span className="inline-flex items-center gap-1.5 text-sm text-solie-beige/85">
                  <CalendarClock className="w-4 h-4 flex-shrink-0" />
                  {promo.dataLabel}: {formatarData(promo.data)}
                </span>
                {promo.vagas && (
                  <span className="inline-flex items-center gap-1.5 text-sm text-solie-beige/85">
                    <Ticket className="w-4 h-4 flex-shrink-0" />
                    {promo.vagas}
                  </span>
                )}
              </div>

              <div className="mt-8 flex justify-center md:justify-start">
                <Link
                  href={`/${promo.slug}`}
                  onClick={handleClick}
                  className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-solie-beige-light text-solie-green font-semibold px-8 py-3.5 text-base min-h-[48px] shadow-lg transition-all hover:scale-[1.02]"
                >
                  {promo.ctaTexto}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
