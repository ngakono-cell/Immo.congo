import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/db/supabase';
import { compressImage } from '@/lib/utils-immo';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { Capacitor } from '@capacitor/core';
import CameraButton from '@/components/native/CameraButton';

interface ImageUploadProps {
  images: string[];
  onChange: (urls: string[]) => void;
  maxImages?: number;
  bucket?: string;
}

export default function ImageUpload({
  images,
  onChange,
  maxImages = 8,
  bucket = 'annonces-images',
}: ImageUploadProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const isNative = Capacitor.isNativePlatform();

  const uploadBase64 = async (base64: string, mimeType: string) => {
    if (!user) return;
    setUploading(true);
    try {
      // Convertir base64 → Blob
      const byteChars = atob(base64);
      const byteNumbers = Array.from(byteChars, c => c.charCodeAt(0));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      const file = new File([blob], 'photo.jpg', { type: mimeType });
      const compressed = await compressImage(file);
      const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).slice(2)}.webp`;
      const { error } = await supabase.storage.from(bucket).upload(fileName, compressed, {
        cacheControl: '3600', upsert: false,
      });
      if (error) { toast.error(`Erreur upload: ${error.message}`); return; }
      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
      onChange([...images, data.publicUrl]);
      toast.success('Photo ajoutée');
    } catch {
      toast.error('Erreur lors du traitement de la photo');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || !user) return;
    const fileArray = Array.from(files).slice(0, maxImages - images.length);
    if (fileArray.length === 0) return;

    setUploading(true);
    setProgress(0);
    const newUrls: string[] = [];

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
      try {
        const compressed = await compressImage(file);
        const wasCompressed = compressed.size < file.size;
        const ext = 'webp';
        const fileName = `${user.id}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from(bucket).upload(fileName, compressed, {
          cacheControl: '3600', upsert: false,
        });
        if (error) { toast.error(`Erreur upload: ${error.message}`); continue; }
        const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
        newUrls.push(data.publicUrl);
        if (wasCompressed) {
          toast.success(`Image compressée automatiquement (${Math.round(compressed.size / 1024)} Ko)`);
        } else {
          toast.success('Image téléversée avec succès');
        }
      } catch {
        toast.error(`Erreur lors du traitement de ${file.name}`);
      }
      setProgress(Math.round(((i + 1) / fileArray.length) * 100));
    }

    onChange([...images, ...newUrls]);
    setUploading(false);
    setProgress(0);
  };

  const removeImage = (url: string) => {
    onChange(images.filter(img => img !== url));
  };

  return (
    <div className="space-y-3">
      {/* Boutons caméra native sur mobile */}
      {isNative && images.length < maxImages && (
        <CameraButton onPhoto={uploadBase64} disabled={uploading} />
      )}

      {/* Zone de drop / upload (web seulement ou complément mobile) */}
      {!isNative && (
        <div
          className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-accent/30 transition-colors"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        >
          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm font-medium text-foreground">
            Cliquez ou glissez vos photos ici
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            JPEG, PNG, WEBP — Max 1 Mo par image (compression automatique)
          </p>
          <p className="text-xs text-muted-foreground">
            {images.length}/{maxImages} images
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp,image/avif"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Barre de progression */}
      {uploading && (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Téléversement en cours...
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Prévisualisation */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {images.map((url, idx) => (
            <div key={url} className="relative aspect-square overflow-hidden rounded-md bg-muted group">
              <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
              {idx === 0 && (
                <span className="absolute bottom-1 left-1 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded">
                  Principale
                </span>
              )}
            </div>
          ))}
          {images.length < maxImages && !uploading && !isNative && (
            <Button
              type="button"
              variant="outline"
              className="aspect-square h-auto flex flex-col items-center justify-center gap-1 rounded-md border-dashed"
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="w-5 h-5" />
              <span className="text-xs">Ajouter</span>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
