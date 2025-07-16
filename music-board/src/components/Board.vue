<template>
  <div class="board">
    <slot></slot>
  </div>
</template>

<script setup>
</script>

<style scoped>
.board {
  display: flex;
  gap: 10px;
  padding: 10px;
  background-color: #f4f5f7;
  min-height: 100vh;
  align-items: flex-start;
}
</style> 