"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Users, Clock, TrendingUp } from "lucide-react";
import { getAdminStats } from "@/lib/db/database";

interface AdminStats {
  todayAppointments: number;
  yesterdayAppointments: number;
  totalAppointments: number;
  pendingAppointments: number;
  monthlyRevenue: number;
  revenueGrowth: number;
}

export function AdminStats() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getAdminStats();
      setStats(data);
    } catch (error) {
      console.error("Fehler beim Laden der Statistiken:", error);
      // Fallback-Statistiken anzeigen
      setStats({
        todayAppointments: 0,
        yesterdayAppointments: 0,
        totalAppointments: 0,
        pendingAppointments: 0,
        monthlyRevenue: 0,
        revenueGrowth: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            Heutige Termine
          </CardTitle>
          <Calendar className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-0">
          <div className="text-xl md:text-2xl font-bold text-white">
            {stats.todayAppointments}
          </div>
          <p className="text-xs text-gray-400 hidden sm:block">
            {stats.todayAppointments > stats.yesterdayAppointments ? "+" : ""}
            {stats.todayAppointments - stats.yesterdayAppointments} seit gestern
          </p>
          <p className="text-xs text-gray-400 sm:hidden">Heute</p>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6">
          <CardTitle className="text-xs md:text-sm font-medium text-gray-300">
            Gesamte Termine
          </CardTitle>
          <Users className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-0">
          <div className="text-xl md:text-2xl font-bold text-white">
            {stats.totalAppointments}
          </div>
          <p className="text-xs text-gray-400 hidden sm:block">
            Alle gebuchten Termine
          </p>
          <p className="text-xs text-gray-400 sm:hidden">Gesamt</p>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6">
          <CardTitle className="text-xs md:text-sm font-medium text-gray-300">
            Ausstehende Termine
          </CardTitle>
          <Clock className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-0">
          <div className="text-xl md:text-2xl font-bold text-white">
            {stats.pendingAppointments}
          </div>
          <p className="text-xs text-gray-400 hidden sm:block">
            Warten auf Bestätigung
          </p>
          <p className="text-xs text-gray-400 sm:hidden">Offen</p>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 md:p-6">
          <CardTitle className="text-xs md:text-sm font-medium text-gray-300">
            Monatlicher Umsatz
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-0">
          <div className="text-xl md:text-2xl font-bold text-white">
            €{stats.monthlyRevenue}
          </div>
          <p className="text-xs text-gray-400 hidden sm:block">
            +{stats.revenueGrowth}% zum Vormonat
          </p>
          <p className="text-xs text-gray-400 sm:hidden">Umsatz</p>
        </CardContent>
      </Card>
    </div>
  );
}
