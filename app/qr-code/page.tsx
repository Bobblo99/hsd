"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Printer, Download, Smartphone, Users, CheckCircle } from "lucide-react";

export default function QRCodePage() {
  const kundenUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://ihre-domain.com'}/kunde`;

  const handleGenerateQR = () => {
    // Öffne QR-Code Generator mit der URL
    window.open(`https://qr-code-generator.com/?url=${encodeURIComponent(kundenUrl)}`, '_blank');
  };

  const handleQRServer = () => {
    // Alternative QR-Code Generator
    window.open(`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(kundenUrl)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-3xl font-bold text-red-500 mb-4">HSD GmbH</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            QR-Code Generator
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Erstellen Sie einen QR-Code für die Kundenregistrierung in Ihrer Werkstatt
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* QR-Code Info */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <QrCode className="h-6 w-6 text-red-500" />
                QR-Code erstellen
              </CardTitle>
              <CardDescription className="text-gray-400">
                Generieren Sie einen QR-Code für die Kundenseite
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-300 mb-2">URL für QR-Code:</p>
                <code className="text-red-400 text-sm break-all">{kundenUrl}</code>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={handleGenerateQR}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3"
                >
                  <QrCode className="h-5 w-5 mr-2" />
                  QR-Code generieren (qr-code-generator.com)
                </Button>

                <Button
                  onClick={handleQRServer}
                  variant="outline"
                  className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10 py-3"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Direkt herunterladen (QR Server)
                </Button>
              </div>

              <div className="text-sm text-gray-400 space-y-2">
                <p><strong>Empfohlene Größe:</strong> 400x400 Pixel oder größer</p>
                <p><strong>Format:</strong> PNG oder SVG für beste Qualität</p>
                <p><strong>Fehlerkorrektur:</strong> Mittel (M) oder Hoch (H)</p>
              </div>
            </CardContent>
          </Card>

          {/* Anleitung */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <Printer className="h-6 w-6 text-red-500" />
                Anleitung
              </CardTitle>
              <CardDescription className="text-gray-400">
                So verwenden Sie den QR-Code in Ihrer Werkstatt
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h4 className="text-white font-medium">QR-Code generieren</h4>
                    <p className="text-gray-400 text-sm">Klicken Sie auf einen der Buttons oben</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h4 className="text-white font-medium">QR-Code herunterladen</h4>
                    <p className="text-gray-400 text-sm">Speichern Sie das Bild auf Ihrem Computer</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Ausdrucken</h4>
                    <p className="text-gray-400 text-sm">Drucken Sie den QR-Code in guter Qualität aus</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    4
                  </div>
                  <div>
                    <h4 className="text-white font-medium">In Werkstatt aufhängen</h4>
                    <p className="text-gray-400 text-sm">Platzieren Sie ihn gut sichtbar für Kunden</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-400 mb-2">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">Fertig!</span>
                </div>
                <p className="text-sm text-gray-300">
                  Kunden können jetzt den QR-Code scannen und direkt zur Anmeldung gelangen.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Verwendung */}
        <Card className="bg-white/5 border-white/10 mt-8">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Users className="h-6 w-6 text-red-500" />
              Verwendung in der Praxis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <Smartphone className="h-12 w-12 text-red-500 mx-auto mb-3" />
                <h4 className="text-white font-medium mb-2">Kunde scannt</h4>
                <p className="text-gray-400 text-sm">
                  Kunde scannt QR-Code mit Smartphone
                </p>
              </div>

              <div className="text-center">
                <Users className="h-12 w-12 text-red-500 mx-auto mb-3" />
                <h4 className="text-white font-medium mb-2">Formular ausfüllen</h4>
                <p className="text-gray-400 text-sm">
                  Kunde oder Mitarbeiter füllt Formular aus
                </p>
              </div>

              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
                <h4 className="text-white font-medium mb-2">Sofort im Admin</h4>
                <p className="text-gray-400 text-sm">
                  Anfrage erscheint direkt im Admin-Dashboard
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Zusätzliche Tipps */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">💡 Profi-Tipps</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <p><strong>Platzierung:</strong> Gut sichtbar am Empfang oder Wartebereich</p>
              <p><strong>Größe:</strong> Mindestens 5x5 cm für gute Scannbarkeit</p>
            </div>
            <div>
              <p><strong>Text hinzufügen:</strong> "Felgenservice anmelden - QR-Code scannen"</p>
              <p><strong>Laminieren:</strong> Schutz vor Verschmutzung in der Werkstatt</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}