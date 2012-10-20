'use strict';

/*global define: true */

/**
 *	MAIN APP CONTROLLER
 *
 *	@description inits main components of backbone app
 *
 *	@author CM
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'views/home-page-view',
    'routes/app-router'
], function($, _, Backbone, HomePage, Router){
    
	var app = {

		init: function(){

			// views
			this.homePage = new HomePage();

			// routers
			this.router = new Router();
			Backbone.history.start();
        }

	};

    return app;

});