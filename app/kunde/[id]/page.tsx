"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  Lock,
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Clock,
  Eye,
  Settings,
  Download,
  Share2,
  FileText,
  AlertTriangle,
  Package,
  CheckCircle,
  User,
  MapPin,
  Wrench,
  ShoppingCart,
  Image as ImageIcon,
  Star,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
} from "lucide-react";
import { isAuthenticated } from "@/lib/auth";
import { CustomerPrintDialog } from "@/components/CustomerPrintDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Customer } from "@/types/customers";
import { useCustomerV2 } from "@/hooks/v2/useCustomerV2";
import { InfoCard } from "@/components/admin/info-card";

function safeName(c: Partial<Customer> & Record<string, any>) {
  return (
    c.fullName ||
    [c.firstName, c.lastName].filter(Boolean).join(" ") ||
    (c as any).name ||
    "Unbekannt"
  );
}

function safeCreatedAt(c: Partial<Customer> & Record<string, any>) {
  const raw = (c as any)?.$createdAt || (c as any)?.createdAt;
  try {
    return raw ? new Date(raw).toLocaleDateString("de-DE") : "-";
  } catch {
    return "-";
  }
}

function safeDescription(c: Partial<Customer> & Record<string, any>) {
  return (c as any).damageDescription || (c as any).allNotes || "";
}

function safeRepairType(c: Partial<Customer> & Record<string, any>) {
  return (c as any).repairType || (c as any).rimsFinish || "-";
}

function safeRimDamaged(
  c: Partial<Customer> & Record<string, any>
): "ja" | "nein" | "-" {
  const v = (c as any).rimDamaged ?? (c as any).rimsHasBent;
  return v === "ja" || v === "nein" ? v : "-";
}

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, isSuccess } = useCustomerV2(id);
  const router = useRouter();

  const [authChecked, setAuthChecked] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const printRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const authed = await isAuthenticated();
        setIsAllowed(authed);
      } catch {
        setIsAllowed(false);
      } finally {
        setAuthChecked(true);
      }
    })();
  }, []);

  const getStatusBadge = (status: string) => {
    const variants = {
      eingegangen: {
        color: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
        icon: Clock,
        label: "Eingegangen",
      },
      "in-bearbeitung": {
        color: "bg-blue-500/20 text-blue-500 border-blue-500/30",
        icon: Settings,
        label: "In Bearbeitung",
      },
      fertiggestellt: {
        color: "bg-green-500/20 text-green-500 border-green-500/30",
        icon: CheckCircle,
        label: "Fertiggestellt",
      },
      abgeholt: {
        color: "bg-gray-500/20 text-gray-500 border-gray-500/30",
        icon: Package,
        label: "Abgeholt",
      },
    };

    const variant =
      variants[status as keyof typeof variants] || variants["eingegangen"];
    const Icon = variant.icon;

    return (
      <Badge
        className={`${variant.color} border flex items-center gap-2 px-3 py-1`}
      >
        <Icon className="h-3 w-3" />
        {variant.label}
      </Badge>
    );
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="bg-white/5 border-white/10 p-8">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-red-500" />
            <p className="text-white font-medium">
              Authentifizierung wird überprüft...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (!isAllowed) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="bg-white/5 border-white/10 max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Zugriff verweigert
            </h2>
            <p className="text-gray-400 mb-6">
              Nur Administratoren haben Zugriff auf Kundendetails.
            </p>
            <Button
              onClick={() => router.push("/admin/login")}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Zur Anmeldung
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between mb-8">
            <div className="h-10 w-24 bg-white/5 rounded-lg animate-pulse"></div>
            <div className="h-10 w-32 bg-white/5 rounded-lg animate-pulse"></div>
          </div>

          <Card className="bg-white/5 border-white/10 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-8 w-48 bg-white/10 rounded animate-pulse"></div>
                  <div className="h-4 w-32 bg-white/10 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="grid md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-20 bg-white/5 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Content Skeleton */}
          <div className="grid lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <div className="h-6 w-32 bg-white/10 rounded animate-pulse mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-white/10 rounded animate-pulse"></div>
                    <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data?.customer) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="bg-white/5 border-white/10 max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Fehler beim Laden
            </h2>
            <p className="text-gray-400 mb-6">
              Kunde konnte nicht geladen werden.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="bg-white/5 border-white/20 text-white hover:bg-white/10"
              >
                Erneut versuchen
              </Button>
              <Button
                onClick={() => router.back()}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Zurück
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const c = data.customer;
  const servicesParsed = data.servicesParsed || [];
  const primary = data.primaryService as any | undefined;

  const displayName = safeName(c as any);
  const createdDate = data.createdDate || safeCreatedAt(c as any);
  const imageUrls = data.imageUrls || [];

  const repairType =
    primary?.dataObj?.rimsFinish ??
    primary?.dataObj?.finish ??
    safeRepairType(c as any);

  const rimDamaged: "ja" | "nein" | "-" =
    primary?.dataObj?.rimsHasBent ??
    primary?.dataObj?.hasBent ??
    safeRimDamaged(c as any);

  const description =
    primary?.dataObj?.notes ??
    primary?.dataObj?.description ??
    safeDescription(c as any);

  const printCustomer = {
    name: displayName,
    email: c.email,
    phone: c.phone,
    status: c.status,
    repairType,
    rimDamaged,
    damageDescription: description,
    createdAt: c.$createdAt,
    imageIds: imageUrls,
    $id: c.$id,
  } as any;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-900 border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex items-center gap-2 bg-white/5 border-white/20 text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Zurück</span>
              </Button>

              <div>
                <h1 className="text-xl md:text-2xl font-bold text-white">
                  {displayName}
                </h1>
                <p className="text-sm text-gray-400">
                  Kunde #{c.$id?.slice(-6) || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <CustomerPrintDialog customer={printCustomer} />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 border-gray-700">
                  <DropdownMenuItem className="text-white hover:bg-white/10">
                    <Edit className="h-4 w-4 mr-2" />
                    Bearbeiten
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-white/10">
                    <Download className="h-4 w-4 mr-2" />
                    PDF Export
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-white/10">
                    <Share2 className="h-4 w-4 mr-2" />
                    Link teilen
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Löschen
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {/* Customer Profile Card */}
        <Card className="bg-white/5 border-white/10 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6 mb-6">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20 bg-red-500/20 border-2 border-red-500/30">
                  <AvatarFallback className="text-red-500 font-bold text-xl">
                    {getInitials(displayName)}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-white">
                      {displayName}
                    </h2>
                    {getStatusBadge(c.status || "eingegangen")}
                  </div>
                  <p className="text-gray-400">Kunde seit {createdDate}</p>
                </div>
              </div>

              <div className="flex-1 lg:ml-auto">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <InfoCard
                    icon={<Mail className="h-4 w-4" />}
                    label="E-Mail"
                    value={c.email || "-"}
                    iconColor="text-blue-400"
                    copyable={true}
                    clickable={true}
                    href={`mailto:${c.email}`}
                  />

                  <InfoCard
                    icon={<Phone className="h-4 w-4" />}
                    label="Telefon"
                    value={c.phone || "-"}
                    iconColor="text-green-400"
                    copyable={true}
                    clickable={true}
                    href={`tel:${c.phone}`}
                  />

                  <InfoCard
                    icon={<Calendar className="h-4 w-4" />}
                    label="Erstellt"
                    value={createdDate}
                    iconColor="text-purple-400"
                  />

                  <InfoCard
                    icon={<ImageIcon className="h-4 w-4" />}
                    label="Bilder"
                    value={`${imageUrls.length} Fotos`}
                    iconColor="text-orange-400"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Navigation */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-white/10">
            <TabsTrigger
              value="overview"
              className="flex items-center gap-2 text-gray-400 data-[state=active]:text-white data-[state=active]:bg-red-500"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Übersicht</span>
            </TabsTrigger>
            <TabsTrigger
              value="services"
              className="flex items-center gap-2 text-gray-400 data-[state=active]:text-white data-[state=active]:bg-red-500"
            >
              <Wrench className="h-4 w-4" />
              <span className="hidden sm:inline">Services</span>
            </TabsTrigger>
            <TabsTrigger
              value="images"
              className="flex items-center gap-2 text-gray-400 data-[state=active]:text-white data-[state=active]:bg-red-500"
            >
              <ImageIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Bilder</span>
              <Badge className="bg-red-500/20 text-red-400 text-xs">
                {imageUrls.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="timeline"
              className="flex items-center gap-2 text-gray-400 data-[state=active]:text-white data-[state=active]:bg-red-500"
            >
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Timeline</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Contact Information */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="h-5 w-5 text-red-500" />
                    Kontaktdaten
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <InfoCard
                    icon={<Mail className="h-4 w-4" />}
                    label="E-Mail"
                    value={c.email || "-"}
                    iconColor="text-blue-400"
                    copyable={true}
                    clickable={true}
                    href={`mailto:${c.email}`}
                    className="border-0 bg-white/10"
                  />

                  <InfoCard
                    icon={<Phone className="h-4 w-4" />}
                    label="Telefon"
                    value={c.phone || "-"}
                    iconColor="text-green-400"
                    copyable={true}
                    clickable={true}
                    href={`tel:${c.phone}`}
                    className="border-0 bg-white/10"
                  />

                  {c.fullAddress && (
                    <InfoCard
                      icon={<MapPin className="h-4 w-4" />}
                      label="Adresse"
                      value={c.fullAddress}
                      iconColor="text-purple-400"
                      copyable={true}
                      className="border-0 bg-white/10"
                    />
                  )}
                </CardContent>
              </Card>

              {/* Service Summary */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-red-500" />
                    Service Übersicht
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {servicesParsed.map((service, idx) => {
                    const icons = {
                      rims: <Settings className="h-4 w-4 text-blue-400" />,
                      "tires-purchase": (
                        <ShoppingCart className="h-4 w-4 text-green-400" />
                      ),
                      "tire-service": (
                        <Wrench className="h-4 w-4 text-purple-400" />
                      ),
                    };

                    const titles = {
                      rims: "Felgen-Aufbereitung",
                      "tires-purchase": "Reifen-Kauf",
                      "tire-service": "Reifen-Service",
                    };

                    return (
                      <div
                        key={service.$id}
                        className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10"
                      >
                        {icons[service.serviceType as keyof typeof icons]}
                        <div className="flex-1">
                          <p className="text-white font-medium">
                            {titles[service.serviceType as keyof typeof titles]}
                          </p>
                          <p className="text-xs text-gray-400">
                            {service.serviceType === "rims" &&
                              "Aufbereitung & Reparatur"}
                            {service.serviceType === "tires-purchase" &&
                              "Neue Reifen"}
                            {service.serviceType === "tire-service" &&
                              "Montage & Service"}
                          </p>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 text-xs">
                          Aktiv
                        </Badge>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <FileText className="h-5 w-5 text-red-500" />
                    Statistiken
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-2xl font-bold text-white">
                        {servicesParsed.length}
                      </p>
                      <p className="text-xs text-gray-400">Services</p>
                    </div>
                    <div className="text-center p-3 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-2xl font-bold text-white">
                        {imageUrls.length}
                      </p>
                      <p className="text-xs text-gray-400">Bilder</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Fortschritt</span>
                      <span className="text-sm text-white">75%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-red-500" />
                  Beschreibung & Notizen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <p className="text-gray-300 leading-relaxed">
                    {description || "Keine Beschreibung vorhanden"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-6">
            {servicesParsed.map((service, idx) => {
              const dataObj = JSON.parse(service.data || "{}");

              const labelMap: Record<string, string> =
                service.serviceType === "rims"
                  ? {
                      rimsCount: "Anzahl Felgen",
                      rimsHasBent: "Schlag vorhanden",
                      rimsFinish: "Finish",
                      rimsColor: "Farbe",
                      rimsCombination: "Kombination",
                      rimsSticker: "Aufkleber",
                      stickerColor: "Aufkleber-Farbe",
                      notes: "Notizen",
                    }
                  : service.serviceType === "tires-purchase"
                  ? {
                      tiresQuantity: "Stückzahl",
                      tiresSize: "Reifengröße",
                      tiresUsage: "Einsatzart",
                      tiresBrand: "Hersteller",
                      specificBrand: "Gezielter Hersteller",
                      notes: "Notizen",
                    }
                  : {
                      mountService: "Montageservice",
                      notes: "Notizen",
                    };

              const title =
                service.serviceType === "rims"
                  ? "Felgen-Aufbereitung"
                  : service.serviceType === "tires-purchase"
                  ? "Reifen-Kauf"
                  : "Reifen-Service";

              const icons = {
                rims: <Settings className="h-5 w-5 text-blue-500" />,
                "tires-purchase": (
                  <ShoppingCart className="h-5 w-5 text-green-500" />
                ),
                "tire-service": <Wrench className="h-5 w-5 text-purple-500" />,
              };

              return (
                <Card key={service.$id} className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      {icons[service.serviceType as keyof typeof icons]}
                      {title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.entries(dataObj).map(([key, value]) => {
                        if (!value) return null;
                        return (
                          <div
                            key={key}
                            className="bg-white/5 rounded-lg p-3 border border-white/10"
                          >
                            <p className="text-xs text-gray-400 mb-1">
                              {labelMap[key] || key}
                            </p>
                            <p className="text-white font-medium">
                              {String(value)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* Images Tab */}
          <TabsContent value="images" className="space-y-6">
            {imageUrls.length > 0 ? (
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-red-500" />
                    Hochgeladene Bilder ({imageUrls.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {imageUrls.map((img, i) => (
                      <div
                        key={img + i}
                        className="group relative aspect-square rounded-lg overflow-hidden border border-white/10 cursor-pointer hover:border-red-500/50 transition-all duration-300"
                        onClick={() => setSelectedImage(img)}
                      >
                        <img
                          src={img}
                          alt={`Bild ${i + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Eye className="h-6 w-6 text-white" />
                        </div>
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                          Bild {i + 1}
                        </div>
                        <div className="absolute top-2 right-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(img, "_blank");
                            }}
                            className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-12 text-center">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">
                    Keine Bilder vorhanden
                  </h3>
                  <p className="text-gray-400">
                    Für diesen Kunden wurden noch keine Bilder hochgeladen.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="h-5 w-5 text-red-500" />
                  Aktivitäts-Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">Kunde erstellt</p>
                      <p className="text-sm text-gray-400">{createdDate}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Neue Kundenanfrage eingegangen
                      </p>
                    </div>
                  </div>

                  {servicesParsed.map((service, idx) => (
                    <div key={service.$id} className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <Wrench className="h-4 w-4 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">
                          Service hinzugefügt:{" "}
                          {service.serviceType === "rims"
                            ? "Felgen-Aufbereitung"
                            : service.serviceType === "tires-purchase"
                            ? "Reifen-Kauf"
                            : "Reifen-Service"}
                        </p>
                        <p className="text-sm text-gray-400">{createdDate}</p>
                      </div>
                    </div>
                  ))}

                  {imageUrls.length > 0 && (
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <ImageIcon className="h-4 w-4 text-purple-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">
                          {imageUrls.length} Bilder hochgeladen
                        </p>
                        <p className="text-sm text-gray-400">{createdDate}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div ref={printRef} className="hidden print:block"></div>

        {/* Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-full">
              <img
                src={selectedImage}
                alt="Vergrößerte Ansicht"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <Button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
                size="sm"
              >
                ✕
              </Button>
              <Button
                onClick={() => window.open(selectedImage, "_blank")}
                className="absolute top-4 left-4 bg-black/50 hover:bg-black/70 text-white"
                size="sm"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
