'use strict';

/*global define: true */

/**
 *	MAIN APP ROUTER
 *
 *	@description router for backbone app; handles user navigation through panels
 *
 *	@author CM
 */

define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone){
	var AppRouter = Backbone.Router.extend({

		routes: {
		  '': 'showHome',
		  'crime-list': 'showCrimeList'
		},

		initialize: function(){
			console.log('init');

			this.pageHistory = []; // store page history to determine left/right panel action
			this.currentPage = null;
		},

		showHome: function(){
			console.log('showing home');
		},

		showCrimeList: function(){
			console.log('showing crimes');
		},

		defaultAction: function(){

		},

		/**
		 * page slide action, determines if pages should slide left or right
		 * borrowed from https://github.com/ccoenraets/backbone-directory/blob/master/iphone/js/app.js
		 * @param  {object} page [backbone view of page]
		 */
		slidePage: function(page) {
			var slideFrom,
				self = this;

			if (!this.currentPage) {
				// If there is no current page (app just started) -> No transition: Position new page in the view port
				$(page.el).attr('class', 'page stageCenter');
				$('#content').append(page.el);
				this.pageHistory = [window.location.hash];
				this.currentPage = page;
				return;
			}

			// Cleaning up: remove old pages that were moved out of the viewport
			$('.stageRight, .stageLeft').not('#searchPage').remove();

			if (page === this.homePage) {
				// Always apply a Back (slide from left) transition when we go back to the home page
				slideFrom = 'left';
				$(page.el).attr('class', 'page stageLeft');
				this.pageHistory = [window.location.hash];

			} else if (this.pageHistory.length > 1 && window.location.hash === this.pageHistory[this.pageHistory.length - 2]) {
				// The new page is the same as the previous page -> Back transition
				slideFrom = 'left';
				$(page.el).attr('class', 'page stageLeft');
				this.pageHistory.pop();

			} else {
				// Forward transition (slide from right)
				slideFrom = 'right';
				$(page.el).attr('class', 'page stageRight');
				this.pageHistory.push(window.location.hash);
			}

			$('#content').append(page.el);

			// Wait until the new page has been added to the DOM...
			setTimeout(function() {
				// Slide out the current page: If new page slides from the right -> slide current page to the left, and vice versa
				$(self.currentPage.el).attr('class', 'page transition ' + (slideFrom === 'right' ? 'stageLeft' : 'stageRight'));
				// Slide in the new page
				$(page.el).attr('class', 'page stageCenter transition');
				self.currentPage = page;
			});

		}

	});

	return AppRouter;

});