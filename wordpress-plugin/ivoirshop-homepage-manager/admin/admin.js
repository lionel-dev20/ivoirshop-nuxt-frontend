/**
 * Interface d'admin IvoirShop Homepage Manager.
 * - Onglets
 * - Répéteurs (ajout / suppression de lignes)
 * - Sélecteur d'image via la médiathèque WordPress (wp.media)
 */
( function ( $ ) {
	'use strict';

	// ------------------------------------------------------------------
	// Onglets.
	// ------------------------------------------------------------------
	function activateTab( tab ) {
		$( '.ihm-tabs .nav-tab' ).removeClass( 'nav-tab-active' );
		$( '.ihm-tabs .nav-tab[data-tab="' + tab + '"]' ).addClass( 'nav-tab-active' );
		$( '.ihm-panel' ).hide();
		$( '.ihm-panel[data-panel="' + tab + '"]' ).show();
		$( '.ihm-active-tab' ).val( tab );
	}

	$( document ).on( 'click', '.ihm-tabs .nav-tab', function ( e ) {
		e.preventDefault();
		activateTab( $( this ).data( 'tab' ) );
	} );

	// ------------------------------------------------------------------
	// Répéteurs.
	// ------------------------------------------------------------------
	$( document ).on( 'click', '.ihm-repeater__add', function () {
		var $rep = $( this ).closest( '.ihm-repeater' );
		var base = $rep.data( 'base' );
		var next = parseInt( $rep.attr( 'data-next' ), 10 ) || 0;

		// Contenu du <template> avec le placeholder __i__ remplacé par l'index.
		var tpl = $rep.children( '.ihm-repeater__template' ).html();
		tpl = tpl.replace( /__i__/g, next );

		$rep.children( '.ihm-repeater__items' ).append( tpl );
		$rep.attr( 'data-next', next + 1 );
	} );

	$( document ).on( 'click', '.ihm-repeater__remove', function () {
		if ( ! window.confirm( 'Supprimer cet élément ?' ) ) {
			return;
		}
		$( this ).closest( '.ihm-repeater__item' ).remove();
	} );

	// ------------------------------------------------------------------
	// Médiathèque WordPress.
	// ------------------------------------------------------------------
	var mediaFrame = null;

	$( document ).on( 'click', '.ihm-image-field__choose', function ( e ) {
		e.preventDefault();
		var $field = $( this ).closest( '.ihm-image-field' );
		var $url   = $field.find( '.ihm-image-field__url' );
		var $prev  = $field.find( '.ihm-image-field__preview' );

		mediaFrame = wp.media( {
			title: 'Choisir une image',
			button: { text: 'Utiliser cette image' },
			multiple: false,
		} );

		mediaFrame.on( 'select', function () {
			var attachment = mediaFrame.state().get( 'selection' ).first().toJSON();
			var url = attachment.url;
			// Préférer une taille "large" si disponible.
			if ( attachment.sizes && attachment.sizes.large ) {
				url = attachment.sizes.large.url;
			}
			$url.val( url );
			$prev.html( '<img src="' + url + '" alt="" />' );
		} );

		mediaFrame.open();
	} );

	// Retirer l'image.
	$( document ).on( 'click', '.ihm-image-field__clear', function ( e ) {
		e.preventDefault();
		var $field = $( this ).closest( '.ihm-image-field' );
		$field.find( '.ihm-image-field__url' ).val( '' );
		$field.find( '.ihm-image-field__preview' ).empty();
	} );

	// Mettre à jour l'aperçu quand on tape/colle une URL manuellement.
	$( document ).on( 'input', '.ihm-image-field__url', function () {
		var $field = $( this ).closest( '.ihm-image-field' );
		var val    = $( this ).val();
		var $prev  = $field.find( '.ihm-image-field__preview' );
		if ( val ) {
			$prev.html( '<img src="' + val + '" alt="" />' );
		} else {
			$prev.empty();
		}
	} );

	// ------------------------------------------------------------------
	// Init : ouvrir l'onglet demandé (URL) ou le premier.
	// ------------------------------------------------------------------
	$( function () {
		var initial = $( '.ihm-active-tab' ).val() || 'background';
		if ( ! $( '.ihm-panel[data-panel="' + initial + '"]' ).length ) {
			initial = 'background';
		}
		activateTab( initial );
	} );
} )( jQuery );
