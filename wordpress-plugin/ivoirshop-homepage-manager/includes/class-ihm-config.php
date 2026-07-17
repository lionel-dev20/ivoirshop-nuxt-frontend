<?php
/**
 * Gestion de la configuration (lecture, écriture, valeurs par défaut).
 *
 * Les valeurs par défaut reproduisent EXACTEMENT le contenu actuellement codé en
 * dur dans le frontend Nuxt. Tant que l'éditeur ne modifie rien, le site reste
 * strictement identique.
 *
 * @package IvoirShopHomepageManager
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class IHM_Config {

	/**
	 * Récupère la configuration complète (fusionnée avec les défauts).
	 *
	 * @return array
	 */
	public static function get() {
		$stored = get_option( IHM_OPTION_KEY, array() );
		if ( ! is_array( $stored ) ) {
			$stored = array();
		}
		// Fusion superficielle par section : garantit qu'une nouvelle section
		// ajoutée par une mise à jour du plugin a toujours une valeur par défaut.
		return array_replace_recursive( self::defaults(), $stored );
	}

	/**
	 * Enregistre la configuration.
	 *
	 * @param array $config Configuration à sauvegarder.
	 * @return bool
	 */
	public static function save( $config ) {
		return update_option( IHM_OPTION_KEY, $config );
	}

	/**
	 * Configuration par défaut = état actuel du site Nuxt.
	 *
	 * @return array
	 */
	public static function defaults() {
		return array(

			// ------------------------------------------------------------------
			// Fond de page (NOUVEAU — n'existe pas encore côté Nuxt).
			// type : 'none' | 'color' | 'image'
			// ------------------------------------------------------------------
			'background' => array(
				'type'   => 'none',
				'color'  => '#ffffff',
				'image'  => '',
				'repeat' => 'no-repeat', // no-repeat | repeat
				'size'   => 'cover',     // cover | contain | auto
			),

			// ------------------------------------------------------------------
			// Hero : carrousel central (components/herosection/MyCarousel.vue).
			// ------------------------------------------------------------------
			'hero' => array(
				'slides' => array(
					array( 'image' => '/sliders/1_Generic_Campagne.png', 'link' => 'https://ivoirshop.ci/categorie/meilleures-ventes' ),
					array( 'image' => '/sliders/2_Mixeur.jpg', 'link' => 'https://ivoirshop.ci/categorie/electromenager' ),
					array( 'image' => '/sliders/3_Gaz_Plaque.png', 'link' => 'https://ivoirshop.ci/categorie/electromenager/appareils-de-cuisson' ),
					array( 'image' => '/sliders/4_Ventilateur & CLIM.jpg', 'link' => 'https://ivoirshop.ci/categorie/chauffage-ventilation' ),
					array( 'image' => '/sliders/5_TV_AUDIO.jpg', 'link' => 'https://ivoirshop.ci/categorie/electronique' ),
					array( 'image' => '/sliders/6_CONG & REFRIG.jpg', 'link' => 'https://ivoirshop.ci/categorie/refrigerateurs-congelateurs' ),
					array( 'image' => '/sliders/7_TOUT ELECTRO.png', 'link' => 'https://ivoirshop.ci/categorie/electromenager' ),
				),
			),

			// ------------------------------------------------------------------
			// Bloc droit (components/herosection/RightDoubleAds.vue).
			// ------------------------------------------------------------------
			'rightAds' => array(
				'advantages' => array(
					array(
						'image'       => 'https://web.archive.org/web/20240216010846im_/https://www.ivoirshop.ci/wp-content/uploads/elementor/thumbs/package-qe9j2dlhr4ce1m402cmweq43vvum88hifemmcjbsti.png',
						'title'       => 'Bienvenue chez vous',
						'description' => '+500 articles',
					),
					array(
						'image'       => 'https://web.archive.org/web/20240216010846im_/https://www.ivoirshop.ci/wp-content/uploads/2023/10/delivery.png',
						'title'       => 'Livraison rapide',
						'description' => 'Entre 1 et 3jours',
					),
					array(
						'image'       => 'https://web.archive.org/web/20240216010846im_/https://www.ivoirshop.ci/wp-content/uploads/2023/10/asking.png',
						'title'       => 'Service client',
						'description' => 'Disponible 7j/7',
					),
				),
				'promoImage' => '/images/IVS_ET_LIVRAISON-GRATUITE.gif',
				'promoLink'  => '/',
			),

			// ------------------------------------------------------------------
			// Partenaires (components/partenaires/ListPartner.vue).
			// ------------------------------------------------------------------
			'partners' => array(
				'title'        => 'Nos partenaires',
				'leftBanner'   => array( 'image' => '/images/partenaireilux.png', 'link' => 'https://ivoirshop.ci/recherche?q=ilux' ),
				'rightBanner'  => array( 'image' => '/images/partenaire_leadder.png', 'link' => 'https://ivoirshop.ci/recherche?q=leadder' ),
				'logos'        => array(
					array( 'image' => '/marques/Leadder.png', 'title' => 'Leadder', 'link' => 'https://ivoirshop.ci/recherche?q=leadder' ),
					array( 'image' => '/marques/Ilux.png', 'title' => 'Ilux', 'link' => 'https://ivoirshop.ci/recherche?q=ilux' ),
					array( 'image' => '/marques/Roch.png', 'title' => 'Roch', 'link' => 'https://ivoirshop.ci/recherche?q=roch' ),
					array( 'image' => '/marques/Smart_.png', 'title' => 'Smart', 'link' => 'https://ivoirshop.ci/recherche?q=smart' ),
					array( 'image' => '/marques/Binatone.png', 'title' => 'Binatone', 'link' => 'https://ivoirshop.ci/recherche?q=binatone' ),
					array( 'image' => '/marques/Oraimo.png', 'title' => 'Oraimo', 'link' => 'https://ivoirshop.ci/recherche?q=oraimo' ),
					array( 'image' => '/marques/RAF.png', 'title' => 'RAF', 'link' => 'https://ivoirshop.ci/recherche?q=raf' ),
					array( 'image' => '/marques/Wildbaby.png', 'title' => 'Wildbaby', 'link' => 'https://ivoirshop.ci/recherche?q=wildbaby' ),
					array( 'image' => '/marques/SiverCrest.png', 'title' => 'SiverCrest', 'link' => 'https://ivoirshop.ci/recherche?q=sivercrest' ),
					array( 'image' => '/marques/Nasco.png', 'title' => 'Nasco', 'link' => 'https://ivoirshop.ci/recherche?q=nasco' ),
					array( 'image' => '/marques/tecno.png', 'title' => 'tecno', 'link' => 'https://ivoirshop.ci/recherche?q=tecno' ),
					array( 'image' => '/marques/Infinix.png', 'title' => 'Infinix', 'link' => 'https://ivoirshop.ci/recherche?q=infinix' ),
					array( 'image' => '/marques/HP.png', 'title' => 'HP', 'link' => 'https://ivoirshop.ci/recherche?q=hp' ),
					array( 'image' => '/marques/Lenovo.png', 'title' => 'Lenovo', 'link' => 'https://ivoirshop.ci/recherche?q=lenovo' ),
					array( 'image' => '/marques/Iphone.png', 'title' => 'Iphone', 'link' => 'https://ivoirshop.ci/recherche?q=iphone' ),
				),
			),

			// ------------------------------------------------------------------
			// Compte à rebours / vente flash (app/data/countdowns.json).
			// ------------------------------------------------------------------
			'countdowns' => array(
				array(
					'id'             => 'flash-sale-smartphones',
					'title'          => 'Super vente-flash',
					'categorySlug'   => 'vente-flash',
					'endTime'        => '2026-12-30T10:00:00Z',
					'gridColumns'    => 5,
					'productsPerPage' => 60,
				),
			),

			// ------------------------------------------------------------------
			// Grille "Acheter en Ligne" (components/AcheterEnLigne.vue).
			// ------------------------------------------------------------------
			'acheterEnLigne' => array(
				'title' => 'Acheter en Ligne',
				'items' => array(
					array( 'image' => '/categorieImage/Idée-cadeaux.png', 'name' => 'Idée cadeaux', 'link' => 'https://ivoirshop.ci/categorie/noel' ),
					array( 'image' => '/categorieImage/Micro-Onde.png', 'name' => 'Micro-Onde', 'link' => 'https://ivoirshop.ci/categorie/micro-ondes' ),
					array( 'image' => '/categorieImage/Bazar.png', 'name' => 'Bazar', 'link' => 'https://ivoirshop.ci/categorie/le-bazar' ),
					array( 'image' => '/categorieImage/Haut-parleur.png', 'name' => 'Haut parleur', 'link' => 'https://ivoirshop.ci/categorie/haut-parleurs' ),
					array( 'image' => '/categorieImage/Bebe.png', 'name' => 'Bébé', 'link' => 'https://ivoirshop.ci/categorie/produits-pour-bebes' ),
					array( 'image' => '/categorieImage/Phone.png', 'name' => 'Phones', 'link' => 'https://ivoirshop.ci/categorie/telephone-tablette' ),
					array( 'image' => '/categorieImage/ventilateur-clim.png', 'name' => 'Ventilateur clim', 'link' => 'https://ivoirshop.ci/categorie/chauffage-ventilation' ),
					array( 'image' => '/categorieImage/PlaqueGaz.png', 'name' => 'Plaques à Gaz', 'link' => 'https://ivoirshop.ci/categorie/electromenager/appareils-de-cuisson/plaque-a-gaz' ),
					array( 'image' => '/categorieImage/bouilloire.png', 'name' => 'Bouilloire', 'link' => 'https://ivoirshop.ci/categorie/electromenager/petit-electromenager/micro-ondes' ),
					array( 'image' => '/categorieImage/Hoofer.png', 'name' => 'Hoofer', 'link' => 'https://ivoirshop.ci/categorie/home-cinema' ),
					array( 'image' => '/categorieImage/television.png', 'name' => 'Télévision', 'link' => 'https://ivoirshop.ci/categorie/televisions' ),
					array( 'image' => '/categorieImage/congelateur.png', 'name' => 'Congélateur', 'link' => 'https://ivoirshop.ci/categorie/electromenager/gros-electromenager/congelateurs' ),
					array( 'image' => '/categorieImage/refigerateur.png', 'name' => 'Réfrigérateur', 'link' => 'https://ivoirshop.ci/categorie/electromenager/gros-electromenager/refrigerateurs' ),
					array( 'image' => '/categorieImage/Gazinière.png', 'name' => 'Gazinière', 'link' => 'https://ivoirshop.ci/categorie/electromenager/gros-electromenager/gazinieres' ),
					array( 'image' => '/categorieImage/Mixeur.png', 'name' => 'Mixeur', 'link' => 'https://ivoirshop.ci/categorie/electromenager/petit-electromenager/mixeurs' ),
					array( 'image' => '/categorieImage/trotinette.png', 'name' => 'Trotinette', 'link' => 'https://ivoirshop.ci/categorie/scooters-et-wagons' ),
				),
			),

			// ------------------------------------------------------------------
			// Bannières doubles (app/pages/index.vue -> doubleBanners).
			// 6 paires d'images.
			// ------------------------------------------------------------------
			'doubleBanners' => array(
				array(
					array( 'image' => '/categorieImage/Mixeur.jpg', 'link' => 'https://ivoirshop.ci/produit/ilux-blender-grinder-2-en-1-lx-358-bol-1-5-l-300w-blanc-noir', 'alt' => 'Mixeurs' ),
					array( 'image' => '/categorieImage/Machinbe pilé foutou.jpg', 'link' => 'https://ivoirshop.ci/produit/binatone-machine-a-piler-foutou-6l-1000w', 'alt' => 'Machinbe pilé foutou' ),
				),
				array(
					array( 'image' => '/categorieImage/Plaque gaz.jpg', 'link' => 'https://www.ivoirshop.ci/produit/ilux-cuisiniere-a-gaz-rechaud-3-feux-lxg-7403-sx95-bleu', 'alt' => 'Plaque gaz' ),
					array( 'image' => '/categorieImage/Gazinière.jpg', 'link' => 'https://www.ivoirshop.ci/produit/ilux-cuisiniere-gaz-4-feux-lxg-40w-50x50-cm-blanc-garantie-6-mois', 'alt' => 'Gazinière' ),
				),
				array(
					array( 'image' => '/categorieImage/TV.jpg', 'link' => 'https://www.ivoirshop.ci/produit/ilux-tv-led-full-hd-43-pouces-decodeur-integre-hdmi-usb-vga-noir-garantie-06-mois', 'alt' => 'TV' ),
					array( 'image' => '/categorieImage/Audio.jpg', 'link' => 'https://www.ivoirshop.ci/produit/alitop-woofer-chaine-hifi-bluetooth-usb-fm-tvsd-noir-garantie-01-mois', 'alt' => 'Audio' ),
				),
				array(
					array( 'image' => '/categorieImage/Micro onde.jpg', 'link' => 'https://www.ivoirshop.ci/produit/ilux-micro-onde-lxm-2090b-20-litres-700w-noir', 'alt' => 'Micro onde' ),
					array( 'image' => '/categorieImage/refrigerateur.jpg', 'link' => 'https://www.ivoirshop.ci/produit/ilux-refrigerateur-2-battants-118-l-ilr118-gris-garantie-6-mois', 'alt' => 'refrigerateur' ),
				),
				array(
					array( 'image' => '/categorieImage/Ventilateur.jpg', 'link' => 'https://www.ivoirshop.ci/produit/ilux-2-ventilateurs-18-pouces-lxf-823-7-helices-copie', 'alt' => 'Ventilateur' ),
					array( 'image' => '/categorieImage/Climatiseur.jpg', 'link' => 'https://www.ivoirshop.ci/produit/split-1-cv-smart-fonctionnant-en-mode-on-off-r410-sts-09_ultra-blanc-garantie-12-mois', 'alt' => 'Climatiseur' ),
				),
			),

			// ------------------------------------------------------------------
			// Carrousels de produits (app/pages/index.vue).
			// Ordre = ordre d'affichage sur la page. Chaque carrousel pointe vers
			// une catégorie WooCommerce et a ses propres couleurs / bannière.
			// bannerImageUrl vide = pas de bannière.
			// ------------------------------------------------------------------
			'productCarousels' => array(
				array( 'categoryId' => 353, 'gridColumns' => 4, 'maxProducts' => 20, 'headerBg' => 'bg-white', 'headerColor' => 'text-black', 'navColor' => 'text-black', 'bannerImageUrl' => '/images/newbannerA.webp' ),
				array( 'categoryId' => 347, 'gridColumns' => 5, 'maxProducts' => 20, 'headerBg' => 'bg-[#a50a0a]', 'headerColor' => 'text-white', 'navColor' => 'text-black', 'bannerImageUrl' => '' ),
				array( 'categoryId' => 354, 'gridColumns' => 5, 'maxProducts' => 20, 'headerBg' => 'bg-[#019d39]', 'headerColor' => 'text-white', 'navColor' => 'text-black', 'bannerImageUrl' => '' ),
				array( 'categoryId' => 355, 'gridColumns' => 5, 'maxProducts' => 20, 'headerBg' => 'bg-white', 'headerColor' => 'text-black', 'navColor' => 'text-black', 'bannerImageUrl' => '' ),
				array( 'categoryId' => 356, 'gridColumns' => 4, 'maxProducts' => 20, 'headerBg' => 'bg-white', 'headerColor' => 'text-black', 'navColor' => 'text-black', 'bannerImageUrl' => '/images/newbannerA.webp' ),
				array( 'categoryId' => 357, 'gridColumns' => 5, 'maxProducts' => 20, 'headerBg' => 'bg-white', 'headerColor' => 'text-black', 'navColor' => 'text-black', 'bannerImageUrl' => '' ),
				array( 'categoryId' => 358, 'gridColumns' => 5, 'maxProducts' => 20, 'headerBg' => 'bg-white', 'headerColor' => 'text-black', 'navColor' => 'text-black', 'bannerImageUrl' => '' ),
				array( 'categoryId' => 359, 'gridColumns' => 4, 'maxProducts' => 20, 'headerBg' => 'bg-white', 'headerColor' => 'text-black', 'navColor' => 'text-black', 'bannerImageUrl' => '/images/newbannerA.webp' ),
				array( 'categoryId' => 312, 'gridColumns' => 5, 'maxProducts' => 20, 'headerBg' => 'bg-white', 'headerColor' => 'text-black', 'navColor' => 'text-black', 'bannerImageUrl' => '' ),
				array( 'categoryId' => 360, 'gridColumns' => 5, 'maxProducts' => 20, 'headerBg' => 'bg-white', 'headerColor' => 'text-black', 'navColor' => 'text-black', 'bannerImageUrl' => '' ),
				array( 'categoryId' => 361, 'gridColumns' => 5, 'maxProducts' => 20, 'headerBg' => 'bg-white', 'headerColor' => 'text-black', 'navColor' => 'text-black', 'bannerImageUrl' => '/images/newbannerA.webp' ),
				array( 'categoryId' => 362, 'gridColumns' => 5, 'maxProducts' => 20, 'headerBg' => 'bg-white', 'headerColor' => 'text-black', 'navColor' => 'text-black', 'bannerImageUrl' => '/images/newbannerA.webp' ),
				array( 'categoryId' => 363, 'gridColumns' => 5, 'maxProducts' => 20, 'headerBg' => 'bg-white', 'headerColor' => 'text-black', 'navColor' => 'text-black', 'bannerImageUrl' => '' ),
			),

			// ------------------------------------------------------------------
			// Bloc "Nouveauté" en bas (components/collectionHomepage/Nouveaute.vue).
			// ------------------------------------------------------------------
			'nouveaute' => array(
				'categoryId'      => 300,
				'headerBg'        => 'bg-orange-500',
				'headerColor'     => 'text-black',
				'gridColumns'     => 5,
				'productsPerPage' => 30,
				'productsLimit'   => 30,
			),

			// ------------------------------------------------------------------
			// Texte SEO déroulant (components/CollapseSeoText.vue).
			// ------------------------------------------------------------------
			'seo' => array(
				'title'   => '🛒 IvoirShop.ci – Le meilleur du shopping en ligne en Côte d’Ivoire 🇨🇮',
				'tagline' => 'Boutique en ligne ivoirienne • Livraison rapide partout en Côte d’Ivoire • Paiement sécurisé',
				'intro'   => 'Bienvenue sur IvoirShop.ci, votre plateforme ivoirienne de référence pour le shopping en ligne. Retrouvez en un clic vos produits préférés à prix imbattables, avec livraison rapide partout en Côte d’Ivoire et un service client disponible 7j/7',
				'links'   => array(
					array( 'label' => 'Électroménager', 'link' => 'https://ivoirshop.ci/categorie' ),
					array( 'label' => 'Télévisions', 'link' => 'https://ivoirshop.ci/categorie/electronique/televisions' ),
					array( 'label' => 'Ordinateurs', 'link' => 'https://ivoirshop.ci/categorie/ordinateurs-accessoires-informatique' ),
					array( 'label' => 'Mode & Beauté', 'link' => 'https://ivoirshop.ci/categorie/mode' ),
					array( 'label' => 'Promotions', 'link' => 'https://ivoirshop.ci/categorie/ventes-flash' ),
				),
				// Contenu riche (HTML) affiché dans la partie dépliée.
				'bodyHtml' => '',
				'contact'  => array(
					'email' => 'support@ivoirshop.ci',
					'phone' => '+225 0701518845',
				),
			),
		);
	}
}
