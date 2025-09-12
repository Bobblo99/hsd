"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Settings,
  ShoppingCart,
  Wrench,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { ServiceType } from "@/types/enums/enum";

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

  const serviceOptions: {
    id: ServiceType;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    iconColor: string;
  }[] = [
    {
      id: "rims",
      title: "Felgen aufbereiten",
      description: "Lackierung, Pulverbeschichtung, Reparatur und Aufbereitung",
      icon: <Settings className="h-8 w-8" />,
      color: "bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30",
      iconColor: "text-blue-500",
    },
    {
      id: "tires-purchase",
      title: "Reifen kaufen",
      description: "Neue Reifen in verschiedenen Größen und Qualitäten",
      icon: <ShoppingCart className="h-8 w-8" />,
      color: "bg-green-500/20 border-green-500/30 hover:bg-green-500/30",
      iconColor: "text-green-500",
    },
    {
      id: "tire-service",
      title: "Reifenservice",
      description: "Montage, Wuchten und weitere Serviceleistungen",
      icon: <Wrench className="h-8 w-8" />,
      color: "bg-purple-500/20 border-purple-500/30 hover:bg-purple-500/30",
      iconColor: "text-purple-500",
    },
  ];

  const toggleService = (id: ServiceType) => {
    setServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
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
          {serviceOptions.map((option) => {
            const active = services.includes(option.id);
            return (
              <div key={option.id} className="relative">
                <input
                  type="checkbox"
                  id={option.id}
                  checked={active}
                  onChange={() => toggleService(option.id)}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={option.id}
                  className={`flex items-center gap-4 p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                    active
                      ? `${option.color} border-opacity-100`
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className={option.iconColor}>{option.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {option.title}
                    </h3>
                    <p className="text-gray-400">{option.description}</p>
                  </div>
                  <div
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                      active ? "bg-red-500 border-red-500" : "border-white/30"
                    }`}
                  >
                    {active && (
                      <div className="w-3 h-3 text-white font-bold">✓</div>
                    )}
                  </div>
                </Label>
              </div>
            );
          })}
        </div>

        {/* Feedback Boxen */}
        {!isValid && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
            <p className="text-yellow-400 text-sm">
              Bitte wählen Sie mindestens einen Service aus, um fortzufahren.
            </p>
          </div>
        )}

        {isValid && (
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

        {/* Navigation */}
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
