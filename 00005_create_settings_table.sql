-- Table des paramètres globaux de la plateforme
CREATE TABLE settings (
  key   text PRIMARY KEY,
  value text NOT NULL DEFAULT ''
);

-- Activer RLS
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Les admins ont accès complet
CREATE POLICY "Admins can manage settings"
  ON settings FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

-- Tout le monde peut lire les paramètres publics
CREATE POLICY "Anyone can read settings"
  ON settings FOR SELECT TO anon, authenticated
  USING (true);

-- Valeurs initiales
INSERT INTO settings (key, value) VALUES
  ('lien_paiement', ''),
  ('paiement_actif', 'false');