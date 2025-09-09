import { useMutation, useQueryClient } from "@tanstack/react-query";

type UploadInput = {
  customerId: string;
  files: File[];
  purpose?: "rim" | "invoice" | "profile" | "other";
  notes?: string;
};

type UploadResponse = {
  total: number;
  documents: Array<{
    $id: string;
    bucketId: string;
    fileId: string;
    purpose?: string;
    order?: number;
    notes?: string;
  }>;
};

export function useUploadCustomerFilesV2() {
  const qc = useQueryClient();

  return useMutation<UploadResponse, Error, UploadInput>({
    mutationFn: async ({ customerId, files, purpose = "other", notes }) => {
      const form = new FormData();
      files.forEach((f) => form.append("files", f));
      form.append("purpose", purpose);
      if (notes) form.append("notes", notes);

      const res = await fetch(`/api/v2/customers/${customerId}/files`, {
        method: "POST",
        body: form,
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Upload failed");
      }
      return res.json();
    },
    onSuccess: (_data, { customerId }) => {
      qc.invalidateQueries({ queryKey: ["customerV2", customerId] });
      qc.invalidateQueries({ queryKey: ["customersV2"] });
    },
  });
}
