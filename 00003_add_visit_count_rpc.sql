-- Fonction pour incrémenter le compteur de visites
CREATE OR REPLACE FUNCTION increment_visit_count(annonce_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE annonces SET visit_count = visit_count + 1 WHERE id = annonce_id;
$$;

-- S'assurer que visit_count a une valeur par défaut
ALTER TABLE annonces ALTER COLUMN visit_count SET DEFAULT 0;