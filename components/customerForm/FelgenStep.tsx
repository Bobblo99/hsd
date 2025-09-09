"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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
import { Settings, ArrowRight, ArrowLeft } from "lucide-react";

/** ----- Zod-Schema (englische Keys, deutsche Values) ----- */
const rimsSchema = z
  .object({
    count: z.string().min(1, "Anzahl ist erforderlich"),
    hasBent: z.enum(["ja", "nein"], { required_error: "Bitte auswählen" }),
    damagedCount: z.string().optional(),
    finish: z.enum(
      ["einfarbig", "zweifarbig", "chrom", "smart-repair", "glanzdrehen"],
      { required_error: "Bitte auswählen" }
    ),
    color: z.string().optional(),
    combination: z.string().optional(),
    sticker: z.enum(
      ["audi-sport", "rs-audi", "m-bmw", "kein-aufkleber", "sonstiges"],
      { required_error: "Bitte auswählen" }
    ),
    stickerColor: z.string().optional(),
    notes: z.string().optional(),
    extraServices: z.array(z.string()).optional(), // falls du Zusatzservices brauchst
  })
  .refine(
    (data) => {
      if (data.hasBent === "ja" && !data.damagedCount) return false;
      if (data.finish === "einfarbig" && !data.color) return false;
      if (data.finish === "zweifarbig" && !data.combination) return false;
      if (data.sticker === "audi-sport" && !data.stickerColor) return false;
      return true;
    },
    {
      message: "Bitte füllen Sie alle erforderlichen Felder aus",
      path: ["root"],
    }
  );

export type RimsData = z.infer<typeof rimsSchema>;

interface FelgenStepProps {
  data: Partial<RimsData>;
  onNext: (data: RimsData) => void;
  onBack: () => void;
  isLastStep?: boolean;
}

export function FelgenStep({
  data,
  onNext,
  onBack,
  isLastStep = false,
}: FelgenStepProps) {
  const form = useForm<RimsData>({
    resolver: zodResolver(rimsSchema),
    defaultValues: data,
  });

  const watchHasBent = form.watch("hasBent");
  const watchFinish = form.watch("finish");
  const watchSticker = form.watch("sticker");

  const onSubmit = (formData: RimsData) => onNext(formData);

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

  const isFormValid = () => {
    const v = form.getValues();
    if (!v.count || !v.hasBent || !v.finish || !v.sticker) return false;
    if (v.hasBent === "ja" && !v.damagedCount) return false;
    if (v.finish === "einfarbig" && !v.color) return false;
    if (v.finish === "zweifarbig" && !v.combination) return false;
    if (v.sticker === "audi-sport" && !v.stickerColor) return false;
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
              value={form.watch("count") || ""}
              onValueChange={(value) =>
                form.setValue("count", value, { shouldValidate: true })
              }
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
            {form.formState.errors.count && (
              <p className="text-red-400 text-sm mt-2">
                {form.formState.errors.count.message}
              </p>
            )}
          </div>

          {/* Hat Schlag */}
          <div>
            <Label className="text-gray-300 text-lg mb-3 block">
              Hat die Felge einen Schlag? *
            </Label>
            <RadioGroup
              value={form.watch("hasBent")}
              onValueChange={(value) =>
                form.setValue("hasBent", value as "ja" | "nein", {
                  shouldValidate: true,
                })
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
            {form.formState.errors.hasBent && (
              <p className="text-red-400 text-sm mt-2">
                {form.formState.errors.hasBent.message}
              </p>
            )}
          </div>

          {/* Beschädigte Anzahl (nur wenn Schlag = Ja) */}
          {watchHasBent === "ja" && (
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
                  value={form.watch("damagedCount") || ""}
                  onValueChange={(value) =>
                    form.setValue("damagedCount", value, {
                      shouldValidate: true,
                    })
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
                {watchHasBent === "ja" && !form.watch("damagedCount") && (
                  <p className="text-red-400 text-sm mt-2">
                    Anzahl beschädigter Felgen ist erforderlich
                  </p>
                )}
                {form.formState.errors.damagedCount && (
                  <p className="text-red-400 text-sm mt-2">
                    {form.formState.errors.damagedCount.message}
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
              value={form.watch("finish")}
              onValueChange={(value) =>
                form.setValue("finish", value as any, { shouldValidate: true })
              }
            >
              <div className="space-y-3">
                {[
                  { value: "einfarbig", label: "Einfarbig" },
                  { value: "zweifarbig", label: "Zweifarbig (Bicolour)" },
                  { value: "chrom", label: "Chrom" },
                  { value: "smart-repair", label: "Smart Repair" },
                  { value: "glanzdrehen", label: "Glanzdrehen" },
                ].map((opt) => (
                  <div key={opt.value}>
                    <RadioGroupItem
                      value={opt.value}
                      id={`finish-${opt.value}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`finish-${opt.value}`}
                      className={`flex items-center p-4 rounded-lg border-2 cursor-pointer hover:bg-white/5 transition-all ${
                        form.watch("finish") === opt.value
                          ? "border-red-500 bg-red-500/20"
                          : "border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-white font-medium">
                          {opt.label}
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            form.watch("finish") === opt.value
                              ? "border-red-500 bg-red-500"
                              : "border-white/30"
                          }`}
                        >
                          {form.watch("finish") === opt.value && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
            {form.formState.errors.finish && (
              <p className="text-red-400 text-sm mt-2">
                {form.formState.errors.finish.message}
              </p>
            )}
          </div>

          {/* Farbe / Kombination (conditional) */}
          {(watchFinish === "einfarbig" || watchFinish === "zweifarbig") && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h4 className="text-blue-400 font-medium mb-4 flex items-center gap-2">
                <Settings className="h-4 w-4" />
                {watchFinish === "einfarbig"
                  ? "Farbe auswählen"
                  : "Kombination auswählen"}
              </h4>

              {watchFinish === "einfarbig" && (
                <div>
                  <Label className="text-gray-300">Farbe auswählen *</Label>
                  <Select
                    value={form.watch("color") || ""}
                    onValueChange={(value) =>
                      form.setValue("color", value, { shouldValidate: true })
                    }
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
                  {watchFinish === "einfarbig" && !form.watch("color") && (
                    <p className="text-red-400 text-sm mt-2">
                      Farbe ist erforderlich
                    </p>
                  )}
                  {form.formState.errors.color && (
                    <p className="text-red-400 text-sm mt-2">
                      {form.formState.errors.color.message}
                    </p>
                  )}
                </div>
              )}

              {watchFinish === "zweifarbig" && (
                <div>
                  <Label className="text-gray-300">
                    Kombination auswählen *
                  </Label>
                  <Select
                    value={form.watch("combination") || ""}
                    onValueChange={(value) =>
                      form.setValue("combination", value, {
                        shouldValidate: true,
                      })
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
                  {watchFinish === "zweifarbig" &&
                    !form.watch("combination") && (
                      <p className="text-red-400 text-sm mt-2">
                        Kombination ist erforderlich
                      </p>
                    )}
                  {form.formState.errors.combination && (
                    <p className="text-red-400 text-sm mt-2">
                      {form.formState.errors.combination.message}
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
              value={form.watch("sticker")}
              onValueChange={(value) =>
                form.setValue("sticker", value as any, { shouldValidate: true })
              }
            >
              <div className="space-y-3">
                {[
                  { value: "audi-sport", label: "Audi Sport" },
                  { value: "rs-audi", label: "RS (Audi)" },
                  { value: "m-bmw", label: "M (BMW)" },
                  { value: "kein-aufkleber", label: "Kein Aufkleber" },
                  { value: "sonstiges", label: "Sonstiges" },
                ].map((opt) => (
                  <div key={opt.value}>
                    <RadioGroupItem
                      value={opt.value}
                      id={`sticker-${opt.value}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`sticker-${opt.value}`}
                      className={`flex items-center p-4 rounded-lg border-2 cursor-pointer hover:bg-white/5 transition-all ${
                        form.watch("sticker") === opt.value
                          ? "border-red-500 bg-red-500/20"
                          : "border-white/20"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-white font-medium">
                          {opt.label}
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            form.watch("sticker") === opt.value
                              ? "border-red-500 bg-red-500"
                              : "border-white/30"
                          }`}
                        >
                          {form.watch("sticker") === opt.value && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
            {form.formState.errors.sticker && (
              <p className="text-red-400 text-sm mt-2">
                {form.formState.errors.sticker.message}
              </p>
            )}
          </div>

          {/* Aufkleber-Farbe (nur Audi Sport) */}
          {watchSticker === "audi-sport" && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
              <h4 className="text-red-400 font-medium mb-4 flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Audi Sport Aufkleber Farbe
              </h4>
              <div>
                <Label className="text-gray-300">Aufkleber Farbe *</Label>
                <Select
                  value={form.watch("stickerColor") || ""}
                  onValueChange={(value) =>
                    form.setValue("stickerColor", value, {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger className="bg-white/5 border-white/20 text-white">
                    <SelectValue placeholder="Farbe auswählen" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {stickerFarbenOptions.map((farbe) => (
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
                {watchSticker === "audi-sport" &&
                  !form.watch("stickerColor") && (
                    <p className="text-red-400 text-sm mt-2">
                      Aufkleber Farbe ist erforderlich
                    </p>
                  )}
                {form.formState.errors.stickerColor && (
                  <p className="text-red-400 text-sm mt-2">
                    {form.formState.errors.stickerColor.message}
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
