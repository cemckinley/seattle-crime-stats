'use strict';

/*global define: true */

/**
 *	MAIN APP CONTROLLER
 *
 *	@description inits main components of backbone app, serves as uber controller/events hub
 *
 *	@author CM
 */

define([
	'jquery',
	'underscore',
	'backbone',
	'views/home-page-view',
	'views/crime-list-view',
	'collections/crime-collection',
	'routes/app-router'
], function($, _, Backbone, HomePage, CrimeListPage, CrimeCollection, Router){
	
	var app = {

		init: function(){

			// el refs
			this.loadingIcon = $('#loadingIcon');

			// collections
			this.crimeCollection = new CrimeCollection();

			// views
			this.homePage = new HomePage();
			this.crimeListPage = new CrimeListPage({
				collection: this.crimeCollection
			});

			// router
			this.router = new Router();
			Backbone.history.start();

			// events
			_.extend(this, Backbone.Events);
			this.homePage.on('dataRequest', _.bind(this.requestData, this));
			this.crimeCollection.on('reset', _.bind(this.refreshCrimeList, this));
			this.crimeCollection.on('error', _.bind(this.onCrimeDataError, this));
			this.crimeCollection.on('locationError', _.bind(this.onLocationDataError, this));
			this.crimeListPage.on('crimeDetailRequest', _.bind(this.requestCrimeDetail, this));
		},

		/**
		 * request crime data from model collection, show loading icon
		 */
		requestData: function(){
			this.loadingIcon.fadeIn(200);
			this.crimeCollection.fetch();
		},

		/**
		 * error handler for data errors with data.seattle.gov
		 */
		onCrimeDataError: function(){
			this.loadingIcon.fadeOut(200);
			window.alert('Data services are temporarily unavailable. Please try again later.');
		},

		/**
		 * error handler for geolocation data error
		 */
		onLocationDataError: function(){
			this.loadingIcon.fadeOut(200);
			window.alert('Unable to use geolocation data for sorting crimes by distance. If you have disabled geolocation, please enable this feature in your browser.');
			this.showCrimeList();
		},

		/**
		 * reset crimes list and render new data, hide loading icon, navigate to crime list page
		 * @return {[type]} [description]
		 */
		refreshCrimeList: function(){
			this.crimeListPage.reset();
			this.crimeListPage.render();
			this.loadingIcon.fadeOut(200);
			this.router.navigate('crime-list', {trigger: true});
		},

		/**
		 * send request for specific crime detail page
		 */
		requestCrimeDetail: function(){
			this.crimeListPage.render();
		}

	};

	return app;

});