"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  Customer,
  CustomerService,
  CustomerWithDetails,
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

export function useCustomersV2() {
  return useQuery<CustomerWithDetails[]>({
    queryKey: ["customersV2"],
    queryFn: async () => {
      const res = await fetch(`/api/v2/customers`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch customers");

      const data = (await res.json()) as ListResponse<
        Customer & { services?: CustomerService[] }
      >;
      const customers = data.documents;

      return customers.map((customer) => {
        const services = customer.services || [];

        const servicesParsed = services.map((s) => ({
          ...s,
          dataObj: parseJSON(s.data),
        }));

        const createdDate = customer.$createdAt
          ? new Date(customer.$createdAt).toLocaleDateString("de-DE")
          : "-";

        return {
          customer,
          services,
          files: [],
          images: [],
          imageUrls: [],
          createdDate,
          primaryService: services[0],
          servicesParsed,
        };
      });
    },
    staleTime: 30_000,
  });
}
