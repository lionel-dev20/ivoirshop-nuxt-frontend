<template>
  <div class="bg-white border border-gray-100 rounded-md overflow-hidden shadow-md shadow-gray-100">
    <!-- Skeleton image -->
    <div class="aspect-w-16 aspect-h-9">
      <div class="w-full h-64 bg-gray-200 animate-pulse"></div>
    </div>
    
    <!-- Skeleton contenu -->
    <div class="p-3.5">
      <div class="animate-pulse">
        <!-- Skeleton titre -->
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div class="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
        
        <!-- Skeleton prix -->
        <div class="flex items-center justify-between mb-3">
          <div class="space-y-1">
            <div class="h-5 bg-gray-200 rounded w-20"></div>
            <div class="h-3 bg-gray-200 rounded w-16"></div>
          </div>
          <div class="h-6 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>

    <!-- Skeleton bouton -->
    <div class="px-4 pb-4">
      <div class="animate-pulse">
        <div class="w-full h-10 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props optionnelles pour personnaliser le skeleton
interface Props {
  showButton?: boolean
  imageHeight?: string
}

withDefaults(defineProps<Props>(), {
  showButton: true,
  imageHeight: 'h-64'
})
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
