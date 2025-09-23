// Script de test pour vérifier la correction de l'erreur 502
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const WORDPRESS_URL = 'http://ivoir-shop.local'; // Remplacez par votre URL WordPress

async function testCategoriesFix() {
  console.log('🔧 Test de la correction de l\'erreur 502...\n');

  try {
    // Test 1: Vérifier l'endpoint Nuxt
    console.log('1️⃣ Test de l\'endpoint Nuxt...');
    try {
      const nuxtResponse = await axios.get(`${BASE_URL}/api/api/v1/categories`);
      console.log(`✅ Endpoint Nuxt accessible (Status: ${nuxtResponse.status})`);
      console.log(`   ${nuxtResponse.data.length} catégories trouvées`);
      
      if (nuxtResponse.data.length > 0) {
        console.log('   Premières catégories:');
        nuxtResponse.data.slice(0, 3).forEach((cat, index) => {
          console.log(`     ${index + 1}. ${cat.name} (${cat.slug}) - ${cat.count} produits`);
        });
      }
    } catch (error) {
      console.log(`❌ Endpoint Nuxt non accessible: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Data:`, error.response.data);
      }
      return;
    }

    // Test 2: Vérifier l'endpoint WordPress personnalisé
    console.log('\n2️⃣ Test de l\'endpoint WordPress personnalisé...');
    try {
      const wpResponse = await axios.get(`${WORDPRESS_URL}/wp-json/custom/v1/categories`);
      console.log(`✅ Endpoint WordPress personnalisé accessible (Status: ${wpResponse.status})`);
      console.log(`   ${wpResponse.data.length} catégories trouvées`);
    } catch (error) {
      console.log(`⚠️  Endpoint WordPress personnalisé non accessible: ${error.message}`);
      console.log('   Le système utilisera le fallback WooCommerce ou les données de test');
    }

    // Test 3: Vérifier l'API WooCommerce standard
    console.log('\n3️⃣ Test de l\'API WooCommerce standard...');
    try {
      const wcResponse = await axios.get(`${WORDPRESS_URL}/wp-json/wc/v3/products/categories`, {
        auth: {
          username: 'ck_xxx', // Remplacez par vos clés API
          password: 'cs_xxx'
        }
      });
      console.log(`✅ API WooCommerce accessible (Status: ${wcResponse.status})`);
      console.log(`   ${wcResponse.data.length} catégories trouvées`);
    } catch (error) {
      console.log(`⚠️  API WooCommerce non accessible: ${error.message}`);
      console.log('   Le système utilisera les données de test');
    }

    // Test 4: Vérifier la page de test
    console.log('\n4️⃣ Test de la page de test...');
    try {
      const testPageResponse = await axios.get(`${BASE_URL}/test-cart`);
      if (testPageResponse.status === 200) {
        console.log('✅ Page de test accessible');
      }
    } catch (error) {
      console.log('⚠️  Page de test non accessible, mais ce n\'est pas critique');
    }

    // Test 5: Vérifier le composant Nouveaute
    console.log('\n5️⃣ Test du composant Nouveaute...');
    try {
      const nouveauteResponse = await axios.get(`${BASE_URL}/test-nouveaute`);
      if (nouveauteResponse.status === 200) {
        console.log('✅ Page de test Nouveaute accessible');
      }
    } catch (error) {
      console.log('⚠️  Page de test Nouveaute non accessible');
    }

    // Test 6: Instructions pour le test manuel
    console.log('\n6️⃣ Instructions pour le test manuel:');
    console.log('   1. Ouvrez http://localhost:3000/test-cart dans votre navigateur');
    console.log('   2. Vérifiez que les catégories s\'affichent');
    console.log('   3. Testez le composant Nouveaute');
    console.log('   4. Vérifiez que les produits s\'affichent');
    console.log('   5. Testez le bouton "Ajouter au panier"');
    console.log('   6. Regardez la console pour d\'éventuelles erreurs');

    console.log('\n✅ Test terminé ! L\'endpoint devrait maintenant fonctionner avec le système de fallback.');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
}

// Exécuter le test
testCategoriesFix();

