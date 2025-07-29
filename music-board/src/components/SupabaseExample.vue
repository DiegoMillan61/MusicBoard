<template>
  <div class="supabase-example">
    <h2>Ejemplo de integración con Supabase</h2>
    
    <!-- Estado de autenticación -->
    <div class="auth-section">
      <h3>Autenticación</h3>
      <div v-if="!isAuthenticated" class="login-form">
        <p>No has iniciado sesión</p>
        <div class="form-group">
          <input v-model="email" type="email" placeholder="Email" />
          <input v-model="password" type="password" placeholder="Password" />
          <button @click="handleSignIn" :disabled="loading">Iniciar Sesión</button>
          <button @click="handleSignUp" :disabled="loading">Registrarse</button>
        </div>
      </div>
      <div v-else class="user-info">
        <p>Bienvenido: {{ user.email }}</p>
        <button @click="handleSignOut" :disabled="loading">Cerrar Sesión</button>
      </div>
    </div>

    <!-- Mensaje de error -->
    <div v-if="error" class="error">
      Error: {{ error }}
    </div>

    <!-- Loading indicator -->
    <div v-if="loading" class="loading">
      Cargando...
    </div>

    <!-- Sección de setlists (solo para usuarios autenticados) -->
    <div v-if="isAuthenticated" class="setlists-section">
      <h3>Mis Setlists</h3>
      
      <!-- Formulario para crear nuevo setlist -->
      <div class="create-form">
        <h4>Crear nuevo setlist</h4>
        <div class="form-group">
          <input v-model="newSetlist.name" placeholder="Nombre del setlist" />
          <input v-model="newSetlist.venue" placeholder="Venue" />
          <input v-model="newSetlist.date" type="date" />
          <button @click="handleCreateSetlist" :disabled="loading">Crear Setlist</button>
        </div>
      </div>

      <!-- Lista de setlists -->
      <div class="setlists-list">
        <div v-if="setlists.length === 0" class="empty-state">
          No tienes setlists todavía. ¡Crea uno!
        </div>
        <div v-for="setlist in setlists" :key="setlist.id" class="setlist-item">
          <h4>{{ setlist.name }}</h4>
          <p><strong>Venue:</strong> {{ setlist.venue }}</p>
          <p><strong>Fecha:</strong> {{ formatDate(setlist.date) }}</p>
          <button @click="handleDeleteSetlist(setlist.id)" :disabled="loading">Eliminar</button>
        </div>
      </div>
    </div>

    <!-- Sección de canciones (siempre visible) -->
    <div class="songs-section">
      <h3>Canciones disponibles</h3>
      <button @click="loadSongs" :disabled="loading">Cargar Canciones</button>
      
      <!-- Formulario para crear nueva canción (solo usuarios autenticados) -->
      <div v-if="isAuthenticated" class="create-form">
        <h4>Agregar nueva canción</h4>
        <div class="form-group">
          <input v-model="newSong.title" placeholder="Título" />
          <input v-model="newSong.artist" placeholder="Artista" />
          <input v-model="newSong.duration" placeholder="Duración (mm:ss)" />
          <input v-model="newSong.key" placeholder="Tonalidad" />
          <button @click="handleCreateSong" :disabled="loading">Agregar Canción</button>
        </div>
      </div>

      <!-- Lista de canciones -->
      <div class="songs-list">
        <div v-if="songs.length === 0" class="empty-state">
          No hay canciones cargadas.
        </div>
        <div v-for="song in songs" :key="song.id" class="song-item">
          <strong>{{ song.title }}</strong> - {{ song.artist }}
          <span v-if="song.duration">({{ song.duration }})</span>
          <span v-if="song.key" class="key">{{ song.key }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSupabase } from '../composables/useSupabase.js'
import { useMusicBoard } from '../composables/useMusicBoard.js'

// Composables
const { user, isAuthenticated, signIn, signUp, signOut, loading, error } = useSupabase()
const { 
  setlists, 
  songs, 
  fetchSetlists, 
  createSetlist, 
  deleteSetlist,
  fetchSongs,
  createSong
} = useMusicBoard()

// Formularios reactivos
const email = ref('')
const password = ref('')
const newSetlist = ref({ name: '', venue: '', date: '' })
const newSong = ref({ title: '', artist: '', duration: '', key: '' })

// Métodos de autenticación
const handleSignIn = async () => {
  try {
    await signIn(email.value, password.value)
    await loadUserData()
  } catch (err) {
    console.error('Error signing in:', err)
  }
}

const handleSignUp = async () => {
  try {
    await signUp(email.value, password.value)
    console.log('Check your email for verification link')
  } catch (err) {
    console.error('Error signing up:', err)
  }
}

const handleSignOut = async () => {
  await signOut()
  setlists.value = []
}

// Métodos de setlists
const handleCreateSetlist = async () => {
  if (!newSetlist.value.name) return
  
  try {
    await createSetlist({
      ...newSetlist.value,
      user_id: user.value.id
    })
    newSetlist.value = { name: '', venue: '', date: '' }
  } catch (err) {
    console.error('Error creating setlist:', err)
  }
}

const handleDeleteSetlist = async (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar este setlist?')) {
    try {
      await deleteSetlist(id)
    } catch (err) {
      console.error('Error deleting setlist:', err)
    }
  }
}

// Métodos de canciones
const loadSongs = async () => {
  try {
    await fetchSongs()
  } catch (err) {
    console.error('Error loading songs:', err)
  }
}

const handleCreateSong = async () => {
  if (!newSong.value.title || !newSong.value.artist) return
  
  try {
    await createSong(newSong.value)
    newSong.value = { title: '', artist: '', duration: '', key: '' }
  } catch (err) {
    console.error('Error creating song:', err)
  }
}

// Utilidades
const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}

const loadUserData = async () => {
  if (isAuthenticated.value) {
    await fetchSetlists()
  }
}

// Inicialización
onMounted(() => {
  loadUserData()
  loadSongs()
})
</script>

<style scoped>
.supabase-example {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.auth-section, .setlists-section, .songs-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.form-group {
  display: flex;
  gap: 10px;
  margin: 10px 0;
  flex-wrap: wrap;
}

.form-group input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-width: 150px;
}

.form-group button {
  padding: 8px 16px;
  background-color: #007cba;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.form-group button:hover {
  background-color: #005a87;
}

.form-group button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error {
  background-color: #ffebee;
  color: #c62828;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

.setlist-item, .song-item {
  background-color: #f9f9f9;
  padding: 15px;
  margin: 10px 0;
  border-radius: 4px;
  border: 1px solid #eee;
}

.setlist-item h4 {
  margin: 0 0 10px 0;
  color: #333;
}

.setlist-item p {
  margin: 5px 0;
  color: #666;
}

.song-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.key {
  background-color: #007cba;
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.8em;
}

.empty-state {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.create-form {
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  margin: 15px 0;
}

.create-form h4 {
  margin-top: 0;
}
</style> 