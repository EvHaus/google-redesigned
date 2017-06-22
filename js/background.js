/*
 * Google Redesigned
 *
 * File: Background Functions
 * Author: Evgueni Naverniouk, evgueni@globexdesigns.com
 * Copyright: 2017 Globex Designs, Inc. All Rights Reserved.
 *
 */

var browser = chrome || browser;

// Check for first install or update
utils.getExtensionVersion(function (version) {
	var prevVersion = localStorage.version ? localStorage.version : null;
	if (version != prevVersion) {
		localStorage.version = version;
		if (typeof prevVersion == 'undefined') {
			// On Extension Install
			utils.openURLInNewTab(GR.urlWelcome);
		} else {
			// On Extension Update
			utils.openURLInNewTab(GR.urlUpdate);
		}
	}
});


// Check for style updates every 30 minutes
var timedCheckForUpdates = function () {
	setTimeout(function () {
		GR.checkForStyleUpdates(function () {
			timedCheckForUpdates();
		}, true);
	}, GR.updateInterval);
};

// Check for updates onload
browser.storage.local.remove('GoogleRedesigned');
GR.checkForStyleUpdates(function () {
	timedCheckForUpdates();
}, true);

// Listen for events from apply.js
browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.name == 'loadStyles') {
		var style = GR.getStyleFromURL(sender.tab.url);
		GR.loadStyles(style, sender.tab, function (css) {
			sendResponse(css);
		});
	}

	return true;
});