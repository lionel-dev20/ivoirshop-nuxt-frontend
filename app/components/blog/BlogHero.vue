<!-- components/blog/BlogHero.vue -->
<!-- Bandeau d'accueil du blog. Entièrement piloté depuis WordPress via le
     plugin IvoirShop Homepage Manager (onglet "Blog"). Les valeurs par défaut
     ci-dessous s'appliquent tant que rien n'a été saisi. -->
<template>
  <section
    v-if="enabled"
    class="rounded-md overflow-hidden"
    :style="{ backgroundColor: hero.bgColor || '#e8f4f1' }"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 items-center gap-6 px-6 py-10 md:px-12 md:py-14">
      <div>
        <h1 class="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-gray-900 leading-tight">
          {{ hero.title }}
        </h1>
        <p v-if="hero.text" class="mt-4 text-base text-gray-700 leading-relaxed max-w-md">
          {{ hero.text }}
        </p>

        <div v-if="hero.primaryLabel || hero.secondaryLabel" class="mt-7 flex flex-wrap gap-3">
          <NuxtLink
            v-if="hero.primaryLabel"
            :to="hero.primaryLink || '#derniers-articles'"
            class="inline-flex items-center px-5 py-2.5 rounded-md bg-gray-900 hover:bg-black text-white text-sm font-semibold transition-colors"
          >
            {{ hero.primaryLabel }}
          </NuxtLink>
          <NuxtLink
            v-if="hero.secondaryLabel"
            :to="hero.secondaryLink || '/auth/signup'"
            class="inline-flex items-center px-5 py-2.5 rounded-md border border-gray-900/20 bg-white/60 hover:bg-white text-gray-900 text-sm font-semibold transition-colors"
          >
            {{ hero.secondaryLabel }}
          </NuxtLink>
        </div>
      </div>

      <div v-if="hero.image" class="hidden md:block">
        <img :src="hero.image" :alt="hero.title" class="w-full h-auto max-h-72 object-contain ml-auto" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const DEFAULT_HERO = {
  enabled: '1',
  title: 'Le blog IvoirShop',
  text: 'Conseils d’achat, guides d’utilisation et actualités de nos produits. Tout pour acheter au bon prix en Côte d’Ivoire.',
  primaryLabel: 'Lire les articles',
  primaryLink: '#derniers-articles',
  secondaryLabel: 'Créer un compte',
  secondaryLink: '/auth/signup',
  image: '',
  bgColor: '#e8f4f1',
}

const { section } = useHomepageConfig()

const hero = computed(() => ({
  ...DEFAULT_HERO,
  ...(section('blog', 'hero', {}) as Record<string, any>),
}))

const enabled = computed(() => String(hero.value.enabled) !== '0')
</script>
