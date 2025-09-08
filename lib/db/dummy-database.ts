import { Customer, CustomerStats } from "@/types/customers";

// Dummy Daten
const dummyCustomers: Customer[] = [
  {
    $id: "1",
    name: "Max Mustermann",
    email: "max.mustermann@email.de",
    phone: "+49 176 12345678",
    rimDamaged: "ja",
    repairType: "lackieren",
    damageDescription:
      "Bordsteinschaden an der Vorderachse rechts. Kratzer und kleine Delle sichtbar. Lackierung beschädigt.",
    imageIds: ["dummy-1", "dummy-2"],
    status: "eingegangen",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 Stunden alt
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    $id: "2",
    name: "Anna Schmidt",
    email: "anna.schmidt@gmail.com",
    phone: "+49 151 98765432",
    rimDamaged: "ja",
    repairType: "pulverbeschichten",
    damageDescription:
      "Komplette Neubeschichtung gewünscht. Alte Beschichtung blättert ab. Farbe: Schwarz matt.",
    imageIds: ["dummy-3", "dummy-4", "dummy-5"],
    status: "in-bearbeitung",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 Tag alt
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // vor 4 Stunden aktualisiert
  },
  {
    $id: "3",
    name: "Thomas Weber",
    email: "thomas.weber@web.de",
    phone: "+49 172 55544433",
    rimDamaged: "nein",
    repairType: "polieren",
    damageDescription:
      "Felgen polieren und auf Hochglanz bringen. Keine Schäden, nur Aufbereitung gewünscht.",
    imageIds: ["dummy-6"],
    status: "fertiggestellt",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 Tage alt
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // vor 1 Stunde aktualisiert
  },
  {
    $id: "4",
    name: "Sarah Müller",
    email: "sarah.mueller@outlook.de",
    phone: "+49 160 77788899",
    rimDamaged: "ja",
    repairType: "schweissen",
    damageDescription:
      "Riss in der Felge durch Schlagloch. Schweißreparatur erforderlich. Anschließend Lackierung.",
    imageIds: ["dummy-7", "dummy-8"],
    status: "eingegangen",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 Minuten alt
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    $id: "5",
    name: "Michael Bauer",
    email: "michael.bauer@company.com",
    phone: "+49 171 33322211",
    rimDamaged: "ja",
    repairType: "lackieren",
    damageDescription:
      "Mehrere Bordsteinschäden. Komplette Neulackierung in Originalfarbe gewünscht.",
    imageIds: ["dummy-9", "dummy-10", "dummy-11"],
    status: "in-bearbeitung",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 Tage alt
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // vor 6 Stunden aktualisiert
  },
  {
    $id: "6",
    name: "Lisa Wagner",
    email: "lisa.wagner@email.com",
    phone: "+49 152 44455566",
    rimDamaged: "nein",
    repairType: "polieren",
    damageDescription:
      "Felgen haben Kratzer vom Waschvorgang. Polieren und versiegeln gewünscht.",
    imageIds: ["dummy-12"],
    status: "abgeholt",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 Woche alt
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // gestern aktualisiert
  },
  {
    $id: "7",
    name: "Robert Klein",
    email: "robert.klein@gmail.com",
    phone: "+49 173 66677788",
    rimDamaged: "ja",
    repairType: "pulverbeschichten",
    damageDescription:
      "Winterschäden durch Streusalz. Komplette Aufbereitung mit Pulverbeschichtung in Anthrazit.",
    imageIds: ["dummy-13", "dummy-14"],
    status: "fertiggestellt",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 Tage alt
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // vor 2 Stunden aktualisiert
  },
  {
    $id: "8",
    name: "Jennifer Hoffmann",
    email: "jennifer.hoffmann@web.de",
    phone: "+49 174 99988877",
    rimDamaged: "ja",
    repairType: "lackieren",
    damageDescription:
      "Parkschaden - Kratzer an zwei Felgen. Spot-Reparatur wenn möglich, sonst Neulackierung.",
    imageIds: ["dummy-15"],
    status: "eingegangen",
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 Minuten alt
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
];

// Dummy Admin User
export const dummyAdminUser = {
  email: "admin@hsd-gmbh.com",
  password: "demo123",
  name: "HSD Admin",
};

// CRUD Operations mit Dummy Daten
export const createCustomer = async (
  customer: Omit<Customer, "$id" | "createdAt" | "updatedAt">
): Promise<Customer> => {
  const newCustomer: Customer = {
    ...customer,
    $id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  dummyCustomers.unshift(newCustomer);
  return newCustomer;
};

export const getCustomers = async (
  filter?: "all" | "eingegangen" | "in-bearbeitung" | "fertiggestellt"
): Promise<Customer[]> => {
  let filtered = [...dummyCustomers];

  if (filter && filter !== "all") {
    filtered = filtered.filter((customer) => customer.status === filter);
  }

  return filtered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

export const getCustomer = async (id: string): Promise<Customer> => {
  const customer = dummyCustomers.find((c) => c.$id === id);
  if (!customer) throw new Error("Customer not found");
  return customer;
};

export const updateCustomer = async (
  id: string,
  updates: Partial<Customer>
): Promise<Customer> => {
  const index = dummyCustomers.findIndex((c) => c.$id === id);
  if (index === -1) throw new Error("Customer not found");

  dummyCustomers[index] = {
    ...dummyCustomers[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  return dummyCustomers[index];
};

export const deleteCustomer = async (id: string): Promise<void> => {
  const index = dummyCustomers.findIndex((c) => c.$id === id);
  if (index === -1) throw new Error("Customer not found");

  dummyCustomers.splice(index, 1);
};

export const getCustomerStats = async (): Promise<CustomerStats> => {
  return {
    totalCustomers: dummyCustomers.length,
    eingegangen: dummyCustomers.filter((c) => c.status === "eingegangen")
      .length,
    inBearbeitung: dummyCustomers.filter((c) => c.status === "in-bearbeitung")
      .length,
    fertiggestellt: dummyCustomers.filter((c) => c.status === "fertiggestellt")
      .length,
    abgeholt: dummyCustomers.filter((c) => c.status === "abgeholt").length,
  };
};

// Dummy Image URLs
export const getImageUrl = (fileId: string): string => {
  // Verwende Pexels Bilder für Demo
  const imageMap: { [key: string]: string } = {
    "dummy-1":
      "https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400",
    "dummy-2":
      "https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg?auto=compress&cs=tinysrgb&w=400",
    "dummy-3":
      "https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400",
    "dummy-4":
      "https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg?auto=compress&cs=tinysrgb&w=400",
    "dummy-5":
      "https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400",
    "dummy-6":
      "https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg?auto=compress&cs=tinysrgb&w=400",
    "dummy-7":
      "https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400",
    "dummy-8":
      "https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg?auto=compress&cs=tinysrgb&w=400",
    "dummy-9":
      "https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400",
    "dummy-10":
      "https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg?auto=compress&cs=tinysrgb&w=400",
    "dummy-11":
      "https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400",
    "dummy-12":
      "https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg?auto=compress&cs=tinysrgb&w=400",
    "dummy-13":
      "https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400",
    "dummy-14":
      "https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg?auto=compress&cs=tinysrgb&w=400",
    "dummy-15":
      "https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400",
  };

  return (
    imageMap[fileId] ||
    "https://images.pexels.com/photos/3806288/pexels-photo-3806288.jpeg?auto=compress&cs=tinysrgb&w=400"
  );
};

// Dummy File Upload
export const uploadImage = async (file: File): Promise<string> => {
  // Simuliere Upload-Delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return `dummy-${Date.now()}`;
};

export const exportCustomersToCSV = (customers: Customer[]): string => {
  const headers = [
    "Name",
    "E-Mail",
    "Telefon",
    "Felge beschädigt",
    "Reparatur Art",
    "Beschreibung",
    "Status",
    "Erstellt am",
    "Aktualisiert am",
  ];

  const csvContent = [
    headers.join(","),
    ...customers.map((customer) =>
      [
        `"${customer.name}"`,
        `"${customer.email}"`,
        `"${customer.phone}"`,
        `"${customer.rimDamaged}"`,
        `"${customer.repairType}"`,
        `"${customer.damageDescription.replace(/"/g, '""')}"`,
        `"${customer.status}"`,
        `"${new Date(customer.createdAt).toLocaleDateString("de-DE")}"`,
        `"${new Date(customer.updatedAt).toLocaleDateString("de-DE")}"`,
      ].join(",")
    ),
  ].join("\n");

  return csvContent;
};
