"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ShoppingCart, ArrowRight, ArrowLeft } from "lucide-react";
import { z } from "zod";
import { tiresPurchaseSchema } from "@/types/customer-form";
import {
  FormSelect,
  FormRadio,
  FormInput,
  FormTextarea,
} from "@/components/form/FormFields";

export type TiresPurchaseData = z.infer<typeof tiresPurchaseSchema>;

interface ReifenKaufenStepProps {
  data: Partial<TiresPurchaseData>;
  onNext: (data: TiresPurchaseData) => void;
  onBack: () => void;
  isLastStep?: boolean;
}

const quantityOptions = ["1", "2", "3", "4", "Sonstiges"];
const usageOptions = [
  { value: "sommer", label: "Sommer" },
  { value: "winter", label: "Winter" },
  { value: "ganzjahr", label: "Ganzjahr" },
];
const brandPreferenceOptions = [
  { value: "premium", label: "Premium", desc: "Hochwertige Markenreifen" },
  { value: "basic", label: "Basic", desc: "Gutes Preis-Leistungs-Verhältnis" },
  { value: "low-budget", label: "Low Budget", desc: "Günstige Alternative" },
  {
    value: "gezielt",
    label: "Gezielte Auswahl",
    desc: "Bestimmte Marke auswählen",
  },
];
const targetedBrands = [
  "Bridgestone",
  "Michelin",
  "Pirelli",
  "Continental",
  "Dunlop",
  "Goodyear",
  "Hankook",
  "Yokohama",
  "Falken",
  "Toyo",
  "Sonstiges",
];

export function ReifenKaufenStep({
  data,
  onNext,
  onBack,
  isLastStep = false,
}: ReifenKaufenStepProps) {
  const form = useForm<TiresPurchaseData>({
    resolver: zodResolver(tiresPurchaseSchema),
    defaultValues: data,
    mode: "onChange",
  });

  const watchBrandPref = form.watch("brandPreference");

  const onSubmit = (formData: TiresPurchaseData) => onNext(formData);

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-2xl text-white flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-red-500" />
          Reifen kaufen
        </CardTitle>
        <p className="text-gray-400">Details zum Reifenkauf</p>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormSelect
            label="Stückzahl *"
            field="quantity"
            options={quantityOptions}
            placeholder="Stückzahl auswählen"
            form={form}
          />

          <FormInput
            label="Reifengröße *"
            field="size"
            placeholder="z.B. 225/45 R17 94V"
            helper="Format: Breite/Höhe R Durchmesser Lastindex Geschwindigkeitsindex"
            form={form}
          />

          <FormRadio
            label="Einsatzart *"
            field="usage"
            options={usageOptions}
            form={form}
            columns={3}
          />

          <FormRadio
            label="Hersteller *"
            field="brandPreference"
            options={brandPreferenceOptions}
            form={form}
          />

          {watchBrandPref === "gezielt" && (
            <FormSelect
              label="Gezielter Hersteller *"
              field="targetBrand"
              options={targetedBrands}
              placeholder="Hersteller auswählen"
              form={form}
              highlight="purple"
            />
          )}

          <div>
            <Label className="text-gray-300">Anmerkungen</Label>
            <Textarea
              {...form.register("notes")}
              placeholder="Zusätzliche Wünsche oder Anmerkungen..."
              className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-red-500 resize-none"
              rows={3}
            />
          </div>

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
