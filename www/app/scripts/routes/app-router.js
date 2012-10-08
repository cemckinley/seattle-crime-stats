'use strict';

/*global define: true */

/**
 *	MAIN APP ROUTER
 *
 *	@description router for backbone app; handles user navigation through panels
 *
 *	@author CM
 */

define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone){

	var AppRouter = Backbone.Router.extend({

		routes: {
	      '/': 'showHome',
	      '/crime-list': 'showCrimeList',
	      // Default
	      '*actions': 'defaultAction'
	    },

	    init: function(){
			Backbone.history.start();
	    },

	    showHome: function(){

	    },

	    showCrimeList: function(){

	    },

	    defaultAction: function(){

	    }

	});

	return AppRouter;

});