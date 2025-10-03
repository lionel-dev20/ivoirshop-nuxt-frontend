<template>
  <div class="max-w-[1440px] mx-auto p-6">
    <!-- Skeleton pour les informations de catégorie -->
    <div class="bg-gray-50 rounded-lg p-4 mb-6">
      <div class="animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div class="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>

    <!-- Layout skeleton avec filtres et produits -->
    <div class="flex flex-col lg:flex-row gap-6">
      <!-- Skeleton colonne latérale - Filtres -->
      <div class="lg:w-1/4">
        <div class="sticky top-6">
          <div class="bg-white border border-gray-100 shadow-md shadow-gray-50 rounded-md p-4">
            <div class="animate-pulse">
              <div class="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div class="space-y-3">
                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                <div class="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div class="mt-6">
                <div class="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div class="space-y-2">
                  <div class="h-3 bg-gray-200 rounded w-full"></div>
                  <div class="h-3 bg-gray-200 rounded w-4/5"></div>
                  <div class="h-3 bg-gray-200 rounded w-3/5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Skeleton colonne principale - Produits -->
      <div class="lg:w-full">
        <!-- Skeleton en-tête avec compteur et tri -->
        <div class="bg-white border border-gray-100 shadow-md shadow-gray-50 rounded-md p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div class="animate-pulse">
            <div class="h-6 bg-gray-200 rounded w-32"></div>
          </div>
          <div class="mt-4 sm:mt-0 animate-pulse">
            <div class="h-10 bg-gray-200 rounded w-40"></div>
          </div>
        </div>

        <!-- Skeleton grille de produits -->
        <ProductGridSkeleton :count="8" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Composant skeleton pour la page de catégorie
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
