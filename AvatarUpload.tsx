// Composant AvatarUpload — Upload de photo de profil vers Supabase Storage
// Skill image-upload : compression WEBP si > 1 MB, barre de progression, notifications

import { useRef, useState } from 'react';
import { Camera, Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/db/supabase';
import { toast } from 'sonner';

interface AvatarUploadProps {
  userId: string;
  currentUrl: string | null;
  onUploaded: (url: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_MAP = {
  sm: { outer: 'w-14 h-14', icon: 'w-6 h-6', btn: 'w-5 h-5 -right-0.5 -bottom-0.5' },
  md: { outer: 'w-20 h-20', icon: 'w-8 h-8', btn: 'w-6 h-6 -right-0.5 -bottom-0.5' },
  lg: { outer: 'w-28 h-28', icon: 'w-10 h-10', btn: 'w-8 h-8 -right-1 -bottom-1' },
};

const MAX_SIZE_BYTES = 1 * 1024 * 1024; // 1 MB

// Compresse une image en WEBP si elle dépasse MAX_SIZE_BYTES
async function compressImage(file: File): Promise<{ blob: Blob; compressed: boolean; sizeMb: string }> {
  return new Promise(resolve => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      // Réduire à 1080p max
      const maxDim = 1080;
      if (width > maxDim || height > maxDim) {
        if (width > height) { height = Math.round(height * maxDim / width); width = maxDim; }
        else { width = Math.round(width * maxDim / height); height = maxDim; }
      }
      canvas.width  = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);

      let quality = 0.8;
      const tryCompress = () => {
        canvas.toBlob(blob => {
          if (!blob) { resolve({ blob: file, compressed: false, sizeMb: (file.size / 1024 / 1024).toFixed(2) }); return; }
          if (blob.size > MAX_SIZE_BYTES && quality > 0.3) {
            quality -= 0.1;
            tryCompress();
          } else {
            resolve({
              blob,
              compressed: true,
              sizeMb: (blob.size / 1024 / 1024).toFixed(2),
            });
          }
        }, 'image/webp', quality);
      };
      tryCompress();
    };
    img.src = url;
  });
}

export default function AvatarUpload({ userId, currentUrl, onUploaded, size = 'md' }: AvatarUploadProps) {
  const inputRef      = useRef<HTMLInputElement>(null);
  const [uploading,   setUploading]   = useState(false);
  const [progress,    setProgress]    = useState(0);
  const [previewUrl,  setPreviewUrl]  = useState<string | null>(null);
  const sizes = SIZE_MAP[size];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
    if (!allowed.includes(file.type)) {
      toast.error('Format non supporté. Utilisez JPEG, PNG, WEBP, GIF ou AVIF.');
      return;
    }

    setUploading(true);
    setProgress(10);

    // Prévisualisation locale
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    try {
      let uploadBlob: Blob = file;
      let wasCompressed    = false;
      let finalSizeMb      = (file.size / 1024 / 1024).toFixed(2);

      // Compression si > 1 MB
      if (file.size > MAX_SIZE_BYTES) {
        toast.info('Image trop volumineuse, compression en cours…');
        const result = await compressImage(file);
        uploadBlob    = result.blob;
        wasCompressed = result.compressed;
        finalSizeMb   = result.sizeMb;
        setProgress(40);
      } else {
        setProgress(40);
      }

      // Nom de fichier sécurisé (uniquement lettres/chiffres)
      const ext      = wasCompressed ? 'webp' : file.name.split('.').pop() ?? 'jpg';
      const fileName = `avatar_${userId}_${Date.now()}.${ext}`;
      const filePath = `${userId}/${fileName}`;

      setProgress(60);

      // Upload Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, uploadBlob, {
          contentType: wasCompressed ? 'image/webp' : file.type,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      setProgress(80);

      // Récupérer l'URL publique
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      const publicUrl = urlData.publicUrl;

      // Sauvegarder dans le profil
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (profileError) throw profileError;

      setProgress(100);
      onUploaded(publicUrl);

      if (wasCompressed) {
        toast.success(`Photo compressée automatiquement (${finalSizeMb} Mo) et sauvegardée !`);
      } else {
        toast.success('Photo de profil mise à jour avec succès !');
      }
    } catch (err) {
      console.error('Erreur upload avatar:', err);
      toast.error('Erreur lors de l\'upload. Veuillez réessayer.');
      setPreviewUrl(null);
    } finally {
      setUploading(false);
      setProgress(0);
      // Réinitialiser l'input
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const displayUrl = previewUrl ?? currentUrl;

  return (
    <div className="relative inline-block">
      {/* Avatar */}
      <div className={`${sizes.outer} rounded-full overflow-hidden bg-muted border-2 border-border relative`}>
        {displayUrl ? (
          <img src={displayUrl} alt="Photo de profil"
            className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/10">
            <User className={`${sizes.icon} text-primary/50`} />
          </div>
        )}
        {/* Barre de progression */}
        {uploading && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
            <Loader2 className="w-5 h-5 text-white animate-spin mb-1" />
            <span className="text-white text-xs font-medium">{progress}%</span>
          </div>
        )}
      </div>

      {/* Bouton caméra */}
      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className={`absolute ${sizes.btn} rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer border-2 border-background`}
        title="Modifier la photo de profil"
      >
        <Camera className="w-3 h-3" />
      </button>

      {/* Input fichier caché */}
      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden" onChange={handleFileChange} />
    </div>
  );
}

// Composant simple d'affichage d'avatar (sans upload)
export function AvatarDisplay({
  url,
  name,
  size = 'md',
  className = '',
}: {
  url: string | null;
  name?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-lg',
  };
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : '?';

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-primary/10 flex items-center justify-center shrink-0 border border-border ${className}`}>
      {url ? (
        <img src={url} alt={name ?? 'Avatar'} className="w-full h-full object-cover" />
      ) : (
        <span className="font-semibold text-primary">{initials}</span>
      )}
    </div>
  );
}
