// Test de l'API de paiement
// Lancez avec : node test-payment-api.js

const API_KEY = 'DJN-ef383bb7-2c4d-4efa-92a0-4e23f0dcf1d5';
const API_SECRET = '3e44f3e16cbd39a6107f4e8a642c908b7bdeed0966b7b9baf68ae4382b583bca';

// MODIFIEZ CETTE URL SELON VOTRE API
const API_URL = 'https://apidjonanko.tech/v1/payment/initiate';

async function testPaymentAPI() {
  console.log('🧪 Test de l\'API de paiement...\n');
  console.log('URL:', API_URL);
  console.log('API Key:', API_KEY);
  console.log('\n---\n');

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY,
        'x-api-secret': API_SECRET,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: 1000,
        merchant_reference: 'test-ivoirshop'
      })
    });

    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    const result = await response.text();
    console.log('\nRéponse:', result);

    if (response.ok) {
      console.log('\n✅ L\'API fonctionne !');
    } else {
      console.log('\n❌ L\'API a retourné une erreur');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.log('\nCauses possibles:');
    console.log('1. L\'URL de l\'API est incorrecte');
    console.log('2. L\'API n\'est pas accessible');
    console.log('3. Le endpoint n\'existe pas');
  }
}

testPaymentAPI();

