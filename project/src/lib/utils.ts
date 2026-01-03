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
  }
}

export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
}

export const analytics = {
  cliqueWhatsapp: (origem: string) => {
    trackEvent("clique_whatsapp", { origem });
  },
  inicioAgendamento: (objetivo: string) => {
    trackEvent("inicio_agendamento", { objetivo });
  },
  selecaoHorario: (dia: string, horario: string) => {
    trackEvent("selecao_horario", { dia, horario });
  },
  agendamentoEnviado: (dia: string, horario: string, objetivo: string) => {
    trackEvent("agendamento_enviado", { dia, horario, objetivo });
  },
};
