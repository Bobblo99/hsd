import { CookieConsent } from "@/types/cookies";
import { COOKIE_CONFIG } from "./config";

const CONSENT_KEY = "hsd_cookie_consent";
const CONSENT_VERSION = COOKIE_CONFIG.version;

// Cookie Utilities
const setCookie = (name: string, value: string, days: number = 365) => {
  if (typeof document === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
};

const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;

  const nameEQ = name + "=";
  const ca = document.cookie.split(";");

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0)
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
};

const deleteCookie = (name: string) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

export class CookieManager {
  private static instance: CookieManager;
  private consent: CookieConsent | null = null;
  private listeners: ((consent: CookieConsent) => void)[] = [];

  private constructor() {
    this.loadConsent();
  }

  public static getInstance(): CookieManager {
    if (!CookieManager.instance) {
      CookieManager.instance = new CookieManager();
    }
    return CookieManager.instance;
  }

  private loadConsent(): void {
    if (typeof window === "undefined") return;

    try {
      // Prüfe BEIDE: echte Cookies UND localStorage
      const cookieConsent = getCookie(CONSENT_KEY);
      const localStorageConsent = localStorage.getItem(CONSENT_KEY);

      // Wenn BEIDE fehlen = manuell gelöscht
      if (!cookieConsent && !localStorageConsent) {
        this.consent = null;
        return;
      }

      // Prüfe echte Cookies zuerst
      if (cookieConsent) {
        try {
          const parsed = JSON.parse(cookieConsent);
          if (parsed.version === CONSENT_VERSION) {
            this.consent = parsed;
            // Sync mit localStorage
            localStorage.setItem(CONSENT_KEY, cookieConsent);
            return;
          }
        } catch (e) {
          console.warn("Invalid cookie consent format");
        }
      }

      // Fallback auf localStorage
      if (localStorageConsent) {
        try {
          const parsed = JSON.parse(localStorageConsent);
          if (parsed.version === CONSENT_VERSION) {
            this.consent = parsed;
            // Sync mit echten Cookies
            this.saveToCookies(parsed);
            return;
          }
        } catch (e) {
          console.warn("Invalid localStorage consent format");
        }
      }

      // Wenn Version nicht passt = Reset
      this.clearConsent();
    } catch (error) {
      console.error("Error loading cookie consent:", error);
      this.clearConsent();
    }
  }

  private saveToCookies(consent: CookieConsent): void {
    // Speichere Consent in echten Cookies
    setCookie(CONSENT_KEY, JSON.stringify(consent), 365);

    // Setze spezifische Cookies basierend auf Consent
    if (consent.necessary) {
      setCookie("hsd_session", "active", 1); // Session Cookie
      setCookie("hsd_csrf_token", `csrf_${Date.now()}`, 1); // CSRF Token
    }

    if (consent.analytics) {
      setCookie("hsd_analytics", "enabled", 365);
      setCookie("_ga_tracking", "active", 730); // Google Analytics
    } else {
      deleteCookie("hsd_analytics");
      deleteCookie("_ga_tracking");
    }

    if (consent.marketing) {
      setCookie("hsd_marketing", "enabled", 90);
      setCookie("_fbp", "facebook_pixel_active", 90); // Facebook Pixel
    } else {
      deleteCookie("hsd_marketing");
      deleteCookie("_fbp");
    }

    if (consent.preferences) {
      setCookie("hsd_theme", "dark", 365);
      setCookie("hsd_language", "de", 365);
    } else {
      deleteCookie("hsd_theme");
      deleteCookie("hsd_language");
    }
  }

  public saveConsent(
    consent: Omit<CookieConsent, "timestamp" | "version">
  ): void {
    const fullConsent: CookieConsent = {
      ...consent,
      timestamp: Date.now(),
      version: CONSENT_VERSION,
    };

    this.consent = fullConsent;

    try {
      // Speichere in echten Cookies UND localStorage
      this.saveToCookies(fullConsent);
      localStorage.setItem(CONSENT_KEY, JSON.stringify(fullConsent));
      this.notifyListeners(fullConsent);
      this.applyCookieSettings(fullConsent);
    } catch (error) {
      console.error("Error saving cookie consent:", error);
    }
  }

  public getConsent(): CookieConsent | null {
    return this.consent;
  }

  public hasConsent(): boolean {
    // Prüfe sowohl Memory als auch echte Cookies
    if (this.consent) return true;

    // Double-check echte Cookies
    const cookieConsent = getCookie(CONSENT_KEY);
    if (cookieConsent) {
      try {
        const parsed = JSON.parse(cookieConsent);
        if (parsed.version === CONSENT_VERSION) {
          this.consent = parsed;
          return true;
        }
      } catch (e) {
        // Invalid format
      }
    }

    return false;
  }

  public isCategoryAllowed(categoryId: string): boolean {
    if (!this.consent) return false;
    return this.consent[categoryId as keyof CookieConsent] === true;
  }

  public clearConsent(): void {
    this.consent = null;
    try {
      // Lösche echte Cookies UND localStorage
      deleteCookie(CONSENT_KEY);
      deleteCookie("hsd_session");
      deleteCookie("hsd_csrf_token");
      deleteCookie("hsd_analytics");
      deleteCookie("_ga_tracking");
      deleteCookie("hsd_marketing");
      deleteCookie("_fbp");
      deleteCookie("hsd_theme");
      deleteCookie("hsd_language");
      localStorage.removeItem(CONSENT_KEY);
    } catch (error) {
      console.error("Error clearing cookie consent:", error);
    }
  }

  public onConsentChange(
    callback: (consent: CookieConsent) => void
  ): () => void {
    this.listeners.push(callback);

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(
        (listener) => listener !== callback
      );
    };
  }

  private notifyListeners(consent: CookieConsent): void {
    this.listeners.forEach((listener) => {
      try {
        listener(consent);
      } catch (error) {
        console.error("Error in consent listener:", error);
      }
    });
  }

  private applyCookieSettings(consent: CookieConsent): void {
    // Analytics
    if (consent.analytics) {
      this.enableAnalytics();
    } else {
      this.disableAnalytics();
    }

    // Marketing
    if (consent.marketing) {
      this.enableMarketing();
    } else {
      this.disableMarketing();
    }

    // Preferences
    if (consent.preferences) {
      this.enablePreferences();
    } else {
      this.disablePreferences();
    }
  }

  private enableAnalytics(): void {
    // Google Analytics
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        analytics_storage: "granted",
      });
    }

    // Hotjar
    if (typeof window !== "undefined" && (window as any).hj) {
      (window as any).hj("consent", "granted");
    }
  }

  private disableAnalytics(): void {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        analytics_storage: "denied",
      });
    }
  }

  private enableMarketing(): void {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
      });
    }
  }

  private disableMarketing(): void {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
    }
  }

  private enablePreferences(): void {
    // Enable preference cookies
    console.log("Preferences enabled");
  }

  private disablePreferences(): void {
    // Disable preference cookies
    console.log("Preferences disabled");
  }

  // Utility methods
  public acceptAll(): void {
    this.saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    });
  }

  public acceptNecessaryOnly(): void {
    this.saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    });
  }

  public updateCategory(categoryId: string, allowed: boolean): void {
    if (!this.consent) return;

    const updatedConsent = {
      ...this.consent,
      [categoryId]: allowed,
    };

    this.saveConsent(updatedConsent);
  }
}

export const cookieManager = CookieManager.getInstance();
