<template>
  <div class="max-w-[1440px] mx-auto my-4">
    <!-- Skeleton pour le hero section -->
    <div class="flex gap-x-2 items-center max-h-[480px]">
      <!-- Skeleton méga-menu -->
      <div class="w-64 bg-white border border-gray-100 rounded-sm shadow-md shadow-gray-50 p-4">
        <div class="animate-pulse">
          <div class="space-y-3">
            <div v-for="i in 6" :key="i" class="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
      
      <!-- Skeleton carousel -->
      <div class="flex-1 bg-gray-200 rounded-lg h-96 animate-pulse"></div>
      
      <!-- Skeleton publicités -->
      <div class="w-64 space-y-2">
        <div class="bg-gray-200 rounded-lg h-48 animate-pulse"></div>
        <div class="bg-gray-200 rounded-lg h-48 animate-pulse"></div>
      </div>
    </div>

    <!-- Skeleton espacement -->
    <div class="h-8"></div>

    <!-- Skeleton partenaires -->
    <div class="bg-white rounded-lg p-6 mb-8">
      <div class="animate-pulse">
        <div class="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div class="flex space-x-4">
          <div v-for="i in 5" :key="i" class="h-16 bg-gray-200 rounded w-32"></div>
        </div>
      </div>
    </div>

    <!-- Skeleton espacement -->
    <div class="h-8"></div>

    <!-- Skeleton blocs de catégories -->
    <div class="py-12 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Skeleton titre -->
        <div class="text-center mb-12">
          <div class="animate-pulse">
            <div class="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div class="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>

        <!-- Skeleton grille de catégories -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="i in 6" :key="i" class="bg-white rounded-lg shadow-md overflow-hidden">
            <!-- Skeleton image de catégorie -->
            <div class="h-48 bg-gray-200 animate-pulse"></div>
            
            <!-- Skeleton contenu -->
            <div class="p-6">
              <div class="animate-pulse">
                <div class="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div class="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div class="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Skeleton espacement -->
    <div class="h-8"></div>

    <!-- Skeleton section nouveautés -->
    <div class="bg-white rounded-lg p-6 mb-8">
      <div class="animate-pulse">
        <div class="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="i in 4" :key="i" class="bg-gray-50 rounded-lg overflow-hidden">
            <div class="h-48 bg-gray-200 animate-pulse"></div>
            <div class="p-4">
              <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Skeleton espacement -->
    <div class="h-8"></div>

    <!-- Skeleton bannières -->
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="i in 2" :key="i" class="bg-gray-200 rounded-lg h-64 animate-pulse"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Composant skeleton pour la page d'accueil
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
