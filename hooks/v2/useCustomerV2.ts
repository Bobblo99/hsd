import { useQuery } from "@tanstack/react-query";
import type {
  Customer,
  CustomerFile,
  CustomerService,
  CustomerWithDetails,
  ImageResource,
} from "@/types/customers";

type ListResponse<T> = {
  total: number;
  documents: T[];
};

function parseJSON<T = unknown>(s?: string): T | undefined {
  if (!s) return undefined;
  try {
    return JSON.parse(s) as T;
  } catch {
    return undefined;
  }
}

function extractImages(customer: any, files: CustomerFile[]): ImageResource[] {
  const fromFiles: ImageResource[] =
    files?.map((f) => ({
      id: f.$id,
      previewUrl: (f as any).previewUrl,
      viewUrl: (f as any).viewUrl,
      downloadUrl: (f as any).downloadUrl,
      purpose: f.purpose,
      order: f.order,
      notes: f.notes,
    })) ?? [];

  const legacyList: ImageResource[] = Array.isArray((customer as any).imageIds)
    ? (customer as any).imageIds
        .filter(Boolean)
        .map((url: string, i: number) => ({
          id: `legacy-${i}`,
          previewUrl: url,
          viewUrl: url,
          downloadUrl: url,
        }))
    : [];

  return [...fromFiles, ...legacyList].sort(
    (a, b) =>
      (a.order ?? Number.MAX_SAFE_INTEGER) -
      (b.order ?? Number.MAX_SAFE_INTEGER)
  );
}

export function useCustomerV2(customerId: string) {
  return useQuery<CustomerWithDetails>({
    queryKey: ["customerV2", customerId],
    enabled: !!customerId,
    queryFn: async () => {
      // alles parallel holen
      const [cRes, sRes, fRes] = await Promise.all([
        fetch(`/api/v2/customers/${customerId}`, { cache: "no-store" }),
        fetch(`/api/v2/customers/${customerId}/services`, {
          cache: "no-store",
        }),
        fetch(`/api/v2/customers/${customerId}/files`, { cache: "no-store" }),
      ]);

      if (!cRes.ok) throw new Error(`Failed to fetch customer ${customerId}`);
      if (!sRes.ok)
        throw new Error(`Failed to fetch services for ${customerId}`);
      if (!fRes.ok) throw new Error(`Failed to fetch files for ${customerId}`);

      // Der Customer-GET hatte bei dir zeitweise verschiedene Shapes ⇒ defensiv extrahieren
      const raw = await cRes.json();
      const customer: Customer = raw?.$id
        ? raw
        : raw?.customer?.$id
        ? raw.customer
        : raw?.customer?.customer?.$id
        ? raw.customer.customer
        : (() => {
            throw new Error("Unexpected customer response shape");
          })();

      // Services
      const sJson = (await sRes.json()) as
        | ListResponse<CustomerService>
        | CustomerService[];
      const services = Array.isArray((sJson as any)?.documents)
        ? (sJson as ListResponse<CustomerService>).documents
        : (sJson as CustomerService[]);

      // Files (mit URLs aus der API-Route angereichert)
      const fJson = (await fRes.json()) as
        | ListResponse<CustomerFile>
        | CustomerFile[];
      const files = Array.isArray((fJson as any)?.documents)
        ? (fJson as ListResponse<CustomerFile>).documents
        : (fJson as CustomerFile[]);

      // Bilder ableiten
      const images = extractImages(customer, files);
      const imageUrls = images.map((i) => i.previewUrl);

      // weitere Derivate
      const createdDate = customer.$createdAt
        ? new Date(customer.$createdAt).toLocaleDateString("de-DE")
        : "-";
      const primaryService = services[0];
      const servicesParsed = services.map((s) => ({
        ...s,
        dataObj: parseJSON(s.data),
      }));

      return {
        customer,
        services,
        files,
        images,
        imageUrls,
        createdDate,
        primaryService,
        servicesParsed,
      };
    },
    staleTime: 30_000,
  });
}
