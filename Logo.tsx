// Composant Logo IMMO CONGO — charge dynamiquement depuis les settings Supabase
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/db/supabase';

// URL de fallback — logo IMMO CONGO fond transparent (hébergé dans Supabase Storage)
const FALLBACK_LOGO_URL =
  'https://nvmqblwnwxcmyobitvze.supabase.co/storage/v1/object/public/logos/logo_transparent.png';

// Cache en mémoire pour éviter de recharger à chaque montage
let cachedLogoUrl: string | null = null;

interface LogoProps {
  /** Taille en pixels (largeur = hauteur). Par défaut : 40 */
  size?: number;
  /** Afficher le texte "IMMO CONGO" à côté du logo */
  withText?: boolean;
  /** Lier vers la page d'accueil. Par défaut : true */
  linked?: boolean;
  className?: string;
}

export default function Logo({ size = 40, withText = false, linked = true, className = '' }: LogoProps) {
  const [logoUrl, setLogoUrl] = useState<string>(cachedLogoUrl ?? FALLBACK_LOGO_URL);

  useEffect(() => {
    // Si déjà en cache, pas besoin de requête
    if (cachedLogoUrl) { setLogoUrl(cachedLogoUrl); return; }

    supabase
      .from('settings')
      .select('value')
      .eq('key', 'logo_url')
      .maybeSingle()
      .then(({ data }) => {
        if (data?.value) {
          cachedLogoUrl = data.value;
          setLogoUrl(data.value);
        }
      });
  }, []);

  const img = (
    <img
      src={logoUrl}
      alt="IMMO CONGO — Logo"
      width={size}
      height={size}
      className="object-contain shrink-0"
      style={{ width: size, height: size }}
      onError={() => setLogoUrl(FALLBACK_LOGO_URL)}
    />
  );

  const inner = withText ? (
    <span className={`flex items-center gap-2 ${className}`}>
      {img}
      <span className="font-bold text-primary text-lg leading-none hidden sm:block">IMMO CONGO</span>
    </span>
  ) : (
    <span className={`inline-flex ${className}`}>{img}</span>
  );

  if (!linked) return inner;

  return (
    <Link to="/" className="shrink-0 flex items-center gap-2">
      {inner}
    </Link>
  );
}
