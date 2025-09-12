"use client";

import { useState } from "react";
import {
  Users,
  Clock,
  CheckCircle,
  Package,
  Wrench,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useCustomersV2 } from "@/hooks/v2/useCustomersV2";
import { CustomerStats } from "@/components/admin/customer-stats";
import { CustomerList } from "@/components/admin/customer-list";
import { CustomerWithDetails } from "@/types/customers";

export default function FelgenAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const {
    data,
    isLoading: loadingCustomers,
    isError,
    refetch,
  } = useCustomersV2();

  const filterCustomers = (
    data: CustomerWithDetails[] | undefined,
    status: string | "all"
  ): CustomerWithDetails[] => {
    if (!data) return [];
    if (status === "all") return data;
    return data.filter((c) => c.customer.status === status);
  };

  const quickLinks = [
    {
      href: "/admin/kunde",
      label: "Alle Kunden anzeigen",
      icon: <Users className="h-4 w-4 text-gray-400" />,
    },
    {
      href: "/admin/appointments",
      label: "Termine verwalten",
      icon: <Clock className="h-4 w-4 text-gray-400" />,
      hidden: true,
    },
    {
      href: "/admin/reports",
      label: "Berichte anzeigen",
      icon: <TrendingUp className="h-4 w-4 text-gray-400" />,
      hidden: true,
    },
  ];

  return (
    <div className="p-4 md:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Wrench className="h-8 w-8 text-red-500" />
          <h1 className="text-3xl font-bold text-white">Dashboard Übersicht</h1>
        </div>
        <p className="text-gray-400 text-lg">
          Zentrale Übersicht aller Geschäftsaktivitäten
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8">
        <CustomerStats />
      </div>

      {/* Recent Activity */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-white/10">
          <TabsTrigger
            value="overview"
            className="flex items-center gap-2 text-gray-400 data-[state=active]:text-white data-[state=active]:bg-red-500"
          >
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Neue Anfragen</span>
          </TabsTrigger>
          <TabsTrigger
            value="active"
            className="flex items-center gap-2 text-gray-400 data-[state=active]:text-white data-[state=active]:bg-red-500"
          >
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">In Bearbeitung</span>
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="flex items-center gap-2 text-gray-400 data-[state=active]:text-white data-[state=active]:bg-red-500"
          >
            <CheckCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Fertiggestellt</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                Neue Anfragen ({filterCustomers(data, "eingegangen").length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CustomerList
                customers={filterCustomers(data, "eingegangen")}
                isLoading={loadingCustomers}
                isError={isError}
                onReload={refetch}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-500" />
                In Bearbeitung ({filterCustomers(data, "in-bearbeitung").length}
                )
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CustomerList
                customers={filterCustomers(data, "in-bearbeitung")}
                isLoading={loadingCustomers}
                isError={isError}
                onReload={refetch}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Fertiggestellt ({filterCustomers(data, "fertiggestellt").length}
                )
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CustomerList
                customers={filterCustomers(data, "fertiggestellt")}
                isLoading={loadingCustomers}
                isError={isError}
                onReload={refetch}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
