# Intégration des Attributs WooCommerce avec WordPress

## Vue d'ensemble

Ce guide explique comment s'assurer que les attributs et marques des produits sont correctement retournés par votre API WordPress personnalisée.

## Modification du fichier functions.php

Si vous utilisez l'endpoint personnalisé `/wp-json/custom/v1/products/{category_id}`, vous devez vous assurer qu'il retourne les attributs et marques des produits.

### Code à ajouter dans functions.php

```php
<?php
// Endpoint pour récupérer les produits avec leurs attributs et marques
add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/products/(?P<category_id>\d+)', array(
        'methods' => 'GET',
        'callback' => 'get_category_products_with_attributes',
        'permission_callback' => '__return_true'
    ));
});

function get_category_products_with_attributes($request) {
    $category_id = $request['category_id'];
    
    // Arguments pour la requête WooCommerce
    $args = array(
        'status' => 'publish',
        'limit' => 100,
        'category' => array($category_id),
    );
    
    $products = wc_get_products($args);
    $products_data = array();
    
    foreach ($products as $product) {
        $product_data = array(
            'id' => $product->get_id(),
            'name' => $product->get_name(),
            'slug' => $product->get_slug(),
            'description' => $product->get_description(),
            'short_description' => $product->get_short_description(),
            'price' => $product->get_price(),
            'regular_price' => $product->get_regular_price(),
            'sale_price' => $product->get_sale_price(),
            'on_sale' => $product->is_on_sale(),
            'stock_status' => $product->get_stock_status(),
            'average_rating' => $product->get_average_rating(),
            'rating_count' => $product->get_rating_count(),
            'date_created' => $product->get_date_created()->date('Y-m-d H:i:s'),
            'images' => array(),
            'attributes' => array(),
            'brands' => array(),
        );
        
        // Images
        $image_ids = $product->get_gallery_image_ids();
        if ($product->get_image_id()) {
            array_unshift($image_ids, $product->get_image_id());
        }
        
        foreach ($image_ids as $image_id) {
            $image_url = wp_get_attachment_image_url($image_id, 'full');
            if ($image_url) {
                $product_data['images'][] = array(
                    'id' => $image_id,
                    'src' => $image_url,
                    'name' => get_post_field('post_title', $image_id),
                    'alt' => get_post_meta($image_id, '_wp_attachment_image_alt', true),
                );
            }
        }
        
        // Attributs WooCommerce
        $attributes = $product->get_attributes();
        foreach ($attributes as $attribute) {
            if ($attribute->is_taxonomy()) {
                // Attribut global
                $terms = wc_get_product_terms($product->get_id(), $attribute->get_name(), array('fields' => 'names'));
                $product_data['attributes'][] = array(
                    'id' => wc_attribute_taxonomy_id_by_name($attribute->get_name()),
                    'name' => wc_attribute_label($attribute->get_name()),
                    'slug' => $attribute->get_name(),
                    'position' => $attribute->get_position(),
                    'visible' => $attribute->get_visible(),
                    'variation' => $attribute->get_variation(),
                    'options' => $terms,
                );
            } else {
                // Attribut personnalisé (non global)
                $product_data['attributes'][] = array(
                    'id' => 0,
                    'name' => $attribute->get_name(),
                    'slug' => sanitize_title($attribute->get_name()),
                    'position' => $attribute->get_position(),
                    'visible' => $attribute->get_visible(),
                    'variation' => $attribute->get_variation(),
                    'options' => $attribute->get_options(),
                );
            }
        }
        
        // Marques - Méthode 1 : Via taxonomie brands (si plugin installé)
        $brand_terms = get_the_terms($product->get_id(), 'product_brand');
        if (!is_wp_error($brand_terms) && !empty($brand_terms)) {
            foreach ($brand_terms as $brand) {
                $thumbnail_id = get_term_meta($brand->term_id, 'thumbnail_id', true);
                $image_url = $thumbnail_id ? wp_get_attachment_url($thumbnail_id) : null;
                
                $product_data['brands'][] = array(
                    'id' => $brand->term_id,
                    'name' => $brand->name,
                    'slug' => $brand->slug,
                    'image' => $image_url,
                );
            }
        }
        
        // Marques - Méthode 2 : Via attribut brand (si pas de taxonomie)
        if (empty($product_data['brands'])) {
            $brand_attribute = $product->get_attribute('pa_brand'); // ou 'pa_marque'
            if (!empty($brand_attribute)) {
                $product_data['brands'][] = array(
                    'id' => 0,
                    'name' => $brand_attribute,
                    'slug' => sanitize_title($brand_attribute),
                    'image' => null,
                );
            }
        }
        
        // Catégories
        $product_data['categories'] = array();
        $category_ids = $product->get_category_ids();
        foreach ($category_ids as $cat_id) {
            $category = get_term($cat_id, 'product_cat');
            if ($category && !is_wp_error($category)) {
                $product_data['categories'][] = array(
                    'id' => $category->term_id,
                    'name' => $category->name,
                    'slug' => $category->slug,
                );
            }
        }
        
        $products_data[] = $product_data;
    }
    
    return rest_ensure_response($products_data);
}
```

## Vérification de la Taxonomie des Marques

### Plugins de Marques Populaires

Différents plugins utilisent différentes taxonomies :

1. **Perfect Brands for WooCommerce** : `product_brand`
2. **YITH WooCommerce Brands** : `yith_product_brand`
3. **WooCommerce Brands** : `product_brand`

### Détection Automatique

Pour détecter automatiquement la taxonomie utilisée, ajoutez cette fonction :

```php
function get_brand_taxonomy() {
    $taxonomies = array(
        'product_brand',
        'yith_product_brand',
        'pwb-brand',
        'brand',
    );
    
    foreach ($taxonomies as $taxonomy) {
        if (taxonomy_exists($taxonomy)) {
            return $taxonomy;
        }
    }
    
    return null;
}
```

Puis utilisez-la dans votre endpoint :

```php
$brand_taxonomy = get_brand_taxonomy();
if ($brand_taxonomy) {
    $brand_terms = get_the_terms($product->get_id(), $brand_taxonomy);
    // ... traitement des marques
}
```

## Test des Endpoints

### Test de l'API Attributs

```bash
# Récupérer tous les attributs
curl -X GET "https://votre-site.com/wp-json/wc/v3/products/attributes" \
  --user "CONSUMER_KEY:CONSUMER_SECRET"

# Récupérer les termes d'un attribut
curl -X GET "https://votre-site.com/wp-json/wc/v3/products/attributes/1/terms" \
  --user "CONSUMER_KEY:CONSUMER_SECRET"
```

### Test de l'API Marques

```bash
# Si vous avez un plugin de marques
curl -X GET "https://votre-site.com/wp-json/wc/v3/products/brands" \
  --user "CONSUMER_KEY:CONSUMER_SECRET"
```

### Test de l'Endpoint Personnalisé

```bash
# Tester votre endpoint personnalisé
curl -X GET "https://votre-site.com/wp-json/custom/v1/products/15"
```

## Exemple de Réponse Attendue

```json
[
  {
    "id": 123,
    "name": "iPhone 14 Pro",
    "slug": "iphone-14-pro",
    "price": "999",
    "attributes": [
      {
        "id": 1,
        "name": "Couleur",
        "slug": "pa_color",
        "variation": true,
        "options": ["Noir", "Blanc", "Or"]
      },
      {
        "id": 2,
        "name": "Stockage",
        "slug": "pa_storage",
        "variation": true,
        "options": ["128GB", "256GB", "512GB"]
      }
    ],
    "brands": [
      {
        "id": 5,
        "name": "Apple",
        "slug": "apple",
        "image": "https://..."
      }
    ]
  }
]
```

## Dépannage

### Les attributs sont vides

1. Vérifiez que les produits ont des attributs assignés dans WooCommerce
2. Vérifiez que les attributs sont marqués comme "Utilisé pour les variations"
3. Testez avec `var_dump($product->get_attributes())` dans le code PHP

### Les marques ne s'affichent pas

1. Vérifiez quel plugin de marques vous utilisez
2. Vérifiez le nom de la taxonomie avec `get_taxonomies()`
3. Testez avec `var_dump(get_the_terms($product->get_id(), 'product_brand'))`

### Erreur 403 ou 401

- Vérifiez vos clés API WooCommerce (Consumer Key/Secret)
- Vérifiez que l'endpoint a `'permission_callback' => '__return_true'` pour les endpoints publics

## Optimisation

Pour améliorer les performances :

```php
// Cache les résultats pendant 1 heure
function get_category_products_with_attributes_cached($request) {
    $category_id = $request['category_id'];
    $cache_key = 'category_products_' . $category_id;
    
    $cached = get_transient($cache_key);
    if ($cached !== false) {
        return rest_ensure_response($cached);
    }
    
    $products_data = get_category_products_with_attributes($request);
    set_transient($cache_key, $products_data, HOUR_IN_SECONDS);
    
    return rest_ensure_response($products_data);
}
```

## Invalidation du Cache

Invalidez le cache quand un produit est mis à jour :

```php
add_action('woocommerce_update_product', 'invalidate_product_cache', 10, 1);

function invalidate_product_cache($product_id) {
    $product = wc_get_product($product_id);
    $category_ids = $product->get_category_ids();
    
    foreach ($category_ids as $category_id) {
        delete_transient('category_products_' . $category_id);
    }
}
```

## Sécurité

Pour des endpoints protégés, utilisez l'authentification :

```php
'permission_callback' => function() {
    return current_user_can('edit_posts');
}
```

## Support

Si vous rencontrez des problèmes :
1. Activez le mode debug WordPress : `define('WP_DEBUG', true);`
2. Consultez les logs : `wp-content/debug.log`
3. Testez les endpoints dans Postman ou curl
4. Vérifiez la structure des données retournées

