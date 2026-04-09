"use client";

import Image from "next/image";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { siteConfig, footer } from "@/data/content";

export function Footer() {
  return (
    <footer className="bg-solie-beige-light py-16">
      <Container>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <Image
              src="/images/logo-alt.png"
              alt="Soliê Pilates - Pilates clínico com fisioterapeutas no Água Verde Curitiba"
              width={180}
              height={64}
              className="mb-4"
            />
            <p className="text-muted max-w-lg">
              Pilates clínico com ciência e cuidado no Água Verde, Curitiba.
              <br />
              Agende sua aula experimental gratuita e sinta a diferença.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Contato</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
                  className="flex items-center gap-2 text-muted hover:text-solie-green transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-2 text-muted hover:text-solie-green transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2 text-muted">
                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                  <span>
                    {siteConfig.address.street}, {siteConfig.address.neighborhood}
                    <br />
                    {siteConfig.address.city} - {siteConfig.address.state}
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Hours & Social */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Horário</h4>
            <ul className="space-y-2 text-muted mb-6">
              <li>Seg-Qui: {siteConfig.hours.weekdays}</li>
              <li>Sexta: {siteConfig.hours.friday}</li>
              <li>Sábado: {siteConfig.hours.saturday}</li>
            </ul>

            <h4 className="font-semibold text-foreground mb-4">Redes Sociais</h4>
            <div className="flex gap-4">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-solie-green/10 flex items-center justify-center text-solie-green hover:bg-solie-green hover:text-white transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-solie-green/10 flex items-center justify-center text-solie-green hover:bg-solie-green hover:text-white transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-solie-beige mt-12 pt-8 text-center">
          <p className="text-sm text-muted">{footer.copyright}</p>
        </div>
      </Container>
    </footer>
  );
}
