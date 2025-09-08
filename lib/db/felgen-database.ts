import { Customer, CustomerStats } from "@/types/customers";
import { DATABASE_ID, CUSTOMERS_COLLECTION_ID, storage } from "../appwrite";
import { ID, Query } from "appwrite";

import { databases, BUCKET_ID } from "../appwrite";

const mapToCustomer = (doc: any): Customer => ({
  $id: doc.$id,
  name: doc.name,
  email: doc.email,
  phone: doc.phone,
  rimDamaged: doc.felgeBeschaedigt,
  repairType: doc.reparaturArt,
  damageDescription: doc.schadensBeschreibung,
  imageIds: doc.bildIds || [],
  status: doc.status,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

export const createCustomer = async (
  customer: Omit<Customer, "$id" | "createdAt" | "updatedAt">
): Promise<Customer> => {
  const now = new Date().toISOString();
  const newCustomer = {
    ...customer,
    createdAt: now,
    updatedAt: now,
  };

  const doc = await databases.createDocument(
    DATABASE_ID,
    CUSTOMERS_COLLECTION_ID,
    ID.unique(),
    newCustomer
  );
  return mapToCustomer(doc);
};

// LIST
export const getCustomers = async (
  filter?:
    | "all"
    | "eingegangen"
    | "in-bearbeitung"
    | "fertiggestellt"
    | "abgeholt"
): Promise<Customer[]> => {
  try {
    const queries: any[] = [Query.orderDesc("createdAt")];
    if (filter && filter !== "all") queries.push(Query.equal("status", filter));

    const res = await databases.listDocuments(
      DATABASE_ID,
      CUSTOMERS_COLLECTION_ID,
      queries
    );
    return res.documents.map(mapToCustomer);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
};

// GET SINGLE
export const getCustomer = async (id: string): Promise<Customer> => {
  const doc = await databases.getDocument(
    DATABASE_ID,
    CUSTOMERS_COLLECTION_ID,
    id
  );
  return mapToCustomer(doc);
};

// UPDATE
export const updateCustomer = async (
  id: string,
  updates: Partial<Customer>
): Promise<Customer> => {
  const doc = await databases.updateDocument(
    DATABASE_ID,
    CUSTOMERS_COLLECTION_ID,
    id,
    {
      ...updates,
      updatedAt: new Date().toISOString(),
    }
  );
  return mapToCustomer(doc);
};

// DELETE
export const deleteCustomer = async (id: string): Promise<void> => {
  await databases.deleteDocument(DATABASE_ID, CUSTOMERS_COLLECTION_ID, id);
};

// File Upload
export const uploadImage = async (file: File): Promise<string> => {
  const res = await storage.createFile(BUCKET_ID, ID.unique(), file);
  return res.$id;
};

export const getImageUrl = (fileId: string): string => {
  return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
};

export const deleteImage = async (fileId: string): Promise<void> => {
  await storage.deleteFile(BUCKET_ID, fileId);
};

// Statistics
export const getCustomerStats = async (): Promise<CustomerStats> => {
  try {
    const [total, eingegangen, inBearbeitung, fertiggestellt, abgeholt] =
      await Promise.all([
        databases.listDocuments(DATABASE_ID, CUSTOMERS_COLLECTION_ID),
        databases.listDocuments(DATABASE_ID, CUSTOMERS_COLLECTION_ID, [
          Query.equal("status", "eingegangen"),
        ]),
        databases.listDocuments(DATABASE_ID, CUSTOMERS_COLLECTION_ID, [
          Query.equal("status", "in-bearbeitung"),
        ]),
        databases.listDocuments(DATABASE_ID, CUSTOMERS_COLLECTION_ID, [
          Query.equal("status", "fertiggestellt"),
        ]),
        databases.listDocuments(DATABASE_ID, CUSTOMERS_COLLECTION_ID, [
          Query.equal("status", "abgeholt"),
        ]),
      ]);

    return {
      totalCustomers: total.total,
      eingegangen: eingegangen.total,
      inBearbeitung: inBearbeitung.total,
      fertiggestellt: fertiggestellt.total,
      abgeholt: abgeholt.total,
    };
  } catch (error) {
    console.error("Error fetching customer stats:", error);
    return {
      totalCustomers: 0,
      eingegangen: 0,
      inBearbeitung: 0,
      fertiggestellt: 0,
      abgeholt: 0,
    };
  }
};

// Export to CSV
export const exportCustomersToCSV = (customers: Customer[]): string => {
  const headers = [
    "Name",
    "E-Mail",
    "Telefon",
    "Felge beschädigt",
    "Reparatur Art",
    "Beschreibung",
    "Status",
    "Erstellt am",
    "Aktualisiert am",
  ];

  const csvContent = [
    headers.join(","),
    ...customers.map((c) =>
      [
        `"${c.name}"`,
        `"${c.email}"`,
        `"${c.phone}"`,
        `"${c.rimDamaged}"`,
        `"${c.repairType}"`,
        `"${c.damageDescription.replace(/"/g, '""')}"`,
        `"${c.status}"`,
        `"${new Date(c.createdAt).toLocaleDateString("de-DE")}"`,
        `"${new Date(c.updatedAt).toLocaleDateString("de-DE")}"`,
      ].join(",")
    ),
  ].join("\n");

  return csvContent;
};
