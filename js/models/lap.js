/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Lap Model
	// ----------

	// Our basic **Lap** model has `title`, `order`, and `completed` attributes.
	app.Lap = Backbone.Model.extend({
		// Default attributes for the lap
		// and ensure that each todo created has `title` and `completed` keys.
		defaults: {
			time: 0,
			completed: false
		}
	});
})();
