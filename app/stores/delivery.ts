// stores/delivery.ts
import { defineStore } from 'pinia'

export interface City {
  id: number
  name: string
  is_active: boolean
}

export interface Commune {
  id: number
  city_id: number
  name: string
  is_active: boolean
  price_light: number
  price_medium: number
  price_heavy: number
}

export interface DeliveryInfo {
  city_id: number | null
  city_name: string
  commune_id: number | null
  commune_name: string
  product_type: 'light' | 'medium' | 'heavy'
  shipping_cost: number
}

export interface Coupon {
  code: string
  description: string
  discount_type: 'percent' | 'fixed_cart'
  amount: string
  discount: number
  formatted_discount: string
}

export const useDeliveryStore = defineStore('delivery', {
  state: () => ({
    cities: [] as City[],
    communes: [] as Commune[],
    selectedDelivery: {
      city_id: null,
      city_name: '',
      commune_id: null,
      commune_name: '',
      product_type: 'medium',
      shipping_cost: 0
    } as DeliveryInfo,
    appliedCoupon: null as Coupon | null,
    isLoadingCities: false,
    isLoadingCommunes: false,
    isCalculatingShipping: false,
    isApplyingCoupon: false
  }),

  getters: {
    hasSelectedDelivery: (state) => !!state.selectedDelivery.commune_id,
    
    formattedShippingCost: (state) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
      }).format(state.selectedDelivery.shipping_cost)
    },

    selectedCity: (state) => {
      return state.cities.find(city => city.id === state.selectedDelivery.city_id) || null
    },

    selectedCommune: (state) => {
      return state.communes.find(commune => commune.id === state.selectedDelivery.commune_id) || null
    },

    hasCoupon: (state) => !!state.appliedCoupon,

    couponDiscount: (state) => state.appliedCoupon?.discount || 0
  },

  actions: {
    async loadCities() {
      this.isLoadingCities = true
      try {
        const response = await $fetch('/api/delivery/cities')
        if (response.success) {
          this.cities = response.cities
        }
      } catch (error) {
        console.error('Erreur chargement villes:', error)
        throw error
      } finally {
        this.isLoadingCities = false
      }
    },

    async loadCommunes(cityId: number) {
      this.isLoadingCommunes = true
      try {
        const response = await $fetch(`/api/delivery/communes/${cityId}`)
        if (response.success) {
          this.communes = response.communes
        }
      } catch (error) {
        console.error('Erreur chargement communes:', error)
        throw error
      } finally {
        this.isLoadingCommunes = false
      }
    },

    async selectCity(cityId: number) {
      const city = this.cities.find(c => c.id === cityId)
      if (city) {
        this.selectedDelivery.city_id = city.id
        this.selectedDelivery.city_name = city.name
        this.selectedDelivery.commune_id = null
        this.selectedDelivery.commune_name = ''
        this.selectedDelivery.shipping_cost = 0
        
        // Charge les communes de cette ville
        await this.loadCommunes(cityId)
      }
    },

    async selectCommune(communeId: number) {
      const commune = this.communes.find(c => c.id === communeId)
      if (commune) {
        this.selectedDelivery.commune_id = commune.id
        this.selectedDelivery.commune_name = commune.name
        
        // Calcule automatiquement les frais de livraison
        await this.calculateShipping()
      }
    },

    setProductType(productType: 'light' | 'medium' | 'heavy') {
      this.selectedDelivery.product_type = productType
      if (this.selectedDelivery.commune_id) {
        this.calculateShipping()
      }
    },

    async calculateShipping() {
      if (!this.selectedDelivery.commune_id || !this.selectedDelivery.product_type) {
        return
      }

      this.isCalculatingShipping = true
      try {
        const response = await $fetch('/api/delivery/calculate', {
          method: 'POST',
          body: {
            commune_id: this.selectedDelivery.commune_id,
            product_type: this.selectedDelivery.product_type
          }
        })

        if (response.success) {
          this.selectedDelivery.shipping_cost = response.shipping.price
        }
      } catch (error) {
        console.error('Erreur calcul livraison:', error)
        throw error
      } finally {
        this.isCalculatingShipping = false
      }
    },

    async applyCoupon(couponCode: string, cartTotal: number) {
      this.isApplyingCoupon = true
      try {
        const response = await $fetch('/api/coupons/apply', {
          method: 'POST',
          body: {
            coupon_code: couponCode.trim().toUpperCase(),
            cart_total: cartTotal
          }
        })

        if (response.success) {
          this.appliedCoupon = response.coupon
          return true
        }
        return false
      } catch (error: any) {
        console.error('Erreur application coupon:', error)
        throw new Error(error.data?.message || error.message || 'Erreur lors de l\'application du coupon')
      } finally {
        this.isApplyingCoupon = false
      }
    },

    removeCoupon() {
      this.appliedCoupon = null
    },

    resetDelivery() {
      this.selectedDelivery = {
        city_id: null,
        city_name: '',
        commune_id: null,
        commune_name: '',
        product_type: 'medium',
        shipping_cost: 0
      }
      this.communes = []
    },

    saveToStorage() {
      if (process.client) {
        localStorage.setItem('selectedDelivery', JSON.stringify(this.selectedDelivery))
        if (this.appliedCoupon) {
          localStorage.setItem('appliedCoupon', JSON.stringify(this.appliedCoupon))
        }
      }
    },

    loadFromStorage() {
      if (process.client) {
        const savedDelivery = localStorage.getItem('selectedDelivery')
        if (savedDelivery) {
          try {
            this.selectedDelivery = JSON.parse(savedDelivery)
          } catch (error) {
            console.error('Erreur chargement delivery storage:', error)
          }
        }

        const savedCoupon = localStorage.getItem('appliedCoupon')
        if (savedCoupon) {
          try {
            this.appliedCoupon = JSON.parse(savedCoupon)
          } catch (error) {
            console.error('Erreur chargement coupon storage:', error)
          }
        }
      }
    }
  }
})