# Guide de Debug - Erreur "Catégorie non trouvée"

## 🚨 Problème Identifié

Erreur : `Error: Catégorie non trouvée` dans le composant `Nouveaute.vue`

## 🔍 Causes Possibles

### 1. Catégorie "clothing" n'existe pas
- La catégorie n'a pas été créée dans WordPress
- Le slug n'est pas exactement "clothing" (en minuscules)
- La catégorie existe mais n'est pas publiée

### 2. Problème de configuration
- Variable `WC_STORE_URL` incorrecte
- WordPress non accessible
- Endpoints WordPress non fonctionnels

### 3. Problème de données
- Les catégories ne sont pas récupérées correctement
- Format de données incorrect
- Problème de cache

## 🧪 Tests de Diagnostic

### Étape 1: Vérifier les catégories WordPress
```bash
# Test direct de l'endpoint WordPress
curl http://ivoir-shop.local/wp-json/custom/v1/categories
```

### Étape 2: Vérifier l'endpoint Nuxt
```bash
# Test de l'endpoint Nuxt
curl http://localhost:3000/api/api/v1/categories
```

### Étape 3: Script de debug
```bash
node debug-categories.js
```

### Étape 4: Page de test
```
http://localhost:3000/test-nouveaute
```

## 🔧 Solutions

### Solution 1: Créer la catégorie "clothing"
1. Aller dans WordPress Admin
2. Produits > Catégories
3. Créer une nouvelle catégorie :
   - Nom : "Clothing" ou "Vêtements"
   - Slug : "clothing" (en minuscules)
   - Description : Optionnelle
4. Sauvegarder

### Solution 2: Vérifier la configuration
Vérifier le fichier `.env` :
```env
WC_STORE_URL=http://ivoir-shop.local
```

### Solution 3: Tester avec une catégorie existante
```vue
<!-- Utiliser l'ID d'une catégorie existante -->
<Nouveaute 
  :category-id="15"
  :grid-columns="4"
  :products-per-page="12"
/>
```

### Solution 4: Debug avancé
Ajouter des logs dans le composant pour voir :
- Quelles catégories sont récupérées
- Quel slug est recherché
- Pourquoi la correspondance échoue

## 📋 Checklist de Vérification

- [ ] WordPress est accessible
- [ ] L'endpoint `/wp-json/custom/v1/categories` fonctionne
- [ ] L'endpoint `/api/api/v1/categories` fonctionne
- [ ] La catégorie "clothing" existe dans WordPress
- [ ] Le slug est exactement "clothing" (minuscules)
- [ ] La variable `WC_STORE_URL` est correcte
- [ ] Des produits sont assignés à la catégorie
- [ ] Les produits sont publiés et en stock

## 🎯 Test Rapide

### 1. Vérifier les catégories disponibles
```javascript
// Dans la console du navigateur
fetch('/api/api/v1/categories')
  .then(r => r.json())
  .then(data => console.log('Catégories:', data))
```

### 2. Tester avec une catégorie existante
```vue
<!-- Remplacer "clothing" par un slug existant -->
<Nouveaute 
  category-slug="electronique"
  :grid-columns="4"
  :products-per-page="12"
/>
```

### 3. Vérifier les logs
Regarder les logs du serveur Nuxt pour voir :
- Les catégories récupérées
- Le slug recherché
- L'erreur exacte

## 🚀 Résolution Attendue

Après correction, vous devriez voir :
- ✅ Les catégories s'affichent dans la console
- ✅ La catégorie "clothing" est trouvée
- ✅ Les produits de la catégorie s'affichent
- ✅ Aucune erreur dans la console

