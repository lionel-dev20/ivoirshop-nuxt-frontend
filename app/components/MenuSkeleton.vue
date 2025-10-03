<template>
  <div class="flex space-x-4">
    <div v-for="i in 5" :key="i" class="animate-pulse">
      <div class="h-6 bg-gray-200 rounded w-16"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Composant skeleton pour le menu
</script>

<style scoped>
/* Animation fluide pour le skeleton */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Effet de shimmer pour un rendu plus moderne */
.animate-pulse::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}
</style>
