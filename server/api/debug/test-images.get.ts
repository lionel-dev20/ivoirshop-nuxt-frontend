// server/api/debug/test-images.get.ts
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { categorySlug = 'televisions' } = query


  try {
    // Utiliser l'API WordPress pour récupérer les produits
    const response = await $fetch('/api/wordpress/category-products', {
      params: {
        categorySlug: categorySlug
      }
    })


    // Analyser les images des produits
    if (response?.products && Array.isArray(response.products)) {
      const imageAnalysis = response.products.map((product, index) => {
        
        return {
          id: product.id,
          name: product.name,
          image: product.image,
          images: product.images,
          thumbnail: product.thumbnail,
          imageAnalysis: {
            hasImage: !!product.image,
            hasImagesArray: !!product.images,
            hasThumbnail: !!product.thumbnail,
            imagesArrayLength: product.images?.length || 0,
            firstImageUrl: product.images?.[0]?.src || product.images?.[0] || null
          }
        }
      })

      return {
        success: true,
        totalProducts: response.products.length,
        imageAnalysis: imageAnalysis,
        summary: {
          productsWithImage: imageAnalysis.filter(p => p.imageAnalysis.hasImage).length,
          productsWithImagesArray: imageAnalysis.filter(p => p.imageAnalysis.hasImagesArray).length,
          productsWithThumbnail: imageAnalysis.filter(p => p.imageAnalysis.hasThumbnail).length,
          productsWithNoImages: imageAnalysis.filter(p => !p.imageAnalysis.hasImage && !p.imageAnalysis.hasImagesArray && !p.imageAnalysis.hasThumbnail).length
        }
      }
    }

    return {
      success: false,
      error: 'Aucun produit trouvé ou format de réponse incorrect',
      response: response
    }

  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      stack: error.stack
    }
  }
})

