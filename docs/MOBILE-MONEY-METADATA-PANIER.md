# 🛒 Système de Paiement Mobile Money avec Traçabilité du Panier

## 📋 Vue d'ensemble

Ce système utilise la propriété **`metadata`** de l'API de paiement pour envoyer et récupérer des données personnalisées, notamment le **contenu du panier** du client.

### 🎯 Pourquoi cette approche ?

✅ **Traçabilité complète** : Même en cas de bug, vous avez toujours une trace du panier  
✅ **Intégrité des données** : Garantit que le client a payé exactement ce qu'il a commandé  
✅ **Debugging facilité** : Retrouvez facilement les détails d'une commande  
✅ **Backup automatique** : Les données sont stockées côté API de paiement  

---

## 🔄 Flux Complet du Paiement

```
┌─────────────┐
│   CLIENT    │
│   Panier    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────────┐
│ 1. Checkout: Création du lien de paiement      │
│    POST /api/payment/mobile-money/create-link   │
│                                                 │
│    Envoie:                                      │
│    - amount                                     │
│    - order_id                                   │
│    - customer_name, email, phone                │
│    - cart_items: [                              │
│        { product_id, name, quantity, price }    │
│      ]                                          │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│ 2. API de Paiement (DjoNanko)                   │
│    - Génère un lien de paiement                 │
│    - STOCKE les metadata (avec cart_items)      │
│    - Retourne: payment_url                      │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│ 3. Client redirigé vers le lien de paiement     │
│    - Choisit son opérateur (Orange/MTN/Moov)    │
│    - Effectue le paiement                       │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│ 4. API appelle votre WEBHOOK                    │
│    POST https://ivoirshop.ci/api/payment/       │
│         mobile-money/callback                   │
│                                                 │
│    Payload reçu:                                │
│    {                                            │
│      status: "success",                         │
│      transaction_id: "TXN123",                  │
│      amount: 50000,                             │
│      metadata: {                                │
│        order_id: "123",                         │
│        email: "client@email.com",               │
│        phoneNumber: "+2250101010101",           │
│        customer_name: "John Doe",               │
│        cart_items: [                            │
│          {                                      │
│            product_id: 456,                     │
│            name: "iPhone 15",                   │
│            quantity: 1,                         │
│            price: 50000,                        │
│            total: 50000                         │
│          }                                      │
│        ]                                        │
│      }                                          │
│    }                                            │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│ 5. Vous avez TOUTES les données                 │
│    - Statut du paiement                         │
│    - Détails de la commande                     │
│    - Contenu exact du panier                    │
└─────────────────────────────────────────────────┘
```

---

## 📤 1. Envoyer le Panier lors de la Création du Lien

### Endpoint: `POST /api/payment/mobile-money/create-link`

```json
{
  "amount": 50000,
  "order_id": "123",
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "phone": "+2250101010101",
  "cart_items": [
    {
      "product_id": 456,
      "name": "iPhone 15 Pro",
      "quantity": 1,
      "price": 50000,
      "total": 50000
    },
    {
      "product_id": 789,
      "name": "Coque iPhone",
      "quantity": 2,
      "price": 5000,
      "total": 10000
    }
  ]
}
```

### Format de `cart_items`

Chaque produit doit contenir :

| Champ | Type | Description |
|-------|------|-------------|
| `product_id` | number | ID du produit dans WooCommerce |
| `name` | string | Nom du produit |
| `quantity` | number | Quantité commandée |
| `price` | number | Prix unitaire (FCFA) |
| `total` | number | Prix total pour ce produit (price × quantity) |

---

## 📥 2. Recevoir le Panier dans le Webhook

### Endpoint: `POST /api/payment/mobile-money/callback`

### Exemple de Payload Reçu

```json
{
  "status": "success",
  "transaction_id": "TXN-20250108-ABC123",
  "amount": 60000,
  "createdAt": "2025-01-08T10:30:00Z",
  "updatedAt": "2025-01-08T10:35:00Z",
  "metadata": {
    "order_id": "123",
    "email": "john@example.com",
    "phoneNumber": "+2250101010101",
    "customer_name": "John Doe",
    "cart_items": [
      {
        "product_id": 456,
        "name": "iPhone 15 Pro",
        "quantity": 1,
        "price": 50000,
        "total": 50000
      },
      {
        "product_id": 789,
        "name": "Coque iPhone",
        "quantity": 2,
        "price": 5000,
        "total": 10000
      }
    ]
  }
}
```

### Réponse du Webhook

Le webhook retourne simplement le payload reçu :

```json
{
  "received": true,
  "timestamp": "2025-01-08T10:35:01.234Z",
  "payload": { /* payload complet */ }
}
```

---

## 💻 Exemple d'Utilisation depuis le Frontend

### Dans `checkout.vue` (ou composant similaire)

```typescript
const createPaymentLink = async () => {
  const cart = useCart() // Votre store de panier
  
  // Préparer le panier au format attendu
  const cart_items = cart.items.map(item => ({
    product_id: item.id,
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    total: item.price * item.quantity
  }))
  
  // Créer le lien de paiement avec le panier
  const response = await $fetch('/api/payment/mobile-money/create-link', {
    method: 'POST',
    body: {
      amount: cart.total,
      order_id: orderData.id,
      customer_name: customerData.billing.first_name + ' ' + customerData.billing.last_name,
      customer_email: customerData.billing.email,
      phone: customerData.billing.phone,
      cart_items: cart_items // 🛒 Panier inclus !
    }
  })
  
  // Rediriger vers le lien de paiement
  if (response.success && response.payment_url) {
    window.location.href = response.payment_url
  }
}
```

---

## 🔍 Logs dans la Console

Quand le webhook reçoit une notification, vous verrez dans les logs :

```
============================================
📥 WEBHOOK PAYLOAD REÇU
============================================
Status: success
Transaction ID: TXN-20250108-ABC123
Amount: 60000
Metadata: {
  "order_id": "123",
  "email": "john@example.com",
  "phoneNumber": "+2250101010101",
  "customer_name": "John Doe",
  "cart_items": [...]
}
---
🛒 DÉTAILS DE LA COMMANDE:
Order ID: 123
Client: John Doe
Email: john@example.com
Téléphone: +2250101010101
---
📦 PANIER (2 produits):
  1. iPhone 15 Pro x1 - 50000 FCFA
  2. Coque iPhone x2 - 5000 FCFA
============================================
```

---

## 🎯 Cas d'Usage

### 1. Vérification de l'intégrité du paiement

```typescript
// Dans votre traitement du webhook
if (payload.metadata.cart_items) {
  const totalCalculated = payload.metadata.cart_items.reduce(
    (sum, item) => sum + item.total, 
    0
  )
  
  if (totalCalculated !== payload.amount) {
    console.error('⚠️ Montant du panier ne correspond pas au montant payé!')
  }
}
```

### 2. Récupération après un bug

```typescript
// Si vous perdez les données de commande
// Le webhook a TOUJOURS une copie du panier
const order = await findOrderById(payload.metadata.order_id)

if (!order.line_items || order.line_items.length === 0) {
  console.log('Reconstruction du panier depuis le webhook...')
  order.line_items = payload.metadata.cart_items
}
```

### 3. Audit et Traçabilité

```typescript
// Stocker le payload du webhook pour audit
await database.paymentWebhooks.create({
  transaction_id: payload.transaction_id,
  order_id: payload.metadata.order_id,
  amount: payload.amount,
  cart_snapshot: payload.metadata.cart_items, // Snapshot du panier
  received_at: new Date()
})
```

---

## 🛡️ Sécurité et Bonnes Pratiques

### ✅ À FAIRE

1. **Toujours inclure `cart_items`** lors de la création du lien
2. **Vérifier le montant total** correspond à la somme des items
3. **Logger tous les webhooks** reçus (pour debug et audit)
4. **Stocker le payload** dans une table de backup
5. **Valider la signature** du webhook (si l'API le supporte)

### ❌ À ÉVITER

1. Ne pas stocker de données sensibles dans les metadata (mots de passe, cartes bancaires)
2. Ne pas modifier `cart_items` après création du lien
3. Ne pas oublier d'ajouter le panier - c'est votre backup !

---

## 📚 Fichiers Modifiés

### 1. `server/api/payment/mobile-money/create-link.post.ts`
- ✅ Ajout de `cart_items` dans les metadata
- ✅ Ajout de `customer_name` dans les metadata

### 2. `server/api/payment/mobile-money/callback.post.ts`
- ✅ Extraction et affichage du panier dans les logs
- ✅ Meilleure structuration des logs
- ✅ Timestamp ajouté dans la réponse

---

## 🧪 Test du Système

### 1. Tester la création du lien avec panier

```bash
curl -X POST https://ivoirshop.ci/api/payment/mobile-money/create-link \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50000,
    "order_id": "TEST-123",
    "customer_name": "Test User",
    "customer_email": "test@example.com",
    "phone": "+2250101010101",
    "cart_items": [
      {
        "product_id": 1,
        "name": "Produit Test",
        "quantity": 1,
        "price": 50000,
        "total": 50000
      }
    ]
  }'
```

### 2. Simuler un webhook

```bash
curl -X POST https://ivoirshop.ci/api/payment/mobile-money/callback \
  -H "Content-Type: application/json" \
  -d '{
    "status": "success",
    "transaction_id": "TEST-TXN-123",
    "amount": 50000,
    "metadata": {
      "order_id": "TEST-123",
      "email": "test@example.com",
      "phoneNumber": "+2250101010101",
      "customer_name": "Test User",
      "cart_items": [
        {
          "product_id": 1,
          "name": "Produit Test",
          "quantity": 1,
          "price": 50000,
          "total": 50000
        }
      ]
    }
  }'
```

---

## 🚀 Prochaines Étapes

Pour traiter automatiquement les webhooks (créer/mettre à jour la commande dans WooCommerce), vous pouvez modifier le fichier `callback.post.ts` pour ajouter le traitement après avoir reçu le payload.

**Exemple :**

```typescript
// Après avoir reçu et loggé le payload
if (payload.status === 'success' && payload.metadata) {
  // Créer ou mettre à jour la commande dans WooCommerce
  await updateWooCommerceOrder(
    payload.metadata.order_id,
    payload.transaction_id,
    payload.metadata.cart_items
  )
}
```

---

## 📞 Support

Pour toute question sur ce système :
- Documentation API : Voir les autres fichiers dans `/docs`
- Tests : Utilisez les commandes PowerShell dans `/scripts`
- Logs : Consultez la console serveur pour voir les webhooks reçus

---

**✅ Système opérationnel et prêt à l'emploi !**

