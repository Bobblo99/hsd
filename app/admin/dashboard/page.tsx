"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Clock, CheckCircle, Package, Wrench } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { USE_DUMMY_DATA } from "@/lib/config";
import { isAuthenticated, signOutAdmin } from "@/lib/auth";
import { isAuthenticated as isDummyAuthenticated, signOutAdmin as signOutDummyAdmin } from "@/lib/auth-dummy";
import {
  DashboardLayout,
  DashboardTabs,
  DashboardCard,
  CustomerList,
  CustomerStats,
  type TabItem
} from "@/components/admin/dashboard";

export default function FelgenAdminDashboard() {
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, [router]);

  const checkAuth = async () => {
    try {
      const authenticated = USE_DUMMY_DATA 
        ? await isDummyAuthenticated()
        : await isAuthenticated();
      if (!authenticated) {
        router.push("/admin/login");
      } else {
        setIsAuthenticatedState(true);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      router.push("/admin/login");
    } finally {
      setIsLoading(false);
    }
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
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleDataChange = () => {
    // Trigger refresh for all components
    setRefreshTrigger(prev => prev + 1);
  };

  // Tab Configuration
  const tabs: TabItem[] = [
    {
      id: "overview",
      label: "Übersicht",
      shortLabel: "Start",
      icon: <Users className="h-4 w-4" />,
      content: (
        <div className="space-y-4 md:space-y-6">
          <CustomerStats refreshTrigger={refreshTrigger} />

          <DashboardCard
            title="Neue Anfragen"
            description="Kürzlich eingegangene Felgenaufbereitungs-Anfragen"
          >
            <CustomerList filter="eingegangen" onDataChange={handleDataChange} />
          </DashboardCard>

          <DashboardCard
            title="In Bearbeitung"
            description="Aufträge die aktuell bearbeitet werden"
          >
            <CustomerList filter="in-bearbeitung" onDataChange={handleDataChange} />
          </DashboardCard>
        </div>
      )
    },
    {
      id: "eingegangen",
      label: "Eingegangen",
      shortLabel: "Neu",
      icon: <Clock className="h-4 w-4" />,
      content: (
        <DashboardCard
          title="Eingegangene Anfragen"
          description="Neue Felgenaufbereitungs-Anfragen verwalten"
        >
          <CustomerList filter="eingegangen" onDataChange={handleDataChange} />
        </DashboardCard>
      )
    },
    {
      id: "in-bearbeitung",
      label: "Bearbeitung",
      shortLabel: "Aktiv",
      icon: <Package className="h-4 w-4" />,
      content: (
        <DashboardCard
          title="Aufträge in Bearbeitung"
          description="Aktuell bearbeitete Felgenaufbereitungen"
        >
          <CustomerList filter="in-bearbeitung" onDataChange={handleDataChange} />
        </DashboardCard>
      )
    },
    {
      id: "fertiggestellt",
      label: "Fertig",
      shortLabel: "Done",
      icon: <CheckCircle className="h-4 w-4" />,
      content: (
        <DashboardCard
          title="Fertiggestellte Aufträge"
          description="Abgeschlossene Felgenaufbereitungen"
        >
          <CustomerList filter="fertiggestellt" onDataChange={handleDataChange} />
        </DashboardCard>
      )
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!isAuthenticatedState) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <DashboardLayout
      title="HSD Felgen Admin"
      subtitle={USE_DUMMY_DATA ? "Felgenaufbereitungs-Verwaltung (Demo-Modus)" : "Felgenaufbereitungs-Verwaltung"}
      icon={<Wrench className="h-6 w-6 text-red-500" />}
      onLogout={handleLogout}
    >
      <DashboardTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </DashboardLayout>
  );
}