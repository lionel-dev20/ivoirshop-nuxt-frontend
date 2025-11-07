<template>
  <div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 px-4 py-6 bg-white border border-gray-200 rounded-lg shadow-sm">
    <!-- Info sur la page actuelle -->
    <div class="text-sm text-gray-700">
      Affichage de <span class="font-medium">{{ startItem }}</span> à <span class="font-medium">{{ endItem }}</span> sur <span class="font-medium">{{ totalItems }}</span> produits
    </div>

    <!-- Boutons de pagination -->
    <nav class="flex items-center space-x-2">
      <!-- Bouton Précédent -->
      <button
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-3 py-2 text-sm font-medium rounded-md transition-colors"
        :class="currentPage === 1 
          ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <!-- Numéros de page -->
      <div class="hidden sm:flex items-center space-x-1">
        <!-- Première page -->
        <button
          v-if="showFirstPage"
          @click="goToPage(1)"
          class="px-4 py-2 text-sm font-medium rounded-md transition-colors"
          :class="currentPage === 1 
            ? 'bg-primary text-white' 
            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'">
          1
        </button>

        <!-- Points de suspension gauche -->
        <span v-if="showLeftDots" class="px-2 text-gray-500">...</span>

        <!-- Pages visibles -->
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          class="px-4 py-2 text-sm font-medium rounded-md transition-colors"
          :class="currentPage === page 
            ? 'bg-primary text-white' 
            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'">
          {{ page }}
        </button>

        <!-- Points de suspension droite -->
        <span v-if="showRightDots" class="px-2 text-gray-500">...</span>

        <!-- Dernière page -->
        <button
          v-if="showLastPage"
          @click="goToPage(totalPages)"
          class="px-4 py-2 text-sm font-medium rounded-md transition-colors"
          :class="currentPage === totalPages 
            ? 'bg-primary text-white' 
            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'">
          {{ totalPages }}
        </button>
      </div>

      <!-- Version mobile simplifiée -->
      <div class="flex sm:hidden items-center space-x-2">
        <span class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md">
          {{ currentPage }} / {{ totalPages }}
        </span>
      </div>

      <!-- Bouton Suivant -->
      <button
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-3 py-2 text-sm font-medium rounded-md transition-colors"
        :class="currentPage === totalPages 
          ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  currentPage: number
  totalItems: number
  itemsPerPage: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'page-change': [page: number]
}>()

// Calculs
const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))
const startItem = computed(() => (props.currentPage - 1) * props.itemsPerPage + 1)
const endItem = computed(() => Math.min(props.currentPage * props.itemsPerPage, props.totalItems))

// Logique d'affichage des pages
const visiblePages = computed(() => {
  const delta = 2 // Nombre de pages à afficher de chaque côté de la page actuelle
  const range: number[] = []
  const rangeWithDots: number[] = []
  let l: number | undefined

  for (let i = 1; i <= totalPages.value; i++) {
    if (
      i === 1 ||
      i === totalPages.value ||
      (i >= props.currentPage - delta && i <= props.currentPage + delta)
    ) {
      range.push(i)
    }
  }

  range.forEach((i) => {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        // Les points de suspension sont gérés séparément
      }
    }
    rangeWithDots.push(i)
    l = i
  })

  // Filtrer pour ne garder que les pages du milieu (pas la première ni la dernière)
  return rangeWithDots.filter(page => page !== 1 && page !== totalPages.value)
})

const showFirstPage = computed(() => !visiblePages.value.includes(1) || props.currentPage > 3)
const showLastPage = computed(() => !visiblePages.value.includes(totalPages.value) || props.currentPage < totalPages.value - 2)
const showLeftDots = computed(() => props.currentPage > 4)
const showRightDots = computed(() => props.currentPage < totalPages.value - 3)

// Navigation
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value && page !== props.currentPage) {
    emit('page-change', page)
    // Scroll vers le haut de la page
    if (process.client) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}
</script>

