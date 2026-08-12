<!-- components/blog/PopularPosts.vue -->
<!-- Colonne "Articles populaires" : liste numérotée 01 → 05.
     Le classement vient du nombre de commentaires (calculé côté serveur). -->
<template>
  <div>
    <BlogSectionTitle :title="title" />

    <ol v-if="posts.length" class="space-y-6">
      <li v-for="(post, index) in posts" :key="post.id" class="group flex gap-4">
        <span class="text-3xl md:text-4xl font-bold text-gray-200 leading-none tabular-nums select-none">
          {{ String(index + 1).padStart(2, '0') }}
        </span>

        <div class="min-w-0 flex-1">
          <NuxtLink :to="postUrl(post)">
            <h3
              class="text-sm md:text-base font-bold text-gray-900 leading-snug group-hover:text-[#ff9900] transition-colors line-clamp-2"
            >
              {{ post.title }}
            </h3>
          </NuxtLink>
          <BlogPostMeta :post="post" size="xs" class="mt-1.5" />
        </div>
      </li>
    </ol>

    <p v-else class="text-sm text-gray-500">Aucun article pour le moment.</p>
  </div>
</template>

<script setup lang="ts">
import type { BlogPost } from '~/composables/useBlog'

withDefaults(defineProps<{ posts: BlogPost[]; title?: string }>(), {
  title: 'Articles populaires',
})

const { postUrl } = useBlog()
</script>
