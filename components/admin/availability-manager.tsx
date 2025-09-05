"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { getAvailability, createAvailability, updateAvailability, type Availability } from "@/lib/db/database";
import { useToast } from "@/hooks/use-toast";

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
  "17:00", "17:30",
];

export function AvailabilityManager() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedDate) {
      loadAvailability();
    }
  }, [selectedDate]);

  const loadAvailability = async () => {
    if (!selectedDate) return;

    try {
      const dateString = selectedDate.toISOString().split('T')[0];
      const data = await getAvailability(dateString);
      setAvailability(data);
      
      const dayAvailability = data.find(a => a.date === dateString);
      setSelectedSlots(dayAvailability?.timeSlots || []);
    } catch (error) {
      console.error("Fehler beim Laden der Verfügbarkeit:", error);
    }
  };

  const handleSlotToggle = (slot: string) => {
    setSelectedSlots(prev => 
      prev.includes(slot) 
        ? prev.filter(s => s !== slot)
        : [...prev, slot]
    );
  };

  const handleSaveAvailability = async () => {
    if (!selectedDate) return;

    setIsLoading(true);
    try {
      const dateString = selectedDate.toISOString().split('T')[0];
      const existingAvailability = availability.find(a => a.date === dateString);

      if (existingAvailability) {
        await updateAvailability(existingAvailability.$id!, {
          timeSlots: selectedSlots,
          isAvailable: selectedSlots.length > 0,
        });
      } else {
        await createAvailability({
          date: dateString,
          timeSlots: selectedSlots,
          isAvailable: selectedSlots.length > 0,
        });
      }

      await loadAvailability();
      toast({
        title: "Verfügbarkeit gespeichert",
        description: "Die Verfügbarkeit wurde erfolgreich aktualisiert.",
      });
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
      toast({
        title: "Fehler",
        description: "Verfügbarkeit konnte nicht gespeichert werden.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Datum auswählen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => date < new Date()}
            className="text-white"
          />
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">
            Verfügbare Zeiten für {selectedDate && format(selectedDate, "PPP", { locale: de })}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((slot) => (
              <Button
                key={slot}
                variant={selectedSlots.includes(slot) ? "default" : "outline"}
                size="sm"
                onClick={() => handleSlotToggle(slot)}
                className={
                  selectedSlots.includes(slot)
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-white/5 border-white/20 text-white hover:bg-white/10"
                }
              >
                {slot}
              </Button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-gray-400">
              {selectedSlots.length} Zeitslots ausgewählt
            </div>
            <Button
              onClick={handleSaveAvailability}
              disabled={isLoading || !selectedDate}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isLoading ? "Speichern..." : "Verfügbarkeit speichern"}
            </Button>
          </div>

          {selectedSlots.length > 0 && (
            <div className="pt-4 border-t border-white/10">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Ausgewählte Zeiten:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedSlots.map((slot) => (
                  <Badge key={slot} className="bg-red-500/20 text-red-500 border-red-500/30">
                    {slot}
                    <button
                      onClick={() => handleSlotToggle(slot)}
                      className="ml-1 hover:text-red-300"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}