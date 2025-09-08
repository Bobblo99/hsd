import { useQuery } from "@tanstack/react-query";
import { Customer } from "@/types/customers";

export function useCustomer(customerId: string) {
  return useQuery<Customer>({
    queryKey: ["customer", customerId],
    queryFn: async (): Promise<Customer> => {
      const res = await fetch(`/api/customers/${customerId}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch customer ${customerId}`);
      }
      return res.json();
    },
    enabled: !!customerId,
  });
}
