
-- Table vues des réels (une vue unique par fingerprint × reel)
CREATE TABLE reel_views (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reel_id     text  NOT NULL,
  reel_source text  NOT NULL CHECK (reel_source IN ('annonce', 'publicite')),
  fingerprint text  NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (reel_id, reel_source, fingerprint)
);

-- Table likes des réels (un like unique par fingerprint × reel)
CREATE TABLE reel_likes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reel_id     text  NOT NULL,
  reel_source text  NOT NULL CHECK (reel_source IN ('annonce', 'publicite')),
  fingerprint text  NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (reel_id, reel_source, fingerprint)
);

-- Index pour les requêtes de comptage
CREATE INDEX idx_reel_views_reel ON reel_views (reel_id, reel_source);
CREATE INDEX idx_reel_likes_reel ON reel_likes (reel_id, reel_source);

-- RLS
ALTER TABLE reel_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE reel_likes ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut lire les comptages
CREATE POLICY "reel_views_select_public" ON reel_views FOR SELECT USING (true);
CREATE POLICY "reel_likes_select_public" ON reel_likes FOR SELECT USING (true);

-- Tout le monde peut enregistrer une vue / un like
CREATE POLICY "reel_views_insert_public" ON reel_views FOR INSERT WITH CHECK (true);
CREATE POLICY "reel_likes_insert_public" ON reel_likes FOR INSERT WITH CHECK (true);

-- Tout le monde peut supprimer son propre like (par fingerprint)
CREATE POLICY "reel_likes_delete_own" ON reel_likes FOR DELETE USING (true);
