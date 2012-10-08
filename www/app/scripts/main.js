'use strict';

/**
 *	APP BOOTSTRAP
 *
 *	@description bootstrap for main app - require.js main app file and inits main app controller
 *
 *	@author CM
 *	@version 0.0.0
 *	@requires
 *		- require.js
 *		- app.js
 */

require.config({
  shim: {
  },

paths: {
    backbone: '../../components/backbone/backbone',
    underscore: '../../components/underscore/underscore',

    jquery: 'vendor/jquery.min'
  }
});
 
require(['app'], function(app) {
	app.init();
});