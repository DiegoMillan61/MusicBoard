-- SQL para permitir acceso público a todas las tablas
-- Ejecuta este script en tu panel de Supabase SQL Editor

-- ELIMINAR todas las políticas existentes
DROP POLICY IF EXISTS "Anyone can view songs" ON songs;
DROP POLICY IF EXISTS "Authenticated users can insert songs" ON songs;
DROP POLICY IF EXISTS "Authenticated users can update songs" ON songs;
DROP POLICY IF EXISTS "Authenticated users can delete songs" ON songs;

DROP POLICY IF EXISTS "Users can view own setlists" ON setlists;
DROP POLICY IF EXISTS "Users can insert own setlists" ON setlists;
DROP POLICY IF EXISTS "Users can update own setlists" ON setlists;
DROP POLICY IF EXISTS "Users can delete own setlists" ON setlists;

DROP POLICY IF EXISTS "Users can view setlist_songs of own setlists" ON setlist_songs;
DROP POLICY IF EXISTS "Users can insert setlist_songs to own setlists" ON setlist_songs;
DROP POLICY IF EXISTS "Users can update setlist_songs of own setlists" ON setlist_songs;
DROP POLICY IF EXISTS "Users can delete setlist_songs from own setlists" ON setlist_songs;

-- CREAR nuevas políticas que permitan acceso público
-- Políticas para songs (acceso público total)
CREATE POLICY "Public access songs" ON songs FOR ALL USING (true);

-- Políticas para setlists (acceso público total)
CREATE POLICY "Public access setlists" ON setlists FOR ALL USING (true);

-- Políticas para setlist_songs (acceso público total)
CREATE POLICY "Public access setlist_songs" ON setlist_songs FOR ALL USING (true);

-- Verificar que los setlists se pueden leer ahora
SELECT 
  sl.id,
  sl.name as setlist_name,
  sl.venue,
  sl.date,
  sl.description,
  COUNT(ss.song_id) as total_songs
FROM setlists sl
LEFT JOIN setlist_songs ss ON sl.id = ss.setlist_id
GROUP BY sl.id, sl.name, sl.venue, sl.date, sl.description
ORDER BY sl.created_at DESC; 