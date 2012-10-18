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
    'routes/app-router'
], function($, _, Backbone, Router){
    
	var app = {

		init: function(){

			// routers
			this.router = new Router();
			Backbone.history.start();
        }

	};

    return app;

});