<script setup>
import { ref } from 'vue'
import ItemDetail from './ItemDetail.vue'

const props = defineProps({
  title: String,
  items: Array
})

const isOpen = ref(false)
const selectedItemId = ref(null)

const toggleFolder = () => {
  isOpen.value = !isOpen.value
}

const showItemDetail = (itemId) => {
  selectedItemId.value = itemId
}

const closeItemDetail = () => {
  selectedItemId.value = null
}

// Manejar la adición de subitems
const handleAddSubitem = (itemId, subitem) => {
  const itemIndex = props.items.findIndex(item => item.id === itemId)
  if (itemIndex !== -1) {
    if (!props.items[itemIndex].subitems) {
      props.items[itemIndex].subitems = []
    }
    props.items[itemIndex].subitems.push(subitem)
  }
}
</script>

<template>
  <div class="folder">
    <div class="folder-header" @click="toggleFolder">
      <div class="folder-icon">
        <span v-if="isOpen">▼</span>
        <span v-else>▶</span>
      </div>
      <h3>{{ title }}</h3>
    </div>
    <div v-if="isOpen" class="folder-content">
      <div v-for="item in items" :key="item.id" class="folder-item" @click="showItemDetail(item.id)">
        <h4>{{ item.title }}</h4>
        <p>{{ item.description }}</p>
      </div>
    </div>
  </div>
  
  <ItemDetail
    v-if="selectedItemId"
    :item="items.find(item => item.id === selectedItemId)"
    @close="closeItemDetail"
  />
</template>

<style scoped>
.folder {
  margin-bottom: 1rem;
  border-radius: 4px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.folder-header {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  cursor: pointer;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.folder-icon {
  margin-right: 0.75rem;
  font-size: 1.2rem;
}

.folder-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #2c3e50;
}

.folder-content {
  padding: 1rem;
}

.folder-item {
  padding: 0.75rem;
  border-bottom: 1px solid #dee2e6;
  cursor: pointer;
  transition: background-color 0.2s;
}

.folder-item:last-child {
  border-bottom: none;
}

.folder-item:hover {
  background-color: #f8f9fa;
}

.folder-item h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: #2c3e50;
}

.folder-item p {
  margin: 0;
  color: #6c757d;
  font-size: 0.9rem;
}
</style>
