
-- Politique RLS : les propriétaires peuvent supprimer leurs propres messages reçus
CREATE POLICY "Owners can delete their messages"
  ON messages FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

-- Fonction RPC pour supprimer un utilisateur (nécessite SECURITY DEFINER)
CREATE OR REPLACE FUNCTION delete_user_account(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Seul un admin peut appeler cette fonction
  IF get_user_role(auth.uid()) != 'admin' THEN
    RAISE EXCEPTION 'Accès refusé : administrateur requis';
  END IF;

  -- Supprimer le profil
  DELETE FROM profiles WHERE id = target_user_id;

  -- Supprimer le compte auth
  DELETE FROM auth.users WHERE id = target_user_id;
END;
$$;
