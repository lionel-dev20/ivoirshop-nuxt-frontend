<template>
  <div class="mobile-money-payment">
    <div class="bg-white rounded-lg shadow p-6 border border-orange-200">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <svg class="w-6 h-6 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        Paiement Mobile Money
      </h3>

      <!-- Information sur le montant à payer -->
      <div class="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
        <p class="text-sm text-orange-800 mb-2">
          <span class="font-medium">{{ paymentInfo }}</span>
        </p>
        <p class="text-2xl font-bold text-orange-900">
          {{ formatPrice(amountToPay) }}
        </p>
      </div>

      <!-- Formulaire de paiement -->
      <div class="space-y-4">
        <div>
          <label for="mobileMoneyPhone" class="block text-sm font-medium text-gray-700 mb-1">
            Numéro de téléphone mobile <span class="text-red-600">*</span>
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-gray-500 text-sm">+225</span>
            </div>
            <input
              id="mobileMoneyPhone"
              v-model="phoneNumber"
              type="tel"
              maxlength="10"
              placeholder="0101010101"
              required
              :class="[
                'w-full pl-14 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent',
                phoneError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
              ]"
              @input="validatePhone"
              @blur="validatePhone"
            />
          </div>
          <p v-if="phoneError" class="mt-1 text-sm text-red-600">
            {{ phoneError }}
          </p>
          <p v-else class="mt-1 text-xs text-gray-500">
            Format: 10 chiffres sans l'indicatif pays (ex: 0101010101)
          </p>
        </div>

        <!-- Opérateurs supportés -->
        <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-xs font-medium text-gray-700 mb-3">
            {{ detectedOperator ? `Opérateur détecté : ${detectedOperator.name}` : 'Opérateurs supportés:' }}
          </p>
          <div class="flex items-center justify-center space-x-6">
            <!-- Orange Money (01) -->
            <div 
              :class="[
                'flex flex-col items-center space-y-2 transition-all duration-300 p-3 rounded-lg',
                detectedOperator?.prefix === '01' ? 'bg-orange-100 scale-110 shadow-md' : '',
                detectedOperator && detectedOperator.prefix !== '01' ? 'opacity-30 grayscale' : ''
              ]"
            >
              <img 
                src="/logo/lgomomo.jpg" 
                alt="Orange Money" 
                :class="[
                  'h-12 w-auto rounded transition-all duration-300',
                  detectedOperator?.prefix === '01' ? 'ring-2 ring-orange-500' : ''
                ]" 
              />
              <span 
                :class="[
                  'text-xs font-medium transition-colors duration-300',
                  detectedOperator?.prefix === '01' ? 'text-orange-700' : 'text-gray-600'
                ]"
              >
                Orange Money
              </span>
            </div>

            <!-- MTN Money (05) -->
            <div 
              :class="[
                'flex flex-col items-center space-y-2 transition-all duration-300 p-3 rounded-lg',
                detectedOperator?.prefix === '05' ? 'bg-yellow-100 scale-110 shadow-md' : '',
                detectedOperator && detectedOperator.prefix !== '05' ? 'opacity-30 grayscale' : ''
              ]"
            >
              <img 
                src="/logo/methodeOM.webp" 
                alt="MTN Money" 
                :class="[
                  'h-12 w-auto rounded transition-all duration-300',
                  detectedOperator?.prefix === '05' ? 'ring-2 ring-yellow-500' : ''
                ]" 
              />
              <span 
                :class="[
                  'text-xs font-medium transition-colors duration-300',
                  detectedOperator?.prefix === '05' ? 'text-yellow-700' : 'text-gray-600'
                ]"
              >
                MTN Money
              </span>
            </div>

            <!-- Moov Money (07) -->
            <div 
              :class="[
                'flex flex-col items-center space-y-2 transition-all duration-300 p-3 rounded-lg',
                detectedOperator?.prefix === '07' ? 'bg-blue-100 scale-110 shadow-md' : '',
                detectedOperator && detectedOperator.prefix !== '07' ? 'opacity-30 grayscale' : ''
              ]"
            >
              <img 
                src="/logo/wave.webp" 
                alt="Moov Money" 
                :class="[
                  'h-12 w-auto rounded transition-all duration-300',
                  detectedOperator?.prefix === '07' ? 'ring-2 ring-blue-500' : ''
                ]" 
              />
              <span 
                :class="[
                  'text-xs font-medium transition-colors duration-300',
                  detectedOperator?.prefix === '07' ? 'text-blue-700' : 'text-gray-600'
                ]"
              >
                Moov Money
              </span>
            </div>
          </div>
        </div>

        <!-- Instructions de paiement -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 class="text-sm font-semibold text-blue-900 mb-2">Instructions:</h4>
          <ol class="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Entrez votre numéro de téléphone mobile</li>
            <li>Cliquez sur "Initier le paiement"</li>
            <li>Vous recevrez un message sur votre téléphone</li>
            <li>Composez votre code PIN pour valider le paiement</li>
          </ol>
        </div>

        <!-- Bouton d'action -->
        <button
          type="button"
          @click="initiatePayment"
          :disabled="!isPhoneValid"
          class="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-md transition-colors flex items-center justify-center space-x-2"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span>Payer maintenant</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  amount: number
  totalAmount: number
  isPartialPayment?: boolean
  orderId?: number
  customerName?: string
  customerEmail?: string
  customerId?: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'payment-success', transactionId: string): void
  (e: 'payment-failed', error: string): void
}>()

const phoneNumber = ref('')
const phoneError = ref('')
const isPhoneValid = ref(false)

// Calculer le montant à payer et l'info
const amountToPay = computed(() => props.amount)
const paymentInfo = computed(() => {
  if (props.isPartialPayment) {
    return `Paiement partiel (50% du total: ${formatPrice(props.totalAmount)})`
  }
  return 'Montant total à payer'
})

// Détecter l'opérateur mobile selon le préfixe du numéro
const detectedOperator = computed(() => {
  if (!phoneNumber.value || phoneNumber.value.length < 2) {
    return null
  }

  const prefix = phoneNumber.value.substring(0, 2)
  
  const operators = {
    '01': { prefix: '01', name: 'Orange Money', color: 'orange', logo: '/logo/lgomomo.jpg' },
    '05': { prefix: '05', name: 'MTN Money', color: 'yellow', logo: '/logo/methodeOM.webp' },
    '07': { prefix: '07', name: 'Moov Money', color: 'blue', logo: '/logo/wave.webp' }
  }

  return operators[prefix as keyof typeof operators] || null
})

// Validation du numéro de téléphone
const validatePhone = () => {
  phoneError.value = ''
  isPhoneValid.value = false

  if (!phoneNumber.value) {
    phoneError.value = 'Le numéro de téléphone est requis'
    return
  }

  // Vérifier le format (10 chiffres)
  if (!/^[0-9]{10}$/.test(phoneNumber.value)) {
    phoneError.value = 'Le numéro doit contenir exactement 10 chiffres'
    return
  }

  // Vérifier les préfixes valides pour la Côte d'Ivoire
  const validPrefixes = ['01', '05', '07'] // Orange, MTN, Moov
  const prefix = phoneNumber.value.substring(0, 2)
  
  if (!validPrefixes.includes(prefix)) {
    phoneError.value = 'Le numéro doit commencer par 01, 05 ou 07'
    return
  }

  isPhoneValid.value = true
}

// Formatter le prix
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + ' FCFA'
}

// Initier le paiement - Émet un événement pour que le parent gère la redirection
const initiatePayment = async () => {
  if (!isPhoneValid.value) {
    validatePhone()
    return
  }

  // Émettre l'événement avec le numéro de téléphone
  // Le composant parent (checkout.vue) va créer la commande et rediriger
  emit('payment-success', phoneNumber.value)
}

// Note: La vérification du paiement se fait maintenant sur la page externe
// Le retour se fait via les URLs de callback (successUrl/failedUrl)
</script>

<style scoped>
.mobile-money-payment input[type="tel"]::-webkit-outer-spin-button,
.mobile-money-payment input[type="tel"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.mobile-money-payment input[type="tel"] {
  -moz-appearance: textfield;
}

/* Effet grayscale pour les opérateurs non sélectionnés */
.grayscale {
  filter: grayscale(100%);
}

/* Animation smooth pour les transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Effet de mise en évidence de l'opérateur détecté */
.scale-110 {
  transform: scale(1.1);
}

/* Ombre pour l'opérateur actif */
.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>

