import { databases, Query, DATABASE_ID, APPOINTMENTS_COLLECTION_ID, AVAILABILITY_COLLECTION_ID } from '../appwrite';
import { ID } from 'appwrite';

export interface Appointment {
  $id?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  service: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Availability {
  $id?: string;
  date: string;
  timeSlots: string[];
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  todayAppointments: number;
  yesterdayAppointments: number;
  totalAppointments: number;
  pendingAppointments: number;
  monthlyRevenue: number;
  revenueGrowth: number;
}

// Appointments
export const createAppointment = async (appointment: Omit<Appointment, '$id' | 'createdAt' | 'updatedAt'>): Promise<Appointment> => {
  const now = new Date().toISOString();
  const newAppointment = {
    ...appointment,
    createdAt: now,
    updatedAt: now,
  };

  const response = await databases.createDocument(
    DATABASE_ID,
    APPOINTMENTS_COLLECTION_ID,
    ID.unique(),
    newAppointment
  );

  return response as Appointment;
};

export const getAppointments = async (filter?: 'all' | 'pending' | 'today'): Promise<Appointment[]> => {
  let queries = [];

  if (filter === 'pending') {
    queries.push(Query.equal('status', 'pending'));
  } else if (filter === 'today') {
    const today = new Date().toISOString().split('T')[0];
    queries.push(Query.equal('appointmentDate', today));
  }

  const response = await databases.listDocuments(
    DATABASE_ID,
    APPOINTMENTS_COLLECTION_ID,
    queries
  );

  return response.documents as Appointment[];
};

export const updateAppointment = async (id: string, updates: Partial<Appointment>): Promise<Appointment> => {
  const updatedData = {
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const response = await databases.updateDocument(
    DATABASE_ID,
    APPOINTMENTS_COLLECTION_ID,
    id,
    updatedData
  );

  return response as Appointment;
};

export const deleteAppointment = async (id: string): Promise<void> => {
  await databases.deleteDocument(
    DATABASE_ID,
    APPOINTMENTS_COLLECTION_ID,
    id
  );
};

// Availability
export const createAvailability = async (availability: Omit<Availability, '$id' | 'createdAt' | 'updatedAt'>): Promise<Availability> => {
  const now = new Date().toISOString();
  const newAvailability = {
    ...availability,
    createdAt: now,
    updatedAt: now,
  };

  const response = await databases.createDocument(
    DATABASE_ID,
    AVAILABILITY_COLLECTION_ID,
    ID.unique(),
    newAvailability
  );

  return response as Availability;
};

export const getAvailability = async (date?: string): Promise<Availability[]> => {
  let queries = [];

  if (date) {
    queries.push(Query.equal('date', date));
  }

  const response = await databases.listDocuments(
    DATABASE_ID,
    AVAILABILITY_COLLECTION_ID,
    queries
  );

  return response.documents as Availability[];
};

export const updateAvailability = async (id: string, updates: Partial<Availability>): Promise<Availability> => {
  const updatedData = {
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  const response = await databases.updateDocument(
    DATABASE_ID,
    AVAILABILITY_COLLECTION_ID,
    id,
    updatedData
  );

  return response as Availability;
};

// Admin Stats
export const getAdminStats = async (): Promise<AdminStats> => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const [todayAppointments, yesterdayAppointments, totalAppointments, pendingAppointments] = await Promise.all([
      databases.listDocuments(DATABASE_ID, APPOINTMENTS_COLLECTION_ID, [Query.equal('appointmentDate', today)]),
      databases.listDocuments(DATABASE_ID, APPOINTMENTS_COLLECTION_ID, [Query.equal('appointmentDate', yesterday)]),
      databases.listDocuments(DATABASE_ID, APPOINTMENTS_COLLECTION_ID),
      databases.listDocuments(DATABASE_ID, APPOINTMENTS_COLLECTION_ID, [Query.equal('status', 'pending')])
    ]);

    return {
      todayAppointments: todayAppointments.total,
      yesterdayAppointments: yesterdayAppointments.total,
      totalAppointments: totalAppointments.total,
      pendingAppointments: pendingAppointments.total,
      monthlyRevenue: 0, // Calculate based on your business logic
      revenueGrowth: 0, // Calculate based on your business logic
    };
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return {
      todayAppointments: 0,
      yesterdayAppointments: 0,
      totalAppointments: 0,
      pendingAppointments: 0,
      monthlyRevenue: 0,
      revenueGrowth: 0,
    };
  }
};