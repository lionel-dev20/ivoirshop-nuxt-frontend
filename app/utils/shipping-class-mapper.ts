/**
 * Utilitaire pour mapper les shipping classes WooCommerce vers les types de produits
 * utilisés dans le système de calcul des frais de livraison
 */

export type ShippingClassType = 'light' | 'medium' | 'heavy'

/**
 * Normalise une shipping class WooCommerce vers un type standardisé
 * @param shippingClass - La shipping class provenant de WooCommerce
 * @returns Le type normalisé (light, medium, heavy) ou une chaîne vide si non reconnu
 */
export function normalizeShippingClass(shippingClass: string | undefined): ShippingClassType | '' {
  if (!shippingClass) return ''
  
  const normalized = shippingClass.toLowerCase().trim()
  
  // Mapping des différentes variations possibles
  const lightVariations = [
    'light', 
    'leger', 
    'léger', 
    'produit-leger', 
    'produit-léger', 
    'produit_leger', 
    'produit_léger',
    'produit leger',
    'produit léger'
  ]
  
  const mediumVariations = [
    'medium', 
    'moyen', 
    'produit-moyen', 
    'produit_moyen',
    'produit moyen'
  ]
  
  const heavyVariations = [
    'heavy', 
    'lourd', 
    'produit-lourd', 
    'produit_lourd',
    'produit lourd'
  ]
  
  if (lightVariations.includes(normalized)) {
    return 'light'
  } else if (mediumVariations.includes(normalized)) {
    return 'medium'
  } else if (heavyVariations.includes(normalized)) {
    return 'heavy'
  }
  
  // Si aucun mapping trouvé, logger un warning en développement
  if (process.dev) {
  }
  
  return ''
}

/**
 * Détermine la shipping class en fonction du poids du produit
 * @param weight - Le poids du produit en kg
 * @returns Le type correspondant
 */
export function getShippingClassByWeight(weight: number): ShippingClassType {
  if (weight < 2) {
    return 'light'
  } else if (weight >= 2 && weight <= 10) {
    return 'medium'
  } else {
    return 'heavy'
  }
}

/**
 * Détermine la shipping class d'un produit en combinant sa classe et son poids
 * @param shippingClass - La shipping class du produit
 * @param weight - Le poids du produit (optionnel)
 * @returns Le type déterminé
 */
export function determineShippingClass(
  shippingClass: string | undefined, 
  weight?: string | number
): ShippingClassType {
  // Essayer d'abord avec la shipping class
  let normalizedClass = normalizeShippingClass(shippingClass)
  
  if (normalizedClass) {
    return normalizedClass
  }
  
  // Si pas de shipping class, utiliser le poids
  if (weight) {
    const numWeight = typeof weight === 'string' ? parseFloat(weight) : weight
    if (!isNaN(numWeight) && numWeight > 0) {
      return getShippingClassByWeight(numWeight)
    }
  }
  
  // Par défaut, retourner medium
  return 'medium'
}

/**
 * Trouve la shipping class la plus lourde parmi une liste
 * @param shippingClasses - Tableau de shipping classes
 * @returns La classe la plus lourde
 */
export function getHeaviestShippingClass(shippingClasses: ShippingClassType[]): ShippingClassType {
  if (shippingClasses.length === 0) {
    return 'medium'
  }
  
  const weights: Record<ShippingClassType, number> = {
    'light': 1,
    'medium': 2,
    'heavy': 3
  }
  
  let heaviest: ShippingClassType = 'light'
  let maxWeight = 0
  
  shippingClasses.forEach(sc => {
    const weight = weights[sc] || 0
    if (weight > maxWeight) {
      maxWeight = weight
      heaviest = sc
    }
  })
  
  return heaviest
}

/**
 * Retourne le label traduit d'une shipping class
 * @param shippingClass - Le type de shipping class
 * @returns Le label en français
 */
export function getShippingClassLabel(shippingClass: ShippingClassType): string {
  const labels: Record<ShippingClassType, string> = {
    'light': 'Produit Léger',
    'medium': 'Produit Moyen',
    'heavy': 'Produit Lourd'
  }
  
  return labels[shippingClass] || shippingClass
}

/**
 * Retourne la description d'une shipping class
 * @param shippingClass - Le type de shipping class
 * @returns La description
 */
export function getShippingClassDescription(shippingClass: ShippingClassType): string {
  const descriptions: Record<ShippingClassType, string> = {
    'light': 'Moins de 2kg',
    'medium': '2kg à 10kg',
    'heavy': 'Plus de 10kg'
  }
  
  return descriptions[shippingClass] || ''
}

