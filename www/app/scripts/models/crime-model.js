'use strict';

/*global define: true */

/**
 *	CRIME LIST MODEL
 *
 *	@description modl for crime list items
 *
 */


define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone){

	var CrimeModel = Backbone.Model.extend({

		url: 'http://data.seattle.gov/api/views/7ais-f98f/rows/',

		fetch: function(options){
			options = _.extend(options || {}, {
				url: this.url + this.id + '.json?jsonp=?'
			});

			return Backbone.Model.prototype.fetch.apply(this, [options]);
		}
		
	});

	return CrimeModel;

});