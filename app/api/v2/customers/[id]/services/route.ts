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
const SERV = process.env.NEXT_PUBLIC_APPWRITE_CUSTOMERS_V2_SERVICES!;
const { Query, ID } = sdk;

// Hilfsfunktion: erst "customer", dann "customerId"
async function safeListByCustomer(databases: any, customerId: string) {
  // 1) Versuche nach "customer"
  try {
    const list = await databases.listDocuments(DB_ID, SERV, [
      Query.equal("customer", customerId),
    ]);
    if (list.total > 0) return list;
    // 2) Wenn keine Treffer, zusätzlich nach "customerId" versuchen (falls beides existiert)
    try {
      const list2 = await databases.listDocuments(DB_ID, SERV, [
        Query.equal("customerId", customerId),
      ]);
      return list2;
    } catch {
      return list; // leere Liste
    }
  } catch (e: any) {
    // 3) Fallback, wenn "customer" Feld nicht existiert
    if (
      e?.type === "general_argument_invalid" ||
      /Attribute not found in schema: customer/i.test(
        String(e?.response?.message || e?.message)
      )
    ) {
      return await databases.listDocuments(DB_ID, SERV, [
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
      { error: err?.message || "List services failed" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const databases = getDatabases();
  try {
    const body = await req.json();
    const base = {
      serviceType: body.serviceType, // "rims" | "tires-purchase" | "tire-service"
      data:
        typeof body.data === "string"
          ? body.data
          : JSON.stringify(body.data || {}),
      status: body.status || "offen",
    };

    // Erst Relation probieren, sonst Fallback
    try {
      const doc = await databases.createDocument(DB_ID, SERV, ID.unique(), {
        ...base,
        customer: params.id,
      });
      return NextResponse.json(doc, { status: 201 });
    } catch (e: any) {
      if (
        e?.type === "document_invalid_structure" ||
        /Unknown attribute: "customer"/i.test(
          String(e?.response?.message || e?.message)
        )
      ) {
        const doc = await databases.createDocument(DB_ID, SERV, ID.unique(), {
          ...base,
          customerId: params.id,
        });
        return NextResponse.json(doc, { status: 201 });
      }
      throw e;
    }
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Create service failed" },
      { status: 500 }
    );
  }
}
