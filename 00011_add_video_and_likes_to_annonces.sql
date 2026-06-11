-- Ajouter les colonnes vidéo et likes aux annonces
ALTER TABLE public.annonces
  ADD COLUMN video_url text DEFAULT NULL,
  ADD COLUMN video_likes integer NOT NULL DEFAULT 0;

-- Créer la table des likes vidéo (un like par utilisateur par annonce)
CREATE TABLE public.video_likes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  annonce_id  uuid NOT NULL REFERENCES public.annonces(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (annonce_id, user_id)
);

-- RLS sur video_likes
ALTER TABLE public.video_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture publique des likes"
  ON public.video_likes FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Utilisateur connecté peut liker"
  ON public.video_likes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Utilisateur peut retirer son like"
  ON public.video_likes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insérer le prix abonnement type2 dans settings
INSERT INTO public.settings (key, value) VALUES ('prix_publication_type2', '5000');
