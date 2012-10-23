'use strict';

/*global define: true */

/**
 *	MAIN APP CONTROLLER
 *
 *	@description inits main components of backbone app, serves as uber controller
 *
 *	@author CM
 */

define([
	'jquery',
	'underscore',
	'backbone',
	'views/home-page-view',
	'collections/crime-collection',
	'routes/app-router'
], function($, _, Backbone, HomePage, CrimeCollection, Router){
	
	var app = {

		init: function(){

			// add backbone events functionality to app-level dispatcher
			_.extend(this, Backbone.Events);

			// views
			this.homePage = new HomePage();

			// collections
			this.crimeCollection = new CrimeCollection();

			// router
			this.router = new Router();
			Backbone.history.start();

			// events
			this.homePage.on('dataRequest', _.bind(this.requestData, this));
			this.crimeCollection.on('reset', function(models){
				console.log(models);
			});
			this.crimeCollection.on('locationError', function(){
				console.log('location error');
			});
		},

		requestData: function(){
			this.crimeCollection.fetch();
		}

	};

	return app;

});