// lib/mappers/createCustomerFromForm.ts
import type { CustomerFormData } from "@/types/customer-form";
import {
  CustomerCreateInput,
  CustomerServiceCreateInput,
} from "@/types/customers";
// Hilfsfunktionen für die JSON-Payloads der Services
function buildRimsData(form: CustomerFormData) {
  if (!form.rims) return undefined;
  const d = {
    rimsCount: form.rims.count ?? undefined,
    rimsHasBent: form.rims.hasBent ?? undefined, // "ja" | "nein"
    rimsFinish: form.rims.finish ?? undefined,
    rimsColor: form.rims.color ?? form.rims.combination ?? undefined,
    rimsSticker: form.rims.sticker ?? undefined,
    notes: form.rims.notes ?? undefined,
  };
  // nicht-leere Felder serialisieren
  const compact = Object.fromEntries(
    Object.entries(d).filter(([, v]) => v != null && v !== "")
  );
  return Object.keys(compact).length ? JSON.stringify(compact) : undefined;
}

function buildTiresPurchaseData(form: CustomerFormData) {
  if (!form.tiresPurchase) return undefined;
  const d = {
    tiresQuantity: form.tiresPurchase.quantity ?? undefined,
    tiresSize: form.tiresPurchase.size ?? undefined,
    tiresUsage: form.tiresPurchase.usage ?? undefined, // "sommer" | "winter" | "ganzjahr"
    tiresBrand:
      form.tiresPurchase.brandPreference === "gezielt"
        ? form.tiresPurchase.targetBrand
        : form.tiresPurchase?.brandPreference ?? undefined,
    notes: form.tiresPurchase.notes ?? undefined,
  };
  const compact = Object.fromEntries(
    Object.entries(d).filter(([, v]) => v != null && v !== "")
  );
  return Object.keys(compact).length ? JSON.stringify(compact) : undefined;
}

function buildTireServiceData(form: CustomerFormData) {
  if (!form.tireService) return undefined;
  const d = {
    mountService: form.tireService.mountService ?? undefined,
    notes: form.tireService.notes ?? undefined,
  };
  const compact = Object.fromEntries(
    Object.entries(d).filter(([, v]) => v != null && v !== "")
  );
  return Object.keys(compact).length ? JSON.stringify(compact) : undefined;
}

/**
 * Baut die Payloads für:
 * - customers (Stammdaten)
 * - customerServices (1..n je nach Auswahl)
 * - filesToUpload (die rohen Files aus dem Formular)
 */
export function createCustomerPayloadsFromForm(form: CustomerFormData): {
  customer: CustomerCreateInput;
  services: CustomerServiceCreateInput[];
  filesToUpload: File[]; // separat im Storage hochladen, danach customerFiles-Dokumente anlegen
} {
  // Kontakt / Adresse
  const fullName = `${form.firstName} ${form.lastName}`.trim();
  const fullAddress =
    `${form.street} ${form.houseNumber}, ${form.zipCode} ${form.city}`.trim();

  // 1) Customer-Payload (ohne services / ohne images)
  const customer: CustomerCreateInput = {
    firstName: form.firstName,
    lastName: form.lastName,
    fullName,
    street: form.street,
    houseNumber: form.houseNumber,
    zipCode: form.zipCode,
    city: form.city,
    fullAddress,
    email: form.email,
    phone: form.phone,
    imageCount: 0, // beim Upload hochzählen
    hasImages: false, // wird nach Upload gesetzt
    status: form.status, // z.B. "eingegangen"
  };

  // 2) Services-Payloads (je nach Auswahl)
  const services: CustomerServiceCreateInput[] = [];

  // Wir gehen über form.selectedServices (falls vorhanden)
  // und erzeugen je Service ein Dokument mit seinem JSON-"data".
  if (form.selectedServices?.includes("rims")) {
    services.push({
      serviceType: "rims",
      data: buildRimsData(form),
      status: "offen",
    });
  }
  if (form.selectedServices?.includes("tires-purchase")) {
    services.push({
      serviceType: "tires-purchase",
      data: buildTiresPurchaseData(form),
      status: "offen",
    });
  }
  if (form.selectedServices?.includes("tire-service")) {
    services.push({
      serviceType: "tire-service",
      data: buildTireServiceData(form),
      status: "offen",
    });
  }

  // 3) Files separat hochladen (Storage) → danach customerFiles-Dokumente anlegen
  const filesToUpload = Array.from(form.photos ?? []);

  return { customer, services, filesToUpload };
}
