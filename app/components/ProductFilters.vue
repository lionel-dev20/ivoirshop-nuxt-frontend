<!-- components/ProductFilters.vue -->
<template>
  <div class="bg-white rounded-md shadow-gray-50 shadow-sm border border-gray-100 p-5">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Filtres</h3>
    
    <!-- Filtre par prix -->
    <div class="mb-6">
      <h4 class="text-sm font-medium text-gray-700 mb-3">Prix</h4>
      <div class="space-y-2">
        <div class="flex items-center space-x-2">
          <input
            v-model.number="filters.priceMin"
            type="number"
            placeholder="Min"
            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @input="updateFilters"
          />
          <span class="text-gray-500">-</span>
          <input
            v-model.number="filters.priceMax"
            type="number"
            placeholder="Max"
            class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @input="updateFilters"
          />
        </div>
        <div class="text-xs text-gray-500">
          {{ formatPriceRange() }}
        </div>
      </div>
    </div>

    <!-- Filtre par note -->
    <div class="mb-6">
      <h4 class="text-sm font-medium text-gray-700 mb-3">Note</h4>
      <div class="space-y-1">
        <label
          v-for="rating in ratingOptions"
          :key="rating.value"
          class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
        >
          <input
            v-model="filters.rating"
            :value="rating.value"
            type="radio"
            name="rating"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            @change="updateFilters"
          />
          <div class="ml-3 flex items-center">
            <div class="flex items-center">
              <svg
                v-for="star in 5"
                :key="star"
                :class="[
                  'h-4 w-4',
                  star <= rating.value ? 'text-yellow-400' : 'text-gray-300'
                ]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <span class="ml-2 text-sm text-gray-700">{{ rating.label }}</span>
          </div>
        </label>
      </div>
    </div>

    <!-- Filtres par marques -->
    <div v-if="props.brands && props.brands.length > 0" class="mb-6">
      <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center justify-between">
        <span>Marques</span>
        <span class="text-xs text-gray-500 font-normal">({{ props.brands.length }})</span>
      </h4>
      <div class="max-h-64 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div class="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-2 gap-2">
          <label
            v-for="brand in props.brands"
            :key="brand.slug"
            class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded-[4px] border border-gray-200 transition-all hover:border-blue-400 hover:shadow-sm"
            :class="{ 'bg-blue-50 border-blue-500 shadow-sm': filters.brands.includes(brand.name) }"
            :title="brand.name"
          >
            <input
              v-model="filters.brands"
              :value="brand.name"
              type="checkbox"
              class="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded flex-shrink-0"
              @change="updateFilters"
            />
            <div class="ml-1 space-x-1 flex min-w-0">
              <span class="text-xs font-bold text-gray-700 truncate block leading-tight">{{ brand.name }}</span>
              <span class="text-[10px] text-gray-500">({{ brand.count }})</span>
            </div>
          </label>
        </div>
      </div>
    </div>

    <!-- Filtres par attributs dynamiques -->
    <div
      v-for="attribute in availableAttributes"
      :key="attribute.name"
      class="mb-6"
    >
      <h4 class="text-sm font-medium text-gray-700 mb-3">
        {{ attribute.label }}
      </h4>
      <div class="space-y-2 max-h-48 overflow-y-auto">
        <label
          v-for="option in attribute.options"
          :key="option.value"
          class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
        >
          <input
            v-model="filters.attributes[attribute.name]"
            :value="option.value"
            type="checkbox"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            @change="updateFilters"
          />
          <span class="ml-3 text-sm text-gray-700">{{ option.label }}</span>
          <span class="ml-auto text-xs text-gray-500">({{ option.count }})</span>
        </label>
      </div>
    </div>

    <!-- Filtre par stock -->
    <div class="mb-6">
      <h4 class="text-sm font-medium text-gray-700 mb-3">Disponibilité</h4>
      <div class="space-y-2">
        <label class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
          <input
            v-model="filters.inStock"
            type="checkbox"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            @change="updateFilters"
          />
          <span class="ml-3 text-sm text-gray-700">En stock uniquement</span>
        </label>
        <label class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
          <input
            v-model="filters.onSale"
            type="checkbox"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            @change="updateFilters"
          />
          <span class="ml-3 text-sm text-gray-700">En promotion</span>
        </label>
      </div>
    </div>

    <!-- Boutons d'action -->
    <div class="flex space-x-2 pt-4 border-t">
      <button
        @click="clearFilters"
        class="flex-1 px-3 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
      >
        Effacer
      </button>
      <button
        @click="applyFilters"
        class="flex-1 px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
      >
        Appliquer
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface FilterOption {
  value: string
  label: string
  count: number
}

interface Attribute {
  name: string
  slug: string
  label: string
  options: FilterOption[]
}

interface Brand {
  name: string
  slug: string
  count: number
}

interface ProductFilters {
  priceMin: number | null
  priceMax: number | null
  rating: number | null
  attributes: Record<string, string[]>
  brands: string[]
  inStock: boolean
  onSale: boolean
}

const props = defineProps<{
  products: any[]
  attributes?: Attribute[]
  brands?: Brand[]
}>()

const emit = defineEmits<{
  filter: [filters: ProductFilters]
  clear: []
}>()

// État des filtres
const filters = ref<ProductFilters>({
  priceMin: null,
  priceMax: null,
  rating: null,
  attributes: {},
  brands: [],
  inStock: false,
  onSale: false
})

// Options de note
const ratingOptions = [
  { value: 5, label: '5' },
  { value: 4, label: '4' },
  { value: 3, label: '3' },
  { value: 2, label: '2' },
  { value: 1, label: '1' }
]

// Attributs disponibles (générés dynamiquement depuis les produits)
const availableAttributes = computed(() => {
  if (props.attributes) {
    return props.attributes
  }
  
  // Génération automatique des attributs depuis les produits
  const attributeMap = new Map<string, Map<string, number>>()
  
  props.products.forEach(product => {
    // Attributs WooCommerce
    if (product.attributes) {
      product.attributes.forEach((attr: any) => {
        if (!attributeMap.has(attr.name)) {
          attributeMap.set(attr.name, new Map())
        }
        
        const options = attr.options || []
        options.forEach((option: string) => {
          const currentCount = attributeMap.get(attr.name)?.get(option) || 0
          attributeMap.get(attr.name)?.set(option, currentCount + 1)
        })
      })
    }
    
    // Attributs personnalisés
    if (product.meta_data) {
      product.meta_data.forEach((meta: any) => {
        if (meta.key.startsWith('pa_') || meta.key.startsWith('attribute_')) {
          const attrName = meta.key.replace(/^(pa_|attribute_)/, '')
          if (!attributeMap.has(attrName)) {
            attributeMap.set(attrName, new Map())
          }
          
          const value = meta.value
          if (value) {
            const currentCount = attributeMap.get(attrName)?.get(value) || 0
            attributeMap.get(attrName)?.set(value, currentCount + 1)
          }
        }
      })
    }
  })
  
  // Conversion en format d'attributs
  const attributes: Attribute[] = []
  attributeMap.forEach((options, name) => {
    const attributeOptions: FilterOption[] = []
    options.forEach((count, value) => {
      attributeOptions.push({
        value,
        label: value,
        count
      })
    })
    
    if (attributeOptions.length > 0) {
      attributes.push({
        name,
        label: formatAttributeLabel(name),
        options: attributeOptions.sort((a, b) => a.label.localeCompare(b.label))
      })
    }
  })
  
  return attributes
})

// Formatage du label d'attribut
const formatAttributeLabel = (name: string) => {
  const labels: Record<string, string> = {
    'color': 'Couleur',
    'size': 'Taille',
    'storage': 'Stockage',
    'ram': 'RAM',
    'brand': 'Marque',
    'material': 'Matériau',
    'weight': 'Poids',
    'dimensions': 'Dimensions'
  }
  
  return labels[name] || name.charAt(0).toUpperCase() + name.slice(1)
}

// Formatage de la plage de prix
const formatPriceRange = () => {
  if (filters.value.priceMin && filters.value.priceMax) {
    return `${formatPrice(filters.value.priceMin)} - ${formatPrice(filters.value.priceMax)}`
  } else if (filters.value.priceMin) {
    return `À partir de ${formatPrice(filters.value.priceMin)}`
  } else if (filters.value.priceMax) {
    return `Jusqu'à ${formatPrice(filters.value.priceMax)}`
  }
  return ''
}

// Formatage du prix
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF'
  }).format(price).replace('XOF', 'FCFA')
}

// Mise à jour des filtres
const updateFilters = () => {
  emit('filter', { ...filters.value })
}

// Application des filtres
const applyFilters = () => {
  emit('filter', { ...filters.value })
}

// Effacement des filtres
const clearFilters = () => {
  filters.value = {
    priceMin: null,
    priceMax: null,
    rating: null,
    attributes: {},
    brands: [],
    inStock: false,
    onSale: false
  }
  emit('clear')
}

// Initialisation des attributs
watch(() => props.products, () => {
  // Réinitialiser les filtres d'attributs quand les produits changent
  const newAttributes: Record<string, string[]> = {}
  availableAttributes.value.forEach(attr => {
    newAttributes[attr.name] = []
  })
  filters.value.attributes = newAttributes
}, { immediate: true })
</script>

