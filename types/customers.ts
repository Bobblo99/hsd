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
  $createdAt: string;
  $updatedAt: string;

  customerNumber: string;
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

  imageCount: number;
  hasImages: boolean;

  // Meta
  status: CustomerStatus;
}

export type CustomerFilePurpose = "rim" | "invoice" | "profile" | "other";

export interface CustomerFile {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  customer?: string; // wenn Relationship-Attribut verfügbar
  customerId?: string;

  bucketId: string;
  fileId: string;

  purpose?: CustomerFilePurpose;
  order?: number;
  notes?: string;

  previewUrl?: string;
}

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
  imageCount: number;
  hasImages: boolean;
  status: CustomerStatus;
}

export interface CustomerServiceCreateInput {
  customer?: string;
  customerId?: string;
  serviceType: ServiceType;
  data?: string;
  status?: ServiceStatus; // optional
}

export type ImageResource = {
  id: string;
  previewUrl: string;
  viewUrl: string;
  downloadUrl: string;
  purpose?: CustomerFile["purpose"];
  order?: number;
  notes?: string;
};

export type CustomerWithDetails = {
  customer: Customer;
  services: CustomerService[];
  files: CustomerFile[];
  images: ImageResource[];
  imageUrls: string[];
  createdDate: string;
  primaryService?: CustomerService;
  servicesParsed: Array<CustomerService & { dataObj?: any }>;
};
