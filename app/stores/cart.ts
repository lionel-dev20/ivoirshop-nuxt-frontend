// stores/cart.ts
import { defineStore } from 'pinia'
import { determineShippingClass, getHeaviestShippingClass, type ShippingClassType } from '~/utils/shipping-class-mapper'

export interface CartItem {
  id: number
  name: string
  slug: string
  price: number
  regular_price: number
  sale_price?: number
  quantity: number
  image?: {
    src: string
    alt: string
  }
  stock_status: string
  sku?: string
  shipping_class?: string // light, medium, heavy
  weight?: string // poids du produit
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
    isOpen: false
  }),

  getters: {
    itemsCount: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    
    totalPrice: (state) => state.items.reduce((total, item) => {
      const price = item.sale_price || item.price
      return total + (price * item.quantity)
    }, 0),

    formattedTotal: (state) => {
      const total = state.items.reduce((total, item) => {
        const price = item.sale_price || item.price
        return total + (price * item.quantity)
      }, 0)
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF'
      }).format(total).replace('XOF', 'FCFA')
    },

    isEmpty: (state) => state.items.length === 0,

    // Retourne le shipping_class le plus lourd du panier
    heaviestShippingClass: (state): ShippingClassType => {
      if (state.items.length === 0) {
        return 'medium'
      }
      
      const shippingClasses: ShippingClassType[] = state.items.map(item => {
        const sc = item.shipping_class as ShippingClassType || 'medium'
        return sc
      })
      
      const heaviest = getHeaviestShippingClass(shippingClasses)
      
      return heaviest
    }
  },

  actions: {
    addItem(product: any, quantity: number = 1) {
      const existingItem = this.items.find(item => item.id === product.id)
      
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        // Déterminer le shipping_class en utilisant la fonction utilitaire
        const shippingClass = determineShippingClass(product.shipping_class, product.weight)
        
        const cartItem: CartItem = {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          regular_price: product.regular_price,
          sale_price: product.sale_price,
          quantity,
          image: product.image, // Utiliser directement l'objet image préparé par ProductCard
          stock_status: product.stock_status,
          sku: product.sku,
          shipping_class: shippingClass,
          weight: product.weight
        }
        
        this.items.push(cartItem)
      }
      
      // Sauvegarde dans le localStorage
      this.saveToStorage()
      
      // Afficher le shipping_class le plus lourd
    },

    removeItem(productId: number) {
      this.items = this.items.filter(item => item.id !== productId)
      this.saveToStorage()
    },

    updateQuantity(productId: number, quantity: number) {
      const item = this.items.find(item => item.id === productId)
      if (item) {
        if (quantity <= 0) {
          this.removeItem(productId)
        } else {
          item.quantity = quantity
          this.saveToStorage()
        }
      }
    },

    clearCart() {
      this.items = []
      this.saveToStorage()
    },

    toggleCart() {
      this.isOpen = !this.isOpen
    },

    openCart() {
      this.isOpen = true
    },

    closeCart() {
      this.isOpen = false
    },

    saveToStorage() {
      if (process.client) {
        localStorage.setItem('cart', JSON.stringify(this.items))
      }
    },

    loadFromStorage() {
      if (process.client) {
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
          try {
            const items = JSON.parse(savedCart)
            // Assurer que chaque item a un shipping_class normalisé
            this.items = items.map((item: CartItem) => {
              // Déterminer le shipping_class en utilisant la fonction utilitaire
              item.shipping_class = determineShippingClass(item.shipping_class, item.weight)
              return item
            })
          } catch (error) {
            this.items = []
          }
        }
      }
    },

    formatPrice(price: string | number) {
      const numPrice = typeof price === "string" ? parseFloat(price) : price

      return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(numPrice) + " FCFA"
    }
  }
})