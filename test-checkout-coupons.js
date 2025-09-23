// Script de test pour vérifier le fonctionnement des coupons dans checkout
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const WORDPRESS_URL = 'http://ivoir-shop.local'; // Remplacez par votre URL WordPress

async function testCheckoutCoupons() {
  console.log('🧪 Test des coupons dans checkout...\n');

  try {
    // Test 1: Vérifier l'endpoint de test des coupons
    console.log('1️⃣ Test de l\'endpoint de test des coupons...');
    try {
      const testResponse = await axios.get(`${BASE_URL}/api/coupons/test`);
      console.log(`✅ Endpoint de test accessible (Status: ${testResponse.status})`);
      console.log('   Données:', JSON.stringify(testResponse.data, null, 2));
    } catch (error) {
      console.log(`❌ Endpoint de test non accessible: ${error.message}`);
    }

    // Test 2: Vérifier l'endpoint WordPress personnalisé
    console.log('\n2️⃣ Test de l\'endpoint WordPress personnalisé...');
    try {
      const wpResponse = await axios.get(`${WORDPRESS_URL}/wp-json/custom/v1/coupons`);
      console.log(`✅ Endpoint WordPress personnalisé accessible (Status: ${wpResponse.status})`);
      console.log(`   ${wpResponse.data.length} coupons trouvés`);
      
      if (wpResponse.data.length > 0) {
        console.log('   Premiers coupons:');
        wpResponse.data.slice(0, 3).forEach((coupon, index) => {
          console.log(`     ${index + 1}. ${coupon.code} - ${coupon.description} (${coupon.discount_type}: ${coupon.amount})`);
        });
      }
    } catch (error) {
      console.log(`❌ Endpoint WordPress personnalisé non accessible: ${error.message}`);
    }

    // Test 3: Vérifier l'API WooCommerce standard
    console.log('\n3️⃣ Test de l\'API WooCommerce standard...');
    try {
      const wcResponse = await axios.get(`${WORDPRESS_URL}/wp-json/wc/v3/coupons`, {
        auth: {
          username: 'ck_xxx', // Remplacez par vos clés API
          password: 'cs_xxx'
        }
      });
      console.log(`✅ API WooCommerce accessible (Status: ${wcResponse.status})`);
      console.log(`   ${wcResponse.data.length} coupons trouvés`);
    } catch (error) {
      console.log(`❌ API WooCommerce non accessible: ${error.message}`);
    }

    // Test 4: Tester l'application d'un coupon
    console.log('\n4️⃣ Test de l\'application d\'un coupon...');
    try {
      const applyResponse = await axios.post(`${BASE_URL}/api/coupons/apply`, {
        coupon_code: 'TEST10', // Remplacez par un code de coupon valide
        cart_total: 100
      });
      console.log(`✅ Application de coupon réussie (Status: ${applyResponse.status})`);
      console.log('   Coupon appliqué:', JSON.stringify(applyResponse.data, null, 2));
    } catch (error) {
      console.log(`⚠️  Application de coupon échouée: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Data:`, error.response.data);
      }
    }

    // Test 5: Vérifier la page checkout
    console.log('\n5️⃣ Test de la page checkout...');
    try {
      const checkoutResponse = await axios.get(`${BASE_URL}/checkout`);
      if (checkoutResponse.status === 200) {
        console.log('✅ Page checkout accessible');
      }
    } catch (error) {
      console.log('⚠️  Page checkout non accessible, mais ce n\'est pas critique');
    }

    // Test 6: Instructions pour le test manuel
    console.log('\n6️⃣ Instructions pour le test manuel:');
    console.log('   1. Ouvrez http://localhost:3000/checkout dans votre navigateur');
    console.log('   2. Ajoutez des produits au panier');
    console.log('   3. Remplissez le formulaire de commande');
    console.log('   4. Testez l\'application d\'un coupon');
    console.log('   5. Vérifiez que la réduction est calculée correctement');
    console.log('   6. Regardez la console pour d\'éventuelles erreurs');

    console.log('\n✅ Test terminé ! Vérifiez les résultats ci-dessus.');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
}

// Exécuter le test
testCheckoutCoupons();

