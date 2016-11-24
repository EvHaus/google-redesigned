/*
 * Google Redesigned
 *
 * File: Background Functions
 * Author: Evgueni Naverniouk, evgueni@globexdesigns.com
 * Copyright: 2013 Globex Designs, Inc. All Rights Reserved.
 *
 */

/*jslint browser: true, vars: true, plusplus: true, indent: 4, maxerr: 50*/
/*jshint expr: true, white: true*/
/*globals $, chrome*/

var applyCSS = function (css) {
	var style = document.createElement("style");
	style.setAttribute("type", "text/css");
	style.setAttribute("id", "googleredesignedcss");
	style.appendChild(document.createTextNode(css));
	document.documentElement.appendChild(style);
};

var removeCSS = function () {
	var style = $('#googleredesignedcss');
	style.remove();
};

// When any tab is loaded will send request to extension
chrome.extension.sendRequest({name: "loadStyles"}, function (response) {
	applyCSS(response);
});

// When a style is toggled via the popup, or on update check
chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.name == 'toggleStyle') {
		if (request.css) {
			applyCSS(request.css);
		} else {
			removeCSS();
		}
	} else if (request.name == 'updateStyles') {
		removeCSS();
		applyCSS(request.css);
	}
});