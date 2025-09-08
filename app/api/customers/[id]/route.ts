import { NextResponse } from "next/server";
import sdk from "node-appwrite";

function getDatabases() {
  const client = new sdk.Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);
  return new sdk.Databases(client);
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const databases = getDatabases();
  const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const collectionId =
    process.env.NEXT_PUBLIC_APPWRITE_CUSTOMERS_COLLECTION_ID!;

  try {
    const doc = await databases.getDocument(dbId, collectionId, params.id);
    return NextResponse.json(doc);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const databases = getDatabases();
  const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const collectionId =
    process.env.NEXT_PUBLIC_APPWRITE_CUSTOMERS_COLLECTION_ID!;

  try {
    const body = await req.json();
    const doc = await databases.updateDocument(dbId, collectionId, params.id, {
      ...body,
      updatedAt: new Date().toISOString(),
    });
    return NextResponse.json(doc);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const databases = getDatabases();
  const dbId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
  const collectionId =
    process.env.NEXT_PUBLIC_APPWRITE_CUSTOMERS_COLLECTION_ID!;

  try {
    await databases.deleteDocument(dbId, collectionId, params.id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
