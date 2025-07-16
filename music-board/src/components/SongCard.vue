<template>
  <div class="song-card">
    <div class="song-header">
      <h5>{{ song.title }}</h5>
      <span class="song-key">{{ song.key }}</span>
    </div>
    <div class="song-details">
      <p class="artist">{{ song.artist }}</p>
      <p class="duration">{{ song.duration }}</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  song: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.song-card {
  background-color: #f8f9fa;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 8px;
  border-left: 4px solid #0079bf;
}

.song-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.song-header h5 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #172b4d;
}

.song-key {
  background-color: #0079bf;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.song-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.artist {
  margin: 0;
  font-size: 14px;
  color: #5e6c84;
  font-style: italic;
}

.duration {
  margin: 0;
  font-size: 12px;
  color: #6b778c;
  font-weight: 500;
}
</style> 