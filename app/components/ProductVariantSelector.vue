<template>
  <div v-if="hasVariations" class="space-y-4">
    <h3 class="text-sm font-semibold text-gray-900">Options du produit</h3>
    
    <!-- Sélecteur pour chaque attribut -->
    <div v-for="attribute in attributes" :key="attribute.name" class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">
        {{ attribute.label }}
        <span v-if="selectedVariant && getAttributeValue(selectedVariant, attribute.name)" class="text-gray-500">
          : {{ getAttributeValue(selectedVariant, attribute.name) }}
        </span>
      </label>
      
      <!-- Style Boutons pour certains attributs (Couleur, Taille) -->
      <div v-if="shouldShowAsButtons(attribute.name)" class="flex flex-wrap gap-2">
        <button
          v-for="option in attribute.options"
          :key="option"
          @click="selectAttribute(attribute.name, option)"
          :class="[
            'px-4 py-2 border-2 rounded-md text-sm font-medium transition-all',
            isAttributeSelected(attribute.name, option)
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400',
            !isOptionAvailable(attribute.name, option)
              ? 'opacity-50 cursor-not-allowed line-through'
              : 'cursor-pointer'
          ]"
          :disabled="!isOptionAvailable(attribute.name, option)"
        >
          {{ option }}
        </button>
      </div>
      
      <!-- Style Dropdown pour les autres attributs -->
      <select
        v-else
        :value="getSelectedValue(attribute.name)"
        @change="selectAttribute(attribute.name, ($event.target as HTMLSelectElement).value)"
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Choisir {{ attribute.label.toLowerCase() }}</option>
        <option
          v-for="option in attribute.options"
          :key="option"
          :value="option"
          :disabled="!isOptionAvailable(attribute.name, option)"
        >
          {{ option }}
          {{ !isOptionAvailable(attribute.name, option) ? ' (Indisponible)' : '' }}
        </option>
      </select>
    </div>
    
    <!-- Message de sélection requise -->
    <div v-if="!selectedVariant && hasSelectedAttributes" class="text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
      ⚠️ Cette combinaison n'est pas disponible. Veuillez choisir une autre option.
    </div>
    
    <!-- Informations sur la variante sélectionnée -->
    <div v-if="selectedVariant" class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
      <div class="space-y-2">
        <div class="flex justify-between items-center">
          <span class="text-sm font-medium text-gray-700">Prix:</span>
          <div class="flex items-center gap-2">
            <span v-if="selectedVariant.sale_price" class="text-lg font-bold text-red-600">
              {{ formatPrice(selectedVariant.sale_price) }}
            </span>
            <span
              :class="[
                selectedVariant.sale_price ? 'line-through text-gray-500 text-sm' : 'text-lg font-bold text-gray-900'
              ]"
            >
              {{ formatPrice(selectedVariant.price || selectedVariant.regular_price) }}
            </span>
          </div>
        </div>
        
        <div class="flex justify-between items-center">
          <span class="text-sm font-medium text-gray-700">Disponibilité:</span>
          <span :class="[
            'text-sm font-medium',
            selectedVariant.stock_status === 'instock' ? 'text-green-600' : 'text-red-600'
          ]">
            {{ getStockText(selectedVariant.stock_status) }}
          </span>
        </div>
        
        <div v-if="selectedVariant.sku" class="flex justify-between items-center">
          <span class="text-sm font-medium text-gray-700">SKU:</span>
          <span class="text-sm text-gray-600">{{ selectedVariant.sku }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

interface Variation {
  id: number
  sku?: string
  price: string | number
  regular_price: string | number
  sale_price?: string | number
  stock_status: string
  stock_quantity?: number
  attributes: { name: string; option: string }[]
  image?: { src: string; alt?: string }
}

interface Attribute {
  name: string
  label: string
  options: string[]
}

interface Props {
  variations: Variation[]
  attributes: Attribute[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'variant-selected', variant: Variation | null): void
}>()

// État des sélections
const selectedAttributes = ref<Record<string, string>>({})

// Vérifier si le produit a des variations
const hasVariations = computed(() => {
  return props.variations && props.variations.length > 0
})

// Vérifier si des attributs ont été sélectionnés
const hasSelectedAttributes = computed(() => {
  return Object.keys(selectedAttributes.value).length > 0
})

// Trouver la variation correspondante aux attributs sélectionnés
const selectedVariant = computed(() => {
  if (!hasVariations.value || Object.keys(selectedAttributes.value).length === 0) {
    return null
  }

  return props.variations.find((variation) => {
    return variation.attributes.every((attr) => {
      const selectedValue = selectedAttributes.value[attr.name]
      return !selectedValue || attr.option === selectedValue || attr.option === ''
    })
  }) || null
})

// Vérifier si une option est disponible
const isOptionAvailable = (attributeName: string, option: string) => {
  const tempSelection = { ...selectedAttributes.value, [attributeName]: option }
  
  return props.variations.some((variation) => {
    return variation.attributes.every((attr) => {
      const selectedValue = tempSelection[attr.name]
      return !selectedValue || attr.option === selectedValue || attr.option === ''
    }) && variation.stock_status === 'instock'
  })
}

// Vérifier si un attribut doit être affiché comme des boutons
const shouldShowAsButtons = (attributeName: string) => {
  const buttonAttributes = ['pa_couleur', 'pa_taille', 'pa_size', 'pa_color', 'couleur', 'taille', 'size', 'color']
  return buttonAttributes.some(btn => attributeName.toLowerCase().includes(btn.toLowerCase()))
}

// Vérifier si une option est sélectionnée
const isAttributeSelected = (attributeName: string, option: string) => {
  return selectedAttributes.value[attributeName] === option
}

// Obtenir la valeur sélectionnée pour un attribut
const getSelectedValue = (attributeName: string) => {
  return selectedAttributes.value[attributeName] || ''
}

// Obtenir la valeur d'un attribut dans une variante
const getAttributeValue = (variant: Variation, attributeName: string) => {
  const attr = variant.attributes.find(a => a.name === attributeName)
  return attr?.option || ''
}

// Sélectionner un attribut
const selectAttribute = (attributeName: string, value: string) => {
  if (value) {
    selectedAttributes.value[attributeName] = value
  } else {
    delete selectedAttributes.value[attributeName]
  }
}

// Obtenir le texte du stock
const getStockText = (status: string) => {
  switch (status) {
    case 'instock':
      return 'En stock'
    case 'outofstock':
      return 'Rupture de stock'
    case 'onbackorder':
      return 'Sur commande'
    default:
      return status
  }
}

// Formater le prix
const formatPrice = (price: string | number) => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice) + ' FCFA'
}

// Émettre l'événement quand la variante change
watch(selectedVariant, (newVariant) => {
  emit('variant-selected', newVariant)
})
</script>

