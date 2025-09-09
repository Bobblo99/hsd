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
const CUST = process.env.NEXT_PUBLIC_APPWRITE_CUSTOMERS_V2!; // "customers"

const ALLOWED_PATCH_FIELDS = new Set([
  // kontakt & adresse
  "firstName",
  "lastName",
  "fullName",
  "street",
  "houseNumber",
  "zipCode",
  "city",
  "fullAddress",
  "email",
  "phone",
  // aggregates
  "imageCount",
  "hasImages",
  // meta
  "status",
]);

function sanitizePatch(payload: Record<string, any>) {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(payload || {})) {
    if (ALLOWED_PATCH_FIELDS.has(k)) out[k] = v;
  }
  return out;
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const databases = getDatabases();
  try {
    const doc = await databases.getDocument(DB_ID, CUST, params.id);
    return NextResponse.json(doc);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to fetch" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const databases = getDatabases();
  try {
    const body = await req.json().catch(() => ({}));
    const data = sanitizePatch(body);

    if (!Object.keys(data).length) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    // Achtung: KEIN createdAt/updatedAt setzen – Appwrite pflegt $updatedAt selbst
    const doc = await databases.updateDocument(DB_ID, CUST, params.id, data);
    return NextResponse.json(doc);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Update failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const databases = getDatabases();
  try {
    await databases.deleteDocument(DB_ID, CUST, params.id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Delete failed" },
      { status: 500 }
    );
  }
}
