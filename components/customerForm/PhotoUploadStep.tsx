"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Upload,
  X,
  Camera,
  ArrowLeft,
  Send,
  Image as ImageIcon,
} from "lucide-react";

interface PhotoUploadStepProps {
  photos: File[];
  onPhotosChange: (photos: File[]) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export function PhotoUploadStep({
  photos,
  onPhotosChange,
  onSubmit,
  onBack,
  isSubmitting = false,
}: PhotoUploadStepProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length !== files.length) {
      // Could show toast here for non-image files
    }

    const newPhotos = [...photos, ...imageFiles].slice(0, 5); // Max 5 photos
    onPhotosChange(newPhotos);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    const newPhotos = [...photos, ...imageFiles].slice(0, 5);
    onPhotosChange(newPhotos);
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-2xl text-white flex items-center gap-2">
          <Camera className="h-6 w-6 text-red-500" />
          Fotos hochladen
        </CardTitle>
        <p className="text-gray-400">
          Laden Sie Fotos Ihrer Felgen hoch (optional, max. 5 Bilder)
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            dragActive
              ? "border-red-500 bg-red-500/10"
              : "border-white/20 hover:border-red-500/50 hover:bg-white/5"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            Fotos hier ablegen oder auswählen
          </h3>
          <p className="text-gray-400 mb-4">
            JPG, PNG oder WEBP • Maximal 5 Bilder • Bis zu 10MB pro Bild
          </p>

          <input
            type="file"
            multiple
            accept="image/png,image/jpeg,application/pdf"
            onChange={handleFileSelect}
            className="hidden"
            id="photo-upload"
            disabled={photos.length >= 5}
          />

          <Button
            type="button"
            onClick={() => document.getElementById("photo-upload")?.click()}
            disabled={photos.length >= 5}
            className="bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            {photos.length >= 5 ? "Maximum erreicht" : "Fotos auswählen"}
          </Button>
        </div>

        {/* Photo Preview */}
        {photos.length > 0 && (
          <div>
            <h4 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-red-500" />
              Ausgewählte Fotos ({photos.length}/5)
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-white/5 border border-white/10">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt={`Felge ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>

                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {photo.name.length > 15
                      ? `${photo.name.slice(0, 15)}...`
                      : photo.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <h4 className="text-blue-400 font-medium mb-2">
            💡 Tipp für bessere Fotos:
          </h4>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Fotografieren Sie bei gutem Licht</li>
            <li>• Zeigen Sie alle beschädigten Stellen</li>
            <li>• Machen Sie Übersichts- und Detailaufnahmen</li>
            <li>• Halten Sie die Kamera ruhig</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            type="button"
            onClick={onBack}
            variant="outline"
            className="flex-1 bg-white/5 border-white/20 text-white hover:bg-white/10"
            disabled={isSubmitting}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück
          </Button>

          <Button
            type="button"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Wird gesendet...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Anfrage absenden
              </>
            )}
          </Button>
        </div>

        {/* Optional Note */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">
            Sie können die Anfrage auch ohne Fotos absenden. Fotos helfen uns
            aber bei der besseren Beratung.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
