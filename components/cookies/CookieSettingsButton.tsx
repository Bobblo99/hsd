"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Cookie,
  Settings,
  Shield,
  BarChart3,
  Target,
  Palette,
  ExternalLink,
  Save,
  RotateCcw,
} from "lucide-react";
import { CookieConsent } from "@/types/cookies";
import { cookieManager } from "@/lib/cookies/manager";
import { COOKIE_CONFIG } from "@/lib/cookies/config";

interface CookieSettingsButtonProps {
  variant?: "button" | "link";
  className?: string;
}

export function CookieSettingsButton({
  variant = "button",
  className = "",
}: CookieSettingsButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [consent, setConsent] = useState<Partial<CookieConsent>>(() => {
    const existing = cookieManager.getConsent();
    return (
      existing || {
        necessary: true,
        analytics: false,
        marketing: false,
        preferences: false,
      }
    );
  });

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setConsent((prev) => ({
      ...prev,
      [categoryId]: checked,
    }));
  };

  const handleSave = () => {
    cookieManager.saveConsent({
      necessary: true, // Always true
      analytics: consent.analytics || false,
      marketing: consent.marketing || false,
      preferences: consent.preferences || false,
    });
    setIsOpen(false);
  };

  const handleReset = () => {
    setConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    });
  };

  const getCategoryIcon = (categoryId: string) => {
    const icons = {
      necessary: <Shield className="h-5 w-5 text-green-500" />,
      analytics: <BarChart3 className="h-5 w-5 text-blue-500" />,
      marketing: <Target className="h-5 w-5 text-purple-500" />,
      preferences: <Palette className="h-5 w-5 text-orange-500" />,
    };
    return (
      icons[categoryId as keyof typeof icons] || <Cookie className="h-5 w-5" />
    );
  };

  const Trigger =
    variant === "button" ? (
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className={`bg-white/5 border-white/20 text-white hover:bg-white/10 ${className}`}
      >
        <Cookie className="h-4 w-4 mr-2" />
        Cookie-Einstellungen
      </Button>
    ) : (
      <button
        onClick={() => setIsOpen(true)}
        className={`text-gray-400 hover:text-red-500 transition-colors duration-300 flex items-center gap-1 ${className}`}
      >
        <Cookie className="h-4 w-4" />
        Cookie-Einstellungen
      </button>
    );

  return (
    <>
      {Trigger}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-3">
              <Cookie className="h-6 w-6 text-red-500" />
              Cookie-Einstellungen verwalten
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Passen Sie Ihre Cookie-Präferenzen an. Änderungen werden sofort
              wirksam.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 max-h-[60vh] overflow-y-auto p-1">
            {COOKIE_CONFIG.categories.map((category) => (
              <div
                key={category.id}
                className="bg-white/5 rounded-xl border border-white/10 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(category.id)}
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
                              consent[category.id as keyof CookieConsent]
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
                    <p className="text-xs text-gray-500 mb-2">
                      {category.cookies.length} Cookie
                      {category.cookies.length !== 1 ? "s" : ""}:
                    </p>
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
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-700">
            <Button
              onClick={handleReset}
              variant="outline"
              className="bg-white/5 border-white/20 text-white hover:bg-white/10"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Zurücksetzen
            </Button>

            <Button
              onClick={() => {
                cookieManager.acceptNecessaryOnly();
                setIsOpen(false);
              }}
              variant="outline"
              className="bg-white/5 border-white/20 text-white hover:bg-white/10"
            >
              Nur notwendige
            </Button>

            <Button
              onClick={() => {
                cookieManager.acceptAll();
                setIsOpen(false);
              }}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              Alle akzeptieren
            </Button>

            <Button
              onClick={handleSave}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold"
            >
              <Save className="h-4 w-4 mr-2" />
              Speichern
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
