// server/api/payment/mobile-money/create-link.post.ts
import { defineEventHandler, readBody, createError, setResponseStatus } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const config = useRuntimeConfig()

    // Validation des données
    if (!body.amount) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Données manquantes (amount requis)'
      })
    }

    // Validation optionnelle des métadonnées
    if (body.metadata?.phoneNumber) {
      const phoneRegex = /^\+225[0-9]{10}$/
      if (!phoneRegex.test(body.metadata.phoneNumber)) {
        console.warn('⚠️ Format de téléphone invalide dans metadata:', body.metadata.phoneNumber)
      }
    }

    console.log('Création du lien de paiement:', {
      amount: body.amount,
      customer: body.customer_name
    })

    // Générer les URLs de retour (automatique selon l'environnement)
    const siteUrl = config.public.SITE_URL || config.SITE_URL || 'http://localhost:3000'
    const returnUrl = body.return_url || `${siteUrl}/thank-you?order_id=${body.order_id || ''}`
    const cancelUrl = body.cancel_url || `${siteUrl}/checkout?payment_failed=true&order_id=${body.order_id || ''}`

    // Préparer les données pour l'API de paiement (nouveau modèle)
    const paymentData = {
      amount: parseInt(body.amount),
      merchant_reference: body.merchant_reference || config.MOBILE_MONEY_REFERENCE || 'ivoirshop',
      return_url: returnUrl,
      cancel_url: cancelUrl,
      metadata: {
        // 📝 Identifiants
        order_id: body.order_id || body.metadata?.order_id || '',
        
        // 👤 Informations client
        customer_name: body.customer_name || body.metadata?.customer_name || '',
        email: body.customer_email || body.metadata?.email || 'customer@email.com',
        
        // 📞 Contact
        phoneNumber: body.phone || body.metadata?.phoneNumber || '',
        customer_phone: body.customer_phone || body.metadata?.customer_phone || '',
        
        // 📍 Localisation
        customer_city: body.customer_city || body.metadata?.customer_city || '',
        customer_commune: body.customer_commune || body.metadata?.customer_commune || '',
        customer_address_details: body.customer_address_details || body.metadata?.customer_address_details || '',
        
        // 🛒 PANIER : Liste des produits commandés (pour traçabilité)
        // Format: [{ product_id, name, quantity, price, total }]
        cart_items: body.cart_items || body.metadata?.cart_items || []
      }
    }

    const apiUrl = config.MOBILE_MONEY_API_URL || 'https://apidjonanko.tech'
    
    // 📋 AFFICHER LE PAYLOAD COMPLET
    console.log('============================================')
    console.log('📤 PAYLOAD ENVOYÉ À L\'API DE PAIEMENT:')
    console.log('URL:', `${apiUrl}/web-merchant/create-web-payment-link`)
    console.log('Method: POST')
    console.log('Headers:', {
      'x-api-key': config.MOBILE_MONEY_API_KEY,
      'x-api-secret': '***' + config.MOBILE_MONEY_API_SECRET.slice(-4),
      'Content-Type': 'application/json'
    })
    console.log('Body:', JSON.stringify(paymentData, null, 2))
    console.log('============================================')
    
    // Appeler l'API de paiement (POST)
    const response = await fetch(`${apiUrl}/web-merchant/create-web-payment-link`, {
      method: 'POST',
      headers: {
        'x-api-key': config.MOBILE_MONEY_API_KEY,
        'x-api-secret': config.MOBILE_MONEY_API_SECRET,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    })

    // L'API externe retourne 201 Created, on accepte 200-299 comme succès
    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Erreur API de paiement:', errorText)
      throw new Error(`API returned ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()
    
    console.log('============================================')
    console.log('📥 RÉPONSE DE L\'API DE PAIEMENT:')
    console.log('Status:', response.status)
    console.log('Response:', JSON.stringify(result, null, 2))
    console.log('============================================')

    // Chercher l'URL de paiement dans différents champs possibles
    const paymentUrl = result.payment_url || 
                       result.url || 
                       result.paymentUrl || 
                       result.link ||
                       result.payment_link ||
                       result.redirect_url ||
                       result.paymentLink?.paymentUrl || // 🎯 Structure de votre API
                       result.paymentLink?.url ||
                       result.data?.payment_url ||
                       result.data?.url

    if (!paymentUrl) {
      console.error('❌ Aucune URL de paiement trouvée dans la réponse!')
      console.error('Réponse complète:', result)
      throw new Error('URL de paiement non trouvée dans la réponse de l\'API')
    }

    console.log('✅ URL de paiement trouvée:', paymentUrl)

    // Extraire les informations de transaction
    const transactionId = result.transaction_id || 
                          result.id || 
                          result.reference ||
                          result.paymentLink?.id || // 🎯 ID depuis paymentLink
                          result.paymentLink?.reference

    // Forcer le statut à 200 OK (même si l'API externe retourne 201)
    setResponseStatus(event, 200)

    // Retourner l'URL de paiement
    return {
      success: true,
      payment_url: paymentUrl,
      transaction_id: transactionId,
      reference: result.paymentLink?.reference || result.reference
    }

  } catch (err: any) {
    console.error('Erreur lors de la création du lien de paiement:', err)

    if (err.statusCode) {
      throw err
    }

    throw createError({
      statusCode: 500,
      statusMessage: err.message || 'Erreur lors de la création du lien de paiement'
    })
  }
})

