"use client";

import { useState } from "react";
import {
  Users,
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCustomersV2 } from "@/hooks/v2/useCustomersV2";
import { useRouter } from "next/navigation";
import { useDeleteCustomerV2 } from "@/hooks/v2/useDeleteCustomerV2";
import { useToast } from "@/hooks/use-toast";

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const router = useRouter();
  const { mutate: deleteCustomer } = useDeleteCustomerV2();
  const { toast } = useToast();

  const handleDelete = (id: string) => {
    deleteCustomer(
      { id },
      {
        onSuccess: () => {
          toast({
            title: "Kunde gelöscht",
            description: "Der Kunde wurde erfolgreich gelöscht.",
          });
        },
        onError: () => {
          toast({
            title: "Fehler",
            description: "Kunde konnte nicht gelöscht werden.",
            variant: "destructive",
          });
        },
      }
    );
  };

  const { data, isLoading } = useCustomersV2();

  const filteredCustomers =
    data?.filter((c) => {
      const base = c.customer;
      const matchesSearch =
        !searchTerm ||
        base.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        base.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        base.phone?.includes(searchTerm);

      const matchesStatus =
        statusFilter === "all" || base.status === statusFilter;

      return matchesSearch && matchesStatus;
    }) || [];

  const getStatusBadge = (status: string) => {
    const variants = {
      eingegangen: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
      "in-bearbeitung": "bg-blue-500/20 text-blue-500 border-blue-500/30",
      fertiggestellt: "bg-green-500/20 text-green-500 border-green-500/30",
      abgeholt: "bg-gray-500/20 text-gray-500 border-gray-500/30",
    };

    const labels = {
      eingegangen: "Eingegangen",
      "in-bearbeitung": "In Bearbeitung",
      fertiggestellt: "Fertiggestellt",
      abgeholt: "Abgeholt",
    };

    const variant =
      variants[status as keyof typeof variants] || variants.eingegangen;
    const label = labels[status as keyof typeof labels] || status;

    return <Badge className={`${variant} border`}>{label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="space-y-6">
          <div className="h-8 bg-white/5 rounded animate-pulse"></div>
          <div className="h-64 bg-white/5 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Users className="h-8 w-8 text-red-500" />
            Kunden verwalten
          </h1>
          <p className="text-gray-400 mt-2">
            Alle Kundenanfragen und Aufträge im Überblick
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="bg-white/5 border-white/20 text-white hover:bg-white/10"
          >
            <Download className="h-4 w-4 mr-2" />
            CSV Export
          </Button>
          <Button className="bg-red-500 hover:bg-red-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Neuer Kunde
          </Button>
        </div>
      </div>

      {/* Filter */}
      <Card className="bg-white/5 border-white/10 mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Kunden suchen (Name, E-Mail, Telefon)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-red-500"
              />
            </div>

            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-white/5 border-white/20 text-white">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">Alle Status</SelectItem>
                  <SelectItem value="eingegangen">Eingegangen</SelectItem>
                  <SelectItem value="in-bearbeitung">In Bearbeitung</SelectItem>
                  <SelectItem value="fertiggestellt">Fertiggestellt</SelectItem>
                  <SelectItem value="abgeholt">Abgeholt</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Kundenliste */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            Kundenliste ({filteredCustomers.length})
            <Badge className="bg-red-500/20 text-red-400">
              {filteredCustomers.length} gefunden
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Keine Kunden gefunden</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-gray-300">Kunde</TableHead>
                    <TableHead className="text-gray-300 hidden md:table-cell">
                      Services
                    </TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300 hidden lg:table-cell">
                      Erstellt
                    </TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((c) => {
                    const base = c.customer;
                    return (
                      <TableRow
                        key={base.$id}
                        className="border-white/10 hover:bg-white/5"
                      >
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium text-white">
                              {base.fullName || "Unbekannt"}
                            </p>
                            <p className="text-sm text-gray-400">
                              {base.email}
                            </p>
                            <p className="text-sm text-gray-400">
                              {base.phone}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {c.servicesParsed?.length ? (
                              c.servicesParsed.map((s) => (
                                <Badge
                                  key={s.$id}
                                  className="bg-blue-500/20 text-blue-400 text-xs"
                                >
                                  {s.serviceType === "rims"
                                    ? "Felgen"
                                    : s.serviceType === "tires-purchase"
                                    ? "Reifen"
                                    : "Service"}
                                </Badge>
                              ))
                            ) : (
                              <Badge className="bg-gray-500/20 text-gray-400 text-xs">
                                Keine Services
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(base.status || "eingegangen")}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span className="text-white text-sm">
                            {base.$createdAt
                              ? new Date(base.$createdAt).toLocaleDateString(
                                  "de-DE"
                                )
                              : "-"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-gray-800 border-gray-700">
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(`/kunde/${base.$id}`)
                                }
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Details anzeigen
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Bearbeiten
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-400"
                                onClick={() => handleDelete(base.$id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Löschen
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
