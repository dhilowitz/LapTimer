/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Lap Router
	// ----------
	var LapRouter = Backbone.Router.extend({
		routes: {
			'*filter': 'setFilter'
		},

		setFilter: function (param) {
			// Set the current filter to be used
			app.LapFilter = param || '';

			// Trigger a collection filter event, causing hiding/unhiding
			// of Lap view items
			app.todos.trigger('filter');
		}
	});

	app.LapRouter = new LapRouter();
	Backbone.history.start();
})();
