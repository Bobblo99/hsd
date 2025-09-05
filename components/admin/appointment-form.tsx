"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { createAppointment } from "@/lib/db/database";
import { useToast } from "@/hooks/use-toast";

const appointmentSchema = z.object({
  customerName: z.string().min(2, "Name muss mindestens 2 Zeichen haben"),
  customerEmail: z.string().email("Ungültige E-Mail-Adresse"),
  customerPhone: z.string().optional(),
  service: z.string().min(1, "Bitte wählen Sie einen Service"),
  appointmentDate: z.date({
    required_error: "Bitte wählen Sie ein Datum",
  }),
  appointmentTime: z.string().min(1, "Bitte wählen Sie eine Uhrzeit"),
  notes: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

const services = [
  "Felgenaufbereitung",
  "Reifenmontage",
  "Wuchten",
  "Lackierung",
  "Pulverbeschichtung",
  "Bordsteinschaden Reparatur",
  "Beratung",
];

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30",
];

export function AppointmentForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      service: "",
      appointmentTime: "",
      notes: "",
    },
  });

  async function onSubmit(values: AppointmentFormValues) {
    setIsLoading(true);

    try {
      await createAppointment({
        ...values,
        appointmentDate: values.appointmentDate.toISOString().split('T')[0],
        status: 'confirmed',
      });

      toast({
        title: "Termin erstellt",
        description: "Der Termin wurde erfolgreich erstellt.",
      });

      form.reset();
    } catch (error) {
      console.error("Fehler beim Erstellen des Termins:", error);
      toast({
        title: "Fehler",
        description: "Termin konnte nicht erstellt werden.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="bg-white/5 rounded-xl p-6 border border-white/10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Kundenname *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Max Mustermann"
                      className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-red-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customerEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">E-Mail *</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="max@beispiel.de"
                      className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-red-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="customerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Telefon</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+49 123 456789"
                      className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-red-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="service"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Service *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/20 text-white focus:border-red-500">
                        <SelectValue placeholder="Service auswählen" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {services.map((service) => (
                        <SelectItem key={service} value={service} className="text-white hover:bg-white/10">
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="appointmentDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-gray-300">Datum *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "bg-white/5 border-white/20 text-white hover:bg-white/10 focus:border-red-500",
                            !field.value && "text-gray-400"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: de })
                          ) : (
                            <span>Datum auswählen</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="text-white"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="appointmentTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Uhrzeit *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white/5 border-white/20 text-white focus:border-red-500">
                        <SelectValue placeholder="Uhrzeit auswählen" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time} className="text-white hover:bg-white/10">
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Notizen</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Zusätzliche Informationen..."
                    className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-red-500 resize-none"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-500 hover:bg-red-600 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            {isLoading ? "Wird erstellt..." : "Termin erstellen"}
          </Button>
        </form>
      </Form>
    </div>
  );
}