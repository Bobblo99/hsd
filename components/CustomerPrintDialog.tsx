"use client";

import * as React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Printer,
  FileDown,
  Settings,
  Image as ImageIcon,
  User,
  Phone,
  Mail,
  Calendar,
  Wrench,
  QrCode,
} from "lucide-react";
import { Customer } from "@/types/customers";

interface CustomerPrintDialogProps {
  customer: Customer;
}

interface PrintOptions {
  kundenInfo: boolean;
  serviceDetails: boolean;
  beschreibung: boolean;
  bilder: boolean;
  qrCode: boolean;
}

interface ImageSelection {
  [key: string]: boolean;
}

/** ---------- Helpers to keep UI intact with new schema ---------- */
function safeName(c: any) {
  return (
    c?.fullName ||
    c?.name ||
    [c?.firstName, c?.lastName].filter(Boolean).join(" ") ||
    "Unbekannt"
  );
}
function safeCreatedAt(c: any) {
  // Appwrite system fields first
  const raw = c?.$createdAt || c?.createdAt;
  try {
    return raw ? new Date(raw).toLocaleDateString("de-DE") : "-";
  } catch {
    return "-";
  }
}
function safeDescription(c: any) {
  // Old field, or aggregated notes if present
  return c?.damageDescription || c?.allNotes || "";
}
function safeRepairType(c: any) {
  // In neuem Modell liegen Details in customerServices; falls nicht mitgeladen, fallback:
  return c?.repairType || c?.rimsFinish || c?.primaryService || "-";
}
function safeRimDamaged(c: any): "ja" | "nein" | "-" {
  const v = c?.rimDamaged ?? c?.rimsHasBent;
  if (v === "ja" || v === "nein") return v;
  return "-";
}
function extractImageUrls(c: any): string[] {
  // Prefer already-resolved URLs
  const fromIds = Array.isArray(c?.imageIds) ? c.imageIds : [];
  const fromImages = Array.isArray(c?.images) ? c.images : [];
  const fromFiles = Array.isArray(c?.files)
    ? c.files.map((f: any) => f?.previewUrl || f?.url || f).filter(Boolean)
    : [];

  // Flatten to strings
  const asStrings = [...fromIds, ...fromImages, ...fromFiles]
    .filter(Boolean)
    .map((x: any) => String(x));

  return asStrings;
}
/** -------------------------------------------------------------- */

const CustomerPrintContent = React.forwardRef<
  HTMLDivElement,
  { customer: Customer; options: PrintOptions; selectedImages: string[] }
>(({ customer, options, selectedImages }, ref) => {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      eingegangen: "#f59e0b",
      "in-bearbeitung": "#3b82f6",
      fertiggestellt: "#10b981",
      abgeholt: "#6b7280",
    };
    return colors[status] || "#6b7280";
  };

  return (
    <div
      ref={ref}
      className="w-[297mm] h-[210mm] bg-white text-black p-6 font-sans text-sm print:p-4"
      style={{
        pageBreakAfter: "always",
        minHeight: "210mm",
        maxHeight: "210mm",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-red-500">
        <div>
          <h1 className="text-3xl font-bold text-red-600 mb-2">HSD GmbH</h1>
          <p className="text-lg text-gray-600">
            Felgenaufbereitung • Lagersystem
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold mb-2">
            AUFTRAG #{customer?.$id?.slice(-6) || "N/A"}
          </div>
          <div className="text-sm text-gray-600">
            Erstellt: {safeCreatedAt(customer)}
          </div>
          <div
            className="inline-block px-3 py-1 rounded-full text-white font-semibold mt-2"
            style={{ backgroundColor: getStatusColor(customer?.status) }}
          >
            {(customer?.status || "-")
              .toString()
              .toUpperCase()
              .replace("-", " ")}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 h-[calc(100%-120px)]">
        {/* Linke Spalte - Kundeninfo & Service */}
        <div className="col-span-5 space-y-4">
          {options.kundenInfo && (
            <div className="bg-gray-50 p-4 rounded-lg border">
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                <User className="h-5 w-5 text-red-500" />
                KUNDENDATEN
              </h2>
              <div className="space-y-2">
                <div className="text-xl font-bold">{safeName(customer)}</div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  {customer?.email || "-"}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-500" />
                  {customer?.phone || "-"}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  {safeCreatedAt(customer)}
                </div>
              </div>
            </div>
          )}

          {options.serviceDetails && (
            <div className="bg-blue-50 p-4 rounded-lg border">
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Wrench className="h-5 w-5 text-blue-500" />
                SERVICE DETAILS
              </h2>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold">Reparatur:</span>{" "}
                  {safeRepairType(customer)}
                </div>
                <div>
                  <span className="font-semibold">Beschädigt:</span>
                  {(() => {
                    const rd = safeRimDamaged(customer);
                    if (rd === "-") return <span className="ml-2">-</span>;
                    const isJa = rd === "ja";
                    return (
                      <span
                        className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                          isJa
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {isJa ? "JA" : "NEIN"}
                      </span>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {options.qrCode && (
            <div className="bg-gray-50 p-4 rounded-lg border text-center">
              <QrCode className="h-16 w-16 mx-auto mb-2 text-gray-400" />
              <div className="text-xs text-gray-600">QR-Code Platzhalter</div>
            </div>
          )}
        </div>

        {/* Mittlere Spalte - Beschreibung */}
        <div className="col-span-3">
          {options.beschreibung && (
            <div className="bg-gray-50 p-4 rounded-lg border h-full">
              <h2 className="text-lg font-bold mb-3">SCHADENSBESCHREIBUNG</h2>
              <div className="text-sm leading-relaxed h-[calc(100%-40px)] overflow-hidden">
                {safeDescription(customer) || "Keine Beschreibung vorhanden"}
              </div>
            </div>
          )}
        </div>

        {/* Rechte Spalte - Bilder */}
        <div className="col-span-4">
          {options.bilder && selectedImages.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg border h-full">
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-green-500" />
                BILDER ({selectedImages.length})
              </h2>
              <div className="grid grid-cols-2 gap-2 h-[calc(100%-40px)]">
                {selectedImages.slice(0, 4).map((img, i) => (
                  <div
                    key={i}
                    className="relative bg-white border rounded overflow-hidden"
                  >
                    <img
                      src={img}
                      alt={`Bild ${i + 1}`}
                      className="w-full h-full object-cover"
                      style={{ maxHeight: "120px" }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center">
                      Bild {i + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-6 right-6 flex justify-between items-center text-xs text-gray-500 border-t pt-2">
        <div>HSD GmbH • Handel • Service • Dienstleistung</div>
        <div>Gedruckt am: {new Date().toLocaleString("de-DE")}</div>
      </div>
    </div>
  );
});
CustomerPrintContent.displayName = "CustomerPrintContent";

export function CustomerPrintDialog({ customer }: CustomerPrintDialogProps) {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<PrintOptions>({
    kundenInfo: true,
    serviceDetails: true,
    beschreibung: true,
    bilder: true,
    qrCode: false,
  });

  // ---- robust: Bildquellen aus neuem/alten Schema extrahieren ----
  const allImageUrls = React.useMemo(
    () => extractImageUrls(customer),
    [customer]
  );

  const [imageSelection, setImageSelection] = useState<ImageSelection>(() => {
    const initial: ImageSelection = {};
    allImageUrls.slice(0, 4).forEach((url, index) => {
      initial[url] = index < 2; // erste 2 standardmäßig
    });
    return initial;
  });

  const componentRef = React.useRef<HTMLDivElement>(null);
  const selectedImages = allImageUrls.filter((u) => imageSelection[u]);

  const handlePrint = () => {
    if (!componentRef.current) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Kunde ${safeName(customer)} - Druckvorlage</title>
          <style>
            @page { size: A4 landscape; margin: 0; }
            body { margin: 0; font-family: Arial, sans-serif; }
            @media print { body { -webkit-print-color-adjust: exact; } }
          </style>
        </head>
        <body>
          ${componentRef.current.outerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handlePDF = async () => {
    if (!componentRef.current) return;
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const opts = {
        margin: 0,
        filename: `kunde-${(safeName(customer) || "Unbekannt")
          .replace(/\s+/g, "-")
          .toLowerCase()}-${new Date().toISOString().split("T")[0]}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          allowTaint: true,
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "landscape" },
      };
      html2pdf().set(opts).from(componentRef.current).save();
    } catch (error) {
      console.error("PDF Export Error:", error);
    }
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="bg-white/5 border-white/20 text-white hover:bg-white/10"
      >
        <Printer className="h-4 w-4 mr-2" />
        Drucken / PDF
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Settings className="h-5 w-5 text-red-500" />
              Druckoptionen - Querformat A4
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Inhalt */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Inhalt auswählen
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(options).map(([key, value]) => {
                  const labels: Record<string, string> = {
                    kundenInfo: "Kundendaten",
                    serviceDetails: "Service Details",
                    beschreibung: "Schadensbeschreibung",
                    bilder: "Bilder",
                    qrCode: "QR-Code",
                  };
                  return (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={value}
                        onCheckedChange={(checked) =>
                          setOptions((prev) => ({ ...prev, [key]: !!checked }))
                        }
                        className="border-white/20"
                      />
                      <Label
                        htmlFor={key}
                        className="text-gray-300 cursor-pointer"
                      >
                        {labels[key] || key}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator className="bg-white/10" />

            {/* Bildauswahl */}
            {options.bilder && allImageUrls.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Bilder auswählen (max. 4)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {allImageUrls.slice(0, 6).map((img, i) => (
                    <div key={img} className="relative">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`img-${i}`}
                          checked={!!imageSelection[img]}
                          onCheckedChange={(checked) => {
                            const selectedCount =
                              Object.values(imageSelection).filter(
                                Boolean
                              ).length;
                            if (checked && selectedCount >= 4) return;
                            setImageSelection((prev) => ({
                              ...prev,
                              [img]: !!checked,
                            }));
                          }}
                          disabled={
                            !imageSelection[img] &&
                            Object.values(imageSelection).filter(Boolean)
                              .length >= 4
                          }
                          className="border-white/20"
                        />
                        <Label
                          htmlFor={`img-${i}`}
                          className="text-gray-300 cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={img}
                              alt={`Bild ${i + 1}`}
                              className="w-12 h-12 object-cover rounded border border-white/20"
                            />
                            <span>Bild {i + 1}</span>
                          </div>
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  {Object.values(imageSelection).filter(Boolean).length} von 4
                  Bildern ausgewählt
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-3">
            <Button
              onClick={() => {
                setOpen(false);
                setTimeout(handlePrint, 100);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Printer className="h-4 w-4 mr-2" />
              Drucken
            </Button>
            <Button
              onClick={() => {
                setOpen(false);
                setTimeout(handlePDF, 100);
              }}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <FileDown className="h-4 w-4 mr-2" />
              PDF Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Hidden Print Content */}
      <div className="fixed left-[-9999px] top-0">
        <CustomerPrintContent
          ref={componentRef}
          customer={customer}
          options={options}
          selectedImages={selectedImages}
        />
      </div>
    </>
  );
}
