-- Enrichir visitor_logs avec session, device, referrer et timestamp précis
ALTER TABLE visitor_logs
  ADD COLUMN IF NOT EXISTS session_id  text        NULL,
  ADD COLUMN IF NOT EXISTS device_type text        NULL,
  ADD COLUMN IF NOT EXISTS referrer    text        NULL,
  ADD COLUMN IF NOT EXISTS created_at  timestamptz NOT NULL DEFAULT now();

-- Index pour les requêtes admin (par date, par page, par session)
CREATE INDEX IF NOT EXISTS idx_visitor_logs_created_at   ON visitor_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_session_id   ON visitor_logs (session_id);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_page         ON visitor_logs (page);

-- RLS : tout le monde peut insérer, seul l'admin peut lire
ALTER TABLE visitor_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_public_insert_visitor" ON visitor_logs
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "allow_admin_select_visitor" ON visitor_logs
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
