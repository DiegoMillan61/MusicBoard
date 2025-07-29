import { ref } from 'vue'
import { useSupabase } from './useSupabase.js'

export function useMusicBoard() {
  const { fetchData, insertData, updateData, deleteData, loading, error } = useSupabase()
  
  const setlists = ref([])
  const songs = ref([])

  // Obtener todos los setlists
  const fetchSetlists = async () => {
    try {
      // Obtener setlists con sus canciones relacionadas
      const data = await fetchData('setlists', {
        select: '*, setlist_songs(song_id, position, songs(*))',
        orderBy: { column: 'created_at', ascending: false }
      })
    
      setlists.value = data || []
      return data
    } catch (err) {
      console.error('Error fetching setlists:', err)
      // En caso de error, retornamos array vacío para no romper la UI
      setlists.value = []
      return []
    }
  }

  // Obtener todas las canciones
  const fetchSongs = async () => {
    try {
      const data = await fetchData('songs', {
        orderBy: { column: 'title', ascending: true }
      })
      songs.value = data || []
      return data
    } catch (err) {
      console.error('Error fetching songs:', err)
      throw err
    }
  }

  // Crear un nuevo setlist
  const createSetlist = async (setlistData) => {
    try {
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
      throw err
    }
  }

  // Actualizar un setlist
  const updateSetlist = async (id, setlistData) => {
    try {
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
      throw err
    }
  }

  // Eliminar un setlist
  const deleteSetlist = async (id) => {
    try {
      await deleteData('setlists', id)
      setlists.value = setlists.value.filter(s => s.id !== id)
      return true
    } catch (err) {
      console.error('Error deleting setlist:', err)
      throw err
    }
  }

  // Crear una nueva canción
  const createSong = async (songData) => {
    try {
      const data = await insertData('songs', {
        title: songData.title,
        artist: songData.artist,
        duration: songData.duration,
        key: songData.key,
        bpm: songData.bpm || null,
        genre: songData.genre || null,
        notes: songData.notes || null
      })
      if (data && data[0]) {
        songs.value.push(data[0])
      }
      return data
    } catch (err) {
      console.error('Error creating song:', err)
      throw err
    }
  }

  // Actualizar una canción
  const updateSong = async (id, songData) => {
    try {
      const data = await updateData('songs', id, songData)
      if (data && data[0]) {
        const index = songs.value.findIndex(s => s.id === id)
        if (index !== -1) {
          songs.value[index] = { ...songs.value[index], ...data[0] }
        }
      }
      return data
    } catch (err) {
      console.error('Error updating song:', err)
      throw err
    }
  }

  // Eliminar una canción
  const deleteSong = async (id) => {
    try {
      await deleteData('songs', id)
      songs.value = songs.value.filter(s => s.id !== id)
      return true
    } catch (err) {
      console.error('Error deleting song:', err)
      throw err
    }
  }

  // Agregar una canción a un setlist
  const addSongToSetlist = async (setlistId, songId, position = null) => {
    try {
      const data = await insertData('setlist_songs', {
        setlist_id: setlistId,
        song_id: songId,
        position: position
      })
      return data
    } catch (err) {
      console.error('Error adding song to setlist:', err)
      throw err
    }
  }

  // Remover una canción de un setlist
  const removeSongFromSetlist = async (setlistId, songId) => {
    try {
      const { supabase } = useSupabase()
      const { error } = await supabase
        .from('setlist_songs')
        .delete()
        .eq('setlist_id', setlistId)
        .eq('song_id', songId)
      
      if (error) throw error
      return true
    } catch (err) {
      console.error('Error removing song from setlist:', err)
      throw err
    }
  }

  return {
    // Estado
    setlists,
    songs,
    loading,
    error,
    
    // Métodos para setlists
    fetchSetlists,
    createSetlist,
    updateSetlist,
    deleteSetlist,
    
    // Métodos para canciones
    fetchSongs,
    createSong,
    updateSong,
    deleteSong,
    
    // Métodos para relaciones setlist-canción
    addSongToSetlist,
    removeSongFromSetlist
  }
} 