# Guide de Résolution - Erreur 502

## 🚨 Problème Identifié

**Erreur :** `[GET] "/api/api/v1/categories": 500 Erreur lors de la récupération des catégories: Request failed with status code 502`

**Cause :** L'endpoint WordPress `/wp-json/custom/v1/categories` n'est pas accessible.

## 🔍 Diagnostic

### Étape 1: Exécuter le script de diagnostic
```bash
node debug-wordpress-connection.js
```

### Étape 2: Vérifier manuellement
1. **Test direct WordPress :**
   ```
   http://ivoir-shop.local/wp-json/custom/v1/categories
   ```

2. **Test API REST WordPress :**
   ```
   http://ivoir-shop.local/wp-json/
   ```

3. **Test endpoint de test :**
   ```
   http://ivoir-shop.local/wp-json/test/v1/wc-status
   ```

## ✅ Solutions Appliquées

### 1. **Système de Fallback Multi-Niveaux**
L'endpoint `/api/api/v1/categories` essaie maintenant :

1. **Endpoint personnalisé** : `/wp-json/custom/v1/categories`
2. **API WooCommerce** : `/wp-json/wc/v3/products/categories`
3. **Données de test** : Catégories par défaut

### 2. **Gestion d'Erreurs Améliorée**
- ✅ Logs détaillés pour chaque tentative
- ✅ Messages d'erreur informatifs
- ✅ Fallback automatique

### 3. **Configuration Flexible**
- ✅ Support des clés API WooCommerce
- ✅ Timeout configurable
- ✅ Headers appropriés

## 🔧 Résolution des Causes

### Cause 1: WordPress non accessible
**Solution :**
```bash
# Vérifier que WordPress est démarré
# Vérifier l'URL dans .env
WC_STORE_URL=http://ivoir-shop.local
```

### Cause 2: Endpoint personnalisé non enregistré
**Solution :**
1. Vérifier que le code dans `functions.php` est correct
2. Vérifier que les endpoints sont enregistrés
3. Vider le cache WordPress

### Cause 3: Problème de permissions
**Solution :**
1. Vérifier les permissions de fichiers
2. Vérifier la configuration Apache/Nginx
3. Vérifier les logs d'erreur

### Cause 4: Plugin WooCommerce non activé
**Solution :**
1. Activer WooCommerce
2. Configurer les clés API
3. Tester l'API standard

## 🧪 Tests de Vérification

### 1. **Test de l'endpoint Nuxt**
```bash
curl http://localhost:3000/api/api/v1/categories
```

### 2. **Test de l'endpoint WordPress**
```bash
curl http://ivoir-shop.local/wp-json/custom/v1/categories
```

### 3. **Test de l'API WooCommerce**
```bash
curl -u "ck_xxx:cs_xxx" http://ivoir-shop.local/wp-json/wc/v3/products/categories
```

## 📋 Checklist de Vérification

- [ ] WordPress est accessible
- [ ] L'endpoint `/wp-json/` fonctionne
- [ ] Le code dans `functions.php` est correct
- [ ] Les endpoints custom sont enregistrés
- [ ] WooCommerce est activé
- [ ] Les clés API WooCommerce sont configurées
- [ ] L'endpoint Nuxt fonctionne avec fallback
- [ ] Aucune erreur dans les logs

## 🎯 Résultat Attendu

Après correction, l'endpoint devrait :
- ✅ Fonctionner avec l'endpoint personnalisé (si disponible)
- ✅ Fallback vers WooCommerce standard (si nécessaire)
- ✅ Utiliser des données de test (en dernier recours)
- ✅ Retourner des catégories valides
- ✅ Afficher des logs informatifs

## 🚀 Améliorations Futures

- [ ] Cache des catégories
- [ ] Retry automatique
- [ ] Monitoring de santé
- [ ] Notifications d'erreur
- [ ] Interface d'administration

## 🔍 Logs à Surveiller

### Logs Nuxt
```bash
# Regarder les logs du serveur Nuxt
npm run dev
```

### Logs WordPress
```bash
# Regarder les logs d'erreur WordPress
tail -f /path/to/wordpress/wp-content/debug.log
```

### Logs Serveur
```bash
# Regarder les logs Apache/Nginx
tail -f /var/log/apache2/error.log
# ou
tail -f /var/log/nginx/error.log
```

