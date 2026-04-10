"use client";

import { useState, useCallback } from "react";

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  frontClassName?: string;
  backClassName?: string;
  className?: string;
}

export function FlipCard({
  front,
  back,
  frontClassName = "",
  backClassName = "",
  className = "",
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleTap = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  return (
    <div
      className={`[perspective:800px] ${className}`}
      onClick={handleTap}
    >
      <div
        className={`relative w-full h-full cursor-pointer [transform-style:preserve-3d] transition-transform duration-500 ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        } md:[transform:rotateY(0deg)] md:[&:hover]:[transform:rotateY(180deg)]`}
      >
        {/* Front */}
        <div
          className={`absolute inset-0 [backface-visibility:hidden] ${frontClassName}`}
        >
          {front}
        </div>
        {/* Back */}
        <div
          className={`absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] ${backClassName}`}
        >
          {back}
        </div>
      </div>
    </div>
  );
}
