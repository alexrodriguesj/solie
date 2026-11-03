"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { quatroMotivos, siteConfig } from "@/data/content";
import { formatWhatsAppLink } from "@/lib/utils";

function progressoDoMotivo(tempoAtual: number, inicio: number, fim: number) {
  return Math.min(Math.max((tempoAtual - inicio) / (fim - inicio), 0), 1) * 100;
}

export function QuatroMotivos() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [tempoAtual, setTempoAtual] = useState(0);

  // Antes do primeiro motivo mostra o 1; depois do último mantém o 4
  const indiceAtual = Math.max(
    quatroMotivos.findLastIndex((motivo) => tempoAtual >= motivo.inicio),
    0
  );
  const motivoAtual = quatroMotivos[indiceAtual];

  const irParaMotivo = (segundos: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = segundos;
    setTempoAtual(segundos);
    video.play().catch(() => {});
  };

  const cabecalho = (
    <>
      <span className="inline-flex items-center justify-center md:justify-start gap-2 text-xs uppercase tracking-[0.25em] text-solie-beige/80 font-medium">
        <Sparkles className="w-4 h-4" />
        Por que a Soliê
      </span>

      <h2 className="mt-3 md:mt-4 font-serif font-light text-white text-2xl md:text-4xl lg:text-5xl leading-tight">
        <button
          type="button"
          onClick={() => irParaMotivo(0)}
          aria-label="Assistir o vídeo do início: 4 motivos para você escolher a Soliê Pilates"
          className="text-center md:text-left font-serif font-light hover:text-solie-beige transition-colors"
        >
          4 motivos para você escolher a Soliê Pilates
        </button>
      </h2>
    </>
  );

  return (
    <section className="pb-12 md:pb-20 bg-solie-beige-light">
      <Container size="lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-3xl bg-solie-green shadow-xl"
        >
          <div className="grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-stretch">
            {/* Título acima do vídeo no mobile */}
            <div className="md:hidden px-5 pt-6 pb-4 text-center">{cabecalho}</div>

            {/* Vídeo */}
            <div className="relative pb-[125%] md:pb-0 md:min-h-[620px]">
              <VideoPlayer
                src="/videos/video-4-motivos.mp4"
                name="4-motivos"
                poster="/images/poster-video-4-motivos.jpg"
                className="!absolute inset-0 !rounded-none !shadow-none"
                autoUnmute
                videoRef={videoRef}
                onTimeUpdate={setTempoAtual}
              />
            </div>

            {/* Conteúdo */}
            <div className="px-5 pt-3 pb-6 md:p-12 flex flex-col justify-center text-center md:text-left">
              <div className="hidden md:block">{cabecalho}</div>

              {/* Mobile: um motivo por vez, logo abaixo do vídeo */}
              <div className="md:hidden">
                <div className="flex gap-2">
                  {quatroMotivos.map((motivo, index) => (
                    <button
                      key={motivo.title}
                      type="button"
                      onClick={() => irParaMotivo(motivo.inicio)}
                      aria-label={`Motivo ${index + 1}: ${motivo.title}`}
                      aria-current={index === indiceAtual ? "true" : undefined}
                      className="flex-1 py-2"
                    >
                      <span
                        className={`block font-serif text-lg transition-colors ${
                          index === indiceAtual ? "text-white" : "text-solie-beige/60"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className="mt-1 block h-1 rounded-full bg-white/25 overflow-hidden">
                        <span
                          className="block h-full bg-white"
                          style={{ width: `${progressoDoMotivo(tempoAtual, motivo.inicio, motivo.fim)}%` }}
                        />
                      </span>
                    </button>
                  ))}
                </div>

                <div aria-live="polite" className="mt-2 min-h-[4.5rem]">
                  <p className="font-semibold text-lg text-white">{motivoAtual.title}</p>
                  <p className="text-sm text-solie-beige/85">{motivoAtual.description}</p>
                </div>
              </div>

              {/* Desktop: lista completa */}
              <div className="hidden md:block mt-8 space-y-1 text-left">
                {quatroMotivos.map((motivo, index) => {
                  const ativo = tempoAtual >= motivo.inicio && tempoAtual < motivo.fim;

                  return (
                    <button
                      key={motivo.title}
                      type="button"
                      onClick={() => irParaMotivo(motivo.inicio)}
                      aria-current={ativo ? "true" : undefined}
                      className={`relative w-full overflow-hidden rounded-xl px-4 py-3 flex items-center gap-4 text-left transition-colors ${
                        ativo ? "bg-white/15" : "hover:bg-white/5"
                      }`}
                    >
                      <span className="font-serif font-light text-2xl text-solie-beige/70 w-8 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span>
                        <span className="block font-semibold text-white">{motivo.title}</span>
                        <span className="block text-sm text-solie-beige/85">{motivo.description}</span>
                      </span>
                      <span
                        className="absolute left-0 bottom-0 h-0.5 bg-white"
                        style={{ width: `${ativo ? progressoDoMotivo(tempoAtual, motivo.inicio, motivo.fim) : 0}%` }}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 md:mt-8 flex justify-center md:justify-start">
                <a
                  href={formatWhatsAppLink(
                    siteConfig.whatsapp,
                    "Olá! Gostaria de agendar uma aula experimental de Pilates."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white hover:bg-solie-beige-light text-solie-green font-semibold px-8 py-3.5 text-base min-h-[48px] shadow-lg transition-all hover:scale-[1.02]"
                >
                  Agende sua Aula
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
