"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { analytics } from "@/lib/utils";

interface VideoPlayerProps {
  src: string;
  name?: string;
  poster?: string;
  className?: string;
  autoUnmute?: boolean;
}

// Flag global para primeira interação
let userHasInteracted = false;
const pendingUnmutes: Set<() => void> = new Set();

if (typeof window !== "undefined") {
  const onFirstInteraction = () => {
    userHasInteracted = true;
    pendingUnmutes.forEach((fn) => fn());
    pendingUnmutes.clear();
    ["touchend", "click", "scroll"].forEach((e) =>
      window.removeEventListener(e, onFirstInteraction)
    );
  };
  ["touchend", "click", "scroll"].forEach((e) =>
    window.addEventListener(e, onFirstInteraction, { once: true, passive: true })
  );
}

export function VideoPlayer({ src, name, poster, className = "", autoUnmute = false }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const didAutoUnmute = useRef(false);

  // Auto-unmute após primeira interação (separado do autoplay)
  useEffect(() => {
    if (!autoUnmute) return;

    const unmute = () => {
      const video = videoRef.current;
      if (!video || didAutoUnmute.current) return;
      if (!video.paused) {
        video.muted = false;
        setIsMuted(false);
        didAutoUnmute.current = true;
        if (name) analytics.videoInteracao(name, "auto-unmute");
      }
    };

    if (userHasInteracted) {
      // Pequeno delay para garantir que o vídeo já começou a tocar
      setTimeout(unmute, 300);
    } else {
      pendingUnmutes.add(unmute);
      return () => { pendingUnmutes.delete(unmute); };
    }
  }, [autoUnmute, name]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().then(() => {
            setIsPlaying(true);
            // Auto-unmute quando o vídeo começa a tocar e usuário já interagiu
            if (autoUnmute && userHasInteracted && !didAutoUnmute.current) {
              video.muted = false;
              setIsMuted(false);
              didAutoUnmute.current = true;
              if (name) analytics.videoInteracao(name, "auto-unmute");
            }
          }).catch(() => {});
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
    if (!video.muted && name) analytics.videoInteracao(name, "unmute");
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl shadow-lg group ${className}`}
      onClick={toggleMute}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        className="w-full h-full object-cover cursor-pointer"
      />
      <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center gap-2 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={(e) => { e.stopPropagation(); togglePlay(); }}
          className="w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors"
          aria-label={isPlaying ? "Pausar" : "Reproduzir"}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-solie-green" />
          ) : (
            <Play className="w-5 h-5 text-solie-green ml-0.5" />
          )}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); toggleMute(); }}
          className="w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors"
          aria-label={isMuted ? "Ativar som" : "Mutar"}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-solie-green" />
          ) : (
            <Volume2 className="w-5 h-5 text-solie-green" />
          )}
        </button>
      </div>
    </div>
  );
}
