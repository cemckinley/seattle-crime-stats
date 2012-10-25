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
	'backbone',
	'collections/crime-collection',
	'modernizr'
], function($, _, Backbone, CrimeCollection, Modernizr){

	var CrimeListPage = Backbone.View.extend({

		el: '#pageCrimeList',
		template: _.template($('#crimeItemTemplate').html()),
		currentIndex: 0,
		maxPerPage: 20,
		events: function(){
			if(Modernizr.touch){
				return {
					'click #crimeList li a': 'onCrimeItemClick'
				};
			}else{
				return {
					'click #crimeList li a': 'onCrimeItemClick'
				};
			}
		},

		initialize: function(){

			// el refs
			this.crimeList = $('#crimeList');
			this.loadingIcon = $('#loadingIcon');

			// collections/models
			this.collection = new CrimeCollection();

			// event listeners
			this.collection.on('reset', _.bind(this.onCrimeDataSuccess, this));
			this.collection.on('error', _.bind(this.onCrimeDataError, this));
			this.collection.on('locationError', _.bind(this.onLocationDataError, this));
		},

		/**
		 * send new crime data request, empty crime list and set indexes to defaults
		 */
		requestNewData: function(){
			console.log('data request');
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
			console.log(this.collection);
			for(var i = this.currentIndex, len = this.maxPerPage; i < len; i++){
				html += this.template(this.collection.at(i).toJSON());
			}

			this.crimeList.append(html).fadeIn(200);
		},

		/**
		 * event handler for clicks on individual crime items; triggers event to request crime item detail
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 */
		onCrimeItemClick: function(e){
			var itemId = $(e.currentTarget).attr('data-id');
			e.preventDefault();

			this.trigger('crimeDetailRequest', itemId);
		}

	});

	return CrimeListPage;

});
