import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Customer } from "@/types/customers";
import { updateCustomer } from "@/lib/queries/customers";

export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation<
    Customer,
    Error,
    { id: string; updates: Partial<Customer> }
  >({
    mutationFn: ({ id, updates }) => updateCustomer(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
}
