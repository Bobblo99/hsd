// lib/validation/validateCustomerForm.ts
import type { CustomerFormData } from "@/types/customer-form";

export const validateFormData = (data: Partial<CustomerFormData>): string[] => {
  const errors: string[] = [];

  // contact
  if (!data.firstName) errors.push("Vorname ist erforderlich");
  if (!data.lastName) errors.push("Nachname ist erforderlich");
  if (!data.email) errors.push("E-Mail ist erforderlich");
  if (!data.phone) errors.push("Telefonnummer ist erforderlich");
  if (!data.street) errors.push("Straße ist erforderlich");
  if (!data.zipCode) errors.push("PLZ ist erforderlich");
  if (!data.city) errors.push("Wohnort ist erforderlich");
  if (!data.agbAccepted) errors.push("AGB müssen akzeptiert werden");

  // services
  if (!data.selectedServices || data.selectedServices.length === 0) {
    errors.push("Mindestens ein Service muss ausgewählt werden");
  }

  // rims
  if (data.selectedServices?.includes("rims") && data.rims) {
    if (!data.rims.count) errors.push("Anzahl Felgen ist erforderlich");
    if (!data.rims.hasBent) errors.push("Schlag-Angabe ist erforderlich");
    if (!data.rims.finish) errors.push("Aufbereitungsart ist erforderlich");
    if (!data.rims.sticker) errors.push("Aufkleber-Auswahl ist erforderlich");

    if (data.rims.hasBent === "ja" && !data.rims.damagedCount) {
      errors.push("Anzahl beschädigter Felgen ist erforderlich");
    }
    if (data.rims.finish === "einfarbig" && !data.rims.color) {
      errors.push("Farbe ist erforderlich");
    }
    if (data.rims.finish === "zweifarbig" && !data.rims.combination) {
      errors.push("Kombination ist erforderlich");
    }
    if (data.rims.sticker === "audi-sport" && !data.rims.stickerColor) {
      errors.push("Aufkleber-Farbe ist erforderlich");
    }
  }

  // tires purchase
  if (data.selectedServices?.includes("tires-purchase") && data.tiresPurchase) {
    if (!data.tiresPurchase.quantity) errors.push("Stückzahl ist erforderlich");
    if (!data.tiresPurchase.size) errors.push("Reifengröße ist erforderlich");
    if (!data.tiresPurchase.usage) errors.push("Einsatzart ist erforderlich");
    if (!data.tiresPurchase.brandPreference)
      errors.push("Hersteller-Kategorie ist erforderlich");
    if (
      data.tiresPurchase.brandPreference === "gezielt" &&
      !data.tiresPurchase.targetBrand
    ) {
      errors.push("Gezielter Hersteller ist erforderlich");
    }
  }

  // tire service
  if (data.selectedServices?.includes("tire-service") && data.tireService) {
    if (!data.tireService.mountService)
      errors.push("Montageservice-Beschreibung ist erforderlich");
  }

  return errors;
};
