// Script de test pour vérifier le bouton d'ajout au panier
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testCartButton() {
  console.log('🛒 Test du bouton d\'ajout au panier...\n');

  try {
    // Test 1: Vérifier que le store de panier est accessible
    console.log('1️⃣ Vérification du store de panier...');
    try {
      // Test de l'endpoint de test
      const testResponse = await axios.get(`${BASE_URL}/test-cart`);
      if (testResponse.status === 200) {
        console.log('✅ Page de test du panier accessible');
      }
    } catch (error) {
      console.log('⚠️  Page de test non accessible, mais ce n\'est pas critique');
    }

    // Test 2: Récupérer des produits pour tester
    console.log('\n2️⃣ Récupération des produits...');
    const categoriesResponse = await axios.get(`${BASE_URL}/api/api/v1/categories`);
    console.log(`✅ ${categoriesResponse.data.length} catégories trouvées`);
    
    if (categoriesResponse.data.length === 0) {
      console.log('❌ Aucune catégorie trouvée, impossible de tester');
      return;
    }

    // Test 3: Récupérer les produits de la première catégorie
    const firstCategory = categoriesResponse.data[0];
    console.log(`\n3️⃣ Test avec la catégorie: ${firstCategory.name}`);
    
    const productsResponse = await axios.get(`${BASE_URL}/api/api/v1/products/category/${firstCategory.id}`);
    console.log(`✅ ${productsResponse.data.products.length} produits trouvés`);
    
    if (productsResponse.data.products.length === 0) {
      console.log('❌ Aucun produit trouvé dans cette catégorie');
      return;
    }

    // Test 4: Analyser les produits pour le panier
    console.log('\n4️⃣ Analyse des produits pour le panier...');
    
    productsResponse.data.products.slice(0, 3).forEach((product, index) => {
      console.log(`\n📦 Produit ${index + 1}: ${product.name}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Prix: ${product.regular_price}€`);
      console.log(`   Stock: ${product.stock_status}`);
      console.log(`   Peut être ajouté au panier: ${product.stock_status === 'instock' || product.stock_status === 'onbackorder' ? 'Oui' : 'Non'}`);
      
      // Vérifier les données nécessaires pour le panier
      const hasRequiredData = product.id && product.name && product.slug && product.regular_price;
      console.log(`   Données complètes: ${hasRequiredData ? 'Oui' : 'Non'}`);
      
      if (!hasRequiredData) {
        console.log(`   ⚠️  Données manquantes pour le panier`);
      }
    });

    // Test 5: Vérifier la structure des données
    console.log('\n5️⃣ Vérification de la structure des données...');
    const sampleProduct = productsResponse.data.products[0];
    
    const requiredFields = ['id', 'name', 'slug', 'regular_price', 'stock_status'];
    const missingFields = requiredFields.filter(field => !sampleProduct[field]);
    
    if (missingFields.length === 0) {
      console.log('✅ Tous les champs requis sont présents');
    } else {
      console.log(`❌ Champs manquants: ${missingFields.join(', ')}`);
    }

    // Test 6: Vérifier les images
    console.log('\n6️⃣ Vérification des images...');
    if (sampleProduct.images && sampleProduct.images.length > 0) {
      console.log(`✅ ${sampleProduct.images.length} image(s) trouvée(s)`);
      console.log(`   Première image: ${sampleProduct.images[0].src}`);
    } else {
      console.log('⚠️  Aucune image trouvée, le placeholder sera utilisé');
    }

    // Test 7: Instructions pour le test manuel
    console.log('\n7️⃣ Instructions pour le test manuel:');
    console.log('   1. Ouvrez http://localhost:3000/test-cart dans votre navigateur');
    console.log('   2. Cliquez sur "Ajouter au panier" pour différents produits');
    console.log('   3. Vérifiez que le panier s\'ouvre automatiquement');
    console.log('   4. Vérifiez que les articles s\'ajoutent correctement');
    console.log('   5. Testez avec des produits en rupture de stock');
    console.log('   6. Vérifiez les animations et états du bouton');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

// Exécuter le test
testCartButton();

