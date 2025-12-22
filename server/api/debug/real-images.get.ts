// server/api/debug/real-images.get.ts
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { categorySlug = 'televisions' } = query


  try {
    // Récupérer les vraies données de l'API WordPress
    const response = await $fetch('/api/wordpress/category-products', {
      params: {
        categorySlug: categorySlug
      }
    })


    if (response?.products && Array.isArray(response.products)) {
      const productsWithImages = response.products.map((product, index) => {
        
        // Essayer de trouver une image valide
        let validImageUrl = null
        
        if (product.image && product.image !== '/images/placeholder-product.jpg') {
          validImageUrl = product.image
        } else if (product.images && Array.isArray(product.images) && product.images.length > 0) {
          const firstImage = product.images[0]
          if (typeof firstImage === 'string' && firstImage !== '/images/placeholder-product.jpg') {
            validImageUrl = firstImage
          } else if (typeof firstImage === 'object' && firstImage?.src && firstImage.src !== '/images/placeholder-product.jpg') {
            validImageUrl = firstImage.src
          }
        } else if (product.thumbnail && product.thumbnail !== '/images/placeholder-product.jpg') {
          validImageUrl = product.thumbnail
        }
        
        if (!validImageUrl) {
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
    return {
      success: false,
      error: error.message
    }
  }
})







