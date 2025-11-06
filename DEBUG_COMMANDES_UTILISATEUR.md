# 🐛 Debug : Affichage des Commandes Utilisateur

## 🎯 Problème

L'utilisateur est connecté mais ne voit pas ses commandes sur la page `/mes-commandes`.

## 🔍 Diagnostics Ajoutés

J'ai ajouté des logs détaillés à 3 niveaux :

### 1. Côté Client (Navigateur)
**Fichier :** `app/pages/mes-commandes.vue`

**Logs ajoutés :**
```
📱 CHARGEMENT COMMANDES (CLIENT)
- Utilisateur connecté
- ID utilisateur
- Appel API
- Réponse reçue
- Nombre de commandes
```

### 2. Côté Serveur Nuxt
**Fichier :** `server/api/orders/user/[id].get.ts`

**Logs ajoutés :**
```
🔍 RÉCUPÉRATION COMMANDES
- User ID
- URL WordPress
- Réponse WordPress
- Nombre de commandes
```

### 3. Côté WordPress
**Fichier :** `functions.php` (ligne 838)

**Logs existants :**
```php
error_log('Récupération des commandes pour l\'utilisateur: ' . $user_id);
error_log('Nombre de commandes trouvées: ' . count($customer_orders));
```

## 🧪 Comment Tester

### Étape 1 : Ouvrir les Consoles

1. **Console navigateur** (F12)
   - Aller sur `/mes-commandes`
   - Onglet "Console"

2. **Terminal serveur Nuxt**
   - Où vous avez lancé `npm run dev`

3. **Logs WordPress** (si Local by Flywheel)
   - Local → Site → Open site shell
   - `tail -f /app/public/wp-content/debug.log`

### Étape 2 : Aller sur /mes-commandes

1. Connectez-vous si pas déjà fait
2. Allez sur `/mes-commandes`
3. Regardez les 3 consoles

### Étape 3 : Analyser les Logs

#### A. Console Navigateur

**Si vous voyez :**
```
📱 CHARGEMENT COMMANDES (CLIENT)
Utilisateur connecté: { id: 1, email: "...", ... }
ID utilisateur: 1
🌐 Appel API: /api/orders/user/1
```

✅ L'utilisateur est bien connecté

**Si vous voyez :**
```
❌ Pas d'utilisateur connecté, redirection vers login
```

❌ Problème d'authentification

#### B. Terminal Serveur Nuxt

**Si vous voyez :**
```
🔍 RÉCUPÉRATION COMMANDES
User ID: 1
URL WordPress: http://...
✅ Réponse reçue de WordPress
Nombre de commandes: 3
```

✅ L'API fonctionne et récupère des commandes

**Si vous voyez :**
```
⚠️ Aucune commande trouvée pour l'utilisateur 1
```

⚠️ Aucune commande en base pour cet utilisateur

#### C. Logs WordPress

**Dans `debug.log` vous devriez voir :**
```
Récupération des commandes pour l'utilisateur: 1
Nombre de commandes trouvées: 3
```

## 🔧 Solutions aux Problèmes Courants

### Problème 1 : Utilisateur Non Connecté

**Symptôme :** Redirection vers `/auth/login`

**Causes possibles :**
1. Cookie de session expiré
2. Middleware auth ne fonctionne pas
3. useAuth() ne retourne pas l'utilisateur

**Solution :**
1. Vérifier que vous êtes bien connecté
2. Rafraîchir la page
3. Se reconnecter

### Problème 2 : Aucune Commande Retournée

**Symptôme :** `Nombre de commandes: 0`

**Causes possibles :**
1. L'utilisateur n'a vraiment pas de commandes
2. Les commandes ont un `customer_id` différent
3. Les commandes sont en brouillon ou supprimées

**Solution A - Vérifier dans WooCommerce :**
1. Aller dans WordPress Admin
2. WooCommerce → Commandes
3. Filtrer par client
4. Vérifier si des commandes existent

**Solution B - Vérifier le customer_id :**

Dans la base de données WordPress :
```sql
SELECT 
    post_id as order_id,
    meta_value as customer_id 
FROM wp_postmeta 
WHERE meta_key = '_customer_user' 
AND meta_value = '1';
```

Si aucun résultat, les commandes n'ont pas de `customer_id` associé.

**Solution C - Associer les commandes à l'utilisateur :**

Ajouter ce code temporairement dans `functions.php` :

```php
// TEMPORAIRE : Associer toutes les commandes d'un email à un user_id
add_action('admin_init', 'associate_orders_to_user');
function associate_orders_to_user() {
    // À exécuter UNE SEULE FOIS
    if (get_option('orders_associated')) {
        return;
    }
    
    $user_email = 'votre-email@example.com'; // Votre email
    $user = get_user_by('email', $user_email);
    
    if (!$user) {
        error_log('Utilisateur non trouvé pour: ' . $user_email);
        return;
    }
    
    $orders = wc_get_orders(array(
        'billing_email' => $user_email,
        'limit' => -1
    ));
    
    foreach ($orders as $order) {
        $order->set_customer_id($user->ID);
        $order->save();
        error_log('Commande #' . $order->get_id() . ' associée à user ' . $user->ID);
    }
    
    update_option('orders_associated', true);
    error_log(count($orders) . ' commandes associées à l\'utilisateur ' . $user->ID);
}
```

**Important :** Après exécution, supprimer ce code !

### Problème 3 : Erreur 404 sur l'Endpoint

**Symptôme :**
```
Status: 404
URL: .../wp-json/custom/v1/orders/user/1
```

**Cause :** L'endpoint WordPress n'est pas enregistré

**Solution :**
1. Vérifier que le code de l'endpoint est dans `functions.php`
2. Dans WordPress Admin → Réglages → Permaliens → Cliquer "Enregistrer" (flush rewrite rules)
3. Tester l'URL directement dans le navigateur

### Problème 4 : Erreur CORS

**Symptôme :**
```
CORS policy: No 'Access-Control-Allow-Origin' header
```

**Solution :**

Ajouter dans `functions.php` :

```php
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Credentials: true');
        return $value;
    });
}, 15);
```

### Problème 5 : Mauvais URL WordPress

**Symptôme :**
```
ENOTFOUND ou ECONNREFUSED
```

**Solution :**

Vérifier dans `.env` :
```
WORDPRESS_URL=http://ivoir-shop.local
# OU
WC_STORE_URL=http://ivoir-shop.local
```

**Tester l'URL :**
```bash
curl http://ivoir-shop.local/wp-json/custom/v1/orders/user/1
```

## 📋 Checklist Complète

### Avant de débugger :
- [ ] Je suis connecté à l'application
- [ ] J'ai créé au moins une commande
- [ ] La commande apparaît dans WooCommerce Admin
- [ ] Mon site WordPress est accessible

### Vérifications :
- [ ] Console navigateur : Utilisateur ID visible
- [ ] Terminal Nuxt : Logs de récupération visibles
- [ ] WordPress debug.log : Logs de la fonction visible
- [ ] L'URL de l'API est correcte

### Si aucune commande ne s'affiche :
- [ ] Vérifier que les commandes ont un `customer_id`
- [ ] Vérifier que l'email de la commande correspond à l'utilisateur
- [ ] Tester l'endpoint directement dans le navigateur
- [ ] Vérifier les permaliens WordPress

## 🎯 Test Rapide de l'Endpoint

Tester directement dans le navigateur :
```
http://ivoir-shop.local/wp-json/custom/v1/orders/user/1
```

**Réponse attendue :**
```json
[
  {
    "id": 123,
    "order_number": "123",
    "status": "completed",
    "date_created": "2024-01-15T10:30:00",
    "total": "25000",
    "currency": "XOF",
    ...
  }
]
```

**Si erreur 404 :**
- L'endpoint n'existe pas → Vérifier `functions.php`
- Flush permalinks → WordPress Admin → Réglages → Permaliens → Enregistrer

**Si `[]` (tableau vide) :**
- Aucune commande pour ce user_id
- Vérifier le `customer_id` dans la base de données

## 📞 Après le Debug

Une fois que vous aurez regardé les logs, vous saurez exactement où est le problème :

1. **Authentification** → Problème avec useAuth()
2. **API Nuxt** → Problème de communication avec WordPress
3. **API WordPress** → Endpoint non trouvé ou erreur PHP
4. **Base de données** → Aucune commande ou mauvais customer_id

**Copiez tous les logs et je pourrai vous aider précisément !** 🔍

---

**Date :** ${new Date().toLocaleDateString('fr-FR')}
**Status :** 🐛 Logs de debug ajoutés - Prêt pour diagnostic

