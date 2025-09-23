// plugins/stores.client.ts
export default defineNuxtPlugin(() => {
  const cartStore = useCartStore()
  const deliveryStore = useDeliveryStore()
  
  // Charge les données depuis le localStorage au démarrage
  cartStore.loadFromStorage()
  deliveryStore.loadFromStorage()
})