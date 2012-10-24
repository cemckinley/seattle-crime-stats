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
	'modernizr'
], function($, _, Backbone, Modernizr){

	var CrimeListPage = Backbone.View.extend({

		el: '#pageCrimeList',
		collection: null, // should be passed in via extend on instantiation
		template: _.template($('#crimeItemTemplate').html()),
		currentIndex: 0,
		maxPerPage: 20,
		events: function(){
			if(Modernizr.touch){
				return {
					'click #crimeList li': 'onCrimeItemClick'
				};
			}else{
				return {
					'click #crimeList li': 'onCrimeItemClick'
				};
			}
		},

		initialize: function(){

			this.crimeList = $('#crimeList');
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

			this.crimeList.append(html);
		},

		/**
		 * empty crime list and set indexes to defaults
		 */
		reset: function(){
			this.currentIndex = 0;
			this.crimeList.empty();
		},

		/**
		 * event handler for clicks on individual crime items; triggers event to request crime item detail
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 */
		onCrimeItemClick: function(e){
			var itemId = $(e.currentTarget).attr('data-id');
			e.preventDefault();

			this.trigger('requestCrimeDetail', itemId);
		}

	});

	return CrimeListPage;

});
