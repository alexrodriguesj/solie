"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface BannerContextType {
  isBannerVisible: boolean;
  setIsBannerVisible: (visible: boolean) => void;
}

const BannerContext = createContext<BannerContextType | undefined>(undefined);

const STORAGE_KEY = "solie-promo-banner-closed";

export function BannerProvider({ children }: { children: ReactNode }) {
  const [isBannerVisible, setIsBannerVisible] = useState(false);

  // PromoBanner desativado — manter sempre false
  // useEffect(() => {
  //   const wasClosed = sessionStorage.getItem(STORAGE_KEY);
  //   if (!wasClosed) {
  //     setIsBannerVisible(true);
  //   }
  // }, []);

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
