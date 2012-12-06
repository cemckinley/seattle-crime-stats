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
		async: 'vendor/requirejs-plugins/async',
		backbone: 'vendor/backbone',
		underscore: 'vendor/underscore-min',
		jquery: 'vendor/jquery.min',
		modernizr: 'vendor/modernizr.min'
	}
});

// asyc load and define google maps api as a module, requires the require.js async plugin
define('gmaps', ['async!http://maps.google.com/maps/api/js?key=AIzaSyAEk95HT9mNZ0JA0e6UD2zAymGYb0wlZwY&sensor=true'], function(){
	return google;
});
 
require(['app', 'jquery'], function(app, $) {

	$(function(){
		app.init();
	});
});