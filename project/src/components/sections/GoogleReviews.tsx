"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, ExternalLink, Star, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { avaliacoes } from "@/data/avaliacoes";
import { siteConfig } from "@/data/content";
import { formatWhatsAppLink } from "@/lib/utils";

// Bento grid mosaic: fotos encaixam como quebra-cabeça
const bentoPhotos = [
  { src: "/images/alunos/01.PNG", alt: "Alunos Soliê Pilates" },
  { src: "/images/alunos/02.PNG", alt: "Aula de Pilates Soliê" },
  { src: "/images/alunos/03.PNG", alt: "Pilates Água Verde Curitiba" },
  { src: "/images/alunos/04.PNG", alt: "Studio Soliê Pilates" },
  { src: "/images/alunos/05.PNG", alt: "Pilates personalizado Curitiba" },
  { src: "/images/alunos/06.PNG", alt: "Pilates Soliê" },
];

// Layout mosaico 2 rows × 3 cols por tile:
// [1: 1×2 tall] [2: 1×1] [3: 1×1]
//               [4: 1×1] [5: 1×1]
// Depois inverte no próximo tile para variar
const tileA = [
  { photo: 0, className: "row-span-2", style: "aspect-[3/4]" },
  { photo: 1, className: "", style: "" },
  { photo: 2, className: "", style: "" },
  { photo: 3, className: "", style: "" },
  { photo: 4, className: "", style: "" },
];

const tileB = [
  { photo: 5, className: "", style: "" },
  { photo: 0, className: "", style: "" },
  { photo: 3, className: "row-span-2", style: "aspect-[3/4]" },
  { photo: 2, className: "", style: "" },
  { photo: 4, className: "", style: "" },
];

function BentoTile({ variant, offset }: { variant: "A" | "B"; offset: number }) {
  const slots = variant === "A" ? tileA : tileB;
  return (
    <div className="grid grid-rows-2 grid-cols-3 gap-2 h-[300px] md:h-[400px] flex-shrink-0 w-[460px] md:w-[600px]">
      {slots.map((slot, i) => (
        <div
          key={`${offset}-${i}`}
          className={`${slot.className} rounded-xl overflow-hidden relative min-h-0`}
        >
          <Image
            src={bentoPhotos[slot.photo].src}
            alt={bentoPhotos[slot.photo].alt}
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
            sizes="250px"
          />
        </div>
      ))}
    </div>
  );
}

function BentoPhotoCarousel() {
  return (
    <div className="relative -mx-[calc(50vw-50%)] w-screen overflow-hidden my-10 [mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)]">
      <div className="flex gap-2 animate-marquee-slow w-max">
        {Array.from({ length: 8 }).map((_, i) => (
          <BentoTile key={i} variant={i % 2 === 0 ? "A" : "B"} offset={i} />
        ))}
      </div>
    </div>
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

export function GoogleReviews() {
  const [startIndex, setStartIndex] = useState(0);
  const isMobile = useIsMobile();
  const itemsPerPage = isMobile ? 1 : 3;
  const totalPages = Math.ceil(avaliacoes.length / itemsPerPage);
  const currentPage = Math.floor(startIndex / itemsPerPage);

  const visibleAvaliacoes = avaliacoes.slice(startIndex, startIndex + itemsPerPage);

  // Auto-slide a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setStartIndex((prev) =>
        prev + itemsPerPage >= avaliacoes.length ? 0 : prev + itemsPerPage
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [itemsPerPage]);

  const nextSlide = () => {
    setStartIndex((prev) =>
      prev + itemsPerPage >= avaliacoes.length ? 0 : prev + itemsPerPage
    );
  };

  const prevSlide = () => {
    setStartIndex((prev) =>
      prev - itemsPerPage < 0 ? Math.max(0, avaliacoes.length - itemsPerPage) : prev - itemsPerPage
    );
  };

  return (
    <section id="avaliacoes" className="py-20 bg-solie-beige-light">
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-solie-green mb-4">
            5.0 Estrelas no Google — Não somos nós que dizemos
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto mb-6">
            A opinião de quem já experimentou e melhorou MUITO sua qualidade de vida
          </p>

          {/* Rating Summary */}
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm">
            <span className="text-2xl font-bold text-solie-green">5.0</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className="w-5 h-5 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
          </div>

        </motion.div>

        {/* Bento Grid Carousel - full bleed */}
        <BentoPhotoCarousel />

        {/* Reviews Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          {avaliacoes.length > itemsPerPage && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-solie-green hover:bg-solie-green hover:text-white transition-colors hidden md:flex"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-solie-green hover:bg-solie-green hover:text-white transition-colors hidden md:flex"
                aria-label="Próximo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Reviews Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <AnimatePresence mode="wait">
              {visibleAvaliacoes.map((avaliacao, index) => (
                <motion.div
                  key={`${avaliacao.name}-${startIndex}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card variant="elevated" className="h-full relative">
                    <Quote className="absolute top-4 right-4 w-8 h-8 text-solie-beige" />
                    <div className="flex flex-col h-full">
                      {/* Stars */}
                      <div className="flex gap-1 mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= avaliacao.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-muted mb-6 flex-grow italic">
                        &ldquo;{avaliacao.text}&rdquo;
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-solie-beige flex items-center justify-center overflow-hidden">
                          <span className="text-solie-green font-bold text-lg">
                            {avaliacao.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {avaliacao.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Pagination Dots */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mb-8">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setStartIndex(index * itemsPerPage)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    currentPage === index
                      ? "bg-solie-green"
                      : "bg-solie-beige hover:bg-solie-green/50"
                  }`}
                  aria-label={`Página ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Mobile Navigation */}
          {avaliacoes.length > itemsPerPage && (
            <div className="flex justify-center gap-4 md:hidden mb-8">
              <button
                onClick={prevSlide}
                className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-solie-green hover:bg-solie-green hover:text-white transition-colors"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-solie-green hover:bg-solie-green hover:text-white transition-colors"
                aria-label="Próximo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="https://share.google/TOQ7IZAUrBRjRZF9d"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <ExternalLink className="w-4 h-4" />
              Ver todas as avaliações no Google
            </Button>
          </a>
          {/* <Button
            variant="primary"
            size="lg"
            onClick={() =>
              document.getElementById("agendamento")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Agende sua Aula
          </Button> */}
          <Button
            variant="whatsapp"
            size="lg"
            className="text-lg md:text-xl px-8 md:px-10 py-4 md:py-5"
            onClick={() =>
              window.open(
                formatWhatsAppLink(
                  siteConfig.whatsapp,
                  "Olá! Gostaria de agendar uma aula experimental de Pilates."
                ),
                "_blank"
              )
            }
          >
            <MessageCircle className="w-6 h-6" />
            Agende sua Aula
          </Button>
        </motion.div>
      </Container>
    </section>
  );
}
