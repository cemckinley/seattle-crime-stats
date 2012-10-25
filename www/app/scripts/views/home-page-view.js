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
	'backbone'
], function($, _, Backbone){

	var HomePage = Backbone.View.extend({

		el: '#pageHome',

		initialize: function(){

			_.extend(this, Backbone.Events);

		}

	});

	return HomePage;

});