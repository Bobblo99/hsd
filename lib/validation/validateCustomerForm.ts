// lib/validation/validateCustomerForm.ts
import type { CustomerFormData } from "@/types/customer-form";

export interface ValidationError {
  field: string;
  message: string;
}

const MAX_PHOTOS = 5;
const MAX_IMAGE_MB = 10;
const ALLOWED_SERVICES = ["rims", "tires-purchase", "tire-service"] as const;

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRe = /^[+()\d\s\/-]{6,}$/;
const zipRe = /^\d{4,6}$/;

type Options = {
  /** Wenn true = Details zwingend bei ausgewähltem Service */
  requireDetailsForSelectedService?: boolean;
};

export const validateFormData = (
  form: CustomerFormData,
  opts: Options = {}
): ValidationError[] => {
  const { requireDetailsForSelectedService = false } = opts;
  const errors: ValidationError[] = [];
  const push = (field: string, message: string) =>
    errors.push({ field, message });

  // --- Kontakt
  if (!form.firstName?.trim()) push("firstName", "Vorname ist erforderlich");
  if (!form.lastName?.trim()) push("lastName", "Nachname ist erforderlich");

  if (!form.email?.trim()) push("email", "E-Mail ist erforderlich");
  else if (!emailRe.test(form.email.trim()))
    push("email", "E-Mail-Format ist ungültig");

  if (!form.phone?.trim()) push("phone", "Telefon ist erforderlich");
  else if (!phoneRe.test(form.phone.trim()))
    push("phone", "Telefon-Format ist ungültig");

  if (!form.street?.trim()) push("street", "Straße ist erforderlich");
  if (!form.houseNumber?.trim())
    push("houseNumber", "Hausnummer ist erforderlich");
  if (!form.zipCode?.trim()) push("zipCode", "Postleitzahl ist erforderlich");
  else if (!zipRe.test(form.zipCode.trim()))
    push("zipCode", "Postleitzahl ungültig");
  if (!form.city?.trim()) push("city", "Ort ist erforderlich");

  if (!form.agbAccepted) push("agbAccepted", "AGB müssen akzeptiert werden");

  // --- Services Auswahl
  if (!form.selectedServices?.length) {
    push("selectedServices", "Mindestens ein Service muss ausgewählt werden");
  } else {
    const invalid = form.selectedServices.filter(
      (s) => !ALLOWED_SERVICES.includes(s as any)
    );
    if (invalid.length)
      push("selectedServices", `Ungültige Services: ${invalid.join(", ")}`);
  }

  // --- RIMS
  const rimsSelected = form.selectedServices?.includes("rims");
  if (requireDetailsForSelectedService && rimsSelected && !form.rims) {
    push("rims", "Felgen-Daten sind erforderlich");
  }
  if (form.rims) {
    if (!form.rims.count) push("rims.count", "Anzahl Felgen ist erforderlich");

    if (!["ja", "nein"].includes(String(form.rims.hasBent || "")))
      push("rims.hasBent", "Angabe erforderlich (ja/nein)");

    if (!form.rims.finish?.trim())
      push("rims.finish", "Art der Aufbereitung ist erforderlich");

    if (form.rims.finish === "einfarbig" && !form.rims.color?.trim())
      push("rims.color", "Farbe ist erforderlich");

    if (form.rims.finish === "zweifarbig" && !form.rims.combination?.trim())
      push("rims.combination", "Kombination ist erforderlich");

    if (form.rims.hasBent === "ja" && !form.rims.damagedCount?.trim())
      push("rims.damagedCount", "Beschädigte Anzahl ist erforderlich");

    if (form.rims.sticker === "audi-sport" && !form.rims.stickerColor?.trim())
      push("rims.stickerColor", "Aufkleber-Farbe ist erforderlich");
  }

  // --- TIRES PURCHASE
  const tpSelected = form.selectedServices?.includes("tires-purchase");
  if (requireDetailsForSelectedService && tpSelected && !form.tiresPurchase) {
    push("tiresPurchase", "Reifen-Kauf-Daten sind erforderlich");
  }
  if (form.tiresPurchase) {
    if (!form.tiresPurchase.quantity)
      push("tiresPurchase.quantity", "Stückzahl ist erforderlich");
    if (!form.tiresPurchase.size?.trim())
      push("tiresPurchase.size", "Reifengröße ist erforderlich");

    if (!form.tiresPurchase.usage?.trim())
      push("tiresPurchase.usage", "Einsatzart ist erforderlich");

    if (!form.tiresPurchase.brandPreference)
      push(
        "tiresPurchase.brandPreference",
        "Hersteller/Präferenz ist erforderlich"
      );

    if (
      form.tiresPurchase.brandPreference === "gezielt" &&
      !form.tiresPurchase.targetBrand?.trim()
    ) {
      push("tiresPurchase.specificBrand", "Gezielte Marke ist erforderlich");
    }
  }

  // --- TIRE SERVICE
  const tsSelected = form.selectedServices?.includes("tire-service");
  if (requireDetailsForSelectedService && tsSelected && !form.tireService) {
    push("tireService", "Reifen-Service-Daten sind erforderlich");
  }
  if (form.tireService) {
    if (!form.tireService.mountService?.trim())
      push("tireService.mountingService", "Montageservice ist erforderlich");
  }

  // --- Fotos
  if (form.photos) {
    if (form.photos.length > MAX_PHOTOS)
      push("photos", `Maximal ${MAX_PHOTOS} Fotos erlaubt`);

    form.photos.forEach((photo, index) => {
      if (!photo.type?.startsWith("image/")) {
        push(`photos.${index}`, "Nur Bilddateien sind erlaubt");
      }
      const sizeMB = photo.size / (1024 * 1024);
      if (sizeMB > MAX_IMAGE_MB) {
        push(`photos.${index}`, `Bild zu groß (max. ${MAX_IMAGE_MB}MB)`);
      }
    });
  }

  return errors;
};
