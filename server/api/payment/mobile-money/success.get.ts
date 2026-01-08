// server/api/payment/mobile-money/success.get.ts
import { defineEventHandler, getQuery, sendRedirect } from 'h3'

/**
 * Endpoint appelé après un paiement réussi
 * Redirige vers la page thank-you
 * La commande est créée par le webhook en arrière-plan
 */
export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    
    console.log('============================================')
    console.log('✅ RETOUR APRÈS PAIEMENT RÉUSSI')
    console.log('============================================')
    console.log('Query params:', query)
    console.log('Order ID:', query.order_id || 'Non fourni')
    console.log('Transaction ID:', query.transaction_id || 'Non fourni')
    console.log('============================================')

    // Rediriger vers la page thank-you
    // Les données de commande sont récupérées depuis sessionStorage
    const redirectUrl = `/thank-you?payment_success=true&order_id=${query.order_id || ''}&transaction_id=${query.transaction_id || ''}`
    
    return sendRedirect(event, redirectUrl, 302)

  } catch (err: any) {
    console.error('❌ Erreur lors du traitement du succès:', err)
    
    // Rediriger vers checkout avec erreur
    return sendRedirect(event, '/checkout?payment_failed=true', 302)
  }
})

