// Script de test pour vérifier les endpoints API
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const WORDPRESS_URL = 'http://ivoir-shop.local'; // Remplacez par votre URL WordPress

async function testEndpoints() {
  console.log('🧪 Test des endpoints API...\n');

  try {
    // Test 0: Vérification directe de l'endpoint WordPress
    console.log('0️⃣ Test direct de l\'endpoint WordPress...');
    try {
      const wpCategoriesResponse = await axios.get(`${WORDPRESS_URL}/wp-json/custom/v1/categories`);
      console.log(`✅ WordPress: ${wpCategoriesResponse.data.length} catégories trouvées`);
      
      // Chercher Clothing dans WordPress
      const wpClothingCategory = wpCategoriesResponse.data.find(cat => 
        cat.slug === 'clothing' || cat.name.toLowerCase().includes('clothing')
      );
      
      if (wpClothingCategory) {
        console.log(`✅ WordPress - Catégorie Clothing trouvée:`, {
          id: wpClothingCategory.id,
          name: wpClothingCategory.name,
          slug: wpClothingCategory.slug,
          count: wpClothingCategory.count
        });
      } else {
        console.log('❌ WordPress - Catégorie Clothing non trouvée');
        console.log('📋 Catégories WordPress disponibles:');
        wpCategoriesResponse.data.slice(0, 5).forEach(cat => {
          console.log(`   - ${cat.name} (${cat.slug}) - ${cat.count} produits`);
        });
      }
    } catch (wpError) {
      console.error('❌ Erreur WordPress:', wpError.message);
      if (wpError.response) {
        console.error('   Status:', wpError.response.status);
        console.error('   Data:', wpError.response.data);
      }
    }

    // Test 1: Récupération des catégories via Nuxt
    console.log('\n1️⃣ Test de récupération des catégories via Nuxt...');
    const categoriesResponse = await axios.get(`${BASE_URL}/api/api/v1/categories`);
    console.log(`✅ Nuxt: ${categoriesResponse.data.length} catégories trouvées`);
    
    // Chercher la catégorie Clothing
    const clothingCategory = categoriesResponse.data.find(cat => 
      cat.slug === 'clothing' || cat.name.toLowerCase().includes('clothing')
    );
    
    if (clothingCategory) {
      console.log(`✅ Nuxt - Catégorie Clothing trouvée:`, {
        id: clothingCategory.id,
        name: clothingCategory.name,
        slug: clothingCategory.slug,
        count: clothingCategory.count
      });

      // Test 2: Récupération des produits de la catégorie Clothing
      console.log('\n2️⃣ Test de récupération des produits Clothing via Nuxt...');
      const productsResponse = await axios.get(`${BASE_URL}/api/api/v1/products/category/${clothingCategory.id}`);
      console.log(`✅ Nuxt: ${productsResponse.data.products.length} produits trouvés pour Clothing`);
      
      if (productsResponse.data.products.length > 0) {
        console.log('📦 Premiers produits:');
        productsResponse.data.products.slice(0, 3).forEach((product, index) => {
          console.log(`   ${index + 1}. ${product.name} - ${product.price}€`);
        });
      }
    } else {
      console.log('❌ Nuxt - Catégorie Clothing non trouvée');
      console.log('📋 Catégories Nuxt disponibles:');
      categoriesResponse.data.slice(0, 5).forEach(cat => {
        console.log(`   - ${cat.name} (${cat.slug}) - ${cat.count} produits`);
      });
    }

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

// Exécuter le test
testEndpoints();
