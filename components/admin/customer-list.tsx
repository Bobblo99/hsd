"use client";

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
  Eye,
  Download,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Package,
} from "lucide-react";
import { Customer } from "@/types/customers";
import { useUpdateCustomer } from "@/hooks/useUpdateCustomer";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface CustomerListProps {
  customers: Customer[];
  isLoading?: boolean;
  isError?: boolean;
  onReload?: () => void;
  onExport?: () => void;
}

export function CustomerList({
  customers,
  isLoading = false,
  isError = false,
  onReload,
  onExport,
}: CustomerListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-white/5 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError || !customers || customers.length === 0) {
    return (
      <div className="text-center py-12">
        <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400">Keine Kunden gefunden</p>
        {onReload && (
          <Button onClick={onReload} className="mt-4">
            Neu laden
          </Button>
        )}
      </div>
    );
  }

  console.log(customers);
  return (
    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
      <div className="flex justify-between items-center mb-6 p-4">
        <h3 className="text-lg font-semibold text-white">
          {customers.length} Kunden gefunden
        </h3>
        {onExport && (
          <Button
            variant="outline"
            className="bg-white/5 border-white/20 text-white hover:bg-white/10"
            onClick={onExport}
          >
            <Download className="h-4 w-4 mr-2" />
            CSV Export
          </Button>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-white/5">
            <TableHead className="text-gray-300">Kunde</TableHead>
            <TableHead className="text-gray-300">Status</TableHead>
            <TableHead className="text-gray-300">Menü</TableHead>
            <TableHead className="text-gray-300">Detailansicht</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((c) => (
            <TableRow key={c.$id}>
              <TableCell>
                <div className="text-white font-medium">{c.name}</div>
                <div className="text-gray-400 text-sm">{c.email}</div>
              </TableCell>
              <TableCell>
                <StatusBadge status={c.status} />
              </TableCell>
              <TableCell>
                <StatusMenu customer={c} />
              </TableCell>
              <TableCell>
                <CustomerDetailButton customerId={c.$id ?? ""} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

interface CustomerDetailButtonProps {
  customerId: string;
}

export function CustomerDetailButton({
  customerId,
}: CustomerDetailButtonProps) {
  return (
    <Link
      href={`/kunde/${customerId}`}
      className="h-8 w-8 p-0 text-gray-400 hover:text-white transition-colors"
      title="Kundendetails ansehen"
    >
      <Eye className="h-4 w-4" />
    </Link>
  );
}

export const statusBadgeMap: Record<
  Customer["status"],
  "danger" | "warning" | "success" | "info"
> = {
  eingegangen: "warning",
  "in-bearbeitung": "info",
  fertiggestellt: "success",
  abgeholt: "info",
};

export function StatusBadge({ status }: { status: Customer["status"] }) {
  return <Badge variant={statusBadgeMap[status]}>{status}</Badge>;
}

interface StatusMenuProps {
  customer: Customer;
}

export function StatusMenu({ customer }: StatusMenuProps) {
  const { mutate: updateCustomer } = useUpdateCustomer();
  const { toast } = useToast();
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleChange = (status: Customer["status"]) => {
    updateCustomer(
      { id: customer.$id!, updates: { status } },
      {
        onSuccess: () => {
          toast({
            variant: "success",
            title: "Status geändert",
            description: `Der Auftrag von ${customer.name} ist jetzt "${status}".`,
          });
        },
        onError: () => {
          toast({
            title: "Fehler",
            description: "Der Status konnte nicht aktualisiert werden.",
            variant: "destructive",
          });
        },
      }
    );
  };

  useEffect(() => {
    if (menuRef.current && gsap) {
      gsap.fromTo(
        menuRef.current,
        { opacity: 0, scale: 0.9, y: -5 },
        { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: "power2.out" }
      );
    }
  }, [menuRef.current]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-gray-400 hover:text-white transition-colors"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        ref={menuRef}
        align="end"
        className="bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-xl shadow-lg overflow-hidden"
      >
        <DropdownMenuItem
          onClick={() => handleChange("eingegangen")}
          className="flex items-center gap-2 text-yellow-400 hover:bg-yellow-500/10 cursor-pointer px-4 py-2"
        >
          <Clock className="h-4 w-4" />
          Eingegangen
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleChange("in-bearbeitung")}
          className="flex items-center gap-2 text-blue-400 hover:bg-blue-500/10 cursor-pointer px-4 py-2"
        >
          <Package className="h-4 w-4" />
          In Bearbeitung
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleChange("fertiggestellt")}
          className="flex items-center gap-2 text-green-400 hover:bg-green-500/10 cursor-pointer px-4 py-2"
        >
          <CheckCircle className="h-4 w-4" />
          Fertiggestellt
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
