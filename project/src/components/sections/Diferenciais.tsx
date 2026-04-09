"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Stethoscope,
  Users,
  ShieldCheck,
  HeartHandshake,
  TrendingUp,
  Clock,
  MessageCircle,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
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

function VideoInstitucional() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
          setIsPlaying(true);
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative h-full"
    >
      <div className="relative overflow-hidden rounded-2xl shadow-lg group h-full">
        <video
          ref={videoRef}
          src="/videos/video-institucional.mp4"
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
        />
        {/* Controls overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center gap-2 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors"
            aria-label={isPlaying ? "Pausar" : "Reproduzir"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-solie-green" />
            ) : (
              <Play className="w-5 h-5 text-solie-green ml-0.5" />
            )}
          </button>
          <button
            onClick={toggleMute}
            className="w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors"
            aria-label={isMuted ? "Ativar som" : "Mutar"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-solie-green" />
            ) : (
              <Volume2 className="w-5 h-5 text-solie-green" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

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

        {/* Cards Left | Video | Cards Right */}
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 px-2 md:px-0 items-stretch">
          {/* Left Cards */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
            {diferenciais.slice(0, 3).map((item, index) => {
              const Icon = iconMap[item.icon];
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="[perspective:800px] min-h-[120px] lg:flex-1"
                >
                  <div className="group relative w-full h-full cursor-pointer [transform-style:preserve-3d] transition-transform duration-500 [&:hover]:[transform:rotateY(180deg)]">
                    {/* Front */}
                    <div className="absolute inset-0 [backface-visibility:hidden] rounded-xl bg-white shadow-md p-4 flex flex-col items-center justify-center text-center gap-3">
                      <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-solie-beige flex items-center justify-center">
                        {Icon && <Icon className="w-7 h-7 lg:w-8 lg:h-8 text-solie-green" />}
                      </div>
                      <h3 className="text-sm sm:text-base lg:text-xl xl:text-2xl font-semibold text-foreground">
                        {item.title}
                      </h3>
                    </div>
                    {/* Back */}
                    <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl bg-solie-green shadow-md p-4 flex items-center justify-center text-center">
                      <p className="text-xs sm:text-sm lg:text-base xl:text-lg text-white leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Video Institucional */}
          <div className="w-full lg:w-1/3 flex-shrink-0 order-first lg:order-none">
            <VideoInstitucional />
          </div>

          {/* Right Cards */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
            {diferenciais.slice(3, 6).map((item, index) => {
              const Icon = iconMap[item.icon];
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="[perspective:800px] min-h-[120px] lg:flex-1"
                >
                  <div className="group relative w-full h-full cursor-pointer [transform-style:preserve-3d] transition-transform duration-500 [&:hover]:[transform:rotateY(180deg)]">
                    {/* Front */}
                    <div className="absolute inset-0 [backface-visibility:hidden] rounded-xl bg-white shadow-md p-4 flex flex-col items-center justify-center text-center gap-3">
                      <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-solie-beige flex items-center justify-center">
                        {Icon && <Icon className="w-7 h-7 lg:w-8 lg:h-8 text-solie-green" />}
                      </div>
                      <h3 className="text-sm sm:text-base lg:text-xl xl:text-2xl font-semibold text-foreground">
                        {item.title}
                      </h3>
                    </div>
                    {/* Back */}
                    <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-xl bg-solie-green shadow-md p-4 flex items-center justify-center text-center">
                      <p className="text-xs sm:text-sm lg:text-base xl:text-lg text-white leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
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
