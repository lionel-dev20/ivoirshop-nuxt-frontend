<template>
    <div class="dual-banner-slider">
      <!-- État de chargement -->
      <div v-if="pending" class="loading-state">
        <div class="skeleton-banners">
          <div class="skeleton-banner">
            <div class="skeleton-image"></div>
            <div class="skeleton-content">
              <div class="skeleton-line skeleton-title"></div>
              <div class="skeleton-line skeleton-subtitle"></div>
              <div class="skeleton-line skeleton-button"></div>
            </div>
          </div>
          <div class="skeleton-banner">
            <div class="skeleton-image"></div>
            <div class="skeleton-content">
              <div class="skeleton-line skeleton-title"></div>
              <div class="skeleton-line skeleton-subtitle"></div>
              <div class="skeleton-line skeleton-button"></div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- État d'erreur -->
      <div v-else-if="error" class="error-state">
        <div class="error-content">
          <Icon name="alert-triangle" class="error-icon" />
          <h3>Erreur de chargement</h3>
          <p>{{ error.message || 'Impossible de charger les bannières' }}</p>
          <button @click="refreshBanners" class="retry-button">
            <Icon name="refresh-cw" />
            Réessayer
          </button>
        </div>
      </div>
  
      <!-- Bannières côte à côte -->
      <div v-else-if="displayBanners.length > 0" class="banners-container">
        <div 
          v-for="(banner, index) in displayBanners.slice(0, 2)" 
          :key="banner.id"
          class="banner-item"
          :class="[
            `banner-${index + 1}`,
            `position-${banner.position}`,
            { 'has-image': banner.image?.url }
          ]"
          :style="bannerStyles(banner)"
          @click="handleBannerClick(banner)"
          @mouseenter="pauseAutoRotation"
          @mouseleave="resumeAutoRotation"
        >
          <!-- Image de fond -->
          <div v-if="banner.image?.url" class="banner-background">
            <img
              :src="banner.image.url"
              :alt="banner.image.alt || banner.title"
              class="banner-image"
              :loading="index < 2 ? 'eager' : 'lazy'"
              @error="handleImageError"
            />
            <div class="banner-overlay" :style="{ background: overlayGradient(banner) }"></div>
          </div>
  
          <!-- Contenu de la bannière -->
          <div class="banner-content" :class="`content-${banner.position}`">
            <!-- Badge/Tag optionnel -->
            <div v-if="banner.subtitle" class="banner-badge">
              {{ banner.subtitle }}
            </div>
  
            <!-- Titre principal -->
            <h2 class="banner-title" :style="{ color: banner.text_color }">
              {{ banner.title }}
            </h2>
  
            <!-- Description -->
            <div 
              v-if="banner.description" 
              class="banner-description"
              :style="{ color: banner.text_color }"
              v-html="sanitizedDescription(banner.description)"
            ></div>
  
            <!-- Bouton d'action -->
            <div v-if="banner.link_url && banner.button_text" class="banner-action">
              <component
                :is="isExternalLink(banner.link_url) ? 'a' : 'NuxtLink'"
                :href="isExternalLink(banner.link_url) ? banner.link_url : undefined"
                :to="!isExternalLink(banner.link_url) ? banner.link_url : undefined"
                :target="isExternalLink(banner.link_url) ? '_blank' : undefined"
                :rel="isExternalLink(banner.link_url) ? 'noopener noreferrer' : undefined"
                class="banner-button"
                :style="buttonStyles(banner)"
                @click.stop="trackBannerClick(banner)"
              >
                {{ banner.button_text }}
                <Icon 
                  v-if="isExternalLink(banner.link_url)" 
                  name="external-link" 
                  class="external-icon" 
                />
              </component>
            </div>
  
            <!-- Indicateurs de progression (si rotation activée) -->
            <div v-if="autoRotate && totalBanners > 2" class="banner-progress">
              <div 
                class="progress-bar" 
                :style="{ 
                  width: progressWidth + '%',
                  backgroundColor: banner.text_color || '#ffffff'
                }"
              ></div>
            </div>
          </div>
  
          <!-- Numéro de bannière -->
          <div v-if="showBannerNumbers" class="banner-number">
            {{ String(index + 1).padStart(2, '0') }}
          </div>
        </div>
      </div>
  
      <!-- État vide -->
      <div v-else class="empty-state">
        <div class="empty-content">
          <Icon name="image" class="empty-icon" />
          <h3>Aucune bannière disponible</h3>
          <p>Aucune bannière n'est actuellement configurée pour l'affichage.</p>
          <NuxtLink to="/admin" class="admin-link" v-if="showAdminLink">
            Configurer les bannières
          </NuxtLink>
        </div>
      </div>
  
      <!-- Navigation/pagination (si plus de 2 bannières) -->
      <div v-if="totalBanners > 2" class="banner-navigation">
        <div class="nav-dots">
          <button
            v-for="(pair, index) in bannerPairs"
            :key="index"
            @click="goToPair(index)"
            :class="{ active: currentPairIndex === index }"
            class="nav-dot"
            :aria-label="`Voir les bannières ${index * 2 + 1}-${Math.min((index + 1) * 2, totalBanners)}`"
          >
            <span class="dot-inner"></span>
          </button>
        </div>
        
        <div class="nav-controls">
          <button 
            @click="previousPair"
            :disabled="currentPairIndex <= 0"
            class="nav-button nav-prev"
            aria-label="Bannières précédentes"
          >
            <Icon name="chevron-left" />
          </button>
          
          <span class="nav-counter">
            {{ currentPairIndex + 1 }} / {{ bannerPairs.length }}
          </span>
          
          <button 
            @click="nextPair"
            :disabled="currentPairIndex >= bannerPairs.length - 1"
            class="nav-button nav-next"
            aria-label="Bannières suivantes"
          >
            <Icon name="chevron-right" />
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import DOMPurify from 'isomorphic-dompurify'
  
  // Props du composant
  const props = defineProps({
    // Configuration de base
    limit: {
      type: Number,
      default: 10
    },
    autoRotate: {
      type: Boolean,
      default: true
    },
    rotationInterval: {
      type: Number,
      default: 8000 // 8 secondes
    },
    
    // Options d'affichage
    showBannerNumbers: {
      type: Boolean,
      default: false
    },
    showAdminLink: {
      type: Boolean,
      default: false
    },
    aspectRatio: {
      type: String,
      default: '16/9', // Peut être '16/9', '4/3', '1/1', etc.
      validator: (value) => /^\d+\/\d+$/.test(value)
    },
    
    // Styles personnalisés
    borderRadius: {
      type: String,
      default: '12px'
    },
    gap: {
      type: String,
      default: '20px'
    },
    overlayOpacity: {
      type: Number,
      default: 0.4,
      validator: (value) => value >= 0 && value <= 1
    }
  })
  
  // Configuration
  const config = useRuntimeConfig()
  const baseURL = config.public.wordpressUrl || 'http://localhost'
  
  // États réactifs
  const currentPairIndex = ref(0)
  const isRotationPaused = ref(false)
  const progressWidth = ref(0)
  const rotationTimer = ref(null)
  const progressTimer = ref(null)
  
  // Fetch des bannières
  const { 
    data: fetchedBanners, 
    pending, 
    error, 
    refresh: refreshBanners 
  } = await useLazyAsyncData(
    'homepage-banners',
    async () => {
      try {
        const response = await $fetch(`${baseURL}/wp-json/api/v1/banners?limit=${props.limit}&active_only=true`)
        return Array.isArray(response) ? response : []
      } catch (err) {
        console.error('Erreur lors du fetch des bannières:', err)
        throw err
      }
    },
    {
      default: () => [],
      server: false
    }
  )
  
  // Propriétés calculées
  const totalBanners = computed(() => fetchedBanners.value?.length || 0)
  
  const bannerPairs = computed(() => {
    if (!fetchedBanners.value?.length) return []
    
    const pairs = []
    for (let i = 0; i < fetchedBanners.value.length; i += 2) {
      pairs.push(fetchedBanners.value.slice(i, i + 2))
    }
    return pairs
  })
  
  const displayBanners = computed(() => {
    if (!bannerPairs.value.length) return []
    return bannerPairs.value[currentPairIndex.value] || []
  })
  
  // Méthodes de style
  const bannerStyles = (banner) => {
    return {
      backgroundColor: banner.background_color || '#f0f0f0',
      borderRadius: props.borderRadius,
      aspectRatio: props.aspectRatio,
      cursor: banner.link_url ? 'pointer' : 'default'
    }
  }
  
  const buttonStyles = (banner) => {
    return {
      borderColor: banner.text_color || '#ffffff',
      color: banner.text_color || '#ffffff',
      backgroundColor: `rgba(255, 255, 255, 0.1)`,
      backdropFilter: 'blur(10px)'
    }
  }
  
  const overlayGradient = (banner) => {
    const color = banner.background_color || '#000000'
    return `linear-gradient(135deg, ${color}${Math.round(props.overlayOpacity * 255).toString(16).padStart(2, '0')}, transparent 70%)`
  }
  
  // Méthodes utilitaires
  const sanitizedDescription = (description) => {
    if (!description) return ''
    return DOMPurify.sanitize(description, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'span'],
      ALLOWED_ATTR: ['style']
    })
  }
  
  const isExternalLink = (url) => {
    if (!url) return false
    try {
      const urlObj = new URL(url, window.location.origin)
      return urlObj.origin !== window.location.origin
    } catch {
      return false
    }
  }
  
  // Navigation
  const goToPair = (index) => {
    if (index >= 0 && index < bannerPairs.value.length) {
      currentPairIndex.value = index
      resetProgress()
    }
  }
  
  const nextPair = () => {
    const nextIndex = (currentPairIndex.value + 1) % bannerPairs.value.length
    goToPair(nextIndex)
  }
  
  const previousPair = () => {
    const prevIndex = (currentPairIndex.value - 1 + bannerPairs.value.length) % bannerPairs.value.length
    goToPair(prevIndex)
  }
  
  // Rotation automatique
  const startAutoRotation = () => {
    if (!props.autoRotate || bannerPairs.value.length <= 1) return
    
    stopAutoRotation()
    
    rotationTimer.value = setInterval(() => {
      if (!isRotationPaused.value) {
        nextPair()
      }
    }, props.rotationInterval)
    
    startProgress()
  }
  
  const stopAutoRotation = () => {
    if (rotationTimer.value) {
      clearInterval(rotationTimer.value)
      rotationTimer.value = null
    }
    stopProgress()
  }
  
  const pauseAutoRotation = () => {
    isRotationPaused.value = true
    stopProgress()
  }
  
  const resumeAutoRotation = () => {
    isRotationPaused.value = false
    if (props.autoRotate) {
      startProgress()
    }
  }
  
  // Barre de progression
  const startProgress = () => {
    stopProgress()
    progressWidth.value = 0
    
    const incrementTime = 50 // Mise à jour toutes les 50ms
    const totalTime = props.rotationInterval
    const increment = (100 / totalTime) * incrementTime
    
    progressTimer.value = setInterval(() => {
      if (!isRotationPaused.value) {
        progressWidth.value += increment
        if (progressWidth.value >= 100) {
          progressWidth.value = 100
          stopProgress()
        }
      }
    }, incrementTime)
  }
  
  const stopProgress = () => {
    if (progressTimer.value) {
      clearInterval(progressTimer.value)
      progressTimer.value = null
    }
  }
  
  const resetProgress = () => {
    progressWidth.value = 0
    if (props.autoRotate && !isRotationPaused.value) {
      startProgress()
    }
  }
  
  // Gestionnaires d'événements
  const emit = defineEmits(['banner-click', 'banner-view'])
  
  const handleBannerClick = (banner) => {
    if (!banner.link_url) {
      emit('banner-click', banner)
    }
  }
  
  const trackBannerClick = (banner) => {
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', 'banner_click', {
        banner_id: banner.id,
        banner_title: banner.title,
        banner_url: banner.link_url
      })
    }
    
    emit('banner-click', banner)
  }
  
  const handleImageError = (event) => {
    event.target.style.display = 'none'
    event.target.parentNode.classList.add('image-error')
  }
  
  // Support du clavier
  const handleKeydown = (event) => {
    if (event.key === 'ArrowLeft') {
      previousPair()
    } else if (event.key === 'ArrowRight') {
      nextPair()
    }
  }
  
  // Lifecycle hooks
  onMounted(() => {
    if (props.autoRotate) {
      startAutoRotation()
    }
    
    // Support clavier
    document.addEventListener('keydown', handleKeydown)
    
    // Émission d'événement de vue
    if (displayBanners.value.length > 0) {
      emit('banner-view', displayBanners.value)
    }
  })
  
  onUnmounted(() => {
    stopAutoRotation()
    document.removeEventListener('keydown', handleKeydown)
  })
  
  // Watchers
  watch(displayBanners, (newBanners) => {
    if (newBanners.length > 0) {
      emit('banner-view', newBanners)
    }
  }, { deep: true })
  
  watch(() => props.autoRotate, (newValue) => {
    if (newValue) {
      startAutoRotation()
    } else {
      stopAutoRotation()
    }
  })
  </script>
  
  <style>

 @reference "~/assets/css/tailwind.css";

  .dual-banner-slider {
    @apply w-full;
  }
  
  /* États de chargement */
  .loading-state {
    @apply mb-8;
  }
  
  .skeleton-banners {
    @apply grid grid-cols-1 lg:grid-cols-2 gap-5;
  }
  
  .skeleton-banner {
    @apply relative overflow-hidden rounded-xl;
    aspect-ratio: v-bind(aspectRatio);
  }
  
  .skeleton-image {
    @apply absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse;
  }
  
  .skeleton-content {
    @apply absolute bottom-0 left-0 right-0 p-6 space-y-3;
  }
  
  .skeleton-line {
    @apply bg-gray-300 rounded animate-pulse;
  }
  
  .skeleton-title {
    @apply h-6 w-3/4;
  }
  
  .skeleton-subtitle {
    @apply h-4 w-1/2;
  }
  
  .skeleton-button {
    @apply h-10 w-32;
  }
  
  /* États d'erreur et vides */
  .error-state,
  .empty-state {
    @apply flex justify-center items-center py-16;
  }
  
  .error-content,
  .empty-content {
    @apply text-center max-w-md;
  }
  
  .error-icon,
  .empty-icon {
    @apply w-16 h-16 mx-auto mb-6 text-gray-400;
  }
  
  .error-content h3,
  .empty-content h3 {
    @apply text-xl font-semibold text-gray-900 mb-4;
  }
  
  .error-content p,
  .empty-content p {
    @apply text-gray-600 mb-6;
  }
  
  .retry-button,
  .admin-link {
    @apply inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors;
  }
  
  /* Container principal des bannières */
  .banners-container {
    @apply grid grid-cols-1 lg:grid-cols-2 mb-8;
    gap: v-bind(gap);
  }
  
  /* Bannière individuelle */
  .banner-item {
    @apply relative overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl;
    border-radius: v-bind(borderRadius);
    aspect-ratio: v-bind(aspectRatio);
  }
  
  .banner-item:hover {
    @apply shadow-2xl;
  }
  
  /* Image de fond */
  .banner-background {
    @apply absolute inset-0;
  }
  
  .banner-image {
    @apply w-full h-full object-cover transition-transform duration-700;
  }
  
  .banner-item:hover .banner-image {
    @apply scale-110;
  }
  
  .banner-overlay {
    @apply absolute inset-0;
  }
  
  .image-error::after {
    content: 'Image non disponible';
    @apply absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500;
  }
  
  /* Contenu de la bannière */
  .banner-content {
    @apply absolute inset-0 flex flex-col justify-end p-6 lg:p-8;
  }
  
  .content-center {
    @apply justify-center items-center text-center;
  }
  
  .content-right {
    @apply items-end text-right;
  }
  
  .content-left {
    @apply items-start text-left;
  }
  
  /* Badge/Tag */
  .banner-badge {
    @apply inline-block px-3 py-1 bg-white bg-black/20 backdrop-blur-sm rounded-full text-sm font-medium mb-4;
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
  
  /* Titre */
  .banner-title {
    @apply text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 leading-tight;
    text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }
  
  /* Description */
  .banner-description {
    @apply text-sm lg:text-base mb-6 leading-relaxed opacity-90 max-w-md;
    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  }
  
  /* Bouton d'action */
  .banner-action {
    @apply mb-4;
  }
  
  .banner-button {
    @apply inline-flex items-center gap-2 px-6 py-3 border-2 rounded-full font-semibold transition-all duration-300 hover:bg-white hover:bg-black/20 hover:backdrop-blur-md hover:transform hover:scale-105;
    text-shadow: none;
  }
  
  .external-icon {
    @apply w-4 h-4;
  }
  
  /* Barre de progression */
  .banner-progress {
    @apply w-full h-1 bg-white bg-black/20 rounded-full overflow-hidden;
  }
  
  .progress-bar {
    @apply h-full transition-all duration-100 ease-linear rounded-full;
  }
  
  /* Numéro de bannière */
  .banner-number {
    @apply absolute top-4 right-4 w-10 h-10 bg-black bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-sm;
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
  
  /* Navigation */
  .banner-navigation {
    @apply flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg;
  }
  
  .nav-dots {
    @apply flex items-center gap-2;
  }
  
  .nav-dot {
    @apply w-3 h-3 rounded-full transition-all duration-300 hover:scale-125;
  }
  
  .nav-dot .dot-inner {
    @apply w-full h-full rounded-full bg-gray-400 transition-all duration-300;
  }
  
  .nav-dot.active .dot-inner,
  .nav-dot:hover .dot-inner {
    @apply bg-blue-600 scale-125;
  }
  
  .nav-controls {
    @apply flex items-center gap-4;
  }
  
  .nav-button {
    @apply w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed;
  }
  
  .nav-counter {
    @apply text-sm font-medium text-gray-600;
  }
  
  /* Responsive Design */
  @media (max-width: 1024px) {
    .banners-container {
      @apply grid-cols-1 gap-4;
    }
    
    .banner-content {
      @apply p-4 lg:p-6;
    }
    
    .banner-title {
      @apply text-xl lg:text-2xl;
    }
    
    .banner-description {
      @apply text-sm mb-4;
    }
    
    .banner-button {
      @apply px-4 py-2 text-sm;
    }
  }
  
  @media (max-width: 640px) {
    .banner-content {
      @apply p-3;
    }
    
    .banner-title {
      @apply text-lg;
    }
    
    .banner-description {
      @apply text-xs mb-3;
    }
    
    .banner-button {
      @apply px-3 py-1.5 text-xs;
    }
    
    .nav-controls {
      @apply gap-2;
    }
  }
  
  /* Animations */
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .banner-content > * {
    animation: slideInUp 0.6s ease-out forwards;
  }
  
  .banner-content > *:nth-child(1) { animation-delay: 0.1s; }
  .banner-content > *:nth-child(2) { animation-delay: 0.2s; }
  .banner-content > *:nth-child(3) { animation-delay: 0.3s; }
  .banner-content > *:nth-child(4) { animation-delay: 0.4s; }
  
  /* Thème sombre */
  @media (prefers-color-scheme: dark) {
    .banner-navigation {
      @apply bg-gray-800;
    }
    
    .nav-counter {
      @apply text-gray-300;
    }
    
    .nav-button {
      @apply border-gray-600 text-gray-300 hover:border-blue-400 hover:text-blue-400;
    }
  }
  
  /* Focus states pour l'accessibilité */
  .banner-button:focus,
  .nav-button:focus,
  .nav-dot:focus {
    @apply outline-none ring-2 ring-blue-500 ring-offset-2;
  }
  
  .banner-item:focus-within {
    @apply ring-2 ring-blue-500 ring-offset-2;
  }
  </style>