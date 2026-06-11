-- Nouvelles colonnes dans annonces pour le système de clé d'activation
ALTER TABLE annonces
  ADD COLUMN cle_activation_saisie       text,
  ADD COLUMN cle_activation_tentative_at timestamptz,
  ADD COLUMN activation_automatique      boolean NOT NULL DEFAULT false;

-- Nouveaux paramètres dans settings
INSERT INTO settings (key, value) VALUES
  ('prix_publication', '0'),
  ('cle_activation',   '')
ON CONFLICT (key) DO NOTHING;