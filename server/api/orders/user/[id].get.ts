import { defineEventHandler, createError } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  // Utiliser les bonnes variables de configuration
  const WORDPRESS_URL = config.WORDPRESS_URL || config.WC_STORE_URL;

  if (!WORDPRESS_URL) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Configuration WooCommerce manquante dans le backend.'
    });
  }

  const userId = event.context.params?.id;

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID utilisateur manquant.'
    });
  }

  try {
    
    // Appeler l'API WordPress personnalisée pour récupérer les commandes de l'utilisateur
    const response = await axios.get(
      `${WORDPRESS_URL}/wp-json/custom/v1/orders/user/${userId}`,
      {
        timeout: 10000,
        headers: {
          'User-Agent': 'Nuxt-WooCommerce-Client/1.0',
          'Content-Type': 'application/json'
        },
      }
    );
    
    
    // L'API WordPress renvoie directement la liste des commandes
    return response.data;

  } catch (err: any) {
    throw createError({
      statusCode: err.response?.status || 500,
      statusMessage: err.response?.data?.message || err.message || 'Erreur interne du serveur lors de la récupération des commandes.'
    });
  }
});
