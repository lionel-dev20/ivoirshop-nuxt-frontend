import { defineEventHandler, readBody } from 'h3'
import { createWooCommerceClient } from '../../utils/woocommerce'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username, email, password, first_name, last_name } = body

  if (!username || !email || !password) {
    return { success: false, error: 'Veuillez renseigner tous les champs obligatoires.' }
  }

  try {
    const api = await createWooCommerceClient({
      url: process.env.WORDPRESS_URL!,
      consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY!,
      consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET!,
      version: 'wc/v3',
    })

    // Créer un nouveau client WooCommerce
    const customerData = {
      email,
      first_name: first_name || username,
      last_name: last_name || '',
      username,
      password,
    }

    const { data } = await api.post('customers', customerData)

    return {
      success: true,
      user: {
        id: data.id,
        username: data.username,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
      },
      message: 'Compte créé avec succès'
    }
  } catch (err: any) {
    
    let errorMessage = 'Erreur lors de la création du compte'
    
    if (err.response?.data?.message) {
      errorMessage = err.response.data.message
    } else if (err.response?.data?.code === 'registration_error_email_exists') {
      errorMessage = 'Cette adresse email est déjà utilisée'
    } else if (err.response?.data?.code === 'registration_error_username_exists') {
      errorMessage = 'Ce nom d\'utilisateur est déjà pris'
    }

    return { success: false, error: errorMessage }
  }
})

