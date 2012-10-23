'use strict';

/*global define: true */

/**
 *	HOME PAGE VIEW
 *
 *	@description view/controller for home page
 *      - triggers custom event 'dataRequest' on itself when user clicks get data button
 *
 */

define([
	'jquery',
	'underscore',
	'backbone',
	'modernizr'
], function($, _, Backbone, Modernizr){

	var HomePage = Backbone.View.extend({

		el: '#pageHome',
		events: function(){
			
			if(Modernizr.touch){
				return {
					'click #getDataBtn': 'onDataBtnClick'
				};
			}else{
				return {
					'click #getDataBtn': 'onDataBtnClick'
				};
			}
		},

		initialize: function(){

			_.extend(this, Backbone.Events);

		},

		onDataBtnClick: function(e){
			e.preventDefault();

			this.trigger('dataRequest');
		}

	});

	return HomePage;

});