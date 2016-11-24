/*
 * Google Redesigned
 *
 * File: Utility Functions
 * Author: Evgueni Naverniouk, evgueni@globexdesigns.com
 * Copyright: 2013 Globex Designs, Inc. All Rights Reserved.
 *
 */

/*jslint browser: true, vars: true, plusplus: true, indent: 4, maxerr: 50*/
/*jshint expr: true, white: true*/
/*globals $, chrome*/

var utils = {
	// getExtensionVersion()
	// Returns the current extension version value
	getExtensionVersion: function (callback) {
		$.ajax({
			url: "/manifest.json",
			type: "get",
			success: function (text) {
				callback(JSON.parse(text).version);
			}
		});
	},

	// openURLInNewTab()
	// Opens a new Chrome tab to the given URL
	openURLInNewTab: function (url) {
		chrome.tabs.create({url: url});
	}
};