/*global $ */
/*jshint unused:false */
var app = app || {};
var ENTER_KEY = 13;

jQuery.fn.extend({
    disable: function(state) {
        return this.each(function() {
            this.disabled = state;
        });
    }
});

function timeFormat(ms) {
	ms = ms.toFixed(0);

	var seconds = parseInt(ms / 1000);
	var hh = Math.floor(seconds / 3600);
	var mm = Math.floor((seconds - (hh * 3600)) / 60);
	var ss = seconds - (hh * 3600) - (mm * 60);
	var ms = ms - (ss * 1000) - (mm * 60 * 1000) - (hh * 60 * 60 * 1000);

	if(ms > 0) {
		ms = String(ms + "000").slice(0,3);
	}

	if(hh > 0) {
		if (mm < 10) {mm = '0' + mm;}
		if (ss < 10) {ss = '0' + ss;}

		return hh + ':' + mm + ':' + ss + '.' + ms;
	} else if (mm > 0) {
		if (ss < 10) {ss = '0' + ss;}

		return mm + ':' + ss + '.' + ms;
	} else {
		return ss + '.' + ms;
	}
}

$(function () {
	'use strict';

	// kick things off by creating the `App`
	new app.AppView();
});
