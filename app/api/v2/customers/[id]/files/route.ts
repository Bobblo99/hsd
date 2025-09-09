// @ts-nocheck
import { NextResponse } from "next/server";
import sdk from "node-appwrite";
import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import os from "os";
import { randomUUID } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const must = (name: string, val?: string) => {
  if (!val) throw new Error(`Missing env: ${name}`);
  return val;
};
const ENV = {
  ENDPOINT: must(
    "APPWRITE_ENDPOINT",
    process.env.APPWRITE_ENDPOINT ?? process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT
  ),
  PROJECT_ID: must(
    "APPWRITE_PROJECT_ID",
    process.env.APPWRITE_PROJECT_ID ??
      process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID
  ),
  API_KEY: must("APPWRITE_API_KEY", process.env.APPWRITE_API_KEY),
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
  PUBLIC_READ:
    (
      process.env.APPWRITE_PUBLIC_FILES ??
      process.env.NEXT_PUBLIC_APPWRITE_PUBLIC_FILES ??
      "true"
    ).toLowerCase() === "true",
};

const TMP_DIR =
  process.env.APP_TMP_DIR ||
  process.env.TMPDIR ||
  process.env.TEMP ||
  process.env.TMP ||
  os.tmpdir();

function getClients() {
  const client = new sdk.Client()
    .setEndpoint(ENV.ENDPOINT)
    .setProject(ENV.PROJECT_ID)
    .setKey(ENV.API_KEY);
  return {
    sdk,
    databases: new sdk.Databases(client),
    storage: new sdk.Storage(client),
  };
}

function buildFileUrls(bucketId: string, fileId: string) {
  const baseApi = ENV.ENDPOINT.replace(/\/$/, "");
  const b = encodeURIComponent(bucketId);
  const f = encodeURIComponent(fileId);
  const base = `${baseApi}/storage/buckets/${b}/files/${f}`;
  return {
    viewUrl: `${base}/view?project=${ENV.PROJECT_ID}`,
    previewUrl: `${base}/preview?project=${ENV.PROJECT_ID}&width=1600&height=1600&gravity=center&output=jpg&quality=90`,
    downloadUrl: `${base}/download?project=${ENV.PROJECT_ID}`,
  };
}

const mimeToExt: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/avif": "avif",
  "image/heic": "heic",
  "image/heif": "heif",
  "application/pdf": "pdf",
};
const sniffBySig = (buf: Buffer): string | null => {
  const b = buf.subarray(0, 16);
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47)
    return "image/png";
  if (b[0] === 0xff && b[1] === 0xd8) return "image/jpeg";
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) return "image/gif";
  if (
    b.toString("ascii", 0, 4) === "RIFF" &&
    b.toString("ascii", 8, 12) === "WEBP"
  )
    return "image/webp";
  if (b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46)
    return "application/pdf";
  if (b.toString("ascii", 4, 8) === "ftyp") {
    const brand = b.toString("ascii", 8, 12);
    if (brand.includes("avif")) return "image/avif";
    if (brand.includes("heic")) return "image/heic";
    if (brand.includes("heif")) return "image/heif";
  }
  return null;
};
const guessMime = (name: string, buf: Buffer, browserMime?: string) =>
  (browserMime || "").trim() || sniffBySig(buf) || "application/octet-stream";

const forceExt = (name: string, mime: string) => {
  const want = mimeToExt[mime];
  if (!want) return name || "upload.bin";
  const dot = name.lastIndexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name || "upload";
  const cur = dot > 0 ? name.slice(dot + 1).toLowerCase() : "";
  return cur === want ? name : `${base}.${want}`;
};

const sanitizeName = (name: string) =>
  (name || "upload")
    .replace(/[\/\\]/g, "_")
    .replace(/\s+/g, "-")
    .replace(/[^A-Za-z0-9._-]/g, "");

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { databases, sdk } = getClients();
  const { Query } = sdk;
  try {
    let list;
    try {
      list = await databases.listDocuments(ENV.DB_ID, ENV.FILES_COL, [
        Query.equal("customerId", params.id),
        Query.orderAsc("order"),
      ]);
    } catch {
      list = await databases.listDocuments(ENV.DB_ID, ENV.FILES_COL, [
        Query.equal("customerId", params.id),
      ]);
    }
    const documents = list.documents.map((d: any) => ({
      ...d,
      ...buildFileUrls(d.bucketId, d.fileId),
    }));
    return NextResponse.json({ total: list.total, documents });
  } catch (err: any) {
    console.error("GET files failed:", err);
    return NextResponse.json(
      { error: err?.message || "List files failed" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { databases, storage, sdk } = getClients();
  const { ID, InputFile, Permission, Role, Query } = sdk;

  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Invalid content type" },
        { status: 400 }
      );
    }

    const form = await req.formData();
    const files = form.getAll("files") as File[];
    const purpose = (form.get("purpose") as string) || undefined;
    const notes = (form.get("notes") as string) || undefined;

    if (!files.length)
      return NextResponse.json({ error: "No files provided" }, { status: 400 });

    const createdDocs: any[] = [];
    let orderIndex = 0;

    try {
      await fsp.mkdir(TMP_DIR, { recursive: true });
    } catch {}

    for (const file of files) {
      const ab = await file.arrayBuffer();
      const buffer = Buffer.from(ab);

      const browserName = (file as any).name || `upload-${Date.now()}`;
      const browserMime = (file as any).type;
      const mime = guessMime(browserName, buffer, browserMime);
      const finalName = sanitizeName(forceExt(browserName, mime));

      // temp-file with correct extension
      const ext = finalName.includes(".") ? finalName.split(".").pop()! : "bin";
      const tmpPath = path.join(TMP_DIR, `upload-${randomUUID()}.${ext}`);
      await fsp.writeFile(tmpPath, buffer);

      let uploaded;
      try {
        // read from file
        const input =
          typeof (InputFile as any).fromFile === "function"
            ? (InputFile as any).fromFile(tmpPath, finalName /* , mime */)
            : typeof (InputFile as any).fromPath === "function"
            ? (InputFile as any).fromPath(tmpPath, finalName)
            : InputFile.fromBuffer(buffer, finalName, mime); // Fallback

        const permissions = ENV.PUBLIC_READ
          ? [Permission.read(Role.any())]
          : undefined;
        uploaded = await storage.createFile(
          ENV.BUCKET_ID,
          ID.unique(),
          input,
          permissions
        );
      } finally {
        try {
          await fsp.unlink(tmpPath);
        } catch {}
      }

      const payload: Record<string, any> = {
        customerId: params.id,
        bucketId: ENV.BUCKET_ID,
        fileId: uploaded.$id,
        order: orderIndex++,
      };
      if (purpose !== undefined) payload.purpose = purpose;
      if (notes) payload.notes = notes;

      const doc = await databases.createDocument(
        ENV.DB_ID,
        ENV.FILES_COL,
        ID.unique(),
        payload
      );

      //   if (process.env.NODE_ENV !== "production") {
      //     try {
      //       const meta = await storage.getFile(ENV.BUCKET_ID, uploaded.$id);
      //       console.log("Uploaded:", {
      //         name: meta.name,
      //         mimeType: meta.mimeType,
      //         tmpDir: TMP_DIR,
      //       });
      //     } catch {}
      //   }

      createdDocs.push({
        ...doc,
        ...buildFileUrls(ENV.BUCKET_ID, uploaded.$id),
      });
    }

    // aggregate at customer
    const allForCustomer = await databases.listDocuments(
      ENV.DB_ID,
      ENV.FILES_COL,
      [Query.equal("customerId", params.id)]
    );
    await databases.updateDocument(ENV.DB_ID, ENV.CUST_COL, params.id, {
      imageCount: allForCustomer.total,
      hasImages: allForCustomer.total > 0,
    });

    return NextResponse.json(
      { total: createdDocs.length, documents: createdDocs },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("POST upload failed:", err);
    return NextResponse.json(
      { error: err?.message || "Upload failed" },
      { status: 500 }
    );
  }
}
