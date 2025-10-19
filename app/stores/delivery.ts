// stores/delivery.ts
export const useDeliveryStore = defineStore('delivery', {
  state: () => ({
    cities: [] as any[],
    communes: [] as any[],
    selectedDelivery: {
      city_id: 0,
      commune_id: 0,
      city_name: '',
      commune_name: '',
      product_type: 'medium' as 'light' | 'medium' | 'heavy',
      shipping_cost: 0
    },
    appliedCoupon: null as any,
    isLoadingCities: false,
    isLoadingCommunes: false,
    isApplyingCoupon: false
  }),
  
  getters: {
    hasSelectedDelivery: (state) => {
      return state.selectedDelivery.city_id > 0 && 
             state.selectedDelivery.commune_id > 0 &&
             state.selectedDelivery.shipping_cost > 0
    },
    
    formattedShippingCost: (state) => {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(state.selectedDelivery.shipping_cost) + ' FCFA'
    },
    
    selectedCommune: (state) => {
      return state.communes.find(c => c.id === state.selectedDelivery.commune_id)
    },
    
    hasCoupon: (state) => {
      return state.appliedCoupon !== null
    },
    
    couponDiscount: (state) => {
      return state.appliedCoupon?.discount || 0
    }
  },
  
  actions: {
    async loadCities() {
      this.isLoadingCities = true
      try {
        const config = useRuntimeConfig()
        const response = await $fetch(`${config.public.woocommerceUrl}/wp-json/wc-delivery-ci/v1/cities`)
        this.cities = response as any[]
      } catch (error) {
        console.error('Erreur chargement villes:', error)
        this.cities = []
      } finally {
        this.isLoadingCities = false
      }
    },
    
    async loadCommunes(cityId: number) {
      this.isLoadingCommunes = true
      try {
        const config = useRuntimeConfig()
        const response = await $fetch(`${config.public.woocommerceUrl}/wp-json/wc-delivery-ci/v1/cities/${cityId}/communes`)
        this.communes = response as any[]
      } catch (error) {
        console.error('Erreur chargement communes:', error)
        this.communes = []
      } finally {
        this.isLoadingCommunes = false
      }
    },
    
    async selectCity(cityId: number) {
      const city = this.cities.find(c => c.id === cityId)
      if (city) {
        this.selectedDelivery.city_id = city.id
        this.selectedDelivery.city_name = city.name
        
        // Charger les communes de cette ville
        await this.loadCommunes(cityId)
        
        // Reset commune et frais
        this.selectedDelivery.commune_id = 0
        this.selectedDelivery.commune_name = ''
        this.selectedDelivery.shipping_cost = 0
      }
    },
    
    async selectCommune(communeId: number) {
      const commune = this.communes.find(c => c.id === communeId)
      if (commune) {
        this.selectedDelivery.commune_id = commune.id
        this.selectedDelivery.commune_name = commune.name
        
        // Calculer les frais de livraison
        await this.calculateShipping()
      }
    },
    
    setProductType(productType: 'light' | 'medium' | 'heavy') {
      this.selectedDelivery.product_type = productType
      
      // Recalculer les frais si une commune est sélectionnée
      if (this.selectedDelivery.commune_id > 0) {
        this.calculateShipping()
      }
    },
    
    async calculateShipping() {
      if (!this.selectedDelivery.commune_id) {
        this.selectedDelivery.shipping_cost = 0
        return
      }
      
      try {
        const commune = this.selectedCommune
        if (!commune) {
          this.selectedDelivery.shipping_cost = 0
          return
        }
        
        // Calculer selon le type de produit
        let cost = 0
        switch (this.selectedDelivery.product_type) {
          case 'light':
            cost = commune.price_light || 0
            break
          case 'medium':
            cost = commune.price_medium || 0
            break
          case 'heavy':
            cost = commune.price_heavy || 0
            break
        }
        
        this.selectedDelivery.shipping_cost = cost
      } catch (error) {
        console.error('Erreur calcul livraison:', error)
        this.selectedDelivery.shipping_cost = 0
      }
    },
    
    async applyCoupon(code: string, cartTotal: number) {
      this.isApplyingCoupon = true
      try {
        const config = useRuntimeConfig()
        const response = await $fetch(`${config.public.woocommerceUrl}/wp-json/wc/v3/coupons`, {
          params: {
            code: code,
            consumer_key: config.public.woocommerceKey,
            consumer_secret: config.public.woocommerceSecret
          }
        })
        
        if (response && (response as any).length > 0) {
          const coupon = (response as any)[0]
          
          // Calculer la réduction
          let discount = 0
          if (coupon.discount_type === 'percent') {
            discount = (cartTotal * parseFloat(coupon.amount)) / 100
          } else if (coupon.discount_type === 'fixed_cart') {
            discount = parseFloat(coupon.amount)
          }
          
          this.appliedCoupon = {
            code: coupon.code,
            discount: discount,
            type: coupon.discount_type,
            amount: coupon.amount,
            description: coupon.description,
            formatted_discount: new Intl.NumberFormat('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(discount) + ' FCFA'
          }
        } else {
          throw new Error('Code coupon invalide')
        }
      } catch (error: any) {
        console.error('Erreur application coupon:', error)
        throw new Error(error.message || 'Code coupon invalide')
      } finally {
        this.isApplyingCoupon = false
      }
    },
    
    removeCoupon() {
      this.appliedCoupon = null
    },
    
    resetDelivery() {
      this.selectedDelivery = {
        city_id: 0,
        commune_id: 0,
        city_name: '',
        commune_name: '',
        product_type: 'medium',
        shipping_cost: 0
      }
      this.communes = []
    },
    
    // Sauvegarde dans localStorage
    saveToStorage() {
      if (process.client) {
        try {
          const data = {
            selectedDelivery: this.selectedDelivery,
            communes: this.communes
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
            this.communes = data.communes || []
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