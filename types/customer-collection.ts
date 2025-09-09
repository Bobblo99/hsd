// types/customer-collection.ts
export interface CustomerCollection {
  // contact
  firstName: string;
  lastName: string;
  fullName: string;
  street: string;
  houseNumber: string;
  zipCode: string;
  city: string;
  fullAddress: string;
  email: string;
  phone: string;

  // services
  services: ("rims" | "tires-purchase" | "tire-service")[];

  // rims (optional)
  rimsData?: string; // JSON string
  rimsCount?: string;
  rimsHasBent?: "ja" | "nein";
  rimsFinish?:
    | "einfarbig"
    | "zweifarbig"
    | "chrom"
    | "smart-repair"
    | "glanzdrehen";
  rimsColor?: string;
  rimsSticker?:
    | "audi-sport"
    | "rs-audi"
    | "m-bmw"
    | "kein-aufkleber"
    | "sonstiges";

  // tires purchase (optional)
  tiresPurchaseData?: string; // JSON string
  tiresQuantity?: string;
  tiresSize?: string;
  tiresUsage?: "sommer" | "winter" | "ganzjahr";
  tiresBrand?: string;

  // tire service (optional)
  tireServiceData?: string; // JSON string
  mountService?: string;

  // notes (combined)
  allNotes?: string;

  // images
  images: File[];
  imageCount: number;
  hasImages: boolean;

  // meta
  status: "eingegangen" | "in-bearbeitung" | "fertiggestellt" | "abgeholt";
  createdAt: string;
  updatedAt: string;
}
