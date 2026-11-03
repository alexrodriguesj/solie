"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Phone, X, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/data/content";
import { formatWhatsAppLink, analytics } from "@/lib/utils";

// Mosaico: as classes definem o encaixe; dense preenche os vãos em qualquer largura
const studioImages = [
  { src: "/images/studio-logo.jpg", alt: "Logo da Soliê Pilates na parede verde do estúdio", className: "col-span-2 row-span-2", position: "center 55%" },
  { src: "/images/studio-bolas.jpg", alt: "Bolas suíças azuis junto à janela do estúdio" },
  { src: "/images/studio-anel.jpg", alt: "Anel de Pilates entre plantas" },
  { src: "/images/studio-reformer.jpg", alt: "Aluna no reformer diante dos espelhos em arco", className: "row-span-2" },
  { src: "/images/studio-acessorios.jpg", alt: "Halteres e disco de equilíbrio no estúdio" },
  { src: "/images/studio-instrutoras.jpg", alt: "Instrutoras da Soliê Pilates no estúdio", className: "col-span-2", position: "center 30%" },
  { src: "/images/studio-1.jpg", alt: "Instrutoras sentadas no estúdio com bolas e anéis" },
  { src: "/images/studio-4.jpg", alt: "Instrutora acompanha aluno no equipamento" },
  { src: "/images/studio-5.jpg", alt: "Aluna com anel de Pilates e instrutora", className: "col-span-2", position: "center 52%" },
  { src: "/images/studio-8.jpg", alt: "Aula no estúdio com instrutora ao lado do aluno" },
];

export function ConhecaStudio() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const openLightbox = (index: number) => {
    setSelectedImage(index);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto";
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % studioImages.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + studioImages.length) % studioImages.length);
    }
  };

  return (
    <>
      <section id="studio" className="py-12 md:py-20 bg-white">
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
              Conheça nosso Studio
            </h2>
            <p className="text-base md:text-lg text-muted max-w-2xl mx-auto">
              No coração do Água Verde, um espaço íntimo criado para cuidar de você
            </p>
          </motion.div>

          {/* Mosaico de fotos: desliza na horizontal até lg, grade fixa no desktop */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-flow-col-dense grid-rows-[170px_170px] md:grid-rows-[230px_230px] auto-cols-[44vw] md:auto-cols-[240px] gap-3 mb-8 md:mb-12 -mx-4 sm:-mx-6 px-4 sm:px-6 overflow-x-auto snap-x scroll-px-4 sm:scroll-px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid-flow-dense lg:grid-cols-4 lg:grid-rows-none lg:auto-rows-[230px] lg:auto-cols-auto lg:mx-0 lg:px-0 lg:overflow-visible"
          >
            {studioImages.map((image, index) => (
              <button
                key={image.src}
                type="button"
                onClick={() => openLightbox(index)}
                className={`snap-start rounded-2xl overflow-hidden relative cursor-zoom-in group ${image.className ?? ""}`}
                aria-label={`Ampliar foto: ${image.alt}`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  style={image.position ? { objectPosition: image.position } : undefined}
                  sizes="(max-width: 1024px) 88vw, 50vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-medium">
                    Clique para ampliar
                  </span>
                </div>
              </button>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center px-2 md:px-0">
            {/* Info & Map */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-solie-green/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-solie-green" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Endereço</h4>
                    <p className="text-muted">
                      {siteConfig.address.street}, {siteConfig.address.neighborhood}
                      <br />
                      {siteConfig.address.city} - {siteConfig.address.state}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-solie-green/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-solie-green" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Horário</h4>
                    <p className="text-muted">
                      Seg-Qui: {siteConfig.hours.weekdays}
                      <br />
                      Sexta: {siteConfig.hours.friday}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-solie-green/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-solie-green" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Contato</h4>
                    <p className="text-muted">{siteConfig.phone}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://www.google.com/maps/dir//Soli%C3%AA+Pilates,+Av.+Rep.+Argentina,+1237+-+Sala+610+-+%C3%81gua+Verde,+Curitiba+-+PR,+80620-010"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => analytics.cliqueComoChegar()}
                >
                  <Button variant="outline" size="md" className="w-full sm:w-auto">
                    Como chegar
                  </Button>
                </a>
                {/* <Button
                  variant="primary"
                  size="md"
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

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Google Maps Embed */}
              <div className="rounded-2xl overflow-hidden h-64 bg-solie-beige/30">
                {siteConfig.googleMapsEmbed ? (
                  <iframe
                    src={siteConfig.googleMapsEmbed}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localização Soliê Pilates"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-solie-green/50 text-center p-4">
                      Adicionar embed do Google Maps
                    </p>
                  </div>
                )}
              </div>

            </motion.div>
          </div>
        </Container>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-8 h-8 text-white" />
            </button>

            {/* Previous Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Próximo"
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </button>

            {/* Image */}
            <motion.div
              key={selectedImage}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-[90vw] h-[80vh] max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={studioImages[selectedImage].src}
                alt={studioImages[selectedImage].alt}
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            </motion.div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
              {selectedImage + 1} / {studioImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
