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
	'collections/crime-collection',
	'models/crime-model',
	'views/home-page-view',
	'views/crime-list-view',
	'views/crime-detail-view',
	'routes/app-router'
], function($, _, Backbone, CrimeCollection, CrimeModel, HomePage, CrimeListPage, CrimeDetailView, Router){
	
	var app = {

		init: function(){

			// el refs
			this.loadingIcon = $('#loadingIcon');

			// collections/models
			this.collection = new CrimeCollection();

			// views
			this.homePage = new HomePage();
			this.crimeListPage = new CrimeListPage({
				collection: this.collection,
				loadingIcon: this.loadingIcon
			});
			this.crimeDetailView = null; // will be instantiated on each crime item click

			// router
			this.router = new Router();

			// events
			_.extend(this, Backbone.Events);
			this.router.on('viewChange:crimeList', _.bind(this.showCrimeList, this));
			this.router.on('viewChange:crimeDetail', _.bind(this.createCrimeDetail, this));

			// setup
			Backbone.history.start();
		},

		/**
		 * request crime data from model collection, show loading icon
		 */
		showCrimeList: function(){
			this.crimeListPage.showList();
		},

		/**
		 * create new view instance of crime detail page
		 */
		createCrimeDetail: function(crimeId){
			var model = this.collection.get(crimeId),
				renderOnCreation = true;

			if (this.crimeDetailView){ this.crimeDetailView.remove(); } // delete existing crime detail view

			if(!model){ // if model doesn't exist in collection, create new instance and fetch data
				model = new CrimeModel({
					id: crimeId
				});
				
				model.getRecord();
				this.collection.add(model, {silent: true});
				renderOnCreation = false;
			}

			this.crimeDetailView = new CrimeDetailView({
				model: model,
				renderOnCreation: renderOnCreation // option flag - true if model already exists and no data request needed
			});
		}

	};

	return app;

});