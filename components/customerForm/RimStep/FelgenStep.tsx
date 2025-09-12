"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { rimsSchema } from "@/types/customer-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, ArrowRight, ArrowLeft } from "lucide-react";

import {
  FormSelect,
  FormRadio,
  FormTextarea,
} from "@/components/form/FormFields";

export type RimsData = z.infer<typeof rimsSchema>;

interface FelgenStepProps {
  data: Partial<RimsData>;
  onNext: (data: RimsData) => void;
  onBack: () => void;
  isLastStep?: boolean;
}

const anzahlOptions = ["1", "2", "3", "4", "Sonstiges"];
const farbenOptions = [
  "Schwarz-Glanz",
  "Schwarz-Matt",
  "Silber",
  "Anthrazit",
  "Weiß",
  "Sonstiges",
];
const kombinationOptions = [
  "Glanzgedrehte Front + Schwarz",
  "Glanzgedrehte Front + Silber",
  "Glanzgedrehte Front + Anthrazit",
  "Sonstiges",
];
const stickerFarbenOptions = ["Schwarz", "Grau", "Rot"];
const finishOptions = [
  { value: "einfarbig", label: "Einfarbig" },
  { value: "zweifarbig", label: "Zweifarbig (Bicolour)" },
  { value: "chrom", label: "Chrom" },
  { value: "smart-repair", label: "Smart Repair" },
  { value: "glanzdrehen", label: "Glanzdrehen" },
];
const stickerOptions = [
  { value: "audi-sport", label: "Audi Sport" },
  { value: "rs-audi", label: "RS (Audi)" },
  { value: "m-bmw", label: "M (BMW)" },
  { value: "kein-aufkleber", label: "Kein Aufkleber" },
  { value: "sonstiges", label: "Sonstiges" },
];

export function FelgenStep({
  data,
  onNext,
  onBack,
  isLastStep = false,
}: FelgenStepProps) {
  const form = useForm<RimsData>({
    resolver: zodResolver(rimsSchema),
    defaultValues: data,
    mode: "onChange",
  });

  const watchHasBent = form.watch("hasBent");
  const watchFinish = form.watch("finish");
  const watchSticker = form.watch("sticker");

  const onSubmit = (formData: RimsData) => onNext(formData);

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-2xl text-white flex items-center gap-2">
          <Settings className="h-6 w-6 text-red-500" />
          Felgen Aufbereitung
        </CardTitle>
        <p className="text-gray-400">Details zur Felgenaufbereitung</p>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Anzahl Felgen */}
          <FormSelect
            label="Anzahl Felgen *"
            field="count"
            options={anzahlOptions}
            placeholder="Anzahl auswählen"
            form={form}
          />

          {/* Hat Schlag */}
          <FormRadio
            label="Hat die Felge einen Schlag? *"
            field="hasBent"
            options={[
              { value: "ja", label: "Ja" },
              { value: "nein", label: "Nein" },
            ]}
            form={form}
            columns={2} // Nutzen der 'columns' Prop für besseres Layout
          />

          {/* Beschädigte Anzahl */}
          {watchHasBent === "ja" && (
            <FormSelect
              label="Wie viele Felgen sind beschädigt? *"
              field="damagedCount"
              options={anzahlOptions}
              placeholder="Anzahl auswählen"
              form={form}
              highlight="yellow"
            />
          )}

          {/* Aufbereitungsart */}
          <FormRadio
            label="Wie soll die Felge aufbereitet werden? *"
            field="finish"
            options={finishOptions}
            form={form}
            columns={2}
          />

          {/* Farbe / Kombination */}
          {watchFinish === "einfarbig" && (
            <FormSelect
              label="Farbe auswählen *"
              field="color"
              options={farbenOptions}
              placeholder="Farbe auswählen"
              form={form}
              highlight="blue"
            />
          )}
          {watchFinish === "zweifarbig" && (
            <FormSelect
              label="Kombination auswählen *"
              field="combination"
              options={kombinationOptions}
              placeholder="Kombination auswählen"
              form={form}
              highlight="blue"
            />
          )}

          {/* Aufkleber */}
          <FormRadio
            label="Aufkleber *"
            field="sticker"
            options={stickerOptions}
            form={form}
            columns={2}
          />

          {/* Aufkleber-Farbe */}
          {watchSticker === "audi-sport" && (
            <FormSelect
              label="Audi Sport Aufkleber Farbe *"
              field="stickerColor"
              options={stickerFarbenOptions}
              placeholder="Farbe auswählen"
              form={form}
              highlight="red"
            />
          )}

          {/* Anmerkungen (jetzt mit FormTextarea) */}
          <FormTextarea
            label="Anmerkungen"
            field="notes"
            form={form}
            placeholder="Zusätzliche Wünsche oder Anmerkungen..."
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
