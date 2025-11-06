import { defineEventHandler, createError } from 'h3'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  // Utiliser les bonnes variables de configuration
  const WORDPRESS_URL = config.WORDPRESS_URL || config.WC_STORE_URL;

  if (!WORDPRESS_URL) {
    console.error('Configuration WooCommerce manquante:', {
      WORDPRESS_URL: config.WORDPRESS_URL,
      WC_STORE_URL: config.WC_STORE_URL
    });
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
    console.log('==========================================');
    console.log('🔍 RÉCUPÉRATION COMMANDES');
    console.log('==========================================');
    console.log('User ID:', userId);
    console.log('URL WordPress:', WORDPRESS_URL);
    console.log('URL complète:', `${WORDPRESS_URL}/wp-json/custom/v1/orders/user/${userId}`);
    
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
    
    console.log('✅ Réponse reçue de WordPress');
    console.log('Type de données:', typeof response.data);
    console.log('Est un tableau:', Array.isArray(response.data));
    console.log('Nombre de commandes:', Array.isArray(response.data) ? response.data.length : 'N/A');
    
    if (Array.isArray(response.data) && response.data.length > 0) {
      console.log('📦 Première commande:', {
        id: response.data[0].id,
        status: response.data[0].status,
        date: response.data[0].date_created
      });
    } else {
      console.log('⚠️ Aucune commande trouvée pour l\'utilisateur', userId);
    }
    console.log('==========================================');
    
    // L'API WordPress renvoie directement la liste des commandes
    return response.data;

  } catch (err: any) {
    console.error(`Erreur récupération commandes pour user ${userId}:`, {
      message: err.message,
      status: err.response?.status,
      data: err.response?.data,
      url: err.config?.url
    });

    throw createError({
      statusCode: err.response?.status || 500,
      statusMessage: err.response?.data?.message || err.message || 'Erreur interne du serveur lors de la récupération des commandes.'
    });
  }
});
