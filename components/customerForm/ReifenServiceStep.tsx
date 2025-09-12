"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, ArrowRight, ArrowLeft } from "lucide-react";
import { FormTextarea } from "@/components/form/FormFields";
import { tireServiceSchema } from "@/types/customer-form";

export type TireServiceData = z.infer<typeof tireServiceSchema>;

interface ReifenServiceStepProps {
  data: Partial<TireServiceData>;
  onNext: (data: TireServiceData) => void;
  onBack: () => void;
  isLastStep?: boolean;
}

export function ReifenServiceStep({
  data,
  onNext,
  onBack,
  isLastStep = false,
}: ReifenServiceStepProps) {
  const form = useForm<TireServiceData>({
    resolver: zodResolver(tireServiceSchema),
    defaultValues: data,
    mode: "onChange",
  });

  const onSubmit = (formData: TireServiceData) => onNext(formData);

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-2xl text-white flex items-center gap-2">
          <Wrench className="h-6 w-6 text-red-500" />
          Reifenservice
        </CardTitle>
        <p className="text-gray-400">Details zum Reifenservice</p>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Montageservice */}
          <FormTextarea<TireServiceData>
            label="Welchen Montageservice möchten Sie nutzen? *"
            field="mountService"
            placeholder="Beschreiben Sie den gewünschten Montageservice (z.B. Reifen aufziehen, Wuchten, Ventile tauschen, etc.)"
            form={form}
          />

          {/* Beispiele */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h4 className="text-white font-medium mb-3">
              Beispiele für Montageservices:
            </h4>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Reifen ab- und aufziehen</li>
              <li>• Räder auswuchten</li>
              <li>• Ventile erneuern</li>
              <li>• Reifendruckkontrolle</li>
              <li>• Montage am Fahrzeug</li>
              <li>• Einlagerung alter Reifen</li>
            </ul>
          </div>

          {/* Anmerkungen */}
          <FormTextarea<TireServiceData>
            label="Anmerkungen"
            field="notes"
            placeholder="Zusätzliche Wünsche oder Anmerkungen..."
            form={form}
          />

          {/* Navigation */}
          <div className="flex gap-4">
            <Button
              type="button"
              onClick={onBack}
              variant="outline"
              className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück
            </Button>
            <Button
              type="submit"
              disabled={!form.formState.isValid}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLastStep ? "Anfrage absenden" : "Weiter"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
