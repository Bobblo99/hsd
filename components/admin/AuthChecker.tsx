"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isAuthenticated, getCurrentUser } from "@/lib/auth";
import {
  isAuthenticated as isDummyAuthenticated,
  getCurrentUser as getDummyCurrentUser,
} from "@/lib/auth-dummy";

interface User {
  $id: string;
  email: string;
  name: string;
}

interface AuthCheckerProps {
  children: React.ReactNode;
  redirectTo?: string;
  loadingMessage?: string;
  onUserLoaded?: (user: User | null) => void;
}

export function AuthChecker({
  children,
  redirectTo = "/admin/login",
  loadingMessage = "Authentifizierung wird überprüft...",
  onUserLoaded,
}: AuthCheckerProps) {
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authenticated = await isAuthenticated();

      if (!authenticated) {
        router.push(redirectTo);
        return;
      }

      const currentUser = await getCurrentUser();

      setUser(currentUser);
      setIsAuthenticatedState(true);
      onUserLoaded?.(currentUser);
    } catch (error) {
      console.error("Auth check failed:", error);
      router.push(redirectTo);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Card className="bg-white/5 border-white/10 p-8">
          <CardContent className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-red-500" />
            <p className="text-white font-medium">{loadingMessage}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticatedState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Card className="bg-white/5 border-white/10 max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Zugriff verweigert
            </h2>
            <p className="text-gray-400 mb-6">
              Sie werden zur Anmeldung weitergeleitet...
            </p>
            <Button
              onClick={() => router.push(redirectTo)}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Zur Anmeldung
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Authenticated - Render children
  return <>{children}</>;
}
