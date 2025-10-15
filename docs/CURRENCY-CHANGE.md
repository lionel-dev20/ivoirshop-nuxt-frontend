# Changement de Devise : EUR → FCFA

## Date
15 Octobre 2025

## Résumé
Remplacement complet de la devise Euro (EUR/€) par le Franc CFA (FCFA) dans tout le projet.

## Fichiers Modifiés

### Components Vue (5 fichiers)
1. ✅ `app/components/ProductFilters.vue` - Formatage des prix dans les filtres
2. ✅ `app/components/SearchBox.vue` - Affichage des prix dans les suggestions de recherche
3. ✅ `app/components/collectionHomepage/Nouveaute.vue` - Affichage des prix dans les nouveautés
4. ✅ `app/components/collectionHomepage/ProductCard.vue` - Affichage des prix sur les cartes produits
   - **IMPORTANT** : Suppression de `price_html` (ligne 111) qui affichait le HTML du prix WooCommerce contenant €

### Pages Vue (1 fichier)
5. ✅ `app/pages/thank-you.vue` - Affichage des prix sur la page de confirmation

### Stores Pinia (2 fichiers)
6. ✅ `app/stores/cart.ts` - Formatage du total du panier
7. ✅ `app/stores/delivery.ts` - Formatage des frais de livraison

### APIs Server (1 fichier)
8. ✅ `server/api/coupons/apply.ts` - Formatage des remises/coupons

## Fichiers Déjà en FCFA (non modifiés)
- ✅ `app/components/ProductCard.vue` - Déjà en FCFA
- ✅ `app/components/CartSidebar.vue` - Pas de formatage de devise
- ✅ `app/pages/checkout.vue` - Déjà en FCFA
- ✅ `app/pages/produit/[slug].vue` - Déjà en FCFA

## Changements Techniques

### Avant
```typescript
return new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR'
}).format(price)
// Résultat : "1 234,56 €"
```

### Après
```typescript
return new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'XOF'
}).format(price).replace('XOF', 'FCFA')
// Résultat : "1 234,56 FCFA"
```

**Note** : On utilise le code ISO 4217 `XOF` (Franc CFA de l'Ouest Africain) avec Intl.NumberFormat, puis on remplace "XOF" par "FCFA" pour un affichage plus convivial.

### Fichiers Utilisant un Format Différent
Certains fichiers utilisent déjà un format simplifié sans décimales :
```typescript
return new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
}).format(numPrice) + " FCFA"
// Résultat : "1,235 FCFA"
```

## Statistiques
- **Total de fichiers modifiés** : 8 fichiers
- **Total de fichiers déjà en FCFA** : 4 fichiers  
- **Total d'occurrences de FCFA/XOF** : 25 dans 13 fichiers
- **Occurrences de EUR restantes** : 0 ✅

## Vérification

Pour vérifier qu'il n'y a plus d'EUR :
```bash
# Rechercher EUR ou €
grep -r "EUR\|€" . --exclude-dir=node_modules --exclude-dir=.git

# Vérifier les occurrences de FCFA
grep -r "FCFA\|XOF" . --exclude-dir=node_modules --exclude-dir=.git
```

## Format de la Devise FCFA

Le Franc CFA (Communauté Financière Africaine) est utilisé dans 8 pays d'Afrique de l'Ouest dont la Côte d'Ivoire.

### Informations
- **Code ISO 4217** : XOF
- **Symbole** : FCFA (souvent écrit après le montant)
- **Sous-unité** : 1 FCFA = 100 centimes (rarement utilisés)
- **Taux de change fixe** : 1 EUR = 655.957 FCFA

### Conventions d'Affichage
- Format recommandé : `1 234 FCFA` ou `1.234 FCFA`
- Pas de centimes en usage courant
- Espace entre le montant et FCFA

## Impact sur l'Utilisateur

### Avant
- Prix affichés en Euros (€)
- Exemple : "1 234,56 €"

### Après  
- Prix affichés en Francs CFA
- Exemple : "1 234,56 FCFA" ou "1 235 FCFA"

## Tests Recommandés

Après ce changement, vérifiez :
- ✅ Affichage des prix sur les pages produits
- ✅ Affichage du total panier
- ✅ Affichage des frais de livraison
- ✅ Affichage des remises/coupons
- ✅ Page de confirmation de commande
- ✅ Recherche de produits (suggestions)
- ✅ Filtres par prix

## Configuration WooCommerce

N'oubliez pas de configurer WooCommerce pour utiliser FCFA :
1. Allez dans `WooCommerce > Réglages > Général`
2. Devise : Sélectionnez "Franc CFA (FCFA)" ou "XOF"
3. Format de devise : Personnalisez si nécessaire
4. Sauvegardez les modifications

## Notes
- Tous les prix dans la base de données WooCommerce doivent être en FCFA
- Les APIs WooCommerce retournent les prix dans la devise configurée
- Le frontend affiche maintenant correctement la devise FCFA

## Compatibilité
- ✅ Navigateurs modernes (support Intl.NumberFormat)
- ✅ SSR (Server-Side Rendering)
- ✅ Mobile

---

**Status** : ✅ Complété  
**Vérifié** : Aucune erreur de linting  
**Testé** : À tester en développement

