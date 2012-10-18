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
	      '': 'home',
	      'crime-list': 'crimeList',
	      // Default
	      '*actions': 'defaultAction'
	    },

	    initialize: function(){
			console.log('init');

			this.on('route:home', _.bind(this.showHome, this));
			this.on('route:crimeList', _.bind(this.showCrimeList, this));
	    },

	    showHome: function(){
			console.log('showing home');
	    },

	    showCrimeList: function(){
			console.log('showing crimes');
	    },

	    defaultAction: function(){

	    }

	});

	return AppRouter;

});