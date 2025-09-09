import { Client, Account, Databases, Query, Storage } from "appwrite";

const client = new Client();
console.log("Appwrite Endpoint:", process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT);
console.log(
  "Appwrite Project ID:",
  process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
);

client
  .setEndpoint(
    process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "http://localhost:8080/v1"
  )
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "");

let adminDatabases: Databases | null = null;
if (process.env.APPWRITE_API_KEY) {
  const adminClient = new Client()
    .setEndpoint(
      process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "http://localhost:8080/v1"
    )
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "")
    .setJWT(process.env.APPWRITE_API_KEY); // API Key als JWT behandeln

  adminDatabases = new Databases(adminClient);
}

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export { client, Query, adminDatabases };

// Database and Collection IDs
export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";
export const CUSTOMERS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_CUSTOMERS_COLLECTION_ID || "";
export const APPOINTMENTS_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_APPOINTMENTS_COLLECTION_ID || "";
export const AVAILABILITY_COLLECTION_ID =
  process.env.NEXT_PUBLIC_APPWRITE_AVAILABILITY_COLLECTION_ID || "";
export const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || "";
