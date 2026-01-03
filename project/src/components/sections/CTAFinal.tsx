"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ctaFinal, siteConfig } from "@/data/content";
import { formatWhatsAppLink, analytics } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  whatsapp: z.string().min(10, "WhatsApp inválido"),
  objective: z.string().min(1, "Selecione um objetivo"),
});

type FormData = z.infer<typeof formSchema>;

export function CTAFinal() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    // Evento GA: clique no WhatsApp via formulário CTA
    analytics.cliqueWhatsapp("formulario_cta");

    const message = `Olá! Meu nome é ${data.name}.

Tenho interesse em aulas de Pilates.
Objetivo: ${data.objective}
WhatsApp: ${data.whatsapp}

Gostaria de agendar uma aula experimental!`;

    window.open(formatWhatsAppLink(siteConfig.whatsapp, message), "_blank");
    reset();
  };

  return (
    <section id="contato" className="py-20 bg-solie-green">
      <Container size="md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            {ctaFinal.title}
          </h2>
          <p className="text-lg text-white/80 max-w-xl mx-auto">
            {ctaFinal.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-3xl p-8 shadow-xl max-w-lg mx-auto"
          >
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Nome
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-solie-green focus:ring-2 focus:ring-solie-green/20 outline-none transition-all"
                  placeholder="Seu nome completo"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* WhatsApp */}
              <div>
                <label
                  htmlFor="whatsapp"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  WhatsApp
                </label>
                <input
                  type="tel"
                  id="whatsapp"
                  {...register("whatsapp")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-solie-green focus:ring-2 focus:ring-solie-green/20 outline-none transition-all"
                  placeholder="(11) 99999-9999"
                />
                {errors.whatsapp && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.whatsapp.message}
                  </p>
                )}
              </div>

              {/* Objective */}
              <div>
                <label
                  htmlFor="objective"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Qual seu objetivo?
                </label>
                <select
                  id="objective"
                  {...register("objective")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-solie-green focus:ring-2 focus:ring-solie-green/20 outline-none transition-all bg-white"
                >
                  <option value="">Selecione...</option>
                  {ctaFinal.objectives.map((obj) => (
                    <option key={obj} value={obj}>
                      {obj}
                    </option>
                  ))}
                </select>
                {errors.objective && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.objective.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                <Send className="w-5 h-5" />
                Agendar aula experimental
              </Button>
            </div>
          </form>
        </motion.div>
      </Container>
    </section>
  );
}
