"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { ContactDataStep } from "@/components/customerForm/ContactDataStep";
import { FelgenStep } from "@/components/customerForm/RimStep/FelgenStep";
import { ProgressBar } from "@/components/customerForm/ProgressBar";
import { ReifenKaufenStep } from "@/components/customerForm/ReifenKaufenStep";
import { ReifenServiceStep } from "@/components/customerForm/ReifenServiceStep";
import { ServiceSelectionStep } from "@/components/customerForm/ServiceSelectionStep";
import { PhotoUploadStep } from "@/components/customerForm/PhotoUploadStep";
import { useCreateCustomerWorkflowV2 } from "@/hooks/v2/useCreateCustomerWorkflowV2";
import { toast } from "@/hooks/use-toast";
import { CustomerFormData } from "@/types/customer-form";
import { ServiceType } from "@/types/enums/enum";

export default function KundePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CustomerFormData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const orderedServices: ServiceType[] = [
    "rims",
    "tires-purchase",
    "tire-service",
  ];

  // Total steps = contact + service selection + service steps + photo upload
  const getTotalSteps = () => {
    let steps = 3; // Contact + Service Selection + Photos
    if (formData.selectedServices?.includes("rims")) steps++;
    if (formData.selectedServices?.includes("tires-purchase")) steps++;
    if (formData.selectedServices?.includes("tire-service")) steps++;
    return steps;
  };

  // Determine current service step
  const getCurrentService = (): ServiceType | undefined => {
    const services = formData.selectedServices || [];
    const activeServices = orderedServices.filter((s) => services.includes(s));
    const serviceStepIndex = currentStep - 3; // offset: 1=contact, 2=selection
    return activeServices[serviceStepIndex];
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

    setFormData((prev) => ({
      ...prev,
      [currentService === "rims"
        ? "rims"
        : currentService === "tires-purchase"
        ? "tiresPurchase"
        : "tireService"]: serviceData,
    }));

    if (currentStep < getTotalSteps()) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const isLastStep = () => currentStep >= getTotalSteps();

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const { mutateAsync: createWorkflow } = useCreateCustomerWorkflowV2();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const completeFormData: CustomerFormData = {
        firstName: formData.firstName ?? "",
        lastName: formData.lastName ?? "",
        street: formData.street ?? "",
        houseNumber: formData.houseNumber ?? "",
        zipCode: formData.zipCode ?? "",
        city: formData.city ?? "",
        email: formData.email ?? "",
        phone: formData.phone ?? "",
        agbAccepted: formData.agbAccepted ?? false,
        status: "eingegangen",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        selectedServices: formData.selectedServices ?? [],
        rims: formData.rims,
        tiresPurchase: formData.tiresPurchase,
        tireService: formData.tireService,
        photos,
      };

      const { customer } = await createWorkflow(completeFormData);

      toast({
        title: "Kunde wurde erfolgreich angelegt",
        variant: "success",
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Beim Anlegen des Kunden ist etwas schief gegangen",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
          completedServices={[]} // optional erweitern
        />

        {/* Steps */}
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

        {currentStep >= 3 && getCurrentService() === "rims" && (
          <FelgenStep
            data={formData.rims || {}}
            onNext={isLastStep() ? handleSubmit : handleServiceNext}
            onBack={handleBack}
            isLastStep={isLastStep()}
          />
        )}

        {currentStep >= 3 && getCurrentService() === "tires-purchase" && (
          <ReifenKaufenStep
            data={formData.tiresPurchase || {}}
            onNext={isLastStep() ? handleSubmit : handleServiceNext}
            onBack={handleBack}
            isLastStep={isLastStep()}
          />
        )}

        {currentStep >= 3 && getCurrentService() === "tire-service" && (
          <ReifenServiceStep
            data={formData.tireService || {}}
            onNext={isLastStep() ? handleSubmit : handleServiceNext}
            onBack={handleBack}
            isLastStep={isLastStep()}
          />
        )}

        {currentStep >= 3 && !getCurrentService() && (
          <PhotoUploadStep
            photos={photos}
            onPhotosChange={setPhotos}
            onSubmit={handleSubmit}
            onBack={handleBack}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}
