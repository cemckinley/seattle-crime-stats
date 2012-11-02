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
		userLocation: null,

		/**
		 * custom fetch decorator - formats url on the fly before making request, based on id passed in hash
		 * @param  {object} opts [extends standard Backbone object, see http://backbonejs.org/#Collection-fetch]
		 * @return {[type]}      [returns whatever Backbone.Collection.fetch normally returns]
		 */
		fetch: function(options){
			options = _.extend(options || {}, {
				url: this.url + this.id + '.json?jsonp=?'
			});

			return Backbone.Model.prototype.fetch.apply(this, [options]);
		},

		/**
		 * custom parse method - gets proper row data according to desired columns, formats numbers and dates, gets distance of each crime from user
		 * @param  {object} response [data object from ajax response (from fetch)]
		 * @return {array}          [formatted data array of objects]
		 */
		parse: function(response){
			var rowData = response,
				dataLongitude = parseFloat(rowData.longitude),
				dataLatitude = parseFloat(rowData.latitude),
				formattedData = {
					id: rowData._id,
					offenseType: rowData.offense_type,
					offenseCategory: rowData.summarized_offense_description,
					date: this.formatDate(rowData.date_reported),
					block: rowData.hundred_block_location,
					longitude: dataLongitude,
					latitude: dataLatitude,
					distance: 0
				};

			return formattedData;
		},

		/**
		 * function to format date string from iso 8601 format into 'Month DD, YYYY @ HH:MMpm'
		 * @param {string} isoString [ISO date string]
		 */
		formatDate: function(isoString){
			var monthKey = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
				hourKey = [12,1,2,3,4,5,6,7,8,9,10,11,12,1,2,3,4,5,6,7,8,9,10,11],
				date = (isoString.split('T'))[0].split('-'),
				time = (isoString.split('T'))[1].split(':'),
				month = monthKey[(parseInt(date[1], 10) - 1)],
				hour = hourKey[parseInt(time[0], 10)];
				
			if(parseInt(time[0], 10) >= 12){
				time = hour + ':' + time[1] + 'pm';
			}else{
				time = hour + ':' + time[1] + 'am';
			}

			return month + ' ' + date[2] + ', ' + date[0] + ' @ ' + time;
		}
		
	});

	return CrimeModel;

});