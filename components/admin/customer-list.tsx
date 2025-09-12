"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  MoreHorizontal,
  Users,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CustomerWithDetails } from "@/types/customers";
import { useDeleteCustomerV2 } from "@/hooks/v2/useDeleteCustomerV2";

interface CustomerListProps {
  customers: CustomerWithDetails[];
  isLoading: boolean;
  isError: boolean;
  onReload: () => void;
}

export function CustomerList({
  customers,
  isLoading,
  isError,
  onReload,
}: CustomerListProps) {
  const [deleteCustomerId, setDeleteCustomerId] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { mutate: deleteCustomer } = useDeleteCustomerV2();

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

  const handleDelete = async (id: string) => {
    try {
      setDeleteCustomerId(null);
      deleteCustomer(
        { id },
        {
          onSuccess: () => {
            onReload();
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
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Kunde konnte nicht gelöscht werden.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-red-500" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-6">
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">Fehler beim Laden der Kunden</p>
            <Button
              onClick={onReload}
              variant="outline"
              className="bg-white/5 border-white/20 text-white"
            >
              Erneut versuchen
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (customers.length === 0) {
    return (
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-6">
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400">Keine Kunden gefunden</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-0">
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
                  <TableHead className="text-gray-300 w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((entry) => {
                  const customer = entry.customer;
                  return (
                    <TableRow
                      key={customer.$id}
                      className="border-white/10 hover:bg-white/5"
                    >
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-white">
                            {customer.fullName || "Unbekannt"}
                          </div>
                          <div className="text-sm text-gray-400 flex items-center gap-2">
                            <Mail className="h-3 w-3" />
                            {customer.email}
                          </div>
                          <div className="text-sm text-gray-400 flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            {customer.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {entry.servicesParsed?.length ? (
                            entry.servicesParsed.map((s: any) => (
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
                        {getStatusBadge(customer.status || "eingegangen")}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="text-white text-sm">
                          {customer.$createdAt
                            ? new Date(customer.$createdAt).toLocaleDateString(
                                "de-DE"
                              )
                            : "-"}
                        </div>
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
                          <DropdownMenuContent
                            align="end"
                            className="bg-gray-800 border-gray-700"
                          >
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/kunde/${customer.$id}`)
                              }
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Details anzeigen
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-green-400 hover:text-green-300">
                              <Edit className="h-4 w-4 mr-2" />
                              Bearbeiten
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeleteCustomerId(customer.$id!)}
                              className="text-red-400 hover:text-red-300"
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
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteCustomerId}
        onOpenChange={() => setDeleteCustomerId(null)}
      >
        <AlertDialogContent className="bg-gray-900 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Kunde löschen
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Sind Sie sicher, dass Sie diesen Kunden unwiderruflich löschen
              möchten? Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/20 text-white hover:bg-white/10">
              Abbrechen
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteCustomerId && handleDelete(deleteCustomerId)}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
