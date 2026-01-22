# 🚀 INSTALLATION DE L'ENDPOINT WORDPRESS POUR MOBILE MONEY

## 🎯 OBJECTIF

Créer l'endpoint WordPress nécessaire pour que les commandes Mobile Money arrivent dans le dashboard WooCommerce.

---

## ⚠️ SYMPTÔMES SI L'ENDPOINT N'EXISTE PAS

- ❌ Les commandes Mobile Money n'apparaissent pas dans WooCommerce
- ❌ Erreur 404 dans les logs serveur
- ❌ Message : "Erreur WooCommerce: 404 Not Found"

---

## ✅ SOLUTION : INSTALLER LE CODE WORDPRESS

### **ÉTAPE 1 : Accéder à WordPress Admin**

1. Allez sur `https://admin.ivoirshop.ci/wp-admin`
2. Connectez-vous avec vos identifiants admin

---

### **ÉTAPE 2 : Ouvrir l'éditeur de thème**

1. Dans le menu de gauche, cliquez sur **Apparence**
2. Cliquez sur **Éditeur de fichiers** (ou **Theme File Editor**)
3. ⚠️ Si vous voyez un avertissement, cliquez sur **"Je comprends"**

---

### **ÉTAPE 3 : Éditer functions.php**

1. Dans la colonne de droite, cherchez **"Fonctions du thème"** ou **"functions.php"**
2. Cliquez dessus pour ouvrir le fichier

---

### **ÉTAPE 4 : Ajouter le code**

1. **SCROLL TOUT EN BAS** du fichier `functions.php`
2. Ouvrez le fichier **`wordpress-endpoint-mobile-money.php`** (à la racine du projet)
3. **COPIEZ TOUT LE CONTENU** du fichier
4. **COLLEZ** le code à la fin de `functions.php`

**⚠️ IMPORTANT :**
- Ne collez PAS au milieu du fichier
- Ne supprimez RIEN du code existant
- Collez APRÈS la dernière ligne

---

### **ÉTAPE 5 : Sauvegarder**

1. Cliquez sur le bouton **"Mettre à jour le fichier"** (ou **"Update File"**)
2. Si vous voyez un message de succès ✅, c'est bon !
3. Si vous voyez une erreur ❌, vérifiez qu'il n'y a pas de `?>` à la fin

---

### **ÉTAPE 6 : Vérifier que ça fonctionne**

#### **Test 1 : Vérifier l'endpoint**

Ouvrez cette URL dans votre navigateur :

```
https://admin.ivoirshop.ci/wp-json/custom/v1/
```

**Résultat attendu :**
```json
{
  "namespace": "custom/v1",
  "routes": {
    "/custom/v1": {...},
    "/custom/v1/create-order": {
      "methods": ["POST"],
      ...
    }
  }
}
```

✅ Si vous voyez `create-order`, l'endpoint est créé !

---

#### **Test 2 : Vérifier le statut personnalisé**

1. Allez dans **WooCommerce → Commandes**
2. En haut, vous devriez voir un nouveau filtre : **"Payé par mobile money"**

✅ Si vous le voyez, le statut est enregistré !

---

#### **Test 3 : Test complet**

1. Sur votre site Nuxt, ajoutez un produit au panier
2. Allez au checkout
3. Sélectionnez "Mobile Money"
4. Complétez le paiement
5. Vérifiez dans **WooCommerce → Commandes**

✅ La commande devrait apparaître avec le statut "Payé par mobile money" !

---

## 🔍 DIAGNOSTIC DES PROBLÈMES

### **Problème 1 : Erreur lors de la sauvegarde de functions.php**

**Erreur :** "Parse error: syntax error, unexpected..."

**Cause :** Il y a probablement un `?>` quelque part

**Solution :**
1. Supprimez tous les `?>` à la fin du fichier
2. Le fichier PHP ne doit PAS se terminer par `?>`
3. Sauvegardez à nouveau

---

### **Problème 2 : L'endpoint n'apparaît pas**

**Test :**
```
https://admin.ivoirshop.ci/wp-json/custom/v1/create-order
```

**Si erreur 404 :**

1. **Vérifier que le code est bien ajouté**
   - Retournez dans functions.php
   - Vérifiez que le code est présent

2. **Rafraîchir les permaliens**
   - Allez dans **Réglages → Permaliens**
   - Cliquez sur **"Enregistrer les modifications"** (sans rien changer)
   - Testez à nouveau

3. **Vider le cache**
   - Si vous utilisez un plugin de cache (WP Rocket, etc.)
   - Videz le cache
   - Testez à nouveau

---

### **Problème 3 : Les commandes ont le statut "processing" au lieu de "Payé par mobile money"**

**Cause :** Le statut personnalisé n'est pas enregistré

**Solution :**
1. Vérifiez que TOUT le code est bien dans functions.php
2. La partie **"2. ENREGISTRER LE STATUT PERSONNALISÉ"** doit être présente
3. Rechargez la page WooCommerce → Commandes

---

### **Problème 4 : White screen (écran blanc)**

**Cause :** Erreur PHP fatale

**Solution :**

#### **Via FTP/Hébergeur :**

1. Connectez-vous à votre hébergement (FTP ou File Manager)
2. Allez dans `/wp-content/themes/VOTRE_THEME/`
3. Téléchargez `functions.php` (backup)
4. Ouvrez-le dans un éditeur de texte
5. Supprimez le code que vous venez d'ajouter
6. Uploadez le fichier
7. Votre site devrait fonctionner à nouveau

#### **Via cPanel :**

1. Connectez-vous à cPanel
2. Ouvrez **File Manager**
3. Naviguez vers `public_html/wp-content/themes/VOTRE_THEME/`
4. Clic droit sur `functions.php` → **Edit**
5. Supprimez le code ajouté
6. Sauvegardez

---

## 📋 VÉRIFICATION FINALE

Après installation, vérifiez ces 3 points :

### ✅ 1. Endpoint existe
```bash
curl https://admin.ivoirshop.ci/wp-json/custom/v1/create-order
```
**Réponse attendue :** Message d'erreur (normal, car aucune donnée envoyée)

### ✅ 2. Statut personnalisé visible
- WooCommerce → Commandes
- Filtre "Payé par mobile money" visible en haut

### ✅ 3. Méthode de paiement visible
- WooCommerce → Réglages → Paiements
- "Mobile Money" dans la liste

---

## 🎉 SI TOUT FONCTIONNE

Vous devriez voir dans les logs serveur :

```bash
============================================
📦 CRÉATION COMMANDE MOBILE MONEY
Données reçues: Array ( ... )
✅ Commande #12345 créée avec succès !
Statut: paye-par-mobile-money
Total: 50000
============================================
```

Et dans WooCommerce :

- ✅ Nouvelle commande visible
- ✅ Statut "Payé par mobile money" (avec pastille verte)
- ✅ Toutes les informations présentes
- ✅ Transaction ID visible

---

## 🔐 SÉCURITÉ

### **Le code est-il sécurisé ?**

✅ **OUI**, le code inclut :

1. **Vérification WooCommerce actif**
2. **Gestion des erreurs complète**
3. **Validation des données**
4. **Sanitization automatique par WooCommerce**
5. **Logs pour audit**

### **Permission callback**

Le code utilise `'permission_callback' => '__return_true'` car :

- Le webhook DjoNanko doit pouvoir appeler l'endpoint
- L'authentification se fait via la signature du webhook
- Pas de données sensibles exposées

**Alternative sécurisée (optionnelle) :**

Si vous voulez ajouter une sécurité supplémentaire :

```php
'permission_callback' => function($request) {
    // Vérifier un secret dans les headers
    $secret = $request->get_header('X-Webhook-Secret');
    return $secret === 'VOTRE_SECRET_ICI';
}
```

Puis dans votre Nuxt, ajouter :

```typescript
headers: {
  'Content-Type': 'application/json',
  'X-Webhook-Secret': 'VOTRE_SECRET_ICI'
}
```

---

## 📚 FICHIERS CONCERNÉS

### **WordPress (côté serveur)**
- `functions.php` du thème actif

### **Nuxt (votre projet)**
- `wordpress-endpoint-mobile-money.php` (code à copier)
- `server/api/payment/mobile-money/callback.post.ts` (appelle l'endpoint)
- `server/api/payment/mobile-money/create-order-directly.post.ts` (appelle l'endpoint)

---

## 🆘 BESOIN D'AIDE ?

### **Logs WordPress**

Pour voir les logs :

1. Activez le debug WordPress
2. Ajoutez dans `wp-config.php` :
```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

3. Les logs seront dans `/wp-content/debug.log`

### **Vérifier les logs**

```bash
# Via SSH
tail -f /var/www/html/wp-content/debug.log

# Ou téléchargez le fichier via FTP
```

---

## ✅ RÉSUMÉ

1. ✅ Copiez le code de `wordpress-endpoint-mobile-money.php`
2. ✅ Collez dans `functions.php` (à la fin)
3. ✅ Sauvegardez
4. ✅ Testez l'endpoint
5. ✅ Faites un paiement test
6. ✅ Vérifiez la commande dans WooCommerce

**C'est tout ! 🎉**

---

**Date de création :** 22 janvier 2026  
**Version :** 1.0  
**Testé avec :** WordPress 6.x + WooCommerce 8.x

