<template>
  <div class="setlist" @click="$emit('open')">
    <h4>{{ setlist.name }}</h4>
    <div class="setlist-meta">
      <p class="venue">{{ setlist.venue }}</p>
      <p class="date">{{ formatDate(setlist.date) }}</p>
      <p class="song-count">{{ setlist.songs.length }} songs</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  setlist: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['open']);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};
</script>

<style scoped>
.setlist {
  background-color: white;
  border-radius: 3px;
  box-shadow: 0 1px 0 rgba(9, 30, 66, 0.25);
  padding: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: box-shadow 0.2s ease;
}

.setlist:hover {
  box-shadow: 0 2px 4px rgba(9, 30, 66, 0.25);
}

.setlist h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #172b4d;
}

.setlist-meta p {
  margin: 2px 0;
  font-size: 12px;
  color: #5e6c84;
}

.venue {
  font-weight: 500;
}

.date {
  font-style: italic;
}

.song-count {
  font-weight: 500;
  color: #0079bf;
}
</style> 