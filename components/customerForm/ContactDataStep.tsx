"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, ArrowRight } from "lucide-react";

const contactSchema = z.object({
  firstName: z.string().min(2, "Vorname ist erforderlich"),
  lastName: z.string().min(2, "Nachname ist erforderlich"),
  street: z.string().min(3, "Straße ist erforderlich"),
  houseNumber: z.string().min(1, "Hausnummer ist erforderlich"),
  zipCode: z
    .string()
    .min(5, "PLZ muss 5 Zeichen haben")
    .max(5, "PLZ muss 5 Zeichen haben"),
  city: z.string().min(2, "Wohnort ist erforderlich"),
  email: z.string().email("Ungültige E-Mail-Adresse"),
  phone: z.string().min(10, "Telefonnummer ist erforderlich"),
  agbAccepted: z.boolean().refine((val) => val === true, {
    message: "Sie müssen die AGB akzeptieren",
  }),
});

type ContactData = z.infer<typeof contactSchema>;

interface ContactDataStepProps {
  data: Partial<ContactData>;
  onNext: (data: ContactData) => void;
}

export function ContactDataStep({ data, onNext }: ContactDataStepProps) {
  const form = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
    defaultValues: data,
  });

  const onSubmit = (formData: ContactData) => {
    onNext(formData);
  };

  const isFormValid = form.formState.isValid && form.watch("agbAccepted");

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
          {/* Name */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Vorname *</Label>
              <Input
                {...form.register("firstName")}
                placeholder="Max"
                className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-red-500"
              />
              {form.formState.errors.firstName && (
                <p className="text-red-400 text-sm mt-1">
                  {form.formState.errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <Label className="text-gray-300">Nachname *</Label>
              <Input
                {...form.register("lastName")}
                placeholder="Mustermann"
                className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-red-500"
              />
              {form.formState.errors.lastName && (
                <p className="text-red-400 text-sm mt-1">
                  {form.formState.errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Adresse */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <Label className="text-gray-300">Straße *</Label>
              <Input
                {...form.register("street")}
                placeholder="Musterstraße"
                className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-red-500"
              />
              {form.formState.errors.street && (
                <p className="text-red-400 text-sm mt-1">
                  {form.formState.errors.street.message}
                </p>
              )}
            </div>
            <div>
              <Label className="text-gray-300">Hausnummer *</Label>
              <Input
                {...form.register("houseNumber")}
                placeholder="123"
                className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-red-500"
              />
              {form.formState.errors.houseNumber && (
                <p className="text-red-400 text-sm mt-1">
                  {form.formState.errors.houseNumber.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Postleitzahl *</Label>
              <Input
                {...form.register("zipCode")}
                placeholder="12345"
                maxLength={5}
                className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-red-500"
              />
              {form.formState.errors.zipCode && (
                <p className="text-red-400 text-sm mt-1">
                  {form.formState.errors.zipCode.message}
                </p>
              )}
            </div>
            <div>
              <Label className="text-gray-300">Wohnort *</Label>
              <Input
                {...form.register("city")}
                placeholder="Musterstadt"
                className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-red-500"
              />
              {form.formState.errors.city && (
                <p className="text-red-400 text-sm mt-1">
                  {form.formState.errors.city.message}
                </p>
              )}
            </div>
          </div>

          {/* Kontakt */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                E-Mail-Adresse *
              </Label>
              <Input
                {...form.register("email")}
                type="email"
                placeholder="max@beispiel.de"
                className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-red-500"
              />
              {form.formState.errors.email && (
                <p className="text-red-400 text-sm mt-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            <div>
              <Label className="text-gray-300 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Telefonnummer *
              </Label>
              <Input
                {...form.register("phone")}
                type="tel"
                placeholder="+49 123 456789"
                className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-red-500"
              />
              {form.formState.errors.phone && (
                <p className="text-red-400 text-sm mt-1">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="agb"
                {...form.register("agbAccepted")}
                className="w-4 h-4 text-red-500 bg-white/5 border-white/20 rounded focus:ring-red-500 mt-1"
              />
              <Label
                htmlFor="agb"
                className="text-gray-300 cursor-pointer text-sm leading-relaxed"
              >
                Ich akzeptiere die{" "}
                <span className="text-red-400 underline">
                  Allgemeinen Geschäftsbedingungen
                </span>{" "}
                und stimme der Verarbeitung meiner personenbezogenen Daten gemäß
                der{" "}
                <span className="text-red-400 underline">
                  Datenschutzerklärung
                </span>{" "}
                zu. Meine Daten werden zur Bearbeitung meiner Anfrage und für
                die Kommunikation bezüglich der gewünschten Services gespeichert
                und verarbeitet. *
              </Label>
            </div>
            {form.formState.errors.agbAccepted && (
              <p className="text-red-400 text-sm mt-2">
                {form.formState.errors.agbAccepted.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            disabled={!isFormValid}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Weiter zu Serviceauswahl
            <ArrowRight className="h-5 w-5" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
