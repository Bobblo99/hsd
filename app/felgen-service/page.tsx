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
import { Upload, CheckCircle, Wrench, Phone, Mail, User } from "lucide-react";
import { createCustomer, uploadImage } from "@/lib/db/felgen-database";
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

export default function FelgenServicePage() {
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
        const fileId = await uploadImage(file);
        bildIds.push(fileId);
      }

      // Create customer record
      await createCustomer({
        ...values,
        bildIds,
        status: 'eingegangen',
      });

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
            <h2 className="text-2xl font-bold text-white mb-2">Anfrage gesendet!</h2>
            <p className="text-gray-400 mb-6">
              Vielen Dank für Ihre Anfrage. Wir werden uns in Kürze bei Ihnen melden.
            </p>
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
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-3xl font-bold text-red-500 mb-4">HSD GmbH</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Felgenaufbereitung Service
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Professionelle Felgenreparatur und -aufbereitung. Senden Sie uns Ihre Anfrage 
            mit Bildern Ihrer Felgen für einen kostenlosen Kostenvoranschlag.
          </p>
        </div>

        {/* Form */}
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Wrench className="h-6 w-6 text-red-500" />
              Service-Anfrage
            </CardTitle>
            <CardDescription className="text-gray-400">
              Füllen Sie das Formular aus und laden Sie Bilder Ihrer Felgen hoch
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Kontaktdaten */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
                    Kontaktdaten
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
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
                              className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-red-500"
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
                            Telefonnummer *
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="+49 123 456789"
                              className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-red-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          E-Mail-Adresse *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="ihre@email.de"
                            className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-red-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Service Details */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
                    Service Details
                  </h3>

                  <FormField
                    control={form.control}
                    name="felgeBeschaedigt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">
                          Ist Ihre Felge beschädigt? *
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex gap-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="ja" id="ja" className="border-white/20 text-red-500" />
                              <label htmlFor="ja" className="text-white cursor-pointer">Ja</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="nein" id="nein" className="border-white/20 text-red-500" />
                              <label htmlFor="nein" className="text-white cursor-pointer">Nein</label>
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
                        <FormLabel className="text-gray-300">
                          Gewünschte Reparatur/Service *
                        </FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-2 gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="lackieren" id="lackieren" className="border-white/20 text-red-500" />
                              <label htmlFor="lackieren" className="text-white cursor-pointer">Lackieren</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="polieren" id="polieren" className="border-white/20 text-red-500" />
                              <label htmlFor="polieren" className="text-white cursor-pointer">Polieren</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="schweissen" id="schweissen" className="border-white/20 text-red-500" />
                              <label htmlFor="schweissen" className="text-white cursor-pointer">Schweißen</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="pulverbeschichten" id="pulverbeschichten" className="border-white/20 text-red-500" />
                              <label htmlFor="pulverbeschichten" className="text-white cursor-pointer">Pulverbeschichten</label>
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
                        <FormLabel className="text-gray-300">
                          Beschreibung des Schadens/Wunsches *
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Beschreiben Sie den Schaden oder Ihre Wünsche detailliert..."
                            className="bg-white/5 border-white/20 text-white placeholder-gray-400 focus:border-red-500 resize-none min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* File Upload */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-white border-b border-white/10 pb-2">
                    Bilder hochladen
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-red-500/50 transition-colors">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-white mb-2">Bilder Ihrer Felgen hochladen</p>
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
                        className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                      >
                        Bilder auswählen
                      </Button>
                    </div>

                    {selectedFiles.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                            >
                              ×
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-1 rounded-b-lg truncate">
                              {file.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-4 text-lg"
                >
                  {isLoading ? "Wird gesendet..." : "Anfrage senden"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}