<?php
/**
 * Page d'administration : interface à onglets pour éditer la page d'accueil.
 *
 * @package IvoirShopHomepageManager
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class IHM_Admin {

	const MENU_SLUG = 'ivoirshop-homepage';
	const NONCE     = 'ihm_save_homepage';

	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'add_menu' ) );
		add_action( 'admin_post_ihm_save_homepage', array( __CLASS__, 'handle_save' ) );
		add_action( 'admin_enqueue_scripts', array( __CLASS__, 'enqueue_assets' ) );
	}

	public static function add_menu() {
		add_menu_page(
			'Page d’accueil',
			'Page d’accueil',
			'manage_options',
			self::MENU_SLUG,
			array( __CLASS__, 'render_page' ),
			'dashicons-store',
			3
		);
	}

	public static function enqueue_assets( $hook ) {
		if ( 'toplevel_page_' . self::MENU_SLUG !== $hook ) {
			return;
		}
		// Médiathèque WordPress.
		wp_enqueue_media();
		wp_enqueue_style( 'ihm-admin', IHM_PLUGIN_URL . 'admin/admin.css', array(), IHM_VERSION );
		wp_enqueue_script( 'ihm-admin', IHM_PLUGIN_URL . 'admin/admin.js', array( 'jquery' ), IHM_VERSION, true );
	}

	// ----------------------------------------------------------------------
	// Sauvegarde.
	// ----------------------------------------------------------------------
	public static function handle_save() {
		if ( ! current_user_can( 'manage_options' ) ) {
			wp_die( 'Accès refusé.' );
		}
		check_admin_referer( self::NONCE );

		$raw = isset( $_POST['ihm'] ) ? wp_unslash( $_POST['ihm'] ) : array();

		// Certains champs SEO sont rendus en HTML côté frontend : ils doivent
		// conserver leurs balises. On les met de côté avant le nettoyage
		// générique (qui retire le HTML) puis on les réinjecte via wp_kses_post.
		$seo_body_html = isset( $raw['seo']['bodyHtml'] ) ? wp_kses_post( $raw['seo']['bodyHtml'] ) : '';
		$seo_intro     = isset( $raw['seo']['intro'] ) ? wp_kses_post( $raw['seo']['intro'] ) : '';

		$config = self::sanitize( $raw );

		if ( isset( $config['seo'] ) && is_array( $config['seo'] ) ) {
			$config['seo']['bodyHtml'] = $seo_body_html;
			$config['seo']['intro']    = $seo_intro;
		}

		IHM_Config::save( $config );
		update_option( 'ivoirshop_homepage_updated_at', current_time( 'mysql' ) );

		$active_tab = isset( $_POST['ihm_active_tab'] ) ? sanitize_key( $_POST['ihm_active_tab'] ) : '';
		wp_safe_redirect(
			add_query_arg(
				array(
					'page'    => self::MENU_SLUG,
					'updated' => 'true',
					'tab'     => $active_tab,
				),
				admin_url( 'admin.php' )
			)
		);
		exit;
	}

	/**
	 * Nettoie récursivement les données postées.
	 * URLs/chemins et textes courts -> sanitize_text_field ; on préserve les
	 * chemins relatifs (ex : /images/x.png) et les classes Tailwind.
	 *
	 * @param mixed $value Valeur brute.
	 * @return mixed
	 */
	public static function sanitize( $value ) {
		if ( is_array( $value ) ) {
			// Détecte une "liste" (clés entières) -> on ré-indexe pour éviter
			// que json_encode ne produise un objet en cas de suppression de ligne.
			$is_list = array_keys( $value ) === range( 0, count( $value ) - 1 );

			$clean = array();
			foreach ( $value as $k => $v ) {
				$key           = is_string( $k ) ? sanitize_key( $k ) : $k;
				$clean[ $key ] = self::sanitize( $v );
			}

			// Cas des répéteurs : les clés sont numériques mais peuvent comporter
			// des trous (ligne supprimée). On force une liste propre.
			if ( ! empty( $clean ) ) {
				$numeric = true;
				foreach ( array_keys( $clean ) as $k ) {
					if ( ! is_int( $k ) && ! ctype_digit( (string) $k ) ) {
						$numeric = false;
						break;
					}
				}
				if ( $numeric ) {
					ksort( $clean, SORT_NUMERIC );
					$clean = array_values( $clean );
				}
			} elseif ( $is_list ) {
				$clean = array();
			}

			return $clean;
		}

		// Chaîne : on autorise le HTML uniquement pour le champ SEO bodyHtml,
		// mais comme on ne connaît pas la clé ici, on applique un nettoyage sûr
		// et le bodyHtml est traité séparément via wp_kses_post au rendu.
		$value = (string) $value;
		// Permet les retours à la ligne pour les zones de texte.
		if ( false !== strpos( $value, "\n" ) || strlen( $value ) > 300 ) {
			return sanitize_textarea_field( $value );
		}
		return sanitize_text_field( $value );
	}

	// ----------------------------------------------------------------------
	// Rendu de la page.
	// ----------------------------------------------------------------------
	public static function render_page() {
		$cfg = IHM_Config::get();
		require IHM_PLUGIN_DIR . 'admin/admin-page.php';
	}

	// ----------------------------------------------------------------------
	// Helpers de rendu de champs (utilisés dans admin-page.php).
	// ----------------------------------------------------------------------

	/** Champ texte simple. */
	public static function text( $name, $value, $label, $placeholder = '' ) {
		printf(
			'<label class="ihm-field"><span>%s</span><input type="text" name="%s" value="%s" placeholder="%s" /></label>',
			esc_html( $label ),
			esc_attr( $name ),
			esc_attr( $value ),
			esc_attr( $placeholder )
		);
	}

	/** Zone de texte. */
	public static function textarea( $name, $value, $label, $rows = 4 ) {
		printf(
			'<label class="ihm-field ihm-field--full"><span>%s</span><textarea name="%s" rows="%d">%s</textarea></label>',
			esc_html( $label ),
			esc_attr( $name ),
			(int) $rows,
			esc_textarea( $value )
		);
	}

	/**
	 * Champ image avec sélecteur médiathèque WordPress.
	 * Accepte une URL absolue (médiathèque) OU un chemin relatif (/images/x.png).
	 */
	public static function image( $name, $value, $label ) {
		$preview = $value ? esc_attr( $value ) : '';
		?>
		<div class="ihm-field ihm-image-field" data-ihm-image>
			<span class="ihm-field__label"><?php echo esc_html( $label ); ?></span>
			<div class="ihm-image-field__inner">
				<div class="ihm-image-field__preview">
					<?php if ( $preview ) : ?>
						<img src="<?php echo $preview; ?>" alt="" />
					<?php endif; ?>
				</div>
				<div class="ihm-image-field__controls">
					<input type="text" name="<?php echo esc_attr( $name ); ?>" value="<?php echo esc_attr( $value ); ?>" class="ihm-image-field__url" placeholder="/images/... ou https://..." />
					<button type="button" class="button ihm-image-field__choose">Choisir dans la médiathèque</button>
					<button type="button" class="button-link ihm-image-field__clear">Retirer</button>
				</div>
			</div>
		</div>
		<?php
	}

	/** Sélecteur simple (options clé => libellé). */
	public static function select( $name, $value, $label, $options ) {
		printf( '<label class="ihm-field"><span>%s</span><select name="%s">', esc_html( $label ), esc_attr( $name ) );
		foreach ( $options as $opt_value => $opt_label ) {
			printf(
				'<option value="%s"%s>%s</option>',
				esc_attr( $opt_value ),
				selected( $value, $opt_value, false ),
				esc_html( $opt_label )
			);
		}
		echo '</select>';
	}
}
