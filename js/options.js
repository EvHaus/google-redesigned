/*
 * Google Redesigned
 *
 * File: Extension Options
 * Author: Evgueni Naverniouk, evgueni@globexdesigns.com
 * Copyright: 2013 Globex Designs, Inc. All Rights Reserved.
 *
 */

/*jslint browser: true, vars: true, plusplus: true, indent: 4, maxerr: 50*/
/*jshint expr: true, white: true*/
/*globals $*/

var save = function (settings) {
	localStorage.settings = JSON.stringify(settings);
};

var get = function () {
	if (localStorage.settings) {
		return JSON.parse(localStorage.settings);
	}
	return {};
};

$(document).ready(function () {
	var settings = get();

	// On Change
	var nightly = $('#googleredesigned-nightly');
	nightly.change(function () {
		if ($(this).attr('checked')) {
			settings.nightly = 'checked';
		} else {
			settings.nightly = null;
		}

		if ($('.notice').length === 0 && settings.nightly) {
			var msg = [
				'Nightly development versions are now enabled.',
				'Please note that nightly versions may be incomplete, partially unstyled and are ',
				'completely unsupported. Use at your own risk. You will need to manually click on ',
				'"Check For Style Updates" to download the latest nightly updates.'
			];

			$('<div class="notice">' + msg.join(' ') + '</div>').appendTo(nightly.parent());
		} else {
			$('.notice').remove();
		}

		save(settings);
	});


	// Set current values
	if (!localStorage.settings) {
		save({});
	} else {
		if (settings.nightly) {
			nightly.attr('checked', 'checked');
		}
	}
});