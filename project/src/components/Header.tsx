"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageCircle } from "lucide-react";
import { cn, formatWhatsAppLink, analytics } from "@/lib/utils";
import { siteConfig } from "@/data/content";
import { useBanner } from "@/contexts/BannerContext";

const navItems = [
  { label: "Início", href: "/" },
  { label: "Diferenciais", href: "/#diferenciais" },
  { label: "Pilates", href: "/#pilates" },
  { label: "Studio", href: "/#studio" },
  { label: "Avaliações", href: "/#avaliacoes" },
  { label: "Blog", href: "/blog" },
  // { label: "Agendar", href: "/#agendamento" },
];

// Altura do banner promocional
const BANNER_HEIGHT = "44px";
const BANNER_HEIGHT_SM = "52px";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isBannerVisible } = useBanner();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled
          ? "bg-solie-green shadow-lg border-b-4 border-solie-beige/20"
          : "bg-solie-green/95 backdrop-blur-sm"
      )}
      style={{
        top: isBannerVisible ? `var(--banner-height, ${BANNER_HEIGHT})` : "0",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "flex items-center justify-between transition-all duration-300",
            isScrolled ? "h-16" : "h-20"
          )}
        >
          {/* Logo + Subtítulo */}
          <Link href="/" className="flex-shrink-0 transition-all duration-300 flex items-center gap-3">
            <Image
              src="/images/logo-light.png"
              alt="Soliê Pilates - Studio de Pilates no Água Verde Curitiba"
              width={140}
              height={50}
              className={cn(
                "w-auto transition-all duration-300",
                isScrolled ? "h-9" : "h-12"
              )}
              priority
            />
            <span className={cn(
              "hidden lg:block text-solie-beige/60 font-light border-l border-solie-beige/30 pl-3 transition-all duration-300",
              isScrolled ? "text-xs" : "text-sm"
            )}>
              Pilates | Água Verde
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "text-solie-beige/90 hover:text-solie-beige transition-all duration-300 font-medium tracking-wide uppercase",
                  isScrolled ? "text-xs py-1" : "text-sm py-2"
                )}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => {
                analytics.metaContact("header_desktop");
                window.open(
                  formatWhatsAppLink(
                    siteConfig.whatsapp,
                    "Olá! Gostaria de agendar uma aula experimental."
                  ),
                  "_blank"
                );
              }}
              className={cn(
                "flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full font-medium transition-all duration-300",
                isScrolled ? "px-4 py-2 text-xs" : "px-5 py-2.5 text-sm"
              )}
            >
              <MessageCircle className={cn(isScrolled ? "w-3.5 h-3.5" : "w-4 h-4")} />
              Agende Grátis
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-solie-beige"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-solie-green-dark border-t border-solie-beige/10"
          >
            <nav className="flex flex-col py-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-6 py-3 text-solie-beige/90 hover:text-solie-beige hover:bg-solie-green transition-colors text-sm font-medium tracking-wide uppercase"
                >
                  {item.label}
                </Link>
              ))}
              <div className="px-6 py-3">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    analytics.metaContact("header_mobile");
                    window.open(
                      formatWhatsAppLink(
                        siteConfig.whatsapp,
                        "Olá! Gostaria de agendar uma aula experimental."
                      ),
                      "_blank"
                    );
                  }}
                  className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#128C7E] text-white px-5 py-3 rounded-full text-sm font-medium transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Agendar Aula
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
