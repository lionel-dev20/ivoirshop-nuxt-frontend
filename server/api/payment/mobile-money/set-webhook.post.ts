// server/api/payment/mobile-money/set-webhook.post.ts
import { defineEventHandler, createError } from 'h3'

/**
 * Configure l'URL du webhook auprès de l'API de paiement
 * Cet endpoint appelle l'API DjoNanko pour enregistrer l'URL de callback
 */
export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig()

    // Vérifier les variables d'environnement
    if (!config.MOBILE_MONEY_API_KEY || !config.MOBILE_MONEY_API_SECRET) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Configuration de paiement mobile manquante'
      })
    }

    // Construire l'URL du webhook selon l'environnement
    const siteUrl = config.public.SITE_URL || config.SITE_URL || 'http://localhost:3000'
    const webhookUrl = `${siteUrl}/api/payment/mobile-money/callback`
    const merchant_reference = config.MOBILE_MONEY_REFERENCE || 'ivoirshop'

    console.log('Configuration du webhook:', {
      merchant_reference,
      webhookUrl
    })

    // Données à envoyer à l'API
    const webhookData = {
      reference: merchant_reference,
      webhookUrl: webhookUrl
    }

    const apiUrl = config.MOBILE_MONEY_API_URL || 'https://apidjonanko.tech'

    console.log('============================================')
    console.log('📤 CONFIGURATION DU WEBHOOK:')
    console.log('URL:', `${apiUrl}/web-merchant/set-webhook-url`)
    console.log('Method: PATCH')
    console.log('Headers:', {
      'x-api-key': config.MOBILE_MONEY_API_KEY,
      'x-api-secret': '***' + config.MOBILE_MONEY_API_SECRET.slice(-4),
      'Content-Type': 'application/json'
    })
    console.log('Body:', JSON.stringify(webhookData, null, 2))
    console.log('============================================')

    // Appeler l'API pour configurer le webhook
    const response = await fetch(`${apiUrl}/web-merchant/set-webhook-url`, {
      method: 'PATCH',
      headers: {
        'x-api-key': config.MOBILE_MONEY_API_KEY,
        'x-api-secret': config.MOBILE_MONEY_API_SECRET,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(webhookData)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Erreur API:', errorText)
      throw new Error(`API returned ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()

    console.log('============================================')
    console.log('📥 RÉPONSE DE L\'API:')
    console.log('Status:', response.status)
    console.log('Response:', JSON.stringify(result, null, 2))
    console.log('============================================')

    return {
      success: true,
      message: 'Webhook configuré avec succès',
      webhookUrl: webhookUrl,
      merchant_reference: merchant_reference,
      response: result
    }

  } catch (err: any) {
    console.error('Erreur lors de la configuration du webhook:', err)

    if (err.statusCode) {
      throw err
    }

    throw createError({
      statusCode: 500,
      statusMessage: err.message || 'Erreur lors de la configuration du webhook'
    })
  }
})

