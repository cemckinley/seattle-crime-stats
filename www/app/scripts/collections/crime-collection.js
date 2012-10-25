'use strict';

/*global define: true */

/**
 *	CRIME LIST MODEL COLLECTION
 *
 *	@description collection for crime list item models
 *      - makes data request to server for crime json
 *
 */

define([
	'jquery',
	'underscore',
	'backbone',
	'models/crime-model'
], function($, _, Backbone, CrimeModel){

	var CrimeCollection = Backbone.Collection.extend({

		url: 'http://data.seattle.gov/api/views/7ais-f98f/rows.json',
		model: CrimeModel,
		maxResults: 1000,
		userLocation: null,

		initialize: function(){

			this.getUserCoords();

		},

		/**
		 * custom fetch decorator - formats url on the fly before making request, based on max results requested
		 * @param  {object} opts [extends standard Backbone object, see http://backbonejs.org/#Collection-fetch]
		 * @return {[type]}      [returns whatever Backbone.Collection.fetch normally returns]
		 */
		fetch: function(options){
			options = _.extend(options || {}, {
				url: this.url + '?max_rows=' + this.maxResults + '&jsonp=?'
			});

			return Backbone.Collection.prototype.fetch.apply(this, [options]);
		},

		/**
		 * custom parse method - gets proper row data according to desired columns, formats numbers and dates, gets distance of each crime from user
		 * @param  {object} response [data object from ajax response (from fetch)]
		 * @return {array}          [formatted data array of objects]
		 */
		parse: function(response){
			var rowData = response.data,
				columns = response.meta.view.columns, // contains data about each column of the rowData rows returned
				desiredColumns = [':id', 'offense_type', 'summarized_offense_description','date_reported', 'hundred_block_location', 'longitude', 'latitude'], // field names for desired columns
				columnFilter = [],
				formattedData = [],
				i,
				len;
			
			console.log(response);
			// grab the index of the columns that have the field names we're looking for (the table schema is always changing...)
			for (i=0, len=columns.length; i < len; i++){
				for (var j=0, len2=desiredColumns.length; j < len2; j++){
					if(columns[i].fieldName === desiredColumns[j]){
						columnFilter[j] = i;
					}
				}
			}

			// create an entry in the formattedData array for each data row, adding a key/value for each chosen column
			for (i=0, len=rowData.length; i < len; i++){
				var dataId = rowData[i][columnFilter[0]],
					dataOffenseType = rowData[i][columnFilter[1]],
					dataOffenseCategory = rowData[i][columnFilter[2]],
					dataDate = rowData[i][columnFilter[3]],
					dataBlock = rowData[i][columnFilter[4]],
					dataLongitude = parseFloat(rowData[i][columnFilter[5]]),
					dataLatitude = parseFloat(rowData[i][columnFilter[6]]),
					dataDistance = this.userLocation ? (Math.pow(this.userLocation.latitude - dataLatitude, 2)) + (Math.pow(this.userLocation.longitude - dataLongitude, 2)) : 0;
					
				formattedData[i] = {
					id: dataId,
					offenseType: dataOffenseType,
					offenseCategory: dataOffenseCategory,
					date: this.formatDate(dataDate),
					block: dataBlock,
					longitude: dataLongitude,
					latitude: dataLatitude,
					distance: dataDistance
				};
			}

			return formattedData;
		},

		getUserCoords: function(){
			var self = this;

			navigator.geolocation.getCurrentPosition(
				function (position) {
					var lat = position.coords.latitude,
						lon = position.coords.longitude;
					
					if(lat === false || lon === false){
						self.trigger('locationError');
					
					}else{
						self.userLocation = {
							latitude: lat,
							longitude: lon
						};
					}
				},
				function () {
					self.trigger('locationError');
				}
			);
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

	return CrimeCollection;
});