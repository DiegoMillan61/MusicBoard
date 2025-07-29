<template>
  <div class="debug-panel">
    <h3>🔍 Debug Supabase Data</h3>
    
    <div class="debug-section">
      <h4>Estado de la aplicación:</h4>
      <ul>
        <li><strong>Loading:</strong> {{ loading }}</li>
        <li><strong>Error:</strong> {{ error || 'None' }}</li>
        <li><strong>Setlists count:</strong> {{ setlists.length }}</li>
        <li><strong>Songs count:</strong> {{ songs.length }}</li>
      </ul>
    </div>

    <div class="debug-section">
      <h4>Setlists raw data:</h4>
      <button @click="toggleSetlistsDebug" class="toggle-btn">
        {{ showSetlistsDebug ? 'Hide' : 'Show' }} Raw Setlists
      </button>
      <pre v-if="showSetlistsDebug" class="debug-json">{{ JSON.stringify(setlists, null, 2) }}</pre>
    </div>

    <div class="debug-section">
      <h4>Songs raw data:</h4>
      <button @click="toggleSongsDebug" class="toggle-btn">
        {{ showSongsDebug ? 'Hide' : 'Show' }} Raw Songs
      </button>
      <pre v-if="showSongsDebug" class="debug-json">{{ JSON.stringify(songs, null, 2) }}</pre>
    </div>

    <div class="debug-section">
      <h4>Actions:</h4>
      <button @click="reloadData" :disabled="loading" class="action-btn">
        🔄 Reload All Data
      </button>
      <button @click="testConnection" :disabled="loading" class="action-btn">
        🌐 Test Supabase Connection
      </button>
    </div>

    <div v-if="connectionTest" class="debug-section">
      <h4>Connection Test Result:</h4>
      <pre class="debug-json">{{ JSON.stringify(connectionTest, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMusicBoard } from '../composables/useMusicBoard.js'
import { useSupabase } from '../composables/useSupabase.js'

const { setlists, songs, fetchSetlists, fetchSongs, loading, error } = useMusicBoard()
const { supabase } = useSupabase()

const showSetlistsDebug = ref(false)
const showSongsDebug = ref(false)
const connectionTest = ref(null)

const toggleSetlistsDebug = () => {
  showSetlistsDebug.value = !showSetlistsDebug.value
}

const toggleSongsDebug = () => {
  showSongsDebug.value = !showSongsDebug.value
}

const reloadData = async () => {
  try {
    await loadAllData()
    console.log('Data reloaded successfully')
  } catch (err) {
    console.error('Error reloading data:', err)
  }
}

const testConnection = async () => {
  try {
    connectionTest.value = null
    
    // Test basic connection
    const { data, error } = await supabase
      .from('songs')
      .select('count')
      .limit(1)
    
    if (error) {
      connectionTest.value = { 
        success: false, 
        error: error.message,
        details: error
      }
    } else {
      connectionTest.value = { 
        success: true, 
        message: 'Connection successful',
        songsTableAccessible: true
      }
      
      // Test setlists table
      const setlistTest = await supabase
        .from('setlists')
        .select('count')
        .limit(1)
      
      connectionTest.value.setlistsTableAccessible = !setlistTest.error
      if (setlistTest.error) {
        connectionTest.value.setlistsError = setlistTest.error.message
      }
    }
  } catch (err) {
    connectionTest.value = { 
      success: false, 
      error: 'Connection failed',
      details: err.message
    }
  }
}
</script>

<style scoped>
.debug-panel {
  position: fixed;
  top: 10px;
  right: 10px;
  width: 350px;
  max-height: 80vh;
  overflow-y: auto;
  background: #f8f9fa;
  border: 2px solid #007cba;
  border-radius: 8px;
  padding: 15px;
  font-size: 12px;
  z-index: 1001;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.debug-section {
  margin-bottom: 15px;
  padding: 10px;
  background: white;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.debug-section h4 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 14px;
}

.debug-section h3 {
  margin: 0 0 15px 0;
  color: #007cba;
  text-align: center;
}

.debug-json {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
  max-height: 200px;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
  font-size: 10px;
  line-height: 1.2;
}

.toggle-btn, .action-btn {
  padding: 5px 10px;
  margin: 2px;
  background: #007cba;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 11px;
}

.toggle-btn:hover, .action-btn:hover {
  background: #005a87;
}

.toggle-btn:disabled, .action-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.debug-section ul {
  margin: 0;
  padding-left: 15px;
}

.debug-section li {
  margin: 3px 0;
}
</style> 