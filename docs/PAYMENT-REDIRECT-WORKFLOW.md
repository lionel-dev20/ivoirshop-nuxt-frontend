# 🔄 Workflow de Redirection après Paiement Mobile Money

## 📋 Vue d'ensemble

Ce système gère automatiquement les redirections après un paiement Mobile Money :
- ✅ **Paiement réussi** → Redirection vers **thank-you** avec les infos de commande
- ❌ **Paiement échoué** → Redirection vers **checkout** pour recommencer

---

## 🔄 Flux Complet

```
┌─────────────────────────────────────────────┐
│ 1. CLIENT AU CHECKOUT                       │
│    - Remplit le formulaire                  │
│    - Clique sur "Payer avec Mobile Money"   │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ 2. GÉNÉRATION DU LIEN DE PAIEMENT           │
│    - Order ID temporaire: ORD-XXX           │
│    - Données sauvegardées dans             │
│      sessionStorage ('pendingCheckout')     │
│    - return_url configuré                   │
│    - cancel_url configuré                   │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│ 3. REDIRECTION VERS DJONANKO                │
│    https://checkout.djonanko.ci/PAYXXX      │
│                                             │
│    - Client choisit opérateur               │
│    - Client valide le paiement              │
└──────────────────┬──────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
    SUCCESS ✅            FAILED ❌
        │                     │
        ▼                     ▼
┌─────────────────┐   ┌─────────────────┐
│ return_url      │   │ cancel_url      │
│ /api/payment/   │   │ /checkout?      │
│ mobile-money/   │   │ payment_failed= │
│ success?        │   │ true&order_id=  │
│ order_id=XXX    │   │ XXX             │
└────────┬────────┘   └────────┬────────┘
         │                     │
         ▼                     ▼
┌─────────────────┐   ┌─────────────────┐
│ 4a. SUCCESS.GET │   │ 4b. CHECKOUT    │
│ Redirige vers   │   │ Affiche message │
│ /thank-you?     │   │ d'erreur        │
│ payment_success=│   │ Client peut     │
│ true&order_id=  │   │ réessayer       │
│ XXX             │   │                 │
└────────┬────────┘   └─────────────────┘
         │
         ▼
┌─────────────────────────────────────────────┐
│ 5. PAGE THANK-YOU                           │
│    - Récupère données de sessionStorage     │
│    - Affiche infos de commande              │
│    - Affiche "Payé par Mobile Money" ✅    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ PARALLÈLE: WEBHOOK (asynchrone)             │
│    - API DjoNanko appelle le webhook        │
│    - Webhook crée la commande WooCommerce   │
│    - Statut: "processing"                   │
│    - Note: "✅ Payé par Mobile Money"      │
└─────────────────────────────────────────────┘
```

---

## 🎯 URLs de Retour

### 1. return_url (Paiement Réussi)

**URL :** `/api/payment/mobile-money/success?order_id={tempOrderId}`

**Exemple :** 
```
https://ivoirshop.ci/api/payment/mobile-money/success?order_id=ORD-1736316240123-A7F3KP
```

**Ce qui se passe :**
1. ✅ Endpoint `success.get.ts` est appelé
2. ✅ Log dans la console serveur
3. ✅ Redirection vers `/thank-you?payment_success=true&order_id=XXX`

### 2. cancel_url (Paiement Échoué)

**URL :** `/checkout?payment_failed=true&order_id={tempOrderId}`

**Exemple :**
```
https://ivoirshop.ci/checkout?payment_failed=true&order_id=ORD-1736316240123-A7F3KP
```

**Ce qui se passe :**
1. ❌ Redirection directe vers la page checkout
2. ❌ Message d'erreur affiché en haut de page
3. ❌ Client peut modifier ses informations et réessayer

---

## 💾 Gestion des Données

### sessionStorage

Le système utilise `sessionStorage` pour persister les données entre les redirections :

#### 1. **pendingCheckout** (sauvegardé au checkout)

```typescript
{
  items: [
    {
      product_id: 456,
      name: "iPhone 15 Pro",
      quantity: 1,
      price: 500000
    }
  ],
  total: 500000,
  shipping_cost: 2500,
  billing: {
    first_name: "John",
    last_name: "Doe",
    email: "john@example.com",
    phone: "0101010101",
    address_1: "Cocody",
    city: "Abidjan",
    country: "CI"
  },
  shipping: { /* same as billing */ }
}
```

**Sauvegardé :** Lors du clic sur "Payer avec Mobile Money"  
**Utilisé :** Sur la page thank-you pour afficher les infos  
**Supprimé :** Après affichage sur thank-you

#### 2. **lastOrder** (sauvegardé après affichage)

Copie de `pendingCheckout` transformée, utilisée en cas de refresh de la page thank-you.

---

## 📄 Page Thank-You

### Affichage pour Paiement Mobile Money

Quand `payment_success=true` dans l'URL :

1. ✅ **Récupère** `pendingCheckout` depuis sessionStorage
2. ✅ **Transforme** les données au bon format
3. ✅ **Affiche** :
   - Icône de succès verte ✅
   - Numéro de commande temporaire
   - **Méthode de paiement : "Payé par Mobile Money"**
   - Liste des produits
   - Informations de livraison
   - Message : "Votre paiement a été confirmé avec succès"
   - Prochaines étapes : "Déjà payée ✅"

### Affichage pour Paiement à la Livraison (ancien)

Quand pas de `payment_success` :

1. ✅ Récupère depuis `lastOrder` ou `query.data`
2. ✅ Affiche avec "Paiement à la livraison"
3. ✅ Message : "Vous paierez lors de la réception"

---

## 🛒 Page Checkout

### Détection d'Échec de Paiement

Quand `payment_failed=true` dans l'URL :

```vue
<div v-if="paymentFailed" class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
  <h3>Paiement échoué</h3>
  <p>Le paiement Mobile Money n'a pas pu être traité. 
     Veuillez réessayer ou choisir une autre méthode de paiement.</p>
  <button @click="paymentFailed = false">Fermer ce message</button>
</div>
```

**Code de détection :**
```typescript
const route = useRoute()
const paymentFailed = ref(route.query.payment_failed === 'true')
```

---

## 📝 Création de Commande WooCommerce

### Via le Webhook

Le webhook crée la commande **en arrière-plan** (de manière asynchrone) :

```typescript
const orderData = {
  payment_method: 'mobile_money',
  payment_method_title: 'Mobile Money',
  set_paid: true,              // ✅ Marquée comme PAYÉE
  status: 'processing',        // ✅ En cours de traitement
  transaction_id: 'TXN-ABC123',
  customer_note: '✅ Payé par Mobile Money - Transaction: TXN-ABC123',
  billing: { /* toutes les données client */ },
  line_items: [ /* tous les produits */ ],
  meta_data: [
    { key: '_transaction_id', value: 'TXN-ABC123' },
    { key: '_temp_order_id', value: 'ORD-XXX' }
  ]
}
```

### Statut dans WooCommerce

La commande créée aura :
- ✅ **Statut :** `processing` (En cours de traitement)
- ✅ **Payée :** `Oui` (set_paid: true)
- ✅ **Méthode :** Mobile Money
- ✅ **Note :** "✅ Payé par Mobile Money - Transaction: TXN-ABC123"

Dans le dashboard WooCommerce, vous verrez :
```
Commande #12345
Statut: En cours de traitement
Paiement: Payé par Mobile Money ✅
```

---

## 🔍 Logs Générés

### 1. Lors de la Génération du Lien

```
============================================
📤 REDIRECTION VERS PAIEMENT
============================================
Order ID: ORD-1736316240123-A7F3KP
Client: John Doe
Téléphone: 0101010101
Ville: Abidjan
Commune: Cocody
🛒 Panier: 2 produits
💰 Montant: 41500 FCFA
============================================
```

### 2. Retour Après Paiement Réussi

```
============================================
✅ RETOUR APRÈS PAIEMENT RÉUSSI
============================================
Query params: { order_id: 'ORD-XXX', transaction_id: 'TXN-ABC' }
Order ID: ORD-1736316240123-A7F3KP
Transaction ID: TXN-ABC123
============================================
```

### 3. Sur la Page Thank-You

```
✅ Paiement Mobile Money réussi, récupération des données...
✅ Données de commande récupérées: { order_id: 'ORD-XXX', ... }
```

### 4. Webhook Crée la Commande

```
============================================
📥 WEBHOOK PAYLOAD REÇU
============================================
Status: success
Transaction ID: TXN-ABC123
---
✅ PAIEMENT RÉUSSI - Création de la commande WooCommerce...
============================================
✅ COMMANDE WOOCOMMERCE CRÉÉE AVEC SUCCÈS !
============================================
Order ID WooCommerce: 12345
Order ID Temporaire: ORD-1736316240123-A7F3KP
Transaction ID: TXN-ABC123
============================================
```

---

## 🧪 Tests

### Test 1 : Paiement Réussi

**Étapes :**
1. Ajouter des produits au panier
2. Aller au checkout
3. Remplir le formulaire
4. Cliquer sur "Payer avec Mobile Money"
5. **Simuler un paiement réussi** (sur la page DjoNanko, valider)
6. Vérifier la redirection

**Résultat attendu :**
- ✅ Redirection vers `/thank-you?payment_success=true&order_id=ORD-XXX`
- ✅ Page affiche "Merci pour votre commande !"
- ✅ Méthode de paiement : "Payé par Mobile Money"
- ✅ Message : "Votre paiement a été confirmé avec succès"
- ✅ Prochaines étapes : "Déjà payée ✅"

### Test 2 : Paiement Échoué

**Étapes :**
1-4. Mêmes étapes que Test 1
5. **Simuler un paiement échoué** (annuler sur la page DjoNanko)
6. Vérifier la redirection

**Résultat attendu :**
- ❌ Redirection vers `/checkout?payment_failed=true`
- ❌ Message d'erreur affiché en rouge en haut de page
- ❌ Formulaire toujours rempli (données conservées)
- ❌ Client peut corriger et réessayer

### Test 3 : Vérifier la Commande WooCommerce

**Après un paiement réussi :**
1. Aller dans le dashboard WooCommerce
2. Chercher la commande

**Vérifier :**
- ✅ Statut : "En cours de traitement"
- ✅ Méthode de paiement : "Mobile Money"
- ✅ Payée : Oui
- ✅ Note de commande : "✅ Payé par Mobile Money - Transaction: TXN-ABC123"
- ✅ Toutes les données client présentes
- ✅ Tous les produits présents
- ✅ Métadonnées : `_transaction_id` et `_temp_order_id`

---

## 🔧 Configuration

### Variables d'Environnement

```bash
# URL du site (pour construire les URLs de retour)
SITE_URL=https://ivoirshop.ci

# API WooCommerce (pour créer les commandes)
WC_STORE_URL=https://admin.ivoirshop.ci

# API DjoNanko
MOBILE_MONEY_API_URL=https://apidjonanko.tech
MOBILE_MONEY_API_KEY=votre_clé
MOBILE_MONEY_API_SECRET=votre_secret
MOBILE_MONEY_REFERENCE=ivoirshop
```

### URLs Importantes

| URL | Rôle |
|-----|------|
| `/checkout` | Page de commande |
| `/api/payment/mobile-money/create-link` | Crée le lien de paiement |
| `/api/payment/mobile-money/success` | Retour après paiement réussi |
| `/api/payment/mobile-money/callback` | Webhook de notification |
| `/thank-you` | Page de confirmation |

---

## 📚 Fichiers Modifiés

### ✅ `app/pages/checkout.vue`
- URLs de retour avec `order_id`
- Sauvegarde dans sessionStorage

### ✅ `server/api/payment/mobile-money/success.get.ts`
- Logs de retour
- Redirection vers thank-you avec paramètres

### ✅ `app/pages/thank-you.vue`
- Détection de `payment_success`
- Récupération depuis sessionStorage
- Affichage "Payé par Mobile Money"
- Messages différenciés

### ✅ `server/api/payment/mobile-money/callback.post.ts`
- Création de commande WooCommerce
- Note client avec statut de paiement

---

## ✅ Résumé

| Scénario | URL de Retour | Page Affichée | Message |
|----------|---------------|---------------|---------|
| **Paiement réussi** ✅ | `/api/payment/mobile-money/success?order_id=XXX` | `/thank-you` | "Payé par Mobile Money ✅" |
| **Paiement échoué** ❌ | `/checkout?payment_failed=true&order_id=XXX` | `/checkout` | "Paiement échoué" (en rouge) |

**Commande WooCommerce :**
- ✅ Créée automatiquement par le webhook si paiement réussi
- ✅ Statut : "En cours de traitement"
- ✅ Payée : Oui
- ✅ Note : "✅ Payé par Mobile Money"

---

**Date :** 8 janvier 2025  
**Statut :** ✅ Implémenté et testé  
**Impact :** 🔴 Critique - UX complète du paiement

