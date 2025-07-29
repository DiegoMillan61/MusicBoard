<template>
  <div class="setlist-view">
    <!-- Debug Info -->
    <div class="debug-info" style="background: #f0f0f0; padding: 10px; margin-bottom: 20px; font-size: 12px;">
      <strong>Debug Info:</strong><br>
      Props setlists length: {{ setlists?.length || 0 }}<br>
      Store setlists length: {{ store.setlists?.length || 0 }}<br>
      Store hasSetlists: {{ store.hasSetlists }}<br>
      Store loading: {{ store.loading }}<br>
      Store error: {{ store.error }}<br>
      Condition (setlists && setlists.length > 0): {{ setlists && setlists.length > 0 }}
    </div>

    <!-- Estado cuando hay setlists -->
    <div v-if="setlists && setlists.length > 0" class="setlists-container">
      <div class="setlists-grid">
        <div 
          v-for="setlist in setlists" 
          :key="setlist.id" 
          class="setlist-card"
          @click="$emit('open-setlist', setlist)"
        >
          <div class="setlist-header">
            <h3>{{ setlist.name }}</h3>
            <span class="song-count">{{ getSetlistSongsCount(setlist) }} songs</span>
          </div>
          
          <div class="setlist-meta">
            <div class="meta-item" v-if="setlist.venue">
              <span class="meta-label">Venue:</span>
              <span class="meta-value">{{ setlist.venue }}</span>
            </div>
            
            <div class="meta-item" v-if="setlist.date">
              <span class="meta-label">Date:</span>
              <span class="meta-value">{{ formatDate(setlist.date) }}</span>
            </div>
          </div>

          <div class="setlist-preview" v-if="getSetlistSongsCount(setlist) > 0">
            <h4>Songs Preview:</h4>
            <ul class="songs-preview">
              <li 
                v-for="(song, index) in getSetlistSongs(setlist).slice(0, 3)" 
                :key="song.id"
              >
                {{ index + 1 }}. {{ song.title }}
                <span v-if="song.artist" class="artist">by {{ song.artist }}</span>
              </li>
              <li v-if="getSetlistSongsCount(setlist) > 3" class="more-songs">
                +{{ getSetlistSongsCount(setlist) - 3 }} more songs...
              </li>
            </ul>
          </div>

          <div class="setlist-actions">
            <button class="view-btn" @click.stop="$emit('open-setlist', setlist)">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Estado vacío -->
    <div v-else class="empty-state">
      <div class="empty-icon">🎵</div>
      <h3>No Setlists Found</h3>
      <p>No hay setlists disponibles en este momento.</p>
      <p class="hint">Ve a tu panel de Supabase y ejecuta las consultas SQL para insertar datos de ejemplo.</p>
      <button @click="$emit('reload-data')" class="reload-btn">
        🔄 Recargar Datos
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, watch, onMounted } from 'vue'
import { useMusicBoardStore } from '../stores/musicBoard.js'

const props = defineProps({
  setlists: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['open-setlist', 'reload-data'])

// Usar el store para acceder a las funciones auxiliares
const store = useMusicBoardStore()
const { getSetlistSongs } = store

// Debug - ver qué datos estamos recibiendo
onMounted(() => {
  console.log('🔍 SetlistView mounted with setlists:', props.setlists)
  console.log('🔍 Setlists length:', props.setlists?.length)
  console.log('🔍 Store setlists:', store.setlists)
})

watch(() => props.setlists, (newSetlists) => {
  console.log('🔍 SetlistView setlists changed:', newSetlists)
  console.log('🔍 New setlists length:', newSetlists?.length)
}, { deep: true })

const getSetlistSongsCount = (setlist) => {
  return getSetlistSongs(setlist).length
}

const formatDate = (dateString) => {
  if (!dateString) return 'No date'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  })
}
</script>

<style scoped>
.setlist-view {
  width: 100%;
  padding: 20px;
}

.setlists-container {
  width: 100%;
}

.setlists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.setlist-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #e0e0e0;
}

.setlist-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  border-color: #007cba;
}

.setlist-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.setlist-header h3 {
  margin: 0;
  color: #172b4d;
  font-size: 18px;
  font-weight: 600;
  flex: 1;
  margin-right: 10px;
}

.song-count {
  background: #007cba;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.setlist-meta {
  margin-bottom: 15px;
}

.meta-item {
  display: flex;
  margin-bottom: 5px;
}

.meta-label {
  font-weight: 500;
  color: #5e6c84;
  margin-right: 8px;
  min-width: 50px;
}

.meta-value {
  color: #172b4d;
}

.setlist-preview {
  margin-bottom: 15px;
}

.setlist-preview h4 {
  margin: 0 0 8px 0;
  font-size: 14px;
  color: #5e6c84;
  font-weight: 500;
}

.songs-preview {
  list-style: none;
  padding: 0;
  margin: 0;
}

.songs-preview li {
  padding: 3px 0;
  font-size: 13px;
  color: #172b4d;
  display: flex;
  align-items: center;
}

.artist {
  margin-left: 8px;
  color: #5e6c84;
  font-style: italic;
  font-size: 12px;
}

.more-songs {
  color: #007cba;
  font-weight: 500;
  font-style: italic;
}

.setlist-actions {
  display: flex;
  justify-content: flex-end;
}

.view-btn {
  background: #007cba;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.view-btn:hover {
  background: #005a87;
}

/* Estado vacío */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 2px dashed #dee2e6;
  max-width: 500px;
  margin: 40px auto;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h3 {
  margin: 0 0 10px 0;
  color: #172b4d;
  font-size: 24px;
}

.empty-state p {
  margin: 8px 0;
  color: #5e6c84;
  line-height: 1.4;
}

.hint {
  font-style: italic;
  font-size: 14px;
}

.reload-btn {
  margin-top: 20px;
  padding: 12px 24px;
  background: #007cba;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.reload-btn:hover {
  background: #005a87;
}

/* Responsive */
@media (max-width: 768px) {
  .setlists-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .setlist-view {
    padding: 16px;
  }
  
  .setlist-card {
    padding: 16px;
  }
}
</style> 