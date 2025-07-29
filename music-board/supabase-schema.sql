-- Esquema de base de datos para Music Board
-- Ejecuta este script en tu panel de Supabase SQL Editor

-- Tabla de canciones
CREATE TABLE IF NOT EXISTS songs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL,
  duration VARCHAR(10), -- formato "mm:ss"
  key VARCHAR(10), -- tonalidad musical (C, D, Em, etc.)
  bpm INTEGER, -- beats por minuto
  genre VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de setlists
CREATE TABLE IF NOT EXISTS setlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  venue VARCHAR(255),
  date DATE,
  description TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de relación entre setlists y canciones (many-to-many)
CREATE TABLE IF NOT EXISTS setlist_songs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setlist_id UUID REFERENCES setlists(id) ON DELETE CASCADE,
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  position INTEGER, -- orden de la canción en el setlist
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(setlist_id, song_id)
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_songs_title ON songs(title);
CREATE INDEX IF NOT EXISTS idx_songs_artist ON songs(artist);
CREATE INDEX IF NOT EXISTS idx_setlists_user_id ON setlists(user_id);
CREATE INDEX IF NOT EXISTS idx_setlists_date ON setlists(date);
CREATE INDEX IF NOT EXISTS idx_setlist_songs_setlist_id ON setlist_songs(setlist_id);
CREATE INDEX IF NOT EXISTS idx_setlist_songs_position ON setlist_songs(setlist_id, position);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_songs_updated_at BEFORE UPDATE ON songs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_setlists_updated_at BEFORE UPDATE ON setlists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Políticas de seguridad (Row Level Security - RLS)
-- Habilitar RLS en todas las tablas
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE setlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE setlist_songs ENABLE ROW LEVEL SECURITY;

-- Políticas para la tabla songs (acceso público para lectura, usuarios autenticados para escribir)
CREATE POLICY "Anyone can view songs" ON songs FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert songs" ON songs FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update songs" ON songs FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete songs" ON songs FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para la tabla setlists (solo el usuario propietario puede ver/modificar sus setlists)
CREATE POLICY "Users can view own setlists" ON setlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own setlists" ON setlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own setlists" ON setlists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own setlists" ON setlists FOR DELETE USING (auth.uid() = user_id);

-- Políticas para la tabla setlist_songs (basadas en la propiedad del setlist)
CREATE POLICY "Users can view setlist_songs of own setlists" ON setlist_songs FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM setlists WHERE setlists.id = setlist_songs.setlist_id AND setlists.user_id = auth.uid()
));

CREATE POLICY "Users can insert setlist_songs to own setlists" ON setlist_songs FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM setlists WHERE setlists.id = setlist_songs.setlist_id AND setlists.user_id = auth.uid()
));

CREATE POLICY "Users can update setlist_songs of own setlists" ON setlist_songs FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM setlists WHERE setlists.id = setlist_songs.setlist_id AND setlists.user_id = auth.uid()
));

CREATE POLICY "Users can delete setlist_songs from own setlists" ON setlist_songs FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM setlists WHERE setlists.id = setlist_songs.setlist_id AND setlists.user_id = auth.uid()
));

-- Insertar algunos datos de ejemplo
INSERT INTO songs (title, artist, duration, key) VALUES 
('Sweet Child O Mine', 'Guns N Roses', '5:03', 'D'),
('Hotel California', 'Eagles', '6:30', 'Bm'),
('Bohemian Rhapsody', 'Queen', '5:55', 'Bb'),
('Take Five', 'Dave Brubeck', '5:24', 'Eb'),
('Autumn Leaves', 'Standard', '4:15', 'Gm'),
('Blue Moon', 'Standard', '3:45', 'C'),
('Blackbird', 'The Beatles', '2:18', 'G'),
('Mad World', 'Tears for Fears', '3:07', 'Em'),
('Hurt', 'Johnny Cash', '3:38', 'Am'); 