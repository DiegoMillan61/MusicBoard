import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useSupabase } from '../composables/useSupabase.js'

export const useMusicBoardStore = defineStore('musicBoard', () => {
  // Estado
  const setlists = ref([])
  const songs = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Composable de Supabase
  const { fetchData } = useSupabase()

  // Getters computados
  const setlistsCount = computed(() => setlists.value.length)
  const songsCount = computed(() => songs.value.length)
  const hasSetlists = computed(() => setlists.value.length > 0)
  const hasSongs = computed(() => songs.value.length > 0)

  // Actions
  const fetchSetlists = async () => {
    try {
      loading.value = true
      error.value = null
      
      console.log('🔄 Fetching setlists from Supabase...')
      
      const data = await fetchData('setlists', {
        select: '*, setlist_songs(song_id, position, songs(*))',
        orderBy: { column: 'created_at', ascending: false }
      })
      
      console.log('✅ Setlists fetched:', data)
      setlists.value = data || []
      
      return data
    } catch (err) {
      console.error('❌ Error fetching setlists:', err)
      error.value = err.message || 'Error loading setlists'
      setlists.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  const fetchSongs = async () => {
    try {
      loading.value = true
      error.value = null
      
      console.log('🔄 Fetching songs from Supabase...')
      
      const data = await fetchData('songs', {
        orderBy: { column: 'title', ascending: true }
      })
      
      console.log('✅ Songs fetched:', data)
      songs.value = data || []
      
      return data
    } catch (err) {
      console.error('❌ Error fetching songs:', err)
      error.value = err.message || 'Error loading songs'
      songs.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  const createSetlist = async (setlistData) => {
    try {
      loading.value = true
      error.value = null

      const { insertData } = useSupabase()
      const data = await insertData('setlists', {
        name: setlistData.name,
        venue: setlistData.venue,
        date: setlistData.date,
        description: setlistData.description || null
      })

      if (data && data[0]) {
        setlists.value.unshift(data[0])
      }
      
      return data
    } catch (err) {
      console.error('Error creating setlist:', err)
      error.value = err.message || 'Error creating setlist'
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateSetlist = async (id, setlistData) => {
    try {
      loading.value = true
      error.value = null

      const { updateData } = useSupabase()
      const data = await updateData('setlists', id, setlistData)

      if (data && data[0]) {
        const index = setlists.value.findIndex(s => s.id === id)
        if (index !== -1) {
          setlists.value[index] = { ...setlists.value[index], ...data[0] }
        }
      }
      
      return data
    } catch (err) {
      console.error('Error updating setlist:', err)
      error.value = err.message || 'Error updating setlist'
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteSetlist = async (id) => {
    try {
      loading.value = true
      error.value = null

      const { deleteData } = useSupabase()
      await deleteData('setlists', id)
      
      setlists.value = setlists.value.filter(s => s.id !== id)
      return true
    } catch (err) {
      console.error('Error deleting setlist:', err)
      error.value = err.message || 'Error deleting setlist'
      throw err
    } finally {
      loading.value = false
    }
  }

  // Función auxiliar para obtener las canciones de un setlist
  const getSetlistSongs = (setlist) => {
    if (!setlist) return []
    
    // Si tiene setlist_songs (relación de Supabase), usarlas
    if (setlist.setlist_songs && Array.isArray(setlist.setlist_songs)) {
      return setlist.setlist_songs
        .map(ss => ss.songs)
        .filter(Boolean)
        .sort((a, b) => {
          // Ordenar por posición si está disponible
          const posA = setlist.setlist_songs.find(ss => ss.songs?.id === a.id)?.position || 0
          const posB = setlist.setlist_songs.find(ss => ss.songs?.id === b.id)?.position || 0
          return posA - posB
        })
    }
    
    // Si tiene songs directamente (datos de ejemplo), usarlas
    if (setlist.songs && Array.isArray(setlist.songs)) {
      return setlist.songs
    }
    
    // Por defecto retornar array vacío
    return []
  }

  // Función para cargar todos los datos
  const loadAllData = async () => {
    console.log('🚀 Loading all data...')
    try {
      // Cargar canciones y setlists en paralelo
      await Promise.all([
        fetchSongs(),
        fetchSetlists()
      ])
      console.log('✅ All data loaded successfully')
    } catch (err) {
      console.error('❌ Error loading data:', err)
      error.value = 'Error loading data'
    }
  }

  // Función para limpiar errores
  const clearError = () => {
    error.value = null
  }

  return {
    // Estado
    setlists,
    songs,
    loading,
    error,

    // Getters
    setlistsCount,
    songsCount,
    hasSetlists,
    hasSongs,

    // Actions
    fetchSetlists,
    fetchSongs,
    createSetlist,
    updateSetlist,
    deleteSetlist,
    loadAllData,
    clearError,

    // Utils
    getSetlistSongs
  }
}) 