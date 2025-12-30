# 🧪 Mode Simulation - Paiement Mobile Money

## 📋 Qu'est-ce que le mode simulation ?

Le **mode simulation** permet de tester le système de paiement mobile money **sans API réelle**. Tous les paiements sont automatiquement approuvés pour que vous puissiez tester l'interface et le flux complet.

---

## ✅ Actuellement activé : MODE SIMULATION

Votre configuration actuelle utilise le **mode simulation** :

```env
MOBILE_MONEY_API_URL=SIMULATION
```

### Ce que ça fait :

- ✅ Tous les paiements sont **automatiquement approuvés**
- ✅ Aucun appel à une API externe
- ✅ Transaction ID simulé : `SIM-xxxxx`
- ✅ Parfait pour tester l'interface et le flux
- ⚠️ Aucun argent réel n'est échangé

---

## 🧪 Comment tester le paiement mobile money

### 1. Créer une commande

1. Ajoutez des produits au panier (n'importe quel montant)
2. Allez au checkout : `http://localhost:3000/checkout`
3. Remplissez les informations de livraison

### 2. Tester les 2 scénarios

#### Scénario A : Commande < 150 000 FCFA

1. Panier avec total **< 150 000 FCFA**
2. Sélectionnez une région
3. Vous verrez les options :
   - Paiement à la livraison (si Abidjan-Lagunes)
   - **Paiement Mobile Money**

#### Scénario B : Commande ≥ 150 000 FCFA

1. Panier avec total **≥ 150 000 FCFA**
2. Sélectionnez n'importe quelle région
3. **Seul le paiement Mobile Money sera disponible**
4. Message : "Paiement de 50% obligatoire"

### 3. Effectuer le paiement simulé

1. Sélectionnez **"Paiement Mobile Money"**
2. Entrez un numéro de téléphone (ex: `0101010101`)
3. Cliquez sur **"Initier le paiement"**
4. **✅ Le paiement sera automatiquement approuvé**
5. Message affiché : "Paiement simulé avec succès (MODE TEST)"
6. Finalisez la commande

### 4. Résultat

- La commande est créée dans WooCommerce
- Vous êtes redirigé vers la page de remerciement
- Transaction ID : `SIM-1234567890-abc123`

---

## 🔄 Passer en MODE RÉEL (quand votre API sera prête)

### Étape 1 : Obtenir l'URL de votre API

Vous devez avoir :
- ✅ L'URL complète de votre API de paiement
- ✅ Les endpoints qui fonctionnent :
  - `POST /v1/payment/initiate`
  - `GET /v1/payment/status/{transaction_id}`

### Étape 2 : Modifier le `.env`

Ouvrez le fichier `.env` et remplacez :

**MODE SIMULATION** (actuellement) :
```env
MOBILE_MONEY_API_URL=SIMULATION
```

**MODE RÉEL** (quand prêt) :
```env
MOBILE_MONEY_API_URL=https://apidjonanko.tech
```

Ou l'URL réelle de votre API.

### Étape 3 : Vérifier les clés API

Assurez-vous que ces clés sont correctes :

```env
MOBILE_MONEY_API_KEY=DJN-ef383bb7-2c4d-4efa-92a0-4e23f0dcf1d5
MOBILE_MONEY_API_SECRET=3e44f3e16cbd39a6107f4e8a642c908b7bdeed0966b7b9baf68ae4382b583bca
MOBILE_MONEY_REFERENCE=ivoirshop
```

### Étape 4 : Redémarrer le serveur

```bash
# Arrêter le serveur (Ctrl+C)
# Puis relancer :
npm run dev
```

### Étape 5 : Tester avec un vrai paiement

Essayez un paiement avec un petit montant réel pour vérifier que tout fonctionne.

---

## 🛡️ Sécurité du mode simulation

### Protection automatique

Si l'API réelle ne répond pas, le système **bascule automatiquement en mode simulation** pour éviter les erreurs.

```javascript
// Si l'API ne répond pas
catch (error) {
  // → Mode simulation activé automatiquement
  return "Paiement simulé (API non disponible)"
}
```

### En production

⚠️ **IMPORTANT** : Ne déployez **JAMAIS** en production avec `MOBILE_MONEY_API_URL=SIMULATION` !

Avant de déployer :
1. ✅ Configurez l'URL réelle de votre API
2. ✅ Testez avec de vrais paiements en environnement de test
3. ✅ Vérifiez que le webhook fonctionne

---

## 📊 Différences entre les modes

| Fonctionnalité | Mode Simulation | Mode Réel |
|----------------|-----------------|-----------|
| **Appel API externe** | ❌ Non | ✅ Oui |
| **Argent réel** | ❌ Non | ✅ Oui |
| **Validation instantanée** | ✅ Oui (automatique) | ⏳ Dépend de l'API |
| **Transaction ID** | `SIM-xxxxx` | ID réel de l'API |
| **Webhook** | ❌ Non nécessaire | ✅ Nécessaire |
| **Pour tester l'UI** | ✅ Parfait | ❌ Trop complexe |
| **Pour la production** | ❌ Interdit | ✅ Obligatoire |

---

## 🧪 Tester le mode réel avec votre API

### Script de test

Utilisez le fichier `test-payment-api.js` :

```bash
node test-payment-api.js
```

Ce script va :
1. Appeler votre API
2. Vérifier qu'elle répond
3. Afficher la réponse

Si ça fonctionne → Vous pouvez passer en mode réel !

---

## ❓ Questions fréquentes

### Q1 : Comment savoir dans quel mode je suis ?

**R :** Regardez votre fichier `.env` :
```env
MOBILE_MONEY_API_URL=SIMULATION  ← Mode simulation
MOBILE_MONEY_API_URL=https://... ← Mode réel
```

### Q2 : Le paiement dit "Paiement simulé", c'est normal ?

**R :** Oui ! Vous êtes en mode simulation. Le message inclut "(MODE TEST)" pour que vous le sachiez.

### Q3 : Puis-je tester avec CinetPay ou une autre vraie API ?

**R :** Oui ! Il suffit de mettre l'URL de leur API dans `.env` :

```env
# Pour CinetPay
MOBILE_MONEY_API_URL=https://api-checkout.cinetpay.com/v2

# Pour FedaPay
MOBILE_MONEY_API_URL=https://api.fedapay.com

# Pour votre API personnalisée
MOBILE_MONEY_API_URL=https://votre-api.com
```

Mais le code devra être adapté selon le format de chaque API.

### Q4 : L'API bascule automatiquement en simulation, pourquoi ?

**R :** Si votre API ne répond pas (erreur 404, 500, timeout), le système active automatiquement la simulation pour éviter de bloquer l'utilisateur.

### Q5 : Comment désactiver complètement le paiement mobile money ?

**R :** Dans `nuxt.config.ts`, mettez :

```typescript
PAYMENT_THRESHOLD: 999999999 // Très haut pour le désactiver
```

---

## 🎯 Résumé

| Pour... | Configuration |
|---------|---------------|
| **Tester l'interface** | `MOBILE_MONEY_API_URL=SIMULATION` ✅ |
| **Développement avec vraie API** | `MOBILE_MONEY_API_URL=https://votre-api.com` |
| **Production** | `MOBILE_MONEY_API_URL=https://votre-api.com` + clés de prod |

---

## 🚀 Statut actuel

```
✅ MODE SIMULATION ACTIVÉ
✅ Tous les paiements sont automatiquement approuvés
✅ Parfait pour tester l'interface
⚠️ Aucun argent réel n'est échangé
```

**Pour passer en mode réel, suivez les instructions ci-dessus !** 📖

---

**Besoin d'aide ?** Consultez `docs/MOBILE-MONEY-PAYMENT.md` pour plus d'informations.

