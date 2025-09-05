import { databases, Query, DATABASE_ID, storage } from '../appwrite';
import { ID } from 'appwrite';
import { CUSTOMERS_COLLECTION_ID, BUCKET_ID } from '../appwrite';

export interface Customer {
  $id?: string;
  name: string;
  email: string;
  phone: string;
  felgeBeschaedigt: 'ja' | 'nein';
  reparaturArt: 'lackieren' | 'polieren' | 'schweissen' | 'pulverbeschichten';
  schadensBeschreibung: string;
  bildIds: string[];
  status: 'eingegangen' | 'in-bearbeitung' | 'fertiggestellt' | 'abgeholt';
  createdAt: string;
  updatedAt: string;
}

export interface CustomerStats {
  totalCustomers: number;
  eingegangen: number;
  inBearbeitung: number;
  fertiggestellt: number;
  abgeholt: number;
}

// Customer CRUD Operations
export const createCustomer = async (customer: Omit<Customer, '$id' | 'createdAt' | 'updatedAt'>): Promise<Customer> => {
  const now = new Date().toISOString();
  const newCustomer = {
    ...customer,
    createdAt: now,
    updatedAt: now,
  };

  const response = await databases.createDocument(
    DATABASE_ID,
    CUSTOMERS_COLLECTION_ID,
    ID.unique(),
    newCustomer
  );

  return response as Customer;
};

export const getCustomers = async (filter?: 'all' | 'eingegangen' | 'in-bearbeitung' | 'fertiggestellt'): Promise<Customer[]> => {
  try {
    let queries = [Query.orderDesc('createdAt')];

    if (filter && filter !== 'all') {
      queries.push(Query.equal('status', filter));
    }

    const response = await databases.listDocuments(
      DATABASE_ID,
      CUSTOMERS_COLLECTION_ID,
      queries
    );

    return response.documents as Customer[];
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
};

export const getCustomer = async (id: string): Promise<Customer> => {
  const response = await databases.getDocument(
    DATABASE_ID,
    CUSTOMERS_COLLECTION_ID,
    id
  );

  return response as Customer;
};

export const updateCustomer = async (id: string, updates: Partial<Customer>): Promise<Customer> => {
  const updatedData = {
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const response = await databases.updateDocument(
    DATABASE_ID,
    CUSTOMERS_COLLECTION_ID,
    id,
    updatedData
  );

  return response as Customer;
};

export const deleteCustomer = async (id: string): Promise<void> => {
  await databases.deleteDocument(
    DATABASE_ID,
    CUSTOMERS_COLLECTION_ID,
    id
  );
};

// File Upload
export const uploadImage = async (file: File): Promise<string> => {
  const response = await storage.createFile(
    BUCKET_ID,
    ID.unique(),
    file
  );

  return response.$id;
};

export const getImageUrl = (fileId: string): string => {
  return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`;
};

export const deleteImage = async (fileId: string): Promise<void> => {
  await storage.deleteFile(BUCKET_ID, fileId);
};

// Statistics
export const getCustomerStats = async (): Promise<CustomerStats> => {
  try {
    const [total, eingegangen, inBearbeitung, fertiggestellt, abgeholt] = await Promise.all([
      databases.listDocuments(DATABASE_ID, CUSTOMERS_COLLECTION_ID),
      databases.listDocuments(DATABASE_ID, CUSTOMERS_COLLECTION_ID, [Query.equal('status', 'eingegangen')]),
      databases.listDocuments(DATABASE_ID, CUSTOMERS_COLLECTION_ID, [Query.equal('status', 'in-bearbeitung')]),
      databases.listDocuments(DATABASE_ID, CUSTOMERS_COLLECTION_ID, [Query.equal('status', 'fertiggestellt')]),
      databases.listDocuments(DATABASE_ID, CUSTOMERS_COLLECTION_ID, [Query.equal('status', 'abgeholt')])
    ]);

    return {
      totalCustomers: total.total,
      eingegangen: eingegangen.total,
      inBearbeitung: inBearbeitung.total,
      fertiggestellt: fertiggestellt.total,
      abgeholt: abgeholt.total,
    };
  } catch (error) {
    console.error('Error fetching customer stats:', error);
    return {
      totalCustomers: 0,
      eingegangen: 0,
      inBearbeitung: 0,
      fertiggestellt: 0,
      abgeholt: 0,
    };
  }
};

// Export to CSV
export const exportCustomersToCSV = (customers: Customer[]): string => {
  const headers = [
    'Name',
    'E-Mail',
    'Telefon',
    'Felge beschädigt',
    'Reparatur Art',
    'Beschreibung',
    'Status',
    'Erstellt am',
    'Aktualisiert am'
  ];

  const csvContent = [
    headers.join(','),
    ...customers.map(customer => [
      `"${customer.name}"`,
      `"${customer.email}"`,
      `"${customer.phone}"`,
      `"${customer.felgeBeschaedigt}"`,
      `"${customer.reparaturArt}"`,
      `"${customer.schadensBeschreibung.replace(/"/g, '""')}"`,
      `"${customer.status}"`,
      `"${new Date(customer.createdAt).toLocaleDateString('de-DE')}"`,
      `"${new Date(customer.updatedAt).toLocaleDateString('de-DE')}"`
    ].join(','))
  ].join('\n');

  return csvContent;
};