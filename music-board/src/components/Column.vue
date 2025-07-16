<template>
  <div class="column">
    <h3>{{ title }}</h3>
    <slot></slot>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  }
});
</script>

<style scoped>
.column {
  background-color: #ebecf0;
  border-radius: 3px;
  width: 272px;
  padding: 8px;
  flex-shrink: 0;
}

.column h3 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}
</style> 