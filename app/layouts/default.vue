<!-- layouts/default.vue -->
<template>
  <div
    :class="wrapperClass"
    :style="isIndexPage ? backgroundStyle : {}"
  >
    <TopBanner />
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
    <CartSidebar />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const isIndexPage = computed(() => route.path === '/')

// Fond de la page d'accueil piloté par WordPress (plugin Homepage Manager).
const { section } = useHomepageConfig()

const backgroundStyle = computed<Record<string, string>>(() => {
  const bg = section('background', null, { type: 'color', color: '#f56100' }) as any
  if (!bg || bg.type === 'none') return {}
  if (bg.type === 'color' && bg.color) {
    return { backgroundColor: bg.color }
  }
  if (bg.type === 'image' && bg.image) {
    return {
      backgroundImage: `url('${bg.image}')`,
      backgroundSize: bg.size || 'cover',
      backgroundRepeat: bg.repeat || 'no-repeat',
      backgroundPosition: 'center',
    }
  }
  return {}
})

const wrapperClass = computed(() => {
  const base = 'min-h-screen flex flex-col'
  if (!isIndexPage.value) return `${base} bg-gray-50`
  // Sur la home : si un fond personnalisé est appliqué en style inline, on ne
  // met pas de classe de fond ; sinon on garde l'orange historique par défaut.
  const hasCustomBg = Object.keys(backgroundStyle.value).length > 0
  return hasCustomBg ? base : `${base} bg-[#f56100]`
})
</script>

<style scoped>
/* Background image désactivé */
</style>