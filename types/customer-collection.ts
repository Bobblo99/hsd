// types/customer-collection.ts
export interface CustomerCollection {
  $id?: string;

  // contact
  firstName: string;
  lastName: string;
  fullName: string; // firstName + lastName
  street: string;
  houseNumber: string;
  zipCode: string;
  city: string;
  fullAddress: string; // zusammengesetzt
  email: string;
  phone: string;

  // services
  services: string[]; // ["rims", "tire-service", ...]

  // rims
  rimsData?: string; // JSON
  rimsCount?: string;
  rimsHasBent?: "ja" | "nein";
  rimsFinish?: string; // "einfarbig" | ...
  rimsColor?: string; // color oder combination
  rimsSticker?: string; // z.B. "audi-sport"

  // tires purchase
  tiresPurchaseData?: string; // JSON
  tiresQuantity?: string;
  tiresSize?: string;
  tiresUsage?: string; // "sommer" | ...
  tiresBrand?: string; // "gezielt"→targetBrand, sonst Kategorie

  // tire service
  tireServiceData?: string; // JSON
  mountService?: string;

  // combined notes
  allNotes?: string;

  // meta
  status: "eingegangen" | "in-bearbeitung" | "fertiggestellt" | "abgeholt";
  createdAt: string;
  updatedAt: string;
}
