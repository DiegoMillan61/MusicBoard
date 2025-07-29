-- SQL para crear 3 setlists de ejemplo
-- Ejecuta este script en tu panel de Supabase SQL Editor

-- Primero, vamos a insertar los setlists
INSERT INTO setlists (name, venue, date, description) VALUES 
('Rock Night 2024', 'The Blue Note', '2024-02-15', 'Una noche llena de rock clásico y moderno'),
('Jazz Evening', 'Jazz Corner Café', '2024-02-20', 'Selección de jazz standards y contemporáneo'),
('Acoustic Unplugged', 'Coffee House Central', '2024-02-25', 'Set acústico íntimo con canciones suaves');

-- Ahora vamos a obtener los IDs de los setlists que acabamos de crear
-- y asociarles canciones usando la tabla setlist_songs

-- Para el setlist "Rock Night 2024"
INSERT INTO setlist_songs (setlist_id, song_id, position)
SELECT 
  s.id as setlist_id,
  songs.id as song_id,
  row_number() OVER () as position
FROM setlists s
CROSS JOIN (
  SELECT id FROM songs WHERE title IN ('Sweet Child O Mine', 'Hotel California', 'Bohemian Rhapsody')
) songs
WHERE s.name = 'Rock Night 2024';

-- Para el setlist "Jazz Evening"
INSERT INTO setlist_songs (setlist_id, song_id, position)
SELECT 
  s.id as setlist_id,
  songs.id as song_id,
  row_number() OVER () as position
FROM setlists s
CROSS JOIN (
  SELECT id FROM songs WHERE title IN ('Take Five', 'Autumn Leaves', 'Blue Moon')
) songs
WHERE s.name = 'Jazz Evening';

-- Para el setlist "Acoustic Unplugged"
INSERT INTO setlist_songs (setlist_id, song_id, position)
SELECT 
  s.id as setlist_id,
  songs.id as song_id,
  row_number() OVER () as position
FROM setlists s
CROSS JOIN (
  SELECT id FROM songs WHERE title IN ('Blackbird', 'Mad World', 'Hurt')
) songs
WHERE s.name = 'Acoustic Unplugged';

-- Verificar que todo se haya insertado correctamente
SELECT 
  sl.name as setlist_name,
  sl.venue,
  sl.date,
  s.title as song_title,
  s.artist,
  ss.position
FROM setlists sl
LEFT JOIN setlist_songs ss ON sl.id = ss.setlist_id
LEFT JOIN songs s ON ss.song_id = s.id
ORDER BY sl.name, ss.position; 