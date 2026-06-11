-- 1. Ajouter la colonne avatar_url dans profiles si elle n'existe pas déjà
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN avatar_url text;
  END IF;
END $$;

-- 2. Insérer les clés de settings pour l'apparence (si elles n'existent pas)
INSERT INTO settings (key, value)
VALUES
  ('apparence_couleur_primaire',   '#2E7D32'),
  ('apparence_couleur_secondaire', '#64748B'),
  ('apparence_couleur_accent',     '#D84315'),
  ('apparence_police',             'Inter'),
  ('apparence_mode_sombre',        'false')
ON CONFLICT (key) DO NOTHING;

-- 3. Bucket avatars : politique RLS pour lecture publique et upload authentifié
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  1048576,
  ARRAY['image/jpeg','image/png','image/webp','image/gif','image/avif']
)
ON CONFLICT (id) DO NOTHING;

-- Politique lecture publique sur avatars
DROP POLICY IF EXISTS "avatars_public_read" ON storage.objects;
CREATE POLICY "avatars_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

-- Politique upload authentifié sur avatars
DROP POLICY IF EXISTS "avatars_authenticated_upload" ON storage.objects;
CREATE POLICY "avatars_authenticated_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'avatars');

-- Politique mise à jour authentifié sur avatars
DROP POLICY IF EXISTS "avatars_authenticated_update" ON storage.objects;
CREATE POLICY "avatars_authenticated_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'avatars');

-- Politique suppression authentifié sur avatars
DROP POLICY IF EXISTS "avatars_authenticated_delete" ON storage.objects;
CREATE POLICY "avatars_authenticated_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'avatars');