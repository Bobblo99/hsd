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
import { Settings, ArrowRight, ArrowLeft, Plus } from "lucide-react";
import { ServiceType } from "./ServiceSelectionStep";

const felgenSchema = z
  .object({
    anzahl: z.string().min(1, "Anzahl ist erforderlich"),
    hatSchlag: z.enum(["ja", "nein"], { required_error: "Bitte auswählen" }),
    beschaedigteAnzahl: z.string().optional(),
    aufbereitungsart: z.enum(
      ["einfarbig", "zweifarbig", "chrom", "smart-repair", "glanzdrehen"],
      { required_error: "Bitte auswählen" }
    ),
    farbe: z.string().optional(),
    kombination: z.string().optional(),
    aufkleber: z.enum(
      ["audi-sport", "rs-audi", "m-bmw", "kein-aufkleber", "sonstiges"],
      { required_error: "Bitte auswählen" }
    ),
    aufkleberFarbe: z.string().optional(),
    anmerkungen: z.string().optional(),
    weitereServices: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      // Conditional validation
      if (data.hatSchlag === "ja" && !data.beschaedigteAnzahl) {
        return false;
      }
      if (data.aufbereitungsart === "einfarbig" && !data.farbe) {
        return false;
      }
      if (data.aufbereitungsart === "zweifarbig" && !data.kombination) {
        return false;
      }
      if (data.aufkleber === "audi-sport" && !data.aufkleberFarbe) {
        return false;
      }
      return true;
    },
    {
      message: "Bitte füllen Sie alle erforderlichen Felder aus",
      path: ["root"],
    }
  );

type FelgenData = z.infer<typeof felgenSchema>;

interface FelgenStepProps {
  data: Partial<FelgenData>;
  onNext: (data: FelgenData) => void;
  onBack: () => void;
  isLastStep?: boolean;
}

export function FelgenStep({
  data,
  onNext,
  onBack,
  isLastStep = false,
}: FelgenStepProps) {
  const form = useForm<FelgenData>({
    resolver: zodResolver(felgenSchema),
    defaultValues: data,
  });

  const watchHatSchlag = form.watch("hatSchlag");
  const watchAufbereitungsart = form.watch("aufbereitungsart");
  const watchAufkleber = form.watch("aufkleber");

  const onSubmit = (formData: FelgenData) => {
    if (isLastStep) {
      // Save data and trigger submission
      onNext(formData);
    } else {
      onNext(formData);
    }
  };

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
  const aufkleberFarbenOptions = ["Schwarz", "Grau", "Rot"];

  // Validation check
  const isFormValid = () => {
    const values = form.getValues();
    if (
      !values.anzahl ||
      !values.hatSchlag ||
      !values.aufbereitungsart ||
      !values.aufkleber
    ) {
      return false;
    }
    if (values.hatSchlag === "ja" && !values.beschaedigteAnzahl) {
      return false;
    }
    if (values.aufbereitungsart === "einfarbig" && !values.farbe) {
      return false;
    }
    if (values.aufbereitungsart === "zweifarbig" && !values.kombination) {
      return false;
    }
    if (values.aufkleber === "audi-sport" && !values.aufkleberFarbe) {
      return false;
    }
    return true;
  };
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
          <div>
            <Label className="text-gray-300 text-lg mb-3 block">
              Anzahl Felgen *
            </Label>
            <Select
              value={form.watch("anzahl") || ""}
              onValueChange={(value) => form.setValue("anzahl", value)}
            >
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue placeholder="Anzahl auswählen" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {anzahlOptions.map((option) => (
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
            {form.formState.errors.anzahl && (
              <p className="text-red-400 text-sm mt-2">
                {form.formState.errors.anzahl.message}
              </p>
            )}
          </div>

          {/* Hat Schlag */}
          <div>
            <Label className="text-gray-300 text-lg mb-3 block">
              Hat die Felge einen Schlag? *
            </Label>
            <RadioGroup
              value={form.watch("hatSchlag")}
              onValueChange={(value) =>
                form.setValue("hatSchlag", value as "ja" | "nein")
              }
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <RadioGroupItem
                    value="ja"
                    id="schlag-ja"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="schlag-ja"
                    className="flex items-center justify-center p-4 rounded-lg border-2 border-white/20 cursor-pointer peer-checked:border-red-500 peer-checked:bg-red-500/20 hover:bg-white/5 transition-all"
                  >
                    <span className="text-white font-medium">Ja</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="nein"
                    id="schlag-nein"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="schlag-nein"
                    className="flex items-center justify-center p-4 rounded-lg border-2 border-white/20 cursor-pointer peer-checked:border-red-500 peer-checked:bg-red-500/20 hover:bg-white/5 transition-all"
                  >
                    <span className="text-white font-medium">Nein</span>
                  </Label>
                </div>
              </div>
            </RadioGroup>
            {form.formState.errors.hatSchlag && (
              <p className="text-red-400 text-sm mt-2">
                {form.formState.errors.hatSchlag.message}
              </p>
            )}
          </div>

          {/* Beschädigte Anzahl (nur wenn Schlag = Ja) */}
          {watchHatSchlag === "ja" && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <h4 className="text-yellow-400 font-medium mb-4 flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Beschädigte Felgen
              </h4>
              <div>
                <Label className="text-gray-300">
                  Wie viele Felgen sind beschädigt?
                </Label>
                <Select
                  value={form.watch("beschaedigteAnzahl")}
                  onValueChange={(value) =>
                    form.setValue("beschaedigteAnzahl", value)
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Anzahl auswählen" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {["0", "1", "2", "3", "4", "Sonstiges"].map((option) => (
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
                {watchHatSchlag === "ja" &&
                  !form.watch("beschaedigteAnzahl") && (
                    <p className="text-red-400 text-sm mt-2">
                      Anzahl beschädigter Felgen ist erforderlich
                    </p>
                  )}
                {form.formState.errors.beschaedigteAnzahl && (
                  <p className="text-red-400 text-sm mt-2">
                    {form.formState.errors.beschaedigteAnzahl.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Aufbereitungsart */}
          <div>
            <Label className="text-gray-300 text-lg mb-3 block">
              Wie soll die Felge aufbereitet werden? *
            </Label>
            <RadioGroup
              value={form.watch("aufbereitungsart")}
              onValueChange={(value) =>
                form.setValue("aufbereitungsart", value as any)
              }
            >
              <div className="space-y-3">
                {[
                  { value: "einfarbig", label: "Einfarbig" },
                  { value: "zweifarbig", label: "Zweifarbig (Bicolour)" },
                  { value: "chrom", label: "Chrom" },
                  { value: "smart-repair", label: "Smart Repair" },
                  { value: "glanzdrehen", label: "Glanzdrehen" },
                ].map((option) => (
                  <div key={option.value}>
                    <RadioGroupItem
                      value={option.value}
                      id={`art-${option.value}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`art-${option.value}`}
                      className={`flex items-center p-4 rounded-lg border-2 cursor-pointer hover:bg-white/5 transition-all ${
                        form.watch("aufbereitungsart") === option.value
                          ? "border-red-500 bg-red-500/20"
                          : "border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-white font-medium">
                          {option.label}
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            form.watch("aufbereitungsart") === option.value
                              ? "border-red-500 bg-red-500"
                              : "border-white/30"
                          }`}
                        >
                          {form.watch("aufbereitungsart") === option.value && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
            {form.formState.errors.aufbereitungsart && (
              <p className="text-red-400 text-sm mt-2">
                {form.formState.errors.aufbereitungsart.message}
              </p>
            )}
          </div>

          {/* Farbe (nur bei einfarbig) */}
          {/* Conditional Fields - Übersichtlicher */}
          {(watchAufbereitungsart === "einfarbig" ||
            watchAufbereitungsart === "zweifarbig") && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h4 className="text-blue-400 font-medium mb-4 flex items-center gap-2">
                <Settings className="h-4 w-4" />
                {watchAufbereitungsart === "einfarbig"
                  ? "Farbe auswählen"
                  : "Kombination auswählen"}
              </h4>

              {watchAufbereitungsart === "einfarbig" && (
                <div>
                  <Label className="text-gray-300">Farbe auswählen *</Label>
                  <Select
                    value={form.watch("farbe")}
                    onValueChange={(value) => form.setValue("farbe", value)}
                  >
                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                      <SelectValue placeholder="Farbe auswählen" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {farbenOptions.map((farbe) => (
                        <SelectItem
                          key={farbe}
                          value={farbe}
                          className="text-white hover:bg-white/10"
                        >
                          {farbe}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {watchAufbereitungsart === "einfarbig" &&
                    !form.watch("farbe") && (
                      <p className="text-red-400 text-sm mt-2">
                        Farbe ist erforderlich
                      </p>
                    )}
                  {form.formState.errors.farbe && (
                    <p className="text-red-400 text-sm mt-2">
                      {form.formState.errors.farbe.message}
                    </p>
                  )}
                </div>
              )}

              {watchAufbereitungsart === "zweifarbig" && (
                <div>
                  <Label className="text-gray-300">
                    Kombination auswählen *
                  </Label>
                  <Select
                    value={form.watch("kombination")}
                    onValueChange={(value) =>
                      form.setValue("kombination", value)
                    }
                  >
                    <SelectTrigger className="bg-white/5 border-white/20 text-white">
                      <SelectValue placeholder="Kombination auswählen" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      {kombinationOptions.map((kombi) => (
                        <SelectItem
                          key={kombi}
                          value={kombi}
                          className="text-white hover:bg-white/10"
                        >
                          {kombi}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {watchAufbereitungsart === "zweifarbig" &&
                    !form.watch("kombination") && (
                      <p className="text-red-400 text-sm mt-2">
                        Kombination ist erforderlich
                      </p>
                    )}
                  {form.formState.errors.kombination && (
                    <p className="text-red-400 text-sm mt-2">
                      {form.formState.errors.kombination.message}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Aufkleber */}
          <div>
            <Label className="text-gray-300 text-lg mb-3 block">
              Aufkleber *
            </Label>
            <RadioGroup
              value={form.watch("aufkleber")}
              onValueChange={(value) =>
                form.setValue("aufkleber", value as any)
              }
            >
              <div className="space-y-3">
                {[
                  { value: "audi-sport", label: "Audi Sport" },
                  { value: "rs-audi", label: "RS (Audi)" },
                  { value: "m-bmw", label: "M (BMW)" },
                  { value: "kein-aufkleber", label: "Kein Aufkleber" },
                  { value: "sonstiges", label: "Sonstiges" },
                ].map((option) => (
                  <div key={option.value}>
                    <RadioGroupItem
                      value={option.value}
                      id={`aufkleber-${option.value}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`aufkleber-${option.value}`}
                      className={`flex items-center p-4 rounded-lg border-2 cursor-pointer hover:bg-white/5 transition-all ${
                        form.watch("aufkleber") === option.value
                          ? "border-red-500 bg-red-500/20"
                          : "border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-white font-medium">
                          {option.label}
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            form.watch("aufkleber") === option.value
                              ? "border-red-500 bg-red-500"
                              : "border-white/30"
                          }`}
                        >
                          {form.watch("aufkleber") === option.value && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
            {form.formState.errors.aufkleber && (
              <p className="text-red-400 text-sm mt-2">
                {form.formState.errors.aufkleber.message}
              </p>
            )}
          </div>

          {/* Aufkleber Farbe (nur bei Audi Sport) */}
          {watchAufkleber === "audi-sport" && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <h4 className="text-red-400 font-medium mb-4 flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Audi Sport Aufkleber Farbe
              </h4>
              <div>
                <Label className="text-gray-300">Aufkleber Farbe *</Label>
                <Select
                  value={form.watch("aufkleberFarbe")}
                  onValueChange={(value) =>
                    form.setValue("aufkleberFarbe", value)
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Farbe auswählen" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {aufkleberFarbenOptions.map((farbe) => (
                      <SelectItem
                        key={farbe}
                        value={farbe}
                        className="text-white hover:bg-white/10"
                      >
                        {farbe}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {watchAufkleber === "audi-sport" &&
                  !form.watch("aufkleberFarbe") && (
                    <p className="text-red-400 text-sm mt-2">
                      Aufkleber Farbe ist erforderlich
                    </p>
                  )}
                {form.formState.errors.aufkleberFarbe && (
                  <p className="text-red-400 text-sm mt-2">
                    {form.formState.errors.aufkleberFarbe.message}
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
