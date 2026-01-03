"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/data/content";
import { formatWhatsAppLink, analytics } from "@/lib/utils";

export function WhatsAppButton() {
  return (
    <motion.a
      href={formatWhatsAppLink(
        siteConfig.whatsapp,
        "Olá! Vim pelo site e gostaria de saber mais sobre as aulas de Pilates."
      )}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => analytics.cliqueWhatsapp("botao_flutuante")}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
      aria-label="Contato via WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-white" />

      {/* Pulse animation */}
      <span className="absolute w-full h-full rounded-full bg-[#25D366] animate-ping opacity-30" />
    </motion.a>
  );
}
