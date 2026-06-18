"use client";

import { useState } from "react";
import { ImageLightbox } from "./ImageLightbox";

interface HeroImageProps {
  src: string;
  alt: string;
}

export function HeroImage({ src, alt }: HeroImageProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full mb-10 group cursor-zoom-in"
        aria-label="Ampliar imagem"
      >
        {/* Imagem exibida na íntegra (sem corte), com altura limitada.
            <img> nativo para respeitar a proporção natural de qualquer capa. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          loading="eager"
          className="mx-auto w-auto max-w-full max-h-[78vh] rounded-2xl shadow-sm object-contain transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </button>
      <ImageLightbox
        src={open ? src : null}
        alt={alt}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
