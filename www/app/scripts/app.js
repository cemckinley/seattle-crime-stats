'use strict';

/*global define: true */

/**
 *	MAIN APP CONTROLLER
 *
 *	@description inits main components of backbone app, serves as event hub for view change actions
 *
 *	@author CM
 */

define([
	'jquery',
	'underscore',
	'backbone',
	'views/home-page-view',
	'views/crime-list-view',
	'routes/app-router'
], function($, _, Backbone, HomePage, CrimeListPage, Router){
	
	var app = {

		init: function(){

			// el refs
			this.loadingIcon = $('#loadingIcon');

			// views
			this.homePage = new HomePage();
			this.crimeListPage = new CrimeListPage({
				loadingIcon: this.loadingIcon
			});

			// router
			this.router = new Router();

			// events
			_.extend(this, Backbone.Events);
			this.router.on('viewChange:crimeList', _.bind(this.requestData, this));
			this.crimeListPage.on('crimeDetailRequest', _.bind(this.requestCrimeDetail, this));

			// setup
			Backbone.history.start();
		},

		/**
		 * request crime data from model collection, show loading icon
		 */
		requestData: function(){
			this.crimeListPage.requestNewData();
		},

		/**
		 * send request for specific crime detail page
		 */
		requestCrimeDetail: function(crimeId){
			console.log(crimeId);
		}

	};

	return app;

});