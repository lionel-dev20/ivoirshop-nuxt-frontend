# 📦 Système de commandes utilisateur

## Date : Novembre 2024

---

## ✅ Ce qui a été mis en place

### 1. **Endpoint WordPress pour récupérer les commandes**

Un nouvel endpoint a été ajouté dans `functions.php` :

```
GET /wp-json/custom/v1/orders/user/{user_id}
```

**Fonctionnalités :**
- Récupère toutes les commandes d'un utilisateur spécifique
- Retourne les détails complets (produits, images, adresses, paiement)
- Pas d'authentification requise (mais utilise l'ID utilisateur)
- Tri par date décroissante (les plus récentes en premier)

**Données retournées pour chaque commande :**
```json
{
  "id": 123,
  "order_number": "123",
  "status": "processing",
  "date_created": "2024-11-06T10:30:00",
  "total": "25000",
  "currency": "FCFA",
  "payment_method": "cod",
  "payment_method_title": "Paiement à la livraison",
  "shipping_total": "2000",
  "discount_total": "0",
  "customer_note": "...",
  "billing": {
    "first_name": "Jean",
    "last_name": "Dupont",
    "email": "jean@example.com",
    "phone": "+225...",
    "address_1": "Cocody",
    "city": "Abidjan-lagunes",
    ...
  },
  "items": [
    {
      "product_id": 456,
      "name": "iPhone 14 Pro",
      "quantity": 1,
      "total": "500000",
      "image": "https://..."
    }
  ]
}
```

---

### 2. **API Nuxt pour les commandes**

**Fichier :** `server/api/orders/user/[id].get.ts`

**Fonctionnement :**
- Reçoit l'ID utilisateur en paramètre
- Appelle l'endpoint WordPress
- Retourne les commandes formatées

**Utilisation dans le code :**
```typescript
const orders = await $fetch<Order[]>(`/api/orders/user/${userId}`)
```

---

### 3. **Page "Mes commandes"**

**URL :** `/mes-commandes`

**Fonctionnalités :**

#### 📊 **Statistiques rapides**
- Total de commandes
- Commandes livrées
- Commandes en cours

#### 📋 **Liste des commandes**

Chaque carte de commande affiche :

**En-tête :**
- Numéro de commande
- Date et heure
- Statut avec badge coloré

**Articles :**
- Image du produit (ou placeholder)
- Nom du produit
- Quantité
- Prix unitaire

**Informations de livraison :**
- Nom complet
- Adresse complète
- Téléphone

**Informations de paiement :**
- Méthode de paiement
- Frais de livraison
- Réduction (si applicable)

**Note client :** (si renseignée)

**Total :** Montant total en gros et en couleur

#### 🎨 **Design moderne**

- Interface responsive (mobile + desktop)
- Cartes avec ombres au survol
- Badges de statut colorés
- Animations de chargement
- Gestion des erreurs élégante
- État vide avec CTA vers la boutique

---

### 4. **États et statuts des commandes**

| Statut WordPress | Affichage | Couleur |
|-----------------|-----------|---------|
| `pending` | En attente | Jaune |
| `processing` | En cours de traitement | Bleu |
| `on-hold` | En attente | Orange |
| `completed` | Terminée | Vert |
| `cancelled` | Annulée | Rouge |
| `refunded` | Remboursée | Gris |
| `failed` | Échouée | Rouge |

---

### 5. **Navigation**

Le lien "Mes commandes" est accessible :

**Menu compte (header) :**
1. Cliquer sur l'icône utilisateur
2. Menu déroulant apparaît
3. Option "Mes commandes" visible pour les utilisateurs connectés

**Page profil :**
- Section "Mes commandes récentes" sur `/auth/profil`
- Affiche un résumé des dernières commandes

---

## 🔐 Sécurité et authentification

### Middleware d'authentification

La page `/mes-commandes` utilise le middleware `auth` :

```typescript
definePageMeta({
  middleware: 'auth'
})
```

**Comportement :**
- Si non connecté → Redirection vers `/auth/login`
- Si connecté → Affichage des commandes de l'utilisateur

### Protection des données

- Chaque utilisateur ne voit que SES propres commandes
- L'ID utilisateur est récupéré depuis la session
- Pas de possibilité d'accéder aux commandes d'autres utilisateurs

---

## 📱 Responsive

La page s'adapte à tous les écrans :

### Desktop
- Grille 3 colonnes pour les statistiques
- Colonnes 2 pour les infos livraison/paiement
- Cartes larges avec images de taille moyenne

### Tablet
- Grille 2 colonnes pour les statistiques
- Disposition empilée pour les infos

### Mobile
- Tout en colonne unique
- Images plus petites
- Menu hamburger pour la navigation

---

## 🎯 Utilisation

### Pour l'utilisateur

1. **Se connecter**
   - Cliquer sur l'icône utilisateur
   - Se connecter ou créer un compte

2. **Accéder aux commandes**
   - Cliquer sur l'icône utilisateur
   - Sélectionner "Mes commandes"
   - OU aller directement sur `/mes-commandes`

3. **Consulter une commande**
   - Voir tous les détails dans la carte
   - Vérifier le statut
   - Voir les articles commandés
   - Consulter l'adresse de livraison

### Pour le développeur

**Récupérer les commandes dans un composant :**

```typescript
import { useAuth } from '@/composables/useAuth'

const { user } = useAuth()
const orders = ref<Order[]>([])

const loadOrders = async () => {
  if (user.value?.id) {
    orders.value = await $fetch(`/api/orders/user/${user.value.id}`)
  }
}

onMounted(loadOrders)
```

---

## 🐛 Dépannage

### Problème : "Configuration WooCommerce manquante"

**Cause :** Variables d'environnement manquantes

**Solution :**
Vérifiez votre fichier `.env` :
```bash
WORDPRESS_URL=http://ivoir-shop.local
WC_STORE_URL=http://ivoir-shop.local
```

### Problème : Aucune commande affichée

**Vérifications :**

1. **L'utilisateur est-il connecté ?**
   ```javascript
   console.log(useAuth().user.value)
   ```

2. **L'endpoint WordPress fonctionne-t-il ?**
   ```
   GET http://ivoir-shop.local/wp-json/custom/v1/orders/user/{user_id}
   ```

3. **Y a-t-il des commandes dans WooCommerce ?**
   - Vérifier dans WordPress Admin → WooCommerce → Commandes

### Problème : Erreur 404 sur l'API

**Cause :** L'endpoint n'existe pas dans WordPress

**Solution :**
Vérifiez que le code de l'endpoint a bien été ajouté dans `functions.php` et que WordPress est actif.

### Problème : Images des produits manquantes

**Cause :** Les produits n'ont pas d'images ou les URLs sont incorrectes

**Solution :**
- Vérifier que les produits ont des images dans WooCommerce
- Un placeholder s'affiche automatiquement si pas d'image

---

## 📋 Checklist de vérification

- [x] Endpoint WordPress créé (`/wp-json/custom/v1/orders/user/{user_id}`)
- [x] API Nuxt configurée (`/api/orders/user/[id].get.ts`)
- [x] Page mes-commandes créée et stylée
- [x] Middleware d'authentification actif
- [x] Lien dans le menu compte
- [x] Gestion des états (loading, error, empty)
- [x] Design responsive
- [x] Statistiques affichées
- [x] Statuts colorés
- [x] Images des produits
- [x] Formatage des prix
- [x] Formatage des dates

---

## 🎨 Personnalisation

### Modifier les couleurs des statuts

Dans `mes-commandes.vue`, fonction `getStatusClass()` :

```typescript
const getStatusClass = (status: string) => {
  return {
    'processing': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
    // Ajoutez vos couleurs ici
  }[status]
}
```

### Ajouter des filtres

Ajoutez un système de filtres par statut :

```typescript
const filterStatus = ref('all')
const filteredOrders = computed(() => {
  if (filterStatus.value === 'all') return orders.value
  return orders.value.filter(o => o.status === filterStatus.value)
})
```

### Ajouter la pagination

Pour gérer beaucoup de commandes :

```typescript
const page = ref(1)
const perPage = 10
const paginatedOrders = computed(() => {
  const start = (page.value - 1) * perPage
  return orders.value.slice(start, start + perPage)
})
```

---

## 📞 Support

Pour toute question ou amélioration, consultez :
- La documentation WooCommerce
- La documentation Nuxt 3
- Les logs du serveur pour le debugging

---

## ✨ Améliorations futures possibles

1. **Télécharger une facture PDF**
2. **Annuler une commande**
3. **Suivre la livraison en temps réel**
4. **Laisser un avis sur les produits**
5. **Récommander les mêmes articles**
6. **Filtrer par date ou statut**
7. **Rechercher dans les commandes**
8. **Notifications push pour les changements de statut**

