'use strict';

/*global define: true */
/*global Modernizr: true */

/**
 *	APP BOOTSTRAP
 *
 *	@description bootstrap for main app - require.js main app file and inits main app controller
 *
 *	@author CM
 *	@version 0.0.0
 *	@requires
 *		- require.js
 *		- app.js
 *		- Modernizr
 */


require.config({
	shim: {
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		'underscore': {
			exports: '_'
		},
		'modernizr': {
			exports: 'Modernizr'
		}
	},

paths: {
		backbone: 'vendor/backbone',
		underscore: 'vendor/underscore-min',
		jquery: 'vendor/jquery.min',
		modernizr: 'vendor/modernizr.min'
	}
});
 
require(['app', 'jquery'], function(app, $) {

	$(function(){
		app.init();
	});
});