/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Todo Model
	// ----------

	// Our basic **Todo** model has `title`, `order`, and `completed` attributes.
	app.Todo = Backbone.Model.extend({
		// Default attributes for the lap
		// and ensure that each todo created has `title` and `completed` keys.
		defaults: {
			time: 0,
			completed: false
		}
	});
})();
