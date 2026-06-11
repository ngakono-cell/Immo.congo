-- Permettre aux utilisateurs anonymes d'appeler increment_visit_count
GRANT EXECUTE ON FUNCTION increment_visit_count(uuid) TO anon;
GRANT EXECUTE ON FUNCTION increment_visit_count(uuid) TO authenticated;