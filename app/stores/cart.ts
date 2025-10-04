// stores/cart.ts
import { defineStore } from 'pinia'

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
        currency: 'EUR'
      }).format(total)
    },

    isEmpty: (state) => state.items.length === 0
  },

  actions: {
    addItem(product: any, quantity: number = 1) {
      const existingItem = this.items.find(item => item.id === product.id)
      
      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        const cartItem: CartItem = {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          regular_price: product.regular_price,
          sale_price: product.sale_price,
          quantity,
          image: product.images?.[0] ? {
            src: product.images[0].src,
            alt: product.images[0].alt || product.name
          } : undefined,
          stock_status: product.stock_status,
          sku: product.sku
        }
        this.items.push(cartItem)
      }
      
      // Sauvegarde dans le localStorage
      this.saveToStorage()
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
            this.items = JSON.parse(savedCart)
          } catch (error) {
            console.error('Erreur lors du chargement du panier:', error)
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