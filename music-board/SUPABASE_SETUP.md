# Configuración de Supabase para Music Board

## Pasos de configuración

### 1. Crear archivo de variables de entorno

Crea un archivo `.env` en la raíz del proyecto `music-board/` con el siguiente contenido:

```env
VITE_SUPABASE_URL=https://alyvqomqgodggsukflcl.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFseXZxb21xZ29kZ2dzdWtmbGNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3NDQwNDEsImV4cCI6MjA2OTMyMDA0MX0.2y4Hn81vyBdrgHp9kjFMJ2qpC4g6_oosr8zTz5Ikxe8
```

### 2. Configurar la base de datos

Ve a tu panel de Supabase (https://alyvqomqgodggsukflcl.supabase.co) y ejecuta el script SQL que se encuentra en `supabase-schema.sql` en el SQL Editor.

Este script creará:
- Tabla `songs` para almacenar las canciones
- Tabla `setlists` para almacenar los setlists
- Tabla `setlist_songs` para la relación many-to-many entre setlists y canciones
- Políticas de seguridad (RLS) para proteger los datos
- Datos de ejemplo

### 3. Estructura de archivos creados

```
src/
├── lib/
│   └── supabase.js          # Cliente de Supabase
├── composables/
│   ├── useSupabase.js       # Composable principal de Supabase
│   └── useMusicBoard.js     # Composable específico para Music Board
└── main.js                  # Inicialización actualizada
```

## Cómo usar

### Ejemplo básico en un componente

```vue
<script setup>
import { onMounted } from 'vue'
import { useMusicBoard } from '@/composables/useMusicBoard.js'
import { useSupabase } from '@/composables/useSupabase.js'

const { setlists, songs, fetchSetlists, createSetlist } = useMusicBoard()
const { user, isAuthenticated, signIn } = useSupabase()

onMounted(async () => {
  if (isAuthenticated.value) {
    await fetchSetlists()
  }
})

const handleCreateSetlist = async () => {
  await createSetlist({
    name: 'Nuevo Setlist',
    venue: 'Venue Name',
    date: '2024-01-01'
  })
}
</script>
```

### Funcionalidades disponibles

#### Autenticación
- `signIn(email, password)` - Iniciar sesión
- `signUp(email, password)` - Registrarse
- `signOut()` - Cerrar sesión
- `user` - Usuario actual
- `isAuthenticated` - Estado de autenticación

#### Setlists
- `fetchSetlists()` - Obtener todos los setlists
- `createSetlist(data)` - Crear nuevo setlist
- `updateSetlist(id, data)` - Actualizar setlist
- `deleteSetlist(id)` - Eliminar setlist

#### Canciones
- `fetchSongs()` - Obtener todas las canciones
- `createSong(data)` - Crear nueva canción
- `updateSong(id, data)` - Actualizar canción
- `deleteSong(id)` - Eliminar canción

#### Relaciones
- `addSongToSetlist(setlistId, songId)` - Agregar canción a setlist
- `removeSongFromSetlist(setlistId, songId)` - Remover canción de setlist

## Notas importantes

1. **Variables de entorno**: Asegúrate de que el archivo `.env` esté en el `.gitignore` para no exponer credenciales.

2. **Autenticación**: Los setlists están protegidos por RLS (Row Level Security). Solo los usuarios autenticados pueden crear/ver sus propios setlists.

3. **Canciones públicas**: Las canciones son visibles para todos, pero solo los usuarios autenticados pueden crear/editar/eliminar.

4. **Desarrollo**: Durante el desarrollo, puedes usar el usuario anónimo para probar, pero para producción necesitarás implementar autenticación completa. 