"use client";

import {
  User,
  Settings,
  ShoppingCart,
  Wrench,
  CheckCircle,
} from "lucide-react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  completedServices: string[];
}

export function ProgressBar({
  currentStep,
  totalSteps,
  completedServices,
}: ProgressBarProps) {
  const steps = [
    { id: 1, title: "Kontakt", icon: User },
    { id: 2, title: "Service", icon: Settings },
    { id: 3, title: "Details", icon: ShoppingCart },
    { id: 4, title: "Weitere", icon: Wrench },
    { id: 5, title: "Fertig", icon: CheckCircle },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.slice(0, totalSteps).map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="flex items-center">
              <div
                className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
                ${
                  isCompleted
                    ? "bg-green-500 border-green-500 text-white"
                    : isActive
                    ? "bg-red-500 border-red-500 text-white"
                    : "bg-white/5 border-white/20 text-gray-400"
                }
              `}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="ml-3 hidden sm:block">
                <div
                  className={`text-sm font-medium ${
                    isCompleted || isActive ? "text-white" : "text-gray-400"
                  }`}
                >
                  {step.title}
                </div>
              </div>

              {index < totalSteps - 1 && (
                <div
                  className={`
                  w-12 h-0.5 mx-4 transition-all duration-300
                  ${isCompleted ? "bg-green-500" : "bg-white/20"}
                `}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Services Summary */}
      {completedServices.length > 0 && (
        <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="text-sm text-gray-300">
            <span className="font-medium">Ausgewählte Services: </span>
            {completedServices.map((service, index) => (
              <span key={service} className="text-red-400">
                {service}
                {index < completedServices.length - 1 && ", "}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
