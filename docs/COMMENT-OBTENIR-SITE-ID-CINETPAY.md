# 🔑 Comment obtenir votre Site ID CinetPay

## ❗ Problème : MINIMUM_REQUIRED_FIELDS

Si vous voyez cette erreur : **"Le paiement a échoué. Veuillez réessayer."** avec **"MINIMUM_REQUIRED_FIELDS"** dans les logs, c'est parce que le **Site ID** n'est pas configuré correctement.

## 📋 Qu'est-ce que le Site ID ?

Le **Site ID** est un **numéro unique** attribué par CinetPay à votre boutique/site web. C'est différent de l'API Key. Ce numéro est **OBLIGATOIRE** pour initier des paiements.

**Exemple :** `123456`, `789012`, etc.

---

## 🎯 Solution : Obtenir votre Site ID

### Option 1 : Vous avez déjà un compte CinetPay ✅

1. **Connectez-vous** à votre dashboard CinetPay :
   - URL : https://dashboard.cinetpay.com
   - Entrez vos identifiants

2. **Trouvez votre Site ID** :
   - Allez dans : **"Mes sites"** ou **"Sites"**
   - Vous verrez une liste de vos sites enregistrés
   - Le **Site ID** est affiché à côté de chaque site
   - C'est un **numéro** (ex: 123456)

3. **Copiez le Site ID** :
   - Notez ce numéro quelque part

4. **Ajoutez-le dans votre `.env`** :
   ```env
   MOBILE_MONEY_SITE_ID=123456
   ```
   (Remplacez `123456` par votre vrai numéro)

### Option 2 : Vous n'avez pas encore de compte CinetPay ❌

#### Étape 1 : Créer un compte CinetPay

1. **Allez sur** : https://cinetpay.com
2. **Cliquez sur** : "S'inscrire" ou "Inscription"
3. **Remplissez le formulaire** :
   - Nom de l'entreprise : IvoirShop
   - Email professionnel
   - Téléphone
   - Mot de passe

4. **Validez votre email** :
   - Vérifiez votre boîte mail
   - Cliquez sur le lien de confirmation

#### Étape 2 : Créer un site/projet

1. **Connectez-vous** au dashboard : https://dashboard.cinetpay.com
2. **Allez dans** : "Mes sites" ou "Ajouter un site"
3. **Remplissez les informations** :
   - Nom du site : IvoirShop.ci
   - URL : https://ivoirshop.ci
   - Type : E-commerce
   - Description : Boutique en ligne

4. **Validez** la création

5. **Récupérez votre Site ID** :
   - Une fois le site créé, vous verrez un **numéro**
   - C'est votre **Site ID** !
   - Exemple : `123456`

#### Étape 3 : Récupérer vos clés API

1. **Allez dans** : "Paramètres" → "API"
2. **Mode Sandbox/Test** :
   - API Key (commence par `DJN-` ou `ck_`)
   - API Secret

3. **Mode Production** :
   - Activez votre compte (vérification, documents, etc.)
   - Obtenez vos clés de production

---

## 🔧 Configuration dans votre projet

### 1. Ouvrez le fichier `.env`

```
C:\Users\USER\Desktop\ivoir-shop-ci\.env
```

### 2. Modifiez ces lignes

**AVANT** (incorrect) :
```env
MOBILE_MONEY_SITE_ID=your_site_id_here
```

**APRÈS** (correct) :
```env
MOBILE_MONEY_SITE_ID=123456
```
(Remplacez `123456` par votre vrai Site ID)

### 3. Exemple complet de configuration

```env
# Mobile Money Payment Configuration
MOBILE_MONEY_API_KEY=DJN-ef383bb7-2c4d-4efa-92a0-4e23f0dcf1d5
MOBILE_MONEY_API_SECRET=3e44f3e16cbd39a6107f4e8a642c908b7bdeed0966b7b9baf68ae4382b583bca
MOBILE_MONEY_SITE_ID=123456  ← Votre vrai numéro ici
MOBILE_MONEY_REFERENCE=ivoirshop
MOBILE_MONEY_API_URL=https://api-checkout.cinetpay.com/v2
PAYMENT_THRESHOLD=150000
```

---

## 🧪 Test : Mode Sandbox (Développement)

CinetPay propose un **mode Sandbox** pour tester sans argent réel :

### 1. Clés Sandbox

Utilisez vos clés de **test** (commencent souvent par `DJN-` ou `ck_test_`)

### 2. Site ID de test

Le Site ID est le **même** en mode test et production.

### 3. Numéros de test

CinetPay fournit des **numéros de téléphone de test** :
- Consultez leur documentation : https://docs.cinetpay.com
- Cherchez "Numéros de test" ou "Test credentials"

### 4. Test de paiement

1. Ajoutez des produits au panier
2. Allez au checkout
3. Sélectionnez "Paiement Mobile Money"
4. Entrez un **numéro de test** fourni par CinetPay
5. Validez le paiement

---

## 🚀 Production : Passer en mode réel

### 1. Activer votre compte

- Soumettez les documents requis (KYC)
- Attendez la validation (1-3 jours)

### 2. Obtenez vos clés de production

Une fois validé :
- API Key de production
- API Secret de production
- Le Site ID reste le **même**

### 3. Remplacez dans `.env`

```env
MOBILE_MONEY_API_KEY=votre_cle_production
MOBILE_MONEY_API_SECRET=votre_secret_production
MOBILE_MONEY_SITE_ID=123456  ← Même numéro qu'avant
```

### 4. Redéployez

- Mettez à jour les variables d'environnement sur votre serveur
- Redéployez votre application

---

## ❓ FAQ

### Q1 : Mon Site ID peut-il changer ?
**R :** Non, une fois créé, votre Site ID reste le même.

### Q2 : J'ai plusieurs sites, quel Site ID utiliser ?
**R :** Utilisez le Site ID du site correspondant à IvoirShop.ci

### Q3 : Comment savoir si je suis en mode Sandbox ou Production ?
**R :** 
- **Sandbox** : Clés API commencent par `DJN-` ou `ck_test_`
- **Production** : Clés API commencent par `ck_live_` ou différent

### Q4 : Où trouver de l'aide ?
**R :** 
- Documentation : https://docs.cinetpay.com
- Support : https://cinetpay.com/support
- Email : support@cinetpay.com

---

## 📞 Contact CinetPay

- **Site web** : https://cinetpay.com
- **Dashboard** : https://dashboard.cinetpay.com
- **Documentation** : https://docs.cinetpay.com
- **Support** : support@cinetpay.com
- **WhatsApp** : (Vérifier sur leur site)

---

## ✅ Checklist de vérification

Avant de tester à nouveau :

- [ ] J'ai créé un compte CinetPay
- [ ] J'ai créé un site dans le dashboard
- [ ] J'ai récupéré mon Site ID (numéro)
- [ ] J'ai ajouté `MOBILE_MONEY_SITE_ID=123456` dans `.env`
- [ ] J'ai redémarré mon serveur (`npm run dev`)
- [ ] J'ai testé un paiement

---

**Une fois configuré, l'erreur "MINIMUM_REQUIRED_FIELDS" disparaîtra !** ✨

