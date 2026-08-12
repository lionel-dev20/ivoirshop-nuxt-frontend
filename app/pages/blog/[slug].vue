<!-- pages/blog/[slug].vue -->
<template>
  <div class="max-w-[1100px] mx-auto md:p-6 p-3">
    <!-- Fil d'Ariane -->
    <nav class="text-xs text-gray-500 mb-5 flex flex-wrap items-center gap-1.5">
      <NuxtLink to="/" class="hover:text-[#ff9900] transition-colors">Accueil</NuxtLink>
      <span class="text-gray-300">/</span>
      <NuxtLink to="/blog" class="hover:text-[#ff9900] transition-colors">Blog</NuxtLink>
      <template v-if="post?.category">
        <span class="text-gray-300">/</span>
        <NuxtLink
          :to="`/blog/categorie/${post.category.slug}`"
          class="hover:text-[#ff9900] transition-colors"
        >
          {{ post.category.name }}
        </NuxtLink>
      </template>
    </nav>

    <article v-if="post" class="bg-white border border-gray-100 rounded-md shadow-sm shadow-slate-100 overflow-hidden">
      <img
        v-if="post.image"
        :src="post.image"
        :alt="post.imageAlt"
        class="w-full h-56 md:h-96 object-cover bg-gray-100"
      />

      <div class="p-5 md:p-10">
        <span
          v-if="post.category"
          class="inline-block text-[11px] font-semibold uppercase tracking-wide text-[#ff9900] mb-3"
        >
          {{ post.category.name }}
        </span>

        <h1 class="text-2xl md:text-4xl font-bold text-gray-900 leading-tight">{{ post.title }}</h1>

        <div class="mt-4 pb-6 border-b border-gray-100 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-gray-500">
          <span class="font-medium text-gray-700">{{ post.author }}</span>
          <span class="text-gray-300">·</span>
          <time :datetime="post.date">{{ formatDate(post.date) }}</time>
          <span class="text-gray-300">·</span>
          <span>{{ formatReadingTime(post.readingTime) }}</span>
        </div>

        <!-- Contenu WordPress -->
        <div class="post-content mt-8" v-html="post.content"></div>

        <!-- Partage -->
        <div class="mt-10 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-3">
          <span class="text-sm font-semibold text-gray-700">Partager :</span>
          <a
            :href="`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + canonicalUrl)}`"
            target="_blank"
            rel="noopener noreferrer"
            class="px-3 py-1.5 text-xs font-semibold rounded-md border border-gray-200 hover:border-[#ff9900] hover:text-[#ff9900] transition-colors"
          >
            WhatsApp
          </a>
          <a
            :href="`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(canonicalUrl)}`"
            target="_blank"
            rel="noopener noreferrer"
            class="px-3 py-1.5 text-xs font-semibold rounded-md border border-gray-200 hover:border-[#ff9900] hover:text-[#ff9900] transition-colors"
          >
            Facebook
          </a>
          <a
            :href="`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(canonicalUrl)}`"
            target="_blank"
            rel="noopener noreferrer"
            class="px-3 py-1.5 text-xs font-semibold rounded-md border border-gray-200 hover:border-[#ff9900] hover:text-[#ff9900] transition-colors"
          >
            X
          </a>
        </div>
      </div>
    </article>

    <!-- À lire ensuite -->
    <section v-if="related.length" class="mt-12">
      <BlogSectionTitle title="À lire ensuite" to="/blog" link-label="Tous les articles" />
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <BlogPostCard v-for="item in related" :key="item.id" :post="item" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { BlogPost, BlogPostFull } from '~/composables/useBlog'

const route = useRoute()
const slug = computed(() => String(route.params.slug || ''))

const { formatDate, formatReadingTime } = useBlog()

const { data, error } = await useFetch<{ success: boolean; post: BlogPostFull; related: BlogPost[] }>(
  () => `/api/wordpress/post/${slug.value}`
)

// Article introuvable : vraie 404 (importante pour le référencement).
if (error.value || !data.value?.post) {
  throw createError({ statusCode: 404, statusMessage: 'Article introuvable', fatal: true })
}

const post = computed(() => data.value?.post ?? null)
const related = computed(() => data.value?.related ?? [])

const runtime = useRuntimeConfig()
const siteUrl = (runtime.public.SITE_URL as string) || 'https://ivoirshop.ci'
const canonicalUrl = computed(() => `${siteUrl}/blog/${slug.value}`)

useSeoMeta({
  title: () => `${post.value?.title ?? 'Article'} — Blog IvoirShop`,
  description: () => post.value?.excerpt ?? '',
  ogTitle: () => post.value?.title ?? '',
  ogDescription: () => post.value?.excerpt ?? '',
  ogImage: () => post.value?.image ?? '',
  ogType: 'article',
  ogUrl: () => canonicalUrl.value,
  articlePublishedTime: () => post.value?.date ?? '',
  articleModifiedTime: () => post.value?.modified ?? '',
})

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl.value }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() =>
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.value?.title,
          image: post.value?.image ? [post.value.image] : undefined,
          datePublished: post.value?.date,
          dateModified: post.value?.modified || post.value?.date,
          author: { '@type': 'Person', name: post.value?.author },
          publisher: {
            '@type': 'Organization',
            name: 'IvoirShop',
            logo: { '@type': 'ImageObject', url: `${siteUrl}/logo/ivoirshopci-coteivoir.png` },
          },
          mainEntityOfPage: canonicalUrl.value,
        })
      ),
    },
  ],
})
</script>

<style scoped>
@reference "~/assets/css/tailwind.css";

/* Mise en forme du HTML produit par l'éditeur WordPress.
   Écrit à la main : le plugin @tailwindcss/typography n'est pas installé. */
.post-content :deep(p) {
  @apply text-[15px] md:text-base text-gray-700 leading-[1.8] mb-5;
}
.post-content :deep(h2) {
  @apply text-xl md:text-2xl font-bold text-gray-900 mt-10 mb-4;
}
.post-content :deep(h3) {
  @apply text-lg md:text-xl font-bold text-gray-900 mt-8 mb-3;
}
.post-content :deep(h4) {
  @apply text-base font-bold text-gray-900 mt-6 mb-2;
}
.post-content :deep(a) {
  @apply text-[#ff9900] underline underline-offset-2 hover:text-[#e68a00];
}
.post-content :deep(ul) {
  @apply list-disc pl-6 mb-5 space-y-2 text-gray-700;
}
.post-content :deep(ol) {
  @apply list-decimal pl-6 mb-5 space-y-2 text-gray-700;
}
.post-content :deep(blockquote) {
  @apply border-l-4 border-[#ff9900] pl-4 italic text-gray-600 my-6;
}
.post-content :deep(img) {
  @apply rounded-md my-6 max-w-full h-auto mx-auto;
}
.post-content :deep(figure) {
  @apply my-6;
}
.post-content :deep(figcaption) {
  @apply text-xs text-gray-500 text-center mt-2;
}
.post-content :deep(table) {
  @apply w-full text-sm border-collapse my-6;
}
.post-content :deep(th),
.post-content :deep(td) {
  @apply border border-gray-200 px-3 py-2 text-left;
}
.post-content :deep(th) {
  @apply bg-gray-50 font-semibold;
}
.post-content :deep(pre) {
  @apply bg-gray-900 text-gray-100 rounded-md p-4 overflow-x-auto text-sm my-6;
}
.post-content :deep(code) {
  @apply bg-gray-100 rounded px-1.5 py-0.5 text-sm;
}
.post-content :deep(pre code) {
  @apply bg-transparent p-0;
}
.post-content :deep(iframe) {
  @apply w-full aspect-video rounded-md my-6;
}
</style>
