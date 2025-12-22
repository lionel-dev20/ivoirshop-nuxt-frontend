// server/api/notify/phone.post.ts
import { defineEventHandler, readBody, createError, getHeader } from 'h3'

interface PhoneNotification {
  phone: string
  country_code: string
  timestamp: string
  ip_address?: string
}

// Stockage en mémoire (en production, utilisez une base de données)
const phoneNotifications: PhoneNotification[] = []

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event) as { phone: string; country_code?: string }
    
    // Validation
    if (!body.phone) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Numéro de téléphone requis'
      })
    }
    
    // Nettoyer le numéro
    const cleanPhone = body.phone.replace(/\D/g, '')
    
    // Vérifier le format ivoirien (8 chiffres)
    if (cleanPhone.length !== 8) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Numéro de téléphone invalide. Format attendu: 8 chiffres'
      })
    }
    
    // Vérifier si le numéro existe déjà
    const existingNotification = phoneNotifications.find(
      n => n.phone === cleanPhone && n.country_code === '225'
    )
    
    if (existingNotification) {
      return {
        success: true,
        message: 'Ce numéro est déjà enregistré. Vous serez notifié le jour de l\'ouverture !',
        already_exists: true
      }
    }
    
    // Récupérer l'IP du client
    const clientIP = getClientIP(event) || 'unknown'
    
    // Ajouter à la liste
    const notification: PhoneNotification = {
      phone: cleanPhone,
      country_code: body.country_code || '225',
      timestamp: new Date().toISOString(),
      ip_address: clientIP
    }
    
    phoneNotifications.push(notification)
    
    // En production, vous pourriez :
    // 1. Sauvegarder en base de données
    // 2. Envoyer une confirmation WhatsApp
    // 3. Ajouter à une liste de diffusion
    
    return {
      success: true,
      message: 'Numéro enregistré avec succès ! Vous serez notifié sur WhatsApp le jour de l\'ouverture.',
      phone: `+225${cleanPhone}`,
      total_registrations: phoneNotifications.length
    }
    
  } catch (err: any) {
    
    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || 'Erreur lors de l\'enregistrement du numéro'
    })
  }
})

// Fonction utilitaire pour récupérer l'IP du client
function getClientIP(event: any): string | undefined {
  const forwarded = getHeader(event, 'x-forwarded-for')
  const realIP = getHeader(event, 'x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || forwarded
  }
  
  if (realIP) {
    return realIP
  }
  
  return undefined
}





























