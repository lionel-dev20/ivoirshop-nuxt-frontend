# Guide de la Fonctionnalité de Recherche avec Autocomplétion

## 🎯 Vue d'ensemble

Ce guide explique la nouvelle fonctionnalité de recherche avec autocomplétion intégrée dans votre boutique en ligne. La recherche permet aux clients de trouver rapidement des produits, catégories et tags avec des suggestions intelligentes.

## 🚀 Fonctionnalités

### 1. **Recherche avec Autocomplétion**
- Suggestions en temps réel pendant la saisie
- Recherche dans les produits, catégories et tags
- Navigation au clavier (flèches haut/bas, Entrée, Échap)
- Interface responsive (desktop et mobile)

### 2. **Page de Résultats de Recherche**
- Affichage des résultats avec filtres
- Tri par pertinence, prix, nom, note, date
- Filtres par prix, stock, promotions, attributs
- Pagination automatique

### 3. **Endpoints API**
- `/api/search` - Recherche de produits
- `/api/search/autocomplete` - Suggestions d'autocomplétion
- Intégration avec WordPress/WooCommerce

## 📁 Fichiers Créés/Modifiés

### Nouveaux Fichiers
- `app/pages/recherche.vue` - Page de résultats de recherche
- `app/components/SearchBox.vue` - Composant de recherche avec autocomplétion
- `app/components/MobileSearch.vue` - Recherche mobile
- `server/api/search.get.ts` - Endpoint de recherche Nuxt
- `server/api/search/autocomplete.get.ts` - Endpoint d'autocomplétion Nuxt
- `test-search-endpoints.js` - Script de test

### Fichiers Modifiés
- `app/components/AppHeader.vue` - Intégration de la SearchBox
- `functions.php` - Endpoints WordPress de recherche

## 🔧 Configuration

### 1. **Variables d'Environnement**
Assurez-vous que ces variables sont configurées dans votre `.env` :
```env
WC_STORE_URL=https://votre-site-wordpress.com
WOOCOMMERCE_CONSUMER_KEY=votre_cle
WOOCOMMERCE_CONSUMER_SECRET=votre_secret
```

### 2. **Endpoints WordPress**
Les endpoints suivants ont été ajoutés à `functions.php` :
- `GET /wp-json/custom/v1/search` - Recherche de produits
- `GET /wp-json/custom/v1/search/autocomplete` - Autocomplétion

## 🎨 Utilisation

### 1. **Recherche Desktop**
- Utilisez la barre de recherche dans le header
- Tapez au moins 2 caractères pour voir les suggestions
- Naviguez avec les flèches du clavier
- Appuyez sur Entrée ou cliquez pour rechercher

### 2. **Recherche Mobile**
- Cliquez sur l'icône de recherche dans le header mobile
- Utilisez la barre de recherche dans le modal
- Consultez les recherches populaires
- Fermez avec le bouton X ou en cliquant à l'extérieur

### 3. **Page de Résultats**
- Accédez via `/recherche?q=terme`
- Utilisez les filtres dans la sidebar gauche
- Triez les résultats avec le menu déroulant
- Cliquez sur un produit pour voir les détails

## 🔍 Types de Suggestions

### 1. **Produits**
- Nom du produit
- Prix
- Image miniature
- Redirection vers la fiche produit

### 2. **Catégories**
- Nom de la catégorie
- Nombre de produits
- Redirection vers la page catégorie

### 3. **Tags**
- Nom du tag
- Nombre de produits
- Recherche par tag

### 4. **Suggestions Génériques**
- Recherches suggérées
- Combinaisons de termes
- Recherches populaires

## ⚙️ Paramètres de Recherche

### Filtres Disponibles
- **Prix** : Min/Max
- **Stock** : En stock uniquement
- **Promotions** : Produits en promotion
- **Catégorie** : Filtrer par catégorie
- **Attributs** : Couleur, taille, etc.

### Options de Tri
- **Pertinence** : Résultats les plus pertinents
- **Prix** : Croissant/Décroissant
- **Nom** : A-Z / Z-A
- **Note** : Mieux notés
- **Date** : Plus récents

## 🧪 Tests

### 1. **Test des Endpoints**
```bash
node test-search-endpoints.js
```

### 2. **Test Manuel**
1. Allez sur `http://localhost:3000`
2. Testez la recherche dans le header
3. Vérifiez l'autocomplétion
4. Testez la page de résultats

### 3. **Test Mobile**
1. Ouvrez les outils de développement
2. Activez le mode mobile
3. Testez la recherche mobile

## 🐛 Dépannage

### Problèmes Courants

#### 1. **Autocomplétion ne fonctionne pas**
- Vérifiez que les endpoints WordPress sont accessibles
- Vérifiez les variables d'environnement
- Consultez les logs du serveur

#### 2. **Aucun résultat de recherche**
- Vérifiez que WooCommerce est configuré
- Vérifiez que les produits sont publiés
- Testez les endpoints WordPress directement

#### 3. **Erreurs de performance**
- Ajustez le délai d'autocomplétion (300ms par défaut)
- Limitez le nombre de suggestions
- Activez la mise en cache

### Logs de Debug
```javascript
// Dans SearchBox.vue
console.log('Suggestions:', suggestions.value)

// Dans les endpoints
console.log('Recherche pour:', searchTerm)
```

## 📈 Optimisations

### 1. **Performance**
- Cache des suggestions (20 minutes)
- Limitation du nombre de résultats
- Délai d'autocomplétion configurable

### 2. **SEO**
- URLs de recherche indexables
- Meta descriptions dynamiques
- Balises Open Graph

### 3. **UX**
- Indicateurs de chargement
- Messages d'erreur clairs
- Navigation au clavier

## 🔮 Améliorations Futures

### 1. **Fonctionnalités Avancées**
- Recherche par image
- Recherche vocale
- Historique des recherches
- Suggestions personnalisées

### 2. **Analytics**
- Suivi des recherches populaires
- Taux de conversion par terme
- A/B testing des suggestions

### 3. **Intégrations**
- Elasticsearch
- Algolia
- Google Custom Search

## 📞 Support

Si vous rencontrez des problèmes :

1. **Vérifiez les logs** : Console du navigateur et logs serveur
2. **Testez les endpoints** : Utilisez le script de test
3. **Vérifiez la configuration** : Variables d'environnement et WordPress
4. **Consultez la documentation** : WooCommerce et Nuxt.js

---

**Note** : Cette fonctionnalité est entièrement intégrée avec votre système existant et respecte les bonnes pratiques de performance et d'accessibilité.
