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

      <!-- Bouton d'action -->
      <button
        type="button"
        @click="initiatePayment"
        :disabled="isLoading"
        class="w-full bg-orange-500 cursor-pointer hover:bg-orange-500 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-4 rounded-sm transition-colors flex items-center justify-center space-x-2"
      >
        <!-- Spinner pendant le chargement -->
        <svg v-if="isLoading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        
        <!-- Icône normale -->
        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        
        <span>{{ isLoading ? 'Traitement en cours...' : 'Payer maintenant' }}</span>
      </button>
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

// État de chargement
const isLoading = ref(false)

// Calculer le montant à payer et l'info
const amountToPay = computed(() => props.amount)
const paymentInfo = computed(() => {
  if (props.isPartialPayment) {
    return `Paiement partiel (50% du total: ${formatPrice(props.totalAmount)})`
  }
  return 'Montant total à payer'
})

// Formatter le prix
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + ' FCFA'
}

// Initier le paiement - Émet un événement pour que le parent gère la redirection
const initiatePayment = async () => {
  // Activer le loading
  isLoading.value = true
  
  // Émettre l'événement sans numéro de téléphone
  // Le composant parent (checkout.vue) va créer la commande et rediriger
  // Le loading restera actif jusqu'à la redirection
  emit('payment-success', '')
}

// Note: La vérification du paiement se fait maintenant sur la page externe
// Le retour se fait via les URLs de callback (successUrl/failedUrl)
</script>

<style scoped>
/* Styles simplifiés pour le paiement Mobile Money */
</style>

