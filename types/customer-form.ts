import { z } from "zod";
import {
  yesNo,
  wheelFinish,
  stickerKind,
  tireUsage,
  brandCategory,
  statusValues,
} from "./enums/enum";

// Contact schema
export const contactSchema = z.object({
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
});

// Rims schema
export const rimsSchema = z.object({
  count: z.string().min(1, "Anzahl Felgen ist erforderlich"),
  hasBent: yesNo,
  damagedCount: z.string().optional(),
  finish: wheelFinish,
  color: z.string().optional(),
  combination: z.string().optional(),
  sticker: stickerKind,
  stickerColor: z.string().optional(),
  notes: z.string().optional(),
});

// Tires purchase schema
export const tiresPurchaseSchema = z.object({
  quantity: z.string().min(1, "Stückzahl ist erforderlich"),
  size: z.string().min(1, "Reifengröße ist erforderlich"),
  usage: tireUsage,
  brandPreference: brandCategory,
  targetBrand: z.string().optional(),
  notes: z.string().optional(),
});

// Tire service schema
export const tireServiceSchema = z.object({
  mountService: z
    .string()
    .min(1, "Montageservice-Beschreibung ist erforderlich"),
  notes: z.string().optional(),
});

// Full customer form schema
export const customerFormSchema = contactSchema.extend({
  selectedServices: z
    .array(z.enum(["rims", "tires-purchase", "tire-service"]))
    .min(1),
  rims: rimsSchema.optional(),
  tiresPurchase: tiresPurchaseSchema.optional(),
  tireService: tireServiceSchema.optional(),
  status: statusValues.default("eingegangen"),
  createdAt: z.string(),
  updatedAt: z.string(),
  photos: z.array(z.instanceof(File)).optional(),
});

export type CustomerFormData = z.infer<typeof customerFormSchema>;
