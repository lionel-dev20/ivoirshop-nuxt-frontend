# 🔍 Test et Débogage de la Recherche

## ✅ Corrections Apportées

### Problème identifié
L'autocomplétion ne fonctionnait pas car :
1. L'API retournait `{ data: { suggestions: [] } }` au lieu de `{ suggestions: [] }`
2. Le composant SearchBox essayait d'accéder à `data.suggestions` qui n'existait pas
3. Utilisation de `params` au lieu de `query` dans $fetch

### Corrections effectuées

1. **API `/api/search/autocomplete`** :
   - ✅ Structure de réponse simplifiée : `{ suggestions: [] }`
   - ✅ Logs de debug ajoutés pour suivre le processus
   - ✅ Meilleur formatage des suggestions

2. **Composant SearchBox.vue** :
   - ✅ Correction de l'accès aux données : `response.suggestions`
   - ✅ Changement de `params` à `query` pour $fetch
   - ✅ Logs de debug ajoutés

3. **MobileSearch.vue** :
   - ✅ Utilise déjà SearchBox, donc automatiquement corrigé

## 🧪 Comment Tester

### Test 1 : Autocomplétion de base

1. **Ouvrir la page d'accueil** (http://localhost:3000)

2. **Ouvrir la console du navigateur** (F12)

3. **Taper au moins 2 caractères** dans la barre de recherche

4. **Vérifier dans la console** :
   ```
   🔍 Recherche de suggestions pour: te
   ```

5. **Vérifier la réponse du serveur** :
   ```
   🔍 Autocomplétion WooCommerce pour: te | Limite: 10
   📡 Recherche de produits dans WooCommerce...
   ✅ 5 produits trouvés
   📡 Recherche de catégories dans WooCommerce...
   ✅ 2 catégories trouvées
   📝 7 suggestions générées: { produits: 5, categories: 2, generiques: 0 }
   ```

6. **Vérifier dans le composant** :
   ```
   ✅ Réponse autocomplétion: { suggestions: [...] }
   📝 Nombre de suggestions: 7
   ```

7. **Vérifier visuellement** :
   - Le dropdown de suggestions doit apparaître
   - Les produits avec images/prix doivent s'afficher
   - Les catégories avec icônes doivent s'afficher
   - Les suggestions génériques en bas

### Test 2 : Navigation au clavier

1. **Taper une recherche** : "iphone"

2. **Appuyer sur Flèche Bas (↓)** :
   - La première suggestion doit être surlignée en bleu

3. **Continuer avec ↓** :
   - Les suggestions suivantes doivent être surlignées

4. **Appuyer sur Flèche Haut (↑)** :
   - Retour à la suggestion précédente

5. **Appuyer sur Entrée** :
   - Doit naviguer vers le produit/catégorie sélectionné

### Test 3 : Clic sur une suggestion

1. **Taper une recherche** : "telephone"

2. **Cliquer sur un produit** :
   - Doit rediriger vers `/produit/[slug]`

3. **Taper à nouveau** : "telephone"

4. **Cliquer sur une catégorie** :
   - Doit rediriger vers `/categorie/[slug]`

5. **Cliquer sur "Tous les produits..."** :
   - Doit rediriger vers `/recherche?q=telephone`

### Test 4 : Recherche directe (Enter)

1. **Taper une recherche** : "ordinateur"

2. **Appuyer sur Entrée** (sans sélectionner de suggestion)

3. **Vérifier** :
   - Redirection vers `/recherche?q=ordinateur`
   - La page de résultats affiche les produits

### Test 5 : Recherche mobile

1. **Réduire la fenêtre** pour activer la vue mobile

2. **Cliquer sur l'icône de recherche** (loupe)

3. **Le modal de recherche** doit s'ouvrir

4. **Taper une recherche** :
   - Les suggestions doivent fonctionner comme sur desktop

5. **Cliquer sur une recherche populaire** :
   - Doit fermer le modal et effectuer la recherche

### Test 6 : Cas limites

#### Aucun résultat
1. Taper : "zzzzzzzzzz"
2. Devrait afficher uniquement la suggestion générique "Tous les produits..."

#### Moins de 2 caractères
1. Taper : "a"
2. Ne devrait PAS faire de requête (vérifier console)
3. Aucune suggestion ne doit apparaître

#### Caractères spéciaux
1. Taper : "télé été"
2. Les suggestions doivent fonctionner correctement
3. Les accents doivent être respectés

#### Chargement lent
1. Taper rapidement : "iphone pro max"
2. Pendant le chargement, un indicateur animé doit apparaître
3. Les anciennes requêtes doivent être annulées (debounce)

## 🐛 Problèmes Potentiels et Solutions

### Problème 1 : Aucune suggestion n'apparaît

**Vérifier dans la console :**
```
❌ Erreur lors de la récupération des suggestions: [détails]
```

**Solutions :**
1. Vérifier que le serveur Nuxt est démarré
2. Vérifier les identifiants WooCommerce dans `.env`
3. Vérifier que WooCommerce est accessible
4. Regarder les logs serveur dans le terminal

### Problème 2 : Les images des produits ne s'affichent pas

**Cause :** Les produits n'ont pas d'images dans WooCommerce

**Solution :**
- Un placeholder gris avec une icône s'affiche automatiquement
- Ajouter des images aux produits dans WooCommerce

### Problème 3 : Suggestions en double

**Vérifier dans la console :**
```
📝 Nombre de suggestions: 15 (au lieu de 10)
```

**Solution :**
- Vérifier que `limit` est bien respecté dans l'API
- Le code actuel limite déjà à `limit` suggestions

### Problème 4 : Pas de connexion à WooCommerce

**Log serveur :**
```
❌ Erreur WooCommerce autocomplétion: {...}
```

**Solution :**
1. Le système utilise automatiquement le fallback :
   ```
   "Tous les produits [recherche]"
   "Rechercher [recherche]"
   ```
2. Vérifier `.env` :
   ```
   WORDPRESS_URL=https://votre-site.com
   WOOCOMMERCE_CONSUMER_KEY=ck_...
   WOOCOMMERCE_CONSUMER_SECRET=cs_...
   ```

## 📊 Logs de Debug

### Logs à surveiller dans la console du navigateur

```
🔍 Recherche de suggestions pour: [terme]
✅ Réponse autocomplétion: { suggestions: [...] }
📝 Nombre de suggestions: [nombre]
```

### Logs à surveiller dans le terminal du serveur

```
🔍 Autocomplétion WooCommerce pour: [terme] | Limite: [nombre]
📡 Recherche de produits dans WooCommerce...
✅ [X] produits trouvés
📡 Recherche de catégories dans WooCommerce...
✅ [X] catégories trouvées
📝 [X] suggestions générées: { produits: X, categories: X, generiques: X }
```

## ✅ Checklist de Vérification

- [ ] La recherche accepte au moins 2 caractères
- [ ] Les suggestions apparaissent en moins de 500ms
- [ ] Les produits s'affichent avec image et prix
- [ ] Les catégories s'affichent avec compte de produits
- [ ] La navigation au clavier fonctionne (↑↓)
- [ ] Le clic sur une suggestion redirige correctement
- [ ] La touche Entrée lance la recherche
- [ ] Le clic en dehors ferme les suggestions
- [ ] La version mobile fonctionne
- [ ] Les logs de debug s'affichent correctement

## 🎯 Résultat Attendu

Une fois toutes les corrections effectuées, vous devriez avoir :

1. ✅ **Autocomplétion fonctionnelle** avec produits, catégories et suggestions génériques
2. ✅ **Navigation au clavier** fluide
3. ✅ **Images et prix** des produits
4. ✅ **Logs de debug** complets pour faciliter le débogage
5. ✅ **Fallback automatique** si WooCommerce n'est pas disponible
6. ✅ **Version mobile** fonctionnelle

---

**Date :** ${new Date().toLocaleDateString('fr-FR')}
**Status :** ✅ Corrections appliquées

