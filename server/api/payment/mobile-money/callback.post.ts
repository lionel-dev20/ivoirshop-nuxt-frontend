// server/api/payment/mobile-money/callback.post.ts
import { defineEventHandler, readBody, createError } from 'h3'

/**
 * Endpoint de callback pour recevoir les notifications de paiement
 * Ce endpoint sera appelé par votre service de paiement après la transaction
 * Format du webhook: { transaction_id, status, amount, createdAt, updatedAt }
 */
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    console.log('Callback de paiement reçu:', body)

    // Valider la signature/hash si nécessaire
    // TODO: Implémenter la validation de sécurité si votre API l'exige
    
    // Extraire les données du callback selon votre format
    const {
      transaction_id,
      status,
      amount,
      createdAt,
      updatedAt
    } = body

    // Validation des données reçues
    if (!transaction_id || !status) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Données de callback invalides'
      })
    }

    // Vérifier le statut du paiement
    if (status === 'success' || status === 'completed') {
      console.log('Paiement confirmé:', {
        transaction_id,
        amount,
        status,
        createdAt,
        updatedAt
      })

      // TODO: Mettre à jour le statut de la commande dans WooCommerce
      // Vous pouvez appeler l'API WooCommerce ici pour mettre à jour le statut
      // Exemple:
      // await updateOrderStatus(order_id, 'processing', transaction_id)
      
      return {
        success: true,
        message: 'Paiement confirmé et enregistré'
      }
    } else if (status === 'pending') {
      console.log('Paiement en attente:', {
        transaction_id,
        amount,
        status
      })

      return {
        success: true,
        message: 'Paiement en attente'
      }
    } else {
      console.log('Paiement échoué:', {
        transaction_id,
        status,
        amount
      })

      return {
        success: false,
        message: 'Paiement échoué'
      }
    }

  } catch (err: any) {
    console.error('Erreur dans le callback de paiement:', err)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors du traitement du callback'
    })
  }
})

