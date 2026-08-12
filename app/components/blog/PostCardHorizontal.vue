<!-- components/blog/PostCardHorizontal.vue -->
<!-- Carte horizontale : vignette à gauche, texte à droite.
     Colonne centrale de la section "À la une". -->
<template>
  <article class="group flex gap-4">
    <NuxtLink
      :to="postUrl(post)"
      class="flex-shrink-0 overflow-hidden rounded-md bg-gray-100"
      :class="compact ? 'w-20 h-20' : 'w-28 h-24 sm:w-36 sm:h-28'"
    >
      <img
        v-if="post.image"
        :src="post.image"
        :alt="post.imageAlt"
        loading="lazy"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <span v-else class="w-full h-full flex items-center justify-center text-gray-300 text-[10px]">
        IvoirShop
      </span>
    </NuxtLink>

    <div class="min-w-0 flex-1">
      <NuxtLink :to="postUrl(post)">
        <h3
          class="font-bold text-gray-900 leading-snug group-hover:text-[#ff9900] transition-colors line-clamp-3"
          :class="compact ? 'text-sm' : 'text-base'"
        >
          {{ post.title }}
        </h3>
      </NuxtLink>

      <p v-if="!compact && post.excerpt" class="mt-1 text-sm text-gray-600 line-clamp-1">
        {{ post.excerpt }}
      </p>

      <BlogPostMeta :post="post" size="xs" class="mt-2" />
    </div>
  </article>
</template>

<script setup lang="ts">
import type { BlogPost } from '~/composables/useBlog'

defineProps<{ post: BlogPost; compact?: boolean }>()

const { postUrl } = useBlog()
</script>
