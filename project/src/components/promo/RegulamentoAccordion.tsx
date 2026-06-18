"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface RegulamentoAccordionProps {
  texto: string;
}

// É um título de seção quando a linha está toda em maiúsculas (sem ser bullet).
function ehTitulo(linha: string): boolean {
  const t = linha.trim();
  if (!t || t.startsWith("-")) return false;
  return t === t.toUpperCase() && /[A-ZÀ-Ú]/.test(t);
}

// Converte o texto cru do regulamento em blocos formatados (h + ul + p).
function renderRegulamento(texto: string): ReactNode[] {
  const linhas = texto.split("\n");
  const blocos: ReactNode[] = [];
  let bullets: string[] = [];
  let key = 0;

  const flushBullets = () => {
    if (bullets.length === 0) return;
    blocos.push(
      <ul key={`ul-${key++}`} className="list-disc pl-5 space-y-1.5 text-foreground/80">
        {bullets.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    );
    bullets = [];
  };

  for (const linha of linhas) {
    const t = linha.trim();
    if (!t) {
      flushBullets();
      continue;
    }
    if (t.startsWith("-")) {
      bullets.push(t.replace(/^-\s*/, ""));
      continue;
    }
    flushBullets();
    if (ehTitulo(t)) {
      blocos.push(
        <h3
          key={`h-${key++}`}
          className="text-sm font-semibold uppercase tracking-wide text-solie-green pt-4 first:pt-0"
        >
          {t}
        </h3>
      );
    } else {
      blocos.push(
        <p key={`p-${key++}`} className="text-foreground/80 leading-relaxed">
          {t}
        </p>
      );
    }
  }
  flushBullets();
  return blocos;
}

export function RegulamentoAccordion({ texto }: RegulamentoAccordionProps) {
  const [aberto, setAberto] = useState(false);

  return (
    <div className="rounded-2xl border border-solie-beige-dark/60 bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left text-solie-green font-semibold hover:bg-solie-beige-light/60 transition-colors"
      >
        <span>Regulamento completo</span>
        <ChevronDown
          className={cn(
            "w-5 h-5 flex-shrink-0 transition-transform duration-300",
            aberto && "rotate-180"
          )}
        />
      </button>

      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          aberto ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-6 pt-1 space-y-3 text-sm border-t border-solie-beige-dark/30">
            {renderRegulamento(texto)}
          </div>
        </div>
      </div>
    </div>
  );
}
