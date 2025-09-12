"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { USE_DUMMY_DATA } from "@/lib/config";
import { signOutAdmin } from "@/lib/auth";
import { signOutAdmin as signOutDummyAdmin } from "@/lib/auth-dummy";
import { AuthChecker } from "@/components/admin/AuthChecker";
import { AdminSidebar } from "@/components/admin/Layout";

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface User {
  $id: string;
  email: string;
  name: string;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { toast } = useToast();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const handleUserLoaded = (loadedUser: User | null) => {
    setUser(loadedUser);
  };

  const handleLogout = async () => {
    try {
      if (USE_DUMMY_DATA) {
        await signOutDummyAdmin();
      } else {
        await signOutAdmin();
      }

      toast({
        title: "Abgemeldet",
        description: "Sie wurden erfolgreich abgemeldet.",
      });
      window.location.href = "/admin/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthChecker
      redirectTo="/admin/login"
      loadingMessage="Admin-Bereich wird geladen..."
      onUserLoaded={handleUserLoaded}
    >
      <div className="min-h-screen bg-black flex">
        <AdminSidebar
          user={user}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onUserLogout={handleLogout}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="lg:hidden bg-gray-900 border-b border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidebarOpen(true)}
                  className="text-gray-400 hover:text-white"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <h1 className="text-lg font-bold text-white">HSD Admin</h1>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto">{children}</main>
        </div>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </AuthChecker>
  );
}
