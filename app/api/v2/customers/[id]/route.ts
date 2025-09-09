// @ts-nocheck
import { NextResponse } from "next/server";
import sdk from "node-appwrite";

export const runtime = "nodejs";

function getClients() {
  const client = new sdk.Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!)
    .setKey(process.env.APPWRITE_API_KEY!);

  return {
    databases: new sdk.Databases(client),
    storage: new sdk.Storage(client),
  };
}

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const CUST_COL = process.env.NEXT_PUBLIC_APPWRITE_CUSTOMERS_V2!;
const SERV_COL = process.env.NEXT_PUBLIC_APPWRITE_CUSTOMERS_V2_SERVICES!;
const FILES_COL = process.env.NEXT_PUBLIC_APPWRITE_CUSTOMERS_V2_FILES!;

const ALLOWED_PATCH_FIELDS = new Set([
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

function sanitizePatch(payload: Record<string, any>) {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(payload || {})) {
    if (ALLOWED_PATCH_FIELDS.has(k)) out[k] = v;
  }
  return out;
}

async function listChildrenByCustomer(
  databases: sdk.Databases,
  colId: string,
  id: string
) {
  try {
    const rel = await databases.listDocuments(DB_ID, colId, [
      sdk.Query.equal("customer", id),
    ]);
    if (rel.total) return rel;
  } catch {}
  return databases.listDocuments(DB_ID, colId, [
    sdk.Query.equal("customerId", id),
  ]);
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { databases, storage } = getClients();
  const id = params.id;

  try {
    const customer = await databases.getDocument(DB_ID, CUST_COL, id);

    const services = await listChildrenByCustomer(databases, SERV_COL, id);
    const files = await listChildrenByCustomer(databases, FILES_COL, id);

    const filesEnriched = await Promise.all(
      files.documents.map(async (d: any) => {
        const bucketId = d.bucketId;
        const fileId = d.fileId;
        let previewUrl: string | null = null;
        let viewUrl: string | null = null;
        let downloadUrl: string | null = null;

        try {
          previewUrl = storage.getFilePreview(
            bucketId,
            fileId
          ) as unknown as string;
        } catch {}
        try {
          viewUrl = storage.getFileView(bucketId, fileId) as unknown as string;
        } catch {}
        try {
          downloadUrl = storage.getFileDownload(
            bucketId,
            fileId
          ) as unknown as string;
        } catch {}

        return { ...d, previewUrl, viewUrl, downloadUrl };
      })
    );

    const images = filesEnriched
      .map((f: any) => f.previewUrl || f.viewUrl || null)
      .filter(Boolean);

    return NextResponse.json({
      customer,
      services: services.documents,
      files: filesEnriched,
      images,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to fetch customer" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { databases } = getClients();
  const id = params.id;

  try {
    const body = await req.json().catch(() => ({}));
    const data = sanitizePatch(body);
    if (!Object.keys(data).length) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const doc = await databases.updateDocument(DB_ID, CUST_COL, id, data);
    return NextResponse.json(doc);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Update failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { databases, storage } = getClients();
  const id = params.id;

  try {
    try {
      await databases.getDocument(DB_ID, CUST_COL, id);
    } catch {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }

    const services = await listChildrenByCustomer(databases, SERV_COL, id);
    const serviceResults = await Promise.allSettled(
      services.documents.map((d: any) =>
        databases.deleteDocument(DB_ID, SERV_COL, d.$id)
      )
    );

    const files = await listChildrenByCustomer(databases, FILES_COL, id);
    const fileResults = await Promise.allSettled(
      files.documents.map(async (d: any) => {
        const bucketId = d.bucketId;
        const fileId = d.fileId;
        try {
          if (bucketId && fileId) {
            await storage.deleteFile(bucketId, fileId);
          }
        } catch {}
        await databases.deleteDocument(DB_ID, FILES_COL, d.$id);
      })
    );

    await databases.deleteDocument(DB_ID, CUST_COL, id);

    return NextResponse.json({
      success: true,
      deleted: {
        services: {
          requested: services.total,
          ok: serviceResults.filter((r) => r.status === "fulfilled").length,
          failed: serviceResults.filter((r) => r.status === "rejected").length,
        },
        files: {
          requested: files.total,
          ok: fileResults.filter((r) => r.status === "fulfilled").length,
          failed: fileResults.filter((r) => r.status === "rejected").length,
        },
        customer: id,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Delete failed" },
      { status: 500 }
    );
  }
}
