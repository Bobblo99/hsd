// @ts-nocheck
import { NextResponse } from "next/server";
import sdk from "node-appwrite";

function getDatabases() {
  const client = new sdk.Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);
  return new sdk.Databases(client);
}
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const FILES = process.env.NEXT_PUBLIC_APPWRITE_CUSTOMERS_V2_FILES!;
const { Query } = sdk;

async function safeListByCustomer(databases: any, customerId: string) {
  try {
    const list = await databases.listDocuments(DB_ID, FILES, [
      Query.equal("customer", customerId),
    ]);
    if (list.total > 0) return list;
    try {
      const list2 = await databases.listDocuments(DB_ID, FILES, [
        Query.equal("customerId", customerId),
      ]);
      return list2;
    } catch {
      return list; // leere Liste
    }
  } catch (e: any) {
    if (
      e?.type === "general_argument_invalid" ||
      /Attribute not found in schema: customer/i.test(
        String(e?.response?.message || e?.message)
      )
    ) {
      return await databases.listDocuments(DB_ID, FILES, [
        Query.equal("customerId", customerId),
      ]);
    }
    throw e;
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const databases = getDatabases();
  try {
    const list = await safeListByCustomer(databases, params.id);
    return NextResponse.json(list);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "List files failed" },
      { status: 500 }
    );
  }
}
