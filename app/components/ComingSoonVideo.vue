<!-- components/ComingSoonVideo.vue -->
<template>
  <div class="relative w-full h-full">
    <!-- Vidéo principale -->
    <video
      v-if="!videoError && !isMobile"
      ref="videoElement"
      class="w-full h-full object-cover"
      autoplay
      muted
      loop
      playsinline
      @error="handleVideoError"
      @loadstart="onVideoLoadStart"
      @canplay="onVideoCanPlay"
    >
      <source :src="videoSrc" type="video/mp4" />
    </video>
    
    <!-- Fallback pour mobile ou erreur vidéo -->
    <div
      v-else
      class="w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden"
    >
      <!-- Animation de particules -->
      <div class="absolute inset-0">
        <div
          v-for="i in 50"
          :key="i"
          class="absolute w-2 h-2 bg-white bg-opacity-20 rounded-full animate-pulse"
          :style="{
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            animationDelay: Math.random() * 3 + 's',
            animationDuration: (2 + Math.random() * 3) + 's'
          }"
        ></div>
      </div>
      
      <!-- Icônes flottantes -->
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="text-center">
          <div class="text-6xl mb-4 animate-bounce">🛒</div>
          <div class="text-4xl mb-2 animate-pulse">📱</div>
          <div class="text-5xl animate-pulse">💎</div>
        </div>
      </div>
      
      <!-- Overlay gradient animé -->
      <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white via-transparent opacity-10 animate-shimmer"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const props = defineProps<{
  videoSrc?: string
}>()

const videoElement = ref<HTMLVideoElement | null>(null)
const videoError = ref(false)
const isMobile = ref(false)

// Sources de vidéos de démonstration (vous pouvez les remplacer par vos propres vidéos)
const defaultVideoSrc = computed(() => {
  return props.videoSrc || 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
})

// Détection mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

// Gestion des événements vidéo
const handleVideoError = () => {
  videoError.value = true
}

const onVideoLoadStart = () => {
  // Vidéo en cours de chargement
}

const onVideoCanPlay = () => {
  if (videoElement.value) {
    videoElement.value.play().catch(() => {})
  }
}

// Initialisation
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  
  // Essayer de jouer la vidéo après un délai
  setTimeout(() => {
    if (videoElement.value && !videoError.value && !isMobile.value) {
      videoElement.value.play().catch(() => {
        videoError.value = true
      })
    }
  }, 1000)
})
</script>

<style scoped>
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 3s ease-in-out infinite;
}

/* Amélioration de l'animation des particules */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
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
    opacity: .5;
  }
}
</style>




