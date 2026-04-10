"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import {
  SplineIcon as Spine,
  PersonStanding,
  Zap,
  Brain,
  Baby,
  Dumbbell,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { FlipCard } from "@/components/ui/FlipCard";
import { oQueEPilates, siteConfig } from "@/data/content";
import { formatWhatsAppLink } from "@/lib/utils";

const videos = ["/videos/01.mp4", "/videos/02.mp4", "/videos/03.mp4"];

const iconMap: Record<string, React.ElementType> = {
  Spine,
  Activity: PersonStanding,
  Zap,
  Brain,
  Baby,
  Dumbbell,
};

function VideoCarousel({ videos: videoSrcs }: { videos: string[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi]);

  return (
    <div className="relative px-2 mb-8">
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex">
          {videoSrcs.map((src, index) => (
            <div key={src} className="flex-[0_0_100%] min-w-0">
              <VideoCard src={src} index={index} />
            </div>
          ))}
        </div>
      </div>
      {/* Arrows */}
      <button
        onClick={scrollPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 shadow-md"
        aria-label="Anterior"
      >
        <ChevronLeft className="w-5 h-5 text-solie-green" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/80 shadow-md"
        aria-label="Próximo"
      >
        <ChevronRight className="w-5 h-5 text-solie-green" />
      </button>
      {/* Dots */}
      <div className="flex justify-center gap-2 mt-3">
        {videoSrcs.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === selectedIndex
                ? "bg-solie-green w-6"
                : "bg-solie-green/30"
            }`}
            aria-label={`Vídeo ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function VideoCard({ src, index }: { src: string; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      className="overflow-hidden rounded-2xl shadow-md aspect-[5/6]"
    >
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        className="w-full h-full object-cover"
      />
    </motion.div>
  );
}

export function OQueEPilates() {
  return (
    <section id="pilates" className="py-12 md:py-20 bg-solie-beige-light">
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-16 px-4"
        >
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-solie-green mb-3 md:mb-4">
            Para quem é o Pilates?
          </h2>
          <p className="text-base md:text-lg text-muted max-w-2xl mx-auto">
            O Pilates é indicado para todas as idades e condições físicas.
            <br />
            Descubra como podemos ajudar você
          </p>
        </motion.div>

        {/* Videos — carrossel no mobile, grid no desktop */}
        <div className="sm:hidden">
          <VideoCarousel videos={videos} />
        </div>
        <div className="hidden sm:grid sm:grid-cols-3 gap-4 md:gap-6 px-2 md:px-0 mb-8 md:mb-12">
          {videos.map((src, index) => (
            <VideoCard key={src} src={src} index={index} />
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-3 lg:grid-cols-3 gap-2 md:gap-6 px-2 md:px-0">
          {oQueEPilates.map((item, index) => {
            const Icon = iconMap[item.icon];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="min-h-[110px]"
              >
                <FlipCard
                  className="w-full h-full"
                  frontClassName="rounded-xl bg-white border-2 border-solie-beige shadow-sm p-2 md:p-5 flex flex-col items-center justify-center text-center gap-1.5 md:gap-3"
                  backClassName="rounded-xl bg-solie-accent shadow-sm p-2 md:p-5 flex items-center justify-center text-center"
                  front={
                    <>
                      <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-solie-green/10 flex items-center justify-center">
                        {Icon && <Icon className="w-5 h-5 md:w-7 md:h-7 text-solie-green" />}
                      </div>
                      <h3 className="text-[10px] leading-tight md:text-lg font-semibold text-foreground">
                        {item.title}
                      </h3>
                    </>
                  }
                  back={
                    <p className="text-[9px] leading-tight md:text-base text-white">
                      {item.description}
                    </p>
                  }
                />
              </motion.div>
            );
          })}
        </div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mt-8 md:mt-12 px-4 md:px-0"
        >
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
