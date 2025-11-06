# 🐛 Debug : Erreur "is not a constructor" - WooCommerce

## 🎯 Problème

Erreur lors de la recherche :
```
Erreur lors de la recherche: (intermediate value) is not a constructor
```

## 🔍 Cause

L'erreur se produit lors de l'import dynamique du module `@woocommerce/woocommerce-rest-api`. Le problème vient de la façon dont les modules ES6 gèrent les imports de modules CommonJS.

### Pourquoi ça arrive ?

Le package `@woocommerce/woocommerce-rest-api` est un module CommonJS qui doit être importé dynamiquement dans notre application Nuxt 3 (ESM). Selon l'environnement et la configuration, le module peut être exporté de différentes manières :

1. `module.default` → Constructeur
2. `module.default.default` → Constructeur (double wrapping)
3. `module` → Constructeur direct

## ✅ Solution Appliquée

### Fichier : `server/utils/woocommerce.ts`

J'ai ajouté :

1. **Detection multi-niveaux** :
   ```typescript
   if (WooCommerceModule.default) {
     WooCommerceRestApi = WooCommerceModule.default
     
     // Gestion du double default
     if (typeof WooCommerceRestApi === 'object' && WooCommerceRestApi.default) {
       WooCommerceRestApi = WooCommerceRestApi.default
     }
   }
   ```

2. **Logs de debug détaillés** :
   ```typescript
   console.log('📦 Module importé, type:', typeof WooCommerceModule)
   console.log('📦 Module.default type:', typeof WooCommerceModule.default)
   console.log('📦 Clés du module:', Object.keys(WooCommerceModule))
   ```

3. **Vérifications de type** :
   ```typescript
   if (typeof WooCommerceRestApi !== 'function') {
     throw new Error(`Module importé mais n'est pas une fonction`)
   }
   ```

## 🧪 Comment Tester

### 1. Redémarrer le serveur

```bash
# Ctrl+C pour arrêter le serveur
npm run dev
```

### 2. Tester la recherche

1. Aller sur http://localhost:3000
2. Taper dans la barre de recherche : "test"
3. Ouvrir la console du navigateur (F12)
4. **Regarder les logs du terminal serveur**

### 3. Logs attendus dans le terminal

Si tout fonctionne :
```
📦 Import du module @woocommerce/woocommerce-rest-api...
📦 Module importé, type: object
📦 Module.default type: function
📦 Clés du module: ['default']
✅ WooCommerceRestApi final: { type: 'function', isFunction: true, isConstructor: true }
🔧 Création client WooCommerce pour: https://votre-site.com
🔍 Autocomplétion WooCommerce pour: test | Limite: 10
📡 Recherche de produits dans WooCommerce...
✅ 5 produits trouvés
```

Si ça ne marche pas :
```
❌ Erreur lors de l'import de WooCommerceRestApi: [message]
```

## 🔧 Solutions Alternatives

### Solution 1 : Vérifier l'installation du package

```bash
# Réinstaller le package
npm uninstall @woocommerce/woocommerce-rest-api
npm install @woocommerce/woocommerce-rest-api@^1.0.2
```

### Solution 2 : Utiliser un import statique

Si l'import dynamique ne fonctionne toujours pas, modifier `server/utils/woocommerce.ts` :

```typescript
// Import statique au lieu de dynamique
import WooCommerceRestApiImport from '@woocommerce/woocommerce-rest-api'

export async function getWooCommerceApi() {
  return WooCommerceRestApiImport
}
```

**Note :** Cette solution peut causer des problèmes de build en production.

### Solution 3 : Utiliser axios directement

Si rien ne fonctionne, on peut faire les appels API WooCommerce directement avec axios :

```typescript
import axios from 'axios'
import crypto from 'crypto'

function generateOAuthSignature(config) {
  // Implémenter OAuth 1.0a manuellement
  // (Plus complexe mais plus fiable)
}
```

## 📊 Analyse des Logs

### Scénario 1 : Module.default est undefined

```
📦 Module.default type: undefined
```

**Action :** Le module est exporté directement
```typescript
WooCommerceRestApi = WooCommerceModule
```

### Scénario 2 : Module.default est un objet

```
📦 Module.default type: object
📦 Clés du module: ['default', ...]
```

**Action :** Double default détecté
```typescript
WooCommerceRestApi = WooCommerceModule.default.default
```

### Scénario 3 : Module.default est une fonction

```
📦 Module.default type: function
✅ WooCommerceRestApi final: { type: 'function', isFunction: true }
```

**Action :** ✅ C'est le bon cas !

## 🎯 Checklist de Vérification

Après avoir appliqué les corrections :

- [ ] Le serveur redémarre sans erreurs
- [ ] La recherche affiche des suggestions
- [ ] Les logs du terminal montrent "✅ WooCommerceRestApi importé"
- [ ] Pas d'erreur "is not a constructor" dans la console
- [ ] Les produits s'affichent dans l'autocomplétion

## 🚨 Si le Problème Persiste

### 1. Vérifier la version de Node.js

```bash
node --version
# Doit être >= 18.0.0
```

### 2. Vérifier la configuration Nuxt

Dans `nuxt.config.ts`, vérifier :
```typescript
export default defineNuxtConfig({
  nitro: {
    experimental: {
      wasm: false
    },
    moduleSideEffects: [
      '@woocommerce/woocommerce-rest-api'
    ]
  }
})
```

### 3. Nettoyer le cache

```bash
rm -rf .nuxt
rm -rf node_modules/.vite
npm run dev
```

### 4. Logs complets

Si l'erreur persiste, copiez TOUS les logs du terminal et de la console et cherchez :
- Le type exact retourné par le module
- Les clés disponibles dans le module
- Le message d'erreur complet avec la stack trace

## 📞 Aide Supplémentaire

Si après toutes ces étapes le problème n'est pas résolu :

1. Copier les logs complets du terminal (depuis le démarrage)
2. Copier les logs de la console navigateur
3. Vérifier que les variables d'environnement sont correctes :
   ```
   WORDPRESS_URL=...
   WOOCOMMERCE_CONSUMER_KEY=...
   WOOCOMMERCE_CONSUMER_SECRET=...
   ```

---

**Status :** ✅ Corrections appliquées avec logs de debug détaillés
**Date :** ${new Date().toLocaleDateString('fr-FR')}

