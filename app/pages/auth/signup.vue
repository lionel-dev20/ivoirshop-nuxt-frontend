<template>
  <div class="min-h-screen flex items-start justify-center bg-gray-50 px-4 pt-[12vh] pb-8">
    <div class="w-full max-w-lg">

      <!-- ========== STEP INDICATOR (hors du card) ========== -->
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
          <span class="text-sm font-medium text-gray-700 hidden sm:inline">Vérification</span>
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
            <p v-if="errorMessage" class="text-sm text-red-500 bg-red-50 px-4 py-2.5 rounded-lg">
              {{ errorMessage }}
            </p>

            <!-- Bouton Continuer -->
            <button
              id="send-otp-button"
              type="submit"
              :disabled="otpLoading"
              class="w-full bg-[#ff9900] cursor-pointer text-white py-3.5 rounded-sm font-semibold text-base hover:bg-[#e68a00] focus:outline-none focus:ring-2 focus:ring-[#ff9900]/50 focus:ring-offset-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg v-if="otpLoading" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ otpLoading ? 'Envoi du code...' : 'Continuer' }}</span>
            </button>
          </form>
        </div>

        <!-- ========== STEP 2 : VERIFICATION OTP ========== -->
        <div v-show="step === 2">
          <div class="mb-6 text-center">
            <h2 class="text-2xl font-bold text-gray-900">Vérification</h2>
            <p class="text-gray-500 mt-2">
              Un code a été envoyé au <br>
              <span class="font-semibold text-gray-900">{{ form.phone }}</span>
            </p>
          </div>

          <form @submit.prevent="handleStep2" class="space-y-5">
            <!-- Champs OTP (6 digits) -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-3 text-center">Entrez le code à 6 chiffres</label>
              <div class="flex justify-center gap-2">
                <input
                  v-for="(_, index) in 6"
                  :key="index"
                  ref="otpInputs"
                  type="text"
                  inputmode="numeric"
                  maxlength="1"
                  :class="[
                    'w-12 h-14 text-center text-xl font-bold border rounded-lg focus:outline-none focus:ring-2 transition-all',
                    otpError
                      ? 'border-[#ff9900] focus:ring-[#ff9900]/20 focus:border-[#ff9900]'
                      : 'border-gray-200 focus:ring-[#ff9900]/20 focus:border-[#ff9900]'
                  ]"
                  @input="onOtpInput(index, $event)"
                  @keydown="onOtpKeydown(index, $event)"
                  @paste="onOtpPaste($event)"
                />
              </div>
              <p v-if="otpError" class="text-sm text-[#ff9900] mt-2 text-center">{{ otpError }}</p>
            </div>

            <!-- Renvoyer le code -->
            <div class="text-center">
              <button
                type="button"
                @click="resendOtp"
                :disabled="resendCooldown > 0 || otpLoading"
                class="text-sm text-[#ff9900] hover:text-[#e68a00] font-medium disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <span v-if="resendCooldown > 0">Renvoyer le code dans {{ resendCooldown }}s</span>
                <span v-else>Renvoyer le code</span>
              </button>
            </div>

            <!-- Bouton Vérifier -->
            <button
              type="submit"
              :disabled="otpLoading || otpCode.length < 6"
              class="w-full bg-[#ff9900] cursor-pointer text-white py-3.5 rounded-sm font-semibold text-base hover:bg-[#e68a00] focus:outline-none focus:ring-2 focus:ring-[#ff9900]/50 focus:ring-offset-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg v-if="otpLoading" class="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ otpLoading ? 'Vérification...' : 'Vérifier le code' }}</span>
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
      <p v-if="step === 1" class="text-center mt-6 text-gray-500">
        Déjà un compte ?
        <NuxtLink to="/auth/login" class="text-[#ff9900] hover:text-[#e68a00] font-semibold transition-colors">
          Se connecter
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { usePhoneOtp } from '@/composables/usePhoneOtp'

// ──────────────────────────────────────────────
// AUTH & OTP
// ──────────────────────────────────────────────
const { register } = useAuth()
const {
  otpSent,
  otpLoading,
  otpError,
  otpVerified,
  initRecaptcha,
  sendOtp,
  verifyOtp,
  resetOtp,
} = usePhoneOtp()

// ──────────────────────────────────────────────
// STATE
// ──────────────────────────────────────────────
const step = ref(1)               // Étape actuelle (1, 2 ou 3)
const showPassword = ref(false)
const errorMessage = ref('')
const loading = ref(false)

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

// OTP inputs
const otpInputs = ref<HTMLInputElement[]>([])
const otpDigits = reactive<string[]>(['', '', '', '', '', ''])
const otpCode = computed(() => otpDigits.join(''))

// Cooldown pour renvoyer le code
const resendCooldown = ref(0)
let resendTimer: ReturnType<typeof setInterval> | null = null

// Redirection step 3
const redirectCountdown = ref(5)
const redirectProgress = computed(() => ((5 - redirectCountdown.value) / 5) * 100)
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
// STEP 1 → Valider le formulaire + envoyer OTP
// ──────────────────────────────────────────────
async function handleStep1() {
  errorMessage.value = ''

  // 1. Valider tous les champs
  if (!validateStep1()) return

  // 2. Initialiser reCAPTCHA sur le bouton
  initRecaptcha('send-otp-button')

  // 3. Envoyer le code OTP au numéro de téléphone
  await sendOtp(form.phone)

  // 4. Si le code a été envoyé, passer au step 2
  if (otpSent.value) {
    step.value = 2
    startResendCooldown()

    // Focus sur le premier input OTP
    await nextTick()
    if (otpInputs.value[0]) {
      otpInputs.value[0].focus()
    }
  }
}

// ──────────────────────────────────────────────
// STEP 2 → Vérifier le code OTP + créer le compte
// ──────────────────────────────────────────────
async function handleStep2() {
  errorMessage.value = ''

  // 1. Vérifier le code OTP via Firebase
  const firebaseUser = await verifyOtp(otpCode.value)

  // 2. Si le code est incorrect, on reste sur step 2
  if (!firebaseUser) return

  // 3. Le code est bon → créer le compte via l'API backend
  loading.value = true
  try {
    const response = await register({
      username: form.name,
      email: form.email,
      password: form.password,
    })

    if (response && response.success) {
      // 4. Compte créé → passer au step 3
      step.value = 3
      startRedirectCountdown()
    } else {
      errorMessage.value = response?.error || 'Erreur lors de la création du compte'
      // Revenir au step 1 pour corriger
      step.value = 1
    }
  } catch (err: any) {
    errorMessage.value = err.message || 'Erreur lors de la création du compte'
    step.value = 1
  } finally {
    loading.value = false
  }
}

// ──────────────────────────────────────────────
// RETOUR AU STEP 1
// ──────────────────────────────────────────────
function goBackToStep1() {
  step.value = 1
  resetOtp()
  clearOtpDigits()
  stopResendCooldown()
}

// ──────────────────────────────────────────────
// RENVOYER LE CODE OTP
// ──────────────────────────────────────────────
async function resendOtp() {
  clearOtpDigits()
  initRecaptcha('send-otp-button')
  await sendOtp(form.phone)
  if (otpSent.value) {
    startResendCooldown()
  }
}

// ──────────────────────────────────────────────
// GESTION DES INPUTS OTP (6 cases séparées)
// ──────────────────────────────────────────────
function onOtpInput(index: number, event: Event) {
  const input = event.target as HTMLInputElement
  const value = input.value.replace(/\D/g, '') // Garder uniquement les chiffres

  if (value) {
    otpDigits[index] = value[0]
    input.value = value[0]

    // Passer au champ suivant
    if (index < 5 && otpInputs.value[index + 1]) {
      otpInputs.value[index + 1].focus()
    }
  } else {
    otpDigits[index] = ''
  }
}

function onOtpKeydown(index: number, event: KeyboardEvent) {
  // Retour arrière : effacer et revenir au champ précédent
  if (event.key === 'Backspace') {
    if (!otpDigits[index] && index > 0) {
      otpDigits[index - 1] = ''
      if (otpInputs.value[index - 1]) {
        otpInputs.value[index - 1].value = ''
        otpInputs.value[index - 1].focus()
      }
    } else {
      otpDigits[index] = ''
    }
  }
}

function onOtpPaste(event: ClipboardEvent) {
  event.preventDefault()
  const pasted = event.clipboardData?.getData('text')?.replace(/\D/g, '') || ''
  for (let i = 0; i < 6; i++) {
    otpDigits[i] = pasted[i] || ''
    if (otpInputs.value[i]) {
      otpInputs.value[i].value = pasted[i] || ''
    }
  }
  // Focus sur le dernier champ rempli
  const lastIndex = Math.min(pasted.length, 6) - 1
  if (lastIndex >= 0 && otpInputs.value[lastIndex]) {
    otpInputs.value[lastIndex].focus()
  }
}

function clearOtpDigits() {
  for (let i = 0; i < 6; i++) {
    otpDigits[i] = ''
    if (otpInputs.value[i]) {
      otpInputs.value[i].value = ''
    }
  }
}

// ──────────────────────────────────────────────
// TIMERS
// ──────────────────────────────────────────────
function startResendCooldown() {
  resendCooldown.value = 60
  stopResendCooldown()
  resendTimer = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) {
      stopResendCooldown()
    }
  }, 1000)
}

function stopResendCooldown() {
  if (resendTimer) {
    clearInterval(resendTimer)
    resendTimer = null
  }
}

function startRedirectCountdown() {
  redirectCountdown.value = 5
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
  stopResendCooldown()
  if (redirectTimer) clearInterval(redirectTimer)
  resetOtp()
})
</script>
