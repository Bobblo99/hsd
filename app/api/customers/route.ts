import { NextResponse } from "next/server";
import sdk from "node-appwrite";
import { Customer } from "@/types/customers";

function getDatabases() {
  const client = new sdk.Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);
  return new sdk.Databases(client);
}

export async function GET() {
  const databases = getDatabases();
  const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const collectionId =
    process.env.NEXT_PUBLIC_APPWRITE_CUSTOMERS_COLLECTION_ID!;

  try {
    const res = await databases.listDocuments(dbId, collectionId);
    return NextResponse.json(res.documents);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const databases = getDatabases();
  const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const collectionId =
    process.env.NEXT_PUBLIC_APPWRITE_CUSTOMERS_COLLECTION_ID!;

  try {
    const body = await req.json();
    const now = new Date().toISOString();

    const doc = await databases.createDocument(dbId, collectionId, "unique()", {
      ...body,
      createdAt: now,
      updatedAt: now,
    });

    return NextResponse.json(doc);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
