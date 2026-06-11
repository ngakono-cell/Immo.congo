-- Politiques RLS storage pour le bucket annonces-videos
CREATE POLICY "Lecture publique vidéos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'annonces-videos');

CREATE POLICY "Upload vidéo utilisateur authentifié"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'annonces-videos');

CREATE POLICY "Suppression vidéo par propriétaire"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'annonces-videos' AND auth.uid()::text = (storage.foldername(name))[1]);
