<!-- pages/payment/process-success.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 text-center">
      <div v-if="isProcessing">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto"></div>
        <h2 class="mt-6 text-2xl font-bold text-gray-900">
          Finalisation de votre commande...
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Veuillez patienter pendant que nous enregistrons votre commande.
        </p>
      </div>

      <div v-else-if="error" class="text-center">
        <svg class="mx-auto h-16 w-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 48 48">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4v4m0 4v4m6-16h4m4 0h4m-4 4h4m-4 4h4m-4 4h4" />
        </svg>
        <h2 class="mt-4 text-xl font-semibold text-gray-900">Erreur</h2>
        <p class="mt-2 text-gray-600">{{ error }}</p>
        <NuxtLink
          to="/checkout"
          class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700"
        >
          Retour au checkout
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const cartStore = useCartStore()
const deliveryStore = useDeliveryStore()
const isProcessing = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    // Récupérer les données du checkout depuis sessionStorage
    const checkoutDataStr = sessionStorage.getItem('pendingCheckout')
    
    if (!checkoutDataStr) {
      throw new Error('Données de commande non trouvées')
    }

    const checkoutData = JSON.parse(checkoutDataStr)

    // Créer la commande dans WooCommerce
    const response = await $fetch('/api/orders/create', {
      method: 'POST',
      body: checkoutData
    })

    if (response.success) {
      const orderId = (response as any).order_id
      const orderNumber = (response as any).order_number
      
      // Préparer les données pour la page thank-you
      const thankYouData = {
        order_id: orderId,
        order_number: orderNumber,
        order_status: 'processing', // Paiement confirmé
        total: checkoutData.total,
        date: new Date().toISOString(),
        customer: checkoutData.customer,
        items: checkoutData.items,
        shipping_cost: checkoutData.shipping_cost,
        delivery_info: checkoutData.delivery_info,
        coupon: checkoutData.coupon,
        payment_method: 'mobile_money',
        customer_id: checkoutData.customer_id,
      }
      
      // Sauvegarder pour la page thank-you
      sessionStorage.setItem('lastOrder', JSON.stringify(thankYouData))
      
      // Nettoyer les données temporaires
      sessionStorage.removeItem('pendingCheckout')
      
      // Vider le panier
      cartStore.clearCart()
      deliveryStore.resetDelivery()
      deliveryStore.removeCoupon()
      
      // Rediriger vers thank-you
      await navigateTo(`/thank-you?order_id=${orderId}`, { replace: true })
      
    } else {
      throw new Error((response as any).message || 'Erreur lors de la création de la commande')
    }
    
  } catch (err: any) {
    error.value = err.message || 'Une erreur est survenue'
    isProcessing.value = false
    
    // Nettoyer quand même les données temporaires
    sessionStorage.removeItem('pendingCheckout')
  }
})
</script>

