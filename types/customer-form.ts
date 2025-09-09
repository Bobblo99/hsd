// types/customer-form.ts
import { z } from "zod";

/** Deutsche Values für Auswahllisten */
export const yesNo = z.enum(["ja", "nein"]);
export const repairTypes = z.enum([
  "lackieren",
  "polieren",
  "schweissen",
  "pulverbeschichten",
]);
export const statusValues = z.enum([
  "eingegangen",
  "in-bearbeitung",
  "fertiggestellt",
  "abgeholt",
]);
export const wheelFinish = z.enum([
  "einfarbig",
  "zweifarbig",
  "chrom",
  "smart-repair",
  "glanzdrehen",
]);
export const tireUsage = z.enum(["sommer", "winter", "ganzjahr"]);
export const brandCategory = z.enum([
  "premium",
  "basic",
  "low-budget",
  "gezielt",
]);
export const stickerKind = z.enum([
  "audi-sport",
  "rs-audi",
  "m-bmw",
  "kein-aufkleber",
  "sonstiges",
]);

export type ServiceType = "rims" | "tires-purchase" | "tire-service";

/** Formdaten (UI) – englische Keys, deutsche Values */
export const customerFormSchema = z.object({
  // contact
  firstName: z.string().min(1, "Vorname ist erforderlich"),
  lastName: z.string().min(1, "Nachname ist erforderlich"),
  street: z.string().min(1, "Straße ist erforderlich"),
  houseNumber: z.string().min(1, "Hausnummer ist erforderlich"),
  zipCode: z.string().min(1, "PLZ ist erforderlich"),
  city: z.string().min(1, "Ort ist erforderlich"),
  email: z.string().email("Bitte gültige E-Mail angeben"),
  phone: z.string().min(3, "Telefon ist erforderlich"),
  agbAccepted: z
    .boolean()
    .refine((v) => v === true, "AGB müssen akzeptiert werden"),

  // services
  selectedServices: z
    .array(z.enum(["rims", "tires-purchase", "tire-service"]))
    .min(1, "Mindestens ein Service muss ausgewählt werden"),

  // rims (optional)
  rims: z
    .object({
      count: z.string().min(1, "Anzahl Felgen ist erforderlich"),
      hasBent: yesNo, // "ja" | "nein"
      damagedCount: z.string().optional(), // nur bei ja
      finish: wheelFinish, // "einfarbig" | ...
      color: z.string().optional(), // nur bei einfarbig
      combination: z.string().optional(), // nur bei zweifarbig
      sticker: stickerKind,
      stickerColor: z.string().optional(), // nur bei audi-sport
      notes: z.string().optional(),
    })
    .optional(),

  // tires purchase (optional)
  tiresPurchase: z
    .object({
      quantity: z.string().min(1, "Stückzahl ist erforderlich"),
      size: z.string().min(1, "Reifengröße ist erforderlich"),
      usage: tireUsage,
      brandPreference: brandCategory,
      targetBrand: z.string().optional(), // nur bei gezielt
      notes: z.string().optional(),
    })
    .optional(),

  // tire service (optional)
  tireService: z
    .object({
      mountService: z
        .string()
        .min(1, "Montageservice-Beschreibung ist erforderlich"),
      notes: z.string().optional(),
    })
    .optional(),

  // meta
  status: statusValues.default("eingegangen"),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CustomerFormData = z.infer<typeof customerFormSchema>;
