export interface CookieCategory {
  id: string;
  name: string;
  description: string;
  required: boolean;
  cookies: CookieDetail[];
}

export interface CookieDetail {
  name: string;
  purpose: string;
  duration: string;
  provider?: string;
}

export interface CookieConsent {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  timestamp: number;
  version: string;
}

export interface CookieSettings {
  categories: CookieCategory[];
  version: string;
  companyName: string;
  privacyPolicyUrl?: string;
  cookiePolicyUrl?: string;
}
