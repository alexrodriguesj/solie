"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Star, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { avaliacoes } from "@/data/avaliacoes";
import { siteConfig } from "@/data/content";
import { formatWhatsAppLink } from "@/lib/utils";

// Bento grid mosaic: fotos encaixam como quebra-cabeça
const bentoPhotos = [
  { src: "/images/alunos/10.jpg", alt: "Aluna em exercício invertido no reformer" },
  { src: "/images/alunos/02.PNG", alt: "Aula de Pilates Soliê" },
  { src: "/images/alunos/03.PNG", alt: "Pilates Água Verde Curitiba" },
  { src: "/images/alunos/11.jpg", alt: "Instrutora orienta aluna na Soliê Pilates" },
  { src: "/images/alunos/05.PNG", alt: "Pilates personalizado Curitiba" },
  { src: "/images/alunos/04.PNG", alt: "Studio Soliê Pilates" },
  { src: "/images/alunos/06.PNG", alt: "Pilates Soliê" },
  { src: "/images/alunos/12.jpg", alt: "Aluna em equilíbrio no reformer" },
  { src: "/images/alunos/07.PNG", alt: "Aluna Soliê Pilates" },
  { src: "/images/alunos/13.jpg", alt: "Instrutoras e alunas da Soliê Pilates" },
  { src: "/images/alunos/14.jpg", alt: "Aluna com a bola suíça no estúdio" },
  { src: "/images/alunos/01.PNG", alt: "Alunos Soliê Pilates" },
  { src: "/images/alunos/15.jpg", alt: "Instrutora acompanha aluna de perto" },
  { src: "/images/alunos/08.PNG", alt: "Treino de Pilates Soliê" },
  { src: "/images/alunos/09.PNG", alt: "Pilates personalizado Soliê" },
];

// Layout mosaico 2 rows × 3 cols por tile:
// [1: 1×2 tall] [2: 1×1] [3: 1×1]
//               [4: 1×1] [5: 1×1]
// Três variantes para distribuir as 15 fotos
const tileA = [
  { photo: 0, className: "row-span-2", style: "aspect-[3/4]" },
  { photo: 1, className: "", style: "" },
  { photo: 2, className: "", style: "" },
  { photo: 3, className: "", style: "" },
  { photo: 4, className: "", style: "" },
];

const tileB = [
  { photo: 5, className: "", style: "" },
  { photo: 6, className: "", style: "" },
  { photo: 7, className: "row-span-2", style: "aspect-[3/4]" },
  { photo: 8, className: "", style: "" },
  { photo: 9, className: "", style: "" },
];

const tileC = [
  { photo: 10, className: "row-span-2", style: "aspect-[3/4]" },
  { photo: 11, className: "", style: "" },
  { photo: 12, className: "", style: "" },
  { photo: 13, className: "", style: "" },
  { photo: 14, className: "", style: "" },
];

function BentoTile({ variant, offset }: { variant: "A" | "B" | "C"; offset: number }) {
  const slots = variant === "A" ? tileA : variant === "B" ? tileB : tileC;
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
        {Array.from({ length: 9 }).map((_, i) => (
          <BentoTile
            key={i}
            variant={i % 3 === 0 ? "A" : i % 3 === 1 ? "B" : "C"}
            offset={i}
          />
        ))}
      </div>
    </div>
  );
}

const TEMPO_MINIMO = 7000;
const TEMPO_POR_CARACTERE = 60;
const DISTANCIA_SWIPE = 50;

export function GoogleReviews() {
  const [index, setIndex] = useState(0);
  const avaliacao = avaliacoes[index];

  const irPara = (novoIndex: number) => {
    setIndex((novoIndex + avaliacoes.length) % avaliacoes.length);
  };

  // Troca sozinho, com tempo proporcional ao tamanho do texto
  useEffect(() => {
    const tempo = Math.max(TEMPO_MINIMO, avaliacoes[index].text.length * TEMPO_POR_CARACTERE);
    const timeout = setTimeout(() => {
      setIndex((prev) => (prev + 1) % avaliacoes.length);
    }, tempo);
    return () => clearTimeout(timeout);
  }, [index]);

  return (
    <section id="avaliacoes" className="pb-12 md:pb-20 bg-solie-beige-light">
      <Container>
        {/* Nota */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-4 md:gap-5">
            <span className="font-serif font-light text-6xl md:text-8xl leading-none text-solie-green">
              5.0
            </span>
            <div className="text-left">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-5 h-5 md:w-6 md:h-6 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="mt-1 text-sm md:text-base text-muted">no Google</p>
            </div>
          </div>

          <h2 className="mt-4 md:mt-6 text-2xl md:text-4xl lg:text-5xl font-bold text-solie-green">
            Não somos nós que dizemos
          </h2>
        </motion.div>

        {/* Depoimento */}
        <div className="relative max-w-4xl mx-auto mt-8 md:mt-12 md:px-14">
          <button
            onClick={() => irPara(index - 1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg items-center justify-center text-solie-green hover:bg-solie-green hover:text-white transition-colors hidden md:flex"
            aria-label="Avaliação anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => irPara(index + 1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg items-center justify-center text-solie-green hover:bg-solie-green hover:text-white transition-colors hidden md:flex"
            aria-label="Próxima avaliação"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="grid">
            <AnimatePresence mode="wait">
              <motion.figure
                key={avaliacao.name}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.4}
                dragDirectionLock
                onDragEnd={(_, info) => {
                  if (info.offset.x <= -DISTANCIA_SWIPE) irPara(index + 1);
                  if (info.offset.x >= DISTANCIA_SWIPE) irPara(index - 1);
                }}
                className="touch-pan-y cursor-grab active:cursor-grabbing rounded-2xl bg-white shadow-sm p-6 md:p-10 min-h-[400px] md:min-h-[320px] flex flex-col"
              >
                <div className="flex gap-1 mb-4" aria-label="5 estrelas">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="flex-grow text-base md:text-lg leading-relaxed text-foreground">
                  {avaliacao.text}
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3 font-semibold text-foreground">
                  <span className="w-10 h-10 rounded-full bg-solie-beige flex items-center justify-center text-solie-green font-bold">
                    {avaliacao.name.charAt(0)}
                  </span>
                  {avaliacao.name}
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {/* Pontos */}
          <div className="flex justify-center gap-2 mt-5">
            {avaliacoes.map((item, i) => (
              <button
                key={item.name}
                onClick={() => irPara(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === index ? "bg-solie-green" : "bg-solie-beige-dark hover:bg-solie-green/50"
                }`}
                aria-label={`Avaliação ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Bento Grid Carousel - full bleed */}
        <BentoPhotoCarousel />

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col items-center gap-4"
        >
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
          <a
            href="https://share.google/TOQ7IZAUrBRjRZF9d"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-solie-green underline underline-offset-4"
          >
            Ver todas as avaliações no Google
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      </Container>
    </section>
  );
}
