"use client";

import { Users, Settings, LogOut, X, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useCustomerStatsV2 } from "@/hooks/v2/useCustomerStatsV2";

interface User {
  $id: string;
  email: string;
  name: string;
}

interface AdminSidebarProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onUserLogout: () => void;
}

export function AdminSidebar({
  user,
  isOpen,
  onClose,
  onUserLogout,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const stats = useCustomerStatsV2();
  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: <Home className="h-5 w-5" />,
      isActive: pathname === "/admin/dashboard",
    },
    {
      id: "customers",
      label: "Kunden",
      href: "/admin/kunde",
      icon: <Users className="h-5 w-5" />,
      isActive: pathname.startsWith("/admin/kunde"),
      badge: stats.stats.totalCustomers,
    },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-white/10 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">HSD Admin</h1>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
        ${
          item.isActive
            ? "bg-red-500 text-white shadow-lg"
            : "text-gray-400 hover:text-white hover:bg-white/5"
        }`}
            >
              <div
                className={`transition-transform duration-200 ${
                  item.isActive ? "" : "group-hover:scale-110"
                }`}
              >
                {item.icon}
              </div>
              <span className="font-medium">{item.label}</span>
              {item.badge && (
                <Badge
                  className={`ml-auto text-xs ${
                    item.isActive
                      ? "bg-white/20 text-white"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}
        </nav>
        {/* User Info */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
              <span className="text-red-500 font-bold">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || "A"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">
                {user?.name || "Admin"}
              </p>
              <p className="text-gray-400 text-sm truncate">
                {user?.email || "admin@hsd-gmbh.com"}
              </p>
            </div>
          </div>

          <Button
            onClick={onUserLogout}
            variant="outline"
            className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Abmelden
          </Button>
        </div>
      </div>
    </aside>
  );
}
