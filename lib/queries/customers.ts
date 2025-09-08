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
