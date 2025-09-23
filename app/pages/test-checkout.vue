<!-- pages/test-checkout.vue -->
<template>
  <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-8">Test Checkout - Champs Billing</h1>

    <!-- Test des champs billing -->
    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Test des champs billing</h2>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label for="testBillingCity" class="block text-sm font-medium text-gray-700 mb-1">
            Ville de facturation *
          </label>
          <input
            id="testBillingCity"
            v-model="testForm.billingCity"
            type="text"
            placeholder="Ville de facturation"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label for="testBillingCommune" class="block text-sm font-medium text-gray-700 mb-1">
            Commune de facturation *
          </label>
          <input
            id="testBillingCommune"
            v-model="testForm.billingCommune"
            type="text"
            placeholder="Commune de facturation"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label for="testBillingState" class="block text-sm font-medium text-gray-700 mb-1">
            Région/État
          </label>
          <input
            id="testBillingState"
            v-model="testForm.billingState"
            type="text"
            placeholder="Région ou état"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label for="testBillingPostcode" class="block text-sm font-medium text-gray-700 mb-1">
            Code postal
          </label>
          <input
            id="testBillingPostcode"
            v-model="testForm.billingPostcode"
            type="text"
            placeholder="Code postal"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div class="mt-4">
        <button
          @click="testBillingFields"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Tester les champs billing
        </button>
      </div>

      <div v-if="billingTestResult" class="mt-4 p-4 bg-gray-50 rounded-md">
        <h3 class="font-medium text-gray-900 mb-2">Résultat du test:</h3>
        <pre class="text-sm text-gray-700">{{ JSON.stringify(billingTestResult, null, 2) }}</pre>
      </div>
    </div>

    <!-- Test des coupons -->
    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Test des coupons</h2>
      
      <div class="flex space-x-2 mb-4">
        <input
          v-model="testCouponCode"
          type="text"
          placeholder="Code coupon de test"
          class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          @click="testCoupon"
          :disabled="!testCouponCode.trim() || isTestingCoupon"
          class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {{ isTestingCoupon ? 'Test...' : 'Tester coupon' }}
        </button>
      </div>

      <div v-if="couponTestResult" class="mt-4 p-4 bg-gray-50 rounded-md">
        <h3 class="font-medium text-gray-900 mb-2">Résultat du test coupon:</h3>
        <pre class="text-sm text-gray-700">{{ JSON.stringify(couponTestResult, null, 2) }}</pre>
      </div>
    </div>

    <!-- Test de l'endpoint de test des coupons -->
    <div class="bg-white rounded-lg shadow p-6 mb-8">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">Test de l'endpoint de test des coupons</h2>
      
      <button
        @click="testCouponEndpoint"
        :disabled="isTestingEndpoint"
        class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {{ isTestingEndpoint ? 'Test...' : 'Tester endpoint' }}
      </button>

      <div v-if="endpointTestResult" class="mt-4 p-4 bg-gray-50 rounded-md">
        <h3 class="font-medium text-gray-900 mb-2">Résultat du test endpoint:</h3>
        <pre class="text-sm text-gray-700">{{ JSON.stringify(endpointTestResult, null, 2) }}</pre>
      </div>
    </div>

    <!-- Lien vers checkout réel -->
    <div class="bg-blue-50 rounded-lg p-4">
      <h3 class="text-sm font-semibold text-blue-900 mb-2">Test en conditions réelles</h3>
      <p class="text-sm text-blue-800 mb-3">
        Pour tester le checkout complet avec les nouveaux champs billing :
      </p>
      <NuxtLink
        to="/checkout"
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Aller au checkout
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// SEO
useSeoMeta({
  title: 'Test Checkout - Champs Billing',
  description: 'Test des nouveaux champs billing dans checkout'
})

// État du formulaire de test
const testForm = ref({
  billingCity: '',
  billingCommune: '',
  billingState: '',
  billingPostcode: ''
})

const testCouponCode = ref('')
const isTestingCoupon = ref(false)
const isTestingEndpoint = ref(false)

// Résultats des tests
const billingTestResult = ref(null)
const couponTestResult = ref(null)
const endpointTestResult = ref(null)

// Test des champs billing
const testBillingFields = () => {
  const result = {
    billing: {
      city: testForm.value.billingCity,
      commune: testForm.value.billingCommune,
      state: testForm.value.billingState,
      postcode: testForm.value.billingPostcode
    },
    validation: {
      city_required: !!testForm.value.billingCity,
      commune_required: !!testForm.value.billingCommune,
      all_valid: !!(testForm.value.billingCity && testForm.value.billingCommune)
    },
    timestamp: new Date().toISOString()
  }
  
  billingTestResult.value = result
  console.log('Test champs billing:', result)
}

// Test d'un coupon
const testCoupon = async () => {
  if (!testCouponCode.value.trim()) return
  
  isTestingCoupon.value = true
  
  try {
    const response = await $fetch('/api/coupons/apply', {
      method: 'POST',
      body: {
        coupon_code: testCouponCode.value.trim().toUpperCase(),
        cart_total: 100 // Montant de test
      }
    })
    
    couponTestResult.value = {
      success: true,
      data: response,
      timestamp: new Date().toISOString()
    }
    
    console.log('Test coupon réussi:', response)
  } catch (error: any) {
    couponTestResult.value = {
      success: false,
      error: error.data?.message || error.message,
      status: error.statusCode,
      timestamp: new Date().toISOString()
    }
    
    console.error('Test coupon échoué:', error)
  } finally {
    isTestingCoupon.value = false
  }
}

// Test de l'endpoint de test des coupons
const testCouponEndpoint = async () => {
  isTestingEndpoint.value = true
  
  try {
    const response = await $fetch('/api/coupons/test')
    
    endpointTestResult.value = {
      success: true,
      data: response,
      timestamp: new Date().toISOString()
    }
    
    console.log('Test endpoint réussi:', response)
  } catch (error: any) {
    endpointTestResult.value = {
      success: false,
      error: error.data?.message || error.message,
      status: error.statusCode,
      timestamp: new Date().toISOString()
    }
    
    console.error('Test endpoint échoué:', error)
  } finally {
    isTestingEndpoint.value = false
  }
}
</script>

