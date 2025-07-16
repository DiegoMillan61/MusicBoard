<script setup>
import { ref } from 'vue'

const props = defineProps({
  item: Object
})

const emit = defineEmits(['close'])

const handleClose = () => {
  emit('close')
}

// Estado para el nuevo subitem
const newSubitemTitle = ref('')
const newSubitemDescription = ref('')

// Función para agregar nuevo subitem
const addSubitem = () => {
  if (!newSubitemTitle.value.trim()) return

  const newSubitem = {
    id: props.item.subitems ? props.item.subitems.length + 1 : 1,
    title: newSubitemTitle.value,
    description: newSubitemDescription.value
  }

  // Emitir el evento para agregar el subitem
  emit('add-subitem', {
    itemId: props.item.id,
    subitem: newSubitem
  })

  // Limpiar los campos
  newSubitemTitle.value = ''
  newSubitemDescription.value = ''
}
</script>

<template>
  <div class="item-detail-overlay" @click="handleClose">
    <div class="item-detail" @click.stop>
      <div class="item-detail-header">
        <h2>{{ item.title }}</h2>
        <button class="close-button" @click="handleClose">×</button>
      </div>
      <div class="item-detail-content">
        <p class="description">{{ item.description }}</p>
        
        <div v-if="item.links && item.links.length > 0" class="links-section">
          <h3>Archivos y Enlaces</h3>
          <div class="links-list">
            <a v-for="link in item.links" :key="link.url" :href="link.url" target="_blank" class="link-item">
              <span class="link-icon">🔗</span>
              <span class="link-name">{{ link.name }}</span>
            </a>
          </div>
        </div>

        <!-- Sección de subitems -->
        <div class="subitems-section">
          <h3>Subitems</h3>
          
          <!-- Lista de subitems existentes -->
          <div v-if="item.subitems && item.subitems.length > 0" class="subitems-list">
            <div v-for="subitem in item.subitems" :key="subitem.id" class="subitem-item">
              <h4>{{ subitem.title }}</h4>
              <p>{{ subitem.description }}</p>
            </div>
          </div>
          
          <!-- Formulario para crear nuevo subitem -->
          <div class="subitem-form">
            <input
              v-model="newSubitemTitle"
              type="text"
              placeholder="Título del subitem"
              class="subitem-input"
            >
            <textarea
              v-model="newSubitemDescription"
              placeholder="Descripción"
              class="subitem-textarea"
            ></textarea>
            <button @click="addSubitem" class="add-subitem-button">Agregar Subitem</button>
          </div>
        </div>

        <div class="item-detail-actions">
          <button class="edit-button">Editar</button>
          <button class="delete-button">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.item-detail-overlay {
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

.item-detail {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.item-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.item-detail-header h2 {
  margin: 0;
  color: #2c3e50;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #6c757d;
  cursor: pointer;
  padding: 0.25rem;
}

.close-button:hover {
  color: #dc3545;
}

.item-detail-content {
  margin-top: 1rem;
}

.description {
  margin: 0 0 1.5rem 0;
  color: #495057;
  line-height: 1.5;
}

.links-section {
  margin: 1.5rem 0;
}

.links-section h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.links-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.link-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  text-decoration: none;
  color: #2c3e50;
  transition: background-color 0.2s;
}

.link-item:hover {
  background-color: #e9ecef;
  color: #007bff;
}

.link-icon {
  font-size: 1.2rem;
}

.link-name {
  flex: 1;
}

.subitems-section {
  margin: 1.5rem 0;
}

.subitems-section h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.subitems-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.subitem-item {
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.subitem-item h4 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.subitem-item p {
  margin: 0;
  color: #6c757d;
}

.subitem-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.subitem-input,
.subitem-textarea {
  padding: 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  font-size: 0.9rem;
}

.subitem-input:focus,
.subitem-textarea:focus {
  outline: none;
  border-color: #5aac44;
}

.subitem-textarea {
  height: 100px;
  resize: vertical;
}

.add-subitem-button {
  padding: 0.5rem 1rem;
  background-color: #5aac44;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.add-subitem-button:hover {
  background-color: #43993a;
}

.item-detail-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.edit-button, .delete-button {
  flex: 1;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.edit-button {
  background-color: #5aac44;
  color: white;
}

.delete-button {
  background-color: #dc3545;
  color: white;
}

.edit-button:hover {
  background-color: #43993a;
}

.delete-button:hover {
  background-color: #c82333;
}
</style>
