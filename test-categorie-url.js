// Script de test pour vérifier l'URL /categorie/slug
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const WORDPRESS_URL = 'http://ivoir-shop.local'; // Remplacez par votre URL WordPress

async function testCategorieURL() {
  console.log('🧪 Test de l\'URL /categorie/slug...\n');

  try {
    // Test 1: Vérifier les catégories disponibles
    console.log('1️⃣ Récupération des catégories...');
    const categoriesResponse = await axios.get(`${BASE_URL}/api/api/v1/categories`);
    console.log(`✅ ${categoriesResponse.data.length} catégories trouvées`);
    
    // Afficher les premières catégories
    console.log('📋 Catégories disponibles:');
    categoriesResponse.data.slice(0, 5).forEach((cat, index) => {
      console.log(`   ${index + 1}. ${cat.name} (slug: ${cat.slug}) - ${cat.count} produits`);
    });

    // Test 2: Tester l'URL /categorie/slug pour chaque catégorie
    console.log('\n2️⃣ Test des URLs /categorie/slug...');
    
    for (const category of categoriesResponse.data.slice(0, 3)) {
      console.log(`\n🔍 Test de /categorie/${category.slug}...`);
      
      try {
        const categoryPageResponse = await axios.get(`${BASE_URL}/categorie/${category.slug}`);
        console.log(`✅ Page /categorie/${category.slug} accessible`);
        
        // Vérifier le contenu de la page
        if (categoryPageResponse.data.includes(category.name)) {
          console.log(`   ✅ Nom de catégorie trouvé: ${category.name}`);
        } else {
          console.log(`   ⚠️  Nom de catégorie non trouvé dans la page`);
        }
        
      } catch (pageError) {
        console.log(`❌ Erreur pour /categorie/${category.slug}:`, pageError.message);
        if (pageError.response) {
          console.log(`   Status: ${pageError.response.status}`);
        }
      }
    }

    // Test 3: Test spécifique pour "clothing"
    console.log('\n3️⃣ Test spécifique pour "clothing"...');
    const clothingCategory = categoriesResponse.data.find(cat => 
      cat.slug === 'clothing' || cat.name.toLowerCase().includes('clothing')
    );
    
    if (clothingCategory) {
      console.log(`✅ Catégorie Clothing trouvée: ${clothingCategory.name} (${clothingCategory.slug})`);
      
      try {
        const clothingPageResponse = await axios.get(`${BASE_URL}/categorie/${clothingCategory.slug}`);
        console.log(`✅ Page /categorie/${clothingCategory.slug} accessible`);
        
        // Vérifier les produits
        const productsMatch = clothingPageResponse.data.match(/class="[^"]*grid[^"]*"/g);
        if (productsMatch) {
          console.log(`   ✅ Grille de produits détectée`);
        } else {
          console.log(`   ⚠️  Aucune grille de produits détectée`);
        }
        
      } catch (clothingError) {
        console.log(`❌ Erreur pour /categorie/${clothingCategory.slug}:`, clothingError.message);
      }
    } else {
      console.log('❌ Catégorie Clothing non trouvée');
      console.log('💡 Créez une catégorie avec le slug "clothing" dans WordPress');
    }

    // Test 4: Test de l'endpoint API directement
    console.log('\n4️⃣ Test de l\'endpoint API /api/woocommerce/category/...');
    
    if (clothingCategory) {
      try {
        const apiResponse = await axios.get(`${BASE_URL}/api/woocommerce/category/${clothingCategory.slug}`);
        console.log(`✅ Endpoint API accessible pour ${clothingCategory.slug}`);
        console.log(`   Catégorie: ${apiResponse.data.category?.name || 'Non trouvée'}`);
        console.log(`   Produits: ${apiResponse.data.products?.length || 0}`);
        
        if (apiResponse.data.products?.length > 0) {
          console.log('   📦 Premiers produits:');
          apiResponse.data.products.slice(0, 3).forEach((product, index) => {
            console.log(`      ${index + 1}. ${product.name} - ${product.price}€`);
          });
        }
        
      } catch (apiError) {
        console.log(`❌ Erreur endpoint API:`, apiError.message);
        if (apiError.response) {
          console.log(`   Status: ${apiError.response.status}`);
          console.log(`   Data:`, apiError.response.data);
        }
      }
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

// Exécuter le test
testCategorieURL();

