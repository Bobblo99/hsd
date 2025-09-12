
import { z } from "zod";

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
