"use client";

import { useState, useEffect } from "react";
import { CookieConsent } from "@/types/cookies";
import { cookieManager } from "@/lib/cookies/manager";

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [hasConsent, setHasConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load initial consent
    const initialConsent = cookieManager.getConsent();
    setConsent(initialConsent);
    setHasConsent(!!initialConsent);
    setIsLoading(false);

    // Listen for consent changes
    const unsubscribe = cookieManager.onConsentChange((newConsent) => {
      setConsent(newConsent);
      setHasConsent(true);
    });

    return unsubscribe;
  }, []);

  const updateConsent = (
    newConsent: Omit<CookieConsent, "timestamp" | "version">
  ) => {
    cookieManager.saveConsent(newConsent);
  };

  const acceptAll = () => {
    cookieManager.acceptAll();
  };

  const acceptNecessaryOnly = () => {
    cookieManager.acceptNecessaryOnly();
  };

  const clearConsent = () => {
    cookieManager.clearConsent();
    setConsent(null);
    setHasConsent(false);
  };

  const isCategoryAllowed = (categoryId: string): boolean => {
    return cookieManager.isCategoryAllowed(categoryId);
  };

  return {
    consent,
    hasConsent,
    isLoading,
    updateConsent,
    acceptAll,
    acceptNecessaryOnly,
    clearConsent,
    isCategoryAllowed,
  };
}
