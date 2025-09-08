"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, UserRoundPlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  onLogout?: () => void;
  actions?: ReactNode;
}

export function DashboardLayout({
  children,
  title,
  subtitle,
  icon,
  onLogout,
  actions,
}: DashboardLayoutProps) {
  const router = useRouter();
  function addUser() {
    router.push("/kunde");
  }
  return (
    <div className="min-h-screen bg-black">
      <header className="bg-gray-900 shadow-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex justify-between items-center">
            <div className="min-w-0 flex-1">
              <h1 className="text-lg md:text-2xl font-bold text-white truncate flex items-center gap-2">
                {icon}
                {title}
              </h1>
              {subtitle && (
                <>
                  <p className="text-sm md:text-base text-gray-400 hidden sm:block">
                    {subtitle}
                  </p>
                  <p className="text-xs text-gray-400 sm:hidden">
                    {subtitle.split(" ").slice(0, 2).join(" ")}
                  </p>
                </>
              )}
            </div>

            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={addUser}
                  className="flex items-center gap-1 md:gap-2 text-sm md:text-base px-2 md:px-4 bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  <UserRoundPlusIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">kunde hinzufügen</span>
                </Button>
              </div>

              <div className="flex items-center gap-2">
                {actions}
                {onLogout && (
                  <Button
                    variant="outline"
                    onClick={onLogout}
                    className="flex items-center gap-1 md:gap-2 text-sm md:text-base px-2 md:px-4 bg-white/5 border-white/20 text-white hover:bg-white/10"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Abmelden</span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-2 md:px-4 py-4 md:py-8">
        {children}
      </div>
    </div>
  );
}
