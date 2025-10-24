// stores/delivery.ts
export const useDeliveryStore = defineStore('delivery', {
  state: () => ({
    selectedDelivery: {
      city_name: '',
      commune_name: '',
      product_type: 'medium' as 'light' | 'medium' | 'heavy',
      shipping_cost: 0
    },
    appliedCoupon: null as any,
    isApplyingCoupon: false
  }),
  
  getters: {
    hasSelectedDelivery: (state) => {
      return state.selectedDelivery.city_name !== '' && 
             state.selectedDelivery.commune_name !== '' &&
             state.selectedDelivery.shipping_cost > 0
    },
    
    formattedShippingCost: (state) => {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(state.selectedDelivery.shipping_cost) + ' FCFA'
    },
    
    hasCoupon: (state) => {
      return state.appliedCoupon !== null
    },
    
    couponDiscount: (state) => {
      return state.appliedCoupon?.discount || 0
    }
  },
  
  actions: {
    selectCityByName(cityName: string) {
      this.selectedDelivery.city_name = cityName
      this.selectedDelivery.commune_name = ''
      this.selectedDelivery.shipping_cost = 0
    },
 
    selectCommuneByName(communeName: string, shippingCost: number) {
      this.selectedDelivery.commune_name = communeName
      this.selectedDelivery.shipping_cost = shippingCost
    },
    
    setProductType(productType: 'light' | 'medium' | 'heavy') {
      this.selectedDelivery.product_type = productType
      
      // No direct recalculation here; checkout page will handle it via watch
    },
    
    // This action is removed as shipping cost is now directly set in selectCommuneByName
    // The calculation logic will be in the checkout.vue component
    
    async applyCoupon(code: string, cartTotal: number) {
      this.isApplyingCoupon = true
      try {
        const response = await $fetch('/api/coupons/apply', {
          method: 'POST',
          body: {
            coupon_code: code,
            cart_total: cartTotal
          }
        })
        
        if ((response as any).success) {
          const coupon = (response as any).coupon
          
          this.appliedCoupon = {
            code: coupon.code,
            discount: coupon.discount,
            type: coupon.discount_type,
            amount: coupon.amount,
            description: coupon.description,
            formatted_discount: coupon.formatted_discount
          }
        } else {
          throw new Error((response as any).message || 'Code coupon invalide')
        }
      } catch (error: any) {
        console.error('Erreur application coupon:', error)
        throw new Error(error.statusMessage || error.message || 'Code coupon invalide')
      } finally {
        this.isApplyingCoupon = false
      }
    },
    
    removeCoupon() {
      this.appliedCoupon = null
    },
    
    resetDelivery() {
      this.selectedDelivery = {
        city_name: '',
        commune_name: '',
        product_type: 'medium',
        shipping_cost: 0
      }
    },
    
    // Sauvegarde dans localStorage
    saveToStorage() {
      if (process.client) {
        try {
          const data = {
            selectedDelivery: this.selectedDelivery,
          }
          localStorage.setItem('deliveryData', JSON.stringify(data))
        } catch (error) {
          console.error('Erreur sauvegarde localStorage:', error)
        }
      }
    },
    
    // Chargement depuis localStorage
    loadFromStorage() {
      if (process.client) {
        try {
          const stored = localStorage.getItem('deliveryData')
          if (stored) {
            const data = JSON.parse(stored)
            this.selectedDelivery = data.selectedDelivery || this.selectedDelivery
          }
        } catch (error) {
          console.error('Erreur chargement localStorage:', error)
        }
      }
    },
    
    // Nettoyer le localStorage
    clearStorage() {
      if (process.client) {
        try {
          localStorage.removeItem('deliveryData')
        } catch (error) {
          console.error('Erreur nettoyage localStorage:', error)
        }
      }
    }
  }
})