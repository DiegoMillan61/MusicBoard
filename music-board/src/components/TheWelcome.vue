<script setup>
import { ref } from 'vue'
import Folder from './Folder.vue'

// Datos de ejemplo para las carpetas
const folders = ref([
  {
    id: 1,
    title: 'Trabajo',
    items: [
      { 
        id: 1, 
        title: 'Proyecto A', 
        description: 'Desarrollo de la nueva aplicación',
        links: [
          { name: 'Documento de diseño', url: 'https://example.com/design.pdf' },
          { name: 'Repositorio Git', url: 'https://github.com/proyecto-a' }
        ],
        subitems: [
          { id: 1, title: 'Investigación inicial', description: 'Recolección de requisitos' },
          { id: 2, title: 'Prototipo', description: 'Diseño de la interfaz' }
        ]
      },
      { 
        id: 2, 
        title: 'Reunión', 
        description: 'Sprint planning para la semana',
        links: [
          { name: 'Calendario', url: 'https://calendar.google.com/event/123' },
          { name: 'Notas de la reunión', url: 'https://docs.google.com/document/123' }
        ],
        subitems: []
      }
    ]
  },
  {
    id: 2,
    title: 'Personal',
    items: [
      { 
        id: 3, 
        title: 'Gimnasio', 
        description: 'Clases de fitness',
        links: [
          { name: 'Horario de clases', url: 'https://gym.com/schedule.pdf' },
          { name: 'Plan de entrenamiento', url: 'https://gym.com/plan.pdf' }
        ],
        subitems: [
          { id: 1, title: 'Lunes - Entrenamiento A', description: 'Fuerza y resistencia' },
          { id: 2, title: 'Miércoles - Entrenamiento B', description: 'Cardio y flexibilidad' }
        ]
      },
      { 
        id: 4, 
        title: 'Cursos', 
        description: 'Aprender Vue.js avanzado',
        links: [
          { name: 'Material del curso', url: 'https://course.com/material.zip' },
          { name: 'Foro de discusión', url: 'https://course.com/forum' }
        ],
        subitems: []
      }
    ]
  },
  {
    id: 3,
    title: 'Finanzas',
    items: []
  }
])

// Función para agregar nueva carpeta
const addFolder = () => {
  const newFolder = {
    id: folders.value.length + 1,
    title: 'Nueva carpeta',
    items: []
  }
  folders.value.push(newFolder)
}
</script>

<template>
  <div class="folders-app">
    <!-- Header -->
    <header class="folders-header">
      <h1>Organizador de Carpetas</h1>
      <nav>
        <button @click="addFolder">+ Nueva carpeta</button>
      </nav>
    </header>

    <!-- Área principal -->
    <main class="folders-container">
      <!-- Carpetas existentes -->
      <Folder
        v-for="folder in folders"
        :key="folder.id"
        :title="folder.title"
        :items="folder.items"
      />
    </main>
  </div>
</template>

<style scoped>
.folders-app {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 1rem;
}

.folders-header {
  background-color: #0079bf;
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.folders-container {
  padding: 1rem;
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

button {
  background-color: #5aac44;
  color: white;
  border: none;
  border-radius: 3px;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

button:hover {
  background-color: #43993a;
}
</style>
