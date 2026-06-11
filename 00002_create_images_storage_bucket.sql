
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'annonces-images',
  'annonces-images',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif']
);

CREATE POLICY "Anyone can read annonces images" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'annonces-images');

CREATE POLICY "Authenticated can upload annonces images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'annonces-images');

CREATE POLICY "Owners can delete their annonces images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'annonces-images' AND auth.uid()::text = (storage.foldername(name))[1]);

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'publicites-images',
  'publicites-images',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif']
);

CREATE POLICY "Anyone can read publicites images" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'publicites-images');

CREATE POLICY "Admins can upload publicites images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'publicites-images');
