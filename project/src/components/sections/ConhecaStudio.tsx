"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Phone, X, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/data/content";
import { formatWhatsAppLink, analytics } from "@/lib/utils";

const studioImages = [
  "/images/studio-1.jpg",
  "/images/studio-2.jpg",
  "/images/studio-3.jpg",
  "/images/studio-4.jpg",
  "/images/studio-5.jpg",
  "/images/studio-6.jpg",
  "/images/studio-7.jpg",
  "/images/studio-8.jpg",
];

export function ConhecaStudio() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const imagesPerPage = 4;
  const totalPages = Math.ceil(studioImages.length / imagesPerPage);

  const visibleImages = studioImages.slice(
    carouselIndex * imagesPerPage,
    carouselIndex * imagesPerPage + imagesPerPage
  );

  const nextCarousel = () => {
    setCarouselIndex((prev) => (prev + 1) % totalPages);
  };

  const prevCarousel = () => {
    setCarouselIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center px-2 md:px-0">
            {/* Gallery Carousel */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              {/* Carousel Navigation */}
              {totalPages > 1 && (
                <>
                  <button
                    onClick={prevCarousel}
                    className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-solie-green hover:bg-solie-green hover:text-white transition-colors"
                    aria-label="Fotos anteriores"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextCarousel}
                    className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-solie-green hover:bg-solie-green hover:text-white transition-colors"
                    aria-label="Próximas fotos"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Images Grid */}
              <div className="grid grid-cols-2 gap-4">
                <AnimatePresence mode="wait">
                  {visibleImages.map((src, i) => {
                    const globalIndex = carouselIndex * imagesPerPage + i;
                    return (
                      <motion.div
                        key={`${carouselIndex}-${i}`}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className="aspect-square rounded-2xl overflow-hidden relative cursor-pointer group"
                        onClick={() => openLightbox(globalIndex)}
                      >
                        <Image
                          src={src}
                          alt={`Studio de pilates Soliê no Água Verde Curitiba - foto ${globalIndex + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                          <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-medium">
                            Clique para ampliar
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* Pagination Dots */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCarouselIndex(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        carouselIndex === index
                          ? "bg-solie-green"
                          : "bg-solie-beige hover:bg-solie-green/50"
                      }`}
                      aria-label={`Página ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Info & Map */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
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
                src={studioImages[selectedImage]}
                alt={`Studio de pilates Soliê no Água Verde Curitiba - foto ${selectedImage + 1}`}
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
