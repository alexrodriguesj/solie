"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote, ExternalLink, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/data/content";
import { formatWhatsAppLink } from "@/lib/utils";

// Seção desativada — depoimentos fictícios removidos. Reativar quando tiver dados reais.
const depoimentos: { name: string; role: string; text: string; image?: string }[] = [];

export function Depoimentos() {
  return (
    <section id="depoimentos" className="py-20 bg-solie-beige-light">
      <Container>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-solie-green mb-4">
            O que nossos alunos dizem
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Histórias reais de transformação e bem-estar
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {depoimentos.map((depoimento, index) => (
            <motion.div
              key={depoimento.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card variant="elevated" className="h-full relative">
                <Quote className="absolute top-4 right-4 w-8 h-8 text-solie-beige" />
                <div className="flex flex-col h-full">
                  <p className="text-muted mb-6 flex-grow italic">
                    &ldquo;{depoimento.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-solie-beige flex items-center justify-center overflow-hidden">
                      {depoimento.image ? (
                        <Image
                          src={depoimento.image}
                          alt={depoimento.name}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-solie-green font-bold text-lg">
                          {depoimento.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        {depoimento.name}
                      </p>
                      <p className="text-sm text-muted">{depoimento.role}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
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
