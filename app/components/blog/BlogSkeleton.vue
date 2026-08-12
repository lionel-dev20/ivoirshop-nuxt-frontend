<!-- components/blog/BlogSkeleton.vue -->
<!-- Squelette de chargement de la page blog, calqué sur la mise en page réelle
     pour éviter tout saut de contenu. -->
<template>
  <div class="animate-pulse space-y-12">
    <!-- Bandeau -->
    <div class="h-56 md:h-64 bg-gray-200 rounded-md"></div>

    <!-- À la une -->
    <div>
      <div class="h-5 w-40 bg-gray-200 rounded mb-6"></div>
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div class="lg:col-span-5">
          <div class="h-72 bg-gray-200 rounded-md"></div>
          <div class="h-5 bg-gray-200 rounded w-3/4 mt-4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2 mt-3"></div>
        </div>
        <div class="lg:col-span-4 space-y-6">
          <div v-for="i in 2" :key="`m-${i}`" class="flex gap-4">
            <div class="w-36 h-28 bg-gray-200 rounded-md flex-shrink-0"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 bg-gray-200 rounded w-full"></div>
              <div class="h-4 bg-gray-200 rounded w-2/3"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2 mt-3"></div>
            </div>
          </div>
        </div>
        <div class="lg:col-span-3 space-y-5">
          <div v-for="i in 3" :key="`s-${i}`" class="flex gap-4">
            <div class="w-20 h-20 bg-gray-200 rounded-md flex-shrink-0"></div>
            <div class="flex-1 space-y-2">
              <div class="h-3.5 bg-gray-200 rounded w-full"></div>
              <div class="h-3.5 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Derniers articles + populaires -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div class="lg:col-span-8">
        <div class="h-5 w-40 bg-gray-200 rounded mb-6"></div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div v-for="i in 4" :key="`l-${i}`">
            <div class="h-48 bg-gray-200 rounded-md"></div>
            <div class="h-4 bg-gray-200 rounded w-3/4 mt-4"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2 mt-3"></div>
          </div>
        </div>
      </div>
      <div class="lg:col-span-4">
        <div class="h-5 w-40 bg-gray-200 rounded mb-6"></div>
        <div v-for="i in 5" :key="`p-${i}`" class="flex gap-4 mb-6">
          <div class="w-10 h-8 bg-gray-200 rounded"></div>
          <div class="flex-1 space-y-2">
            <div class="h-3.5 bg-gray-200 rounded w-full"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
