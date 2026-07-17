<?php
/**
 * Template de la page d'admin "Page d'accueil".
 *
 * Variable disponible : $cfg (config complète via IHM_Config::get()).
 *
 * @package IvoirShopHomepageManager
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Rendu générique d'un répéteur.
 *
 * @param string $base      Nom de base, ex : "ihm[hero][slides]".
 * @param array  $rows      Lignes existantes.
 * @param array  $fields    Schéma : [ ['key'=>, 'type'=>'text|image|select', 'label'=>, 'options'=>[]], ... ].
 * @param string $add_label Libellé du bouton d'ajout.
 * @param string $row_title Préfixe du titre de ligne.
 */
function ihm_repeater( $base, $rows, $fields, $add_label = '+ Ajouter', $row_title = 'Élément' ) {
	echo '<div class="ihm-repeater" data-ihm-repeater data-base="' . esc_attr( $base ) . '" data-next="' . count( $rows ) . '">';
	echo '<div class="ihm-repeater__items">';
	foreach ( $rows as $i => $row ) {
		ihm_repeater_row( $base, $i, $row, $fields, $row_title );
	}
	echo '</div>';

	// Template pour les nouvelles lignes.
	echo '<template class="ihm-repeater__template">';
	ihm_repeater_row( $base, '__i__', array(), $fields, $row_title );
	echo '</template>';

	echo '<button type="button" class="button button-secondary ihm-repeater__add">' . esc_html( $add_label ) . '</button>';
	echo '</div>';
}

/** Rendu d'une ligne de répéteur. */
function ihm_repeater_row( $base, $i, $row, $fields, $row_title ) {
	$label = '__i__' === $i ? $row_title : ( $row_title . ' ' . ( (int) $i + 1 ) );
	echo '<div class="ihm-repeater__item" data-index="' . esc_attr( $i ) . '">';
	echo '<div class="ihm-repeater__item-head"><strong class="ihm-repeater__item-title">' . esc_html( $label ) . '</strong>';
	echo '<button type="button" class="button-link-delete ihm-repeater__remove">Supprimer</button></div>';
	echo '<div class="ihm-repeater__item-body">';
	foreach ( $fields as $f ) {
		$name = $base . '[' . $i . '][' . $f['key'] . ']';
		$val  = isset( $row[ $f['key'] ] ) ? $row[ $f['key'] ] : ( isset( $f['default'] ) ? $f['default'] : '' );
		switch ( $f['type'] ) {
			case 'image':
				IHM_Admin::image( $name, $val, $f['label'] );
				break;
			case 'select':
				IHM_Admin::select( $name, $val, $f['label'], $f['options'] );
				break;
			case 'textarea':
				IHM_Admin::textarea( $name, $val, $f['label'] );
				break;
			default:
				IHM_Admin::text( $name, $val, $f['label'], isset( $f['placeholder'] ) ? $f['placeholder'] : '' );
		}
	}
	echo '</div></div>';
}

// Options réutilisables pour les couleurs d'entête (classes Tailwind).
$bg_options = array(
	'bg-white'       => 'Blanc',
	'bg-[#a50a0a]'   => 'Rouge (#a50a0a)',
	'bg-[#019d39]'   => 'Vert (#019d39)',
	'bg-orange-500'  => 'Orange',
	'bg-black'       => 'Noir',
	'bg-gray-100'    => 'Gris clair',
);
$text_options = array(
	'text-black' => 'Noir',
	'text-white' => 'Blanc',
);

$active_tab = isset( $_GET['tab'] ) ? sanitize_key( $_GET['tab'] ) : 'background';
?>

<div class="wrap ihm-wrap">
	<h1>Gestion de la page d’accueil</h1>
	<p class="ihm-intro">Modifiez ici tout le contenu éditable de la page d’accueil du site. Les changements sont publiés via l’API et repris automatiquement par le site (quelques minutes de cache).</p>

	<?php if ( isset( $_GET['updated'] ) ) : ?>
		<div class="notice notice-success is-dismissible"><p>✅ Modifications enregistrées.</p></div>
	<?php endif; ?>

	<h2 class="nav-tab-wrapper ihm-tabs">
		<a href="#background" class="nav-tab" data-tab="background">Fond de page</a>
		<a href="#topBanner" class="nav-tab" data-tab="topBanner">Bandeau d’en-tête</a>
			<a href="#hero" class="nav-tab" data-tab="hero">Carrousel Hero</a>
		<a href="#rightAds" class="nav-tab" data-tab="rightAds">Bloc avantages</a>
		<a href="#partners" class="nav-tab" data-tab="partners">Partenaires</a>
		<a href="#productCarousels" class="nav-tab" data-tab="productCarousels">Carrousels produits</a>
		<a href="#acheterEnLigne" class="nav-tab" data-tab="acheterEnLigne">Acheter en ligne</a>
		<a href="#doubleBanners" class="nav-tab" data-tab="doubleBanners">Bannières doubles</a>
		<a href="#countdowns" class="nav-tab" data-tab="countdowns">Vente flash</a>
		<a href="#nouveaute" class="nav-tab" data-tab="nouveaute">Nouveautés</a>
		<a href="#seo" class="nav-tab" data-tab="seo">Texte SEO</a>
	</h2>

	<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" class="ihm-form">
		<input type="hidden" name="action" value="ihm_save_homepage" />
		<input type="hidden" name="ihm_active_tab" value="<?php echo esc_attr( $active_tab ); ?>" class="ihm-active-tab" />
		<?php wp_nonce_field( IHM_Admin::NONCE ); ?>

		<!-- ============ FOND DE PAGE ============ -->
		<section class="ihm-panel" data-panel="background">
			<h2>Fond de la page d’accueil</h2>
			<p class="description">Par défaut la page est blanche. Vous pouvez définir une couleur ou une image de fond.</p>
			<?php
			IHM_Admin::select( 'ihm[background][type]', $cfg['background']['type'], 'Type de fond', array(
				'none'  => 'Aucun (blanc par défaut)',
				'color' => 'Couleur unie',
				'image' => 'Image',
			) );
			IHM_Admin::text( 'ihm[background][color]', $cfg['background']['color'], 'Couleur (hex)', '#ffffff' );
			IHM_Admin::image( 'ihm[background][image]', $cfg['background']['image'], 'Image de fond' );
			IHM_Admin::select( 'ihm[background][size]', $cfg['background']['size'], 'Ajustement image', array(
				'cover'   => 'Couvrir (cover)',
				'contain' => 'Contenir (contain)',
				'auto'    => 'Taille réelle (auto)',
			) );
			IHM_Admin::select( 'ihm[background][repeat]', $cfg['background']['repeat'], 'Répétition', array(
				'no-repeat' => 'Pas de répétition',
				'repeat'    => 'Répéter (mosaïque)',
			) );
			?>
		</section>

		<!-- ============ TOP BANNER ============ -->
		<section class="ihm-panel" data-panel="topBanner">
			<h2>Bandeau d’en-tête</h2>
			<p class="description">Le bandeau publicitaire tout en haut du site (au-dessus du menu). Cliquable, avec une couleur de fond.</p>
			<?php
			IHM_Admin::checkbox( 'ihm[topBanner][enabled]', $cfg['topBanner']['enabled'], 'Afficher le bandeau d’en-tête' );
			IHM_Admin::image( 'ihm[topBanner][image]', $cfg['topBanner']['image'], 'Image du bandeau (gif/png/jpg)' );
			IHM_Admin::text( 'ihm[topBanner][link]', $cfg['topBanner']['link'], 'Lien au clic', '/ ou https://ivoirshop.ci/...' );
			IHM_Admin::text( 'ihm[topBanner][bgColor]', $cfg['topBanner']['bgColor'], 'Couleur de fond (hex)', '#ff5a00' );
			?>
		</section>

		<!-- ============ HERO ============ -->
		<section class="ihm-panel" data-panel="hero">
			<h2>Carrousel principal (Hero)</h2>
			<p class="description">Les grandes bannières qui défilent en haut de la page. Ordre = ordre d’affichage.</p>
			<?php
			ihm_repeater(
				'ihm[hero][slides]',
				$cfg['hero']['slides'],
				array(
					array( 'key' => 'image', 'type' => 'image', 'label' => 'Image du slide' ),
					array( 'key' => 'link', 'type' => 'text', 'label' => 'Lien au clic', 'placeholder' => 'https://ivoirshop.ci/categorie/...' ),
				),
				'+ Ajouter un slide',
				'Slide'
			);
			?>
		</section>

		<!-- ============ RIGHT ADS ============ -->
		<section class="ihm-panel" data-panel="rightAds">
			<h2>Bloc avantages (colonne droite)</h2>
			<p class="description">Les 3 avantages (icône + titre + description) et l’image promotionnelle en dessous.</p>
			<h3>Avantages</h3>
			<?php
			ihm_repeater(
				'ihm[rightAds][advantages]',
				$cfg['rightAds']['advantages'],
				array(
					array( 'key' => 'image', 'type' => 'image', 'label' => 'Icône' ),
					array( 'key' => 'title', 'type' => 'text', 'label' => 'Titre' ),
					array( 'key' => 'description', 'type' => 'text', 'label' => 'Description' ),
				),
				'+ Ajouter un avantage',
				'Avantage'
			);
			?>
			<h3>Image promotionnelle</h3>
			<?php
			IHM_Admin::image( 'ihm[rightAds][promoImage]', $cfg['rightAds']['promoImage'], 'Image promo (gif/png)' );
			IHM_Admin::text( 'ihm[rightAds][promoLink]', $cfg['rightAds']['promoLink'], 'Lien de l’image promo' );
			?>
		</section>

		<!-- ============ PARTNERS ============ -->
		<section class="ihm-panel" data-panel="partners">
			<h2>Partenaires</h2>
			<?php
			IHM_Admin::text( 'ihm[partners][title]', $cfg['partners']['title'], 'Titre du bloc' );
			?>
			<h3>Bannière gauche</h3>
			<?php
			IHM_Admin::image( 'ihm[partners][leftBanner][image]', $cfg['partners']['leftBanner']['image'], 'Image bannière gauche' );
			IHM_Admin::text( 'ihm[partners][leftBanner][link]', $cfg['partners']['leftBanner']['link'], 'Lien bannière gauche' );
			?>
			<h3>Bannière droite</h3>
			<?php
			IHM_Admin::image( 'ihm[partners][rightBanner][image]', $cfg['partners']['rightBanner']['image'], 'Image bannière droite' );
			IHM_Admin::text( 'ihm[partners][rightBanner][link]', $cfg['partners']['rightBanner']['link'], 'Lien bannière droite' );
			?>
			<h3>Logos des marques</h3>
			<?php
			ihm_repeater(
				'ihm[partners][logos]',
				$cfg['partners']['logos'],
				array(
					array( 'key' => 'image', 'type' => 'image', 'label' => 'Logo' ),
					array( 'key' => 'title', 'type' => 'text', 'label' => 'Nom de la marque' ),
					array( 'key' => 'link', 'type' => 'text', 'label' => 'Lien' ),
				),
				'+ Ajouter une marque',
				'Marque'
			);
			?>
		</section>

		<!-- ============ PRODUCT CAROUSELS ============ -->
		<section class="ihm-panel" data-panel="productCarousels">
			<h2>Carrousels de produits</h2>
			<p class="description">Chaque carrousel affiche une catégorie WooCommerce. L’ID catégorie détermine les produits. Vous contrôlez couleurs et bannière.</p>
			<?php
			ihm_repeater(
				'ihm[productCarousels]',
				$cfg['productCarousels'],
				array(
					array( 'key' => 'categoryId', 'type' => 'text', 'label' => 'ID catégorie WooCommerce', 'placeholder' => 'ex : 353' ),
					array( 'key' => 'headerBg', 'type' => 'select', 'label' => 'Couleur de fond de l’entête', 'options' => $bg_options ),
					array( 'key' => 'headerColor', 'type' => 'select', 'label' => 'Couleur du titre', 'options' => $text_options ),
					array( 'key' => 'navColor', 'type' => 'select', 'label' => 'Couleur navigation', 'options' => $text_options ),
					array( 'key' => 'gridColumns', 'type' => 'text', 'label' => 'Nb de colonnes', 'placeholder' => '4 ou 5' ),
					array( 'key' => 'maxProducts', 'type' => 'text', 'label' => 'Nb max de produits', 'placeholder' => '20' ),
					array( 'key' => 'bannerImageUrl', 'type' => 'image', 'label' => 'Bannière (optionnelle)' ),
				),
				'+ Ajouter un carrousel',
				'Carrousel'
			);
			?>
		</section>

		<!-- ============ ACHETER EN LIGNE ============ -->
		<section class="ihm-panel" data-panel="acheterEnLigne">
			<h2>Grille « Acheter en Ligne »</h2>
			<?php
			IHM_Admin::text( 'ihm[acheterEnLigne][title]', $cfg['acheterEnLigne']['title'], 'Titre du bloc' );
			ihm_repeater(
				'ihm[acheterEnLigne][items]',
				$cfg['acheterEnLigne']['items'],
				array(
					array( 'key' => 'image', 'type' => 'image', 'label' => 'Image' ),
					array( 'key' => 'name', 'type' => 'text', 'label' => 'Nom' ),
					array( 'key' => 'link', 'type' => 'text', 'label' => 'Lien' ),
				),
				'+ Ajouter une vignette',
				'Vignette'
			);
			?>
		</section>

		<!-- ============ DOUBLE BANNERS ============ -->
		<section class="ihm-panel" data-panel="doubleBanners">
			<h2>Bannières doubles</h2>
			<p class="description">Chaque bloc affiche 2 images côte à côte. Elles s’intercalent entre les carrousels de produits.</p>
			<div class="ihm-repeater" data-ihm-repeater data-base="ihm[doubleBanners]" data-next="<?php echo count( $cfg['doubleBanners'] ); ?>">
				<div class="ihm-repeater__items">
					<?php foreach ( $cfg['doubleBanners'] as $i => $pair ) : ?>
						<?php ihm_double_banner_row( 'ihm[doubleBanners]', $i, $pair ); ?>
					<?php endforeach; ?>
				</div>
				<template class="ihm-repeater__template">
					<?php ihm_double_banner_row( 'ihm[doubleBanners]', '__i__', array( array(), array() ) ); ?>
				</template>
				<button type="button" class="button button-secondary ihm-repeater__add">+ Ajouter une paire</button>
			</div>
		</section>

		<!-- ============ COUNTDOWNS ============ -->
		<section class="ihm-panel" data-panel="countdowns">
			<h2>Compte à rebours / Vente flash</h2>
			<p class="description">Date de fin au format ISO (ex : 2026-12-30T10:00:00Z).</p>
			<?php
			ihm_repeater(
				'ihm[countdowns]',
				$cfg['countdowns'],
				array(
					array( 'key' => 'id', 'type' => 'text', 'label' => 'Identifiant (unique)', 'placeholder' => 'flash-sale-smartphones' ),
					array( 'key' => 'title', 'type' => 'text', 'label' => 'Titre' ),
					array( 'key' => 'categorySlug', 'type' => 'text', 'label' => 'Slug catégorie', 'placeholder' => 'vente-flash' ),
					array( 'key' => 'endTime', 'type' => 'text', 'label' => 'Date de fin (ISO)', 'placeholder' => '2026-12-30T10:00:00Z' ),
					array( 'key' => 'gridColumns', 'type' => 'text', 'label' => 'Nb de colonnes' ),
					array( 'key' => 'productsPerPage', 'type' => 'text', 'label' => 'Produits par page' ),
				),
				'+ Ajouter une vente flash',
				'Vente flash'
			);
			?>
		</section>

		<!-- ============ NOUVEAUTE ============ -->
		<section class="ihm-panel" data-panel="nouveaute">
			<h2>Bloc « Nouveautés » (bas de page)</h2>
			<?php
			IHM_Admin::text( 'ihm[nouveaute][categoryId]', $cfg['nouveaute']['categoryId'], 'ID catégorie WooCommerce' );
			IHM_Admin::select( 'ihm[nouveaute][headerBg]', $cfg['nouveaute']['headerBg'], 'Couleur de fond entête', $bg_options );
			IHM_Admin::select( 'ihm[nouveaute][headerColor]', $cfg['nouveaute']['headerColor'], 'Couleur du titre', $text_options );
			IHM_Admin::text( 'ihm[nouveaute][gridColumns]', $cfg['nouveaute']['gridColumns'], 'Nb de colonnes' );
			IHM_Admin::text( 'ihm[nouveaute][productsPerPage]', $cfg['nouveaute']['productsPerPage'], 'Produits par page' );
			IHM_Admin::text( 'ihm[nouveaute][productsLimit]', $cfg['nouveaute']['productsLimit'], 'Limite de produits' );
			?>
		</section>

		<!-- ============ SEO ============ -->
		<section class="ihm-panel" data-panel="seo">
			<h2>Texte SEO (bas de page, dépliable)</h2>
			<?php
			IHM_Admin::text( 'ihm[seo][title]', $cfg['seo']['title'], 'Titre principal' );
			IHM_Admin::text( 'ihm[seo][tagline]', $cfg['seo']['tagline'], 'Accroche' );
			IHM_Admin::textarea( 'ihm[seo][intro]', $cfg['seo']['intro'], 'Introduction' );
			?>
			<h3>Liens rapides</h3>
			<?php
			ihm_repeater(
				'ihm[seo][links]',
				$cfg['seo']['links'],
				array(
					array( 'key' => 'label', 'type' => 'text', 'label' => 'Libellé' ),
					array( 'key' => 'link', 'type' => 'text', 'label' => 'Lien' ),
				),
				'+ Ajouter un lien',
				'Lien'
			);
			?>
			<h3>Contenu détaillé (HTML)</h3>
			<p class="description">Contenu riche affiché quand on clique sur « Voir plus ». HTML autorisé.</p>
			<?php
			IHM_Admin::textarea( 'ihm[seo][bodyHtml]', $cfg['seo']['bodyHtml'], 'Contenu HTML', 10 );
			?>
			<h3>Contact</h3>
			<?php
			IHM_Admin::text( 'ihm[seo][contact][email]', $cfg['seo']['contact']['email'], 'Email' );
			IHM_Admin::text( 'ihm[seo][contact][phone]', $cfg['seo']['contact']['phone'], 'Téléphone' );
			?>
		</section>

		<p class="ihm-submit">
			<button type="submit" class="button button-primary button-hero">💾 Enregistrer les modifications</button>
		</p>
	</form>
</div>

<?php
/** Rendu d'une paire de bannières doubles. */
function ihm_double_banner_row( $base, $i, $pair ) {
	$fields = array(
		array( 'key' => 'image', 'type' => 'image', 'label' => 'Image' ),
		array( 'key' => 'link', 'type' => 'text', 'label' => 'Lien' ),
		array( 'key' => 'alt', 'type' => 'text', 'label' => 'Texte alternatif' ),
	);
	$title = '__i__' === $i ? 'Paire de bannières' : 'Paire ' . ( (int) $i + 1 );
	echo '<div class="ihm-repeater__item" data-index="' . esc_attr( $i ) . '">';
	echo '<div class="ihm-repeater__item-head"><strong class="ihm-repeater__item-title">' . esc_html( $title ) . '</strong>';
	echo '<button type="button" class="button-link-delete ihm-repeater__remove">Supprimer</button></div>';
	echo '<div class="ihm-double-pair">';
	for ( $side = 0; $side < 2; $side++ ) {
		$row = isset( $pair[ $side ] ) ? $pair[ $side ] : array();
		echo '<div class="ihm-double-pair__side"><h4>' . ( 0 === $side ? 'Image gauche' : 'Image droite' ) . '</h4>';
		foreach ( $fields as $f ) {
			$name = $base . '[' . $i . '][' . $side . '][' . $f['key'] . ']';
			$val  = isset( $row[ $f['key'] ] ) ? $row[ $f['key'] ] : '';
			if ( 'image' === $f['type'] ) {
				IHM_Admin::image( $name, $val, $f['label'] );
			} else {
				IHM_Admin::text( $name, $val, $f['label'] );
			}
		}
		echo '</div>';
	}
	echo '</div></div>';
}
