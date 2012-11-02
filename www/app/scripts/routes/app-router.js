'use strict';

/*global define: true */

/**
 *	MAIN APP ROUTER
 *
 *	@description router for backbone app; handles user navigation through panels
 *
 */

define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone){
	var AppRouter = Backbone.Router.extend({

		routes: {
		  '': 'showHome',
		  'crime-list': 'showCrimeList',
		  'crime/:id': 'showCrimeDetail',
		  'about': 'showAbout'
		},

		initialize: function(){

			this.pageHistory = []; // store page history to determine left/right panel action
			this.currentPage = null;
			this.homePage = '#pageHome';
			this.aboutPage = '#pageAbout';
			this.crimeList = '#pageCrimeList';
			this.crimeMap = '#pageCrimeMap';

			_.extend(this, Backbone.Events);
		},

		showHome: function(){
			this.slidePage(this.homePage);
		},

		showCrimeList: function(){
			this.trigger('viewChange:crimeList');
			this.slidePage(this.crimeList);
		},

		showCrimeDetail: function(id){
			this.trigger('viewChange:crimeDetail', id);
			this.slidePage(this.crimeMap);
		},

		showAbout: function(){
			this.slidePage(this.aboutPage);
		},

		/**
		 * page slide action, determines if pages should slide left or right
		 * borrowed from https://github.com/ccoenraets/backbone-directory/blob/master/iphone/js/app.js
		 * @param  {object} page [backbone view of page]
		 */
		slidePage: function(page) {
			var pageEl = $(page),
				slideFrom;

			if (!this.currentPage) {
				// If there is no current page (app just started) -> No transition: Position new page in the view port
				pageEl.attr('class', 'page stageCenter');
				this.pageHistory = [window.location.hash];
				this.currentPage = page;
				return;
			}

			// Cleaning up: remove classes from pages that were moved out of the viewport
			$('.stageRight, .stageLeft').removeClass('.stageLeft, .stageRight, .stageCenter');

			if (page === this.homePage) {
				// Always apply a Back (slide from left) transition when we go back to the home page
				slideFrom = 'left';
				pageEl.attr('class', 'page stageLeft');
				this.pageHistory = [window.location.hash];

			} else if (this.pageHistory.length > 1 && window.location.hash === this.pageHistory[this.pageHistory.length - 2]) {
				// The new page is the same as the previous page -> Back transition
				slideFrom = 'left';
				pageEl.attr('class', 'page stageLeft');
				this.pageHistory.pop();

			} else {
				// Forward transition (slide from right)
				slideFrom = 'right';
				pageEl.attr('class', 'page stageRight');
				this.pageHistory.push(window.location.hash);
			}

			// Slide out the current page: If new page slides from the right -> slide current page to the left, and vice versa
			$(this.currentPage).attr('class', 'page transition ' + (slideFrom === 'right' ? 'stageLeft' : 'stageRight'));
			// Slide in the new page
			pageEl.attr('class', 'page stageCenter transition');
			this.currentPage = page;
		}

	});

	return AppRouter;

});