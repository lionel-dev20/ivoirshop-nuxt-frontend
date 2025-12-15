// Script pour lister toutes les catégories avec leurs IDs
// Usage: node scripts/list-categories.js

import fetch from 'node-fetch';

const WORDPRESS_URL = process.env.WORDPRESS_URL || 'https://admin.ivoirshop.ci';
const CONSUMER_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET;

async function listCategories() {
  try {
    console.log('🔍 Récupération des catégories depuis WooCommerce...\n');
    
    // Essayer l'endpoint personnalisé d'abord
    let categories;
    try {
      const response = await fetch(`${WORDPRESS_URL}/wp-json/custom/v1/categories`);
      categories = await response.json();
    } catch (err) {
      // Fallback vers WooCommerce standard
      const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');
      const response = await fetch(
        `${WORDPRESS_URL}/wp-json/wc/v3/products/categories?per_page=100`,
        {
          headers: {
            'Authorization': `Basic ${auth}`
          }
        }
      );
      categories = await response.json();
    }

    if (!categories || categories.length === 0) {
      console.log('❌ Aucune catégorie trouvée');
      return;
    }

    console.log(`✅ ${categories.length} catégories trouvées\n`);
    console.log('📋 LISTE DES CATÉGORIES :\n');
    console.log('┌─────┬────────────────────────────────┬──────────────────────────────┬──────────┐');
    console.log('│ ID  │ Nom                            │ Slug                         │ Produits │');
    console.log('├─────┼────────────────────────────────┼──────────────────────────────┼──────────┤');
    
    categories.forEach(cat => {
      const id = String(cat.id).padEnd(4);
      const name = (cat.name || '').substring(0, 30).padEnd(32);
      const slug = (cat.slug || '').substring(0, 28).padEnd(30);
      const count = String(cat.count || 0).padStart(8);
      console.log(`│ ${id}│ ${name}│ ${slug}│ ${count} │`);
    });
    
    console.log('└─────┴────────────────────────────────┴──────────────────────────────┴──────────┘\n');
    
    console.log('💡 COMMENT UTILISER :');
    console.log('   Utilisez l\'ID dans votre composant comme ceci :');
    console.log('   <Nouveaute :category-id="123" />\n');
    
    // Rechercher spécifiquement "la-promo"
    const promo = categories.find(c => c.slug && c.slug.includes('promo'));
    if (promo) {
      console.log('🎯 CATÉGORIE "PROMO" TROUVÉE :');
      console.log(`   ID: ${promo.id}`);
      console.log(`   Nom: ${promo.name}`);
      console.log(`   Slug: ${promo.slug}`);
      console.log(`\n   ➜ Utilisez: <Nouveaute :category-id="${promo.id}" />\n`);
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

listCategories();

