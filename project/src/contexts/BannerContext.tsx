"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { PROMO_ATIVA } from "@/data/promos";

interface BannerContextType {
  isBannerVisible: boolean;
  setIsBannerVisible: (visible: boolean) => void;
}

const BannerContext = createContext<BannerContextType | undefined>(undefined);

const STORAGE_KEY = "solie-promo-banner-closed";

export function BannerProvider({
  children,
  disabled = false,
}: {
  children: ReactNode;
  /** Quando true, o banner nunca aparece (usar em páginas sem PromoBanner). */
  disabled?: boolean;
}) {
  const [isBannerVisible, setIsBannerVisible] = useState(false);

  // Banner aparece só com a promo ligada (PROMO_ATIVA), na página que de fato
  // renderiza o <PromoBanner /> (disabled=false), e se o usuário não o fechou.
  useEffect(() => {
    if (disabled || !PROMO_ATIVA) return;
    const wasClosed = sessionStorage.getItem(STORAGE_KEY);
    if (!wasClosed) {
      setIsBannerVisible(true);
    }
  }, [disabled]);

  const handleSetVisible = (visible: boolean) => {
    setIsBannerVisible(visible);
    if (!visible) {
      sessionStorage.setItem(STORAGE_KEY, "true");
    }
  };

  return (
    <BannerContext.Provider value={{ isBannerVisible, setIsBannerVisible: handleSetVisible }}>
      {children}
    </BannerContext.Provider>
  );
}

export function useBanner() {
  const context = useContext(BannerContext);
  if (context === undefined) {
    throw new Error("useBanner must be used within a BannerProvider");
  }
  return context;
}
