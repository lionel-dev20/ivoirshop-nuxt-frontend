<!-- pages/blog/index.vue -->
<template>
  <div class="max-w-[1440px] mx-auto md:p-6 p-3">
    <BlogSkeleton v-if="pending" />

    <template v-else>
      <BlogHero />

      <!-- Aucun article publié (ou WordPress injoignable) -->
      <div v-if="isEmpty" class="mt-10">
        <BlogEmptyState />
      </div>

      <template v-else>
        <div v-if="featured.length" class="mt-12">
          <BlogFeaturedGrid :posts="featured" :title="featuredTitle" />
        </div>

        <div id="derniers-articles" class="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 scroll-mt-24">
          <!-- Derniers articles -->
          <div class="lg:col-span-8">
            <BlogSectionTitle :title="latestTitle" />

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <BlogPostCard v-for="post in latest" :key="post.id" :post="post" />
            </div>

            <p v-if="!latest.length" class="text-sm text-gray-500">
              Aucun autre article pour le moment.
            </p>

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
          </div>

          <!-- Articles populaires -->
          <aside class="lg:col-span-4">
            <BlogPopularPosts :posts="popular" :title="popularTitle" />
          </aside>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { BlogPost } from '~/composables/useBlog'

interface BlogPayload {
  success: boolean
  featured: BlogPost[]
  latest: BlogPost[]
  popular: BlogPost[]
  total: number
  totalPages: number
}

const PER_PAGE = 6

const { section } = useHomepageConfig()
const featuredTitle = computed(() => section('blog', 'featuredTitle', 'À la une') as string)
const latestTitle = computed(() => section('blog', 'latestTitle', 'Derniers articles') as string)
const popularTitle = computed(() => section('blog', 'popularTitle', 'Articles populaires') as string)

const { data, pending } = await useFetch<BlogPayload>('/api/wordpress/blog', {
  query: { latest: PER_PAGE },
  default: () => ({ success: false, featured: [], latest: [], popular: [], total: 0, totalPages: 0 }),
})

const featured = computed(() => data.value?.featured ?? [])
const popular = computed(() => data.value?.popular ?? [])

// Les articles chargés via "Charger plus" s'ajoutent à ceux du rendu initial.
const extraPosts = ref<BlogPost[]>([])
const latest = computed(() => [...(data.value?.latest ?? []), ...extraPosts.value])

const isEmpty = computed(
  () => featured.value.length === 0 && latest.value.length === 0 && popular.value.length === 0
)

const page = ref(1)
const loadingMore = ref(false)
const exhausted = ref(false)

const canLoadMore = computed(
  () => !exhausted.value && latest.value.length > 0 && latest.value.length < (data.value?.total ?? 0)
)

const loadMore = async () => {
  if (loadingMore.value) return
  loadingMore.value = true
  try {
    const next = page.value + 1
    const res = await $fetch<{ posts: BlogPost[] }>('/api/wordpress/posts', {
      query: {
        page: next,
        perPage: PER_PAGE,
        // Mêmes exclusions que le rendu initial, sinon les articles à la une
        // réapparaîtraient dans la pagination.
        exclude: featured.value.map((p) => p.id).join(','),
      },
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

const runtime = useRuntimeConfig()
const siteUrl = (runtime.public.SITE_URL as string) || 'https://ivoirshop.ci'

useSeoMeta({
  title: 'Blog IvoirShop — conseils d’achat et actualités',
  description:
    'Conseils d’achat, guides d’utilisation et actualités des produits électroménager, électronique et high-tech disponibles chez IvoirShop en Côte d’Ivoire.',
  ogTitle: 'Blog IvoirShop',
  ogDescription: 'Conseils d’achat, guides d’utilisation et actualités IvoirShop.',
  ogType: 'website',
  ogUrl: `${siteUrl}/blog`,
})

useHead({ link: [{ rel: 'canonical', href: `${siteUrl}/blog` }] })
</script>
