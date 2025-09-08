"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CustomerFormData,
  ServiceType,
  createCustomerFromForm,
  validateFormData,
} from "@/types/customer-form";
import { ContactDataStep } from "@/components/customerForm/ContactDataStep";
import { FelgenStep } from "@/components/customerForm/FelgenStep";
import { ProgressBar } from "@/components/customerForm/ProgressBar";
import { ReifenKaufenStep } from "@/components/customerForm/ReifenKaufenStep";
import { ReifenServiceStep } from "@/components/customerForm/ReifenServiceStep";
import { ServiceSelectionStep } from "@/components/customerForm/ServiceSelectionStep";

export default function KundePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CustomerFormData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Get total steps based on selected services
  const getTotalSteps = () => {
    let steps = 2; // Contact + Service Selection
    if (formData.selectedServices?.includes("felgen")) steps++;
    if (formData.selectedServices?.includes("reifen-kaufen")) steps++;
    if (formData.selectedServices?.includes("reifenservice")) steps++;
    return steps;
  };

  // Get current service for step 3+
  const getCurrentService = (): ServiceType | undefined => {
    if (currentStep === 3) {
      if (formData.selectedServices?.includes("felgen")) return "felgen";
      if (formData.selectedServices?.includes("reifen-kaufen"))
        return "reifen-kaufen";
      if (formData.selectedServices?.includes("reifenservice"))
        return "reifenservice";
    }
    if (currentStep === 4) {
      const services = formData.selectedServices || [];
      if (services.includes("felgen") && services.includes("reifen-kaufen"))
        return "reifen-kaufen";
      if (services.includes("felgen") && services.includes("reifenservice"))
        return "reifenservice";
      if (
        services.includes("reifen-kaufen") &&
        services.includes("reifenservice")
      )
        return "reifenservice";
    }
    if (currentStep === 5) {
      const services = formData.selectedServices || [];
      if (
        services.includes("felgen") &&
        services.includes("reifen-kaufen") &&
        services.includes("reifenservice")
      ) {
        return "reifenservice";
      }
    }
    return undefined;
  };
  const handleContactNext = (contactData: any) => {
    setFormData((prev) => ({ ...prev, ...contactData }));
    setCurrentStep(2);
  };

  const handleServiceSelection = (services: ServiceType[]) => {
    setFormData((prev) => ({ ...prev, selectedServices: services }));
    setCurrentStep(3);
  };

  const handleServiceNext = (serviceData: any) => {
    const currentService = getCurrentService();

    // Save current service data
    setFormData((prev) => ({
      ...prev,
      [currentService === "felgen"
        ? "felgen"
        : currentService === "reifen-kaufen"
        ? "reifenKaufen"
        : "reifenService"]: serviceData,
    }));

    // Move to next step or submit
    if (currentStep < getTotalSteps()) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const isLastStep = () => {
    const totalSteps = getTotalSteps();
    return currentStep >= totalSteps;
  };
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Complete form data with current step data
      const completeFormData = {
        ...formData,
        status: "eingegangen" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as CustomerFormData;

      // Validate form data
      const errors = validateFormData(completeFormData);
      if (errors.length > 0) {
        console.error("Validation errors:", errors);
        return;
      }

      // Create customer object for database
      const customerData = createCustomerFromForm(completeFormData);

      console.log("Submitting customer data:", customerData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsSubmitted(true);
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const getCompletedServices = (): string[] => {
    const serviceNames = {
      felgen: "Felgen aufbereiten",
      "reifen-kaufen": "Reifen kaufen",
      reifenservice: "Reifenservice",
    };

    // Show completed services based on current step
    const completed: string[] = [];
    if (currentStep > 3 && formData.selectedServices?.includes("felgen")) {
      completed.push(serviceNames["felgen"]);
    }
    if (
      currentStep > 4 &&
      formData.selectedServices?.includes("reifen-kaufen")
    ) {
      completed.push(serviceNames["reifen-kaufen"]);
    }
    return completed;
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/5 border-white/10 text-center">
          <CardContent className="p-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              Anfrage gesendet!
            </h2>
            <p className="text-gray-400 mb-6">
              Vielen Dank für Ihre Anfrage. Wir werden uns in Kürze bei Ihnen
              melden.
            </p>
            <Button
              onClick={() => window.location.reload()}
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
            Service-Anfrage
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Professionelle Beratung und Service rund um Felgen und Reifen
          </p>
        </div>

        {/* Progress Bar */}
        <ProgressBar
          currentStep={currentStep}
          totalSteps={getTotalSteps()}
          completedServices={getCompletedServices()}
        />

        {/* Form Steps */}
        {currentStep === 1 && (
          <ContactDataStep
            data={{
              firstName: formData.firstName || "",
              lastName: formData.lastName || "",
              street: formData.street || "",
              houseNumber: formData.houseNumber || "",
              zipCode: formData.zipCode || "",
              city: formData.city || "",
              email: formData.email || "",
              phone: formData.phone || "",
              agbAccepted: formData.agbAccepted || false,
            }}
            onNext={handleContactNext}
          />
        )}

        {currentStep === 2 && (
          <ServiceSelectionStep
            selectedServices={formData.selectedServices || []}
            onNext={handleServiceSelection}
            onBack={handleBack}
          />
        )}

        {currentStep >= 3 && getCurrentService() === "felgen" && (
          <FelgenStep
            data={formData.felgen || {}}
            onNext={isLastStep() ? handleSubmit : handleServiceNext}
            onBack={handleBack}
            isLastStep={isLastStep()}
          />
        )}

        {currentStep >= 3 && getCurrentService() === "reifen-kaufen" && (
          <ReifenKaufenStep
            data={formData.reifenKaufen || {}}
            onNext={isLastStep() ? handleSubmit : handleServiceNext}
            onBack={handleBack}
            isLastStep={isLastStep()}
          />
        )}

        {currentStep >= 3 && getCurrentService() === "reifenservice" && (
          <ReifenServiceStep
            data={formData.reifenService || {}}
            onNext={isLastStep() ? handleSubmit : handleServiceNext}
            onBack={handleBack}
            isLastStep={isLastStep()}
          />
        )}
      </div>
    </div>
  );
}
