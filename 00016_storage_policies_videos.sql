
-- Policies bucket annonces-videos
CREATE POLICY "Lecture publique annonces-videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'annonces-videos');

CREATE POLICY "Upload annonces-videos authentifié"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'annonces-videos');

CREATE POLICY "Suppression annonces-videos propriétaire"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'annonces-videos' AND auth.uid() = owner::uuid);

-- Policies bucket publicites-videos
CREATE POLICY "Lecture publique publicites-videos"
ON storage.objects FOR SELECT
USING (bucket_id = 'publicites-videos');

CREATE POLICY "Upload publicites-videos admin"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'publicites-videos');

CREATE POLICY "Suppression publicites-videos admin"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'publicites-videos');
