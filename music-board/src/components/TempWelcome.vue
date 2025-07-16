<script setup>
import { ref } from 'vue'

// Datos de ejemplo para las columnas
const columns = ref([
  {
    id: 1,
    title: 'Por hacer',
    cards: [
      { id: 1, title: 'Tarea 1', description: 'Descripción de la tarea 1' },
      { id: 2, title: 'Tarea 2', description: 'Descripción de la tarea 2' }
    ]
  },
  {
    id: 2,
    title: 'En progreso',
    cards: [
      { id: 3, title: 'Tarea 3', description: 'Descripción de la tarea 3' }
    ]
  },
  {
    id: 3,
    title: 'Completado',
    cards: []
  }
])

// Función para agregar nueva columna
const addColumn = () => {
  const newColumn = {
    id: columns.value.length + 1,
    title: 'Nueva columna',
    cards: []
  }
  columns.value.push(newColumn)
}
</script>

<template>
  <div class="trello-app">
    <!-- Header -->
    <header class="trello-header">
      <h1>Trello Clone</h1>
      <nav>
        <button>Menú</button>
      </nav>
    </header>

    <!-- Área principal -->
    <main class="board-container">
      <!-- Columnas existentes -->
      <div v-for="column in columns" :key="column.id" class="column">
        <div class="column-header">
          <h2>{{ column.title }}</h2>
          <button @click="addColumn">+</button>
        </div>
        <div class="cards-container">
          <div v-for="card in column.cards" :key="card.id" class="card">
            <h3>{{ card.title }}</h3>
            <p>{{ card.description }}</p>
          </div>
        </div>
      </div>

      <!-- Columna para agregar nuevas tarjetas -->
      <div class="add-column">
        <button @click="addColumn">+ Agregar columna</button>
      </div>
    </main>
  </div>
</template>

<style scoped>
.trello-app {
  font-family: Arial, sans-serif;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.trello-header {
  background-color: #0079bf;
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.board-container {
  display: flex;
  padding: 2rem;
  gap: 1rem;
}

.column {
  background-color: white;
  border-radius: 5px;
  padding: 1rem;
  min-width: 300px;
  flex: 1;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.cards-container {
  min-height: 200px;
}

.card {
  background-color: #e2e4e6;
  border-radius: 3px;
  padding: 1rem;
  margin-bottom: 1rem;
  cursor: pointer;
}

.add-column {
  min-width: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
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
