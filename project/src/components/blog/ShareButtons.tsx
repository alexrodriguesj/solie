"use client";

import { useState } from "react";
import { Check, Copy, Instagram, MessageCircle, Share2 } from "lucide-react";
import { trackEvent } from "@/lib/utils";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/blog/${slug}`
      : `https://soliepilates.com.br/blog/${slug}`;

  const whatsappText = `${title}\n\n${url}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;

  const handleWhatsApp = () => {
    trackEvent("blog_share", { canal: "whatsapp", artigo: slug });
  };

  const handleInstagram = async () => {
    trackEvent("blog_share", { canal: "instagram", artigo: slug });

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, text: title, url });
        return;
      } catch {
        // user cancelled or unsupported, fall through
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
    window.open("https://instagram.com/soliepilates", "_blank", "noopener,noreferrer");
  };

  const handleCopy = async () => {
    trackEvent("blog_share", { canal: "copy", artigo: slug });
    try {
      const liveUrl =
        typeof window !== "undefined" ? `${window.location.origin}/blog/${slug}` : url;
      await navigator.clipboard.writeText(liveUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="my-10 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-5 bg-solie-beige-light rounded-2xl">
      <div className="flex items-center gap-2 text-solie-green font-medium text-sm shrink-0">
        <Share2 className="w-4 h-4" />
        Compartilhe esse artigo
      </div>
      <div className="flex flex-wrap gap-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsApp}
          className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </a>
        <button
          type="button"
          onClick={handleInstagram}
          className="inline-flex items-center gap-2 bg-white hover:bg-solie-beige text-solie-green border border-solie-beige px-4 py-2 rounded-full text-sm font-medium transition-colors"
        >
          <Instagram className="w-4 h-4" />
          Instagram
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-2 bg-white hover:bg-solie-beige text-solie-green border border-solie-beige px-4 py-2 rounded-full text-sm font-medium transition-colors"
          aria-live="polite"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Link copiado
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copiar link
            </>
          )}
        </button>
      </div>
    </div>
  );
}
