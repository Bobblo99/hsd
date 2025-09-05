// Dummy Auth für Showcase - Einfach zu entfernen
export interface User {
  $id: string;
  email: string;
  name: string;
}

// Dummy Admin User
const dummyAdmin = {
  $id: 'admin-1',
  email: 'admin@hsd-gmbh.com',
  name: 'HSD Admin',
  password: 'demo123'
};

// Simuliere Session Storage
let currentUser: User | null = null;

export const signInAdmin = async (email: string, password: string): Promise<User | null> => {
  // Simuliere API-Delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (email === dummyAdmin.email && password === dummyAdmin.password) {
    currentUser = {
      $id: dummyAdmin.$id,
      email: dummyAdmin.email,
      name: dummyAdmin.name
    };
    
    // Speichere in localStorage für Demo
    localStorage.setItem('dummyAuth', JSON.stringify(currentUser));
    return currentUser;
  }
  
  return null;
};

export const signOutAdmin = async (): Promise<void> => {
  // Simuliere API-Delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  currentUser = null;
  localStorage.removeItem('dummyAuth');
};

export const isAuthenticated = async (): Promise<boolean> => {
  // Prüfe localStorage
  const stored = localStorage.getItem('dummyAuth');
  if (stored) {
    currentUser = JSON.parse(stored);
    return true;
  }
  
  return currentUser !== null;
};

export const getCurrentUser = async (): Promise<User | null> => {
  // Prüfe localStorage
  const stored = localStorage.getItem('dummyAuth');
  if (stored) {
    currentUser = JSON.parse(stored);
  }
  
  return currentUser;
};