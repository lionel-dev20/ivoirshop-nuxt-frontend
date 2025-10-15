# Configuration de la Devise WooCommerce - FCFA

## ⚠️ IMPORTANT - Configuration Requise

Après avoir modifié le code frontend pour afficher les prix en FCFA, vous **DEVEZ** également configurer WooCommerce pour utiliser la devise FCFA. Sinon, les prix seront incorrects.

## 🎯 Configuration WooCommerce

### Étape 1 : Accéder aux Réglages

1. Connectez-vous à votre dashboard WordPress
2. Allez dans **WooCommerce > Réglages**
3. Cliquez sur l'onglet **Général**

### Étape 2 : Configurer la Devise

Dans la section **Options de la devise** :

1. **Devise** : Sélectionnez `Franc CFA (XOF)` ou `Franc CFA de l'Ouest africain`
2. **Position de la devise** : Choisissez `Droite avec espace` (recommandé pour FCFA)
   - Exemple : `1 234 FCFA`
3. **Séparateur des milliers** : ` ` (espace) ou `,` (virgule)
4. **Séparateur décimal** : `.` (point) ou `,` (virgule)
5. **Nombre de décimales** : `0` ou `2`

### Configuration Recommandée

```
Devise : Franc CFA (XOF)
Position : Droite avec espace
Séparateur milliers : (espace)
Séparateur décimal : .
Nombre de décimales : 0
```

**Résultat** : `1 234 FCFA` ou `1234 FCFA`

### Étape 3 : Sauvegarder

Cliquez sur **Enregistrer les modifications** en bas de la page.

## 🔄 Mise à Jour des Prix Existants

Si vous aviez des produits avec des prix en EUR, vous devez les convertir :

### Option 1 : Conversion Manuelle

1. Taux de change fixe : **1 EUR = 655.957 FCFA**
2. Allez dans **Produits > Tous les produits**
3. Éditez chaque produit
4. Multipliez les prix EUR par 655.957
5. Entrez les nouveaux prix en FCFA
6. Enregistrez

**Exemple** :
- Ancien prix : 100 €
- Nouveau prix : 100 × 655.957 = **65 596 FCFA**

### Option 2 : Plugin de Conversion (Recommandé)

Utilisez un plugin comme :
- **Currency Converter for WooCommerce**
- **WooCommerce Multi-Currency**

Ces plugins peuvent convertir automatiquement tous vos prix.

### Option 3 : Script SQL (Avancé)

⚠️ **Faites une sauvegarde de la base de données avant !**

```sql
-- Convertir les prix réguliers
UPDATE wp_postmeta 
SET meta_value = CAST(meta_value AS DECIMAL(10,2)) * 655.957 
WHERE meta_key = '_regular_price' 
AND meta_value != '';

-- Convertir les prix en promotion
UPDATE wp_postmeta 
SET meta_value = CAST(meta_value AS DECIMAL(10,2)) * 655.957 
WHERE meta_key = '_sale_price' 
AND meta_value != '';

-- Convertir les prix standard
UPDATE wp_postmeta 
SET meta_value = CAST(meta_value AS DECIMAL(10,2)) * 655.957 
WHERE meta_key = '_price' 
AND meta_value != '';
```

## 🧪 Tests Après Configuration

Vérifiez que tout fonctionne correctement :

### 1. API WooCommerce
```bash
curl -X GET "https://votre-site.com/wp-json/wc/v3/products" \
  --user "CONSUMER_KEY:CONSUMER_SECRET"
```

Vérifiez que les prix sont en FCFA dans la réponse.

### 2. Frontend
- ✅ Page d'accueil : Produits affichent FCFA
- ✅ Page catégorie : Prix en FCFA
- ✅ Page produit : Prix en FCFA
- ✅ Panier : Total en FCFA
- ✅ Checkout : Total en FCFA
- ✅ Confirmation : Montant en FCFA

### 3. Emails
Vérifiez que les emails de commande affichent les prix en FCFA.

## 🔧 Dépannage

### Problème : Les prix affichent toujours €

**Cause** : WooCommerce n'est pas configuré en FCFA

**Solution** :
1. Vérifiez la configuration WooCommerce (Étape 1-3 ci-dessus)
2. Videz le cache WooCommerce :
   - `WooCommerce > État > Outils > Vider le cache`
3. Videz le cache de votre site (si vous utilisez un plugin de cache)

### Problème : Le champ price_html retourne €

**Cause** : Le champ `price_html` de l'API WooCommerce utilise la devise configurée

**Solution** : 
- ✅ **Déjà corrigé** : Nous avons supprimé l'affichage de `price_html` dans `ProductCard.vue`
- Les prix sont maintenant formatés côté frontend avec FCFA

### Problème : Conversion des prix inexacte

**Cause** : Taux de change incorrect ou arrondis

**Solution** :
- Utilisez le taux officiel : **1 EUR = 655.957 FCFA** (taux fixe)
- Pour les arrondis, décidez d'une règle :
  - Arrondir à l'unité supérieure : `ceil(prix)`
  - Arrondir à l'unité la plus proche : `round(prix)`
  - Arrondir aux 5 FCFA : `round(prix / 5) * 5`

### Problème : Les commandes existantes sont en EUR

**Cause** : Les anciennes commandes dans la base de données

**Solution** :
- Les anciennes commandes restent en EUR (normal)
- Seules les nouvelles commandes seront en FCFA
- Si besoin, ajoutez une note dans l'admin pour identifier la devise

## 📊 Vérification de la Configuration

### Checklist Complète

- [ ] WooCommerce configuré en FCFA (XOF)
- [ ] Prix des produits convertis en FCFA
- [ ] Cache WooCommerce vidé
- [ ] Cache du site vidé
- [ ] API WooCommerce retourne des prix en FCFA
- [ ] Frontend affiche FCFA partout
- [ ] Emails affichent FCFA
- [ ] Page panier affiche FCFA
- [ ] Page checkout affiche FCFA
- [ ] Confirmation de commande affiche FCFA

## 🌍 Informations sur le FCFA

### À Propos du Franc CFA

- **Nom complet** : Franc de la Communauté Financière Africaine
- **Code ISO** : XOF (Afrique de l'Ouest)
- **Pays utilisant XOF** : Bénin, Burkina Faso, Côte d'Ivoire, Guinée-Bissau, Mali, Niger, Sénégal, Togo
- **Taux fixe** : 1 EUR = 655.957 FCFA
- **Émetteur** : Banque Centrale des États de l'Afrique de l'Ouest (BCEAO)

### Format Standard

- Position : Après le montant
- Espace : Avec espace entre montant et devise
- Exemples :
  - `1 000 FCFA`
  - `50 000 FCFA`
  - `1 234 567 FCFA`

### Centimes

Les centimes (1/100 de FCFA) existent mais sont rarement utilisés dans le commerce.
Il est recommandé d'utiliser 0 décimales dans WooCommerce.

## 🔐 Sécurité

### Protégez Vos Clés API

Assurez-vous que vos clés WooCommerce sont sécurisées :
- Ne les commitez jamais dans Git
- Utilisez des variables d'environnement
- Régénérez-les si compromises

### Fichier .env

```env
WORDPRESS_URL=https://votre-site.com
WOOCOMMERCE_CONSUMER_KEY=ck_xxxxx
WOOCOMMERCE_CONSUMER_SECRET=cs_xxxxx
```

## 📞 Support

Si vous rencontrez des problèmes :

1. Vérifiez les logs WooCommerce : `WooCommerce > État > Logs`
2. Vérifiez les logs WordPress : `wp-content/debug.log`
3. Consultez la console du navigateur (F12)
4. Vérifiez la réponse de l'API dans l'onglet Network

## 📝 Notes Importantes

1. **Sauvegarde** : Faites toujours une sauvegarde avant de modifier les prix
2. **Test** : Testez sur un environnement de staging d'abord
3. **Clients** : Informez vos clients du changement de devise
4. **Historique** : Les anciennes commandes garderont leur devise d'origine
5. **Taxes** : Vérifiez que les taxes sont recalculées correctement en FCFA

---

**Dernière mise à jour** : 15 Octobre 2025  
**Status** : ✅ Configuration requise pour le bon fonctionnement

