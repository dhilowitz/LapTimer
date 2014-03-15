/*global Backbone, jQuery, _, ENTER_KEY */
var app = app || {};

(function ($) {
	'use strict';

	// The Application
	// ---------------

	// Our overall **AppView** is the top-level piece of UI.
	app.AppView = Backbone.View.extend({

		// Instead of generating a new element, bind to the existing skeleton of
		// the App already present in the HTML.
		el: '#todoapp',

		// Our template for the line of statistics at the bottom of the app.
		statsTemplate: _.template($('#stats-template').html()),
		timeTemplate: _.template($('#time-template').html()),

		// Delegated events for creating new items, and clearing completed ones.
		events: {
			'click #start-button': 'startStopTimer',
			'click #reset-button': 'clearCompleted',
			'click #lap-button': 'nextLap',
			'click #clear-completed': 'clearCompleted',
		},

		// At initialization we bind to the relevant events on the `Laps`
		// collection, when items are added or changed. Kick things off by
		// loading any preexisting todos that might be saved in *localStorage*.
		initialize: function () {
			this.$startButton = this.$('#start-button');
			this.$lapButton = this.$('#lap-button');
			this.$lapButton.hide();
			this.$resetButton = this.$('#reset-button');
			this.$footer = this.$('#footer');
			this.$time = this.$('#time');
			this.$main = this.$('#main');
			this.intervalID = null;

			this.data = [];

			this.plot = $.plot("#plot", [ this.getGraphData() ], {
				series: {
					shadowSize: 0	// Drawing is faster without shadows
				},
				yaxis: {
					min: 0
					// max: 100
				},
				xaxis: {
					show: false
				}
			});

			this.listenTo(app.laps, 'add', this.addOne);
			this.listenTo(app.laps, 'reset', this.addAll);
			this.listenTo(app.laps, 'change:completed', this.filterOne);
			this.listenTo(app.laps, 'filter', this.filterAll);
			this.listenTo(app.laps, 'all', this.render);

			app.laps.fetch();

		},

		// Re-rendering the App just means refreshing the statistics -- the rest
		// of the app doesn't change.
		render: function () {
			var completed = app.laps.completed().length;
			var remaining = app.laps.size();
			var average = timeFormat(app.laps.average());
			var totalTime = timeFormat(app.laps.totalTime());
			var lapTime = timeFormat(this.currentLapTime());

			this.$time.html(this.timeTemplate({
				totalTime: totalTime,
				lapTime: lapTime
			}));

			if (app.laps.length) {
				this.$main.show();
				this.$footer.show();


				this.$footer.html(this.statsTemplate({
					completed: completed,
					remaining: remaining,
					average: average
				}));

				this.$('#filters li a')
					.removeClass('selected')
					.filter('[href="#/' + (app.LapFilter || '') + '"]')
					.addClass('selected');
			} else {
				this.$main.hide();
				this.$footer.hide();
			}

			this.plot.setData([this.getGraphData()]);

			// Since the axes don't change, we don't need to call 
			this.plot.setupGrid()

			this.plot.draw();
		},

		// Add a single todo item to the list by creating a view for it, and
		// appending its element to the `<ul>`.
		addOne: function (todo) {
			var view = new app.LapView({ model: todo });
			$('#todo-list').prepend(view.render().el);
		},

		// Add all items in the **Laps** collection at once.
		addAll: function () {
			this.$('#todo-list').html('');
			app.laps.each(this.addOne, this);
		},

		filterOne: function (todo) {
			todo.trigger('visible');
		},

		filterAll: function () {
			app.laps.each(this.filterOne, this);
		},

		// Generate the attributes for a new Lap item.
		newAttributes: function () {
			return {
				time: 0,
				order: app.laps.nextOrder(),
				completed: false
			};
		},

		getGraphData:function() {
			return app.laps.graphData();
		},


		// If you hit start in the main input field, create new **Lap** model,
		// persisting it to *localStorage*.
		startStopTimer: function (e) {
			if(!this.timerRunning) {
				this.startTimer();
				this.$startButton.html("Stop");
				this.$lapButton.show();
			} else {
				this.stopTimer();
				this.$startButton.html("Start");
				this.$lapButton.hide();
			}
		},

		startTimer: function (e) {
			console.log("Start Timer");

			var d = new Date();
			this.timerStarted = this.lapStarted = d.getTime();

			this.currentLapModel = app.laps.create(this.newAttributes());

			if(!this.intervalID) {
				(function(view) {
				  view.intervalID = window.setInterval(function() { view.updateCurrentLapTime(); }, 113);
				})(this);
			}

			this.timerRunning = true;
		},

		stopTimer: function (e) {
			console.log("Stop Timer");

			//Set current lap to completed
			this.currentLapModel.set('completed', true);
			this.currentLapModel.save();

			window.clearInterval(this.intervalID);
			this.intervalID = null;

			var d = new Date();
			this.timerStarted = this.lapStarted = 0;
			this.currentLapModel = null;
			this.timerRunning = false;
		},

		currentLapTime: function() {
			if(!this.lapStarted)
				return 0;

			var d = new Date();
			return (d.getTime() - this.lapStarted);
		},

		updateCurrentLapTime: function() {
			// this.currentLapModel.set('time', this.currentLapTime())
			return this.currentLapModel.set('time', this.currentLapTime());
		},

		// If you hit start in the main input field, create new **Lap** model,
		// persisting it to *localStorage*.
		nextLap: function (e) {
			if(!this.timerRunning) 
				return;

			console.log("New Lap");

			//Set current lap to completed
			this.currentLapModel.set('completed', true);
			this.currentLapModel.save();

			//Reset the this.lapStarted variable
			var d = new Date();
			this.lapStarted = d.getTime();

			//Make new lap
			this.currentLapModel = app.laps.create(this.newAttributes());

		},

		// Clear all completed todo items, destroying their models.
		clearCompleted: function () {
			_.invoke(app.laps.completed(), 'destroy');
			return false;
		}
	});
})(jQuery);
