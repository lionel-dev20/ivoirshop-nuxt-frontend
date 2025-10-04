<template>
  <div class="relative w-full h-48 bg-gray-200 rounded-md overflow-hidden">
    <!-- Image principale - affichage direct sans spinner -->
    <img
      v-if="!imageError"
      :src="finalImageUrl"
      :alt="alt"
      class="w-full h-full object-cover transition-transform hover:scale-105"
      loading="lazy"
      @error="handleImageError"
      @load="handleImageLoad"
      style="min-height: 192px; max-height: 192px;"
    />
    
    <!-- Placeholder d'erreur -->
    <div v-if="imageError" class="absolute inset-0 bg-gray-200 flex flex-col items-center justify-center text-gray-500">
      <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span class="text-xs">Image non disponible</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  src: string | string[] | Array<{id: number, src: string, alt: string}> | null | undefined
  alt: string
  fallbackSrc?: string
}

const props = withDefaults(defineProps<Props>(), {
  fallbackSrc: '/images/placeholder-product.jpg'
})

const imageError = ref(false)

// Calculer l'URL finale de l'image
const finalImageUrl = computed(() => {
  console.log('=== ProductImage URL Debug ===')
  console.log('Props src:', props.src)
  console.log('Image error:', imageError.value)
  
  if (imageError.value) {
    console.log('Using fallback due to error')
    return props.fallbackSrc
  }
  
  // Si src est une string
  if (typeof props.src === 'string' && props.src && props.src !== '/images/placeholder-product.jpg') {
    console.log('Using string src:', props.src)
    return props.src
  }
  
  // Si src est un tableau
  if (Array.isArray(props.src) && props.src.length > 0) {
    const firstImage = props.src[0]
    console.log('First image from array:', firstImage)
    
    if (typeof firstImage === 'string' && firstImage !== '/images/placeholder-product.jpg') {
      console.log('Using string from array:', firstImage)
      return firstImage
    }
    if (typeof firstImage === 'object' && firstImage?.src && firstImage.src !== '/images/placeholder-product.jpg') {
      console.log('Using object src from array:', firstImage.src)
      return firstImage.src
    }
  }
  
  // Si aucune image valide, utiliser une image de test comme fallback
  const testImageUrl = `https://picsum.photos/300/200?random=${Math.floor(Math.random() * 1000)}`
  console.log('No valid image found, using test image as fallback:', testImageUrl)
  return testImageUrl
})

// Émettre des événements
const emit = defineEmits<{
  imageLoaded: []
}>()

const handleImageLoad = () => {
  imageError.value = false
  console.log('Image loaded successfully:', finalImageUrl.value)
  
  // Émettre un événement pour notifier que l'image est chargée
  emit('imageLoaded')
}

const handleImageError = () => {
  console.log('Image failed to load:', finalImageUrl.value)
  imageError.value = true
}

// Reset states when src changes
watch(() => props.src, () => {
  imageError.value = false
})
</script>
