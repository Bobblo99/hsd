"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Loader2,
  Lock,
  Printer,
  FileDown,
  ArrowLeft,
  User,
  Mail,
  Phone,
  MessageCircle,
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
} from "lucide-react";
import { isAuthenticated } from "@/lib/auth";
import { useCustomer } from "@/hooks/useCustomer";

import { CustomerPrintDialog } from "@/components/CustomerPrintDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: customer, isLoading, isError } = useCustomer(id);
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [isAllowed, setIsAllowed] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [printOptions, setPrintOptions] = useState({
    kontakt: true,
    service: true,
    beschreibung: true,
    bilder: true,
  });

  const printRef = useRef(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authed = await isAuthenticated();
        setIsAllowed(authed);
      } catch {
        setIsAllowed(false);
      } finally {
        setAuthChecked(true);
      }
    };
    checkAuth();
  }, []);

  const getStatusBadge = (status: string) => {
    const variants = {
      eingegangen: {
        color: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
        icon: Clock,
      },
      "in-bearbeitung": {
        color: "bg-blue-500/20 text-blue-500 border-blue-500/30",
        icon: Settings,
      },
      fertiggestellt: {
        color: "bg-green-500/20 text-green-500 border-green-500/30",
        icon: CheckCircle,
      },
      abgeholt: {
        color: "bg-gray-500/20 text-gray-500 border-gray-500/30",
        icon: Package,
      },
    };

    const variant =
      variants[status as keyof typeof variants] || variants["eingegangen"];
    const Icon = variant.icon;

    return (
      <Badge className={`${variant.color} border flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
      </Badge>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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
        <div className="max-w-6xl mx-auto">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between mb-8">
            <div className="h-10 w-24 bg-white/5 rounded-lg animate-pulse"></div>
            <div className="h-10 w-32 bg-white/5 rounded-lg animate-pulse"></div>
          </div>

          <Card className="bg-white/5 border-white/10 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-6 w-48 bg-white/10 rounded animate-pulse"></div>
                  <div className="h-4 w-32 bg-white/10 rounded animate-pulse"></div>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
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

  if (isError || !customer) {
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

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2 bg-white/5 border-white/20 text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Zurück</span>
          </Button>

          <div className="flex items-center gap-3">
            <CustomerPrintDialog customer={customer} />
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
                  <Download className="h-4 w-4 mr-2" />
                  PDF Export
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-white/10">
                  <Share2 className="h-4 w-4 mr-2" />
                  Link teilen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Customer Profile Card */}
        <Card className="bg-white/5 border-white/10 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
              <Avatar className="w-16 h-16 bg-red-500/20 border-2 border-red-500/30">
                <AvatarFallback className="text-red-500 font-bold text-lg">
                  {getInitials(customer.name)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-white">
                    {customer.name}
                  </h1>
                  {getStatusBadge(customer.status)}
                </div>
                <p className="text-gray-400">
                  Kunde seit{" "}
                  {new Date(
                    customer.createdAt || Date.now()
                  ).toLocaleDateString("de-DE")}
                </p>
              </div>

              <div className="flex gap-2">
                {/* <Button
                  size="sm"
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Anrufen
                </Button> */}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-xs text-gray-400">E-Mail</p>
                    <p className="text-white font-medium">{customer.email}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="text-xs text-gray-400">Telefon</p>
                    <p className="text-white font-medium">{customer.phone}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-purple-400" />
                  <div>
                    <p className="text-xs text-gray-400">Erstellt</p>
                    <p className="text-white font-medium">
                      {new Date(
                        customer.createdAt || Date.now()
                      ).toLocaleDateString("de-DE")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Service Details */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="h-5 w-5 text-red-500" />
                Service Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Reparatur Art</p>
                <p className="text-white font-medium">{customer.repairType}</p>
              </div>

              <Separator className="bg-white/10" />

              <div>
                <p className="text-xs text-gray-400 mb-1">Felge beschädigt</p>
                <Badge
                  className={
                    customer.rimDamaged === "ja"
                      ? "bg-red-500/20 text-red-500"
                      : "bg-green-500/20 text-green-500"
                  }
                >
                  {customer.rimDamaged === "ja" ? "Ja" : "Nein"}
                </Badge>
              </div>

              <Separator className="bg-white/10" />

              <div>
                <p className="text-xs text-gray-400 mb-1">Status</p>
                {getStatusBadge(customer.status)}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="bg-white/5 border-white/10 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-red-500" />
                Schadensbeschreibung
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-gray-300 leading-relaxed">
                  {customer.damageDescription || customer.damageDescription}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Images Section */}
        {customer.imageIds?.length > 0 && (
          <Card className="bg-white/5 border-white/10 mt-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Eye className="h-5 w-5 text-red-500" />
                Hochgeladene Bilder ({customer.imageIds.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {customer.imageIds.map((img, i) => (
                  <div
                    key={i}
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
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Print Options (Hidden) */}
        <div ref={printRef} className="hidden print:block">
          {/* Print content here */}
        </div>

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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
