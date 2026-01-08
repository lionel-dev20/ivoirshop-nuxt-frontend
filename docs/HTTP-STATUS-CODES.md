# 🔢 Codes de Statut HTTP - Paiement Mobile Money

## ✅ Standardisation à 200 OK

Tous les endpoints de paiement mobile money retournent maintenant **explicitement le statut HTTP 200 OK** pour les réponses réussies, même si les APIs externes peuvent retourner d'autres codes 2xx (comme 201 Created).

---

## 📋 Pourquoi cette Standardisation ?

### Problème Initial
L'API externe (DjoNanko) retourne un statut **201 Created** lors de la création d'un lien de paiement, ce qui est techniquement correct mais peut causer des problèmes :

```json
Status: 201
Response: {
  "success": true,
  "paymentLink": {
    "id": "82e53100-1c56-492b-a582-53dc1c92ca56",
    "paymentUrl": "https://checkout.djonanko.ci/PAYAFE1E4P2PD"
  }
}
```

### Solution Appliquée
Nos endpoints **normalisent** toujours la réponse à **200 OK**, peu importe ce que l'API externe retourne.

**Avantages :**
- ✅ **Cohérence** : Tous vos endpoints répondent de la même manière
- ✅ **Simplicité** : Pas besoin de gérer différents codes de succès (200, 201, etc.)
- ✅ **Compatibilité** : Certains clients HTTP ou frameworks attendent explicitement 200
- ✅ **Clarté** : 200 = succès, tout le reste = erreur (4xx, 5xx)

---

## 📁 Fichiers Modifiés

Tous les endpoints de paiement mobile money forcent maintenant le statut à 200 :

### ✅ `create-link.post.ts`
```typescript
// Forcer le statut à 200 OK (même si l'API externe retourne 201)
setResponseStatus(event, 200)

return {
  success: true,
  payment_url: paymentUrl,
  transaction_id: transactionId,
  reference: reference
}
```

### ✅ `callback.post.ts`
```typescript
// Forcer le statut à 200 OK
setResponseStatus(event, 200)

return {
  received: true,
  timestamp: new Date().toISOString(),
  payload: payload
}
```

### ✅ `set-webhook.post.ts`
```typescript
// Forcer le statut à 200 OK
setResponseStatus(event, 200)

return {
  success: true,
  message: 'Webhook configuré avec succès',
  webhookUrl: webhookUrl
}
```

### ✅ `verify.post.ts`
```typescript
// Forcer le statut à 200 OK
setResponseStatus(event, 200)

return {
  success: true,
  status: 'completed',
  transaction_id: result.transaction_id
}
```

### ✅ `initiate.post.ts`
```typescript
// Forcer le statut à 200 OK
setResponseStatus(event, 200)

return {
  success: true,
  transaction_id: simulatedTransactionId,
  amount: paymentData.amount
}
```

---

## 🔍 Codes de Statut Utilisés

### 2xx - Succès (Toujours 200)

| Code | Usage | Notre Endpoint |
|------|-------|----------------|
| **200 OK** | Succès | ✅ **TOUS les endpoints** |
| 201 Created | Ressource créée | ❌ Jamais utilisé (normalisé à 200) |

### 4xx - Erreurs Client

| Code | Usage | Cas d'Utilisation |
|------|-------|-------------------|
| **400 Bad Request** | Données invalides | Validation échouée (montant, téléphone, etc.) |
| **404 Not Found** | Ressource introuvable | Transaction non trouvée |

### 5xx - Erreurs Serveur

| Code | Usage | Cas d'Utilisation |
|------|-------|-------------------|
| **500 Internal Server Error** | Erreur serveur | Erreur inattendue, API externe inaccessible |

---

## 💡 Exemples de Réponses

### ✅ Succès (200 OK)

```bash
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "payment_url": "https://checkout.djonanko.ci/PAYAFE1E4P2PD",
  "transaction_id": "82e53100-1c56-492b-a582-53dc1c92ca56"
}
```

### ❌ Erreur Client (400 Bad Request)

```bash
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "statusCode": 400,
  "statusMessage": "Données manquantes (amount requis)"
}
```

### ❌ Erreur Serveur (500 Internal Server Error)

```bash
HTTP/1.1 500 Internal Server Error
Content-Type: application/json

{
  "statusCode": 500,
  "statusMessage": "Erreur lors de la création du lien de paiement"
}
```

---

## 🧪 Tests

### Test 1 : Vérifier le statut 200 sur create-link

```bash
curl -i -X POST http://localhost:3000/api/payment/mobile-money/create-link \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000,
    "order_id": "TEST-123"
  }'

# Résultat attendu:
# HTTP/1.1 200 OK  ✅ (PAS 201)
```

### Test 2 : Vérifier le statut 200 sur webhook

```bash
curl -i -X POST http://localhost:3000/api/payment/mobile-money/callback \
  -H "Content-Type: application/json" \
  -d '{
    "status": "success",
    "transaction_id": "TXN-123",
    "amount": 1000
  }'

# Résultat attendu:
# HTTP/1.1 200 OK  ✅
```

### Test 3 : Vérifier erreur 400

```bash
curl -i -X POST http://localhost:3000/api/payment/mobile-money/create-link \
  -H "Content-Type: application/json" \
  -d '{}'

# Résultat attendu:
# HTTP/1.1 400 Bad Request  ✅
```

---

## 📚 Bonnes Pratiques

### ✅ À FAIRE

1. **Toujours retourner 200** pour les succès (via `setResponseStatus(event, 200)`)
2. **Utiliser `success: true/false`** dans le body pour indiquer le résultat
3. **Utiliser 4xx** pour les erreurs client (validation, données manquantes)
4. **Utiliser 5xx** pour les erreurs serveur (bugs, API externe down)

### ❌ À ÉVITER

1. Ne pas mélanger 200/201/202 pour les succès → toujours 200
2. Ne pas retourner 200 avec `success: false` pour une vraie erreur → utiliser 4xx/5xx
3. Ne pas utiliser 500 pour des erreurs de validation → utiliser 400

---

## 🔧 Implémentation Technique

### Import nécessaire

```typescript
import { defineEventHandler, setResponseStatus } from 'h3'
```

### Utilisation

```typescript
export default defineEventHandler(async (event) => {
  try {
    // ... votre logique ...
    
    // Forcer le statut à 200 OK
    setResponseStatus(event, 200)
    
    return {
      success: true,
      data: result
    }
  } catch (err) {
    // Les erreurs utilisent automatiquement 4xx/5xx via createError()
    throw createError({
      statusCode: 400,
      statusMessage: 'Message d\'erreur'
    })
  }
})
```

---

## 📊 Tableau Récapitulatif

| Endpoint | API Externe | Notre Réponse | Normalisé |
|----------|-------------|---------------|-----------|
| `create-link.post.ts` | 201 Created | **200 OK** | ✅ |
| `callback.post.ts` | N/A | **200 OK** | ✅ |
| `set-webhook.post.ts` | 200 OK | **200 OK** | ✅ |
| `verify.post.ts` | 200 OK | **200 OK** | ✅ |
| `initiate.post.ts` | 200 OK | **200 OK** | ✅ |

---

## ✅ Résultat

**Tous les endpoints de paiement mobile money retournent maintenant 200 OK de manière cohérente et prévisible ! 🎯**

---

## 📖 Références

- **HTTP Status Codes** : [MDN Web Docs](https://developer.mozilla.org/fr/docs/Web/HTTP/Status)
- **h3 Documentation** : [setResponseStatus](https://www.jsdocs.io/package/h3#setResponseStatus)
- **RESTful Best Practices** : Utiliser 200 pour les succès est une pratique courante et acceptée

---

**Date de mise à jour :** 8 janvier 2025  
**Statut :** ✅ Implémenté et testé

