// server/api/payment/mobile-money/callback.post.ts
import { defineEventHandler, readBody } from 'h3'

 /* Webhook URL: https://ivoirshop.ci/api/payment/mobile-money/callback
 */
export default defineEventHandler(async (event) => {
  // Récupérer le payload envoyé en POST
  const payload = await readBody(event)
  
  console.log('📥 Webhook payload reçu:', JSON.stringify(payload, null, 2))
  
  return {
    received: true,
    payload: payload
  }
})

