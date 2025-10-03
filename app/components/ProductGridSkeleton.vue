<template>
  <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-0.5 md:gap-3.5">
    <ProductCardSkeleton v-for="i in count" :key="i" />
  </div>
</template>

<script setup lang="ts">
interface Props {
  count?: number
}

withDefaults(defineProps<Props>(), {
  count: 8
})
</script>
