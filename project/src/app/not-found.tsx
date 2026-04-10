"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { siteConfig } from "@/data/content";
import { formatWhatsAppLink } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-solie-beige-light flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <Image
          src="/images/logo-alt.png"
          alt="Soliê Pilates - Pilates no Água Verde Curitiba"
          width={180}
          height={64}
          className="mx-auto mb-8"
        />

        <h1 className="text-6xl font-bold text-solie-green mb-4">404</h1>
        <p className="text-xl text-foreground mb-2">
          Página não encontrada
        </p>
        <p className="text-muted mb-8">
          Mas sua aula experimental gratuita está te esperando.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-solie-green text-white font-medium hover:bg-solie-green-dark transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar ao site
          </Link>
          <button
            onClick={() =>
              window.open(
                formatWhatsAppLink(
                  siteConfig.whatsapp,
                  "Olá! Gostaria de agendar uma aula experimental de Pilates."
                ),
                "_blank"
              )
            }
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white font-medium hover:bg-[#128C7E] transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Agendar pelo WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
