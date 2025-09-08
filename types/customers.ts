export interface Customer {
  $id?: string;
  name: string;
  email: string;
  phone: string;
  rimDamaged: "ja" | "nein";
  repairType: "lackieren" | "polieren" | "schweissen" | "pulverbeschichten";
  damageDescription: string;
  imageIds: string[];
  status: "eingegangen" | "in-bearbeitung" | "fertiggestellt" | "abgeholt";
  createdAt: string;
  updatedAt: string;
}

export interface CustomerStats {
  totalCustomers: number;
  eingegangen: number;
  inBearbeitung: number;
  fertiggestellt: number;
  abgeholt: number;
}
