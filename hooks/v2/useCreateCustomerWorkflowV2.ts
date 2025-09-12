import { useMutation, useQueryClient } from "@tanstack/react-query";
import { validateFormData } from "@/lib/validation/validateCustomerForm";
import { createCustomerPayloadsFromForm } from "@/lib/mappers/createCustomerFromForm";
import { useCreateCustomerV2 } from "@/hooks/v2/useCreateCustomerV2";
import { useUploadCustomerFilesV2 } from "@/hooks/v2/useUploadCustomerFilesV2";
import { useUpdateCustomerV2 } from "@/hooks/v2/useUpdateCustomerV2";
import type { CustomerFormData } from "@/types/customer-form";
import { Customer } from "@/types/customers";

type ServiceDoc = {
  $id: string;
  serviceType: string;
  status?: string;
  data?: string;
};
type WorkflowResult = {
  customer: Customer;
  services: ServiceDoc[];
  uploadedFiles: { total: number } | null;
};

export function useCreateCustomerWorkflowV2() {
  const qc = useQueryClient();
  const { mutateAsync: createCustomer } = useCreateCustomerV2();
  const { mutateAsync: uploadFiles } = useUploadCustomerFilesV2();
  const { mutateAsync: updateCustomer } = useUpdateCustomerV2();

  return useMutation<WorkflowResult, Error, CustomerFormData>({
    mutationFn: async (form) => {
      const errors = validateFormData(form);
      if (errors.length) {
        const msg = errors.map((e) => `${e.field}: ${e.message}`).join("\n");
        throw new Error(msg);
      }

      const { customer, services, filesToUpload } =
        createCustomerPayloadsFromForm(form);
      console.log("Creating customer", { customer, services, filesToUpload });
      const created = await createCustomer({
        ...customer,
        status: customer.status ?? "eingegangen",
        imageCount: customer.imageCount ?? 0,
        hasImages: customer.hasImages ?? false,
      });

      const createdServices: ServiceDoc[] = [];
      if (services.length) {
        const res = await Promise.all(
          services.map(async (s) => {
            const r = await fetch(`/api/v2/customers/${created.$id}/services`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...s, customer: created.$id }),
            });
            if (!r.ok)
              throw new Error((await r.text()) || "Create service failed");
            return r.json();
          })
        );
        createdServices.push(...(res as ServiceDoc[]));
      }

      //customer files upload
      let uploaded: { total: number } | null = null;
      if (filesToUpload.length) {
        uploaded = await uploadFiles({
          customerId: created.$id,
          files: filesToUpload,
          purpose: "rim",
        });

        // aggregate on customer
        const add = uploaded?.total ?? 0;
        if (add > 0) {
          await updateCustomer({
            id: created.$id,
            updates: {
              hasImages: true,
              imageCount: (created.imageCount ?? 0) + add,
            },
          });
        }
      }

      // invalidate cache
      qc.invalidateQueries({ queryKey: ["customersV2"] });
      qc.invalidateQueries({ queryKey: ["customerV2", created.$id] });

      return {
        customer: created,
        services: createdServices,
        uploadedFiles: uploaded,
      };
    },
  });
}
