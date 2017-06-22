/*
 * Google Redesigned
 *
 * File: Utility Functions
 * Author: Evgueni Naverniouk, evgueni@globexdesigns.com
 * Copyright: 2017 Globex Designs, Inc. All Rights Reserved.
 *
 */

var browser = chrome || browser;

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
		browser.tabs.create({url: url});
	}
};