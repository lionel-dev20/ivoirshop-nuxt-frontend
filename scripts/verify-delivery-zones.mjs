#!/usr/bin/env node

/**
 * Script de vérification du fichier delivery-zones.json
 * Vérifie que toutes les communes ont des prix valides pour les 3 types de produits
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Couleurs pour la console
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

// Lire le fichier JSON
const filePath = path.join(__dirname, '..', 'app', 'data', 'delivery-zones.json')

try {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  
  log('\n🔍 Vérification du fichier delivery-zones.json\n', 'cyan')
  
  let totalCommunes = 0
  let communesWithZeroPrices = []
  let communesWithInconsistentPrices = []
  let allValid = true
  
  data.forEach(zone => {
    log(`📍 Région: ${zone.name} (ID: ${zone.id})`, 'blue')
    log(`   Nombre de communes: ${zone.communes.length}`)
    
    zone.communes.forEach(commune => {
      totalCommunes++
      
      const { id, name, price_light, price_medium, price_heavy } = commune
      
      // Vérifier les prix à 0
      const zeroPrices = []
      if (price_light === 0) zeroPrices.push('light')
      if (price_medium === 0) zeroPrices.push('medium')
      if (price_heavy === 0) zeroPrices.push('heavy')
      
      if (zeroPrices.length > 0) {
        communesWithZeroPrices.push({
          region: zone.name,
          commune: name,
          zeroPrices
        })
        allValid = false
      }
      
      // Vérifier la cohérence des prix (normalement heavy >= medium >= light)
      // Note: certaines communes peuvent avoir des prix spéciaux
      if (price_heavy < price_medium || price_medium < price_light) {
        communesWithInconsistentPrices.push({
          region: zone.name,
          commune: name,
          prices: { light: price_light, medium: price_medium, heavy: price_heavy }
        })
      }
      
      // Afficher les détails de chaque commune
      const status = zeroPrices.length > 0 ? '❌' : '✅'
      log(`   ${status} ${name} (ID: ${id})`)
      log(`      Light: ${price_light} FCFA | Medium: ${price_medium} FCFA | Heavy: ${price_heavy} FCFA`)
    })
    
    console.log()
  })
  
  // Résumé
  log('=' .repeat(70), 'cyan')
  log('📊 RÉSUMÉ', 'cyan')
  log('=' .repeat(70), 'cyan')
  log(`Total de régions: ${data.length}`)
  log(`Total de communes: ${totalCommunes}`)
  
  if (communesWithZeroPrices.length > 0) {
    log(`\n⚠️  ${communesWithZeroPrices.length} communes avec des prix à 0:`, 'yellow')
    communesWithZeroPrices.forEach(item => {
      log(`   - ${item.region} > ${item.commune}`, 'yellow')
      log(`     Types à 0: ${item.zeroPrices.join(', ')}`, 'yellow')
    })
  }
  
  if (communesWithInconsistentPrices.length > 0) {
    log(`\n⚠️  ${communesWithInconsistentPrices.length} communes avec des prix incohérents:`, 'yellow')
    communesWithInconsistentPrices.forEach(item => {
      log(`   - ${item.region} > ${item.commune}`, 'yellow')
      log(`     Light: ${item.prices.light} | Medium: ${item.prices.medium} | Heavy: ${item.prices.heavy}`, 'yellow')
      log(`     Note: Normalement heavy >= medium >= light`, 'yellow')
    })
  }
  
  if (allValid && communesWithInconsistentPrices.length === 0) {
    log('\n✅ Toutes les communes ont des prix valides!', 'green')
  } else if (allValid) {
    log('\n✅ Toutes les communes ont des prix non-nuls', 'green')
    log('⚠️  Mais certaines ont des prix incohérents (peut-être voulu)', 'yellow')
  } else {
    log('\n❌ Des problèmes ont été détectés dans le fichier', 'red')
    log('   Veuillez corriger les prix à 0', 'red')
  }
  
  log('\n' + '='.repeat(70) + '\n', 'cyan')
  
  process.exit(allValid ? 0 : 1)
  
} catch (error) {
  log(`\n❌ Erreur lors de la lecture du fichier: ${error.message}`, 'red')
  process.exit(1)
}

