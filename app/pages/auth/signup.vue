<template>
  <div class="min-h-screen flex items-start justify-center bg-gray-50 px-4 pt-[12vh] pb-8">
    <div class="w-full max-w-lg">

      <!-- ========== STEP INDICATOR ========== -->
      <div class="flex items-center justify-center gap-2 mb-6">
        <!-- Step 1 -->
        <div class="flex items-center gap-2">
          <div :class="[
            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all',
            step >= 1 ? 'bg-[#ff9900] text-white' : 'bg-gray-200 text-gray-500'
          ]">1</div>
          <span class="text-sm font-medium text-gray-700 hidden sm:inline">Informations</span>
        </div>
        <div :class="['w-8 h-0.5 transition-all', step >= 2 ? 'bg-[#ff9900]' : 'bg-gray-200']"></div>
        <!-- Step 2 -->
        <div class="flex items-center gap-2">
          <div :class="[
            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all',
            step >= 2 ? 'bg-[#ff9900] text-white' : 'bg-gray-200 text-gray-500'
          ]">2</div>
          <span class="text-sm font-medium text-gray-700 hidden sm:inline">Confirmation</span>
        </div>
        <div :class="['w-8 h-0.5 transition-all', step >= 3 ? 'bg-[#ff9900]' : 'bg-gray-200']"></div>
        <!-- Step 3 -->
        <div class="flex items-center gap-2">
          <div :class="[
            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all',
            step >= 3 ? 'bg-[#ff9900] text-white' : 'bg-gray-200 text-gray-500'
          ]">3</div>
          <span class="text-sm font-medium text-gray-700 hidden sm:inline">Terminé</span>
        </div>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

        <!-- ========== STEP 1 : FORMULAIRE D'INSCRIPTION ========== -->
        <div v-show="step === 1">
          <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-900 text-center">Créer un compte</h2>
            <p class="text-gray-500 mt-2 text-center">Remplissez vos informations pour commencer</p>
          </div>

          <form @submit.prevent="handleStep1">
            <!-- Grille 2 colonnes -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <!-- Nom et prénom -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Nom et prénom</label>
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="Ex: Kouamé Jean"
                  :class="[
                    'w-full px-4 py-3 border rounded-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all',
                    fieldErrors.name
                      ? 'border-[#ff9900] focus:ring-[#ff9900]/20 focus:border-[#ff9900]'
                      : 'border-gray-200 focus:ring-[#ff9900]/20 focus:border-[#ff9900]'
                  ]"
                  @input="fieldErrors.name = ''"
                />
                <p v-if="fieldErrors.name" class="text-sm text-[#ff9900] mt-1.5">{{ fieldErrors.name }}</p>
              </div>

              <!-- Numéro de téléphone -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Numéro de téléphone</label>
                <input
                  v-model="form.phone"
                  type="tel"
                  placeholder="+225 07 08 09 10 11"
                  :class="[
                    'w-full px-4 py-3 border rounded-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all',
                    fieldErrors.phone
                      ? 'border-[#ff9900] focus:ring-[#ff9900]/20 focus:border-[#ff9900]'
                      : 'border-gray-200 focus:ring-[#ff9900]/20 focus:border-[#ff9900]'
                  ]"
                  @input="fieldErrors.phone = ''"
                />
                <p v-if="fieldErrors.phone" class="text-sm text-[#ff9900] mt-1.5">{{ fieldErrors.phone }}</p>
              </div>

              <!-- Adresse e-mail -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Adresse e-mail</label>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="exemple@email.com"
                  :class="[
                    'w-full px-4 py-3 border rounded-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all',
                    fieldErrors.email
                      ? 'border-[#ff9900] focus:ring-[#ff9900]/20 focus:border-[#ff9900]'
                      : 'border-gray-200 focus:ring-[#ff9900]/20 focus:border-[#ff9900]'
                  ]"
                  @input="fieldErrors.email = ''"
                />
                <p v-if="fieldErrors.email" class="text-sm text-[#ff9900] mt-1.5">{{ fieldErrors.email }}</p>
              </div>

              <!-- Mot de passe -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Mot de passe</label>
                <div class="relative">
                  <input
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    placeholder="6 caractères minimum"
                    :class="[
                      'w-full px-4 pr-12 py-3 border rounded-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all',
                      fieldErrors.password
                        ? 'border-[#ff9900] focus:ring-[#ff9900]/20 focus:border-[#ff9900]'
                        : 'border-gray-200 focus:ring-[#ff9900]/20 focus:border-[#ff9900]'
                    ]"
                    @input="fieldErrors.password = ''"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                </div>
                <p v-if="fieldErrors.password" class="text-sm text-[#ff9900] mt-1.5">{{ fieldErrors.password }}</p>
              </div>
            </div>

            <!-- Erreur globale -->
            <p v-if="errorMessage" class="text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-lg mb-4">
              {{ errorMessage }}
            </p>

            <!-- Bouton Continuer -->
            <button
              type="submit"
              class="w-full bg-[#ff9900] cursor-pointer text-white py-3.5 rounded-sm font-semibold text-base hover:bg-[#e68a00] focus:outline-none focus:ring-2 focus:ring-[#ff9900]/50 focus:ring-offset-2 transition-all"
            >
              Continuer
            </button>
          </form>
        </div>

        <!-- ========== STEP 2 : CONDITIONS D'UTILISATION ========== -->
        <div v-show="step === 2">
          <div class="mb-6 text-center">
            <h2 class="text-2xl font-bold text-gray-900">Confirmation</h2>
            <p class="text-gray-500 mt-2">Veuillez accepter nos conditions avant de finaliser votre inscription</p>
          </div>

          <form @submit.prevent="handleStep2" class="space-y-5">
            <!-- Card conditions -->
            <div class="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <!-- Checkbox conditions -->
              <label class="flex items-start gap-3 cursor-pointer">
                <input
                  v-model="termsAccepted"
                  type="checkbox"
                  class="mt-1 w-5 h-5 rounded border-gray-300 text-[#ff9900] focus:ring-[#ff9900] cursor-pointer accent-[#ff9900]"
                />
                <span class="text-sm text-gray-700 leading-relaxed">
                  En continuant votre inscription, vous acceptez nos
                  <NuxtLink to="/terms" class="text-[#ff9900] hover:text-[#e68a00] font-semibold underline">conditions d'utilisation</NuxtLink>
                  et
                  <NuxtLink to="/privacy" class="text-[#ff9900] hover:text-[#e68a00] font-semibold underline">politique de confidentialité</NuxtLink>.
                </span>
              </label>
              <p v-if="termsError" class="text-sm text-[#ff9900] mt-2 ml-8">{{ termsError }}</p>

              <!-- Séparateur -->
              <div class="border-t border-gray-200 my-4"></div>

              <!-- Info service client -->
              <div class="text-sm text-gray-600 leading-relaxed">
                <p class="font-semibold text-gray-700 mb-1">Besoin d'aide ?</p>
                <p>
                  Notre service client est disponible du lundi au samedi de 09h à 17h
                  par appel <a href="tel:+2250701518845" class="text-[#ff9900] font-semibold hover:text-[#e68a00]">+225 07 01 51 88 45</a>
                  ou par mail <a href="mailto:contact@ivoirshop.ci" class="text-[#ff9900] font-semibold hover:text-[#e68a00]">contact@ivoirshop.ci</a>
                </p>
              </div>
            </div>

            <!-- Erreur globale -->
            <p v-if="errorMessage" class="text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-lg">
              {{ errorMessage }}
            </p>

            <!-- Bouton Créer mon compte -->
            <button
              type="submit"
              :disabled="loading"
              class="w-full bg-[#ff9900] cursor-pointer text-white py-3.5 rounded-sm font-semibold text-base hover:bg-[#e68a00] focus:outline-none focus:ring-2 focus:ring-[#ff9900]/50 focus:ring-offset-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg v-if="loading" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ loading ? 'Création du compte...' : 'Créer mon compte' }}</span>
            </button>

            <!-- Retour -->
            <button
              type="button"
              @click="goBackToStep1"
              class="w-full text-gray-500 hover:text-gray-700 text-sm font-medium py-2 transition-colors"
            >
              Modifier mes informations
            </button>
          </form>
        </div>

        <!-- ========== STEP 3 : CONFIRMATION ========== -->
        <div v-show="step === 3">
          <div class="text-center py-6">
            <!-- Icône succès -->
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 class="text-2xl font-bold text-gray-900 mb-2">Compte créé avec succès !</h2>
            <p class="text-gray-500 mb-8">
              Votre compte a été créé. Vous allez être redirigé vers la page de connexion.
            </p>

            <!-- Barre de progression -->
            <div class="w-full bg-gray-200 rounded-full h-1.5 mb-4">
              <div class="bg-[#ff9900] h-1.5 rounded-full transition-all duration-300" :style="{ width: redirectProgress + '%' }"></div>
            </div>
            <p class="text-sm text-gray-400">Redirection dans {{ redirectCountdown }}s...</p>
          </div>
        </div>

      </div>

      <!-- Lien vers login -->
      <p v-if="step !== 3" class="text-center mt-6 text-gray-500">
        Déjà un compte ?
        <NuxtLink to="/auth/login" class="text-[#ff9900] hover:text-[#e68a00] font-semibold transition-colors">
          Se connecter
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onUnmounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

// ──────────────────────────────────────────────
// AUTH
// ──────────────────────────────────────────────
const { register } = useAuth()

const stripHtml = (text: string) => text.replace(/<[^>]*>/g, '')

// ──────────────────────────────────────────────
// STATE
// ──────────────────────────────────────────────
const step = ref(1)
const showPassword = ref(false)
const errorMessage = ref('')
const loading = ref(false)
const termsAccepted = ref(false)
const termsError = ref('')

// Formulaire
const form = reactive({
  name: '',
  phone: '',
  email: '',
  password: '',
})

// Erreurs par champ
const fieldErrors = reactive({
  name: '',
  phone: '',
  email: '',
  password: '',
})

// Redirection step 3
const redirectCountdown = ref(3)
const redirectProgress = computed(() => ((3 - redirectCountdown.value) / 3) * 100)
let redirectTimer: ReturnType<typeof setInterval> | null = null

// ──────────────────────────────────────────────
// VALIDATION
// ──────────────────────────────────────────────
const isValidEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
const isValidPhone = (val: string) => /^\+?[0-9\s\-]{8,}$/.test(val.trim())

function validateStep1(): boolean {
  fieldErrors.name = ''
  fieldErrors.phone = ''
  fieldErrors.email = ''
  fieldErrors.password = ''

  let valid = true

  if (!form.name.trim()) {
    fieldErrors.name = 'Veuillez entrer votre nom et prénom'
    valid = false
  }

  if (!form.phone.trim()) {
    fieldErrors.phone = 'Veuillez entrer votre numéro de téléphone'
    valid = false
  } else if (!isValidPhone(form.phone)) {
    fieldErrors.phone = 'Le numéro de téléphone n\'est pas valide'
    valid = false
  }

  if (!form.email.trim()) {
    fieldErrors.email = 'Veuillez entrer votre adresse e-mail'
    valid = false
  } else if (!isValidEmail(form.email)) {
    fieldErrors.email = 'L\'adresse e-mail n\'est pas valide'
    valid = false
  }

  if (!form.password) {
    fieldErrors.password = 'Veuillez entrer un mot de passe'
    valid = false
  } else if (form.password.length < 6) {
    fieldErrors.password = 'Le mot de passe doit contenir au moins 6 caractères'
    valid = false
  }

  return valid
}

// ──────────────────────────────────────────────
// STEP 1 → Valider le formulaire
// ──────────────────────────────────────────────
function handleStep1() {
  errorMessage.value = ''
  if (!validateStep1()) return
  step.value = 2
}

// ──────────────────────────────────────────────
// STEP 2 → Accepter les conditions + créer le compte
// ──────────────────────────────────────────────
async function handleStep2() {
  errorMessage.value = ''
  termsError.value = ''

  if (!termsAccepted.value) {
    termsError.value = 'Vous devez accepter les conditions d\'utilisation pour continuer'
    return
  }

  loading.value = true
  try {
    const response = await register({
      username: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone,
    })

    if (response && response.success) {
      step.value = 3
      startRedirectCountdown()
    } else {
      errorMessage.value = stripHtml(response?.error || 'Erreur lors de la création du compte')
    }
  } catch (err: any) {
    errorMessage.value = stripHtml(err.message || 'Erreur lors de la création du compte')
  } finally {
    loading.value = false
  }
}

// ──────────────────────────────────────────────
// RETOUR AU STEP 1
// ──────────────────────────────────────────────
function goBackToStep1() {
  step.value = 1
  termsError.value = ''
}

// ──────────────────────────────────────────────
// TIMER REDIRECTION
// ──────────────────────────────────────────────
function startRedirectCountdown() {
  redirectCountdown.value = 3
  redirectTimer = setInterval(() => {
    redirectCountdown.value--
    if (redirectCountdown.value <= 0) {
      if (redirectTimer) clearInterval(redirectTimer)
      navigateTo('/auth/login')
    }
  }, 1000)
}

// ──────────────────────────────────────────────
// CLEANUP
// ──────────────────────────────────────────────
onUnmounted(() => {
  if (redirectTimer) clearInterval(redirectTimer)
})
</script>
