"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { VideoPlayer } from "@/components/ui/VideoPlayer";
import { siteConfig } from "@/data/content";
import { formatWhatsAppLink, analytics } from "@/lib/utils";

export function Agendamento() {
  const handleWhatsApp = () => {
    analytics.cliqueWhatsapp("agendamento");
    analytics.metaContact("agendamento");

    const mensagem = `Olá! Gostaria de agendar uma aula experimental de Pilates.`;

    window.open(
      formatWhatsAppLink(siteConfig.whatsapp, mensagem),
      "_blank"
    );
  };

  return (
    <section id="agendamento" className="py-12 md:py-20 bg-solie-green">
      <Container>
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 md:gap-12 px-4 md:px-0 max-w-4xl mx-auto">
          {/* Video — coluna esquerda */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-[320px] flex-shrink-0 aspect-[5/6] lg:aspect-[9/16] lg:max-h-[500px] mx-auto lg:mx-0 overflow-hidden rounded-2xl"
          >
            <VideoPlayer src="/videos/cta-final.mp4" name="cta-final" className="h-full" autoUnmute />
          </motion.div>

          {/* Conteúdo — coluna direita */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 text-center"
          >
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
              Vem sentir a diferença
              <br />
              em UMA AULA
            </h2>
            <p className="text-base md:text-lg text-white/80 max-w-lg mx-auto mb-2">
              Sua primeira aula é gratuita e sem compromisso
            </p>
            <p className="text-sm md:text-base text-white/60 mb-8 md:mb-10">
              Aqui no Água Verde, Curitiba
            </p>

            {/* CTA com pulse */}
            <Button
              variant="whatsapp"
              size="lg"
              onClick={handleWhatsApp}
              className="text-xl md:text-2xl px-10 md:px-14 py-5 md:py-6 animate-pulse hover:animate-none"
            >
              <MessageCircle className="w-7 h-7" />
              Quero Minha Aula Grátis
            </Button>

            {/* Micro-copy provocativo */}
            <p className="text-white/60 text-sm md:text-base mt-4 italic">
              Duvidamos muito você não querer voltar pra segunda aula...
            </p>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

/*
 * ============================================================
 * VERSÃO COM FORMULÁRIO + INTEGRAÇÃO GOOGLE SHEETS
 * Descomentar abaixo e comentar a versão acima para reativar
 * ============================================================
 *
 * import { useState, useEffect } from "react";
 * import { useForm } from "react-hook-form";
 * import { zodResolver } from "@hookform/resolvers/zod";
 * import { z } from "zod";
 * import { Clock, Users, Loader2, User, Phone, Target, ChevronRight, ChevronLeft } from "lucide-react";
 * import { ctaFinal } from "@/data/content";
 *
 * // URL da planilha publicada como CSV (aba "agenda" - gid=0)
 * const SHEET_URL = "https://docs.google.com/spreadsheets/d/1r5rfUjJdxYfLcjqnl13mwxvpkTdo7UtCHDVHtEOqTE0/export?format=csv&gid=0";
 *
 * // URL do Google Apps Script para salvar contatos
 * const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwFr02SHDm5KG36dG0qB7yUar_nEcXwPXEc5cXM2RcGZXx7ZYNb_BXBw7z23avmhjE/exec";
 *
 * // ... resto do código do formulário comentado
 */
