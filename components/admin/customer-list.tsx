"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import { MoreHorizontal, Phone, Mail, Eye, Download, Trash2 } from "lucide-react";
import { USE_DUMMY_DATA } from "@/lib/config";
import { getCustomers, updateCustomer, deleteCustomer, getImageUrl, exportCustomersToCSV, type Customer } from "@/lib/db/felgen-database";
import { 
  getCustomers as getDummyCustomers, 
  updateCustomer as updateDummyCustomer, 
  deleteCustomer as deleteDummyCustomer, 
  getImageUrl as getDummyImageUrl, 
  exportCustomersToCSV as exportDummyCustomersToCSV,
  type Customer as DummyCustomer 
} from "@/lib/db/dummy-database";
import { useToast } from "@/hooks/use-toast";

interface CustomerListProps {
  filter: 'all' | 'eingegangen' | 'in-bearbeitung' | 'fertiggestellt';
  onDataChange?: () => void;
}

export function CustomerList({ filter, onDataChange }: CustomerListProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [deleteCustomerId, setDeleteCustomerId] = useState<string | null>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadCustomers();
    
    // Auto-refresh every 5 seconds
    refreshIntervalRef.current = setInterval(() => {
      loadCustomers();
    }, 5000);
    
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [filter]);

  const loadCustomers = async () => {
    try {
      setIsLoading(true);
      const data = USE_DUMMY_DATA 
        ? await getDummyCustomers(filter)
        : await getCustomers(filter);
      setCustomers(data);
      onDataChange?.(); // Notify parent of data change
    } catch (error) {
      console.error("Fehler beim Laden der Kunden:", error);
      toast({
        title: "Fehler",
        description: "Kunden konnten nicht geladen werden.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: Customer['status']) => {
    try {
      if (USE_DUMMY_DATA) {
        await updateDummyCustomer(id, { status });
      } else {
        await updateCustomer(id, { status });
      }
      await loadCustomers(); // Refresh current table
      onDataChange?.(); // Notify parent to refresh other tables
      toast({
        title: "Status aktualisiert",
        description: "Der Auftragsstatus wurde erfolgreich geändert.",
      });
    } catch (error) {
      console.error("Fehler beim Aktualisieren:", error);
      toast({
        title: "Fehler",
        description: "Status konnte nicht aktualisiert werden.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (USE_DUMMY_DATA) {
        await deleteDummyCustomer(id);
      } else {
        await deleteCustomer(id);
      }
      await loadCustomers(); // Refresh current table
      onDataChange?.(); // Notify parent to refresh other tables
      setDeleteCustomerId(null);
      toast({
        title: "Kunde gelöscht",
        description: "Der Kunde wurde erfolgreich gelöscht.",
      });
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
      toast({
        title: "Fehler",
        description: "Kunde konnte nicht gelöscht werden.",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    const csvContent = USE_DUMMY_DATA 
      ? exportDummyCustomersToCSV(customers)
      : exportCustomersToCSV(customers);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `felgen-kunden-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export erfolgreich",
      description: "Die Kundendaten wurden als CSV-Datei heruntergeladen.",
    });
  };

  const getStatusBadge = (status: Customer['status']) => {
    const variants = {
      'eingegangen': "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
      'in-bearbeitung': "bg-blue-500/20 text-blue-500 border-blue-500/30",
      'fertiggestellt': "bg-green-500/20 text-green-500 border-green-500/30",
      'abgeholt': "bg-gray-500/20 text-gray-500 border-gray-500/30",
    };

    const labels = {
      'eingegangen': "Eingegangen",
      'in-bearbeitung': "In Bearbeitung",
      'fertiggestellt': "Fertiggestellt",
      'abgeholt': "Abgeholt",
    };

    return (
      <Badge className={`${variants[status]} border`}>
        {labels[status]}
      </Badge>
    );
  };

  const getReparaturLabel = (art: string) => {
    const labels = {
      'lackieren': 'Lackieren',
      'polieren': 'Polieren',
      'schweissen': 'Schweißen',
      'pulverbeschichten': 'Pulverbeschichten'
    };
    return labels[art as keyof typeof labels] || art;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="text-center py-12">
        <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400">Keine Kunden gefunden</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">
          {customers.length} Kunden gefunden
        </h3>
        <Button
          onClick={handleExport}
          variant="outline"
          className="bg-white/5 border-white/20 text-white hover:bg-white/10"
        >
          <Download className="h-4 w-4 mr-2" />
          CSV Export
        </Button>
      </div>

      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-white/5">
              <TableHead className="text-gray-300">Kunde</TableHead>
              <TableHead className="text-gray-300 hidden md:table-cell">Service</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300 hidden lg:table-cell">Erstellt</TableHead>
              <TableHead className="text-gray-300 w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.$id} className="border-white/10 hover:bg-white/5">
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium text-white">{customer.name}</div>
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
                  <div className="space-y-1">
                    <div className="text-white">{getReparaturLabel(customer.reparaturArt)}</div>
                    <div className="text-sm text-gray-400">
                      Beschädigt: {customer.felgeBeschaedigt === 'ja' ? 'Ja' : 'Nein'}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(customer.status)}
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="text-white">
                    {new Date(customer.createdAt).toLocaleDateString('de-DE')}
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date(customer.createdAt).toLocaleTimeString('de-DE', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setIsDetailOpen(true);
                        }}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Details anzeigen
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusUpdate(customer.$id!, 'eingegangen')}
                        className="text-yellow-400 hover:text-yellow-300"
                      >
                        Eingegangen
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusUpdate(customer.$id!, 'in-bearbeitung')}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        In Bearbeitung
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusUpdate(customer.$id!, 'fertiggestellt')}
                        className="text-green-400 hover:text-green-300"
                      >
                        Fertiggestellt
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusUpdate(customer.$id!, 'abgeholt')}
                        className="text-gray-400 hover:text-gray-300"
                      >
                        Abgeholt
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
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">
              Kundendetails - {selectedCustomer?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Kontaktdaten */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
                    Kontaktdaten
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Mail className="h-4 w-4" />
                      {selectedCustomer.email}
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Phone className="h-4 w-4" />
                      {selectedCustomer.phone}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
                    Service Details
                  </h4>
                  <div className="space-y-2">
                    <div className="text-gray-300">
                      <span className="font-medium">Reparatur:</span> {getReparaturLabel(selectedCustomer.reparaturArt)}
                    </div>
                    <div className="text-gray-300">
                      <span className="font-medium">Beschädigt:</span> {selectedCustomer.felgeBeschaedigt === 'ja' ? 'Ja' : 'Nein'}
                    </div>
                    <div className="text-gray-300">
                      <span className="font-medium">Status:</span> {getStatusBadge(selectedCustomer.status)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Beschreibung */}
              <div>
                <h4 className="text-lg font-semibold text-white border-b border-white/10 pb-2 mb-4">
                  Schadensbeschreibung
                </h4>
                <p className="text-gray-300 bg-white/5 p-4 rounded-lg">
                  {selectedCustomer.schadensBeschreibung}
                </p>
              </div>

              {/* Bilder */}
              {selectedCustomer.bildIds.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-white border-b border-white/10 pb-2 mb-4">
                    Hochgeladene Bilder ({selectedCustomer.bildIds.length})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedCustomer.bildIds.map((bildId, index) => (
                      <div key={bildId} className="relative group">
                        <img
                          src={USE_DUMMY_DATA ? getDummyImageUrl(bildId) : getImageUrl(bildId)}
                          alt={`Felge ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => window.open(USE_DUMMY_DATA ? getDummyImageUrl(bildId) : getImageUrl(bildId), '_blank')}
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <Eye className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Zeitstempel */}
              <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                <div className="text-sm text-gray-400">
                  <span className="font-medium">Erstellt:</span> {new Date(selectedCustomer.createdAt).toLocaleString('de-DE')}
                </div>
                <div className="text-sm text-gray-400">
                  <span className="font-medium">Aktualisiert:</span> {new Date(selectedCustomer.updatedAt).toLocaleString('de-DE')}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteCustomerId} onOpenChange={() => setDeleteCustomerId(null)}>
        <AlertDialogContent className="bg-gray-900 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-red-500" />
              Kunde löschen
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Sind Sie sicher, dass Sie diesen Kunden unwiderruflich löschen möchten? 
              Diese Aktion kann nicht rückgängig gemacht werden und alle zugehörigen 
              Daten einschließlich hochgeladener Bilder werden permanent entfernt.
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
              Unwiderruflich löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}