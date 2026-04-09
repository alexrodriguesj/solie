"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { analytics } from "@/lib/utils";

interface VideoPlayerProps {
  src: string;
  name?: string;
  poster?: string;
  className?: string;
}

export function VideoPlayer({ src, name, poster, className = "" }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
          setIsPlaying(true);
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
