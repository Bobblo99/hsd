"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, ArrowRight } from "lucide-react";
import { z } from "zod";
import { contactSchema } from "@/types/customer-form";

type ContactData = z.infer<typeof contactSchema>;

interface ContactDataStepProps {
  data: Partial<ContactData>;
  onNext: (data: ContactData) => void;
}

type FieldConfig = {
  id: keyof ContactData;
  label: string;
  placeholder: string;
  type?: string;
  maxLength?: number;
  icon?: React.ReactNode;
  colSpan?: number;
  gridArea?: string;
};

export function ContactDataStep({ data, onNext }: ContactDataStepProps) {
  const form = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
    defaultValues: data,
    mode: "onChange",
  });

  const onSubmit = (formData: ContactData) => onNext(formData);
  const isFormValid = form.formState.isValid && form.watch("agbAccepted");

  const fields: FieldConfig[] = [
    {
      id: "firstName",
      label: "Vorname *",
      placeholder: "Max",
      icon: <User className="h-4 w-4" />,
      gridArea: "firstName",
    },
    {
      id: "lastName",
      label: "Nachname *",
      placeholder: "Mustermann",
      gridArea: "lastName",
    },
    {
      id: "street",
      label: "Straße *",
      placeholder: "Musterstraße",
      gridArea: "street",
    },
    {
      id: "houseNumber",
      label: "Hausnummer *",
      placeholder: "123",
      gridArea: "houseNumber",
    },
    {
      id: "zipCode",
      label: "Postleitzahl *",
      placeholder: "12345",
      maxLength: 5,
      gridArea: "zipCode",
    },
    {
      id: "city",
      label: "Wohnort *",
      placeholder: "Musterstadt",
      gridArea: "city",
    },
    {
      id: "email",
      label: "E-Mail-Adresse *",
      placeholder: "max@beispiel.de",
      type: "email",
      icon: <Mail className="h-4 w-4" />,
      gridArea: "email",
    },
    {
      id: "phone",
      label: "Telefonnummer *",
      placeholder: "+49 123 456789",
      type: "tel",
      icon: <Phone className="h-4 w-4" />,
      gridArea: "phone",
    },
  ];

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-2xl text-white flex items-center gap-2">
          <User className="h-6 w-6 text-red-500" />
          Kontaktdaten
        </CardTitle>
        <p className="text-gray-400">
          Bitte geben Sie Ihre vollständigen Kontaktdaten ein
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Persönliche Daten */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
              Persönliche Daten
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {fields.slice(0, 2).map((field) => (
                <div key={field.id}>
                  <Label className="text-gray-300 flex items-center gap-2 mb-2">
                    {field.icon}
                    {field.label}
                  </Label>
                  <Input
                    {...form.register(field.id)}
                    type={field.type ?? "text"}
                    placeholder={field.placeholder}
                    maxLength={field.maxLength}
                    className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-red-500 transition-all duration-200"
                  />
                  {form.formState.errors[field.id] && (
                    <p className="text-red-400 text-sm mt-1">
                      {
                        form.formState.errors[field.id as keyof ContactData]
                          ?.message as string
                      }
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Adresse */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
              Adresse
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {/* Straße und Hausnummer in einer Zeile */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Label className="text-gray-300 mb-2 block">
                    {fields[2].label}
                  </Label>
                  <Input
                    {...form.register(fields[2].id)}
                    type={fields[2].type ?? "text"}
                    placeholder={fields[2].placeholder}
                    className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-red-500 transition-all duration-200"
                  />
                  {form.formState.errors[fields[2].id] && (
                    <p className="text-red-400 text-sm mt-1">
                      {
                        form.formState.errors[fields[2].id as keyof ContactData]
                          ?.message as string
                      }
                    </p>
                  )}
                </div>
                <div>
                  <Label className="text-gray-300 mb-2 block">
                    {fields[3].label}
                  </Label>
                  <Input
                    {...form.register(fields[3].id)}
                    type={fields[3].type ?? "text"}
                    placeholder={fields[3].placeholder}
                    className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-red-500 transition-all duration-200"
                  />
                  {form.formState.errors[fields[3].id] && (
                    <p className="text-red-400 text-sm mt-1">
                      {
                        form.formState.errors[fields[3].id as keyof ContactData]
                          ?.message as string
                      }
                    </p>
                  )}
                </div>
              </div>

              {/* PLZ und Ort in einer Zeile */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-300 mb-2 block">
                    {fields[4].label}
                  </Label>
                  <Input
                    {...form.register(fields[4].id)}
                    type={fields[4].type ?? "text"}
                    placeholder={fields[4].placeholder}
                    maxLength={fields[4].maxLength}
                    className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-red-500 transition-all duration-200"
                  />
                  {form.formState.errors[fields[4].id] && (
                    <p className="text-red-400 text-sm mt-1">
                      {
                        form.formState.errors[fields[4].id as keyof ContactData]
                          ?.message as string
                      }
                    </p>
                  )}
                </div>
                <div className="col-span-2">
                  <Label className="text-gray-300 mb-2 block">
                    {fields[5].label}
                  </Label>
                  <Input
                    {...form.register(fields[5].id)}
                    type={fields[5].type ?? "text"}
                    placeholder={fields[5].placeholder}
                    className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-red-500 transition-all duration-200"
                  />
                  {form.formState.errors[fields[5].id] && (
                    <p className="text-red-400 text-sm mt-1">
                      {
                        form.formState.errors[fields[5].id as keyof ContactData]
                          ?.message as string
                      }
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Kontaktdaten */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
              Kontaktdaten
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {fields.slice(6, 8).map((field) => (
                <div key={field.id}>
                  <Label className="text-gray-300 flex items-center gap-2 mb-2">
                    {field.icon}
                    {field.label}
                  </Label>
                  <Input
                    {...form.register(field.id)}
                    type={field.type ?? "text"}
                    placeholder={field.placeholder}
                    maxLength={field.maxLength}
                    className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-red-500 transition-all duration-200"
                  />
                  {form.formState.errors[field.id] && (
                    <p className="text-red-400 text-sm mt-1">
                      {
                        form.formState.errors[field.id as keyof ContactData]
                          ?.message as string
                      }
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Datenschutz & AGB */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
              Datenschutz & Einverständnis
            </h3>
            <div className="bg-white/5 rounded-lg p-6 border border-white/10">
              <div className="flex items-start space-x-4">
                <input
                  type="checkbox"
                  id="agb"
                  {...form.register("agbAccepted")}
                  className="w-5 h-5 text-red-500 bg-white/5 border-white/20 rounded focus:ring-red-500 focus:ring-2 mt-1 flex-shrink-0"
                />
                <Label
                  htmlFor="agb"
                  className="text-gray-300 cursor-pointer text-sm leading-relaxed"
                >
                  <span className="font-medium text-white block mb-2">
                    Einverständniserklärung *
                  </span>
                  Ich willige ein, dass meine angegebenen Daten zur Bearbeitung
                  und Durchführung meines Auftrags gespeichert und verarbeitet
                  werden. Die Speicherung erfolgt ausschließlich im Rahmen der
                  gesetzlichen Bestimmungen. Eine Weitergabe an Dritte erfolgt
                  nicht.
                  <br />
                  <br />
                  Hiermit akzeptiere ich die{" "}
                  <button
                    type="button"
                    className="text-red-400 underline hover:text-red-300 transition-colors"
                    onClick={() => window.open("/agb", "_blank")}
                  >
                    Allgemeinen Geschäftsbedingungen
                  </button>{" "}
                  und die{" "}
                  <button
                    type="button"
                    className="text-red-400 underline hover:text-red-300 transition-colors"
                    onClick={() => window.open("/datenschutz", "_blank")}
                  >
                    Datenschutzerklärung
                  </button>
                  .
                </Label>
              </div>
              {form.formState.errors.agbAccepted && (
                <p className="text-red-400 text-sm mt-3 ml-9">
                  {form.formState.errors.agbAccepted.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={!isFormValid}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-4 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-[1.02]"
            >
              Weiter zu Serviceauswahl
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
