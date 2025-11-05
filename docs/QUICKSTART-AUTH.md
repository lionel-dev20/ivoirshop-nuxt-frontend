# 🚀 Guide de démarrage rapide - Authentification

## Configuration en 5 minutes

### 1️⃣ Configuration WordPress

#### Installer le plugin JWT
```bash
1. Allez dans WordPress Admin > Extensions > Ajouter
2. Recherchez "JWT Authentication for WP REST API"
3. Installez et activez le plugin
```

#### Configurer wp-config.php
Ajoutez ces lignes dans votre fichier `wp-config.php` :

```php
define('JWT_AUTH_SECRET_KEY', 'votre-cle-secrete-tres-longue-et-aleatoire-minimum-64-caracteres');
define('JWT_AUTH_CORS_ENABLE', true);
```

#### Générer les clés WooCommerce
```bash
1. WordPress Admin > WooCommerce > Paramètres
2. Onglet "Avancé" > "REST API"
3. Cliquez sur "Ajouter une clé"
4. Description : "Nuxt Frontend"
5. Utilisateur : Choisissez un administrateur
6. Permissions : Lecture/Écriture
7. Copiez les clés générées
```

---

### 2️⃣ Configuration Nuxt

#### Fichier .env
Créez ou modifiez votre fichier `.env` :

```bash
NODE_ENV=development
WORDPRESS_URL=https://votre-site-wordpress.com
WOOCOMMERCE_CONSUMER_KEY=ck_xxxxxxxxxxxxxxxx
WOOCOMMERCE_CONSUMER_SECRET=cs_xxxxxxxxxxxxxxxx
```

⚠️ **Important** : Remplacez les valeurs par vos propres clés !

---

### 3️⃣ Tester l'authentification

#### Test rapide de connexion
```bash
# Démarrez votre serveur Nuxt
npm run dev

# Ouvrez votre navigateur
http://localhost:3000/auth/login

# Connectez-vous avec un compte WordPress existant
```

#### Vérifier dans la console
Après connexion, vous devriez voir dans la console du navigateur :
```
✅ Utilisateur connecté: nom_utilisateur
```

#### Vérifier les cookies
1. Ouvrez DevTools (F12)
2. Onglet "Application" > "Cookies"
3. Vous devriez voir un cookie nommé `auth_token`

---

## 🎯 Premiers pas

### Utiliser l'authentification dans vos pages

```vue
<template>
  <div>
    <div v-if="isAuthenticated">
      <h1>Bonjour {{ user.first_name }} !</h1>
      <button @click="logout">Se déconnecter</button>
    </div>
    <div v-else>
      <NuxtLink to="/auth/login">Se connecter</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { useAuth } from '@/composables/useAuth'

const { isAuthenticated, user, logout } = useAuth()
</script>
```

### Protéger une route

```vue
<script setup>
// Cette page nécessite une authentification
definePageMeta({
  middleware: 'auth'
})
</script>

<template>
  <div>
    <h1>Page protégée</h1>
    <p>Seuls les utilisateurs connectés peuvent voir cette page.</p>
  </div>
</template>
```

---

## 🔍 Vérification de la configuration

### Test API WordPress
```bash
curl https://votre-site.com/wp-json/jwt-auth/v1/token \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"votre_username","password":"votre_password"}'
```

Vous devriez recevoir un token JWT.

### Test API WooCommerce
```bash
curl https://votre-site.com/wp-json/wc/v3/customers \
  -u "ck_xxx:cs_xxx"
```

Vous devriez recevoir la liste des clients.

---

## ❌ Problèmes courants

### "Connexion impossible"
**Solution :**
1. Vérifiez que le plugin JWT est activé
2. Vérifiez `JWT_AUTH_SECRET_KEY` dans wp-config.php
3. Vérifiez que l'utilisateur existe dans WordPress

### "Non autorisé"
**Solution :**
1. Vérifiez les clés WooCommerce dans .env
2. Vérifiez que les permissions sont "Lecture/Écriture"
3. Vérifiez que WORDPRESS_URL est correct (sans slash à la fin)

### "CORS Error"
**Solution :**
1. Ajoutez `JWT_AUTH_CORS_ENABLE` dans wp-config.php
2. Installez le plugin "CORS" sur WordPress
3. Configurez les headers CORS dans votre serveur WordPress

### Le cookie n'est pas créé
**Solution :**
1. Vérifiez que vous êtes en HTTPS en production
2. Vérifiez les paramètres SameSite des cookies
3. Vérifiez que le domaine du cookie correspond

---

## 📚 Documentation complète

Pour plus de détails, consultez :
- [Documentation complète](./AUTHENTICATION.md)
- [Changelog des modifications](./CHANGELOG-AUTH.md)

---

## 🆘 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs serveur Nuxt
2. Vérifiez les logs WordPress (wp-content/debug.log)
3. Vérifiez la console du navigateur (F12)
4. Consultez la documentation complète

---

**Prêt à commencer ? Bonne chance ! 🎉**





























