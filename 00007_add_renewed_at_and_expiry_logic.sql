-- Colonne pour la date de renouvellement
ALTER TABLE annonces ADD COLUMN renewed_at timestamptz;

-- Recalculer expires_at des annonces type1 actives/pending à 7 jours depuis created_at
UPDATE annonces
SET expires_at = created_at + INTERVAL '7 days'
WHERE type = 'type1'
  AND status IN ('active', 'pending')
  AND expires_at > now() + INTERVAL '20 days';

-- Fonction RPC pour renouveler une annonce (réinitialise expires_at et renewed_at)
CREATE OR REPLACE FUNCTION renew_annonce(p_annonce_id uuid, p_owner_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE annonces
  SET
    status     = 'pending',
    expires_at = now() + INTERVAL '7 days',
    renewed_at = now(),
    cle_activation_saisie      = NULL,
    cle_activation_tentative_at = NULL,
    activation_automatique     = false
  WHERE id       = p_annonce_id
    AND owner_id = p_owner_id
    AND type     = 'type1';
$$;

GRANT EXECUTE ON FUNCTION renew_annonce(uuid, uuid) TO authenticated;