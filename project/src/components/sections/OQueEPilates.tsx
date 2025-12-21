"use client";

import { motion } from "framer-motion";
import {
  Activity,
  Zap,
  Brain,
  Baby,
  Dumbbell,
  Bone,
  MessageCircle,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { oQueEPilates, siteConfig } from "@/data/content";
import { formatWhatsAppLink } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  Spine: Bone,
  Activity,
  Zap,
  Brain,
  Baby,
  Dumbbell,
};

export function OQueEPilates() {
  return (
    <section id="pilates" className="py-20 bg-solie-beige-light">
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
            Para quem é o Pilates?
          </h2>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            O Pilates é indicado para todas as idades e condições físicas.
            Descubra como podemos ajudar você
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {oQueEPilates.map((item, index) => {
            const Icon = iconMap[item.icon];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card
                  variant="outlined"
                  className="h-full border-2 border-solie-beige hover:border-solie-green transition-colors duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-solie-green/10 flex items-center justify-center flex-shrink-0">
                      {Icon && (
                        <Icon className="w-6 h-6 text-solie-green" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted">{item.description}</p>
                    </div>
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
