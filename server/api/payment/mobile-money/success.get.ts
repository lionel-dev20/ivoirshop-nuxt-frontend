// server/api/payment/mobile-money/success.get.ts
import { defineEventHandler, getQuery, createError } from 'h3'

/**
 * Endpoint appelé après un paiement réussi
 * Crée la commande dans WooCommerce et redirige vers thank-you
 */
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    
    console.log('Retour après paiement réussi, query:', query)

    // Récupérer les données du checkout depuis le cookie/session
    // Note: En production, vous devriez sécuriser cela mieux (par exemple avec un token)
    const checkoutData = event.node.req.headers.cookie?.includes('pendingCheckout')
    
    // Pour l'instant, on redirige vers une page qui va gérer la création
    // La création se fera côté client avec les données du sessionStorage
    
    return {
      statusCode: 302,
      headers: {
        'Location': `/payment/process-success?${new URLSearchParams(query as any).toString()}`
      }
    }

  } catch (err: any) {
    console.error('Erreur lors du traitement du succès:', err)
    
    // Rediriger vers checkout avec erreur
    return {
      statusCode: 302,
      headers: {
        'Location': '/checkout?payment_failed=true'
      }
    }
  }
})

