// Comprehensive Customer Form Types for Database
export interface CustomerFormData {
  // Kontaktdaten (Abschnitt 1)
  firstName: string;
  lastName: string;
  street: string;
  houseNumber: string;
  zipCode: string;
  city: string;
  email: string;
  phone: string;
  agbAccepted: boolean;

  // Service Selection (Abschnitt 2)
  selectedServices: ServiceType[];

  // Felgen Aufbereitung (Abschnitt 3) - Optional
  felgen?: {
    anzahl: string;
    hatSchlag: "ja" | "nein";
    beschaedigteAnzahl?: string; // Nur wenn hatSchlag = "ja"
    aufbereitungsart:
      | "einfarbig"
      | "zweifarbig"
      | "chrom"
      | "smart-repair"
      | "glanzdrehen";
    farbe?: string; // Nur bei einfarbig
    kombination?: string; // Nur bei zweifarbig
    aufkleber:
      | "audi-sport"
      | "rs-audi"
      | "m-bmw"
      | "kein-aufkleber"
      | "sonstiges";
    aufkleberFarbe?: string; // Nur bei audi-sport
    anmerkungen?: string;
  };

  // Reifen Kaufen (Abschnitt 4) - Optional
  reifenKaufen?: {
    stueckzahl: string;
    reifengroesse: string;
    einsatzart: "sommer" | "winter" | "ganzjahr";
    herstellerKategorie: "premium" | "basic" | "low-budget" | "gezielt";
    gezielterHersteller?: string; // Nur bei gezielt
    anmerkungen?: string;
  };

  // Reifenservice (Abschnitt 5) - Optional
  reifenService?: {
    montageservice: string;
    anmerkungen?: string;
  };

  // Meta Data
  status: "eingegangen" | "in-bearbeitung" | "fertiggestellt" | "abgeholt";
  createdAt: string;
  updatedAt: string;
}

export type ServiceType = "felgen" | "reifen-kaufen" | "reifenservice";

// Database Collection Schema
export interface CustomerCollection {
  $id?: string;

  // Kontaktdaten
  firstName: string;
  lastName: string;
  fullName: string; // firstName + lastName
  street: string;
  houseNumber: string;
  zipCode: string;
  city: string;
  fullAddress: string; // street + houseNumber + zipCode + city
  email: string;
  phone: string;

  // Services
  services: string[]; // Array of selected services

  // Felgen Data (JSON String or separate fields)
  felgenData?: string; // JSON string of felgen object
  felgenAnzahl?: string;
  felgenHatSchlag?: "ja" | "nein";
  felgenAufbereitungsart?: string;
  felgenFarbe?: string;
  felgenAufkleber?: string;

  // Reifen Kaufen Data
  reifenKaufenData?: string; // JSON string
  reifenStueckzahl?: string;
  reifenGroesse?: string;
  reifenEinsatzart?: string;
  reifenHersteller?: string;

  // Reifenservice Data
  reifenServiceData?: string; // JSON string
  montageservice?: string;

  // Combined Notes
  allAnmerkungen?: string; // Combined notes from all sections

  // Meta
  status: "eingegangen" | "in-bearbeitung" | "fertiggestellt" | "abgeholt";
  createdAt: string;
  updatedAt: string;
}

// Helper Functions
export const createCustomerFromForm = (
  formData: CustomerFormData
): CustomerCollection => {
  return {
    // Kontaktdaten
    firstName: formData.firstName,
    lastName: formData.lastName,
    fullName: `${formData.firstName} ${formData.lastName}`,
    street: formData.street,
    houseNumber: formData.houseNumber,
    zipCode: formData.zipCode,
    city: formData.city,
    fullAddress: `${formData.street} ${formData.houseNumber}, ${formData.zipCode} ${formData.city}`,
    email: formData.email,
    phone: formData.phone,

    // Services
    services: formData.selectedServices,

    // Felgen
    felgenData: formData.felgen ? JSON.stringify(formData.felgen) : undefined,
    felgenAnzahl: formData.felgen?.anzahl,
    felgenHatSchlag: formData.felgen?.hatSchlag,
    felgenAufbereitungsart: formData.felgen?.aufbereitungsart,
    felgenFarbe: formData.felgen?.farbe || formData.felgen?.kombination,
    felgenAufkleber: formData.felgen?.aufkleber,

    // Reifen Kaufen
    reifenKaufenData: formData.reifenKaufen
      ? JSON.stringify(formData.reifenKaufen)
      : undefined,
    reifenStueckzahl: formData.reifenKaufen?.stueckzahl,
    reifenGroesse: formData.reifenKaufen?.reifengroesse,
    reifenEinsatzart: formData.reifenKaufen?.einsatzart,
    reifenHersteller:
      formData.reifenKaufen?.herstellerKategorie === "gezielt"
        ? formData.reifenKaufen.gezielterHersteller
        : formData.reifenKaufen?.herstellerKategorie,

    // Reifenservice
    reifenServiceData: formData.reifenService
      ? JSON.stringify(formData.reifenService)
      : undefined,
    montageservice: formData.reifenService?.montageservice,

    // Combined Notes
    allAnmerkungen: [
      formData.felgen?.anmerkungen,
      formData.reifenKaufen?.anmerkungen,
      formData.reifenService?.anmerkungen,
    ]
      .filter(Boolean)
      .join(" | "),

    // Meta
    status: formData.status,
    createdAt: formData.createdAt,
    updatedAt: formData.updatedAt,
  };
};

// Validation Helpers
export const validateFormData = (data: Partial<CustomerFormData>): string[] => {
  const errors: string[] = [];

  // Required contact data
  if (!data.firstName) errors.push("Vorname ist erforderlich");
  if (!data.lastName) errors.push("Nachname ist erforderlich");
  if (!data.email) errors.push("E-Mail ist erforderlich");
  if (!data.phone) errors.push("Telefonnummer ist erforderlich");
  if (!data.street) errors.push("Straße ist erforderlich");
  if (!data.zipCode) errors.push("PLZ ist erforderlich");
  if (!data.city) errors.push("Wohnort ist erforderlich");
  if (!data.agbAccepted) errors.push("AGB müssen akzeptiert werden");

  // At least one service
  if (!data.selectedServices || data.selectedServices.length === 0) {
    errors.push("Mindestens ein Service muss ausgewählt werden");
  }

  // Validate service-specific data
  if (data.selectedServices?.includes("felgen") && data.felgen) {
    if (!data.felgen.anzahl) errors.push("Anzahl Felgen ist erforderlich");
    if (!data.felgen.hatSchlag) errors.push("Schlag-Angabe ist erforderlich");
    if (!data.felgen.aufbereitungsart)
      errors.push("Aufbereitungsart ist erforderlich");
    if (!data.felgen.aufkleber)
      errors.push("Aufkleber-Auswahl ist erforderlich");

    // Conditional validations
    if (data.felgen.hatSchlag === "ja" && !data.felgen.beschaedigteAnzahl) {
      errors.push("Anzahl beschädigter Felgen ist erforderlich");
    }
    if (data.felgen.aufbereitungsart === "einfarbig" && !data.felgen.farbe) {
      errors.push("Farbe ist erforderlich");
    }
    if (
      data.felgen.aufbereitungsart === "zweifarbig" &&
      !data.felgen.kombination
    ) {
      errors.push("Kombination ist erforderlich");
    }
    if (data.felgen.aufkleber === "audi-sport" && !data.felgen.aufkleberFarbe) {
      errors.push("Aufkleber-Farbe ist erforderlich");
    }
  }

  if (data.selectedServices?.includes("reifen-kaufen") && data.reifenKaufen) {
    if (!data.reifenKaufen.stueckzahl)
      errors.push("Stückzahl ist erforderlich");
    if (!data.reifenKaufen.reifengroesse)
      errors.push("Reifengröße ist erforderlich");
    if (!data.reifenKaufen.einsatzart)
      errors.push("Einsatzart ist erforderlich");
    if (!data.reifenKaufen.herstellerKategorie)
      errors.push("Hersteller-Kategorie ist erforderlich");

    if (
      data.reifenKaufen.herstellerKategorie === "gezielt" &&
      !data.reifenKaufen.gezielterHersteller
    ) {
      errors.push("Gezielter Hersteller ist erforderlich");
    }
  }

  if (data.selectedServices?.includes("reifenservice") && data.reifenService) {
    if (!data.reifenService.montageservice)
      errors.push("Montageservice-Beschreibung ist erforderlich");
  }

  return errors;
};
