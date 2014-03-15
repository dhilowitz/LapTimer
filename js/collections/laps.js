/*global Backbone */
var app = app || {};

(function () {
	'use strict';

	// Lap Collection
	// ---------------

	// The collection of todos is backed by *localStorage* instead of a remote
	// server.
	var Laps = Backbone.Collection.extend({
		// Reference to this collection's model.
		model: app.Lap,

		// Save all of the todo items under the `"todos"` namespace.
		localStorage: new Backbone.LocalStorage('laptimer'),

		// Filter down the list of all todo items that are finished.
		completed: function () {
			return this.filter(function (todo) {
				return todo.get('completed');
			});
		},

		// Filter down the list to only todo items that are still not finished.
		remaining: function () {
			return this.without.apply(this, this.completed());
		},

		totalTime: function() {
			var total = 0; 
			this.each(function(lap) {total = total + parseFloat(lap.get('time'));} );
			return total;
		},

		graphData: function() {
			var res = [];
			var i = 0; 
			this.each(function(lap) {
				res.push([i, parseFloat(lap.get('time')/1000.0)]);
				i++;
			});
			return res;
		},

		// Filter down the list to only todo items that are still not finished.
		average: function () {
			return this.totalTime() / this.size();
		},

		// We keep the Laps in sequential order, despite being saved by unordered
		// GUID in the database. This generates the next order number for new items.
		nextOrder: function () {
			if (!this.length) {
				return 1;
			}
			return this.last().get('order') + 1;
		},

		// Laps are sorted by their original insertion order.
		comparator: function (todo) {
			return this.size() - todo.get('order');
		}
	});

	// Create our global collection of **Laps**.
	app.todos = new Laps();
})();
