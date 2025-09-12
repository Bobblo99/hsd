"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Cookie,
  Settings,
  Shield,
  X,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Info,
} from "lucide-react";
import { CookieConsent } from "@/types/cookies";
import { COOKIE_CONFIG } from "@/lib/cookies/config";
import { cookieManager } from "@/lib/cookies/manager";

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [consent, setConsent] = useState<Partial<CookieConsent>>({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    const checkConsent = () => {
      // Check if user has already given consent
      const hasConsent = cookieManager.hasConsent();
      setIsVisible(!hasConsent);

      // Load existing consent if available
      const existingConsent = cookieManager.getConsent();
      if (existingConsent) {
        setConsent(existingConsent);
      } else {
        // Reset to defaults if no consent found
        setConsent({
          necessary: true,
          analytics: false,
          marketing: false,
          preferences: false,
        });
      }
    };

    // Initial check
    checkConsent();

    // Check every 2 seconds for manual cookie clearing
    const interval = setInterval(checkConsent, 2000);

    // Listen for storage events (other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "hsd_cookie_consent" || e.key === null) {
        checkConsent();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Lock body scroll when banner is visible
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden";

      // Focus management
      const banner = document.querySelector('[role="dialog"]') as HTMLElement;
      if (banner) {
        banner.focus();
      }

      // ESC key handler
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          handleAcceptNecessary();
        }
      };

      document.addEventListener("keydown", handleEscape);

      return () => {
        document.body.style.overflow = "unset";
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, []);

  const handleAcceptAll = () => {
    cookieManager.acceptAll();
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    cookieManager.acceptNecessaryOnly();
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    cookieManager.saveConsent({
      necessary: true, // Always true
      analytics: consent.analytics || false,
      marketing: consent.marketing || false,
      preferences: consent.preferences || false,
    });
    setIsVisible(false);
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setConsent((prev) => ({
      ...prev,
      [categoryId]: checked,
    }));
  };

  const getTotalCookies = () => {
    return COOKIE_CONFIG.categories.reduce((total, category) => {
      return total + category.cookies.length;
    }, 0);
  };

  const getSelectedCookies = () => {
    return COOKIE_CONFIG.categories.reduce((total, category) => {
      const isSelected =
        category.required || consent[category.id as keyof CookieConsent];
      return total + (isSelected ? category.cookies.length : 0);
    }, 0);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end lg:items-center justify-center p-4">
      <Card className="w-full max-w-4xl bg-gray-900 border-gray-700 shadow-2xl max-h-[90vh] overflow-hidden">
        <CardContent className="p-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500/10 to-red-600/10 border-b border-gray-700 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                  <Cookie className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    🍪 Cookie-Einstellungen
                  </h2>
                  <p className="text-gray-300">
                    Wir verwenden Cookies, um Ihnen die beste Erfahrung zu
                    bieten
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-4 mt-4">
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                {getSelectedCookies()} von {getTotalCookies()} Cookies
              </Badge>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                DSGVO-konform
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                Jederzeit änderbar
              </Badge>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            {!showDetails ? (
              /* Simple View */
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-lg text-gray-300 mb-4">
                    Wir respektieren Ihre Privatsphäre und geben Ihnen die volle
                    Kontrolle über Ihre Daten.
                  </p>
                  <p className="text-gray-400">
                    Sie können jederzeit Ihre Cookie-Einstellungen anpassen oder
                    alle nicht-notwendigen Cookies ablehnen.
                  </p>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-white font-medium">
                          Datenschutz garantiert
                        </p>
                        <p className="text-sm text-gray-400">
                          Keine Daten ohne Ihre Zustimmung
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={COOKIE_CONFIG.privacyPolicyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1"
                      >
                        Datenschutz
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setShowDetails(true)}
                  variant="outline"
                  className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Erweiterte Einstellungen
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              /* Detailed View */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">
                    Cookie-Kategorien
                  </h3>
                  <Button
                    onClick={() => setShowDetails(false)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white"
                  >
                    <ChevronUp className="h-4 w-4 mr-2" />
                    Einfache Ansicht
                  </Button>
                </div>

                <div className="space-y-4">
                  {COOKIE_CONFIG.categories.map((category) => (
                    <div
                      key={category.id}
                      className="bg-white/5 rounded-xl border border-white/10 overflow-hidden"
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                category.required
                                  ? "bg-green-500/20"
                                  : consent[category.id as keyof CookieConsent]
                                  ? "bg-red-500/20"
                                  : "bg-gray-500/20"
                              }`}
                            >
                              {category.required ? (
                                <Shield className="h-4 w-4 text-green-500" />
                              ) : (
                                <Cookie
                                  className={`h-4 w-4 ${
                                    consent[category.id as keyof CookieConsent]
                                      ? "text-red-500"
                                      : "text-gray-400"
                                  }`}
                                />
                              )}
                            </div>
                            <div>
                              <h4 className="text-white font-semibold flex items-center gap-2">
                                {category.name}
                                {category.required && (
                                  <Badge className="bg-green-500/20 text-green-400 text-xs">
                                    Erforderlich
                                  </Badge>
                                )}
                              </h4>
                              <p className="text-sm text-gray-400">
                                {category.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center">
                            {category.required ? (
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                Immer aktiv
                              </Badge>
                            ) : (
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={Boolean(
                                    consent[
                                      category.id as keyof CookieConsent
                                    ] || false
                                  )}
                                  onChange={(e) =>
                                    handleCategoryChange(
                                      category.id,
                                      e.target.checked
                                    )
                                  }
                                  className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                              </label>
                            )}
                          </div>
                        </div>

                        {/* Cookie Details */}
                        <div className="space-y-2">
                          {category.cookies.map((cookie, index) => (
                            <div
                              key={index}
                              className="bg-white/5 rounded-lg p-3 border border-white/10"
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <code className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300">
                                      {cookie.name}
                                    </code>
                                    {cookie.provider && (
                                      <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                                        {cookie.provider}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-400 mb-1">
                                    {cookie.purpose}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Laufzeit: {cookie.duration}
                                  </p>
                                </div>
                                <Info className="h-4 w-4 text-gray-500 flex-shrink-0 mt-1" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Legal Links */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-400 font-medium mb-1">
                        📋 Rechtliche Informationen
                      </p>
                      <p className="text-sm text-gray-400">
                        Weitere Details zu unserem Umgang mit Cookies und Daten
                      </p>
                    </div>
                    <div className="flex gap-3">
                      {COOKIE_CONFIG.privacyPolicyUrl && (
                        <a
                          href={COOKIE_CONFIG.privacyPolicyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                        >
                          Datenschutz
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      {COOKIE_CONFIG.cookiePolicyUrl && (
                        <a
                          href={COOKIE_CONFIG.cookiePolicyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                        >
                          Cookie-Richtlinie
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-800 border-t border-gray-700 p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAcceptNecessary}
                variant="outline"
                className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10"
              >
                Nur notwendige
              </Button>

              {showDetails && (
                <Button
                  onClick={handleSavePreferences}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Auswahl speichern
                </Button>
              )}

              <Button
                onClick={handleAcceptAll}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold"
              >
                Alle akzeptieren
              </Button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              Durch die Nutzung unserer Website stimmen Sie unserer{" "}
              <a
                href={COOKIE_CONFIG.privacyPolicyUrl}
                className="text-red-400 hover:text-red-300"
              >
                Datenschutzerklärung
              </a>{" "}
              zu. Sie können Ihre Einstellungen jederzeit ändern.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
