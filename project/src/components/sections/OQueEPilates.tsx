"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  SplineIcon as Spine,
  PersonStanding,
  Zap,
  Brain,
  Baby,
  Dumbbell,
  MessageCircle,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
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

        {/* Videos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 px-2 md:px-0 mb-8 md:mb-12">
          {videos.map((src, index) => (
            <VideoCard key={src} src={src} index={index} />
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-2 md:px-0">
          {oQueEPilates.map((item, index) => {
            const Icon = iconMap[item.icon];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="[perspective:800px]"
              >
                <div className="group relative w-full h-full cursor-pointer [transform-style:preserve-3d] transition-transform duration-500 [&:hover]:[transform:rotateY(180deg)]">
                  {/* Front */}
                  <div className="[backface-visibility:hidden] rounded-xl bg-white border-2 border-solie-beige shadow-sm p-5 flex flex-col items-center justify-center text-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-solie-green/10 flex items-center justify-center">
                      {Icon && <Icon className="w-7 h-7 text-solie-green" />}
                    </div>
                    <h3 className="text-base md:text-lg font-semibold text-foreground">
                      {item.title}
                    </h3>
                  </div>
                  {/* Back */}
                  <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl bg-solie-accent shadow-sm p-5 flex items-center justify-center text-center">
                    <p className="text-sm md:text-base text-white leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
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
