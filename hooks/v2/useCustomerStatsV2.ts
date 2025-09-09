// hooks/v2/useCustomerStatsV2.ts
import { useMemo } from "react";
import type { CustomerStats } from "@/types/customers";
import { useCustomersV2 } from "./useCustomersV2";

export function useCustomerStatsV2() {
  const { data: customers = [], isLoading, isError } = useCustomersV2();

  const stats: CustomerStats = useMemo(() => {
    if (!customers.length) {
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
      eingegangen: customers.filter((c) => c.status === "eingegangen").length,
      inBearbeitung: customers.filter((c) => c.status === "in-bearbeitung")
        .length,
      fertiggestellt: customers.filter((c) => c.status === "fertiggestellt")
        .length,
      abgeholt: customers.filter((c) => c.status === "abgeholt").length,
    };
  }, [customers]);

  return { stats, isLoading, isError };
}
