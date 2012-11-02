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
	'collections/crime-collection'
], function($, _, Backbone){

	var CrimeDetailView = Backbone.View.extend({

	  template: _.template($('#crimeDetailTemplate').html())

	});

	return CrimeDetailView;

});
