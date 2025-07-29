import { ref, computed } from 'vue'
import { supabase } from '../lib/supabase.js'

export function useSupabase() {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Estado de autenticación
  const isAuthenticated = computed(() => !!user.value)

  // Función para obtener el usuario actual
  const getCurrentUser = async () => {
    try {
      loading.value = true
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError
      user.value = currentUser
      return currentUser
    } catch (err) {
      error.value = err.message
      console.error('Error getting current user:', err)
    } finally {
      loading.value = false
    }
  }

  // Función para iniciar sesión con email y password
  const signIn = async (email, password) => {
    try {
      loading.value = true
      error.value = null
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (signInError) throw signInError
      user.value = data.user
      return data
    } catch (err) {
      error.value = err.message
      console.error('Error signing in:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Función para registrarse
  const signUp = async (email, password) => {
    try {
      loading.value = true
      error.value = null
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password
      })
      if (signUpError) throw signUpError
      return data
    } catch (err) {
      error.value = err.message
      console.error('Error signing up:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Función para cerrar sesión
  const signOut = async () => {
    try {
      loading.value = true
      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) throw signOutError
      user.value = null
    } catch (err) {
      error.value = err.message
      console.error('Error signing out:', err)
    } finally {
      loading.value = false
    }
  }

  // Operaciones de base de datos genéricas
  const fetchData = async (table, options = {}) => {
    try {
      loading.value = true
      error.value = null
      let query = supabase.from(table).select(options.select || '*')
      
      if (options.filters) {
        options.filters.forEach(filter => {
          query = query.filter(filter.column, filter.operator, filter.value)
        })
      }
      
      if (options.orderBy) {
        query = query.order(options.orderBy.column, { ascending: options.orderBy.ascending })
      }
      
      if (options.limit) {
        query = query.limit(options.limit)
      }
      
      const { data, error: fetchError } = await query
      if (fetchError) throw fetchError
      return data
    } catch (err) {
      error.value = err.message
      console.error('Error fetching data:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const insertData = async (table, data) => {
    try {
      loading.value = true
      error.value = null
      const { data: insertedData, error: insertError } = await supabase
        .from(table)
        .insert(data)
        .select()
      if (insertError) throw insertError
      return insertedData
    } catch (err) {
      error.value = err.message
      console.error('Error inserting data:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateData = async (table, id, data) => {
    try {
      loading.value = true
      error.value = null
      const { data: updatedData, error: updateError } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
      if (updateError) throw updateError
      return updatedData
    } catch (err) {
      error.value = err.message
      console.error('Error updating data:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteData = async (table, id) => {
    try {
      loading.value = true
      error.value = null
      const { error: deleteError } = await supabase
        .from(table)
        .delete()
        .eq('id', id)
      if (deleteError) throw deleteError
      return true
    } catch (err) {
      error.value = err.message
      console.error('Error deleting data:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Inicializar el estado de autenticación
  const initAuth = () => {
    // Obtener el usuario actual
    getCurrentUser()
    
    // Escuchar cambios en el estado de autenticación
    supabase.auth.onAuthStateChange((event, session) => {
      user.value = session?.user || null
      if (event === 'SIGNED_OUT') {
        user.value = null
      }
    })
  }

  return {
    // Estado
    user,
    loading,
    error,
    isAuthenticated,
    
    // Métodos de autenticación
    signIn,
    signUp,
    signOut,
    getCurrentUser,
    initAuth,
    
    // Métodos de base de datos
    fetchData,
    insertData,
    updateData,
    deleteData,
    
    // Cliente directo para casos específicos
    supabase
  }
} 