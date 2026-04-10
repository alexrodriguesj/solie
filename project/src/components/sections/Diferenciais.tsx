"use client";

import { motion } from "framer-motion";
import {
  Stethoscope,
  Users,
  ShieldCheck,
  HeartHandshake,
  TrendingUp,
  Clock,
  MessageCircle,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { FlipCard } from "@/components/ui/FlipCard";
import { diferenciais, siteConfig } from "@/data/content";
import { formatWhatsAppLink } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  Stethoscope,
  Users,
  ShieldCheck,
  HeartHandshake,
  TrendingUp,
  Clock,
};

export function Diferenciais() {
  return (
    <section id="diferenciais" className="py-12 md:py-20 bg-white">
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
            Por que escolher a Soliê?
          </h2>
          <p className="text-base md:text-lg text-muted max-w-2xl mx-auto">
            Oferecemos uma experiência única de Pilates, combinando técnica,
            cuidado e um ambiente acolhedor
          </p>
        </motion.div>

        {/* Mobile: grid 3x2 + vídeo | Desktop: 3 cards | vídeo | 3 cards */}

        {/* Mobile layout */}
        <div className="lg:hidden px-2">
          <div className="grid grid-cols-3 gap-2 mb-4">
            {diferenciais.map((item, index) => {
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
                    frontClassName="rounded-xl bg-white shadow-md p-2 flex flex-col items-center justify-center text-center gap-1.5"
                    backClassName="rounded-xl bg-solie-green shadow-md p-2 flex items-center justify-center text-center"
                    front={
                      <>
                        <div className="w-10 h-10 rounded-full bg-solie-beige flex items-center justify-center">
                          {Icon && <Icon className="w-5 h-5 text-solie-green" />}
                        </div>
                        <h3 className="text-[10px] leading-tight font-semibold text-foreground">
                          {item.title}
                        </h3>
                      </>
                    }
                    back={
                      <p className="text-[9px] leading-tight text-white">
                        {item.description}
                      </p>
                    }
                  />
                </motion.div>
              );
            })}
          </div>
          <div className="overflow-hidden rounded-2xl aspect-[5/6]">
            <VideoPlayer src="/videos/video-institucional.mp4" name="institucional" className="h-full" autoUnmute />
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden lg:flex flex-row gap-6 px-0 items-stretch">
          {/* Left Cards */}
          <div className="flex-1 flex flex-col gap-3">
            {diferenciais.slice(0, 3).map((item, index) => {
              const Icon = iconMap[item.icon];
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex-1"
                >
                  <FlipCard
                    className="w-full h-full"
                    frontClassName="rounded-xl bg-white shadow-md p-4 flex flex-col items-center justify-center text-center gap-3"
                    backClassName="rounded-xl bg-solie-green shadow-md p-4 flex items-center justify-center text-center"
                    front={
                      <>
                        <div className="w-16 h-16 rounded-full bg-solie-beige flex items-center justify-center">
                          {Icon && <Icon className="w-8 h-8 text-solie-green" />}
                        </div>
                        <h3 className="text-xl xl:text-2xl font-semibold text-foreground">
                          {item.title}
                        </h3>
                      </>
                    }
                    back={
                      <p className="text-base xl:text-lg text-white leading-relaxed">
                        {item.description}
                      </p>
                    }
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Video */}
          <div className="w-1/3 flex-shrink-0">
            <VideoPlayer src="/videos/video-institucional.mp4" name="institucional" className="h-full" autoUnmute />
          </div>

          {/* Right Cards */}
          <div className="flex-1 flex flex-col gap-3">
            {diferenciais.slice(3, 6).map((item, index) => {
              const Icon = iconMap[item.icon];
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex-1"
                >
                  <FlipCard
                    className="w-full h-full"
                    frontClassName="rounded-xl bg-white shadow-md p-4 flex flex-col items-center justify-center text-center gap-3"
                    backClassName="rounded-xl bg-solie-green shadow-md p-4 flex items-center justify-center text-center"
                    front={
                      <>
                        <div className="w-16 h-16 rounded-full bg-solie-beige flex items-center justify-center">
                          {Icon && <Icon className="w-8 h-8 text-solie-green" />}
                        </div>
                        <h3 className="text-xl xl:text-2xl font-semibold text-foreground">
                          {item.title}
                        </h3>
                      </>
                    }
                    back={
                      <p className="text-base xl:text-lg text-white leading-relaxed">
                        {item.description}
                      </p>
                    }
                  />
                </motion.div>
              );
            })}
          </div>
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
