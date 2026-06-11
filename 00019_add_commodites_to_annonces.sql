
ALTER TABLE annonces
  ADD COLUMN commodites text[] NOT NULL DEFAULT '{}';
