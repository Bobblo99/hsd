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
const CUST = process.env.NEXT_PUBLIC_APPWRITE_CUSTOMERS_V2!;
const SERV = process.env.NEXT_PUBLIC_APPWRITE_CUSTOMERS_V2_SERVICES!;
const CNTR = process.env.NEXT_PUBLIC_APPWRITE_CUSTOMERS_V2_COUNTERS!;
const { Query, ID } = sdk;

const ALLOWED_CREATE_FIELDS = new Set([
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
  "imageCount",
  "hasImages",
  "status",
]);

function pickCreate(p: Record<string, any>) {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(p || {})) {
    if (ALLOWED_CREATE_FIELDS.has(k)) out[k] = v;
  }
  return out;
}

async function nextCustomerNumber(
  databases: any,
  year = new Date().getFullYear()
) {
  const scope = `customers-${year}`;
  const list = await databases.listDocuments(DB_ID, CNTR, [
    Query.equal("scope", scope),
  ]);
  if (!list.total) {
    const doc = await databases.createDocument(DB_ID, CNTR, ID.unique(), {
      scope,
      last: 1,
    });
    return { number: `C-${year}-000001`, year };
  }
  const current = (list.documents[0].last || 0) + 1;
  await databases.updateDocument(DB_ID, CNTR, list.documents[0].$id, {
    last: current,
  });
  return { number: `C-${year}-${String(current).padStart(6, "0")}`, year };
}

export async function GET(req: Request) {
  const databases = getDatabases();
  const { searchParams } = new URL(req.url);
  const q: any[] = [];

  const status = searchParams.get("status");
  const year = searchParams.get("year");

  if (status) q.push(Query.equal("status", status));
  if (year) q.push(Query.equal("year", Number(year)));

  try {
    // 1. Kunden laden
    const customersRes = await databases.listDocuments(DB_ID, CUST, q);
    const customers = customersRes.documents;

    // 2. Alle Services laden
    const servicesRes = await databases.listDocuments(DB_ID, SERV);
    const services = servicesRes.documents;

    // 3. Services nach customer/customerId gruppieren
    const grouped: Record<string, any[]> = {};
    for (const s of services) {
      const cid = s.customer || s.customerId;
      if (!cid) continue;
      if (!grouped[cid]) grouped[cid] = [];
      grouped[cid].push(s);
    }

    // 4. Kunden + Services kombinieren
    const full = customers.map((c) => ({
      ...c,
      services: grouped[c.$id] || [],
    }));

    return NextResponse.json({ total: full.length, documents: full });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "List failed" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const databases = getDatabases();
  try {
    const payload = await req.json().catch(() => ({}));
    const base = pickCreate(payload);

    // Defaults
    if (typeof base.imageCount !== "number") base.imageCount = 0;
    if (typeof base.hasImages !== "boolean") base.hasImages = false;
    if (!base.status) base.status = "eingegangen";

    const { number, year } = await nextCustomerNumber(databases);

    const doc = await databases.createDocument(DB_ID, CUST, ID.unique(), {
      ...base,
      customerNumber: number,
      year,
    });

    return NextResponse.json(doc, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Create failed" },
      { status: 500 }
    );
  }
}
