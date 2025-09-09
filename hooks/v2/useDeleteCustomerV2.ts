import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteCustomerV2() {
  const qc = useQueryClient();
  return useMutation<{ success: true }, Error, { id: string }>({
    mutationFn: async ({ id }) => {
      const r = await fetch(`/api/v2/customers/${id}`, { method: "DELETE" });
      if (!r.ok) throw new Error(await r.text());
      return r.json();
    },
    onSuccess: (_res, { id }) => {
      qc.invalidateQueries({ queryKey: ["customersV2"] });
      qc.removeQueries({ queryKey: ["customerV2", id] });
    },
  });
}
