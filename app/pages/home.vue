


<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- Vidéo en arrière-plan -->
    <div class="absolute inset-0 z-0">
      <ComingSoonVideo />
      
      <!-- Overlay sombre pour la lisibilité -->
      <div class="absolute inset-0 bg-black bg-opacity-60"></div>
    </div>

    <!-- Contenu principal -->
    <div class="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <!-- Logo -->
      <div class="mb-8 animate-fade-in-up">
        <img
          src="/logo/ivoirshopci-coteivoir.png"
          alt="IvoirShop CI"
          class="h-20 w-auto mx-auto mb-4"
        />
        <h1 class="text-5xl md:text-7xl font-bold text-white mb-2">
          IvoirShop
          <span class="text-[#ff9900]">CI</span>
        </h1>
      </div>

      <!-- Message principal -->
      <div class="mb-12 animate-fade-in-up animation-delay-200">
        <h2 class="text-2xl md:text-4xl font-semibold text-white mb-4">
          Nous revenons très bientôt ! 🚀
        </h2>
        <p class="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
          Préparons pour vous les <strong class="text-[#ff9900]">meilleures offres du marché</strong> 
          avec des produits de qualité exceptionnelle et des prix imbattables !
        </p>
      </div>

      <!-- Compteur -->
      <div class="mb-12 animate-fade-in-up animation-delay-400">
        <div class="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 border border-white border-opacity-20">
          <h3 class="text-xl md:text-2xl font-semibold text-white mb-6">
            Ouverture dans :
          </h3>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div class="text-center">
              <div class="bg-[#ff9900] text-white text-3xl md:text-4xl font-bold rounded-lg py-4 px-2 min-w-[80px]">
                {{ timeLeft.days }}
              </div>
              <div class="text-[#ff9900] text-sm md:text-base mt-2 font-medium">Jours</div>
            </div>
            
            <div class="text-center">
              <div class="bg-[#ff9900] text-white text-3xl md:text-4xl font-bold rounded-lg py-4 px-2 min-w-[80px]">
                {{ timeLeft.hours }}
              </div>
              <div class="text-[#ff9900] text-sm md:text-base mt-2 font-medium">Heures</div>
            </div>
            
            <div class="text-center">
              <div class="bg-[#ff9900] text-white text-3xl md:text-4xl font-bold rounded-lg py-4 px-2 min-w-[80px]">
                {{ timeLeft.minutes }}
              </div>
              <div class="text-[#ff9900] text-sm md:text-base mt-2 font-medium">Minutes</div>
            </div>
            
            <div class="text-center">
              <div class="bg-[#ff9900] text-white text-3xl md:text-4xl font-bold rounded-lg py-4 px-2 min-w-[80px]">
                {{ timeLeft.seconds }}
              </div>
              <div class="text-[#ff9900] text-sm md:text-base mt-2 font-medium">Secondes</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulaire de notification -->
      <div class="mb-8 animate-fade-in-up animation-delay-600 max-w-md w-full">
        <div class="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 border border-white border-opacity-20">
          <div class="text-center mb-6">
            <h3 class="text-xl md:text-2xl font-semibold text-gray-700 mb-2">
              📱 Ne manquez pas ce grand événement !
            </h3>
            <p class="text-gray-700 text-sm md:text-base">
              Laissez votre numéro et soyez prévenu sur WhatsApp le jour d'ouverture
            </p>
          </div>

          <!-- Formulaire -->
          <form @submit.prevent="submitPhoneNumber" class="space-y-4">
            <div class="relative">
              <div class="flex items-center bg-white rounded-lg overflow-hidden">
                <div class="flex items-center px-4 py-3 bg-gray-100">
                  <span class="text-2xl mr-2">🇨🇮</span>
                  <span class="text-gray-600 font-medium">+225</span>
                </div>
                <input
                  v-model="phoneNumber"
                  type="tel"
                  placeholder="XX XX XX XX"
                  class="flex-1 px-4 py-3 border-0 focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-500"
                  maxlength="8"
                  @input="formatPhoneNumber"
                  required
                />
              </div>
              <p v-if="phoneError" class="text-red-300 text-sm mt-1">{{ phoneError }}</p>
            </div>

            <button
              type="submit"
              :disabled="loading || !phoneNumber"
              class="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <div v-if="loading" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              <span>{{ loading ? 'Enregistrement...' : 'Être notifié sur WhatsApp' }}</span>
            </button>
          </form>

          <!-- Message de succès -->
          <div v-if="successMessage" class="mt-4 p-4 bg-green-600 bg-opacity-20 border border-green-500 rounded-lg">
            <p class="text-green-300 text-sm text-center">
              ✅ {{ successMessage }}
            </p>
          </div>
        </div>
      </div>

      <!-- Avantages -->
      <div class="animate-fade-in-up animation-delay-800">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div class="text-center">
            <div class="text-4xl mb-3">🎯</div>
            <h4 class="text-white font-semibold mb-2">Meilleures offres</h4>
            <p class="text-gray-300 text-sm">Prix imbattables sur tous nos produits</p>
          </div>
          <div class="text-center">
            <div class="text-4xl mb-3">🚚</div>
            <h4 class="text-white font-semibold mb-2">Livraison rapide</h4>
            <p class="text-gray-300 text-sm">Partout en Côte d'Ivoire</p>
          </div>
          <div class="text-center">
            <div class="text-4xl mb-3">💎</div>
            <h4 class="text-white font-semibold mb-2">Qualité garantie</h4>
            <p class="text-gray-300 text-sm">Produits authentiques et de qualité</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-16 animate-fade-in-up animation-delay-1000">
        <p class="text-gray-400 text-sm">
          © 2024 IvoirShop CI - Tous droits réservés
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Meta de la page
definePageMeta({
  layout : 'customlanding'
})


// État réactif
const loading = ref(false)
const phoneNumber = ref('')
const phoneError = ref('')
const successMessage = ref('')
// Référence vidéo supprimée (gérée par le composant ComingSoonVideo)

// Date d'ouverture (dans 30 jours par exemple)
const openingDate = new Date()
openingDate.setDate(openingDate.getDate() + 10)
openingDate.setHours(9, 0, 0, 0) // 9h00 le matin

// Compteur
const timeLeft = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
})

let countdownInterval: NodeJS.Timeout | null = null

// Calcul du temps restant
const calculateTimeLeft = () => {
  const now = new Date().getTime()
  const distance = openingDate.getTime() - now

  if (distance < 0) {
    // Site ouvert !
    timeLeft.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
    if (countdownInterval) {
      clearInterval(countdownInterval)
    }
    return
  }

  timeLeft.value = {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((distance % (1000 * 60)) / 1000)
  }
}

// Formatage du numéro de téléphone
const formatPhoneNumber = () => {
  // Supprimer tous les caractères non numériques
  phoneNumber.value = phoneNumber.value.replace(/\D/g, '')
  
  // Limiter à 8 chiffres
  if (phoneNumber.value.length > 8) {
    phoneNumber.value = phoneNumber.value.slice(0, 8)
  }
  
  // Formater avec des espaces (XX XX XX XX)
  if (phoneNumber.value.length > 2) {
    phoneNumber.value = phoneNumber.value.replace(/(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4')
  } else if (phoneNumber.value.length > 4) {
    phoneNumber.value = phoneNumber.value.replace(/(\d{2})(\d{2})(\d{2})/, '$1 $2 $3')
  } else if (phoneNumber.value.length > 2) {
    phoneNumber.value = phoneNumber.value.replace(/(\d{2})(\d{2})/, '$1 $2')
  }
  
  phoneError.value = ''
}

// Validation du numéro
const validatePhoneNumber = (number: string) => {
  const cleanNumber = number.replace(/\D/g, '')
  
  if (cleanNumber.length !== 8) {
    return 'Le numéro doit contenir 8 chiffres'
  }
  
  // Vérifier que c'est un numéro ivoirien valide
  const firstDigit = cleanNumber[0]
  if (!['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(firstDigit)) {
    return 'Numéro invalide'
  }
  
  return ''
}

// Soumission du formulaire
const submitPhoneNumber = async () => {
  phoneError.value = ''
  
  const cleanNumber = phoneNumber.value.replace(/\D/g, '')
  const validation = validatePhoneNumber(cleanNumber)
  
  if (validation) {
    phoneError.value = validation
    return
  }
  
  loading.value = true
  
  try {
    // Appel API pour sauvegarder le numéro
    const response = await $fetch('/api/notify/phone', {
      method: 'POST',
      body: {
        phone: cleanNumber,
        country_code: '225'
      }
    })
    
    if (response.success) {
      successMessage.value = response.message || `Merci ! Vous serez notifié sur WhatsApp (+225 ${phoneNumber.value}) le jour de l'ouverture.`
      phoneNumber.value = ''
      
      // Effacer le message après 5 secondes
      setTimeout(() => {
        successMessage.value = ''
      }, 5000)
    } else {
      throw new Error(response.message || 'Erreur lors de l\'enregistrement')
    }
    
  } catch (error: any) {
    phoneError.value = error.data?.statusMessage || error.message || 'Erreur lors de l\'enregistrement. Veuillez réessayer.'
    console.error('Erreur:', error)
  } finally {
    loading.value = false
  }
}

// La gestion de la vidéo est maintenant dans le composant ComingSoonVideo

// Initialisation
onMounted(() => {
  calculateTimeLeft()
  countdownInterval = setInterval(calculateTimeLeft, 1000)
})

// Nettoyage
onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})

// SEO
useSeoMeta({
  title: 'IvoirShop CI - Bientôt disponible !',
  description: 'IvoirShop CI revient bientôt avec les meilleures offres du marché. Laissez votre numéro pour être notifié de notre ouverture.',
  ogTitle: 'IvoirShop CI - Bientôt disponible !',
  ogDescription: 'Préparez-vous pour les meilleures offres ! IvoirShop CI revient bientôt.',
  ogImage: '/logo/ivoirshopci-coteivoir.png'
})
</script>

<style scoped>
/* Animations */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}

.animation-delay-200 {
  animation-delay: 0.2s;
  opacity: 0;
}

.animation-delay-400 {
  animation-delay: 0.4s;
  opacity: 0;
}

.animation-delay-600 {
  animation-delay: 0.6s;
  opacity: 0;
}

.animation-delay-800 {
  animation-delay: 0.8s;
  opacity: 0;
}

.animation-delay-1000 {
  animation-delay: 1s;
  opacity: 0;
}

/* Effets de survol */
button:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

/* Animation du compteur */
.bg-\[#ff9900\] {
  transition: all 0.3s ease;
}

.bg-\[#ff9900\]:hover {
  transform: scale(1.05);
}

/* Responsive */
@media (max-width: 768px) {
  .min-w-\[80px\] {
    min-width: 60px;
  }
  
  .text-3xl {
    font-size: 1.875rem;
  }
  
  .text-4xl {
    font-size: 2.25rem;
  }
}
</style>



