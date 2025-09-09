// /lib/env.ts
export function must(name: string, val?: string) {
  if (!val) throw new Error(`Missing env: ${name}`);
  return val;
}

export const ENV = {
  ENDPOINT: must(
    "APPWRITE_ENDPOINT",
    process.env.APPWRITE_ENDPOINT ?? process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
  ),
  PROJECT_ID: must(
    "APPWRITE_PROJECT_ID",
    process.env.APPWRITE_PROJECT_ID ??
      process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
  ),
  API_KEY: must("APPWRITE_API_KEY", process.env.APPWRITE_API_KEY), // NIEMALS NEXT_PUBLIC

  DB_ID: must(
    "APPWRITE_DATABASE_ID",
    process.env.APPWRITE_DATABASE_ID ??
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID
  ),
  CUST_COL: must(
    "APPWRITE_CUSTOMERS_V2",
    process.env.APPWRITE_CUSTOMERS_V2 ??
      process.env.NEXT_PUBLIC_APPWRITE_CUSTOMERS_V2
  ),
  FILES_COL: must(
    "APPWRITE_CUSTOMERS_V2_FILES",
    process.env.APPWRITE_CUSTOMERS_V2_FILES ??
      process.env.NEXT_PUBLIC_APPWRITE_CUSTOMERS_V2_FILES
  ),

  BUCKET_ID: must(
    "APPWRITE_CUSTOMER_BUCKET_ID",
    process.env.APPWRITE_CUSTOMER_BUCKET_ID ??
      process.env.NEXT_PUBLIC_APPWRITE_CUSTOMER_BUCKET_ID
  ),
  // optional separater Avatar-Bucket (sonst wird BUCKET_ID genutzt)
  AVATAR_BUCKET_ID:
    process.env.APPWRITE_AVATAR_BUCKET_ID ||
    process.env.NEXT_PUBLIC_APPWRITE_AVATAR_BUCKET_ID ||
    "",

  PUBLIC_READ:
    (process.env.APPWRITE_PUBLIC_FILES ?? "true").toLowerCase() === "true",
};
