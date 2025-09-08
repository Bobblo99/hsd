import { useCustomers } from "@/hooks/useCustomers";
import { Customer, CustomerStats } from "@/types/customers";
import { useMemo } from "react";

export function useCustomerStats() {
  const { data: customers = [], isLoading, isError } = useCustomers();

  const stats: CustomerStats = useMemo(() => {
    if (!customers || customers.length === 0) {
      return {
        totalCustomers: 0,
        eingegangen: 0,
        inBearbeitung: 0,
        fertiggestellt: 0,
        abgeholt: 0,
      };
    }

    return {
      totalCustomers: customers.length,
      eingegangen: customers.filter((c: Customer) => c.status === "eingegangen")
        .length,
      inBearbeitung: customers.filter(
        (c: Customer) => c.status === "in-bearbeitung"
      ).length,
      fertiggestellt: customers.filter(
        (c: Customer) => c.status === "fertiggestellt"
      ).length,
      abgeholt: customers.filter((c: Customer) => c.status === "abgeholt")
        .length,
    };
  }, [customers]);

  return { stats, isLoading, isError };
}
