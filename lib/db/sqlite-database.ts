// SQLite Alternative für lokale Entwicklung
import Database from 'better-sqlite3';
import { join } from 'path';

const dbPath = join(process.cwd(), 'data', 'hsd-felgen.db');
const db = new Database(dbPath);

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    felgeBeschaedigt TEXT NOT NULL CHECK (felgeBeschaedigt IN ('ja', 'nein')),
    reparaturArt TEXT NOT NULL CHECK (reparaturArt IN ('lackieren', 'polieren', 'schweissen', 'pulverbeschichten')),
    schadensBeschreibung TEXT NOT NULL,
    bildIds TEXT NOT NULL DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'eingegangen' CHECK (status IN ('eingegangen', 'in-bearbeitung', 'fertiggestellt', 'abgeholt')),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customerName TEXT NOT NULL,
    customerEmail TEXT NOT NULL,
    customerPhone TEXT,
    service TEXT NOT NULL,
    appointmentDate TEXT NOT NULL,
    appointmentTime TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    notes TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
  CREATE INDEX IF NOT EXISTS idx_customers_created ON customers(createdAt);
  CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointmentDate);
`);

export interface Customer {
  id?: number;
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
export const createCustomer = (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Customer => {
  const stmt = db.prepare(`
    INSERT INTO customers (name, email, phone, felgeBeschaedigt, reparaturArt, schadensBeschreibung, bildIds, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const result = stmt.run(
    customer.name,
    customer.email,
    customer.phone,
    customer.felgeBeschaedigt,
    customer.reparaturArt,
    customer.schadensBeschreibung,
    JSON.stringify(customer.bildIds),
    customer.status
  );

  return getCustomer(result.lastInsertRowid as number);
};

export const getCustomers = (filter?: 'all' | 'eingegangen' | 'in-bearbeitung' | 'fertiggestellt'): Customer[] => {
  let query = 'SELECT * FROM customers';
  let params: any[] = [];

  if (filter && filter !== 'all') {
    query += ' WHERE status = ?';
    params.push(filter);
  }

  query += ' ORDER BY createdAt DESC';

  const stmt = db.prepare(query);
  const rows = stmt.all(...params) as any[];

  return rows.map(row => ({
    ...row,
    bildIds: JSON.parse(row.bildIds || '[]')
  }));
};

export const getCustomer = (id: number): Customer => {
  const stmt = db.prepare('SELECT * FROM customers WHERE id = ?');
  const row = stmt.get(id) as any;
  
  if (!row) throw new Error('Customer not found');
  
  return {
    ...row,
    bildIds: JSON.parse(row.bildIds || '[]')
  };
};

export const updateCustomer = (id: number, updates: Partial<Customer>): Customer => {
  const fields = Object.keys(updates).filter(key => key !== 'id');
  const setClause = fields.map(field => `${field} = ?`).join(', ');
  const values = fields.map(field => {
    const value = updates[field as keyof Customer];
    return field === 'bildIds' ? JSON.stringify(value) : value;
  });

  const stmt = db.prepare(`
    UPDATE customers 
    SET ${setClause}, updatedAt = CURRENT_TIMESTAMP 
    WHERE id = ?
  `);
  
  stmt.run(...values, id);
  return getCustomer(id);
};

export const deleteCustomer = (id: number): void => {
  const stmt = db.prepare('DELETE FROM customers WHERE id = ?');
  stmt.run(id);
};

export const getCustomerStats = (): CustomerStats => {
  const totalStmt = db.prepare('SELECT COUNT(*) as count FROM customers');
  const eingegangenStmt = db.prepare('SELECT COUNT(*) as count FROM customers WHERE status = ?');
  const inBearbeitungStmt = db.prepare('SELECT COUNT(*) as count FROM customers WHERE status = ?');
  const fertiggestelltStmt = db.prepare('SELECT COUNT(*) as count FROM customers WHERE status = ?');
  const abgeholtStmt = db.prepare('SELECT COUNT(*) as count FROM customers WHERE status = ?');

  return {
    totalCustomers: (totalStmt.get() as any).count,
    eingegangen: (eingegangenStmt.get('eingegangen') as any).count,
    inBearbeitung: (inBearbeitungStmt.get('in-bearbeitung') as any).count,
    fertiggestellt: (fertiggestelltStmt.get('fertiggestellt') as any).count,
    abgeholt: (abgeholtStmt.get('abgeholt') as any).count,
  };
};

export default db;