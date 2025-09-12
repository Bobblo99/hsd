import { CookieCategory, CookieSettings } from "@/types/cookies";

export const COOKIE_CONFIG: CookieSettings = {
  version: "1.0",
  companyName: "HSD GmbH",
  privacyPolicyUrl: "/datenschutz",
  cookiePolicyUrl: "/cookie-policy",
  categories: [
    {
      id: "necessary",
      name: "Notwendige Cookies",
      description:
        "Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden.",
      required: true,
      cookies: [
        {
          name: "session_token",
          purpose: "Benutzer-Session verwalten",
          duration: "Session",
          provider: "HSD GmbH",
        },
        {
          name: "csrf_token",
          purpose: "Schutz vor Cross-Site-Request-Forgery",
          duration: "Session",
          provider: "HSD GmbH",
        },
        {
          name: "cookie_consent",
          purpose: "Speichert Ihre Cookie-Einstellungen",
          duration: "1 Jahr",
          provider: "HSD GmbH",
        },
      ],
    },
    {
      id: "analytics",
      name: "Analyse & Performance",
      description:
        "Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren.",
      required: false,
      cookies: [
        {
          name: "_ga",
          purpose: "Unterscheidet Benutzer für Google Analytics",
          duration: "2 Jahre",
          provider: "Google",
        },
        {
          name: "_ga_*",
          purpose: "Speichert Session-Informationen für Analytics",
          duration: "2 Jahre",
          provider: "Google",
        },
        {
          name: "hotjar_*",
          purpose: "Heatmaps und Benutzerverhalten analysieren",
          duration: "1 Jahr",
          provider: "Hotjar",
        },
      ],
    },
    {
      id: "marketing",
      name: "Marketing & Werbung",
      description:
        "Diese Cookies werden verwendet, um Ihnen relevante Werbung zu zeigen.",
      required: false,
      cookies: [
        {
          name: "_fbp",
          purpose: "Facebook Pixel für Conversion-Tracking",
          duration: "3 Monate",
          provider: "Meta",
        },
        {
          name: "google_ads_*",
          purpose: "Google Ads Conversion-Tracking",
          duration: "90 Tage",
          provider: "Google",
        },
        {
          name: "linkedin_*",
          purpose: "LinkedIn Ads und Remarketing",
          duration: "6 Monate",
          provider: "LinkedIn",
        },
      ],
    },
  ],
};

export const addCustomCookieCategory = (category: CookieCategory) => {
  COOKIE_CONFIG.categories.push(category);
};
