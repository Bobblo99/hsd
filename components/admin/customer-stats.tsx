"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, CheckCircle, Package } from "lucide-react";
import { useCustomerStats } from "@/hooks/useCustomerStats";

export function CustomerStats() {
  const { stats, isLoading } = useCustomerStats();

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

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
      <Card className="bg-white/5 border-white/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 md:p-6">
          <CardTitle className="text-xs md:text-sm font-medium text-gray-300">
            Gesamt Kunden
          </CardTitle>
          <Users className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-0">
          <div className="text-xl md:text-2xl font-bold text-white">
            {stats.totalCustomers}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 md:p-6">
          <CardTitle className="text-xs md:text-sm font-medium text-gray-300">
            Eingegangen
          </CardTitle>
          <Clock className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-0">
          <div className="text-xl md:text-2xl font-bold text-white">
            {stats.eingegangen}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 md:p-6">
          <CardTitle className="text-xs md:text-sm font-medium text-gray-300">
            In Bearbeitung
          </CardTitle>
          <Package className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-0">
          <div className="text-xl md:text-2xl font-bold text-white">
            {stats.inBearbeitung}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/10">
        <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 md:p-6">
          <CardTitle className="text-xs md:text-sm font-medium text-gray-300">
            Fertiggestellt
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent className="p-3 md:p-6 pt-0">
          <div className="text-xl md:text-2xl font-bold text-white">
            {stats.fertiggestellt}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
