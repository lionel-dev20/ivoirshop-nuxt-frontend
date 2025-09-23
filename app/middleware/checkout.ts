// middleware/checkout.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const cartStore = useCartStore()
  
  // Si on essaie d'accéder au checkout avec un panier vide
  if (to.path === '/checkout' && cartStore.isEmpty) {
    return navigateTo('/categories')
  }
  
  // Si on vient de checkout et qu'on va vers merci, c'est OK
  if (from?.path === '/checkout' && to.path === '/merci') {
    return
  }
})