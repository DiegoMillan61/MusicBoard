<script setup>
import Board from './components/Board.vue'
import Column from './components/Column.vue'
import SetList from './components/SetList.vue'
import SetlistView from './components/SetlistView.vue'
import SongCard from './components/SongCard.vue'
import DebugSupabase from './components/DebugSupabase.vue'
import { ref, onMounted } from 'vue'
import { useMusicBoardStore } from './stores/musicBoard.js'

// Usar el store Pinia
const store = useMusicBoardStore()
const { setlists, songs, loading, error, hasSetlists, loadAllData, getSetlistSongs } = store

const boardData = ref({
  id: 'board-1',
  name: 'Music Board - Set Lists (Supabase)'
})

const selectedSetlist = ref(null)
const showModal = ref(false)

const openSetlist = (setlist) => {
  selectedSetlist.value = setlist
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedSetlist.value = null
}

const formatDate = (dateString) => {
  if (!dateString) return 'No date'
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

onMounted(() => {
  console.log('🚀 App mounted, loading data...')
  loadAllData()
})
</script>

<template>
  <header>
    <h1>{{ boardData.name }}</h1>
  </header>

  <main>
    <!-- Estado de carga -->
    <div v-if="loading" class="loading-state">
      <p>Cargando datos de Supabase...</p>
    </div>

    <!-- Estado de error -->
    <div v-if="error" class="error-state">
      <p>Error: {{ error }}</p>
      <button @click="loadAllData">Reintentar</button>
    </div>

    <!-- Contenido principal -->
    <div v-if="!loading && !error">
      <SetlistView 
        :setlists="setlists"
        @open-setlist="openSetlist"
        @reload-data="loadAllData"
      />
    </div>

    <!-- Modal for setlist details -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>{{ selectedSetlist?.name }}</h2>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        <div class="modal-content">
          <div class="setlist-info">
            <p><strong>Venue:</strong> {{ selectedSetlist?.venue || 'No venue' }}</p>
            <p><strong>Date:</strong> {{ formatDate(selectedSetlist?.date) }}</p>
            <p><strong>Total Songs:</strong> {{ getSetlistSongs(selectedSetlist)?.length || 0 }}</p>
          </div>
          <div class="songs-list">
            <h3>Songs</h3>
            <div v-if="getSetlistSongs(selectedSetlist).length === 0" class="no-songs">
              <p>No hay canciones en este setlist.</p>
            </div>
            <SongCard v-for="song in getSetlistSongs(selectedSetlist)" :key="song.id" :song="song"></SongCard>
          </div>
        </div>
      </div>
    </div>

    <!-- Panel de debug -->
    <DebugSupabase />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

h1 {
  padding: 10px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #ddd;
}

.modal-header h2 {
  margin: 0;
  color: #172b4d;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #5e6c84;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #172b4d;
}

.modal-content {
  padding: 20px;
}

.setlist-info {
  margin-bottom: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 6px;
}

.setlist-info p {
  margin: 5px 0;
  color: #172b4d;
}

.songs-list h3 {
  margin-bottom: 15px;
  color: #172b4d;
}

/* Estilos para estados de carga y error */
.loading-state, .error-state {
  text-align: center;
  padding: 40px 20px;
  margin: 20px;
}

.loading-state {
  background-color: #f0f8ff;
  border: 1px solid #007cba;
  border-radius: 8px;
  color: #007cba;
}

.error-state {
  background-color: #ffebee;
  border: 1px solid #f44336;
  border-radius: 8px;
  color: #c62828;
}

.error-state button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.error-state button:hover {
  background-color: #d32f2f;
}

.no-songs {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 20px;
}
</style>
