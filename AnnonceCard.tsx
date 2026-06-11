import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Eye, Navigation } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import ImageFullscreen from '@/components/ui/ImageFullscreen';
import AnnonceLikeButton from '@/components/annonces/AnnonceLikeButton';
import type { Annonce } from '@/types/index';
import { BIEN_TYPE_LABELS, COMMODITES_MAP } from '@/types/index';
import { formatPrix, formatDateCourt } from '@/lib/utils-immo';
import { useGeolocation, haversineKm, VILLE_COORDS } from '@/hooks/use-geolocation';

interface AnnonceCardProps {
  annonce: Annonce;
}

export default function AnnonceCard({ annonce }: AnnonceCardProps) {
  const image = annonce.images[0] || null;
  const prix = annonce.prix_mensuel ?? annonce.prix_journalier ?? annonce.prix_horaire;
  const [fullscreen, setFullscreen] = useState(false);
  const [fsIndex, setFsIndex] = useState(0);
  const userCoords = useGeolocation();

  // Calculer la distance si l'utilisateur a partagé sa position
  const distanceKm: number | null = (() => {
    if (!userCoords) return null;
    const villeCoords = VILLE_COORDS[annonce.ville];
    if (!villeCoords) return null;
    return haversineKm(userCoords.lat, userCoords.lng, villeCoords.lat, villeCoords.lng);
  })();

  const handleClick = (e: React.MouseEvent) => {
    if (!image) return;
    e.preventDefault();
    e.stopPropagation();
    setFsIndex(0);
    setFullscreen(true);
  };

  return (
    <>
      <Link to={`/annonces/${annonce.id}`} className="block group">
        <Card className="overflow-hidden h-full flex flex-col annonce-card-hover border border-border">
          {/* Image */}
          <div
            className="aspect-[4/3] w-full overflow-hidden bg-muted relative"
            onClick={handleClick}
            title={image ? 'Cliquer pour agrandir' : undefined}
          >
            {image ? (
              <img
                src={image}
                alt={annonce.titre}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-zoom-in"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <span className="text-muted-foreground text-sm">Aucune image</span>
              </div>
            )}
            {/* Badge type de bien */}
            <div className="absolute top-2 left-2">
              <Badge className="bg-primary/90 text-primary-foreground text-xs">
                {BIEN_TYPE_LABELS[annonce.bien_type]}
              </Badge>
            </div>
          </div>

          {/* Contenu */}
          <div className="p-4 flex flex-col flex-1 gap-2">
            <h3 className="font-semibold text-base text-foreground line-clamp-1 text-balance">
              {annonce.titre}
            </h3>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{annonce.ville} — {annonce.arrondissement}</span>
              {distanceKm !== null && (
                <span className="ml-auto shrink-0 flex items-center gap-0.5 text-xs text-primary font-medium">
                  <Navigation className="w-3 h-3" />
                  {distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m` : `${distanceKm.toFixed(1)} km`}
                </span>
              )}
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2 flex-1 text-pretty">
              {annonce.description}
            </p>

            {/* Pièces — Maison uniquement */}
            {annonce.bien_type === 'maison' && (annonce.nb_chambres || annonce.nb_salon || annonce.nb_toilette || annonce.nb_douche) && (
              <div className="flex flex-wrap gap-2">
                {annonce.nb_chambres != null && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/8 border border-primary/15 text-foreground">
                    🛏️ {annonce.nb_chambres}
                  </span>
                )}
                {annonce.nb_salon != null && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/8 border border-primary/15 text-foreground">
                    🛋️ {annonce.nb_salon}
                  </span>
                )}
                {annonce.nb_toilette != null && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/8 border border-primary/15 text-foreground">
                    🚽 {annonce.nb_toilette}
                  </span>
                )}
                {annonce.nb_douche != null && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/8 border border-primary/15 text-foreground">
                    🚿 {annonce.nb_douche}
                  </span>
                )}
              </div>
            )}

            {/* Commodités — 4 premières, Type 2 uniquement */}
            {Array.isArray(annonce.commodites) && annonce.commodites.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {annonce.commodites.slice(0, 4).map(id => {
                  const c = COMMODITES_MAP[id];
                  if (!c) return null;
                  return (
                    <span
                      key={id}
                      title={c.label}
                      className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/8 border border-primary/15 text-foreground"
                    >
                      <span className="text-sm leading-none">{c.emoji}</span>
                      <span className="hidden sm:inline">{c.label}</span>
                    </span>
                  );
                })}
                {annonce.commodites.length > 4 && (
                  <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                    +{annonce.commodites.length - 4}
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
              <span className="font-bold text-primary text-sm">
                {annonce.bien_type === 'hotel' ? (
                  (() => {
                    const premier = annonce.tarif_hotel_detente ?? annonce.tarif_hotel_nuitee
                      ?? annonce.tarif_hotel_journee ?? annonce.tarif_hotel_sejour ?? annonce.tarif_hotel_suite;
                    const label = annonce.tarif_hotel_detente ? '⏱️/h'
                      : annonce.tarif_hotel_nuitee ? '🌙/nuit'
                      : annonce.tarif_hotel_journee ? '☀️/jour'
                      : annonce.tarif_hotel_sejour ? '🧳 séjour'
                      : '👑 suite';
                    return premier ? <>{formatPrix(premier)}<span className="text-xs font-normal ml-1 text-muted-foreground">{label}</span></> : '—';
                  })()
                ) : (
                  <>{formatPrix(prix)}{annonce.prix_mensuel ? '/mois' : annonce.prix_journalier ? '/jour' : '/heure'}</>
                )}
              </span>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {/* Vues */}
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />{annonce.visit_count}
                </span>
                {/* Like */}
                <AnnonceLikeButton annonceId={annonce.id} size="sm" />
                {/* Date */}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />{formatDateCourt(annonce.created_at)}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </Link>

      {/* Visionneuse plein écran */}
      {fullscreen && image && (
        <ImageFullscreen
          images={annonce.images}
          index={fsIndex}
          onIndexChange={setFsIndex}
          onClose={() => setFullscreen(false)}
          alt={annonce.titre}
        />
      )}
    </>
  );
}
