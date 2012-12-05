'use strict';

/*global define: true */

/**
 *	CRIME LIST PAGE VIEW
 *
 *	@description view/controller for crime list page
 *
 */

define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone){

	var CrimeListPage = Backbone.View.extend({

		el: '#pageCrimeList',
		template: _.template($('#crimeItemTemplate').html()),
		collection: null, // passed in on instantiation
		currentIndex: 0,
		maxPerPage: 20,
		dataReceived: false,

		initialize: function(){

			// el refs
			this.crimeList = $('#crimeList');
			this.loadingIcon = $('#loadingIcon');

			// event listeners
			this.collection.on('reset', _.bind(this.onCrimeDataSuccess, this));
			this.collection.on('error', _.bind(this.onCrimeDataError, this));
			this.collection.on('locationError', _.bind(this.onLocationDataError, this));
		},

		/**
		 * check if data has already been requested, if not, request new data. Otherwise do nothing (router handlers panel transitions)
		 * @return {[type]} [description]
		 */
		showList: function(){
			if(!this.dataReceived){
				this.requestNewData();
			}
		},

		/**
		 * send new crime data request, empty crime list and set indexes to defaults
		 */
		requestNewData: function(){
			this.currentIndex = 0;
			this.crimeList.empty().hide();
			this.loadingIcon.fadeIn(200);
			this.collection.fetch();
		},

		/**
		 * reset crimes list and render new data, hide loading icon, navigate to crime list page
		 * @return {[type]} [description]
		 */
		onCrimeDataSuccess: function(){
			this.dataReceived = true;
			this.render();
			this.loadingIcon.fadeOut(200);
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
			this.render();
			this.loadingIcon.fadeOut(200);
			window.alert('Unable to use geolocation data for sorting crimes by distance. If you have disabled geolocation, please enable this feature in your browser.');
		},

		/**
		 * render crime items in list, this.maxPerPage at a time. Does not instantiate sub-views for items, since list is not live and data doesn't need to be tied to view.
		 */
		render: function(){
			var html = '';
			for(var i = this.currentIndex, len = this.maxPerPage; i < len; i++){
				html += this.template(this.collection.at(i).toJSON());
			}

			this.crimeList.append(html).fadeIn(200);
		}

	});

	return CrimeListPage;

});
