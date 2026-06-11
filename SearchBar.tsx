import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { SearchFilters, BienType } from '@/types/index';
import { VILLES, BIEN_TYPE_LABELS, getArrondissements } from '@/lib/utils-immo';

interface SearchBarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch?: () => void;
}

export default function SearchBar({ filters, onFiltersChange, onSearch }: SearchBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const arrondissements = filters.ville ? getArrondissements(filters.ville) : [];

  const update = (key: keyof SearchFilters, value: string | number | undefined) => {
    const next = { ...filters, [key]: value };
    if (key === 'ville') next.arrondissement = '';
    onFiltersChange(next);
  };

  const reset = () => {
    onFiltersChange({});
    setShowAdvanced(false);
  };

  const hasFilters = Object.values(filters).some(v => v !== '' && v != null);

  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-3">
      {/* Ligne principale */}
      <div className="flex gap-2">
        <Select value={filters.ville || 'all'} onValueChange={v => update('ville', v === 'all' ? '' : v)}>
          <SelectTrigger className="w-44 shrink-0">
            <SelectValue placeholder="Ville" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les villes</SelectItem>
            {VILLES.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
          </SelectContent>
        </Select>

        <div className="flex-1 min-w-0 flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={() => setShowAdvanced(s => !s)}
            title="Filtres avancés"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Button>

          {hasFilters && (
            <Button variant="ghost" size="icon" className="shrink-0" onClick={reset} title="Réinitialiser">
              <X className="w-4 h-4" />
            </Button>
          )}

          <Button className="flex-1" onClick={onSearch}>
            <Search className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Rechercher</span>
          </Button>
        </div>
      </div>

      {/* Filtres avancés */}
      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-1 border-t border-border">
          {/* Arrondissement */}
          <Select
            value={filters.arrondissement || 'all'}
            onValueChange={v => update('arrondissement', v === 'all' ? '' : v)}
            disabled={!filters.ville}
          >
            <SelectTrigger>
              <SelectValue placeholder="Arrondissement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              {arrondissements.map(a => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>

          {/* Type de bien */}
          <Select
            value={filters.bien_type || 'all'}
            onValueChange={v => update('bien_type', v === 'all' ? '' : v as BienType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Type de bien" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les biens</SelectItem>
              {Object.entries(BIEN_TYPE_LABELS).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Prix max */}
          <Input
            type="number"
            placeholder="Prix max (FCFA)"
            value={filters.prix_max || ''}
            onChange={e => update('prix_max', e.target.value ? Number(e.target.value) : '')}
          />

          {/* Tri */}
          <Select
            value={filters.sort || 'recent'}
            onValueChange={v => update('sort', v as SearchFilters['sort'])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Plus récentes</SelectItem>
              <SelectItem value="prix_asc">Prix croissant</SelectItem>
              <SelectItem value="prix_desc">Prix décroissant</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
