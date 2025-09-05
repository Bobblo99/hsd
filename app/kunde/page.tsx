"use client";

import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, CheckCircle, Wrench, Phone, Mail, User, QrCode, Camera } from "lucide-react";
import { USE_DUMMY_DATA } from "@/lib/config";
import { createCustomer, uploadImage } from "@/lib/db/felgen-database";
import { createCustomer as createDummyCustomer, uploadImage as uploadDummyImage } from "@/lib/db/dummy-database";
import { useToast } from "@/hooks/use-toast";

const customerSchema = z.object({
  name: z.string().min(2, "Name muss mindestens 2 Zeichen haben"),
  email: z.string().email("Ungültige E-Mail-Adresse"),
  phone: z.string().min(5, "Telefonnummer ist erforderlich"),
  felgeBeschaedigt: z.enum(["ja", "nein"], {
    required_error: "Bitte wählen Sie eine Option",
  }),
  reparaturArt: z.enum(["lackieren", "polieren", "schweissen", "pulverbeschichten"], {
    required_error: "Bitte wählen Sie eine Reparatur-Art",
  }),
  schadensBeschreibung: z.string().min(10, "Beschreibung muss mindestens 10 Zeichen haben"),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

export default function KundenFormPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      schadensBeschreibung: "",
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length !== files.length) {
      toast({
        title: "Warnung",
        description: "Nur Bilddateien sind erlaubt.",
        variant: "destructive",
      });
    }
    
    setSelectedFiles(prev => [...prev, ...imageFiles].slice(0, 5)); // Max 5 Bilder
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  async function onSubmit(values: CustomerFormValues) {
    setIsLoading(true);

    try {
      // Upload images first
      const bildIds: string[] = [];
      for (const file of selectedFiles) {
        const fileId = USE_DUMMY_DATA 
          ? await uploadDummyImage(file)
          : await uploadImage(file);
        bildIds.push(fileId);
      }

      // Create customer record
      if (USE_DUMMY_DATA) {
        await createDummyCustomer({
          ...values,
          bildIds,
          status: 'eingegangen',
        });
      } else {
        await createCustomer({
          ...values,
          bildIds,
          status: 'eingegangen',
        });
      }

      setIsSubmitted(true);
      toast({
        title: "Anfrage gesendet!",
        description: "Wir werden uns in Kürze bei Ihnen melden.",
      });

    } catch (error) {
      console.error("Fehler beim Senden der Anfrage:", error);
      toast({
        title: "Fehler",
        description: "Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/5 border-white/10 text-center">
          <CardContent className="p-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <div className="text-2xl font-bold text-red-500 mb-2">HSD GmbH</div>
            <h2 className="text-xl font-bold text-white mb-2">Vielen Dank!</h2>
            <p className="text-gray-400 mb-6">
              Ihre Anfrage wurde erfolgreich übermittelt. Wir werden uns in Kürze bei Ihnen melden.
            </p>
            <div className="space-y-3 text-sm text-gray-400 mb-6">
              <div className="flex items-center justify-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+49 176 12345678</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@hsd-gmbh.com</span>
              </div>
            </div>
            <Button
              onClick={() => {
                setIsSubmitted(false);
                form.reset();
                setSelectedFiles([]);
              }}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Neue Anfrage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <QrCode className="h-8 w-8 text-red-500" />
            <div className="text-3xl font-bold text-red-500">HSD GmbH</div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Felgenaufbereitung
          </h1>
          <p className="text-gray-400">
            Schnelle Anmeldung für unseren Service
          </p>
        </div>

        {/* Form */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <Wrench className="h-5 w-5 text-red-500" />
              Service-Anmeldung
            </CardTitle>
            <CardDescription className="text-gray-400">
              Bitte füllen Sie alle Felder aus
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Kontaktdaten */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
                    Ihre Daten
                  </h3>
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Name *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ihr vollständiger Name"
                            className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-red-500 text-lg py-3"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300 flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            E-Mail *
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="ihre@email.de"
                              className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-red-500 text-lg py-3"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300 flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            Telefon *
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="+49 123 456789"
                              className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-red-500 text-lg py-3"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Service Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
                    Service Details
                  </h3>

                  <FormField
                    control={form.control}
                    name="felgeBeschaedigt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 text-base">
                          Ist Ihre Felge beschädigt? *
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex gap-8 mt-3"
                          >
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem value="ja" id="ja" className="border-white/20 text-red-500 w-5 h-5" />
                              <label htmlFor="ja" className="text-white cursor-pointer text-lg">Ja</label>
                            </div>
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem value="nein" id="nein" className="border-white/20 text-red-500 w-5 h-5" />
                              <label htmlFor="nein" className="text-white cursor-pointer text-lg">Nein</label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="reparaturArt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 text-base">
                          Gewünschte Reparatur/Service *
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 gap-4 mt-3"
                          >
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem value="lackieren" id="lackieren" className="border-white/20 text-red-500 w-5 h-5" />
                              <label htmlFor="lackieren" className="text-white cursor-pointer text-lg">Lackieren</label>
                            </div>
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem value="polieren" id="polieren" className="border-white/20 text-red-500 w-5 h-5" />
                              <label htmlFor="polieren" className="text-white cursor-pointer text-lg">Polieren</label>
                            </div>
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem value="schweissen" id="schweissen" className="border-white/20 text-red-500 w-5 h-5" />
                              <label htmlFor="schweissen" className="text-white cursor-pointer text-lg">Schweißen</label>
                            </div>
                            <div className="flex items-center space-x-3">
                              <RadioGroupItem value="pulverbeschichten" id="pulverbeschichten" className="border-white/20 text-red-500 w-5 h-5" />
                              <label htmlFor="pulverbeschichten" className="text-white cursor-pointer text-lg">Pulverbeschichten</label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="schadensBeschreibung"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 text-base">
                          Beschreibung des Schadens/Wunsches *
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Beschreiben Sie den Schaden oder Ihre Wünsche..."
                            className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-red-500 resize-none min-h-[100px] text-lg"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* File Upload */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
                    Bilder (optional)
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-red-500/50 transition-colors">
                      <Camera className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-white mb-2 text-lg">Bilder Ihrer Felgen</p>
                      <p className="text-sm text-gray-400 mb-4">
                        Maximal 5 Bilder, nur JPG, PNG oder WEBP
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('file-upload')?.click()}
                        className="bg-white/5 border-white/20 text-white hover:bg-white/10 text-lg py-3 px-6"
                      >
                        <Upload className="h-5 w-5 mr-2" />
                        Bilder auswählen
                      </Button>
                    </div>

                    {selectedFiles.length > 0 && (
                      <div className="grid grid-cols-2 gap-3">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-4 text-xl font-semibold"
                >
                  {isLoading ? "Wird gesendet..." : "Anfrage senden"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="text-center mt-8 text-gray-400 text-sm">
          {USE_DUMMY_DATA && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
              <p className="text-blue-400 text-sm font-medium">🎭 Demo-Modus aktiv - Daten werden nicht gespeichert</p>
            </div>
          )}
          <p>Bei Fragen erreichen Sie uns unter:</p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <span>📞 +49 176 12345678</span>
            <span>✉️ info@hsd-gmbh.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}