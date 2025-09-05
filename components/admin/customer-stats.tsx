"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Clock, CheckCircle, Package } from "lucide-react";
import { USE_DUMMY_DATA } from "@/lib/config";
import { getCustomerStats } from "@/lib/db/felgen-database";
import { getCustomerStats as getDummyCustomerStats } from "@/lib/db/dummy-database";

interface CustomerStats {
  totalCustomers: number;
  eingegangen: number;
  inBearbeitung: number;
  fertiggestellt: number;
  abgeholt: number;
}

interface CustomerStatsProps {
  refreshTrigger?: number;
}

export function CustomerStats({ refreshTrigger }: CustomerStatsProps) {
  const [stats, setStats] = useState<CustomerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(loadStats, 10000);
    
    return () => clearInterval(interval);
  }, [refreshTrigger]);

  const loadStats = async () => {
    try {
      const data = USE_DUMMY_DATA 
        ? await getDummyCustomerStats()
        : await getCustomerStats();
      setStats(data);
    } catch (error) {
      console.error("Fehler beim Laden der Statistiken:", error);
      setStats({
        totalCustomers: 0,
        eingegangen: 0,
        inBearbeitung: 0,
        fertiggestellt: 0,
        abgeholt: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-white/10 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6">
          <CardTitle className="text-xs md:text-sm font-medium text-gray-300">
            Gesamt Kunden
          </CardTitle>
          <Users className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-0">
          <div className="text-xl md:text-2xl font-bold text-white">
            {stats.totalCustomers}
          </div>
          <p className="text-xs text-gray-400 hidden sm:block">
            Alle Anfragen
          </p>
          <p className="text-xs text-gray-400 sm:hidden">Total</p>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6">
          <CardTitle className="text-xs md:text-sm font-medium text-gray-300">
            Eingegangen
          </CardTitle>
          <Clock className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-0">
          <div className="text-xl md:text-2xl font-bold text-white">
            {stats.eingegangen}
          </div>
          <p className="text-xs text-gray-400 hidden sm:block">
            Neue Anfragen
          </p>
          <p className="text-xs text-gray-400 sm:hidden">Neu</p>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6">
          <CardTitle className="text-xs md:text-sm font-medium text-gray-300">
            In Bearbeitung
          </CardTitle>
          <Package className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-0">
          <div className="text-xl md:text-2xl font-bold text-white">
            {stats.inBearbeitung}
          </div>
          <p className="text-xs text-gray-400 hidden sm:block">
            Aktive Aufträge
          </p>
          <p className="text-xs text-gray-400 sm:hidden">Aktiv</p>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6">
          <CardTitle className="text-xs md:text-sm font-medium text-gray-300">
            Fertiggestellt
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-0">
          <div className="text-xl md:text-2xl font-bold text-white">
            {stats.fertiggestellt}
          </div>
          <p className="text-xs text-gray-400 hidden sm:block">
            Abholbereit
          </p>
          <p className="text-xs text-gray-400 sm:hidden">Fertig</p>
        </CardContent>
      </Card>
    </div>
  );
}