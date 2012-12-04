'use strict';

/*global define: true */

/**
 *	CRIME ITEM DETAIL VIEW
 *
 *	@description view/controller for crime detail pages
 *
 */

define([
	'jquery',
	'underscore',
	'backbone',
	'gmaps'
], function($, _, Backbone, gmaps){

	var CrimeDetailView = Backbone.View.extend({

		template: _.template($('#crimeDetailTemplate').html()),

		initialize: function(){

			// el refs
			this.container = $('#pageCrimeMap .content');

			// event listeners
			this.model.on('change', _.bind(this.onCrimeDataSuccess, this));
			this.model.on('error', _.bind(this.onCrimeDataError, this));

			// setup
			if(this.options.renderOnCreation){ this.render(); } // option passed in on view instantiation in app.js if data is already present, no data request needed

		},

		/**
		 * called when data on model changes
		 */
		onCrimeDataSuccess: function(){
			this.render();
		},

		/**
		 * called if data request for individual record by model fails
		 * @param  {object} error [ajax error object]
		 */
		onCrimeDataError: function(error){
			console.log('data error on individual crime', error);
		},

		render: function(){
			var html = this.template(this.model.attributes);

			this.container.html(html);
			this.getMap();
		},

		/**
		 * create new google map with marker for crime
		 */
		getMap: function(){
			var mapLocation = new gmaps.maps.LatLng(this.model.get('latitude'), this.model.get('longitude')),
				mapSize = {
					width: parseInt(this.container.width() * 0.95, 10),
					height: $(window).height() * 0.7
				},
				mapOptions = {
					zoom: 14,
					center: mapLocation,
					mapTypeId: gmaps.maps.MapTypeId.ROADMAP
				},
				gMap,
				gMarker;
			
			$('#map_canvas').css(mapSize); // Google Maps requires the replacement div to have a set size

			gMap = new gmaps.maps.Map(document.getElementById('map_canvas'), mapOptions),
			gMarker = new gmaps.maps.Marker({
				position: mapLocation,
				map: gMap,
				title: this.model.get('offenseBlock')
			});
		}

	});

	return CrimeDetailView;

});
