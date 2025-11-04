#!/usr/bin/env node

/**
 * Script de test pour vérifier la configuration de production
 * Usage: node scripts/test-production-config.js
 */

const https = require('https');
const http = require('http');

// Configuration
const config = {
  WORDPRESS_URL: process.env.WORDPRESS_URL || 'https://admin.ivoirshop.ci',
  WOOCOMMERCE_CONSUMER_KEY: process.env.WOOCOMMERCE_CONSUMER_KEY,
  WOOCOMMERCE_CONSUMER_SECRET: process.env.WOOCOMMERCE_CONSUMER_SECRET,
  TEST_PRODUCT_SLUG: 'ilux-fer-a-repasser-a-vapeur-il-8098-2200-w-violet'
};

console.log('🧪 Test de configuration de production');
console.log('=====================================\n');

// Fonction pour faire une requête HTTP/HTTPS
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const req = protocol.request(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Nuxt-Production-Test/1.0',
        'Content-Type': 'application/json'
      },
      ...options
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            data: JSON.parse(data),
            headers: res.headers
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            data: data,
            headers: res.headers
          });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Timeout')));
    req.end();
  });
}

// Test 1: Vérifier l'accès à WordPress
async function testWordPressAccess() {
  console.log('1️⃣ Test d\'accès à WordPress...');
  try {
    const response = await makeRequest(`${config.WORDPRESS_URL}/wp-json/wp/v2/`);
    if (response.statusCode === 200) {
      console.log('✅ WordPress accessible');
      console.log(`   Version: ${response.data.version || 'Inconnue'}`);
    } else {
      console.log(`❌ WordPress inaccessible (${response.statusCode})`);
    }
  } catch (error) {
    console.log(`❌ Erreur WordPress: ${error.message}`);
  }
  console.log('');
}

// Test 2: Vérifier l'endpoint personnalisé
async function testCustomEndpoint() {
  console.log('2️⃣ Test de l\'endpoint personnalisé...');
  try {
    const url = `${config.WORDPRESS_URL}/wp-json/custom/v1/product/${config.TEST_PRODUCT_SLUG}`;
    const response = await makeRequest(url);
    if (response.statusCode === 200) {
      console.log('✅ Endpoint personnalisé accessible');
      console.log(`   Produit: ${response.data.product?.name || 'Inconnu'}`);
    } else {
      console.log(`❌ Endpoint personnalisé inaccessible (${response.statusCode})`);
      console.log(`   Réponse: ${JSON.stringify(response.data).substring(0, 100)}...`);
    }
  } catch (error) {
    console.log(`❌ Erreur endpoint: ${error.message}`);
  }
  console.log('');
}

// Test 3: Vérifier l'API WooCommerce (si les clés sont disponibles)
async function testWooCommerceAPI() {
  console.log('3️⃣ Test de l\'API WooCommerce...');
  
  if (!config.WOOCOMMERCE_CONSUMER_KEY || !config.WOOCOMMERCE_CONSUMER_SECRET) {
    console.log('⚠️  Clés API WooCommerce non configurées');
    console.log('   Configurez WOOCOMMERCE_CONSUMER_KEY et WOOCOMMERCE_CONSUMER_SECRET');
    console.log('');
    return;
  }

  try {
    const auth = Buffer.from(`${config.WOOCOMMERCE_CONSUMER_KEY}:${config.WOOCOMMERCE_CONSUMER_SECRET}`).toString('base64');
    const url = `${config.WORDPRESS_URL}/wp-json/wc/v3/products?per_page=1`;
    const response = await makeRequest(url, {
      headers: {
        'Authorization': `Basic ${auth}`
      }
    });
    
    if (response.statusCode === 200) {
      console.log('✅ API WooCommerce accessible');
      console.log(`   Produits trouvés: ${response.data.length}`);
    } else {
      console.log(`❌ API WooCommerce inaccessible (${response.statusCode})`);
      console.log(`   Réponse: ${JSON.stringify(response.data).substring(0, 100)}...`);
    }
  } catch (error) {
    console.log(`❌ Erreur API WooCommerce: ${error.message}`);
  }
  console.log('');
}

// Test 4: Vérifier les variables d'environnement
function testEnvironmentVariables() {
  console.log('4️⃣ Test des variables d\'environnement...');
  
  const requiredVars = [
    'WORDPRESS_URL',
    'WC_STORE_URL',
    'WOOCOMMERCE_CONSUMER_KEY',
    'WOOCOMMERCE_CONSUMER_SECRET'
  ];
  
  const missing = [];
  const present = [];
  
  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      present.push(varName);
    } else {
      missing.push(varName);
    }
  });
  
  if (present.length > 0) {
    console.log(`✅ Variables configurées: ${present.join(', ')}`);
  }
  
  if (missing.length > 0) {
    console.log(`❌ Variables manquantes: ${missing.join(', ')}`);
  }
  
  console.log('');
}

// Fonction principale
async function runTests() {
  console.log(`Configuration actuelle:`);
  console.log(`- WORDPRESS_URL: ${config.WORDPRESS_URL}`);
  console.log(`- WC_STORE_URL: ${process.env.WC_STORE_URL || 'Non défini'}`);
  console.log(`- CONSUMER_KEY: ${config.WOOCOMMERCE_CONSUMER_KEY ? 'Configuré' : 'Non défini'}`);
  console.log(`- CONSUMER_SECRET: ${config.WOOCOMMERCE_CONSUMER_SECRET ? 'Configuré' : 'Non défini'}`);
  console.log('');

  await testEnvironmentVariables();
  await testWordPressAccess();
  await testCustomEndpoint();
  await testWooCommerceAPI();
  
  console.log('🎯 Résumé des tests terminé');
  console.log('Si tous les tests passent, votre configuration de production devrait fonctionner.');
}

// Exécuter les tests
runTests().catch(console.error);



























