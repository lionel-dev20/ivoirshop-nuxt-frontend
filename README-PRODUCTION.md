# IvoirShop CI - Guide de Déploiement en Production

## 🚀 Déploiement

### 1. Préparation

```bash
# Installer les dépendances
npm install

# Copier la configuration d'environnement
cp env.production.example .env

# Éditer le fichier .env avec vos vraies valeurs
nano .env
```

### 2. Configuration requise

Dans le fichier `.env`, configurez :

```env
WORDPRESS_URL=https://admin.ivoirshop.ci
WOOCOMMERCE_CONSUMER_KEY=votre_cle_consommateur
WOOCOMMERCE_CONSUMER_SECRET=votre_secret_consommateur
```

### 3. Build de production

```bash
# Build optimisé pour la production
npm run build

# Ou génération statique (si applicable)
npm run generate
```

### 4. Démarrage

```bash
# Démarrer le serveur de production
npm start
```

## 📁 Structure du projet

```
app/
├── components/          # Composants Vue réutilisables
├── pages/              # Pages de l'application
├── layouts/            # Layouts de pages
├── stores/             # Stores Pinia
├── composables/        # Composables Vue
└── assets/             # Assets statiques

server/
└── api/                # API routes Nuxt
    ├── wordpress/      # Endpoints WordPress
    ├── woocommerce/    # Endpoints WooCommerce
    └── auth/           # Authentification
```

## 🔧 Fonctionnalités

- ✅ Menu WordPress dynamique
- ✅ Catégories de produits
- ✅ Panier d'achat
- ✅ Recherche avec autocomplétion
- ✅ Checkout complet
- ✅ Authentification utilisateur
- ✅ Responsive design
- ✅ Skeleton loading
- ✅ Optimisations SEO

## 🌐 Endpoints API

### WordPress
- `/api/wordpress/menu` - Menu principal
- `/api/wordpress/categories` - Catégories de produits
- `/api/wordpress/category-products` - Produits par catégorie

### WooCommerce
- `/api/woocommerce/category/[...slug]` - Page catégorie
- `/api/woocommerce/product/[slug]` - Page produit

### Authentification
- `/api/auth/login` - Connexion
- `/api/auth/register` - Inscription
- `/api/auth/logout` - Déconnexion

## 📱 Pages principales

- `/` - Page d'accueil
- `/categorie/[...slug]` - Pages de catégories
- `/produit/[slug]` - Pages de produits
- `/recherche` - Page de recherche
- `/checkout` - Processus de commande
- `/auth/login` - Connexion
- `/auth/signup` - Inscription

## 🎨 Composants principaux

- `AppHeader` - En-tête avec menu
- `CartSidebar` - Panier latéral
- `CategoryBlocks` - Blocs de catégories
- `ProductCard` - Carte de produit
- `MegaMenuHorizontalColumns` - Menu méga
- `SearchBox` - Boîte de recherche

## ⚡ Optimisations

- Skeleton loading fluide
- Images optimisées avec Nuxt Image
- Compression des assets
- Minification du code
- Cache des données
- SSR activé

## 🔒 Sécurité

- Variables d'environnement pour les clés API
- Validation des données côté serveur
- Protection CSRF
- Headers de sécurité

## 📊 Performance

- Lazy loading des composants
- Optimisation des images
- Compression gzip
- Cache des requêtes API
- Skeleton loading

## 🐛 Debug

En cas de problème, vérifiez :

1. Les variables d'environnement
2. La connexion WordPress
3. Les clés API WooCommerce
4. Les logs du serveur

## 📞 Support

Pour toute question ou problème, contactez l'équipe de développement.
