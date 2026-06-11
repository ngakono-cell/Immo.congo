// Bannière publicitaire défilante — IMMO CONGO

import { useState, useEffect, useRef } from 'react';
import { Megaphone, X } from 'lucide-react';
import { supabase } from '@/db/supabase';
import type { Publicite } from '@/types/index';

export default function PubliciteBanner() {
  const [pubs, setPubs]         = useState<Publicite[]>([]);
  const [closed, setClosed]     = useState(false);
  const [pauseAnim, setPause]   = useState(false);
  const trackRef                = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const now = new Date().toISOString();
    supabase
      .from('publicites')
      .select('id, titre, contenu, lien, image_url, starts_at, ends_at')
      .eq('is_active', true)
      .or(`starts_at.is.null,starts_at.lte.${now}`)
      .or(`ends_at.is.null,ends_at.gte.${now}`)
      .order('created_at', { ascending: false })
      .limit(10)
      .then(({ data }) => { if (data && data.length > 0) setPubs(data as Publicite[]); });
  }, []);

  if (closed || pubs.length === 0) return null;

  // Dupliquer les items pour un défilement continu sans saut
  const items = [...pubs, ...pubs];

  return (
    <div className="relative w-full bg-primary text-primary-foreground overflow-hidden select-none"
      style={{ height: '36px' }}>
      {/* Label gauche */}
      <div className="absolute left-0 top-0 h-full z-10 flex items-center gap-1.5 px-3
                      bg-primary border-r border-primary-foreground/20 shrink-0">
        <Megaphone className="w-3.5 h-3.5 opacity-90 shrink-0" />
        <span className="text-xs font-semibold whitespace-nowrap uppercase tracking-wide opacity-90">
          Offres
        </span>
      </div>

      {/* Piste défilante */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ left: '90px', right: '36px' }}
        onMouseEnter={() => setPause(true)}
        onMouseLeave={() => setPause(false)}
      >
        <div
          ref={trackRef}
          className="flex items-center h-full whitespace-nowrap"
          style={{
            animation: `ticker ${pubs.length * 20}s linear infinite`,
            animationPlayState: pauseAnim ? 'paused' : 'running',
            width: 'max-content',
          }}
        >
          {items.map((pub, i) => (
            <span key={`${pub.id}-${i}`} className="inline-flex items-center gap-2 mx-8">
              {pub.lien ? (
                <a
                  href={pub.lien}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium hover:underline underline-offset-2 opacity-95 hover:opacity-100 transition-opacity"
                  onClick={e => e.stopPropagation()}
                >
                  {pub.titre}
                  {pub.contenu && (
                    <span className="font-normal opacity-80"> — {pub.contenu}</span>
                  )}
                </a>
              ) : (
                <span className="text-xs font-medium opacity-95">
                  {pub.titre}
                  {pub.contenu && (
                    <span className="font-normal opacity-80"> — {pub.contenu}</span>
                  )}
                </span>
              )}
              {/* Séparateur */}
              <span className="opacity-40 mx-2 text-sm">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* Bouton fermer */}
      <button
        onClick={() => setClosed(true)}
        aria-label="Fermer la bannière"
        className="absolute right-0 top-0 h-full w-9 flex items-center justify-center
                   hover:bg-primary-foreground/10 transition-colors border-l border-primary-foreground/20"
      >
        <X className="w-3.5 h-3.5 opacity-70 hover:opacity-100" />
      </button>
    </div>
  );
}
