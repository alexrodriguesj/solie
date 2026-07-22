"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { NEWSLETTER_ENABLED } from "@/lib/newsletter/config";

type Status = "idle" | "enviando" | "sucesso" | "erro" | "ja_inscrito";

interface NewsletterSignupProps {
  /** Identifica a posição/origem (ex: "blog", "home", "rodape"). */
  source: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  className?: string;
}

const DEFAULT_TITLE = "Receba novidades da Soliê";
const DEFAULT_DESCRIPTION =
  "Novos posts, promoções e novidades do estúdio direto no seu email. Sem spam.";
const DEFAULT_CTA = "Quero receber";

const SUCCESS_MSG =
  "Falta um passo. Enviamos um email de confirmação. Clique no link para concluir o cadastro.";
const ERROR_MSG = "Não foi possível concluir agora. Tente de novo em instantes.";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";

interface TurnstileApi {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string;
      callback: (token: string) => void;
      "error-callback"?: () => void;
      "expired-callback"?: () => void;
    }
  ) => string;
  reset: (widgetId?: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export function NewsletterSignup({
  source,
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  ctaLabel = DEFAULT_CTA,
  className,
}: NewsletterSignupProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  // Honeypot anti-bot: humano não vê nem preenche.
  const [website, setWebsite] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");

  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  // Carrega o script do Turnstile e renderiza o widget (modo managed).
  useEffect(() => {
    if (!NEWSLETTER_ENABLED || !TURNSTILE_SITE_KEY) return;

    function renderWidget() {
      if (!turnstileRef.current || !window.turnstile || widgetIdRef.current) return;
      widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
        sitekey: TURNSTILE_SITE_KEY as string,
        callback: (token) => setTurnstileToken(token),
        "expired-callback": () => setTurnstileToken(""),
        "error-callback": () => setTurnstileToken(""),
      });
    }

    if (window.turnstile) {
      renderWidget();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      `script[src^="${TURNSTILE_SRC}"]`
    );
    if (existing) {
      existing.addEventListener("load", renderWidget);
      return () => existing.removeEventListener("load", renderWidget);
    }

    const script = document.createElement("script");
    script.src = TURNSTILE_SRC;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", renderWidget);
    document.head.appendChild(script);
    return () => script.removeEventListener("load", renderWidget);
  }, []);

  // Toggle central desliga o componente por completo.
  if (!NEWSLETTER_ENABLED) return null;

  const enviando = status === "enviando";
  // A resposta do servidor é sempre neutra (nunca revela "já inscrito"), então
  // na prática só chegamos a "sucesso". O estado "ja_inscrito" existe no tipo
  // para o contrato do componente, mas não é setado a partir da resposta.
  const concluido = status === "sucesso" || status === "ja_inscrito";

  function resetTurnstile() {
    setTurnstileToken("");
    if (window.turnstile && widgetIdRef.current) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!consent || enviando || !turnstileToken) return;

    setStatus("enviando");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent, source, website, turnstileToken }),
      });
      if (res.ok) {
        setStatus("sucesso");
      } else {
        setStatus("erro");
        // Token do Turnstile é de uso único: reseta para permitir nova tentativa.
        resetTurnstile();
      }
    } catch {
      setStatus("erro");
      resetTurnstile();
    }
  }

  return (
    <section
      className={cn(
        "rounded-2xl bg-solie-beige-light border border-solie-beige-dark/40 p-6 md:p-8",
        className
      )}
    >
      <h3 className="text-xl md:text-2xl font-serif font-bold text-solie-green mb-2">
        {title}
      </h3>
      <p className="text-foreground/70 mb-6">{description}</p>

      {concluido ? (
        <p className="text-solie-green font-medium">{SUCCESS_MSG}</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Honeypot: fora do fluxo de foco e escondido de leitores de tela. */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="hidden"
          />

          <div>
            <label htmlFor="newsletter-email" className="sr-only">
              Seu email
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu melhor email"
              className="w-full px-4 py-3 rounded-xl border border-solie-beige-dark/50 bg-white focus:border-solie-green focus:ring-2 focus:ring-solie-green/20 outline-none transition-all"
            />
          </div>

          <label className="flex items-start gap-3 text-sm text-foreground/80 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 h-4 w-4 flex-shrink-0 accent-solie-green"
            />
            <span>
              Concordo em receber emails da Soliê com novidades e promoções. Li o{" "}
              <Link
                href="/privacidade"
                className="text-solie-green underline hover:no-underline"
              >
                aviso de privacidade
              </Link>{" "}
              e sei que posso cancelar quando quiser.
            </span>
          </label>

          {/* Widget do Turnstile (renderizado via script no useEffect). */}
          <div ref={turnstileRef} />

          {status === "erro" && (
            <p className="text-sm text-red-600">{ERROR_MSG}</p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full"
            disabled={!consent || enviando || !turnstileToken}
          >
            {enviando ? "Enviando..." : ctaLabel}
          </Button>
        </form>
      )}
    </section>
  );
}
