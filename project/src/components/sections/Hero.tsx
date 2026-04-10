"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/data/content";
import { formatWhatsAppLink } from "@/lib/utils";
import { useBanner } from "@/contexts/BannerContext";

const slides = [
  {
    image: "/images/hero-1.jpg",
    title: "Sua coluna",
    subtitle: "Agradece",
    description: "Pilates clínico para quem vive com dor, tensão ou desconforto. Atendimento individual no Água Verde.",
  },
  {
    image: "/images/hero-2.jpg",
    title: "Máximo 2 alunos",
    subtitle: "Por aula",
    description: "Aqui você não é só mais um. Atendimento personalizado com profissionais de saúde que entendem seu corpo.",
  },
  {
    image: "/images/hero-3.jpg",
    title: "Sem plateia,",
    subtitle: "Sem julgamento",
    description: "Um espaço íntimo e acolhedor para quem tem vergonha de academia, quem nunca fez pilates ou quem precisa recomeçar.",
  },
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { isBannerVisible } = useBanner();

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  // Padding extra quando o banner está visível (44px mobile, 52px desktop)
  const paddingTop = isBannerVisible
    ? "pt-[calc(4rem+44px)] md:pt-[calc(5rem+52px)]"
    : "pt-16 md:pt-20";

  return (
    <section className={`relative h-[70svh] md:h-screen w-full overflow-hidden ${paddingTop}`}>
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={slides[currentSlide].image}
              alt={`Pilates clínico Soliê Água Verde Curitiba - ${slides[currentSlide].subtitle}`}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            {/* Gradient Overlay - Verde Soliê */}
            <div className="absolute inset-0 bg-gradient-to-l from-solie-green/90 via-solie-green/70 to-solie-green/40" />
          </div>

          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-center md:justify-end">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="max-w-2xl text-center md:text-right"
              >
                {/* Logo */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-3 md:mb-8 flex justify-center md:justify-end"
                >
                  <Image
                    src="/images/logo-light.png"
                    alt="Soliê Pilates - Pilates clínico no Água Verde Curitiba"
                    width={240}
                    height={86}
                    className="w-28 md:w-60"
                    priority
                  />
                </motion.div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-light text-solie-beige leading-tight mb-1 md:mb-2">
                  <span className="italic">{slides[currentSlide].title}</span>
                </h1>
                <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-bold text-solie-beige leading-tight mb-3 md:mb-6">
                  {slides[currentSlide].subtitle}
                </h2>

                {/* Description */}
                <p className="text-sm md:text-xl text-solie-beige/90 mb-4 md:mb-8 px-4 md:px-0">
                  {slides[currentSlide].description}
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center md:justify-end px-4 md:px-0">
                  {/* <Button
                    variant="secondary"
                    size="lg"
                    className="text-base font-semibold"
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
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={() => {
          prevSlide();
          setIsAutoPlaying(false);
          setTimeout(() => setIsAutoPlaying(true), 10000);
        }}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-solie-beige/20 hover:bg-solie-beige/40 backdrop-blur-sm transition-all group"
        aria-label="Slide anterior"
      >
        <ChevronLeft className="w-6 h-6 text-solie-beige group-hover:scale-110 transition-transform" />
      </button>
      <button
        onClick={() => {
          nextSlide();
          setIsAutoPlaying(false);
          setTimeout(() => setIsAutoPlaying(true), 10000);
        }}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-solie-beige/20 hover:bg-solie-beige/40 backdrop-blur-sm transition-all group"
        aria-label="Próximo slide"
      >
        <ChevronRight className="w-6 h-6 text-solie-beige group-hover:scale-110 transition-transform" />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-solie-beige w-8"
                : "bg-solie-beige/50 hover:bg-solie-beige/70"
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
