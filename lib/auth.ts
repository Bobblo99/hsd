import { account } from './appwrite';
import { ID } from 'appwrite';

export interface User {
  $id: string;
  email: string;
  name: string;
}

export const signInAdmin = async (email: string, password: string): Promise<User | null> => {
  try {
    await account.createEmailSession(email, password);
    const user = await account.get();
    return user as User;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
};

export const signOutAdmin = async (): Promise<void> => {
  try {
    await account.deleteSession('current');
  } catch (error) {
    console.error('Logout error:', error);
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  try {
    await account.get();
    return true;
  } catch (error) {
    return false;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const user = await account.get();
    return user as User;
  } catch (error) {
    return null;
  }
};