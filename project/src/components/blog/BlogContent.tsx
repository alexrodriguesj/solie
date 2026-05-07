"use client";

import { useEffect, useRef, useState } from "react";
import { ImageLightbox } from "./ImageLightbox";

interface BlogContentProps {
  html: string;
  className?: string;
}

export function BlogContent({ html, className }: BlogContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomed, setZoomed] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const cleanups: Array<() => void> = [];

    const imgs = Array.from(containerRef.current.querySelectorAll("img"));
    imgs.forEach((img) => {
      img.style.cursor = "zoom-in";
      img.classList.add("transition-transform", "duration-200", "hover:scale-[1.02]");
      const handler = () => {
        setZoomed({ src: img.currentSrc || img.src, alt: img.alt });
      };
      img.addEventListener("click", handler);
      cleanups.push(() => img.removeEventListener("click", handler));
    });

    return () => cleanups.forEach((fn) => fn());
  }, [html]);

  return (
    <>
      <div
        ref={containerRef}
        className={className}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <ImageLightbox
        src={zoomed?.src ?? null}
        alt={zoomed?.alt ?? ""}
        onClose={() => setZoomed(null)}
      />
    </>
  );
}
