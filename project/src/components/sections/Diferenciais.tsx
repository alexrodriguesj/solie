"use client";

import { motion } from "framer-motion";
import {
  UserCheck,
  Target,
  Heart,
  Sparkles,
  GraduationCap,
  Clock,
  MessageCircle,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { diferenciais, siteConfig } from "@/data/content";
import { formatWhatsAppLink } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  UserCheck,
  Target,
  Heart,
  Sparkles,
  GraduationCap,
  Clock,
};

export function Diferenciais() {
  return (
    <section id="diferenciais" className="py-20 bg-white">
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
            Por que escolher a Soliê?
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Oferecemos uma experiência única de Pilates, combinando técnica,
            cuidado e um ambiente acolhedor
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {diferenciais.map((item, index) => {
            const Icon = iconMap[item.icon];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  variant="elevated"
                  className="h-full hover:scale-105 transition-transform duration-300"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-full bg-solie-beige flex items-center justify-center mb-4">
                      {Icon && (
                        <Icon className="w-8 h-8 text-solie-green" />
                      )}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-muted">{item.description}</p>
                  </div>
                </Card>
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
          className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
        >
          <Button
            variant="primary"
            size="lg"
            onClick={() =>
              document.getElementById("agendamento")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Agende sua Aula
          </Button>
          <Button
            variant="whatsapp"
            size="lg"
            onClick={() =>
              window.open(
                formatWhatsAppLink(
                  siteConfig.whatsapp,
                  "Olá! Gostaria de saber mais sobre as aulas de Pilates."
                ),
                "_blank"
              )
            }
          >
            <MessageCircle className="w-5 h-5" />
            Fale Conosco
          </Button>
        </motion.div>
      </Container>
    </section>
  );
}
