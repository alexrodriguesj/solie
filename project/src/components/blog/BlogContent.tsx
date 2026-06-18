"use client";

import { useEffect, useRef, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { ImageLightbox } from "./ImageLightbox";
import { VideoPlayer } from "@/components/ui/VideoPlayer";

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

    // Vídeos no corpo do post usam o MESMO player do vídeo de capa
    // (VideoPlayer: autoplay na viewport + botões de pause/áudio), com o
    // wrapper idêntico ao do hero. O <video> original só fica escondido,
    // mantendo o efeito idempotente no StrictMode do dev.
    const videos = Array.from(
      containerRef.current.querySelectorAll<HTMLVideoElement>(
        "video[data-solie-player]:not([data-mounted])"
      )
    );
    const roots: Root[] = [];
    const mounts: HTMLElement[] = [];
    videos.forEach((video) => {
      const src = video.getAttribute("src") || "";
      const poster = video.getAttribute("poster") || undefined;
      const mount = document.createElement("div");
      mount.className = "mx-auto max-w-sm my-8";
      video.setAttribute("data-mounted", "true");
      video.style.display = "none";
      video.parentElement?.insertBefore(mount, video);
      const root = createRoot(mount);
      root.render(<VideoPlayer src={src} poster={poster} autoUnmute />);
      roots.push(root);
      mounts.push(mount);
    });
    if (roots.length) {
      cleanups.push(() => {
        mounts.forEach((m) => m.remove());
        videos.forEach((v) => {
          v.removeAttribute("data-mounted");
          v.style.display = "";
        });
        setTimeout(() => roots.forEach((r) => r.unmount()), 0);
      });
    }

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
