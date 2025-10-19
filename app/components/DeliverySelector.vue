<template>
    <div class="delivery-selector">
      <h3>Informations de livraison</h3>
      
      <!-- Sélection de la ville -->
      <div class="form-group">
        <label for="city">Ville</label>
        <select 
          id="city" 
          v-model="selectedCityId" 
          @change="onCityChange"
          class="form-control"
        >
          <option value="0">Sélectionnez une ville</option>
          <option 
            v-for="city in deliveryStore.cities" 
            :key="city.id" 
            :value="city.id"
          >
            {{ city.name }}
          </option>
        </select>
      </div>
      
      <!-- Sélection de la commune -->
      <div class="form-group" v-if="deliveryStore.communes.length > 0">
        <label for="commune">Commune</label>
        <select 
          id="commune" 
          v-model="selectedCommuneId" 
          @change="onCommuneChange"
          class="form-control"
        >
          <option value="0">Sélectionnez une commune</option>
          <option 
            v-for="commune in deliveryStore.communes" 
            :key="commune.id" 
            :value="commune.id"
          >
            {{ commune.name }}
          </option>
        </select>
      </div>
      
      <!-- Type de produit -->
      <div class="form-group" v-if="selectedCommuneId > 0">
        <label>Type de produit</label>
        <div class="product-types">
          <label 
            v-for="type in productTypes" 
            :key="type.value"
            class="radio-label"
          >
            <input 
              type="radio" 
              v-model="selectedProductType" 
              :value="type.value"
              @change="onProductTypeChange"
            />
            <span>{{ type.label }}</span>
          </label>
        </div>
      </div>
      
      <!-- Affichage des frais -->
      <div 
        class="shipping-cost" 
        v-if="deliveryStore.selectedDelivery.shipping_cost > 0"
      >
        <strong>Frais de livraison:</strong>
        <span class="amount">
          {{ formatPrice(deliveryStore.selectedDelivery.shipping_cost) }} FCFA
        </span>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  const deliveryStore = useDeliveryStore()
  
  const selectedCityId = ref(0)
  const selectedCommuneId = ref(0)
  const selectedProductType = ref('medium')
  
  const productTypes = [
    { value: 'small', label: 'Petit' },
    { value: 'medium', label: 'Moyen' },
    { value: 'large', label: 'Grand' },
    { value: 'extra_large', label: 'Très grand' }
  ]
  
  // Charger les villes au montage
  onMounted(async () => {
    await deliveryStore.loadCities()
  })
  
  const onCityChange = async () => {
    selectedCommuneId.value = 0
    deliveryStore.resetDelivery()
    
    if (selectedCityId.value > 0) {
      await deliveryStore.loadCommunes(selectedCityId.value)
    }
  }
  
  const onCommuneChange = async () => {
    if (selectedCommuneId.value > 0) {
      await deliveryStore.selectCommune(
        selectedCommuneId.value, 
        selectedProductType.value
      )
    }
  }
  
  const onProductTypeChange = async () => {
    if (selectedCommuneId.value > 0) {
      await deliveryStore.selectCommune(
        selectedCommuneId.value, 
        selectedProductType.value
      )
    }
  }
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price)
  }
  </script>
  
  <style scoped>
  .delivery-selector {
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background: #fff;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #333;
  }
  
  .form-control {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }
  
  .product-types {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
  }
  
  .radio-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }
  
  .radio-label input[type="radio"] {
    cursor: pointer;
  }
  
  .shipping-cost {
    margin-top: 20px;
    padding: 15px;
    background: #f5f5f5;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .shipping-cost .amount {
    font-size: 18px;
    font-weight: bold;
    color: #2c5aa0;
  }
  </style>