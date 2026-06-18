"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { trackEvent } from "@/lib/utils";
import { useBanner } from "@/contexts/BannerContext";
import { getPromoAtiva } from "@/data/promos";

export function PromoBanner() {
  const { isBannerVisible, setIsBannerVisible } = useBanner();
  const promo = getPromoAtiva();

  const handleClose = () => {
    setIsBannerVisible(false);
    trackEvent("promo_banner_closed", { categoria: "engagement", campanha: promo?.slug });
  };

  const handleClick = () => {
    trackEvent("promo_banner_click", { categoria: "engagement", campanha: promo?.slug });
  };

  // Sem promo ativa, não renderiza nada.
  if (!promo) return null;

  return (
    <AnimatePresence>
      {isBannerVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-[60] overflow-hidden"
          style={{ background: "linear-gradient(to right, #C41E3A, #A01830)" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-2.5 sm:py-3 gap-3">
              {/* Content */}
              <div className="flex-1 flex items-center justify-center gap-2 sm:gap-3">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-solie-beige-light flex-shrink-0 animate-pulse" />

                <p className="text-white text-xs sm:text-sm font-medium text-center">
                  <span className="hidden sm:inline">{promo.bannerTexto}</span>
                  <span className="sm:hidden">{promo.bannerTextoMobile}</span>
                </p>

                <Link
                  href={`/${promo.slug}`}
                  onClick={handleClick}
                  className="flex items-center gap-1.5 bg-white hover:bg-solie-beige-light text-[#A01830] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all hover:scale-105 flex-shrink-0"
                >
                  <span className="hidden sm:inline">QUERO PARTICIPAR</span>
                  <span className="sm:hidden">QUERO</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Link>
              </div>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/20 rounded-full transition-colors flex-shrink-0"
                aria-label="Fechar banner"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
