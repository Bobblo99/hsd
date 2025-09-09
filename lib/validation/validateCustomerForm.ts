import type { CustomerFormData } from "@/types/customer-form";

export interface ValidationError {
  field: string;
  message: string;
}

const MAX_PHOTOS = 5;
const MAX_IMAGE_MB = 10;
const ALLOWED_SERVICES = ["rims", "tires-purchase", "tire-service"] as const;

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRe = /^[+()\d\s\/-]{6,}$/; // simpel, erlaubt +, (), /, -, Leerzeichen
const zipRe = /^\d{4,6}$/; // DE/AT/CH simpel

export const validateFormData = (form: CustomerFormData): ValidationError[] => {
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

  // --- Service-spezifische Prüfungen
  // RIMS
  if (form.selectedServices?.includes("rims")) {
    if (!form.rims) {
      push("rims", "Felgen-Daten sind erforderlich");
    } else {
      if (!form.rims.count)
        push("rims.count", "Anzahl Felgen ist erforderlich");
      if (!["ja", "nein"].includes(String(form.rims.hasBent || "")))
        push(
          "rims.hasBent",
          "Angabe, ob ein Schlag vorliegt (ja/nein), ist erforderlich"
        );
      if (!form.rims.finish?.trim())
        push("rims.finish", "Art der Aufbereitung ist erforderlich");
      // Farbe/Combination: mindestens eins
      if (!form.rims.color?.trim() && !form.rims.combination?.trim())
        push("rims.color", "Farbe/Kombination ist erforderlich");
    }
  }

  // TIRES PURCHASE
  if (form.selectedServices?.includes("tires-purchase")) {
    if (!form.tiresPurchase) {
      push("tiresPurchase", "Reifen-Kauf-Daten sind erforderlich");
    } else {
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
      else if (
        form.tiresPurchase.brandPreference === "gezielt" &&
        !form.tiresPurchase.targetBrand?.trim()
      ) {
        push("tiresPurchase.targetBrand", "Gezielte Marke ist erforderlich");
      }
    }
  }

  // TIRE SERVICE
  if (form.selectedServices?.includes("tire-service")) {
    if (!form.tireService) {
      push("tireService", "Reifen-Service-Daten sind erforderlich");
    } else {
      if (!form.tireService.mountService?.trim())
        push("tireService.mountService", "Montageservice ist erforderlich");
    }
  }

  // --- Bilder
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
