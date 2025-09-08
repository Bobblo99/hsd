"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Settings,
  ShoppingCart,
  Wrench,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

export type ServiceType = "felgen" | "reifen-kaufen" | "reifenservice";

interface ServiceSelectionStepProps {
  selectedServices: ServiceType[];
  onNext: (services: ServiceType[]) => void;
  onBack: () => void;
}

export function ServiceSelectionStep({
  selectedServices,
  onNext,
  onBack,
}: ServiceSelectionStepProps) {
  const [services, setServices] = useState<ServiceType[]>(selectedServices);

  const serviceOptions = [
    {
      id: "felgen" as ServiceType,
      title: "Felgen aufbereiten",
      description: "Lackierung, Pulverbeschichtung, Reparatur und Aufbereitung",
      icon: <Settings className="h-8 w-8" />,
      color: "bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30",
      iconColor: "text-blue-500",
    },
    {
      id: "reifen-kaufen" as ServiceType,
      title: "Reifen kaufen",
      description: "Neue Reifen in verschiedenen Größen und Qualitäten",
      icon: <ShoppingCart className="h-8 w-8" />,
      color: "bg-green-500/20 border-green-500/30 hover:bg-green-500/30",
      iconColor: "text-green-500",
    },
    {
      id: "reifenservice" as ServiceType,
      title: "Reifenservice",
      description: "Montage, Wuchten und weitere Serviceleistungen",
      icon: <Wrench className="h-8 w-8" />,
      color: "bg-purple-500/20 border-purple-500/30 hover:bg-purple-500/30",
      iconColor: "text-purple-500",
    },
  ];

  const handleServiceToggle = (serviceId: ServiceType) => {
    setServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((s) => s !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleNext = () => {
    if (services.length > 0) {
      onNext(services);
    }
  };

  const isValid = services.length > 0;
  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-2xl text-white flex items-center gap-2">
          <Settings className="h-6 w-6 text-red-500" />
          Serviceauswahl
        </CardTitle>
        <p className="text-gray-400">
          Welche Services möchten Sie nutzen? (Mehrfachauswahl möglich)
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          {serviceOptions.map((serviceOption) => (
            <div key={serviceOption.id} className="relative">
              <input
                type="checkbox"
                id={serviceOption.id}
                checked={services.includes(serviceOption.id)}
                onChange={() => handleServiceToggle(serviceOption.id)}
                className="peer sr-only"
              />
              <Label
                htmlFor={serviceOption.id}
                className={`flex items-center gap-4 p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  services.includes(serviceOption.id)
                    ? `${serviceOption.color} border-opacity-100`
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                <div className={`${serviceOption.iconColor}`}>
                  {serviceOption.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {serviceOption.title}
                  </h3>
                  <p className="text-gray-400">{serviceOption.description}</p>
                </div>
                <div
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                    services.includes(serviceOption.id)
                      ? "bg-red-500 border-red-500"
                      : "border-white/30"
                  }`}
                >
                  {services.includes(serviceOption.id) && (
                    <div className="w-3 h-3 text-white">✓</div>
                  )}
                </div>
              </Label>
            </div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
            <p className="text-yellow-400 text-sm">
              Bitte wählen Sie mindestens einen Service aus, um fortzufahren.
            </p>
          </div>
        )}

        {services.length > 0 && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            <p className="text-green-400 text-sm">
              {services.length} Service{services.length > 1 ? "s" : ""}{" "}
              ausgewählt:{" "}
              {services
                .map((s) => serviceOptions.find((so) => so.id === s)?.title)
                .join(", ")}
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück
          </Button>
          <Button
            onClick={handleNext}
            disabled={!isValid}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Weiter
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
