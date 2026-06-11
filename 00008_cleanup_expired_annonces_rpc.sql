-- RPC : marquer expired les annonces type1 actives dépassées
-- et supprimer celles expirées depuis plus de 2 jours
CREATE OR REPLACE FUNCTION cleanup_expired_annonces()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_expired  int;
  v_deleted  int;
BEGIN
  -- 1. Passer active → expired si expires_at dépassé
  UPDATE annonces
  SET status = 'expired'
  WHERE type   = 'type1'
    AND status = 'active'
    AND expires_at < now();
  GET DIAGNOSTICS v_expired = ROW_COUNT;

  -- 2. Passer expired → deleted si expiré depuis > 2 jours (J9)
  UPDATE annonces
  SET status = 'deleted'
  WHERE type      = 'type1'
    AND status    = 'expired'
    AND expires_at < now() - INTERVAL '2 days';
  GET DIAGNOSTICS v_deleted = ROW_COUNT;

  RETURN jsonb_build_object('expired', v_expired, 'deleted', v_deleted);
END;
$$;

GRANT EXECUTE ON FUNCTION cleanup_expired_annonces() TO authenticated, anon;