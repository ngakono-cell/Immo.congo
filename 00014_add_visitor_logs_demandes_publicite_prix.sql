
-- Table: demandes de publicité (visiteurs)
CREATE TABLE demandes_publicite (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom_prenom   text NOT NULL,
  whatsapp     text NOT NULL,
  message      text NOT NULL,
  statut       text NOT NULL DEFAULT 'en_attente' CHECK (statut IN ('en_attente','approuve','refuse')),
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE demandes_publicite ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut soumettre
CREATE POLICY "demandes_pub_insert_public"
  ON demandes_publicite FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Admin seulement peut lire
CREATE POLICY "demandes_pub_select_admin"
  ON demandes_publicite FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Admin seulement peut modifier
CREATE POLICY "demandes_pub_update_admin"
  ON demandes_publicite FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Admin seulement peut supprimer
CREATE POLICY "demandes_pub_delete_admin"
  ON demandes_publicite FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Table: logs de visites (1 ligne par visite, page = '/')
CREATE TABLE visitor_logs (
  id         bigserial PRIMARY KEY,
  page       text NOT NULL DEFAULT '/',
  visited_at date NOT NULL DEFAULT CURRENT_DATE
);

ALTER TABLE visitor_logs ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut insérer une visite
CREATE POLICY "visitor_logs_insert_public"
  ON visitor_logs FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Admin seulement peut lire
CREATE POLICY "visitor_logs_select_admin"
  ON visitor_logs FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Paramètre prix_publicite dans la table settings
INSERT INTO settings (key, value)
VALUES ('prix_publicite', '5000')
ON CONFLICT (key) DO NOTHING;
