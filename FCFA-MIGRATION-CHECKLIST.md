# ✅ Checklist Migration EUR → FCFA

## 📌 Changements de Code
- [x] Remplacer EUR par FCFA dans les composants
- [x] Remplacer EUR par FCFA dans les stores
- [x] Remplacer EUR par FCFA dans les APIs
- [x] Supprimer price_html qui affichait €
- [x] Vérifier qu'il n'y a plus de € dans le code
- [x] Documentation créée

## 🔧 Configuration WooCommerce (À FAIRE)
- [ ] Se connecter au dashboard WordPress
- [ ] Aller dans WooCommerce > Réglages > Général
- [ ] Sélectionner devise : **Franc CFA (XOF)**
- [ ] Position devise : **Droite avec espace**
- [ ] Séparateur milliers : **(espace)**
- [ ] Nombre de décimales : **0**
- [ ] Cliquer sur **Enregistrer les modifications**

## 💱 Conversion des Prix (À FAIRE)
- [ ] Faire une **sauvegarde** de la base de données
- [ ] Noter le taux de conversion : **1 EUR = 655.957 FCFA**
- [ ] Choisir la méthode de conversion :
  - [ ] Manuelle (produit par produit)
  - [ ] Plugin de conversion
  - [ ] Script SQL (avancé)
- [ ] Convertir tous les prix des produits
- [ ] Vérifier quelques produits après conversion

## 🧹 Nettoyage des Caches (À FAIRE)
- [ ] Vider le cache WooCommerce (Outils > Vider le cache)
- [ ] Vider le cache WordPress (si plugin de cache)
- [ ] Vider le cache Nuxt : `rm -rf .nuxt`
- [ ] Redémarrer le serveur de développement

## 🧪 Tests Frontend (À FAIRE)
- [ ] Page d'accueil : Vérifier les prix en FCFA
- [ ] Page catégorie : Vérifier les prix des produits
- [ ] Page produit : Vérifier prix et variations
- [ ] Recherche : Vérifier les suggestions avec prix
- [ ] Filtres : Vérifier les plages de prix
- [ ] Panier : Vérifier le total
- [ ] Checkout : Vérifier le récapitulatif
- [ ] Confirmation : Vérifier le total de la commande

## 🔌 Tests API (À FAIRE)
- [ ] Tester `/api/woocommerce/products`
- [ ] Tester `/api/woocommerce/category/[slug]`
- [ ] Tester `/api/woocommerce/product/[slug]`
- [ ] Vérifier que les prix sont numériques (sans symbole)

## 📧 Communication (À FAIRE)
- [ ] Informer l'équipe du changement
- [ ] Préparer un message pour les clients
- [ ] Mettre à jour les mentions légales si nécessaire
- [ ] Mettre à jour les CGV si nécessaire

## 🚀 Déploiement (À FAIRE)
- [ ] Tester sur environnement de staging
- [ ] Vérifier tous les flux de commande
- [ ] Planifier le déploiement en production
- [ ] Déployer les changements
- [ ] Vérifier en production
- [ ] Surveiller les premières commandes

---

## 📚 Documentation Disponible

- `CURRENCY-UPDATE-SUMMARY.md` - Résumé des changements
- `docs/CURRENCY-CHANGE.md` - Documentation technique
- `docs/WOOCOMMERCE-CURRENCY-CONFIG.md` - Guide WooCommerce
- `docs/CHANGELOG-FILTERS.md` - Historique des filtres

---

## 🆘 En Cas de Problème

1. Consultez `docs/WOOCOMMERCE-CURRENCY-CONFIG.md` section "Dépannage"
2. Vérifiez les logs WooCommerce
3. Vérifiez la console du navigateur
4. Contactez le support si nécessaire

---

**Dernière mise à jour** : 15 Octobre 2025

