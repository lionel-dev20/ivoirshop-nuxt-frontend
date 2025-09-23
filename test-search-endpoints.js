// Script de test pour les endpoints de recherche
const axios = require('axios')

const BASE_URL = 'http://localhost:3000'
const WP_URL = 'https://ivoir-shop.local' // Remplacez par votre URL WordPress

async function testSearchEndpoints() {
  console.log('🔍 Test des endpoints de recherche...\n')

  try {
    // Test 1: Endpoint de recherche Nuxt
    console.log('1. Test endpoint de recherche Nuxt (/api/search)')
    try {
      const searchResponse = await axios.get(`${BASE_URL}/api/search`, {
        params: { q: 'téléphone' }
      })
      console.log('✅ Recherche Nuxt réussie')
      console.log(`   - ${searchResponse.data.products.length} produits trouvés`)
      console.log(`   - Total: ${searchResponse.data.total}`)
      if (searchResponse.data.products.length > 0) {
        console.log(`   - Premier produit: ${searchResponse.data.products[0].name}`)
      }
    } catch (error) {
      console.log('❌ Erreur recherche Nuxt:', error.response?.data || error.message)
    }

    console.log('\n' + '='.repeat(50) + '\n')

    // Test 2: Endpoint d'autocomplétion Nuxt
    console.log('2. Test endpoint d\'autocomplétion Nuxt (/api/search/autocomplete)')
    try {
      const autocompleteResponse = await axios.get(`${BASE_URL}/api/search/autocomplete`, {
        params: { q: 'tel' }
      })
      console.log('✅ Autocomplétion Nuxt réussie')
      console.log(`   - ${autocompleteResponse.data.suggestions.length} suggestions trouvées`)
      autocompleteResponse.data.suggestions.forEach((suggestion, index) => {
        console.log(`   - ${index + 1}. [${suggestion.type}] ${suggestion.name}`)
      })
    } catch (error) {
      console.log('❌ Erreur autocomplétion Nuxt:', error.response?.data || error.message)
    }

    console.log('\n' + '='.repeat(50) + '\n')

    // Test 3: Endpoint de recherche WordPress direct
    console.log('3. Test endpoint de recherche WordPress direct')
    try {
      const wpSearchResponse = await axios.get(`${WP_URL}/wp-json/custom/v1/search`, {
        params: { q: 'téléphone' }
      })
      console.log('✅ Recherche WordPress directe réussie')
      console.log(`   - ${wpSearchResponse.data.products.length} produits trouvés`)
      console.log(`   - Total: ${wpSearchResponse.data.total}`)
    } catch (error) {
      console.log('❌ Erreur recherche WordPress directe:', error.response?.data || error.message)
    }

    console.log('\n' + '='.repeat(50) + '\n')

    // Test 4: Endpoint d'autocomplétion WordPress direct
    console.log('4. Test endpoint d\'autocomplétion WordPress direct')
    try {
      const wpAutocompleteResponse = await axios.get(`${WP_URL}/wp-json/custom/v1/search/autocomplete`, {
        params: { q: 'tel' }
      })
      console.log('✅ Autocomplétion WordPress directe réussie')
      console.log(`   - ${wpAutocompleteResponse.data.suggestions.length} suggestions trouvées`)
      wpAutocompleteResponse.data.suggestions.forEach((suggestion, index) => {
        console.log(`   - ${index + 1}. [${suggestion.type}] ${suggestion.name}`)
      })
    } catch (error) {
      console.log('❌ Erreur autocomplétion WordPress directe:', error.response?.data || error.message)
    }

    console.log('\n' + '='.repeat(50) + '\n')

    // Test 5: Test de différents termes de recherche
    console.log('5. Test avec différents termes de recherche')
    const testTerms = ['vêtement', 'électronique', 'maison', 'sport']
    
    for (const term of testTerms) {
      try {
        const response = await axios.get(`${BASE_URL}/api/search`, {
          params: { q: term }
        })
        console.log(`   - "${term}": ${response.data.products.length} résultats`)
      } catch (error) {
        console.log(`   - "${term}": Erreur - ${error.response?.data?.message || error.message}`)
      }
    }

    console.log('\n' + '='.repeat(50) + '\n')

    // Test 6: Test des filtres de recherche
    console.log('6. Test des filtres de recherche')
    try {
      const filteredResponse = await axios.get(`${BASE_URL}/api/search`, {
        params: { 
          q: 'produit',
          in_stock: true,
          on_sale: false,
          per_page: 5
        }
      })
      console.log('✅ Filtres de recherche testés')
      console.log(`   - Produits en stock: ${filteredResponse.data.products.length}`)
      console.log(`   - Limite: ${filteredResponse.data.per_page}`)
    } catch (error) {
      console.log('❌ Erreur filtres de recherche:', error.response?.data || error.message)
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error.message)
  }
}

// Fonction pour tester la page de recherche
async function testSearchPage() {
  console.log('\n🌐 Test de la page de recherche...\n')
  
  try {
    const response = await axios.get(`${BASE_URL}/recherche?q=téléphone`)
    console.log('✅ Page de recherche accessible')
    console.log(`   - Status: ${response.status}`)
    console.log(`   - Taille: ${response.data.length} caractères`)
  } catch (error) {
    console.log('❌ Erreur page de recherche:', error.response?.status, error.message)
  }
}

// Exécution des tests
async function runAllTests() {
  console.log('🚀 Démarrage des tests de recherche\n')
  
  await testSearchEndpoints()
  await testSearchPage()
  
  console.log('\n✅ Tests terminés!')
  console.log('\n📝 Instructions:')
  console.log('1. Vérifiez que votre serveur Nuxt est démarré (npm run dev)')
  console.log('2. Vérifiez que votre site WordPress est accessible')
  console.log('3. Testez la recherche sur http://localhost:3000/recherche?q=téléphone')
  console.log('4. Testez l\'autocomplétion dans la barre de recherche du header')
}

runAllTests()
