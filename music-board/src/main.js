import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

// Importar el composable de Supabase para inicializar la autenticación
import { useSupabase } from './composables/useSupabase.js'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// Inicializar autenticación de Supabase
const { initAuth } = useSupabase()
initAuth()

app.mount('#app')
