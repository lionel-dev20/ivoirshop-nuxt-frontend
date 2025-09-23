// Script de diagnostic pour la connexion WordPress
const axios = require('axios');

const WORDPRESS_URL = 'http://ivoir-shop.local'; // Remplacez par votre URL WordPress

async function debugWordPressConnection() {
  console.log('🔍 Diagnostic de la connexion WordPress...\n');

  try {
    // Test 1: Vérifier que WordPress est accessible
    console.log('1️⃣ Test de base de WordPress...');
    try {
      const wpResponse = await axios.get(`${WORDPRESS_URL}/`, { timeout: 5000 });
      console.log(`✅ WordPress accessible (Status: ${wpResponse.status})`);
    } catch (error) {
      console.log(`❌ WordPress non accessible: ${error.message}`);
      if (error.code === 'ECONNREFUSED') {
        console.log('   💡 Vérifiez que votre serveur WordPress est démarré');
        console.log('   💡 Vérifiez l\'URL dans votre configuration');
      }
      return;
    }

    // Test 2: Vérifier l'API REST WordPress
    console.log('\n2️⃣ Test de l\'API REST WordPress...');
    try {
      const restResponse = await axios.get(`${WORDPRESS_URL}/wp-json/`, { timeout: 5000 });
      console.log(`✅ API REST WordPress accessible (Status: ${restResponse.status})`);
      console.log(`   Version: ${restResponse.data?.version || 'Inconnue'}`);
    } catch (error) {
      console.log(`❌ API REST WordPress non accessible: ${error.message}`);
      return;
    }

    // Test 3: Vérifier l'endpoint custom/v1/categories
    console.log('\n3️⃣ Test de l\'endpoint custom/v1/categories...');
    try {
      const categoriesResponse = await axios.get(`${WORDPRESS_URL}/wp-json/custom/v1/categories`, { timeout: 5000 });
      console.log(`✅ Endpoint custom/v1/categories accessible (Status: ${categoriesResponse.status})`);
      console.log(`   ${categoriesResponse.data.length} catégories trouvées`);
      
      if (categoriesResponse.data.length > 0) {
        console.log('   Premières catégories:');
        categoriesResponse.data.slice(0, 3).forEach((cat, index) => {
          console.log(`     ${index + 1}. ${cat.name} (${cat.slug}) - ${cat.count} produits`);
        });
      }
    } catch (error) {
      console.log(`❌ Endpoint custom/v1/categories non accessible: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Data:`, error.response.data);
      }
      
      // Test alternatif avec l'API WooCommerce standard
      console.log('\n4️⃣ Test avec l\'API WooCommerce standard...');
      try {
        const wcResponse = await axios.get(`${WORDPRESS_URL}/wp-json/wc/v3/products/categories`, { 
          timeout: 5000,
          auth: {
            username: 'ck_xxx', // Remplacez par vos clés API
            password: 'cs_xxx'
          }
        });
        console.log(`✅ API WooCommerce accessible (Status: ${wcResponse.status})`);
        console.log(`   ${wcResponse.data.length} catégories trouvées`);
      } catch (wcError) {
        console.log(`❌ API WooCommerce non accessible: ${wcError.message}`);
        if (wcError.response?.status === 401) {
          console.log('   💡 Vérifiez vos clés API WooCommerce');
        }
      }
    }

    // Test 4: Vérifier les endpoints de test
    console.log('\n5️⃣ Test des endpoints de test...');
    try {
      const testResponse = await axios.get(`${WORDPRESS_URL}/wp-json/test/v1/wc-status`, { timeout: 5000 });
      console.log(`✅ Endpoint de test accessible (Status: ${testResponse.status})`);
      console.log('   Données de test:', JSON.stringify(testResponse.data, null, 2));
    } catch (error) {
      console.log(`❌ Endpoint de test non accessible: ${error.message}`);
    }

    // Test 5: Vérifier la configuration Nuxt
    console.log('\n6️⃣ Vérification de la configuration...');
    console.log(`   WORDPRESS_URL: ${WORDPRESS_URL}`);
    console.log(`   Endpoint testé: ${WORDPRESS_URL}/wp-json/custom/v1/categories`);
    
    // Test 6: Suggestions de résolution
    console.log('\n7️⃣ Suggestions de résolution:');
    console.log('   1. Vérifiez que WordPress est démarré et accessible');
    console.log('   2. Vérifiez que le code dans functions.php est correctement ajouté');
    console.log('   3. Vérifiez que les endpoints custom sont enregistrés');
    console.log('   4. Vérifiez les logs d\'erreur WordPress');
    console.log('   5. Testez l\'URL directement dans le navigateur');

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
  }
}

// Exécuter le diagnostic
debugWordPressConnection();

