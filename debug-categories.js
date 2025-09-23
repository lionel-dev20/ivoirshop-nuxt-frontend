// Script de debug pour identifier le problème des catégories
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const WORDPRESS_URL = 'http://ivoir-shop.local'; // Remplacez par votre URL WordPress

async function debugCategories() {
  console.log('🔍 Debug des catégories...\n');

  try {
    // Test 1: Vérifier l'endpoint WordPress directement
    console.log('1️⃣ Test direct de l\'endpoint WordPress...');
    try {
      const wpResponse = await axios.get(`${WORDPRESS_URL}/wp-json/custom/v1/categories`);
      console.log(`✅ WordPress: ${wpResponse.data.length} catégories trouvées`);
      
      if (wpResponse.data.length > 0) {
        console.log('📋 Premières catégories WordPress:');
        wpResponse.data.slice(0, 5).forEach((cat, index) => {
          console.log(`   ${index + 1}. ID: ${cat.id}, Nom: "${cat.name}", Slug: "${cat.slug}", Produits: ${cat.count}`);
        });
        
        // Chercher "clothing" ou similaire
        const clothingLike = wpResponse.data.find(cat => 
          cat.slug.toLowerCase().includes('clothing') || 
          cat.name.toLowerCase().includes('clothing') ||
          cat.slug.toLowerCase().includes('vetement') ||
          cat.name.toLowerCase().includes('vetement')
        );
        
        if (clothingLike) {
          console.log(`✅ Catégorie similaire à "clothing" trouvée:`, {
            id: clothingLike.id,
            name: clothingLike.name,
            slug: clothingLike.slug,
            count: clothingLike.count
          });
        } else {
          console.log('❌ Aucune catégorie similaire à "clothing" trouvée');
        }
      }
    } catch (wpError) {
      console.error('❌ Erreur WordPress:', wpError.message);
      if (wpError.response) {
        console.error('   Status:', wpError.response.status);
        console.error('   Data:', wpError.response.data);
      }
    }

    // Test 2: Vérifier l'endpoint Nuxt
    console.log('\n2️⃣ Test de l\'endpoint Nuxt...');
    try {
      const nuxtResponse = await axios.get(`${BASE_URL}/api/api/v1/categories`);
      console.log(`✅ Nuxt: ${nuxtResponse.data.length} catégories trouvées`);
      
      if (nuxtResponse.data.length > 0) {
        console.log('📋 Premières catégories Nuxt:');
        nuxtResponse.data.slice(0, 5).forEach((cat, index) => {
          console.log(`   ${index + 1}. ID: ${cat.id}, Nom: "${cat.name}", Slug: "${cat.slug}", Produits: ${cat.count}`);
        });
      }
    } catch (nuxtError) {
      console.error('❌ Erreur Nuxt:', nuxtError.message);
      if (nuxtError.response) {
        console.error('   Status:', nuxtError.response.status);
        console.error('   Data:', nuxtError.response.data);
      }
    }

    // Test 3: Tester avec différentes variantes de "clothing"
    console.log('\n3️⃣ Test avec différentes variantes...');
    const testSlugs = ['clothing', 'Clothing', 'CLOTHING', 'vetement', 'vêtement', 'Vêtement'];
    
    for (const testSlug of testSlugs) {
      try {
        console.log(`\n🔍 Test avec slug: "${testSlug}"`);
        
        // Test via l'endpoint WordPress
        const wpCategories = await axios.get(`${WORDPRESS_URL}/wp-json/custom/v1/categories`);
        const wpMatch = wpCategories.data.find(cat => cat.slug === testSlug);
        
        if (wpMatch) {
          console.log(`   ✅ WordPress: Trouvé "${wpMatch.name}" (${wpMatch.slug})`);
        } else {
          console.log(`   ❌ WordPress: Aucun match pour "${testSlug}"`);
        }
        
        // Test via l'endpoint Nuxt
        const nuxtCategories = await axios.get(`${BASE_URL}/api/api/v1/categories`);
        const nuxtMatch = nuxtCategories.data.find(cat => cat.slug === testSlug);
        
        if (nuxtMatch) {
          console.log(`   ✅ Nuxt: Trouvé "${nuxtMatch.name}" (${nuxtMatch.slug})`);
        } else {
          console.log(`   ❌ Nuxt: Aucun match pour "${testSlug}"`);
        }
        
      } catch (error) {
        console.log(`   ❌ Erreur pour "${testSlug}":`, error.message);
      }
    }

    // Test 4: Vérifier la configuration
    console.log('\n4️⃣ Vérification de la configuration...');
    console.log('BASE_URL:', BASE_URL);
    console.log('WORDPRESS_URL:', WORDPRESS_URL);
    console.log('Endpoints à tester:');
    console.log(`   - ${WORDPRESS_URL}/wp-json/custom/v1/categories`);
    console.log(`   - ${BASE_URL}/api/api/v1/categories`);

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

// Exécuter le debug
debugCategories();

