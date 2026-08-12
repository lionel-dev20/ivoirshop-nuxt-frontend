<!-- components/blog/EmptyState.vue -->
<!-- Affiché tant qu'aucun article n'est publié dans WordPress, ou si WordPress
     est momentanément injoignable. -->
<template>
  <div class="bg-white border border-gray-100 rounded-md shadow-sm shadow-slate-100 px-6 py-16 text-center">
    <div class="mx-auto w-14 h-14 rounded-full bg-[#ff9900]/10 flex items-center justify-center">
      <svg class="w-7 h-7 text-[#ff9900]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.8"
          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m0 0h2a2 2 0 012 2v9a2 2 0 01-2 2h-2m0-13v13M7 8h6M7 12h6M7 16h4"
        />
      </svg>
    </div>

    <h2 class="mt-5 text-lg font-bold text-gray-900">{{ title }}</h2>
    <p class="mt-2 text-sm text-gray-600 max-w-md mx-auto leading-relaxed">{{ message }}</p>

    <NuxtLink
      to="/"
      class="inline-flex items-center mt-6 px-5 py-2.5 rounded-md bg-[#ff9900] hover:bg-[#e68a00] text-black text-sm font-semibold transition-colors"
    >
      Retour à la boutique
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ title?: string; message?: string }>(), {
  title: 'Le blog arrive bientôt',
  message:
    'Nos premiers articles sont en préparation : conseils d’achat, guides d’utilisation et bons plans. Revenez très vite.',
})
</script>
