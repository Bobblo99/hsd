// /lib/mime.ts
export const mimeToExt: Record<string, string> = {
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

export function sniffMimeBySignature(buf: Buffer): string | null {
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
}

export function guessMime(filename: string, buf: Buffer, browserMime?: string) {
  const t = (browserMime || "").trim();
  if (t) return t;
  return sniffMimeBySignature(buf) || "application/octet-stream";
}

export function ensureExtensionForMime(originalName: string, mime: string) {
  const wantExt = mimeToExt[mime];
  if (!wantExt) return originalName || "upload.bin";
  const dot = originalName.lastIndexOf(".");
  const base = dot > 0 ? originalName.slice(0, dot) : originalName || "upload";
  const curExt = dot > 0 ? originalName.slice(dot + 1).toLowerCase() : "";
  return curExt === wantExt ? originalName : `${base}.${wantExt}`;
}

export function parseDataUrlToBuffer(dataUrl: string) {
  const m = dataUrl.match(/^data:(.+);base64,(.*)$/i);
  if (!m) throw new Error("Invalid data URL");
  const mime = m[1];
  const base64 = m[2];
  const buffer = Buffer.from(base64, "base64");
  return { mime, buffer };
}
