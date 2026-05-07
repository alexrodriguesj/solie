"use client";

import { useState } from "react";
import Image from "next/image";
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
        className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden mb-10 group cursor-zoom-in"
        aria-label="Ampliar imagem"
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 720px"
          priority
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
