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

export type CreateCustomerInput = Pick<
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
  | "status"
  | "imageCount"
  | "hasImages"
>;

function buildCreatePayload(i: CreateCustomerInput) {
  const fullName =
    i.fullName?.trim() || [i.firstName, i.lastName].filter(Boolean).join(" ");
  const fullAddress =
    i.fullAddress?.trim() ||
    `${i.street} ${i.houseNumber}, ${i.zipCode} ${i.city}`;
  return { ...i, fullName, fullAddress };
}

export async function createCustomerV2(
  input: CreateCustomerInput
): Promise<Customer> {
  const res = await fetch("/api/v2/customers", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildCreatePayload(input)),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteCustomerV2(id: string): Promise<{ success: true }> {
  const res = await fetch(`/api/v2/customers/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
