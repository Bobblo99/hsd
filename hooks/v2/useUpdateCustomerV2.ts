import { CustomerUpdate, updateCustomerV2 } from "@/lib/queries/customers";
import { Customer } from "@/types/customers";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateCustomerV2() {
  const queryClient = useQueryClient();

  return useMutation<Customer, Error, { id: string; updates: CustomerUpdate }>({
    mutationFn: ({ id, updates }) => updateCustomerV2(id, updates),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["customersV2"] });
      queryClient.invalidateQueries({ queryKey: ["customerV2", updated.$id] });
    },
  });
}
