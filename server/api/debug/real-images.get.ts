// server/api/debug/real-images.get.ts
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { categorySlug = 'televisions' } = query

  console.log('=== Real Images Debug ===')
  console.log('Category slug:', categorySlug)

  try {
    // Récupérer les vraies données de l'API WordPress
    const response = await $fetch('/api/wordpress/category-products', {
      params: {
        categorySlug: categorySlug
      }
    })

    console.log('Réponse API WordPress:', response)

    if (response?.products && Array.isArray(response.products)) {
      const productsWithImages = response.products.map((product, index) => {
        console.log(`\n--- Produit ${index + 1}: ${product.name} ---`)
        console.log('Image directe:', product.image)
        console.log('Images array:', product.images)
        console.log('Thumbnail:', product.thumbnail)
        
        // Essayer de trouver une image valide
        let validImageUrl = null
        
        if (product.image && product.image !== '/images/placeholder-product.jpg') {
          validImageUrl = product.image
          console.log('✅ Image directe trouvée:', validImageUrl)
        } else if (product.images && Array.isArray(product.images) && product.images.length > 0) {
          const firstImage = product.images[0]
          if (typeof firstImage === 'string' && firstImage !== '/images/placeholder-product.jpg') {
            validImageUrl = firstImage
            console.log('✅ Image du tableau (string):', validImageUrl)
          } else if (typeof firstImage === 'object' && firstImage?.src && firstImage.src !== '/images/placeholder-product.jpg') {
            validImageUrl = firstImage.src
            console.log('✅ Image du tableau (objet):', validImageUrl)
          }
        } else if (product.thumbnail && product.thumbnail !== '/images/placeholder-product.jpg') {
          validImageUrl = product.thumbnail
          console.log('✅ Thumbnail trouvé:', validImageUrl)
        }
        
        if (!validImageUrl) {
          console.log('❌ Aucune image valide trouvée')
        }
        
        return {
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          validImageUrl: validImageUrl,
          allImageSources: {
            image: product.image,
            images: product.images,
            thumbnail: product.thumbnail
          }
        }
      })

      return {
        success: true,
        totalProducts: productsWithImages.length,
        productsWithValidImages: productsWithImages.filter(p => p.validImageUrl).length,
        productsWithoutImages: productsWithImages.filter(p => !p.validImageUrl).length,
        products: productsWithImages
      }
    }

    return {
      success: false,
      error: 'Aucun produit trouvé',
      response: response
    }

  } catch (error: any) {
    console.error('Erreur lors du test des vraies images:', error.message)
    return {
      success: false,
      error: error.message
    }
  }
})





