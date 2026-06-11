
-- Table pour stocker les tokens push des appareils mobiles
CREATE TABLE push_tokens (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token text NOT NULL,
  platform text NOT NULL DEFAULT 'unknown' CHECK (platform IN ('android', 'ios', 'web', 'unknown')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id, token)
);

ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;

-- Politique : un utilisateur ne voit et modifie que ses propres tokens
CREATE POLICY "push_tokens_self_select" ON push_tokens
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "push_tokens_self_insert" ON push_tokens
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "push_tokens_self_delete" ON push_tokens
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
