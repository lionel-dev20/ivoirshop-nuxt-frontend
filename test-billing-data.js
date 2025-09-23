// Script de test pour vérifier les données billing
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testBillingData() {
  console.log('🧪 Test des données billing...\n');

  try {
    // Données de test avec structure billing et shipping
    const testOrderData = {
      customer: {
        firstName: 'Eric',
        lastName: 'Atangana',
        email: 'lioneleda.dev@gmail.com',
        phone: '671242099',
        notes: 'Test de commande'
      },
      billing: {
        first_name: 'Eric',
        last_name: 'Atangana',
        email: 'lioneleda.dev@gmail.com',
        phone: '671242099',
        address_1: 'Cocody', // Commune sélectionnée
        city: 'Abidjan', // Ville sélectionnée
        state: '',
        postcode: '',
        country: 'CI'
      },
      shipping: {
        first_name: 'Eric',
        last_name: 'Atangana',
        email: 'lioneleda.dev@gmail.com',
        phone: '671242099',
        address_1: 'Cocody', // Commune sélectionnée
        city: 'Abidjan', // Ville sélectionnée
        state: '',
        postcode: '',
        country: 'CI'
      },
      items: [
        {
          id: 1,
          name: 'Produit test',
          quantity: 1,
          price: 100
        }
      ],
      shipping_cost: 5.00,
      total: 105.00,
      payment_method: 'cod',
      delivery_info: {
        city_id: 1,
        city_name: 'Abidjan',
        commune_id: 1,
        commune_name: 'Cocody',
        product_type: 'medium'
      },
      coupon: null
    };

    console.log('1️⃣ Test de l\'endpoint de test billing...');
    try {
      const testResponse = await axios.post(`${BASE_URL}/api/orders/test-billing`, testOrderData);
      console.log(`✅ Endpoint de test accessible (Status: ${testResponse.status})`);
      console.log('   Données billing envoyées:', JSON.stringify(testOrderData.billing, null, 2));
      console.log('   Données shipping envoyées:', JSON.stringify(testOrderData.shipping, null, 2));
      console.log('   Réponse reçue:', JSON.stringify(testResponse.data, null, 2));
    } catch (error) {
      console.log(`❌ Endpoint de test non accessible: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Data:`, error.response.data);
      }
    }

    console.log('\n2️⃣ Test de l\'endpoint de création de commande...');
    try {
      const createResponse = await axios.post(`${BASE_URL}/api/orders/create`, testOrderData);
      console.log(`✅ Commande créée (Status: ${createResponse.status})`);
      console.log('   Réponse:', JSON.stringify(createResponse.data, null, 2));
    } catch (error) {
      console.log(`❌ Erreur création commande: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Data:`, error.response.data);
      }
    }

    console.log('\n3️⃣ Instructions pour vérifier dans WooCommerce:');
    console.log('   1. Allez dans WooCommerce > Commandes');
    console.log('   2. Trouvez la commande de test');
    console.log('   3. Vérifiez les champs billing:');
    console.log('      - Prénom: Eric');
    console.log('      - Nom: Atangana');
    console.log('      - Email: lioneleda.dev@gmail.com');
    console.log('      - Téléphone: 671242099');
    console.log('      - Adresse: Cocody');
    console.log('      - Ville: Abidjan');
    console.log('      - Pays: Côte d\'Ivoire');
    console.log('   4. Vérifiez les champs shipping:');
    console.log('      - Adresse: Cocody');
    console.log('      - Ville: Abidjan');
    console.log('      - Pays: Côte d\'Ivoire');
    console.log('      - Téléphone: 671242099');

    console.log('\n4️⃣ Structure des données billing attendue:');
    console.log(JSON.stringify(testOrderData.billing, null, 2));

    console.log('\n✅ Test terminé ! Vérifiez les résultats dans WooCommerce.');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
  }
}

// Exécuter le test
testBillingData();
