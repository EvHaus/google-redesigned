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
/*globals chrome, GR*/

// Initialize Popup
chrome.tabs.getSelected(null, function (tab) {
	GR.renderPopup();
});