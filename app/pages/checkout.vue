<!-- pages/checkout.vue -->
<template>
  <div class="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <!-- Redirection si panier vide -->
    <div v-if="cartStore.isEmpty" class="text-center py-16">
      <div class="max-w-md mx-auto">
        <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M34 6l4 24H10l4-24m4 0V4a2 2 0 012-2h4a2 2 0 012 2v2m-6 12a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
        <h2 class="mt-4 text-xl font-semibold text-gray-900">Votre panier est vide</h2>
        <p class="mt-2 text-gray-600">Ajoutez des produits pour passer commande.</p>
        <NuxtLink
          to="/"
          class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Continuer vos achats
        </NuxtLink>
      </div>
    </div>

    <!-- Formulaire de commande -->
    <div v-else>
      <!-- Alerte d'erreur de paiement -->
      <div v-if="paymentFailed" class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-start">
          <svg class="w-6 h-6 text-red-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="flex-1">
            <h3 class="text-sm font-semibold text-red-900 mb-1">
              Paiement échoué
            </h3>
            <p class="text-sm text-red-800">
              Le paiement Mobile Money n'a pas pu être traité. Veuillez réessayer ou choisir une autre méthode de paiement.
            </p>
            <button
              type="button"
              @click="paymentFailed = false"
              class="mt-2 text-sm font-medium text-red-700 hover:text-red-900 underline"
            >
              Fermer ce message
            </button>
          </div>
        </div>
      </div>

      <h1 class="text-2xl font-bold text-gray-900 mb-8">Finaliser la commande</h1>

      <form @submit.prevent="submitOrder" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Informations de livraison -->
        <div class="space-y-6">
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Informations de livraison</h2>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
                  Prénom <span class="text-red-600">*</span>
                </label>
                <input
                  id="firstName"
                  v-model="orderForm.firstName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
                  Nom <span class="text-red-600">*</span>
                </label>
                <input
                  id="lastName"
                  v-model="orderForm.lastName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                  Email (optionnel)
                </label>
                <input
                  id="email"
                  v-model="orderForm.email"
                  type="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone <span class="text-red-600">*</span>
                </label>
                <input
                  id="phone"
                  v-model="orderForm.phone"
                  type="tel"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div class="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-4">
              <h3 class="font-medium text-orange-700 mb-2 flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Adresse de livraison
              </h3>
              <div class="text-sm text-orange-700">
                <p v-if="orderForm.city && orderForm.commune">
                  <span class="font-medium">Ville:</span> {{ orderForm.city }}
                </p>
                <p v-if="orderForm.city && orderForm.commune">
                  <span class="font-medium">Commune:</span> {{ orderForm.commune }}
                </p>
                <p v-else class="text-blue-600">
                  Veuillez sélectionner une ville et un quartier ci-dessous
                </p>
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label for="city" class="block text-sm font-medium text-gray-700 mb-1">
                  Région <span class="text-red-600">*</span>
                </label>
                <select
                  id="city"
                  v-model="orderForm.city"
                  @change="onCityChange"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Sélectionner une ville</option>
                  <option v-for="city in cities" :key="city.id" :value="city.name">
                    {{ city.name }}
                  </option>
                </select>
              </div>
              <div>
                <label for="commune" class="block text-sm font-medium text-gray-700 mb-1">
                  Commune/ville <span class="text-red-600">*</span>
                </label>
                <select
                  id="commune"
                  v-model="orderForm.commune"
                  @change="onCommuneChange"
                  :disabled="!orderForm.city"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">Sélectionner un quartier</option>
                  <option v-for="commune in filteredCommunes" :key="commune.id" :value="commune.name">
                    {{ commune.name }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Type de produit - Automatique selon le panier -->
            <div v-if="orderForm.commune" class="mt-4">
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                  <div class="flex-1">
                    <h4 class="text-sm font-medium text-blue-900 mb-1">
                      Type de livraison déterminé automatiquement
                    </h4>
                    <p class="text-sm text-blue-700">
                      Catégorie: <span class="font-semibold">{{ getProductTypeLabel(selectedProductType) }}</span>
                    </p>
                    <p class="text-xs text-blue-600 mt-1">
                      <!-- Basé sur les produits de votre panier (classe de livraison WooCommerce) -->
                    </p>
                    <div v-if="orderForm.city && orderForm.commune" class="mt-2 space-y-1">
                      <p class="text-sm text-blue-700">
                        <span class="font-medium">Ville:</span> {{ orderForm.city }}
                      </p>
                      <p class="text-sm text-blue-700">
                        <span class="font-medium">Quartier:</span> {{ orderForm.commune }}
                      </p>
                      <p class="text-sm text-blue-700">
                        <span class="font-medium">Type:</span> {{ selectedProductType }}
                      </p>
                      <p class="text-base font-semibold text-blue-900 mt-2 bg-white px-3 py-2 rounded">
                        Frais de livraison: {{ formatPrice(getPrice(orderForm.city, orderForm.commune, selectedProductType)) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Récapitulatif livraison -->
            <!-- <div v-if="deliveryStore.hasSelectedDelivery" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <h3 class="font-medium text-blue-900 mb-2 flex items-center">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Récapitulatif livraison
              </h3>
              <div class="text-sm text-blue-800 space-y-1">
                <p><span class="font-medium">Ville:</span> {{ orderForm.city }}</p>
                <p><span class="font-medium">Commune:</span> {{ orderForm.commune }}</p>
                <p><span class="font-medium">Type:</span> {{ getProductTypeLabel(selectedProductType) }}</p>
                <p class="text-base font-semibold text-blue-900 mt-2">
                  <span class="font-medium">Frais:</span> {{ deliveryStore.formattedShippingCost }}
                </p>
              </div>
            </div> -->

            <div v-if="orderForm.commune" class="mt-4">
              <label for="deliveryAddressDetails" class="block text-sm font-medium text-gray-700 mb-1">
                Où souhaitez-vous être livré exactement ? (Rue, numéro, indications spécifiques...) <span class="text-red-600">*</span>
              </label>
              <textarea
                id="deliveryAddressDetails"
                v-model="orderForm.deliveryAddressDetails"
                rows="3"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: Rue des Jardins, Immeuble Alpha, 2ème étage, porte B. Près du supermarché."
              ></textarea>
            </div>

            <div class="mt-4">
              <label for="notes" class="block text-sm font-medium text-gray-700 mb-1">
                Notes de commande <span class="text-red-600">(optionnel)</span>
              </label>
              <textarea
                id="notes"
                v-model="orderForm.notes"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Instructions spéciales, informations complémentaires..."
              ></textarea>
            </div>
          </div>

          <!-- Code coupon -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Code promotionnel
            </h2>
            
            <div v-if="!deliveryStore.hasCoupon" class="flex space-x-2">
              <input
                v-model="couponCode"
                type="text"
                placeholder="Entrez votre code coupon"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                @keypress.enter.prevent="applyCoupon"
              />
              <button
                type="button"
                @click="applyCoupon"
                :disabled="!couponCode.trim() || deliveryStore.isApplyingCoupon"
                class="px-4 py-2 bg-blue-600 text-white rounded-sm hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <span v-if="deliveryStore.isApplyingCoupon" class="animate-spin">⏳</span>
                <span>{{ deliveryStore.isApplyingCoupon ? 'Vérification...' : 'Appliquer' }}</span>
              </button>
            </div>

            <div v-else class="bg-green-50 border border-green-200 rounded-md p-4">
              <div class="flex flex-col space-y-3">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="flex items-center">
                      <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <p class="font-medium text-green-900">Code coupon appliqué</p>
                    </div>
                    <p class="text-sm text-green-700 mt-1 font-semibold uppercase">{{ deliveryStore.appliedCoupon?.code }}</p>
                    <p v-if="deliveryStore.appliedCoupon?.description" class="text-sm text-green-600 mt-1">
                      {{ deliveryStore.appliedCoupon.description }}
                    </p>
                    <p class="font-semibold text-green-900 mt-2">
                      Réduction: {{ deliveryStore.appliedCoupon?.formatted_discount }}
                    </p>
                  </div>
                </div>
                
                <button
                  type="button"
                  @click="removeCoupon"
                  class="w-full px-4 py-2.5 cursor-pointer bg-orange-500 text-white rounded-sm hover:bg-red-600 transition-colors flex items-center justify-center space-x-2 font-medium"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Retirer le coupon</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Méthode de paiement -->
          <div class="bg-white rounded-lg shadow p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Méthode de paiement</h2>
            
            <!-- Message si les informations ne sont pas complètes -->
            <div v-if="!isDeliveryInfoComplete" class="bg-blue-50 border border-blue-300 rounded-lg p-4">
              <div class="flex items-start">
                <svg class="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
                <div class="flex-1">
                  <h4 class="text-sm font-semibold text-blue-900 mb-1">
                    Complétez vos informations de livraison
                  </h4>
                  <p class="text-sm text-blue-800">
                    Veuillez remplir toutes les informations de livraison ci-dessus pour accéder aux modes de paiement.
                  </p>
                  <ul class="text-xs text-blue-700 mt-2 space-y-1 ml-4">
                    <li v-if="!orderForm.firstName.trim()" class="flex items-center">
                      <span class="text-red-600 mr-1">✗</span> Prénom
                    </li>
                    <li v-if="!orderForm.lastName.trim()" class="flex items-center">
                      <span class="text-red-600 mr-1">✗</span> Nom
                    </li>
                    <li v-if="!orderForm.phone.trim()" class="flex items-center">
                      <span class="text-red-600 mr-1">✗</span> Téléphone
                    </li>
                    <li v-if="!orderForm.city.trim()" class="flex items-center">
                      <span class="text-red-600 mr-1">✗</span> Région
                    </li>
                    <li v-if="!orderForm.commune.trim()" class="flex items-center">
                      <span class="text-red-600 mr-1">✗</span> Commune/ville
                    </li>
                    <li v-if="!orderForm.deliveryAddressDetails.trim()" class="flex items-center">
                      <span class="text-red-600 mr-1">✗</span> Adresse de livraison détaillée
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Section de paiement (affichée uniquement si toutes les infos sont remplies) -->
            <div v-else>
              <!-- Alert pour les commandes >= 150 000 FCFA -->
              <div v-if="requiresPartialPayment" class="bg-orange-50 border border-orange-300 rounded-lg p-4 mb-4">
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-orange-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                  <div class="flex-1">
                    <h4 class="text-sm font-semibold text-orange-900 mb-1">
                      Paiement partiel obligatoire
                    </h4>
                    <p class="text-sm text-orange-800">
                      Pour les commandes de 150 000 FCFA et plus, un paiement de 50% par Mobile Money est obligatoire.
                      Le reste sera payé à la livraison.
                    </p>
                    <p class="text-sm font-bold text-orange-900 mt-2">
                      Montant à payer maintenant : {{ formatPrice(partialPaymentAmount) }} (50%)
                    </p>
                  </div>
                </div>
              </div>

              <!-- Options de paiement selon le montant et la région -->
              <div class="space-y-3">
                <!-- Paiement à la livraison (disponible si < 150 000 FCFA - toutes régions) -->
                <label 
                  v-if="canPayOnDelivery"
                  class="flex items-center p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                  :class="orderForm.paymentMethod === 'cod' ? 'border-orange-500 bg-orange-50' : ''"
                >
                  <input
                    v-model="orderForm.paymentMethod"
                    type="radio"
                    value="cod"
                    class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                  />
                  <div class="ml-3 flex-1">
                    <div class="font-medium text-gray-900">Paiement à la livraison</div>
                    <div class="text-sm text-gray-500">Payez en espèces lors de la réception</div>
                    <div class="text-xs text-gray-400 mt-1">Disponible dans toutes les régions</div>
                  </div>
                  <img src="/logo/cash.webp" alt="Cash" class="h-8 w-auto" />
                </label>

                <!-- Paiement Mobile Money (toujours disponible si infos complètes) -->
                <label 
                  class="flex items-center p-3 border border-gray-200 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                  :class="orderForm.paymentMethod === 'mobile_money' ? 'border-orange-500 bg-orange-50' : ''"
                >
                  <input
                    v-model="orderForm.paymentMethod"
                    type="radio"
                    value="mobile_money"
                    :required="requiresPartialPayment"
                    class="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                  />
                  <div class="ml-3 flex-1">
                    <div class="font-medium text-gray-900">
                      Paiement Mobile Money
                      <span v-if="requiresPartialPayment" class="text-orange-600 text-sm">(Obligatoire)</span>
                    </div>
                    <div class="text-sm text-gray-500">
                      {{ requiresPartialPayment ? 'Payez 50% maintenant, le reste à la livraison' : 'Orange Money, MTN, Moov, Wave' }}
                    </div>
                  </div>
                  <div class="flex space-x-1">
                    <img src="/logo/lgomomo.jpg" alt="Orange Money" class="h-6 w-auto rounded" />
                    <img src="/logo/methodeOM.webp" alt="MTN" class="h-6 w-auto rounded" />
                    <img src="/logo/wave.webp" alt="Wave" class="h-6 w-auto rounded" />
                  </div>
                </label>
              </div>

              <!-- Formulaire de paiement Mobile Money -->
              <div v-if="orderForm.paymentMethod === 'mobile_money'" class="mt-4">
                <MobileMoneyPayment
                  :amount="mobileMoneyAmount"
                  :total-amount="finalTotal"
                  :is-partial-payment="requiresPartialPayment"
                  :order-id="0"
                  :customer-name="`${orderForm.firstName} ${orderForm.lastName}`"
                  :customer-email="orderForm.email"
                  :customer-id="authUser?.id || 0"
                  @payment-success="handlePaymentSuccess"
                  @payment-failed="handlePaymentFailed"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Récapitulatif de commande -->
        <div class="space-y-6">
          <div class="bg-white rounded-lg shadow p-6 sticky top-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Récapitulatif</h2>
            
            <!-- Articles -->
            <div class="space-y-4 mb-6">
              <div v-for="item in cartStore.items" :key="item.id" class="flex items-center space-x-4 py-3 border-b border-gray-200 last:border-b-0">
                <div class="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                  <img
                    v-if="item.image"
                    :src="item.image.src"
                    :alt="item.image.alt"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    Aucune image
                  </div>
                </div>
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-medium text-gray-900 truncate">{{ item.name }}</h3>
                  <p class="text-sm text-gray-500">Quantité: {{ item.quantity }}</p>
                  <p class="text-sm font-medium text-gray-900">
                    {{ cartStore.formatPrice((item.sale_price || item.price) * item.quantity) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Totaux -->
            <div class="space-y-2 py-4 border-t border-gray-200">
              <div class="flex justify-between text-sm text-gray-600">
                <span>Sous-total</span>
                <span>{{ cartStore.formattedTotal }}</span>
              </div>
              
              <div v-if="deliveryStore.hasSelectedDelivery" class="flex justify-between text-sm text-gray-600">
                <span>Livraison - {{ orderForm.commune }}</span>
                <span>{{ deliveryStore.formattedShippingCost }}</span>
              </div>
              
              <div v-if="deliveryStore.hasCoupon" class="flex justify-between text-sm text-green-600">
                <span>Réduction ({{ deliveryStore.appliedCoupon?.code }})</span>
                <span>-{{ deliveryStore.appliedCoupon?.formatted_discount }}</span>
              </div>
              
              <div class="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>{{ formatPrice(finalTotal) }}</span>
              </div>
            </div>

            <!-- Bouton de commande (masqué pour Mobile Money) -->
            <button
              v-if="orderForm.paymentMethod !== 'mobile_money'"
              type="submit"
              :disabled="isSubmitting || !canSubmit"
              class="w-full mt-6 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 px-4 rounded-sm transition-colors flex items-center justify-center space-x-2"
              :class="{ 'cursor-pointer': canSubmit, 'cursor-not-allowed': !canSubmit }"
            >
              <span v-if="isSubmitting" class="animate-spin">⏳</span>
              <span>{{ isSubmitting ? 'Traitement...' : `Confirmer la commande - ${formatPrice(finalTotal)}` }}</span>
            </button>

            <!-- Message pour paiement Mobile Money (obligatoire ou optionnel) -->
            <div v-if="orderForm.paymentMethod === 'mobile_money' && isDeliveryInfoComplete" class="mt-3 bg-orange-50 border border-orange-300 rounded-lg p-3">
              <div class="flex items-start">
                <svg class="w-5 h-5 text-orange-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1 a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
                <div class="flex-1">
                  <p class="text-xs text-orange-900 font-medium">
                    📱 Utilisez le bouton "Payer maintenant" ci-dessus pour finaliser votre commande.
                  </p>
                </div>
              </div>
            </div>

            <!-- Informations légales -->
            <div class="mt-4 text-xs text-gray-500 space-y-1">
              <p class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Paiement sécurisé à la livraison
              </p>
              <p class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Livraison sous 2-3 jours ouvrés
              </p>
              <p class="flex items-center">
                <svg class="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Retour gratuit sous 14 jours
              </p>
            </div>
          </div>

          <!-- Politique de livraison -->
          <div class="bg-blue-50 rounded-lg p-4">
            <h3 class="text-sm font-semibold text-blue-900 mb-2">Information livraison</h3>
            <ul class="text-sm text-blue-800 space-y-1">
              <li>• Tarifs de livraison selon la zone et le poids</li>
              <li>• Délai de livraison: 2-3 jours ouvrés</li>
              <li>• Paiement à la réception de votre commande</li>
              <li>• Service client: +225 07 01 51 88 45</li>
            </ul>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import deliveryZones from '~/data/delivery-zones.json'
// Nuxt 3 automatically imports ref, computed, onMounted, watch
import { useAuth } from '~/composables/useAuth'

const cartStore = useCartStore()
const deliveryStore = useDeliveryStore()
const { user: authUser } = useAuth() // Récupérer l'utilisateur connecté

// SEO
useSeoMeta({
  title: 'Checkout - Ma Boutique',
  description: 'Finalisez votre commande en toute sécurité'
})



// Redirection si panier vide (uniquement côté client)
if (process.client && cartStore.isEmpty) {
  await navigateTo('/categorie')
}

// État du formulaire
const orderForm = ref({
  firstName: authUser.value?.first_name || '',
  lastName: authUser.value?.last_name || '',
  email: authUser.value?.email || '',
  phone: '',
  notes: '',
  paymentMethod: '', // Pas de mode de paiement sélectionné par défaut
  city: '',
  commune: '',
  deliveryAddressDetails: ''
})

const isSubmitting = ref(false)
const config = useRuntimeConfig()
const paymentThreshold = config.public.PAYMENT_THRESHOLD || 150000
const mobileMoneyTransactionId = ref<string | null>(null)

// Détecter si le paiement a échoué (depuis l'URL)
const route = useRoute()
const paymentFailed = ref(route.query.payment_failed === 'true')

// États pour les zones de livraison
const cities = ref(deliveryZones.map(zone => ({ id: zone.id, name: zone.name })))
const filteredCommunes = ref<{ id: number; name: string, price_light: number, price_medium: number, price_heavy: number }[]>([])

// Utiliser automatiquement le shipping_class le plus lourd du panier
const selectedProductType = computed(() => {
  const heaviest = cartStore.heaviestShippingClass
  return heaviest
})

// Logique de paiement selon le montant de la commande
const requiresPartialPayment = computed(() => {
  return finalTotal.value >= paymentThreshold
})

const partialPaymentAmount = computed(() => {
  return Math.ceil(finalTotal.value / 2)
})

const mobileMoneyAmount = computed(() => {
  // Si paiement partiel requis, payer la moitié, sinon le total
  return requiresPartialPayment.value ? partialPaymentAmount.value : finalTotal.value
})

// Vérifier si le paiement à la livraison est disponible
const canPayOnDelivery = computed(() => {
  // Paiement à la livraison NON disponible si :
  // 1. La commande est >= 150 000 FCFA
  // 2. La région sélectionnée est "Autres régions"
  if (requiresPartialPayment.value) {
    return false
  }
  
  // Désactiver COD pour "Autres régions"
  if (orderForm.value.city === 'Autres régions') {
    return false
  }
  
  return true
})

// Vérifier si toutes les informations de livraison sont remplies
const isDeliveryInfoComplete = computed(() => {
  return orderForm.value.firstName.trim() !== '' &&
         orderForm.value.lastName.trim() !== '' &&
         orderForm.value.phone.trim() !== '' &&
         orderForm.value.city.trim() !== '' &&
         orderForm.value.commune.trim() !== '' &&
         orderForm.value.deliveryAddressDetails.trim() !== '' &&
         deliveryStore.hasSelectedDelivery
})

// Handlers pour le paiement Mobile Money
const handlePaymentSuccess = async (phoneNumber: string) => {
  console.log('Initiation du paiement avec le numéro:', phoneNumber)
  
  isSubmitting.value = true
  
  try {
    // Préparer les données de la commande (SANS la créer encore)
    const checkoutData = {
      customer: orderForm.value,
      customer_id: authUser.value?.id || 0,
      items: cartStore.items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.sale_price || item.price,
        regular_price: item.regular_price,
        sale_price: item.sale_price,
        image: item.image,
        sku: item.sku,
        shipping_class: item.shipping_class,
        weight: item.weight
      })),
      total: finalTotal.value,
      shipping_cost: deliveryStore.selectedDelivery.shipping_cost,
      payment_method: 'mobile_money',
      mobile_money_phone: phoneNumber,
      is_partial_payment: requiresPartialPayment.value,
      partial_payment_amount: requiresPartialPayment.value ? partialPaymentAmount.value : null,
      billing: {
        first_name: orderForm.value.firstName,
        last_name: orderForm.value.lastName,
        email: orderForm.value.email,
        phone: orderForm.value.phone,
        address_1: orderForm.value.commune,
        city: orderForm.value.city,
        state: '',
        postcode: '',
        country: 'CI'
      },
      shipping: {
        first_name: orderForm.value.firstName,
        last_name: orderForm.value.lastName,
        email: orderForm.value.email,
        phone: orderForm.value.phone,
        address_1: orderForm.value.commune,
        city: orderForm.value.city,
        state: '',
        postcode: '',
        country: 'CI',
        address_2: orderForm.value.deliveryAddressDetails
      },
      delivery_info: {
        city_name: orderForm.value.city,
        commune_name: orderForm.value.commune,
        product_type: deliveryStore.selectedDelivery.product_type
      },
      coupon: deliveryStore.appliedCoupon ? {
        code: deliveryStore.appliedCoupon.code,
        discount: deliveryStore.appliedCoupon.discount
      } : null
    }
    
    // Sauvegarder les données en sessionStorage (pour créer la commande après paiement)
    if (process.client) {
      sessionStorage.setItem('pendingCheckout', JSON.stringify(checkoutData))
    }
    
    // Générer un numéro de commande temporaire unique
    // Format: ORD-TIMESTAMP-RANDOM
    const tempOrderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    
    console.log('📝 Numéro de commande temporaire généré:', tempOrderId)
    
    // URLs de retour
    const baseUrl = window.location.origin
    const successUrl = `${baseUrl}/api/payment/mobile-money/success?order_id=${tempOrderId}`
    const failedUrl = `${baseUrl}/checkout?payment_failed=true&order_id=${tempOrderId}`
    const webhookUrl = `${baseUrl}/api/payment/mobile-money/callback`
    
    // Préparer le panier au format attendu par l'API
    const cart_items = cartStore.items.map(item => ({
      product_id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity
    }))
    
    // Préparer les données pour l'API de paiement (PAYLOAD COMPLET)
    const paymentData = {
      // 💰 Informations de paiement
      amount: mobileMoneyAmount.value,
      order_id: tempOrderId, // 📝 Numéro de commande temporaire
      merchant_reference: 'ivoirshop',
      phone: phoneNumber,
      
      // 👤 Informations client
      customer_id: authUser.value?.id || 0, // ID utilisateur si connecté
      customer_name: `${orderForm.value.firstName} ${orderForm.value.lastName}`,
      customer_email: orderForm.value.email || 'client@ivoirshop.ci',
      customer_phone: orderForm.value.phone, // 📞 Téléphone du client
      customer_city: orderForm.value.city, // 🏙️ Ville
      customer_commune: orderForm.value.commune, // 📍 Région/Commune
      customer_address_details: orderForm.value.deliveryAddressDetails || '', // 🏠 Adresse détaillée
      
      // 🛒 Panier complet
      cart_items: cart_items, // Liste des produits commandés
      
      // 💵 Informations de prix et livraison
      total: finalTotal.value, // Total de la commande
      shipping_cost: deliveryStore.selectedDelivery.shipping_cost, // Frais de livraison
      
      // 📦 Informations de livraison
      delivery_info: {
        city_name: orderForm.value.city, // Région
        commune_name: orderForm.value.commune, // Commune/Quartier
        product_type: deliveryStore.selectedDelivery.product_type // Type de produit (standard/fragile/volumineux)
      },
      
      // 🎟️ Coupon (si appliqué)
      coupon: deliveryStore.appliedCoupon ? {
        code: deliveryStore.appliedCoupon.code,
        discount: deliveryStore.appliedCoupon.discount
      } : null,
      
      // 💳 Paiement partiel (si applicable)
      is_partial_payment: requiresPartialPayment.value,
      partial_payment_amount: requiresPartialPayment.value ? partialPaymentAmount.value : null,
      
      // 🔗 URLs de retour
      successUrl,
      failedUrl,
      webhookUrl
    }
    
    console.log('============================================')
    console.log('📤 REDIRECTION VERS PAIEMENT')
    console.log('============================================')
    console.log('Order ID:', tempOrderId)
    console.log('Client:', paymentData.customer_name)
    console.log('Téléphone:', paymentData.customer_phone)
    console.log('Ville:', paymentData.customer_city)
    console.log('Commune:', paymentData.customer_commune)
    console.log('Email:', paymentData.customer_email)
    console.log('🛒 Panier:', cart_items.length, 'produits')
    console.log('💰 Montant:', mobileMoneyAmount.value, 'FCFA')
    console.log('============================================')
    
    // Appeler l'API pour créer le lien de paiement
    const response = await $fetch('/api/payment/mobile-money/create-link', {
      method: 'POST',
      body: paymentData
    })
    
    if ((response as any).payment_url) {
      // Rediriger vers la page de paiement
      window.location.href = (response as any).payment_url
    } else {
      throw new Error('URL de paiement non reçue')
    }
    
  } catch (error: any) {
    console.error('Erreur lors de l\'initiation du paiement:', error)
    alert('Erreur lors de l\'initiation du paiement: ' + (error.data?.message || error.message))
    isSubmitting.value = false
  }
}

const handlePaymentFailed = (error: string) => {
  console.error('Paiement échoué:', error)
  alert('Le paiement a échoué. Veuillez réessayer.')
}

// État pour les coupons
const couponCode = ref('')

// Types de produits disponibles
const allProductTypes = [
  { value: 'light', label: 'Léger', description: 'Moins de 2kg' },
  { value: 'medium', label: 'Moyen', description: '2kg à 10kg' },
  { value: 'heavy', label: 'Lourd', description: 'Plus de 10kg' }
]

// Filtrer les types de produits en fonction des produits du panier
const productTypes = computed(() => {
  const cartShippingClasses = new Set<string>()
  
  cartStore.items.forEach(item => {
    if (item.shipping_class) {
      cartShippingClasses.add(item.shipping_class)
    }
  })
  
  if (cartShippingClasses.size === 0) {
    return allProductTypes
  }
  
  return allProductTypes.filter(type => cartShippingClasses.has(type.value))
})

// Calculs
const finalTotal = computed(() => {
  let total = cartStore.totalPrice
  
  if (deliveryStore.hasSelectedDelivery) {
    total += deliveryStore.selectedDelivery.shipping_cost
  }
  
  if (deliveryStore.hasCoupon) {
    total -= deliveryStore.couponDiscount
  }
  
  return Math.max(0, total)
})

const canSubmit = computed(() => {
  // Le bouton "Confirmer la commande" est activé UNIQUEMENT pour le paiement à la livraison (COD)
  // Pour Mobile Money, on passe toujours par le flux de redirection via handlePaymentSuccess
  const baseConditions = deliveryStore.hasSelectedDelivery && 
                         orderForm.value.firstName && 
                         orderForm.value.lastName && 
                         orderForm.value.phone && 
                         orderForm.value.city && 
                         orderForm.value.commune && 
                         orderForm.value.deliveryAddressDetails &&
                         !isSubmitting.value
  
  // Activer le bouton SEULEMENT pour le paiement à la livraison (COD)
  return baseConditions && orderForm.value.paymentMethod === 'cod'
})

// Fonctions utilitaires
const formatPrice = (price: string | number) => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice) + " FCFA"
}

const getPrice = (cityName: string, communeName: string, productType: 'light' | 'medium' | 'heavy') => {
  
  if (!cityName || !communeName || !productType) {
    return 0
  }
  
  const city = deliveryZones.find(c => c.name === cityName)
  if (!city) {
    return 0
  }
  
  
  const commune = city.communes.find(c => c.name === communeName)
  if (!commune) {
    return 0
  }
  
  let price = 0
  const priceKey = `price_${productType}` as 'price_light' | 'price_medium' | 'price_heavy'
  price = commune[priceKey] || 0
  
  
  if (price === 0) {
  }
  
  return price
}

const getProductTypeLabel = (type: string) => {
  const productType = allProductTypes.find((t: any) => t.value === type)
  return productType ? productType.label : type
}

// Actions pour les zones de livraison
const onCityChange = () => {
  const selectedCity = deliveryZones.find(c => c.name === orderForm.value.city)
  if (selectedCity) {
    filteredCommunes.value = selectedCity.communes
    deliveryStore.selectCityByName(selectedCity.name)
    orderForm.value.commune = ''
  } else {
    filteredCommunes.value = []
    orderForm.value.commune = ''
    deliveryStore.selectCityByName('')
  }
}

const onCommuneChange = () => {
  const selectedCity = deliveryZones.find(c => c.name === orderForm.value.city)
  const selectedCommune = selectedCity?.communes.find(c => c.name === orderForm.value.commune)

  if (selectedCity && selectedCommune) {
    // Utiliser le shipping_class le plus lourd du panier
    const productType = selectedProductType.value
    
    const shippingCost = getPrice(selectedCity.name, selectedCommune.name, productType)
    
    // Mettre à jour le type de produit dans le store
    deliveryStore.setProductType(productType)
    // Mettre à jour les frais de livraison
    deliveryStore.selectCommuneByName(selectedCommune.name, shippingCost)
  } else {
    deliveryStore.selectCommuneByName('', 0)
  }
}

// onProductTypeChange n'est plus nécessaire - le type est automatiquement déterminé par le panier

// Actions pour les coupons
const applyCoupon = async () => {
  if (!couponCode.value.trim()) return
  
  try {
    await deliveryStore.applyCoupon(couponCode.value, cartStore.totalPrice)
    couponCode.value = ''
  } catch (error: any) {
    alert(error.message)
  }
}

const removeCoupon = () => {
  deliveryStore.removeCoupon()
}

// Soumission de commande
const submitOrder = async () => {
  // Si le paiement Mobile Money est obligatoire (>= 150 000 FCFA),
  // ne pas permettre la soumission via ce bouton
  // Le processus doit passer par handlePaymentSuccess → redirection → création de commande
  if (requiresPartialPayment.value) {
    alert('Veuillez utiliser le bouton de paiement Mobile Money pour finaliser votre commande.')
    return
  }

  if (!deliveryStore.hasSelectedDelivery) {
    alert('Veuillez sélectionner une zone de livraison')
    return
  }

  // Vérifier que le paiement à la livraison est disponible si sélectionné
  if (orderForm.value.paymentMethod === 'cod' && !canPayOnDelivery.value) {
    alert('Le paiement à la livraison n\'est pas disponible pour cette commande. Veuillez choisir le paiement Mobile Money.')
    return
  }

  // Pour le paiement Mobile Money optionnel, vérifier qu'il n'est pas utilisé ici
  // car il doit passer par le flux de redirection
  if (orderForm.value.paymentMethod === 'mobile_money') {
    alert('Veuillez utiliser le bouton de paiement Mobile Money pour procéder au paiement.')
    return
  }
  
  isSubmitting.value = true
  
  try {
    const orderData = {
      customer: orderForm.value,
      customer_id: authUser.value?.id || 0, // Ajouter l'ID de l'utilisateur connecté
      items: cartStore.items,
      total: finalTotal.value,
      shipping_cost: deliveryStore.selectedDelivery.shipping_cost,
      payment_method: orderForm.value.paymentMethod,
      mobile_money_transaction_id: mobileMoneyTransactionId.value,
      is_partial_payment: requiresPartialPayment.value,
      partial_payment_amount: requiresPartialPayment.value ? partialPaymentAmount.value : null,
      billing: {
        first_name: orderForm.value.firstName,
        last_name: orderForm.value.lastName,
        email: orderForm.value.email,
        phone: orderForm.value.phone,
        address_1: orderForm.value.commune, // Commune/Quartier
        city: orderForm.value.city, // Région
        state: '',
        postcode: '',
        country: 'CI'
      },
      shipping: {
        first_name: orderForm.value.firstName,
        last_name: orderForm.value.lastName,
        email: orderForm.value.email,
        phone: orderForm.value.phone,
        address_1: orderForm.value.commune, // Commune/Quartier pour address_1
        city: orderForm.value.city, // Région pour city
        state: '',
        postcode: '',
        country: 'CI',
        address_2: orderForm.value.deliveryAddressDetails // Détails supplémentaires
      },
      delivery_info: {
        city_name: orderForm.value.city, // Région
        commune_name: orderForm.value.commune, // Commune/Quartier
        product_type: deliveryStore.selectedDelivery.product_type
      },
      coupon: deliveryStore.appliedCoupon ? {
        code: deliveryStore.appliedCoupon.code,
        discount: deliveryStore.appliedCoupon.discount
      } : null
    }

    const response = await $fetch('/api/orders/create', {
      method: 'POST',
      body: orderData
    })

    if (response.success) {
      const thankYouData = {
        order_id: (response as any).order_id,
        order_number: (response as any).order_number,
        order_status: (response as any).order_status,
        total: finalTotal.value,
        date: new Date().toISOString(),
        customer: { ...orderForm.value },
        items: cartStore.items.map(item => ({
          product_id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.sale_price || item.price,
          image: item.image
        })),
        shipping_cost: deliveryStore.selectedDelivery.shipping_cost,
        delivery_info: deliveryStore.selectedDelivery,
        coupon: deliveryStore.appliedCoupon,
        payment_method: orderForm.value.paymentMethod,
        customer_id: authUser.value?.id || 0, // Ajouter l'ID client au thankYouData
      }
      
      if (process.client) {
        sessionStorage.setItem('lastOrder', JSON.stringify(thankYouData))
      }
      
      cartStore.clearCart()
      deliveryStore.resetDelivery()
      deliveryStore.removeCoupon()
      
      try {
        await navigateTo('/thank-you', { 
          replace: true,
          external: false
        })
      } catch (navError) {
        if (process.client) {
          window.location.href = '/thank-you'
        }
      }
    } else {
      throw new Error((response as any).message || 'Erreur lors de la création de la commande')
    }
  } catch (error: any) {
    
    let errorMessage = 'Erreur inconnue'
    if (error.data?.message) {
      errorMessage = error.data.message
    } else if (error.message) {
      errorMessage = error.message
    }
    
    alert('Erreur lors de la création de la commande: ' + errorMessage)
  } finally {
    isSubmitting.value = false
  }
}

// Le selectedProductType est maintenant automatiquement déterminé par le panier via computed
// Plus besoin de watcher car il est réactif

// Watcher pour sélectionner automatiquement le bon mode de paiement
watch([isDeliveryInfoComplete, requiresPartialPayment, canPayOnDelivery], ([infoComplete, requiresPayment, canPayCOD]) => {
  if (infoComplete) {
    // Si paiement >= 150 000 FCFA : forcer mobile_money (obligatoire - 50%)
    if (requiresPayment) {
      orderForm.value.paymentMethod = 'mobile_money'
    }
    // Si < 150 000 FCFA : sélectionner COD par défaut (mais l'utilisateur peut choisir entre COD et Mobile Money)
    else if (canPayCOD && !orderForm.value.paymentMethod) {
      orderForm.value.paymentMethod = 'cod'
    }
  }
}, { immediate: true })

// Initialisation
onMounted(async () => {
  
  // Envoyer l'événement begin_checkout à Google Analytics
  if (process.client) {
    const dataLayer = (window as any).dataLayer || []
    ;(window as any).dataLayer = dataLayer
    dataLayer.push({
      event: 'begin_checkout'
    })
  }
  
  // Charger le panier depuis localStorage
  cartStore.loadFromStorage()
  
  // Charger les infos de livraison depuis localStorage
  deliveryStore.loadFromStorage()
  
  if (deliveryStore.selectedDelivery.city_name) {
    orderForm.value.city = deliveryStore.selectedDelivery.city_name
    const selectedCity = deliveryZones.find(c => c.name === orderForm.value.city)
    if (selectedCity) {
      filteredCommunes.value = selectedCity.communes
    }
    
    if (deliveryStore.selectedDelivery.commune_name) {
      orderForm.value.commune = deliveryStore.selectedDelivery.commune_name
    }
  }

  // Le selectedProductType est maintenant automatiquement déterminé par le panier

  // Recalculate shipping cost if city and commune are already selected on mount
  if (orderForm.value.city && orderForm.value.commune) {
    onCommuneChange()
  }

  // Déterminer la méthode de paiement par défaut
  if (requiresPartialPayment.value) {
    orderForm.value.paymentMethod = 'mobile_money'
  } else if (canPayOnDelivery.value) {
    orderForm.value.paymentMethod = 'cod'
  } else {
    orderForm.value.paymentMethod = 'mobile_money'
  }
})

// Sauvegarde automatique des sélections et recalcul des frais
watch([() => orderForm.value.city, () => orderForm.value.commune, () => cartStore.heaviestShippingClass], ([city, commune, shippingClass], [oldCity, oldCommune, oldShippingClass]) => {
  deliveryStore.saveToStorage()
  // Recalculer les frais de livraison quand le shipping class change ou quand la ville/commune change
  if (city && commune) {
    onCommuneChange()
  }
  
  // Forcer Mobile Money si "Autres régions" est sélectionné
  if (city === 'Autres régions') {
    orderForm.value.paymentMethod = 'mobile_money'
  }
})

// Watcher pour gérer automatiquement le changement de méthode de paiement
watch([requiresPartialPayment, canPayOnDelivery], ([requiresPartial, canCOD]) => {
  // Si le paiement partiel est requis, forcer mobile_money
  if (requiresPartial) {
    orderForm.value.paymentMethod = 'mobile_money'
  }
  // Si "Autres régions" est sélectionné, forcer mobile_money
  else if (orderForm.value.city === 'Autres régions') {
    orderForm.value.paymentMethod = 'mobile_money'
  }
  // Si le paiement COD n'est pas disponible et qu'il est sélectionné, changer pour mobile_money
  else if (!canCOD && orderForm.value.paymentMethod === 'cod') {
    orderForm.value.paymentMethod = 'mobile_money'
  }
  // Si le paiement COD est disponible et qu'aucune méthode n'est sélectionnée, sélectionner COD par défaut
  else if (canCOD && !orderForm.value.paymentMethod) {
    orderForm.value.paymentMethod = 'cod'
  }
})
</script>