
-- Table likes des annonces (un like unique par fingerprint × annonce)
CREATE TABLE annonce_likes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  annonce_id  uuid NOT NULL REFERENCES annonces(id) ON DELETE CASCADE,
  fingerprint text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (annonce_id, fingerprint)
);

CREATE INDEX idx_annonce_likes_annonce ON annonce_likes (annonce_id);

ALTER TABLE annonce_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "annonce_likes_select_public" ON annonce_likes FOR SELECT USING (true);
CREATE POLICY "annonce_likes_insert_public" ON annonce_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "annonce_likes_delete_own"    ON annonce_likes FOR DELETE USING (true);
