<!-- components/blog/SectionTitle.vue -->
<!-- Titre de section du blog : libellé, soulignement orange court sur une
     ligne grise pleine largeur (repris du thème de référence). -->
<template>
  <div class="mb-6">
    <div class="flex items-baseline justify-between gap-4">
      <h2 class="text-lg md:text-xl font-bold text-gray-900">{{ title }}</h2>
      <NuxtLink
        v-if="to"
        :to="to"
        class="text-sm font-medium text-gray-500 hover:text-[#ff9900] transition-colors whitespace-nowrap"
      >
        {{ linkLabel }}
      </NuxtLink>
    </div>
    <div class="mt-3 h-px bg-gray-200 relative">
      <span class="absolute left-0 -top-px h-0.5 w-24 bg-[#ff9900]"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ title: string; to?: string; linkLabel?: string }>(), {
  linkLabel: 'Tout voir',
})
</script>
