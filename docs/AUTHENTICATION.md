# Documentation - Système d'authentification

## Vue d'ensemble

Le système d'authentification de **ivoir-shop-ci** utilise JWT (JSON Web Tokens) avec des cookies httpOnly sécurisés pour gérer les sessions utilisateur. Il est intégré avec WordPress/WooCommerce pour la gestion des utilisateurs.

## Architecture

### Composants principaux

1. **Composable `useAuth()`** - Gestion globale de l'état d'authentification
2. **Plugin auth** - Initialisation automatique de la session au démarrage
3. **Middleware auth** - Protection des routes nécessitant une authentification
4. **Endpoints API** - Gestion des opérations d'authentification côté serveur

## Utilisation

### 1. Connexion utilisateur

```vue
<script setup>
import { useAuth } from '@/composables/useAuth'

const { signin, loading, error } = useAuth()
const email = ref('')
const password = ref('')

const login = async () => {
  try {
    await signin({
      username: email.value,
      password: password.value
    })
    // Redirection après connexion réussie
    await navigateTo('/auth/profil')
  } catch (err) {
    console.error('Erreur:', err)
  }
}
</script>
```

### 2. Inscription utilisateur

```vue
<script setup>
import { useAuth } from '@/composables/useAuth'

const { register, loading, error } = useAuth()

const handleRegister = async () => {
  try {
    const response = await register({
      username: form.name,
      email: form.email,
      password: form.password,
    })
    
    if (response.success) {
      await navigateTo('/auth/login')
    }
  } catch (err) {
    console.error('Erreur:', err)
  }
}
</script>
```

### 3. Vérifier l'état de connexion

```vue
<script setup>
import { useAuth } from '@/composables/useAuth'

const { isAuthenticated, user } = useAuth()
</script>

<template>
  <div v-if="isAuthenticated">
    <p>Bienvenue {{ user.first_name }} !</p>
  </div>
  <div v-else>
    <p>Veuillez vous connecter</p>
  </div>
</template>
```

### 4. Déconnexion

```vue
<script setup>
import { useAuth } from '@/composables/useAuth'

const { logout } = useAuth()

const handleLogout = async () => {
  await logout()
  // Redirection automatique vers la page d'accueil
}
</script>
```

### 5. Protéger une route

Dans votre page Vue, ajoutez le middleware :

```vue
<script setup>
definePageMeta({
  middleware: 'auth'
})
</script>
```

## Endpoints API

### Authentification

#### POST `/api/auth/login`
Connexion d'un utilisateur avec JWT.

**Body:**
```json
{
  "username": "email@example.com",
  "password": "motdepasse"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "utilisateur",
    "email": "email@example.com",
    "first_name": "Prénom",
    "last_name": "Nom"
  }
}
```

#### POST `/api/auth/register`
Création d'un nouveau compte utilisateur.

**Body:**
```json
{
  "username": "nomutilisateur",
  "email": "email@example.com",
  "password": "motdepasse"
}
```

**Response:**
```json
{
  "success": true,
  "user": { ... },
  "message": "Compte créé avec succès"
}
```

#### GET `/api/auth/me`
Récupère les informations de l'utilisateur connecté.

**Response:**
```json
{
  "id": 1,
  "username": "utilisateur",
  "email": "email@example.com",
  "first_name": "Prénom",
  "last_name": "Nom"
}
```

#### POST `/api/auth/logout`
Déconnexion de l'utilisateur (supprime le cookie).

**Response:**
```json
{
  "success": true
}
```

### WooCommerce

#### GET `/api/woocommerce/me`
Récupère le profil complet WooCommerce de l'utilisateur.

**Response:**
```json
{
  "data": { 
    "id": 1,
    "email": "email@example.com",
    "first_name": "Prénom",
    "last_name": "Nom",
    "billing": { ... },
    "shipping": { ... }
  },
  "error": null
}
```

#### GET `/api/woocommerce/my-orders`
Récupère les commandes de l'utilisateur connecté.

**Response:**
```json
{
  "data": [
    {
      "id": 123,
      "status": "completed",
      "total": "50000",
      "date_created": "2025-01-15T10:30:00"
    }
  ],
  "error": null
}
```

#### PUT `/api/woocommerce/update-user`
Met à jour le profil de l'utilisateur.

**Body:**
```json
{
  "first_name": "Nouveau Prénom",
  "last_name": "Nouveau Nom",
  "email": "newemail@example.com"
}
```

**Response:**
```json
{
  "data": { /* utilisateur mis à jour */ },
  "error": null
}
```

## Sécurité

### Cookies httpOnly
Les tokens JWT sont stockés dans des cookies httpOnly, ce qui empêche les attaques XSS (Cross-Site Scripting) car le JavaScript côté client ne peut pas accéder au cookie.

### Configuration des cookies
```javascript
setCookie(event, 'auth_token', token, {
  httpOnly: true,              // Non accessible via JavaScript
  secure: process.env.NODE_ENV === 'production', // HTTPS en production
  sameSite: 'lax',            // Protection CSRF
  path: '/',                   // Disponible sur tout le site
  maxAge: 60 * 60 * 24 * 7,   // 7 jours
})
```

### Bonnes pratiques

1. **Mots de passe** : Minimum 6 caractères (configurable)
2. **Sessions** : Durée de 7 jours, renouvelée à chaque connexion
3. **Erreurs** : Messages génériques pour éviter la divulgation d'informations
4. **HTTPS** : Obligatoire en production (cookies secure)

## Variables d'environnement requises

Créez un fichier `.env` avec :

```bash
# URL de votre WordPress/WooCommerce
WORDPRESS_URL=https://votre-site-wordpress.com

# Clés API WooCommerce
WOOCOMMERCE_CONSUMER_KEY=ck_xxxxxxxxxxxxxxxxxxxxx
WOOCOMMERCE_CONSUMER_SECRET=cs_xxxxxxxxxxxxxxxxxxxxx

# Environnement
NODE_ENV=development
```

## Configuration WordPress requise

### Plugin JWT Authentication
Installez et configurez le plugin **JWT Authentication for WP REST API**.

Dans `wp-config.php`, ajoutez :

```php
define('JWT_AUTH_SECRET_KEY', 'votre-cle-secrete-tres-longue-et-aleatoire');
define('JWT_AUTH_CORS_ENABLE', true);
```

### Permissions WooCommerce
Assurez-vous que les clés API WooCommerce ont les permissions suivantes :
- Lecture/Écriture pour les clients (customers)
- Lecture pour les commandes (orders)

## Dépannage

### L'utilisateur n'est pas connecté après le login

1. Vérifiez que le plugin JWT est bien installé sur WordPress
2. Vérifiez que `JWT_AUTH_SECRET_KEY` est défini dans `wp-config.php`
3. Vérifiez les logs du serveur : `console.log` dans les endpoints API
4. Vérifiez que les cookies sont bien créés (DevTools > Application > Cookies)

### Erreur "Non autorisé" sur les routes protégées

1. Vérifiez que le cookie `auth_token` existe
2. Vérifiez que le token JWT n'est pas expiré
3. Testez l'endpoint `/api/auth/me` pour voir si le token est valide

### Les données WooCommerce ne se chargent pas

1. Vérifiez les clés API WooCommerce
2. Vérifiez que l'utilisateur existe dans WooCommerce (pas seulement WordPress)
3. Vérifiez les logs côté serveur pour les erreurs WooCommerce API

## État global partagé

Le composable `useAuth()` utilise un état global partagé entre toutes les instances. Cela signifie que :

- Toutes les parties de l'application ont accès au même état utilisateur
- Pas besoin de prop drilling ou de contexte
- L'état persiste automatiquement entre les pages
- Un seul appel à `fetchUser()` au démarrage suffit

```javascript
// État global (défini une seule fois dans le composable)
const globalUser = ref<User | null>(null)
const globalLoading = ref(false)
const globalError = ref<string | null>(null)
```

## Exemple complet

Voir les fichiers suivants pour des exemples complets :
- `/app/pages/auth/login.vue` - Page de connexion
- `/app/pages/auth/signup.vue` - Page d'inscription
- `/app/pages/auth/profil.vue` - Page de profil (route protégée)
- `/app/components/AccountMenu.vue` - Menu compte utilisateur

---

**Dernière mise à jour :** Octobre 2025













