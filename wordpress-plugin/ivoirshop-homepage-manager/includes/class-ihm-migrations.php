<?php
/**
 * Migrations de la configuration enregistrée en base.
 *
 * Les valeurs par défaut de IHM_Config ne s'appliquent qu'à une installation
 * neuve : dès qu'une configuration a été enregistrée, c'est elle qui prime.
 * Ce fichier met donc à jour la configuration existante quand le format ou le
 * contenu attendu change, sans intervention manuelle dans l'administration.
 *
 * @package IvoirShopHomepageManager
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class IHM_Migrations {

	/** Clé d'option qui mémorise la dernière version migrée. */
	const VERSION_OPTION = 'ivoirshop_homepage_migrated_version';

	public static function init() {
		add_action( 'admin_init', array( __CLASS__, 'maybe_migrate' ) );
	}

	/**
	 * Exécute les migrations non encore appliquées.
	 *
	 * @return void
	 */
	public static function maybe_migrate() {
		$done = get_option( self::VERSION_OPTION, '0' );

		if ( version_compare( $done, '1.2.0', '<' ) ) {
			self::migrate_partner_links_to_brand_pages();
			update_option( self::VERSION_OPTION, '1.2.0' );
		}
	}

	/**
	 * v1.2.0 — Les logos partenaires pointaient vers la recherche
	 * (https://ivoirshop.ci/recherche?q=binatone). Le site dispose désormais de
	 * pages de marque : /marque/binatone. On convertit les liens enregistrés.
	 *
	 * La correspondance se fait sur le terme recherché, car il ne correspond pas
	 * toujours au slug de la marque dans WooCommerce (smart → smart-technology).
	 * Les termes absents de la table restent sur la recherche : ils n'ont pas de
	 * marque correspondante, et les rediriger produirait une page 404.
	 *
	 * @return void
	 */
	public static function migrate_partner_links_to_brand_pages() {
		$map = array(
			'leadder'    => 'leadder',
			'ilux'       => 'ilux',
			'roch'       => 'roch',
			'smart'      => 'smart-technology',
			'binatone'   => 'binatone',
			'oraimo'     => 'oraimo',
			'raf'        => 'raf',
			'sivercrest' => 'silver-crest',
			'nasco'      => 'nasco',
			'tecno'      => 'tecno',
			'infinix'    => 'infinix',
			'hp'         => 'hp',
			'lenovo'     => 'lenovo',
		);

		$config = get_option( IHM_OPTION_KEY, array() );

		if ( ! is_array( $config ) || empty( $config['partners'] ) ) {
			return;
		}

		$convert = function ( $link ) use ( $map ) {
			if ( ! is_string( $link ) || '' === $link ) {
				return $link;
			}

			// On ne touche qu'aux liens de recherche, quelle que soit leur forme
			// (absolue ou relative).
			if ( false === strpos( $link, 'recherche?q=' ) ) {
				return $link;
			}

			$parts = wp_parse_url( $link );
			if ( empty( $parts['query'] ) ) {
				return $link;
			}

			parse_str( $parts['query'], $query );
			$term = isset( $query['q'] ) ? strtolower( trim( $query['q'] ) ) : '';

			return isset( $map[ $term ] ) ? '/marque/' . $map[ $term ] : $link;
		};

		$partners = $config['partners'];

		foreach ( array( 'leftBanner', 'rightBanner' ) as $banner ) {
			if ( isset( $partners[ $banner ]['link'] ) ) {
				$partners[ $banner ]['link'] = $convert( $partners[ $banner ]['link'] );
			}
		}

		if ( ! empty( $partners['logos'] ) && is_array( $partners['logos'] ) ) {
			foreach ( $partners['logos'] as $i => $logo ) {
				if ( isset( $logo['link'] ) ) {
					$partners['logos'][ $i ]['link'] = $convert( $logo['link'] );
				}
			}
		}

		$config['partners'] = $partners;
		update_option( IHM_OPTION_KEY, $config );
	}
}
