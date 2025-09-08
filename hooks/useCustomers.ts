import { useQuery } from "@tanstack/react-query";
import { Customer } from "@/types/customers";

export function useCustomers() {
  return useQuery<Customer[]>({
    queryKey: ["customers"],
    queryFn: async (): Promise<Customer[]> => {
      const res = await fetch(`/api/customers`);
      if (!res.ok) {
        throw new Error("Failed to fetch customers");
      }
      return res.json();
    },
  });
}
