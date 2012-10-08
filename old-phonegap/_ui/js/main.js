// ---------------------------------------------- //
// seattle crime stats app
// --------------------------------------------- //

var SCS = {

	init: function(){
		var self = this;
		
		// get/set stored settings or set to default settings
		self.settings = {
			orderBy: localStorage['orderBy'] || 'date',
			maxResults: localStorage['maxResults'] || '1000'
		};
		self.loadSettings();
		
		// event listeners
		$('#getDataBtn').tap(function(e){
			e.preventDefault();
			self.getData.init();
		});
		
		$('#welcome :input').change(function(e){
			self.saveSettings($(this));
		});
		
		delete self.init;
	},
	
	// load saved settings, set with defaults if none available
	loadSettings: function(){
		var self = this;
		
		$('#orderResultsBy input[value="' + self.settings.orderBy + '"]').attr('checked',true);
		$('#selectMaxResults option[value="' + self.settings.maxResults + '"]').attr('selected',true);
		$('#welcome input').checkboxradio('refresh'); // refresh jqm's proxy form elements
		$('#selectMaxResults').selectmenu('refresh');
	},
	
	// save settings on form el change & updated local storage props
	saveSettings: function(formEl){
		var self = this;
		
		var orderByVal = '',
			maxResultsVal = '';
			
		if(formEl.is('input[name="orderBy"]')){
			orderByVal = formEl.parent().find('input:checked').val();
			self.settings.orderBy = orderByVal;
			localStorage['orderBy'] = orderByVal;
		}
		if(formEl.is('#selectMaxResults')){
			maxResultsVal = formEl.val();
			self.settings.maxResults = maxResultsVal;
			localStorage['maxResults'] = maxResultsVal;
		}
	}
		
};

// un-comment when running on device, for browser testing use document.ready
// document.addEventListener('deviceready', nonesuch.init, false);
$(document).ready(function(){
	SCS.init();
});



// ----------------------------- //
// data request for crime stats
// ----------------------------- //
/* TODO:
	- add network checks in for services
	- add check for geolocation working or not, if not, can't order crimes by nearest location
	- fix race condition between geolocation and data request
	- add option to enter address, instead of current location (google maps api?)
	- check for local storage support
*/

SCS.getData = {
	
	init: function(){
		var self = this;
		
		self.dataUrl = 'http://data.seattle.gov/api/views/7ais-f98f';
		self.crimeData = [];
		
		// check for availability of data service before doing anything else
		SCS.utilities.checkNetwork('data.seattle.gov', function(isReachable){
			
			if(isReachable === false){
				alert('Sorry, it looks like data.seattle.gov is currently unavailable, and no crime data can be retrieved. Please try again later.');
				return;
			
			}else{
				$.mobile.pageLoading();

				// clear any existing list items from previous crime data requests
				$('#crimeDataList .content').html('');

				// try to get current location via geolocation
				$.when(self.setLocation()).then(SCS.utilities.sodaJsonpRequest(self.dataUrl, 1000, self._formatCrimeData, SCS.getData));
			}
		});
	},
	
	// get current location and set lat/long for curLocation property of page. If unavailable, sets property to false.
	setLocation: function(){
		var self = this;
		
		SCS.utilities.getLocation(function(lat, lon){
			if(lat === false || lon === false){
				alert('Sorry, geolocation is unavailable at this time and can&rsquo;t be used to sort crime data by your location.');
				self.curLocation = false;
			}else{
				self.curLocation = {
					latitude: lat,
					longitude: lon
				};
			}
		});
	},
	
	// format returned data from data.seattle.gov into usable form
	_formatCrimeData: function(columnData, rowData){
		var self = this;

		var columns = rowData.meta.view.columns, // contains data about each column of the rowData rows returned
			desiredColumns = ['offense_type', 'date_reported', 'hundred_block_location', 'longitude', 'latitude'], // field names for desired columns
			columnFilter = [],
			monthKey = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
			hourKey = [12,1,2,3,4,5,6,7,8,9,10,11,12,1,2,3,4,5,6,7,8,9,10,11],
			formattedData = [];
		
		// function to format date string from iso 8601 format into 'Month DD, YYYY @ HH:MMpm'
		// maybe support Date object later if need to hold numerical date value
		function formatDate(isoString){
			var date = (isoString.split('T'))[0].split('-'),
				time = (isoString.split('T'))[1].split(':'),
				month = monthKey[(parseInt(date[1], 10) - 1)],
				hour = hourKey[parseInt(time[0])];
				
			if(parseInt(time[0]) >= 12){
				time = hour + ':' + time[1] + 'pm';
			}else{
				time = hour + ':' + time[1] + 'am';
			}

			return month + ' ' + date[2] + ', ' + date[0] + ' @ ' + time;
		}		
		
		// grab the index of the columns that have the field names we're looking for (the table is always changing...)
		for (var i=0, len1=columns.length; i < len1; i++){
			for (var j=0, len2=desiredColumns.length; j < len2; j++){
				if(columns[i].fieldName == desiredColumns[j]){
					columnFilter[j] = i;
				}
			}
		}

		// create an entry in the self.crimeData array for each data row, adding a key/value for each chosen column
		for (var i=0, len=rowData.data.length; i < len; i++){
			var dataOffenseType = rowData.data[i][columnFilter[0]],
				dataDate = rowData.data[i][columnFilter[1]],
				dataBlock = rowData.data[i][columnFilter[2]],
				dataLongitude = parseFloat(rowData.data[i][columnFilter[3]]),
				dataLatitude = parseFloat(rowData.data[i][columnFilter[4]]),
				dataDistance = (Math.pow(self.curLocation.latitude - dataLatitude, 2)) + (Math.pow(self.curLocation.longitude - dataLongitude, 2));
				
			formattedDate = formatDate(dataDate);
				
			formattedData[i] = {
				offenseType: dataOffenseType,
				date: formattedDate,
				block: dataBlock,
				longitude: dataLongitude,
				latitude: dataLatitude,
				distance: dataDistance
			};
		}

		$.mobile.pageLoading(true);
		
		// switch to view list of crime stats, pass over data
		$.mobile.changePage('#crimeDataList', 'slide', false, false);
		SCS.pageCrimeDataList.init(formattedData);
	}

};



// ----------------------------- //
// Crime Data List Page
// ----------------------------- //

SCS.pageCrimeDataList = {
	
	init: function(data){
		var self= this;
		
		// cache data, define other shared properties
		self.crimeData = data;
		self.itemsPerPage = 20; // how many items to show at a time
		self.currentCount = 0;
		self.container = $('#crimeDataList div.content');
		
		self.setup();
	},
	
	// add necessary dom elements to page
	setup: function(){
		var self = this;
		
		self.container.append('<ul id="crimeReportList"></ul>');
		self.listParent = $('#crimeReportList');
		
		// add 'next items' button and click handler
		if(self.crimeData.length >= self.itemsPerPage){
			self.container.append('<a href="#" id="getNextItems" class="app_button">Load next ' + self.itemsPerPage + '</a>');
			$('#getNextItems').tap(function(e){
					e.preventDefault();
					self.updateList();
				});
		}
		
		// add click listener to parent ul for handling each crime detail link
		self.listParent.delegate('a', 'tap', function(e){
			var crimeID = $(this).attr('data-crime-id'),
				crimeInfo = self.crimeData[crimeID];
			e.preventDefault();
			$.mobile.changePage('#crimeMap', 'slide', false, false);
			SCS.pageCrimeMap.init(crimeInfo);
		});
		
		self.updateList();
	},
	
	updateList: function(){
		var self = this;
		
		// add list children for each item in the data object up to defined # per page
		for(var i = self.currentCount, j = self.currentCount + self.itemsPerPage; i < j; i++){
			
			var curData = self.crimeData[i],
				html = '';
			
			html += '<li class="crimeItem">',
			html += 	'<a href="#" class="detailLink" data-crime-id="' + i + '">',
			html +=			'<strong class="offenseType">' + curData.offenseType + '</strong>',
			html +=			'<span class="offenseDate">' + curData.date + '</span>',
			html +=			'<span class="offenseBlock">' + curData.block + '</span>',
			html +=		'</a>',
			html += '</li>';
			
			self.listParent.append(html);
		}
		
		self.currentCount += self.itemsPerPage;
		
		// if this is the last group in the data, hide the 'next' button
		if(self.currentCount >= self.crimeData.length){
			$('#getNextItems').hide();
		}
	}
	
}



// ----------------------------- //
// crime map page
// ----------------------------- //
SCS.pageCrimeMap = {
	
	init: function(crimeInfo){
		var self = this;
		
		$.mobile.pageLoading();
		
		self.crime = crimeInfo;
		
		// add crime data to page
		$('#crimeMap .offenseType').html(self.crime.offenseType);
		$('#crimeMap .offenseDate').append(self.crime.date);
		$('#crimeMap .offenseBlock').append(self.crime.block);
		
		self.getMap();
	},
	
	// get google map of specified location (using google maps v3 api)
	getMap: function(){
		var self = this;
		
		var location = new google.maps.LatLng(self.crime.latitude, self.crime.longitude),
			mapSize = parseInt($('#crimeMap .content').width() * .95),
			options = {
				zoom: 14,
				center: location,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			};
		
		$('#map_canvas').css({'width':mapSize, 'height':mapSize}); // Google Maps requires the replacement div to have a set size
		var gMap = new google.maps.Map(document.getElementById('map_canvas'), options),
			gMarker = new google.maps.Marker({
				position: location,
				map: gMap,
				title: self.crime.offenseBlock
			});
		
		$.when(gMap).then($.mobile.pageLoading(true));
	}
		
};



// ----------------------------- //
// Utility Methods
// ----------------------------- //
SCS.utilities = {

	// jsonp request from data.seattle.gov's SODA (socrata open data api)
	// request url should be in format of 'http://data.seattle.gov/api/views/[viewID]'
	// looks for column headers, then data for each row
	sodaJsonpRequest: function(url, maxResults, callback, scope){
		var self = this;
		
		// append '.json' to url for soda service to specify json format, requesting jsonp by adding '?jsonp=?' after that
		var columns = url + '/columns.json?jsonp=?',
			rows = sodaUrl = url + '/rows.json?max_rows=' + maxResults + '&jsonp=?',
			columnData = '',
			rowData = '',
			
			getColumnData =
				$.ajax({
				url: columns,
				dataType: 'json',
				success: function(data){
					columnData = data;
				},
				error: function(){
					columnData = false;
				}
			}),
			
			getRowData = 
			$.ajax({
				url: rows,
				dataType: 'json',
				success: function(data){
					rowData = data;
				},
				error: function(){
					rowData = false;
				}
			});
			
		$.when(getColumnData, getRowData).then(function(){
			callback.apply(scope, [columnData, rowData]);
		});
		
	},
	
	// returns current location (latitude/longitude) using html5 geolocation API
	getLocation: function(callback){
		var self = this;
		
		navigator.geolocation.getCurrentPosition(
			function (position) {
				var lat = position.coords.latitude,
					lon = position.coords.longitude;
				callback(lat, lon);
			},
			function () {
			callback(false, false);
			}
		);
	},
	
	// check if a network/service is reachable
	checkNetwork: function(domain, callback){
		var self = this;
		
		// if navigator.network is available, this is a native app implementation and should check for internet/network access
		if(navigator.network){
			navigator.network.isReachable(domain, isReachableCallback, {});
		
		// if navigator.network is not available, this is the web app implementation, and internet access is a given but check for service site availability
		}else{
			callback(true);
		}
		
		function isReachableCallback(reachability){
			// no consistency on the format returned for reachability cross-platform?
			var networkState = reachability.code || reachability;
			alert(reachability);
			if(networkState == NetworkStatus.NOT_REACHABLE){
				callback(false);
			}else{
				callback(true);
			}
		}
	}

};