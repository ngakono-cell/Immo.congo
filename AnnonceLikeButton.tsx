// Bouton ❤️ like pour une annonce — IMMO CONGO

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { supabase } from '@/db/supabase';

// Fingerprint visiteur anonyme (localStorage)
function getFingerprint(): string {
  const key = 'immo_reel_fp';
  let fp = localStorage.getItem(key);
  if (!fp) {
    fp = crypto.randomUUID();
    localStorage.setItem(key, fp);
  }
  return fp;
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

interface Props {
  annonceId: string;
  /** Taille : 'sm' (carte) | 'md' (détail) */
  size?: 'sm' | 'md';
  /** Classe CSS supplémentaire */
  className?: string;
}

export default function AnnonceLikeButton({ annonceId, size = 'sm', className = '' }: Props) {
  const [likes, setLikes]   = useState(0);
  const [liked, setLiked]   = useState(false);
  const [loading, setLoading] = useState(false);
  const fp = getFingerprint();

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const [countRes, myRes] = await Promise.all([
        supabase
          .from('annonce_likes')
          .select('id', { count: 'exact', head: true })
          .eq('annonce_id', annonceId),
        supabase
          .from('annonce_likes')
          .select('id')
          .eq('annonce_id', annonceId)
          .eq('fingerprint', fp)
          .maybeSingle(),
      ]);
      if (cancelled) return;
      setLikes(countRes.count ?? 0);
      setLiked(!!myRes.data);
    };
    load();
    return () => { cancelled = true; };
  }, [annonceId, fp]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();   // évite la navigation si dans un <Link>
    e.stopPropagation();
    if (loading) return;
    setLoading(true);

    if (liked) {
      await supabase
        .from('annonce_likes')
        .delete()
        .eq('annonce_id', annonceId)
        .eq('fingerprint', fp);
      setLiked(false);
      setLikes(n => Math.max(0, n - 1));
    } else {
      await supabase
        .from('annonce_likes')
        .insert({ annonce_id: annonceId, fingerprint: fp });
      setLiked(true);
      setLikes(n => n + 1);
    }
    setLoading(false);
  };

  const iconSize  = size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
  const textSize  = size === 'md' ? 'text-sm'  : 'text-xs';
  const btnSize   = size === 'md' ? 'gap-1.5 px-3 py-1.5' : 'gap-1 px-2 py-1';

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={liked ? 'Retirer le like' : 'Aimer cette annonce'}
      className={`
        flex items-center ${btnSize} rounded-full transition-all duration-200
        ${liked
          ? 'bg-red-500 text-white shadow-sm'
          : 'bg-muted hover:bg-red-50 text-muted-foreground hover:text-red-500 border border-border'}
        ${className}
      `}
    >
      <Heart
        className={`${iconSize} transition-all duration-200 ${liked ? 'fill-white' : ''}`}
      />
      <span className={`${textSize} font-semibold tabular-nums`}>
        {formatCount(likes)}
      </span>
    </button>
  );
}
