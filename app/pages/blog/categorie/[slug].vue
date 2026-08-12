<!-- pages/blog/categorie/[slug].vue -->
<!-- Liste des articles d'une catégorie WordPress. -->
<template>
  <div class="max-w-[1440px] mx-auto md:p-6 p-3">
    <nav class="text-xs text-gray-500 mb-5 flex flex-wrap items-center gap-1.5">
      <NuxtLink to="/" class="hover:text-[#ff9900] transition-colors">Accueil</NuxtLink>
      <span class="text-gray-300">/</span>
      <NuxtLink to="/blog" class="hover:text-[#ff9900] transition-colors">Blog</NuxtLink>
      <span class="text-gray-300">/</span>
      <span class="text-gray-700">{{ categoryName }}</span>
    </nav>

    <BlogSectionTitle :title="categoryName" to="/blog" link-label="Tous les articles" />

    <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
      <div v-for="i in 6" :key="i">
        <div class="h-48 bg-gray-200 rounded-md"></div>
        <div class="h-4 bg-gray-200 rounded w-3/4 mt-4"></div>
        <div class="h-3 bg-gray-200 rounded w-1/2 mt-3"></div>
      </div>
    </div>

    <template v-else>
      <div v-if="posts.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <BlogPostCard v-for="post in posts" :key="post.id" :post="post" />
      </div>

      <BlogEmptyState
        v-else
        title="Aucun article dans cette rubrique"
        message="Cette rubrique ne contient pas encore d’article publié. Consultez les autres articles du blog en attendant."
      />

      <div v-if="canLoadMore" class="mt-8 text-center">
        <button
          type="button"
          :disabled="loadingMore"
          class="inline-flex items-center px-6 py-2.5 rounded-md border border-gray-300 bg-white hover:border-[#ff9900] hover:text-[#ff9900] text-sm font-semibold text-gray-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          @click="loadMore"
        >
          {{ loadingMore ? 'Chargement…' : 'Charger plus d’articles' }}
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { BlogPost } from '~/composables/useBlog'

const PER_PAGE = 9

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))

const { data, pending } = await useFetch<{ posts: BlogPost[]; total: number }>(
  '/api/wordpress/posts',
  {
    query: computed(() => ({ category: slug.value, perPage: PER_PAGE, page: 1 })),
    default: () => ({ posts: [], total: 0 }),
  }
)

const extraPosts = ref<BlogPost[]>([])
const posts = computed(() => [...(data.value?.posts ?? []), ...extraPosts.value])

// Le nom lisible vient du 1er article ; à défaut on ré-humanise le slug.
const categoryName = computed(() => {
  const named = posts.value.find((p) => p.category?.slug === slug.value)?.category?.name
  if (named) return named
  return slug.value.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase())
})

const page = ref(1)
const loadingMore = ref(false)
const exhausted = ref(false)

const canLoadMore = computed(
  () => !exhausted.value && posts.value.length > 0 && posts.value.length < (data.value?.total ?? 0)
)

const loadMore = async () => {
  if (loadingMore.value) return
  loadingMore.value = true
  try {
    const next = page.value + 1
    const res = await $fetch<{ posts: BlogPost[] }>('/api/wordpress/posts', {
      query: { category: slug.value, perPage: PER_PAGE, page: next },
    })
    if (res?.posts?.length) {
      extraPosts.value.push(...res.posts)
      page.value = next
    } else {
      exhausted.value = true
    }
  } catch {
    exhausted.value = true
  } finally {
    loadingMore.value = false
  }
}

// Changement de catégorie sans démontage du composant : on repart de zéro.
watch(slug, () => {
  extraPosts.value = []
  page.value = 1
  exhausted.value = false
})

const runtime = useRuntimeConfig()
const siteUrl = (runtime.public.SITE_URL as string) || 'https://ivoirshop.ci'

useSeoMeta({
  title: () => `${categoryName.value} — Blog IvoirShop`,
  description: () => `Tous les articles du blog IvoirShop dans la rubrique ${categoryName.value}.`,
})

useHead({ link: [{ rel: 'canonical', href: `${siteUrl}/blog/categorie/${slug.value}` }] })
</script>
