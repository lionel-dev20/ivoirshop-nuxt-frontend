<!-- components/CartSidebar.vue -->
<template>
  <!-- Overlay -->
  <div
    v-if="cartStore.isOpen"
    class="fixed inset-0 z-50 overflow-hidden"
  >
    <div class="absolute inset-0 overflow-hidden">
      <div 
        class="absolute inset-0 bg-gray-0 bg-opacity-75 transition-opacity"
        @click="cartStore.closeCart()"
      ></div>

      <div class="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        <div class="w-screen max-w-md">
          <div class="h-full flex flex-col bg-white shadow-xl">
            <!-- Header -->
            <div class="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
              <div class="flex items-start justify-between">
                <h2 class="text-lg font-medium text-gray-900">
                  Panier ({{ cartStore.itemsCount }})
                </h2>
                <div class="ml-3 h-7 flex items-center">
                  <button
                    @click="cartStore.closeCart()"
                    class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <span class="sr-only">Fermer le panier</span>
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Items du panier -->
              <div class="mt-8">
                <div v-if="cartStore.isEmpty" class="text-center py-8">
                  <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M34 6l4 24H10l4-24m4 0V4a2 2 0 012-2h4a2 2 0 012 2v2m-6 12a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                  <p class="mt-2 text-sm text-gray-500">Votre panier est vide</p>
                </div>

                <div v-else class="flow-root">
                  <ul class="-my-6 divide-y divide-gray-200">
                    <li v-for="item in cartStore.items" :key="item.id" class="py-6 flex">
                      <!-- Image -->
                      <div class="flex-shrink-0 w-24 h-24 border border-gray-200 rounded-md overflow-hidden">
                        <img
                          v-if="item.image"
                          :src="item.image.src"
                          :alt="item.image.alt"
                          class="w-full h-full object-center object-cover"
                        />
                        <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                          <span class="text-gray-400 text-xs">Aucune image</span>
                        </div>
                      </div>

                      <!-- Détails -->
                      <div class="ml-4 flex-1 flex flex-col">
                        <div>
                          <div class="flex justify-between text-base font-medium text-gray-900">
                            <h3 class="text-[12px] line-clamp-2 md:text-[14px] pb-4 md:p-0">
                              <NuxtLink :to="`/produit/${item.slug}`" @click="cartStore.closeCart()">
                                {{ item.name }}
                              </NuxtLink>
                            </h3>
                            <p class="ml-4 text-[12px] md:text-[15px]">{{ cartStore.formatPrice(item.sale_price || item.price) }}</p>
                          </div>
                          <p v-if="item.sku" class="mt-1 text-sm text-gray-500">SKU: {{ item.sku }}</p>
                        </div>
                        <div class="flex-1 flex items-end justify-between text-sm">
                          <div class="flex items-center">
                            <label :for="`quantity-${item.id}`" class="mr-2 text-gray-500">Qté:</label>
                            <select
                              :id="`quantity-${item.id}`"
                              :value="item.quantity"
                              @change="updateQuantity(item.id, $event)"
                              class="border border-gray-300 rounded-md text-sm py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
                            </select>
                          </div>

                          <div class="flex">
                            <button
                              @click="cartStore.removeItem(item.id)"
                              class="font-medium text-red-600 hover:text-red-500"
                            >
                              Supprimer
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div v-if="!cartStore.isEmpty" class="border-t border-gray-200 py-6 px-4 sm:px-6">
              <div class="flex justify-between text-base font-medium text-gray-900">
                <p>Total</p>
                <p>{{ cartStore.formattedTotal }}</p>
              </div>
              <p class="mt-0.5 text-sm text-gray-500">Livraison calculée à l'étape suivante.</p>
              <div class="mt-6">
                <NuxtLink
                  to="/checkout"
                  @click="cartStore.closeCart()"
                  class="flex justify-center items-center px-6 py-2.5 border border-transparent rounded-[4px] shadow-sm text-base font-medium text-white bg-[#f19102] hover:bg-[#f19102ef] transition-colors w-full"
                >
                  Passer commande
                </NuxtLink>
              </div>
              <div class="mt-6 flex justify-center text-sm text-center text-gray-500">
                <p>
                  ou
                  <button
                    @click="cartStore.closeCart()"
                    class="text-blue-600 font-medium hover:text-blue-500"
                  >
                    Continuer les achats
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const cartStore = useCartStore()

const updateQuantity = (productId: number, event: Event) => {
  const target = event.target as HTMLSelectElement
  const quantity = parseInt(target.value)
  cartStore.updateQuantity(productId, quantity)
}
</script>