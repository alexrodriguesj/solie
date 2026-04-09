"use client";

import { useEffect, useRef, useState } from "react";
import { analytics } from "@/lib/utils";

interface ReadingProgressProps {
  slug?: string;
}

export function ReadingProgress({ slug }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const milestonesRef = useRef(new Set<number>());

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      const current = Math.min(100, scrollPercent);
      setProgress(current);

      if (slug) {
        const milestones = [25, 50, 75, 100];
        for (const m of milestones) {
          if (current >= m && !milestonesRef.current.has(m)) {
            milestonesRef.current.add(m);
            analytics.blogLeitura(slug, m);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [slug]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1">
      <div
        className="h-full bg-solie-green transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
