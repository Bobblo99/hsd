// lib/mappers/createCustomerFromForm.ts
import type { CustomerFormData } from "@/types/customer-form";
import type { CustomerCollection } from "@/types/customer-collection";

export const createCustomerFromForm = (
  form: CustomerFormData
): CustomerCollection => {
  return {
    // contact
    firstName: form.firstName,
    lastName: form.lastName,
    fullName: `${form.firstName} ${form.lastName}`,
    street: form.street,
    houseNumber: form.houseNumber,
    zipCode: form.zipCode,
    city: form.city,
    fullAddress: `${form.street} ${form.houseNumber}, ${form.zipCode} ${form.city}`,
    email: form.email,
    phone: form.phone,

    // services
    services: form.selectedServices,

    // rims
    rimsData: form.rims ? JSON.stringify(form.rims) : undefined,
    rimsCount: form.rims?.count,
    rimsHasBent: form.rims?.hasBent, // "ja" | "nein"
    rimsFinish: form.rims?.finish,
    rimsColor: form.rims?.color || form.rims?.combination,
    rimsSticker: form.rims?.sticker,

    // tires purchase
    tiresPurchaseData: form.tiresPurchase
      ? JSON.stringify(form.tiresPurchase)
      : undefined,
    tiresQuantity: form.tiresPurchase?.quantity,
    tiresSize: form.tiresPurchase?.size,
    tiresUsage: form.tiresPurchase?.usage,
    tiresBrand:
      form.tiresPurchase?.brandPreference === "gezielt"
        ? form.tiresPurchase.targetBrand
        : form.tiresPurchase?.brandPreference,

    // tire service
    tireServiceData: form.tireService
      ? JSON.stringify(form.tireService)
      : undefined,
    mountService: form.tireService?.mountService,

    // notes (kombiniert)
    allNotes: [
      form.rims?.notes,
      form.tiresPurchase?.notes,
      form.tireService?.notes,
    ]
      .filter(Boolean)
      .join(" | "),

    // meta
    status: form.status,
    createdAt: form.createdAt,
    updatedAt: form.updatedAt,
  };
};
