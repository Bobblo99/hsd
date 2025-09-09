// hooks/v2/useCreateCustomerV2.ts
import { CreateCustomerInput, createCustomerV2 } from "@/lib/queries/customers";
import { Customer } from "@/types/customers";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateCustomerV2() {
  const qc = useQueryClient();

  return useMutation<Customer, Error, CreateCustomerInput>({
    mutationFn: (input) => createCustomerV2(input),
    onSuccess: (created) => {
      // Liste neu laden
      qc.invalidateQueries({ queryKey: ["customersV2"] });
      // Detail-Cache "vorwärmen"
      qc.setQueryData(["customerV2", created.$id], {
        customer: created,
        services: [],
        files: [],
        imageUrls: [],
        createdDate: created.$createdAt
          ? new Date(created.$createdAt).toLocaleDateString("de-DE")
          : "-",
        primaryService: undefined,
        servicesParsed: [],
      });
    },
  });
}
