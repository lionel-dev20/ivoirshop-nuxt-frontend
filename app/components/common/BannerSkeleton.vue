<template>
  <div :class="containerClass">
    <div
      v-for="(item, index) in count"
      :key="index"
      class="banner-skeleton"
      :class="skeletonClass"
    >
      <div class="skeleton-shimmer"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  count?: number
  variant?: 'single' | 'double' | 'carousel'
  height?: string
  width?: string
}

const props = withDefaults(defineProps<Props>(), {
  count: 1,
  variant: 'single',
  height: 'auto',
  width: '100%'
})

const containerClass = computed(() => {
  const base = 'flex'
  if (props.variant === 'double') {
    return `${base} flex-col md:flex-row gap-y-1 md:gap-y-0 md:gap-x-3 gap-x-0`
  }
  return base
})

const skeletonClass = computed(() => {
  const base = 'relative overflow-hidden bg-gray-200 rounded-[8px] animate-pulse'
  if (props.variant === 'double') {
    return `${base} flex-1`
  }
  return base
})

const skeletonStyle = computed(() => ({
  height: props.height,
  width: props.width
}))
</script>

<style scoped>
.banner-skeleton {
  min-height: 120px;
}

@media (min-width: 768px) {
  .banner-skeleton {
    min-height: 200px;
  }
}

.skeleton-shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>



