import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatWhatsAppLink(phone: string, message?: string): string {
  const cleanPhone = phone.replace(/\D/g, "");
  const baseUrl = `https://wa.me/${cleanPhone}`;
  if (message) {
    return `${baseUrl}?text=${encodeURIComponent(message)}`;
  }
  return baseUrl;
}

// Google Analytics Events
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
}

export const analytics = {
  // Conversão principal
  cliqueWhatsapp: (origem: string) => {
    trackEvent("clique_whatsapp", { origem });
    // Google Ads conversion event
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "conversion_event_contact", {});
    }
  },

  // Meta Pixel
  metaContact: (origem: string) => {
    if (typeof window !== "undefined" && window.fbq) {
      window.fbq("track", "Contact", { content_category: origem });
    }
  },

  // Engajamento: navegação
  cliqueNavegacao: (item: string) => {
    trackEvent("clique_navegacao", { item });
  },

  // Engajamento: mapa / como chegar
  cliqueComoChegar: () => {
    trackEvent("clique_como_chegar");
  },

  // Engajamento: vídeo
  videoInteracao: (video: string, acao: string) => {
    trackEvent("video_interacao", { video, acao });
  },

  // Engajamento: blog
  blogLeitura: (artigo: string, percentual: number) => {
    trackEvent("blog_leitura", { artigo, percentual });
  },
};
