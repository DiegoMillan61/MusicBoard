<script setup>
import Board from './components/Board.vue'
import Column from './components/Column.vue'
import SetList from './components/SetList.vue'
import SongCard from './components/SongCard.vue'
import { ref } from 'vue'

const boardData = ref({
  id: 'board-1',
  name: 'Music Board - Set Lists',
  columns: [
    {
      id: 'column-1',
      title: 'Set Lists',
      setlists: [
        { 
          id: 'setlist-1', 
          name: 'Rock Night', 
          venue: 'The Blue Note',
          date: '2024-01-15',
          songs: [
            { id: 'song-1', title: 'Sweet Child O Mine', artist: 'Guns N Roses', duration: '5:03', key: 'D' },
            { id: 'song-2', title: 'Hotel California', artist: 'Eagles', duration: '6:30', key: 'Bm' },
            { id: 'song-3', title: 'Bohemian Rhapsody', artist: 'Queen', duration: '5:55', key: 'Bb' }
          ]
        },
        { 
          id: 'setlist-2', 
          name: 'Jazz Evening', 
          venue: 'Jazz Corner',
          date: '2024-01-20',
          songs: [
            { id: 'song-4', title: 'Take Five', artist: 'Dave Brubeck', duration: '5:24', key: 'Eb' },
            { id: 'song-5', title: 'Autumn Leaves', artist: 'Standard', duration: '4:15', key: 'Gm' },
            { id: 'song-6', title: 'Blue Moon', artist: 'Standard', duration: '3:45', key: 'C' }
          ]
        },
        { 
          id: 'setlist-3', 
          name: 'Acoustic Set', 
          venue: 'Coffee House',
          date: '2024-01-25',
          songs: [
            { id: 'song-7', title: 'Blackbird', artist: 'The Beatles', duration: '2:18', key: 'G' },
            { id: 'song-8', title: 'Mad World', artist: 'Tears for Fears', duration: '3:07', key: 'Em' },
            { id: 'song-9', title: 'Hurt', artist: 'Johnny Cash', duration: '3:38', key: 'Am' }
          ]
        }
      ]
    }
  ]
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
  const date = new Date(dateString);
  return date.toLocaleDateString();
};
</script>

<template>
  <header>
    <h1>{{ boardData.name }}</h1>
  </header>

  <main>
    <Board>
      <Column v-for="column in boardData.columns" :key="column.id" :title="column.title">
        <SetList v-for="setlist in column.setlists" :key="setlist.id" :setlist="setlist" @open="openSetlist(setlist)"></SetList>
      </Column>
    </Board>

    <!-- Modal for setlist details -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>{{ selectedSetlist?.name }}</h2>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>
        <div class="modal-content">
          <div class="setlist-info">
            <p><strong>Venue:</strong> {{ selectedSetlist?.venue }}</p>
            <p><strong>Date:</strong> {{ formatDate(selectedSetlist?.date) }}</p>
            <p><strong>Total Songs:</strong> {{ selectedSetlist?.songs?.length }}</p>
          </div>
          <div class="songs-list">
            <h3>Songs</h3>
            <SongCard v-for="song in selectedSetlist?.songs" :key="song.id" :song="song"></SongCard>
          </div>
        </div>
      </div>
    </div>
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
</style>
