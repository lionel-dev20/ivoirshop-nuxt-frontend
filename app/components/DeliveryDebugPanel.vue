<template>
  <div v-if="show" class="fixed bottom-4 right-4 max-w-md bg-gray-900 text-white rounded-lg shadow-2xl p-4 z-50 max-h-96 overflow-y-auto">
    <div class="flex justify-between items-center mb-3">
      <h3 class="text-lg font-bold text-yellow-400">🐛 Debug Livraison</h3>
      <button @click="$emit('close')" class="text-gray-400 hover:text-white">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    <div class="space-y-3 text-sm">
      <!-- Panier -->
      <div class="bg-gray-800 rounded p-2">
        <h4 class="font-semibold text-blue-300 mb-1">🛒 Panier</h4>
        <p class="text-gray-300">Articles: {{ cartItems.length }}</p>
        <div v-for="item in cartItems" :key="item.id" class="ml-2 mt-1 text-xs">
          <p class="text-gray-400">• {{ item.name }}</p>
          <p class="text-gray-500 ml-2">
            Shipping: <span class="text-yellow-300">{{ item.shipping_class || 'non défini' }}</span> | 
            Poids: {{ item.weight || 'N/A' }}
          </p>
        </div>
        <p class="mt-2 text-green-400 font-semibold">
          Classe la plus lourde: {{ heaviestClass }}
        </p>
      </div>
      
      <!-- Sélection actuelle -->
      <div class="bg-gray-800 rounded p-2">
        <h4 class="font-semibold text-blue-300 mb-1">📍 Sélection</h4>
        <p class="text-gray-300">Ville: {{ selectedCity || 'Non sélectionnée' }}</p>
        <p class="text-gray-300">Commune: {{ selectedCommune || 'Non sélectionnée' }}</p>
        <p class="text-gray-300">Type produit: <span class="text-yellow-300">{{ productType }}</span></p>
      </div>
      
      <!-- Calcul des frais -->
      <div class="bg-gray-800 rounded p-2">
        <h4 class="font-semibold text-blue-300 mb-1">💰 Frais de livraison</h4>
        <div v-if="selectedCity && selectedCommune">
          <p class="text-gray-300">Light: {{ formatPrice(prices.light) }}</p>
          <p class="text-gray-300">Medium: {{ formatPrice(prices.medium) }}</p>
          <p class="text-gray-300">Heavy: {{ formatPrice(prices.heavy) }}</p>
          <p class="mt-2 text-green-400 font-bold text-base">
            → Appliqué ({{ productType }}): {{ formatPrice(prices.applied) }}
          </p>
        </div>
        <p v-else class="text-gray-400 italic">
          Sélectionnez une ville et une commune
        </p>
      </div>
      
      <!-- Store state -->
      <div class="bg-gray-800 rounded p-2">
        <h4 class="font-semibold text-blue-300 mb-1">💾 Store Delivery</h4>
        <p class="text-gray-300">Shipping cost: {{ formatPrice(deliveryShippingCost) }}</p>
        <p class="text-gray-300">Has selection: {{ hasSelection ? '✅' : '❌' }}</p>
      </div>
      
      <!-- Status -->
      <div class="bg-gray-800 rounded p-2">
        <h4 class="font-semibold text-blue-300 mb-1">✅ Status</h4>
        <p :class="status.valid ? 'text-green-400' : 'text-red-400'">
          {{ status.message }}
        </p>
        <ul v-if="status.issues.length > 0" class="mt-2 ml-2 text-xs text-yellow-400">
          <li v-for="(issue, i) in status.issues" :key="i">⚠️ {{ issue }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import deliveryZones from '~/data/delivery-zones.json'

interface Props {
  show?: boolean
  selectedCity?: string
  selectedCommune?: string
  productType?: 'light' | 'medium' | 'heavy'
}

const props = withDefaults(defineProps<Props>(), {
  show: true,
  productType: 'medium'
})

defineEmits(['close'])

const cartStore = useCartStore()
const deliveryStore = useDeliveryStore()

const cartItems = computed(() => cartStore.items)
const heaviestClass = computed(() => cartStore.heaviestShippingClass)
const deliveryShippingCost = computed(() => deliveryStore.selectedDelivery.shipping_cost)
const hasSelection = computed(() => deliveryStore.hasSelectedDelivery)

const prices = computed(() => {
  if (!props.selectedCity || !props.selectedCommune) {
    return { light: 0, medium: 0, heavy: 0, applied: 0 }
  }
  
  const zone = deliveryZones.find(z => z.name === props.selectedCity)
  if (!zone) return { light: 0, medium: 0, heavy: 0, applied: 0 }
  
  const commune = zone.communes.find(c => c.name === props.selectedCommune)
  if (!commune) return { light: 0, medium: 0, heavy: 0, applied: 0 }
  
  const applied = commune[`price_${props.productType}` as 'price_light' | 'price_medium' | 'price_heavy']
  
  return {
    light: commune.price_light,
    medium: commune.price_medium,
    heavy: commune.price_heavy,
    applied
  }
})

const status = computed(() => {
  const issues: string[] = []
  
  // Vérifier les produits
  if (cartItems.value.length === 0) {
    return { valid: false, message: 'Panier vide', issues }
  }
  
  cartItems.value.forEach(item => {
    if (!item.shipping_class) {
      issues.push(`${item.name}: pas de shipping_class`)
    }
  })
  
  // Vérifier la sélection
  if (!props.selectedCity) {
    issues.push('Ville non sélectionnée')
  }
  
  if (!props.selectedCommune) {
    issues.push('Commune non sélectionnée')
  }
  
  // Vérifier les prix
  if (props.selectedCity && props.selectedCommune) {
    if (prices.value.applied === 0) {
      issues.push('Frais de livraison = 0 (vérifiez delivery-zones.json)')
    }
  }
  
  const valid = issues.length === 0
  const message = valid 
    ? '✅ Tout fonctionne correctement' 
    : `❌ ${issues.length} problème(s) détecté(s)`
  
  return { valid, message, issues }
})

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price) + ' FCFA'
}
</script>

