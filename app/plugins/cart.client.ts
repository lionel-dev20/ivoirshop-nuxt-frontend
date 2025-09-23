// plugins/cart.client.ts
export default defineNuxtPlugin(() => {
  const cartStore = useCartStore()
  
  // Charge le panier depuis le localStorage au démarrage
  cartStore.loadFromStorage()
})