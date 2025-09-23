// Script de test pour vérifier les images des produits
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const WORDPRESS_URL = 'http://ivoir-shop.local'; // Remplacez par votre URL WordPress

async function testProductImages() {
  console.log('🖼️ Test des images de produits...\n');

  try {
    // Test 1: Récupérer les catégories
    console.log('1️⃣ Récupération des catégories...');
    const categoriesResponse = await axios.get(`${BASE_URL}/api/api/v1/categories`);
    console.log(`✅ ${categoriesResponse.data.length} catégories trouvées`);
    
    if (categoriesResponse.data.length === 0) {
      console.log('❌ Aucune catégorie trouvée, impossible de tester les images');
      return;
    }

    // Test 2: Récupérer les produits de la première catégorie
    const firstCategory = categoriesResponse.data[0];
    console.log(`\n2️⃣ Test avec la catégorie: ${firstCategory.name} (${firstCategory.slug})`);
    
    const productsResponse = await axios.get(`${BASE_URL}/api/api/v1/products/category/${firstCategory.id}`);
    console.log(`✅ ${productsResponse.data.products.length} produits trouvés`);
    
    if (productsResponse.data.products.length === 0) {
      console.log('❌ Aucun produit trouvé dans cette catégorie');
      return;
    }

    // Test 3: Analyser les images des produits
    console.log('\n3️⃣ Analyse des images des produits...');
    
    productsResponse.data.products.slice(0, 5).forEach((product, index) => {
      console.log(`\n📦 Produit ${index + 1}: ${product.name}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Slug: ${product.slug}`);
      
      // Vérifier les images
      if (product.images && product.images.length > 0) {
        console.log(`   ✅ ${product.images.length} image(s) trouvée(s):`);
        product.images.forEach((img, imgIndex) => {
          console.log(`      ${imgIndex + 1}. ID: ${img.id}, Src: ${img.src}`);
          console.log(`         Alt: ${img.alt || 'Aucun alt'}`);
        });
      } else {
        console.log(`   ❌ Aucune image trouvée`);
      }
      
      // Vérifier les prix
      console.log(`   Prix: ${product.regular_price}€`);
      if (product.sale_price) {
        console.log(`   Prix promo: ${product.sale_price}€`);
        console.log(`   En promo: ${product.on_sale ? 'Oui' : 'Non'}`);
      }
      
      // Vérifier le stock
      console.log(`   Stock: ${product.stock_status}`);
    });

    // Test 4: Tester l'accessibilité des images
    console.log('\n4️⃣ Test d\'accessibilité des images...');
    
    for (const product of productsResponse.data.products.slice(0, 3)) {
      if (product.images && product.images.length > 0) {
        const imageUrl = product.images[0].src;
        console.log(`\n🔍 Test de l'image: ${imageUrl}`);
        
        try {
          const imageResponse = await axios.head(imageUrl, { timeout: 5000 });
          console.log(`   ✅ Image accessible (Status: ${imageResponse.status})`);
        } catch (imageError) {
          console.log(`   ❌ Image non accessible: ${imageError.message}`);
          if (imageError.response) {
            console.log(`      Status: ${imageError.response.status}`);
          }
        }
      }
    }

    // Test 5: Vérifier le format des données
    console.log('\n5️⃣ Vérification du format des données...');
    const sampleProduct = productsResponse.data.products[0];
    console.log('Structure du produit:');
    console.log(JSON.stringify({
      id: sampleProduct.id,
      name: sampleProduct.name,
      slug: sampleProduct.slug,
      images: sampleProduct.images?.length || 0,
      regular_price: sampleProduct.regular_price,
      sale_price: sampleProduct.sale_price,
      on_sale: sampleProduct.on_sale,
      stock_status: sampleProduct.stock_status
    }, null, 2));

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

// Exécuter le test
testProductImages();

