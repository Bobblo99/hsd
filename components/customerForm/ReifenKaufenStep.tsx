"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
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

/** ---------- Zod Schema: englische Keys, deutsche Values ---------- */
const tiresPurchaseSchema = z
  .object({
    quantity: z.string().min(1, "Stückzahl ist erforderlich"),
    size: z.string().min(1, "Reifengröße ist erforderlich"),
    usage: z.enum(["sommer", "winter", "ganzjahr"], {
      required_error: "Bitte auswählen",
    }),
    brandPreference: z.enum(["premium", "basic", "low-budget", "gezielt"], {
      required_error: "Bitte auswählen",
    }),
    specificBrand: z.string().optional(),
    notes: z.string().optional(),
  })
  .refine(
    (data) =>
      data.brandPreference !== "gezielt" || !!data.specificBrand?.trim(),
    {
      message: "Gezielter Hersteller ist erforderlich",
      path: ["specificBrand"],
    }
  );

export type TiresPurchaseData = z.infer<typeof tiresPurchaseSchema>;

interface ReifenKaufenStepProps {
  data: Partial<TiresPurchaseData>;
  onNext: (data: TiresPurchaseData) => void;
  onBack: () => void;
  isLastStep?: boolean;
}

export function ReifenKaufenStep({
  data,
  onNext,
  onBack,
  isLastStep = false,
}: ReifenKaufenStepProps) {
  const form = useForm<TiresPurchaseData>({
    resolver: zodResolver(tiresPurchaseSchema),
    defaultValues: data,
  });

  const watchBrandPref = form.watch("brandPreference");

  const onSubmit = (formData: TiresPurchaseData) => onNext(formData);

  const quantityOptions = ["1", "2", "3", "4", "Sonstiges"];
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

  const isFormValid = () => {
    const v = form.getValues();
    if (!v.quantity || !v.size || !v.usage || !v.brandPreference) return false;
    if (v.brandPreference === "gezielt" && !v.specificBrand) return false;
    return true;
    // (zod fängt’s ohnehin ab – hier nur fürs Button-Disable UX)
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
              value={form.watch("quantity") || ""}
              onValueChange={(value) =>
                form.setValue("quantity", value, { shouldValidate: true })
              }
            >
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Stückzahl auswählen" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {quantityOptions.map((option) => (
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
            {form.formState.errors.quantity && (
              <p className="text-red-400 text-sm mt-2">
                {form.formState.errors.quantity.message}
              </p>
            )}
          </div>

          {/* Reifengröße */}
          <div>
            <Label className="text-gray-300">Reifengröße *</Label>
            <Input
              {...form.register("size")}
              placeholder="z.B. 225/45 R17 94V"
              className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-red-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              Format: Breite/Höhe R Durchmesser Lastindex Geschwindigkeitsindex
            </p>
            {form.formState.errors.size && (
              <p className="text-red-400 text-sm mt-1">
                {form.formState.errors.size.message}
              </p>
            )}
          </div>

          {/* Einsatzart */}
          <div>
            <Label className="text-gray-300 text-lg mb-3 block">
              Einsatzart *
            </Label>
            <RadioGroup
              value={form.watch("usage")}
              onValueChange={(value) =>
                form.setValue("usage", value as any, { shouldValidate: true })
              }
            >
              <div className="grid grid-cols-3 gap-4">
                {[
                  {
                    value: "sommer",
                    label: "Sommer",
                  },
                  {
                    value: "winter",
                    label: "Winter",
                  },
                  {
                    value: "ganzjahr",
                    label: "Ganzjahr",
                  },
                ].map((option) => (
                  <div key={option.value}>
                    <RadioGroupItem
                      value={option.value}
                      id={`usage-${option.value}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`usage-${option.value}`}
                      className={`flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer peer-checked:border-red-500 peer-checked:bg-red-500/20 hover:bg-white/5 transition-all ${
                        form.watch("usage") === option.value
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
            {form.formState.errors.usage && (
              <p className="text-red-400 text-sm mt-2">
                {form.formState.errors.usage.message}
              </p>
            )}
          </div>

          {/* Hersteller-Kategorie */}
          <div>
            <Label className="text-gray-300 text-lg mb-3 block">
              Hersteller *
            </Label>
            <RadioGroup
              value={form.watch("brandPreference")}
              onValueChange={(value) =>
                form.setValue("brandPreference", value as any, {
                  shouldValidate: true,
                })
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
                      id={`brand-${option.value}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`brand-${option.value}`}
                      className={`flex items-center p-4 rounded-lg border-2 cursor-pointer hover:bg-white/5 transition-all ${
                        form.watch("brandPreference") === option.value
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
                            form.watch("brandPreference") === option.value
                              ? "border-red-500 bg-red-500"
                              : "border-white/30"
                          }`}
                        >
                          {form.watch("brandPreference") === option.value && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
            {form.formState.errors.brandPreference && (
              <p className="text-red-400 text-sm mt-2">
                {form.formState.errors.brandPreference.message}
              </p>
            )}
          </div>

          {/* Gezielter Hersteller */}
          {watchBrandPref === "gezielt" && (
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
              <h4 className="text-purple-400 font-medium mb-4 flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Gezielter Hersteller
              </h4>
              <div>
                <Label className="text-gray-300">Hersteller auswählen *</Label>
                <Select
                  value={form.watch("specificBrand") || ""}
                  onValueChange={(value) =>
                    form.setValue("specificBrand", value, {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Hersteller auswählen" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {targetedBrands.map((brand) => (
                      <SelectItem
                        key={brand}
                        value={brand}
                        className="text-white hover:bg-white/10"
                      >
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {watchBrandPref === "gezielt" &&
                  !form.watch("specificBrand") && (
                    <p className="text-red-400 text-sm mt-2">
                      Hersteller ist erforderlich
                    </p>
                  )}
                {form.formState.errors.specificBrand && (
                  <p className="text-red-400 text-sm mt-2">
                    {form.formState.errors.specificBrand.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Anmerkungen */}
          <div>
            <Label className="text-gray-300">Anmerkungen</Label>
            <Textarea
              {...form.register("notes")}
              placeholder="Zusätzliche Wünsche oder Anmerkungen..."
              className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-red-500 resize-none"
              rows={3}
            />
          </div>

          {/* Hinweis */}
          {!isFormValid() && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-400 text-sm">
                Bitte füllen Sie alle erforderlichen Felder aus, um
                fortzufahren.
              </p>
            </div>
          )}

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
