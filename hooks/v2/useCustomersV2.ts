// hooks/useCustomersV2.ts
import { Customer } from "@/types/customers";
import { useQuery } from "@tanstack/react-query";

// Appwrite list response
type ListResponse<T> = {
  total: number;
  documents: T[];
};

export function useCustomersV2() {
  return useQuery<Customer[]>({
    queryKey: ["customersV2"],
    queryFn: async (): Promise<Customer[]> => {
      const res = await fetch(`/api/v2/customers`, { cache: "no-store" });
      if (!res.ok) {
        throw new Error("Failed to fetch customers");
      }
      const data = (await res.json()) as ListResponse<Customer>;
      return data.documents;
    },
    staleTime: 30_000,
  });
}
