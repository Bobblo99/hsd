// export interface Customer {
//   $id?: string;
//   name: string;
//   email: string;
//   phone: string;
//   rimDamaged: "ja" | "nein";
//   repairType: "lackieren" | "polieren" | "schweissen" | "pulverbeschichten";
//   damageDescription: string;
//   imageIds: string[];
//   status: "eingegangen" | "in-bearbeitung" | "fertiggestellt" | "abgeholt";
//   createdAt: string;
//   updatedAt: string;
// }

export interface CustomerStats {
  totalCustomers: number;
  eingegangen: number;
  inBearbeitung: number;
  fertiggestellt: number;
  abgeholt: number;
}

export type CustomerStatus =
  | "eingegangen"
  | "in-bearbeitung"
  | "fertiggestellt"
  | "abgeholt";

export interface Customer {
  $id: string;
  $createdAt: string; // Systemfeld von Appwrite
  $updatedAt: string; // Systemfeld von Appwrite

  // Identität / Nummerierung
  customerNumber: string; // unique
  year: number;

  // Kontakt & Adresse
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

  // Aggregates (aus customerFiles)
  imageCount: number; // default 0
  hasImages: boolean; // default false

  // Meta
  status: CustomerStatus;
}

// -------- Dateien eines Kunden (customerFiles) --------

export type CustomerFilePurpose = "rim" | "invoice" | "profile" | "other";

export interface CustomerFile {
  $id: string;
  $createdAt: string;
  $updatedAt: string;

  // Entweder echte Relation (customer) ODER Fallback (customerId):
  customer?: string; // wenn Relationship-Attribut verfügbar
  customerId?: string; // Fallback: string-Feld

  bucketId: string;
  fileId: string;

  purpose?: CustomerFilePurpose;
  order?: number;
  notes?: string;

  // Praktisch für den Client: precomputed Preview-URL (nicht in DB)
  previewUrl?: string;
}

// -------- Services eines Kunden (customerServices) --------

export type ServiceType = "rims" | "tires-purchase" | "tire-service";
export type ServiceStatus = "offen" | "in-bearbeitung" | "fertig" | "storniert";

export interface CustomerService {
  $id: string;
  $createdAt: string;
  $updatedAt: string;

  customer?: string; // wenn Relationship-Attribut verfügbar
  customerId?: string; // Fallback

  serviceType: ServiceType;

  data?: string;

  status?: ServiceStatus;
}

export interface CustomerCreateInput {
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
  imageCount: number; // start: 0
  hasImages: boolean; // start: false
  status: CustomerStatus;
}

export interface CustomerServiceCreateInput {
  // entweder customer (Relation) ODER customerId (Fallback-String) – beim Create füllst du das nach dem Customer-Create
  customer?: string;
  customerId?: string;
  serviceType: ServiceType;
  data?: string; // JSON.stringify(...)
  status?: ServiceStatus; // optional
}
