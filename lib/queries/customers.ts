import { Customer } from "@/types/customers";

export async function updateCustomer(
  id: string,
  updates: Partial<Customer>
): Promise<Customer> {
  const res = await fetch(`/api/customers/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    throw new Error(`Failed to update customer ${id}`);
  }

  return res.json();
}

export type CustomerUpdate = Partial<
  Pick<
    Customer,
    | "firstName"
    | "lastName"
    | "fullName"
    | "street"
    | "houseNumber"
    | "zipCode"
    | "city"
    | "fullAddress"
    | "email"
    | "phone"
    | "imageCount"
    | "hasImages"
    | "status"
  >
>;

export async function updateCustomerV2(
  id: string,
  updates: CustomerUpdate
): Promise<Customer> {
  const res = await fetch(`/api/v2/customers/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Failed to update customer ${id}`);
  }
  return res.json();
}
