import { Customer, CustomerFile, CustomerService } from "@/types/customers";
import { useQuery } from "@tanstack/react-query";

type ListResponse<T> = {
  total: number;
  documents: T[];
};

// kleine Helfer
function parseJSON<T = unknown>(s?: string): T | undefined {
  if (!s) return undefined;
  try {
    return JSON.parse(s) as T;
  } catch {
    return undefined;
  }
}

function extractImageUrls(customer: any, files: CustomerFile[]) {
  // Wenn du eigene Preview-URLs generierst, häng sie hier an
  const fromFiles = files?.map((f) => f.previewUrl).filter(Boolean) as string[];
  const legacy = Array.isArray((customer as any).imageIds)
    ? (customer as any).imageIds
    : [];
  const images = [...legacy, ...fromFiles].filter(Boolean);
  return images as string[];
}

export function useCustomerV2(customerId: string) {
  return useQuery<{
    customer: Customer;
    services: CustomerService[];
    files: CustomerFile[];
    // nützliche Derivate:
    imageUrls: string[];
    createdDate: string;
    primaryService?: CustomerService;
    servicesParsed: Array<CustomerService & { dataObj?: any }>;
  }>({
    queryKey: ["customerV2", customerId],
    enabled: !!customerId,
    queryFn: async () => {
      // 1) alles parallel holen
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

      const customer = (await cRes.json()) as Customer;
      const servicesList = (await sRes.json()) as ListResponse<CustomerService>;
      const filesList = (await fRes.json()) as ListResponse<CustomerFile>;

      const services = servicesList?.documents ?? [];
      const files = filesList?.documents ?? [];

      // 2) sinnvolle Ableitungen
      const imageUrls = extractImageUrls(customer, files);
      const createdDate = customer?.$createdAt
        ? new Date(customer.$createdAt).toLocaleDateString("de-DE")
        : "-";

      // Beispiel: „primärer“ Service = erster Eintrag (falls du eine Regel brauchst, passe hier an)
      const primaryService = services[0];

      // Services mit geparstem JSON
      const servicesParsed = services.map((s) => ({
        ...s,
        dataObj: parseJSON(s.data),
      }));

      return {
        customer,
        services,
        files,
        imageUrls,
        createdDate,
        primaryService,
        servicesParsed,
      };
    },
    staleTime: 30_000,
  });
}
