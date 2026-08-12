<!-- components/blog/PostMeta.vue -->
<!-- Ligne d'informations sous un titre d'article : auteur, date, temps de lecture. -->
<template>
  <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-gray-500" :class="sizeClass">
    <span v-if="showAuthor" class="font-medium text-gray-700">{{ post.author }}</span>
    <span v-if="showAuthor && post.category" class="text-gray-300">·</span>
    <NuxtLink
      v-if="post.category"
      :to="`/blog/categorie/${post.category.slug}`"
      class="hover:text-[#ff9900] transition-colors"
    >
      {{ post.category.name }}
    </NuxtLink>

    <span class="w-full sm:w-auto sm:contents">
      <span class="hidden sm:inline text-gray-300">·</span>
      <time :datetime="post.date">{{ formatDateShort(post.date) }}</time>
      <span class="text-gray-300">·</span>
      <span>{{ formatReadingTime(post.readingTime) }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import type { BlogPost } from '~/composables/useBlog'

const props = withDefaults(
  defineProps<{
    post: BlogPost
    showAuthor?: boolean
    size?: 'xs' | 'sm'
  }>(),
  { showAuthor: true, size: 'sm' }
)

const { formatDateShort, formatReadingTime } = useBlog()

const sizeClass = computed(() => (props.size === 'xs' ? 'text-[11px]' : 'text-xs'))
</script>
