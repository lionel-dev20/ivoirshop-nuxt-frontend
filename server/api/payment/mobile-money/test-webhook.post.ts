// server/api/payment/mobile-money/test-webhook.post.ts
import { defineEventHandler, readBody, setResponseStatus } from 'h3'

/**
 * Endpoint de TEST pour simuler un webhook de paiement réussi
 * URL: /api/payment/mobile-money/test-webhook
 * 
 * Pour tester:
 * curl -X POST http://localhost:3000/api/payment/mobile-money/test-webhook \
 *   -H "Content-Type: application/json" \
 *   -d '{"order_id":"ORD-TEST-123"}'
 */
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  
  console.log('============================================')
  console.log('🧪 TEST WEBHOOK - Simulation paiement réussi')
  console.log('============================================')
  console.log('Order ID reçu:', body.order_id || 'Non fourni')
  
  // Simuler un payload de paiement réussi
  const simulatedPayload = {
    status: 'success',
    transaction_id: `TEST-TXN-${Date.now()}`,
    amount: 50000,
    metadata: {
      order_id: body.order_id || 'ORD-TEST-123',
      customer_id: 0,
      customer_name: 'Test Client',
      email: 'test@ivoirshop.ci',
      customer_phone: '+2250101010101',
      phoneNumber: '+2250101010101',
      customer_city: 'Abidjan',
      customer_commune: 'Cocody',
      customer_address_details: 'Test Address',
      cart_items: [
        {
          product_id: 1,
          name: 'Produit Test',
          quantity: 1,
          price: 45000,
          total: 45000
        }
      ],
      total: 50000,
      shipping_cost: 5000,
      delivery_info: {
        city_name: 'Abidjan',
        commune_name: 'Cocody',
        product_type: 'standard'
      },
      coupon: null,
      is_partial_payment: false,
      partial_payment_amount: null
    }
  }
  
  console.log('📋 Payload simulé:', JSON.stringify(simulatedPayload, null, 2))
  
  // Appeler le vrai callback
  try {
    const SITE_URL = config.public.SITE_URL || config.SITE_URL || 'http://localhost:3000'
    const callbackUrl = `${SITE_URL}/api/payment/mobile-money/callback`
    
    console.log('📞 Appel du callback:', callbackUrl)
    
    const response = await fetch(callbackUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(simulatedPayload)
    })
    
    const result = await response.json()
    
    console.log('============================================')
    console.log('✅ RÉSULTAT DU TEST')
    console.log('============================================')
    console.log('Status callback:', response.status)
    console.log('Résultat:', JSON.stringify(result, null, 2))
    console.log('============================================')
    
    setResponseStatus(event, 200)
    return {
      success: true,
      message: 'Test webhook exécuté avec succès',
      callback_status: response.status,
      callback_result: result,
      simulated_payload: simulatedPayload
    }
    
  } catch (error: any) {
    console.error('❌ Erreur lors du test webhook:', error)
    
    setResponseStatus(event, 500)
    return {
      success: false,
      error: error.message,
      simulated_payload: simulatedPayload
    }
  }
})

