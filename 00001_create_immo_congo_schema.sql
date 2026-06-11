
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum types
CREATE TYPE public.user_role AS ENUM ('user', 'admin');
CREATE TYPE public.annonce_status AS ENUM ('active', 'pending', 'expired', 'deleted');
CREATE TYPE public.annonce_type AS ENUM ('type1', 'type2');
CREATE TYPE public.bien_type AS ENUM ('studio', 'maison', 'magasin', 'boutique', 'villa', 'appartement', 'hotel', 'espace_evenementiel');

-- Profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  phone text,
  full_name text,
  role public.user_role NOT NULL DEFAULT 'user',
  avatar_url text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Arrondissements table
CREATE TABLE public.arrondissements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom text NOT NULL,
  ville text NOT NULL CHECK (ville IN ('Brazzaville', 'Pointe-Noire')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Annonces table
CREATE TABLE public.annonces (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type public.annonce_type NOT NULL DEFAULT 'type1',
  bien_type public.bien_type NOT NULL,
  status public.annonce_status NOT NULL DEFAULT 'pending',
  titre text NOT NULL,
  description text NOT NULL,
  ville text NOT NULL CHECK (ville IN ('Brazzaville', 'Pointe-Noire')),
  arrondissement text NOT NULL,
  adresse text,
  prix_mensuel numeric(12, 0),
  prix_journalier numeric(12, 0),
  prix_horaire numeric(12, 0),
  caution_mois integer CHECK (caution_mois >= 0 AND caution_mois <= 3),
  nom_proprietaire text NOT NULL,
  telephone text NOT NULL,
  images text[] NOT NULL DEFAULT '{}',
  visit_count integer NOT NULL DEFAULT 0,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Messages table
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  annonce_id uuid REFERENCES public.annonces(id) ON DELETE SET NULL,
  sender_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  owner_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sender_name text NOT NULL,
  sender_phone text,
  content text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Publicites (advertisements) table
CREATE TABLE public.publicites (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  titre text NOT NULL,
  contenu text,
  image_url text,
  lien text,
  position text NOT NULL DEFAULT 'home_banner',
  is_active boolean NOT NULL DEFAULT true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Insert arrondissements for Brazzaville
INSERT INTO public.arrondissements (nom, ville) VALUES
  ('Makélékélé', 'Brazzaville'),
  ('Bacongo', 'Brazzaville'),
  ('Poto-Poto', 'Brazzaville'),
  ('Moungali', 'Brazzaville'),
  ('Ouenzé', 'Brazzaville'),
  ('Talangaï', 'Brazzaville'),
  ('Mfilou', 'Brazzaville'),
  ('Madibou', 'Brazzaville'),
  ('Djiri', 'Brazzaville');

-- Insert arrondissements for Pointe-Noire
INSERT INTO public.arrondissements (nom, ville) VALUES
  ('Lumumba', 'Pointe-Noire'),
  ('Loandjili', 'Pointe-Noire'),
  ('Tié-Tié', 'Pointe-Noire'),
  ('Ngoyo', 'Pointe-Noire'),
  ('Mongo-Mpoukou', 'Pointe-Noire');

-- Handle new user trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, phone, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.phone,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    'user'::public.user_role
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_annonces_updated_at BEFORE UPDATE ON public.annonces FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_publicites_updated_at BEFORE UPDATE ON public.publicites FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Visit count increment function
CREATE OR REPLACE FUNCTION increment_visit_count(annonce_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.annonces SET visit_count = visit_count + 1 WHERE id = annonce_id;
END;
$$;

-- RLS Enable
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arrondissements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.annonces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publicites ENABLE ROW LEVEL SECURITY;

-- Helper function for role
CREATE OR REPLACE FUNCTION get_user_role(uid uuid)
RETURNS public.user_role
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM profiles WHERE id = uid;
$$;

-- Profiles policies
CREATE POLICY "Admins have full access to profiles" ON public.profiles
  FOR ALL TO authenticated USING (get_user_role(auth.uid()) = 'admin'::public.user_role);

CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id)
  WITH CHECK (role IS NOT DISTINCT FROM get_user_role(auth.uid()));

-- Arrondissements policies (public read)
CREATE POLICY "Anyone can read arrondissements" ON public.arrondissements
  FOR SELECT TO anon, authenticated USING (true);

-- Annonces policies
CREATE POLICY "Anyone can view active annonces" ON public.annonces
  FOR SELECT TO anon, authenticated USING (status = 'active');

CREATE POLICY "Owners can view all their annonces" ON public.annonces
  FOR SELECT TO authenticated USING (auth.uid() = owner_id);

CREATE POLICY "Admins have full access to annonces" ON public.annonces
  FOR ALL TO authenticated USING (get_user_role(auth.uid()) = 'admin'::public.user_role);

CREATE POLICY "Owners can insert annonces" ON public.annonces
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their annonces" ON public.annonces
  FOR UPDATE TO authenticated USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their annonces" ON public.annonces
  FOR DELETE TO authenticated USING (auth.uid() = owner_id);

-- Messages policies
CREATE POLICY "Anyone can send a message" ON public.messages
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Owners can view messages about their annonces" ON public.messages
  FOR SELECT TO authenticated USING (auth.uid() = owner_id);

CREATE POLICY "Admins have full access to messages" ON public.messages
  FOR ALL TO authenticated USING (get_user_role(auth.uid()) = 'admin'::public.user_role);

-- Publicites policies
CREATE POLICY "Anyone can view active publicites" ON public.publicites
  FOR SELECT TO anon, authenticated USING (is_active = true);

CREATE POLICY "Admins have full access to publicites" ON public.publicites
  FOR ALL TO authenticated USING (get_user_role(auth.uid()) = 'admin'::public.user_role);

-- Public profiles view
CREATE VIEW public.public_profiles AS
  SELECT id, full_name, phone, role FROM public.profiles;

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.annonces;
