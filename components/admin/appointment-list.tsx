"use client";

import { useEffect, useState } from "react";
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
import { MoreHorizontal, Phone, Mail, Calendar, Clock } from "lucide-react";
import { getAppointments, updateAppointment, deleteAppointment, type Appointment } from "@/lib/db/database";
import { useToast } from "@/hooks/use-toast";

interface AppointmentListProps {
  filter: 'all' | 'pending' | 'today';
}

export function AppointmentList({ filter }: AppointmentListProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAppointments();
  }, [filter]);

  const loadAppointments = async () => {
    try {
      setIsLoading(true);
      const data = await getAppointments(filter);
      setAppointments(data);
    } catch (error) {
      console.error("Fehler beim Laden der Termine:", error);
      toast({
        title: "Fehler",
        description: "Termine konnten nicht geladen werden.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, status: Appointment['status']) => {
    try {
      await updateAppointment(id, { status });
      await loadAppointments();
      toast({
        title: "Status aktualisiert",
        description: "Der Terminstatus wurde erfolgreich geändert.",
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
    if (!confirm("Sind Sie sicher, dass Sie diesen Termin löschen möchten?")) {
      return;
    }

    try {
      await deleteAppointment(id);
      await loadAppointments();
      toast({
        title: "Termin gelöscht",
        description: "Der Termin wurde erfolgreich gelöscht.",
      });
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
      toast({
        title: "Fehler",
        description: "Termin konnte nicht gelöscht werden.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: Appointment['status']) => {
    const variants = {
      pending: "bg-red-500/20 text-red-500 border-red-500/30",
      confirmed: "bg-green-500/20 text-green-500 border-green-500/30",
      cancelled: "bg-gray-500/20 text-gray-500 border-gray-500/30",
      completed: "bg-blue-500/20 text-blue-500 border-blue-500/30",
    };

    const labels = {
      pending: "Ausstehend",
      confirmed: "Bestätigt",
      cancelled: "Abgesagt",
      completed: "Abgeschlossen",
    };

    return (
      <Badge className={`${variants[status]} border`}>
        {labels[status]}
      </Badge>
    );
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

  if (appointments.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400">Keine Termine gefunden</p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-white/10 hover:bg-white/5">
            <TableHead className="text-gray-300">Kunde</TableHead>
            <TableHead className="text-gray-300 hidden md:table-cell">Service</TableHead>
            <TableHead className="text-gray-300">Datum & Zeit</TableHead>
            <TableHead className="text-gray-300">Status</TableHead>
            <TableHead className="text-gray-300 w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.$id} className="border-white/10 hover:bg-white/5">
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium text-white">{appointment.customerName}</div>
                  <div className="text-sm text-gray-400 flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    {appointment.customerEmail}
                  </div>
                  {appointment.customerPhone && (
                    <div className="text-sm text-gray-400 flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      {appointment.customerPhone}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="text-white">{appointment.service}</div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="text-white flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {new Date(appointment.appointmentDate).toLocaleDateString('de-DE')}
                  </div>
                  <div className="text-sm text-gray-400 flex items-center gap-2">
                    <Clock className="h-3 w-3" />
                    {appointment.appointmentTime}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {getStatusBadge(appointment.status)}
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
                      onClick={() => handleStatusUpdate(appointment.$id!, 'confirmed')}
                      className="text-green-400 hover:text-green-300"
                    >
                      Bestätigen
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusUpdate(appointment.$id!, 'cancelled')}
                      className="text-yellow-400 hover:text-yellow-300"
                    >
                      Absagen
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusUpdate(appointment.$id!, 'completed')}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Abschließen
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(appointment.$id!)}
                      className="text-red-400 hover:text-red-300"
                    >
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
  );
}