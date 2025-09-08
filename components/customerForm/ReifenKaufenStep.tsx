"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShoppingCart, ArrowRight, ArrowLeft } from "lucide-react";
import { ServiceType } from "./ServiceSelectionStep";

const reifenKaufenSchema = z
  .object({
    stueckzahl: z.string().min(1, "Stückzahl ist erforderlich"),
    reifengroesse: z.string().min(1, "Reifengröße ist erforderlich"),
    einsatzart: z.enum(["sommer", "winter", "ganzjahr"], {
      required_error: "Bitte auswählen",
    }),
    herstellerKategorie: z.enum(["premium", "basic", "low-budget", "gezielt"], {
      required_error: "Bitte auswählen",
    }),
    gezielterHersteller: z.string().optional(),
    anmerkungen: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.herstellerKategorie === "gezielt" && !data.gezielterHersteller) {
        return false;
      }
      return true;
    },
    {
      message: "Gezielter Hersteller ist erforderlich",
      path: ["gezielterHersteller"],
    }
  );

type ReifenKaufenData = z.infer<typeof reifenKaufenSchema>;

interface ReifenKaufenStepProps {
  data: Partial<ReifenKaufenData>;
  onNext: (data: ReifenKaufenData) => void;
  onBack: () => void;
  isLastStep?: boolean;
}

export function ReifenKaufenStep({
  data,
  onNext,
  onBack,
  isLastStep = false,
}: ReifenKaufenStepProps) {
  const form = useForm<ReifenKaufenData>({
    resolver: zodResolver(reifenKaufenSchema),
    defaultValues: data,
  });

  const watchHerstellerKategorie = form.watch("herstellerKategorie");

  const onSubmit = (formData: ReifenKaufenData) => {
    if (isLastStep) {
      // Save data and trigger submission
      onNext(formData);
    } else {
      onNext(formData);
    }
  };

  const stueckzahlOptions = ["1", "2", "3", "4", "Sonstiges"];
  const gezielteHersteller = [
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

  // Validation check
  const isFormValid = () => {
    const values = form.getValues();
    if (
      !values.stueckzahl ||
      !values.reifengroesse ||
      !values.einsatzart ||
      !values.herstellerKategorie
    ) {
      return false;
    }
    if (
      values.herstellerKategorie === "gezielt" &&
      !values.gezielterHersteller
    ) {
      return false;
    }
    return true;
  };
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
          {/* Stückzahl */}
          <div>
            <Label className="text-gray-300 text-lg mb-3 block">
              Stückzahl *
            </Label>
            <Select
              value={form.watch("stueckzahl") || ""}
              onValueChange={(value) => form.setValue("stueckzahl", value)}
            >
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Stückzahl auswählen" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {stueckzahlOptions.map((option) => (
                  <SelectItem
                    key={option}
                    value={option}
                    className="text-white hover:bg-white/10"
                  >
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.stueckzahl && (
              <p className="text-red-400 text-sm mt-2">
                {form.formState.errors.stueckzahl.message}
              </p>
            )}
          </div>

          {/* Reifengröße */}
          <div>
            <Label className="text-gray-300">Reifengröße *</Label>
            <Input
              {...form.register("reifengroesse")}
              placeholder="z.B. 225/45 R17 94V"
              className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-red-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              Format: Breite/Höhe R Durchmesser Lastindex Geschwindigkeitsindex
            </p>
            {form.formState.errors.reifengroesse && (
              <p className="text-red-400 text-sm mt-1">
                {form.formState.errors.reifengroesse.message}
              </p>
            )}
          </div>

          {/* Einsatzart */}
          <div>
            <Label className="text-gray-300 text-lg mb-3 block">
              Einsatzart *
            </Label>
            <RadioGroup
              value={form.watch("einsatzart")}
              onValueChange={(value) =>
                form.setValue("einsatzart", value as any)
              }
            >
              <div className="grid grid-cols-3 gap-4">
                {[
                  {
                    value: "sommer",
                    label: "Sommer",
                    color: "bg-yellow-500/20 border-yellow-500/30",
                  },
                  {
                    value: "winter",
                    label: "Winter",
                    color: "bg-blue-500/20 border-blue-500/30",
                  },
                  {
                    value: "ganzjahr",
                    label: "Ganzjahr",
                    color: "bg-green-500/20 border-green-500/30",
                  },
                ].map((option) => (
                  <div key={option.value}>
                    <RadioGroupItem
                      value={option.value}
                      id={`einsatz-${option.value}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`einsatz-${option.value}`}
                      className={`flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer peer-checked:border-red-500 peer-checked:bg-red-500/20 hover:bg-white/5 transition-all ${
                        form.watch("einsatzart") === option.value
                          ? "border-red-500 bg-red-500/20"
                          : "border-white/20"
                      }`}
                    >
                      <span className="text-white font-medium">
                        {option.label}
                      </span>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
            {form.formState.errors.einsatzart && (
              <p className="text-red-400 text-sm mt-2">
                {form.formState.errors.einsatzart.message}
              </p>
            )}
          </div>

          {/* Hersteller Kategorie */}
          <div>
            <Label className="text-gray-300 text-lg mb-3 block">
              Hersteller *
            </Label>
            <RadioGroup
              value={form.watch("herstellerKategorie")}
              onValueChange={(value) =>
                form.setValue("herstellerKategorie", value as any)
              }
            >
              <div className="space-y-3">
                {[
                  {
                    value: "premium",
                    label: "Premium",
                    desc: "Hochwertige Markenreifen",
                  },
                  {
                    value: "basic",
                    label: "Basic",
                    desc: "Gutes Preis-Leistungs-Verhältnis",
                  },
                  {
                    value: "low-budget",
                    label: "Low Budget",
                    desc: "Günstige Alternative",
                  },
                  {
                    value: "gezielt",
                    label: "Gezielte Auswahl",
                    desc: "Bestimmte Marke auswählen",
                  },
                ].map((option) => (
                  <div key={option.value}>
                    <RadioGroupItem
                      value={option.value}
                      id={`hersteller-${option.value}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`hersteller-${option.value}`}
                      className={`flex items-center p-4 rounded-lg border-2 cursor-pointer hover:bg-white/5 transition-all ${
                        form.watch("herstellerKategorie") === option.value
                          ? "border-red-500 bg-red-500/20"
                          : "border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <span className="text-white font-medium block">
                            {option.label}
                          </span>
                          <span className="text-gray-400 text-sm">
                            {option.desc}
                          </span>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            form.watch("herstellerKategorie") === option.value
                              ? "border-red-500 bg-red-500"
                              : "border-white/30"
                          }`}
                        >
                          {form.watch("herstellerKategorie") ===
                            option.value && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
            {form.formState.errors.herstellerKategorie && (
              <p className="text-red-400 text-sm mt-2">
                {form.formState.errors.herstellerKategorie.message}
              </p>
            )}
          </div>

          {/* Gezielter Hersteller (nur bei gezielter Auswahl) */}
          {watchHerstellerKategorie === "gezielt" && (
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
              <h4 className="text-purple-400 font-medium mb-4 flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Gezielter Hersteller
              </h4>
              <div>
                <Label className="text-gray-300">Hersteller auswählen *</Label>
                <Select
                  value={form.watch("gezielterHersteller")}
                  onValueChange={(value) =>
                    form.setValue("gezielterHersteller", value)
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Hersteller auswählen" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {gezielteHersteller.map((hersteller) => (
                      <SelectItem
                        key={hersteller}
                        value={hersteller}
                        className="text-white hover:bg-white/10"
                      >
                        {hersteller}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {watchHerstellerKategorie === "gezielt" &&
                  !form.watch("gezielterHersteller") && (
                    <p className="text-red-400 text-sm mt-2">
                      Hersteller ist erforderlich
                    </p>
                  )}
                {form.formState.errors.gezielterHersteller && (
                  <p className="text-red-400 text-sm mt-2">
                    {form.formState.errors.gezielterHersteller.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Anmerkungen */}
          <div>
            <Label className="text-gray-300">Anmerkungen</Label>
            <Textarea
              {...form.register("anmerkungen")}
              placeholder="Zusätzliche Wünsche oder Anmerkungen..."
              className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-red-500 resize-none"
              rows={3}
            />
          </div>

          {/* Validation Warning */}
          {!isFormValid() && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-400 text-sm">
                Bitte füllen Sie alle erforderlichen Felder aus, um
                fortzufahren.
              </p>
            </div>
          )}
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
              disabled={!isFormValid()}
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
