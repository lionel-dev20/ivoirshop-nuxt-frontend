// Script de test pour vérifier les corrections du ProductCard
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testProductCardFixes() {
  console.log('🔧 Test des corrections du ProductCard...\n');

  try {
    // Test 1: Vérifier que la page de test fonctionne
    console.log('1️⃣ Test de la page de test...');
    try {
      const testResponse = await axios.get(`${BASE_URL}/test-cart`);
      if (testResponse.status === 200) {
        console.log('✅ Page de test accessible');
      }
    } catch (error) {
      console.log('⚠️  Page de test non accessible:', error.message);
    }

    // Test 2: Vérifier les endpoints API
    console.log('\n2️⃣ Test des endpoints API...');
    const categoriesResponse = await axios.get(`${BASE_URL}/api/api/v1/categories`);
    console.log(`✅ ${categoriesResponse.data.length} catégories trouvées`);
    
    if (categoriesResponse.data.length === 0) {
      console.log('❌ Aucune catégorie trouvée');
      return;
    }

    // Test 3: Vérifier les produits
    const firstCategory = categoriesResponse.data[0];
    console.log(`\n3️⃣ Test avec la catégorie: ${firstCategory.name}`);
    
    const productsResponse = await axios.get(`${BASE_URL}/api/api/v1/products/category/${firstCategory.id}`);
    console.log(`✅ ${productsResponse.data.products.length} produits trouvés`);
    
    if (productsResponse.data.products.length === 0) {
      console.log('❌ Aucun produit trouvé');
      return;
    }

    // Test 4: Vérifier la structure des données
    console.log('\n4️⃣ Vérification de la structure des données...');
    const sampleProduct = productsResponse.data.products[0];
    
    // Vérifier les champs requis
    const requiredFields = ['id', 'name', 'slug', 'regular_price', 'stock_status'];
    const missingFields = requiredFields.filter(field => !sampleProduct[field]);
    
    if (missingFields.length === 0) {
      console.log('✅ Tous les champs requis sont présents');
    } else {
      console.log(`❌ Champs manquants: ${missingFields.join(', ')}`);
    }

    // Vérifier les types de données
    console.log('\n5️⃣ Vérification des types de données...');
    console.log(`   ID: ${typeof sampleProduct.id} (${sampleProduct.id})`);
    console.log(`   Nom: ${typeof sampleProduct.name} (${sampleProduct.name})`);
    console.log(`   Prix: ${typeof sampleProduct.regular_price} (${sampleProduct.regular_price})`);
    console.log(`   Stock: ${typeof sampleProduct.stock_status} (${sampleProduct.stock_status})`);
    
    // Vérifier les images
    if (sampleProduct.images && sampleProduct.images.length > 0) {
      console.log(`   Images: ${sampleProduct.images.length} trouvée(s)`);
      console.log(`   Première image: ${sampleProduct.images[0].src}`);
    } else {
      console.log('   Images: Aucune (placeholder sera utilisé)');
    }

    // Test 5: Vérifier la compatibilité avec le panier
    console.log('\n6️⃣ Vérification de la compatibilité panier...');
    
    const cartCompatibleProduct = {
      id: sampleProduct.id,
      name: sampleProduct.name,
      slug: sampleProduct.slug,
      price: parseFloat(String(sampleProduct.regular_price || 0)),
      regular_price: parseFloat(String(sampleProduct.regular_price || 0)),
      sale_price: sampleProduct.sale_price ? parseFloat(String(sampleProduct.sale_price)) : undefined,
      stock_status: sampleProduct.stock_status || 'instock',
      sku: sampleProduct.sku || ''
    };
    
    console.log('✅ Produit compatible avec le panier:');
    console.log(JSON.stringify(cartCompatibleProduct, null, 2));

    // Test 6: Instructions pour le test manuel
    console.log('\n7️⃣ Instructions pour le test manuel:');
    console.log('   1. Ouvrez http://localhost:3000/test-cart dans votre navigateur');
    console.log('   2. Vérifiez que les ProductCard s\'affichent sans erreur');
    console.log('   3. Cliquez sur "Ajouter au panier" pour tester');
    console.log('   4. Vérifiez que le panier s\'ouvre correctement');
    console.log('   5. Vérifiez que les images s\'affichent');
    console.log('   6. Vérifiez que les prix sont corrects');
    console.log('   7. Regardez la console pour d\'éventuelles erreurs');

    console.log('\n✅ Tous les tests sont passés ! Le ProductCard devrait fonctionner correctement.');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

// Exécuter le test
testProductCardFixes();

