import { account } from "./appwrite";

export interface User {
  $id: string;
  email: string;
  name: string;
}

export const signInAdmin = async (
  email: string,
  password: string
): Promise<User | null> => {
  try {
    // Session erstellen
    await account.createEmailSession(email, password);

    // Eingeloggten User holen
    const user = await account.get();
    return {
      $id: user.$id,
      email: user.email,
      name: user.name,
    };
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
};

export const signOutAdmin = async (): Promise<void> => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error("Logout error:", error);
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  try {
    await account.get();
    return true;
  } catch {
    return false;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const user = await account.get();
    return {
      $id: user.$id,
      email: user.email,
      name: user.name,
    };
  } catch {
    return null;
  }
};
