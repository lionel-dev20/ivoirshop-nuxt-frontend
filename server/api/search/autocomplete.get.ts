import { defineEventHandler, createError } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const searchTerm = query.q as string

    if (!searchTerm || searchTerm.trim().length < 2) {
      return { suggestions: [] }
    }

    // Vérification de l'URL
    if (!process.env.WC_STORE_URL) {
      console.error('Variable d\'environnement WC_STORE_URL manquante')
      throw createError({ 
        statusCode: 500, 
        statusMessage: 'Configuration manquante' 
      })
    }

    // Configuration axios
    const axiosConfig = {
      timeout: 5000,
      headers: {
        'User-Agent': 'Nuxt-WooCommerce-Client/1.0',
        'Content-Type': 'application/json'
      }
    }

    console.log('Autocomplétion pour:', searchTerm)
    
    try {
      // Utiliser l'endpoint d'autocomplétion personnalisé WordPress
      const { data: suggestions } = await axios.get(
        `${process.env.WC_STORE_URL}/wp-json/custom/v1/search/autocomplete`,
        {
          ...axiosConfig,
          params: {
            q: searchTerm,
            limit: 10
          }
        }
      )

      console.log(`${suggestions.length} suggestions trouvées pour "${searchTerm}"`)
      return { suggestions }
      
    } catch (customError: any) {
      console.warn('Endpoint d\'autocomplétion personnalisé non accessible, génération de suggestions de base...', {
        message: customError.message,
        status: customError.response?.status
      })
      
      // Fallback : suggestions de base basées sur le terme de recherche
      const baseSuggestions = [
        `${searchTerm} - Tous les produits`,
        `Vêtements ${searchTerm}`,
        `Accessoires ${searchTerm}`,
        `Électronique ${searchTerm}`,
        `Maison ${searchTerm}`
      ].filter(suggestion => 
        suggestion.toLowerCase().includes(searchTerm.toLowerCase())
      )

      console.log(`${baseSuggestions.length} suggestions de base générées`)
      return { suggestions: baseSuggestions }
    }
    
  } catch (err: any) {
    console.error('Erreur lors de l\'autocomplétion:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    })
    
    throw createError({ 
      statusCode: 500, 
      statusMessage: `Erreur lors de l'autocomplétion: ${err.message}` 
    })
  }
})
