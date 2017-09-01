/*
 * Google Redesigned
 *
 * File: Extension Functions
 * Author: Evgueni Naverniouk, evgueni@globexdesigns.com
 * Copyright: 2017 Globex Designs, Inc. All Rights Reserved.
 *
 */

var browser = chrome || browser;
var browserName = window.navigator.appCodeName === 'Mozilla' ? 'firefox' : 'chrome';

var GR = {
	json_name:			'GoogleRedesigned',
	json_url:			'http://www.globexdesigns.com/products/gr/extension/styles',
	mode:				'stable',
	notificationTime:	3000,
	support_email:		'support@globexdesigns.com',
	updateInterval:		1800000,
	urlWelcome:			'http://www.globexdesigns.com/products/gr/?page=welcome',
	urlUpdate:			'http://www.globexdesigns.com/products/gr/changelogs.php',
	urlBugs:			'http://www.globexdesigns.com/bugtracker',
	urlDonate:			'http://www.globexdesigns.com/products/gr/donate.php',
	urlStyles:		{
		'Gmail Redesigned':		[new RegExp(/^http(s)?:\/\/mail\.google\.[a-z]+\//)],
		'Gcal Redesigned':		[new RegExp(/^http(s)?:\/\/(calendar|www)\.google\.[a-z]+\/calendar\//)],
		'Greader Redesigned':	[new RegExp(/^http(s)?:\/\/www\.google\.[a-z]+\/reader\//)],
		'Gdocs Redesigned':		[new RegExp(/^http(s)?:\/\/drive\.google\.[a-z]+\//)]
	},


	// readJSON()
	// Loads in the latest JSON file. If one is not available in
	// the storage DB, will read the default file on disk
	readJSON: function (callback) {
		var self = this;
		callback = callback || function () {};

		browser.storage.local.get(null, function (items) {
			if (items[self.json_name]) {
				callback(items[self.json_name]);
			} else {
				self.downloadJSON(function (GRJSON, err) {
					if (err) {
						callback(null, err);
						return;
					}

					self.setJSON(GRJSON);
					callback(GRJSON);
				});
			}
		});

		return;
	},


	// setJSON()
	// Replaces the existing JSON file with a new one
	setJSON: function (GRJSON, callback) {
		if (!GRJSON) return;
		callback = callback || function () {};

		var data = {};
		data[this.json_name] = GRJSON;

		browser.storage.local.set(data, function () {
			this.enableAllStyles(callback);
		}.bind(this));

		return;
	},


	// enableAllStyles()
	// Sets all styles to enabled if nothing has been setup yet
	enableAllStyles: function (callback) {
		var self = this;
		callback = callback || function () {};

		browser.storage.local.get(null, function (items) {
			// If no styles set as enabled - enable all
			if (items.enabled) {
				callback();
			} else {
				browser.storage.local.get(self.json_name, function (items) {
					var GRJSON = items[self.json_name],
						data = {'enabled': []};
					for (var i = 0, l = GRJSON.length; i < l; i++) {
						for (var s in GRJSON[i]) {
							if (s == 'images') continue;
							data.enabled.push(s);
						}
					}
					browser.storage.local.set(data, function () {
						callback();
					});
				});
			}
		});
	},


	// setStyle()
	// Saves a CSS string to the storage
	setStyle: function (style, css, callback) {
		callback = callback || function () {};
		var data = {};
		data[style] = css;
		browser.storage.local.set(data, function () {
			callback();
		});
	},


	// renderPopup()
	// Given the extension's JSON object, render the popup menu
	renderPopup: function () {
		var self = this,
			popup = $("#popup").html('<p class="loading">Loading styles...</p>'),
			style, i, l, d, li;

		this.readJSON(function (GRJSON, err) {
			if (err) {
				$("#popup").html('<p class="error">' + err + '</p>');
				return;
			}

			// Check options to ensure the right mode is set
			var settings = localStorage.settings ? JSON.parse(localStorage.settings) : {};
			if (settings.nightly === 'checked') {
				self.mode = "dev";
			}

			$("#popup").empty();

			// Check which styles are enabled
			browser.storage.local.get('enabled', function (data) {
				var enabled = data.enabled || null;

				// If no enabled data exists -- everything is enabled
				if (!enabled) {
					enabled = [];
					for (i = 0, l = GRJSON; i < l; i++) {
						style = GRJSON[i];
						for (var sname in style) {
							if (sname == 'images' || sname === null || sname === undefined) continue;
							enabled.push(sname);
						}
					}
				}

				// Styles
				for (i = 0, l = GRJSON.length; i < l; i++) {
					style = GRJSON[i];
					for (var name in style) {
						if (name == 'images') continue;
						d = style[name];
						li = $('<li>' + name + '</li>')
							.appendTo(popup)
							.attr('rel', name)
							.click(function () {
								self.toggleStyle($(this).attr('rel'));
							});

						if (enabled.indexOf(name) < 0) li.addClass('disabled');

						li.append('<span class="version">' + d[self.mode] + '</span>');
						li.append('<span class="icon"></span>');
					}
				}

				// Check for style updates
				$('<li class="checker">Check For Style Updates</li>').appendTo(popup)
					.click(function () {
						self.checkForStyleUpdates();
					});

				// Donate
				$('<li class="donate">Make A Donation</li>').appendTo(popup)
					.click(function () {
						browser.tabs.create({
							active: true,
							url: self.urlDonate
						});
					});

				// Submit Bug Report
				$('<li class="bugs">Submit Bug Report</li>').appendTo(popup)
					.click(function () {
						browser.tabs.create({
							active: true,
							url: self.urlBugs
						});
					});
			});
		});
	},


	// setBrowserIcon()
	// Change the browser's icon
	setBrowserIcon: function (type) {
		type = type || 'default';
		if (type == 'loading') {
			browser.browserAction.setIcon({"path": "img/icon-19-loading.gif"});
		} else {
			browser.browserAction.setIcon({"path": "img/icon-19.png"});
		}
	},


	// msg()
	// Displays a 3 second notification message
	msg: function (id, text) {
		id = id || "";

		browser.notifications.create(id, {
			iconUrl: browser.extension.getURL('img/icon-64.png'),
			message: text,
			title: "Google Redesigned",
			type: "basic"
		}, function (id) {
			setTimeout(function () {
				browser.notifications.clear(id);
			}, self.notificationTime);
		});
	},



	// toggleStyle()
	// Toggles an individual style
	toggleStyle: function (style) {
		var popupitem = $("#popup li[rel='" + style + "']").first();
		popupitem.toggleClass('disabled');

		var on = !popupitem.hasClass('disabled');

		browser.storage.local.get('enabled', function (data) {
			var enabled = [], s;
			for (var i = 0, l = data.enabled.length; i < l; i++) {
				s = data.enabled[i];
				if (s != style && s !== null && s !== undefined) enabled.push(s);
			}

			if (on && enabled.indexOf(style) < 0) {
				enabled.push(style);
			}

			browser.storage.local.set({'enabled': enabled}, function () {
				// Look through open tabs, and toggle the styling in them
				this.updateTabs("toggleStyle");
			}.bind(this));
		}.bind(this));
	},


	// downloadJSON()
	// Download the latest JSON file from the server
	downloadJSON: function (callback) {
		var jsontime = new Date().toJSON().replace(/[A-Z\-:\.]/g, "");
		var url = this.json_url + "?rel=" + browserName + "&amp;time=" + jsontime;
		$.ajax({
			url: url,
			type: "get",
			dataType: "text",
			success: function (GRJSON) {
				try {
					const parsedJSON = JSON.parse(GRJSON);
					callback(parsedJSON);
				} catch (err) {
					throw new Error(
						'Failed to parse response from ' + url + '. ' +
						'Response was: ' + GRJSON
					);
				}
			},
			error: function (xhr, text, err) {
				var msg = ['Google Redesigned was unable to download style data from our servers due to: '];
				if (xhr.status == 404) {
					msg.push('404 error. Unable to connect.');
				} else if (xhr.status == 408) {
					msg.push('408 timeout error. Unable to connect.');
				} else if (xhr.status == 504) {
					msg.push('504 timeout error. Server unavailable.');
				} else {
					callback(null, 'Google Redesigned was unable to download style data from our servers due to: ' + err);
				}

				callback(null, msg.join(''));
			}
		});
	},


	// checkForStyleUpdates()
	// Checks for style updates by downloading JSON data
	// from Google Redesigned server
	checkForStyleUpdates: function (callback, silent) {
		var self = this;
		silent = silent || false;
		callback = callback || function () {};

		if (!silent) {
			this.setBrowserIcon('loading');
		}

		// Check options to ensure the right mode is set
		var settings = localStorage.settings ? JSON.parse(localStorage.settings) : {};
		if (settings.nightly) {
			this.mode = "dev";
		}

		this.downloadJSON(function (GRJSON, err) {
			if (err) return;

			var remoteJSON = GRJSON;
			self.setBrowserIcon();

			// Compare versions
			self.readJSON(function (oldJSON, err) {
				if (err) return;

				var updates = self.compareStyles(oldJSON, remoteJSON);

				browser.storage.local.get(null, function (data) {
					// Check to see if anything has been downloaded yet
					var empty = false;
					remoteJSON.forEach(function (st) {
						for (var key in st) {
							if (key != 'images') {
								if (!data[key]) empty = true;
							}
						}
					});

					if (updates.length < 1 && self.mode != 'dev' && !empty) {
						if (!silent) {
							self.msg('check', 'No style updates found.');
						}
						callback();
					} else {
						if (self.mode == 'dev' || empty) {
							updates = [];
							for (var i = 0, l = remoteJSON.length; i < l; i++) {
								for (var key in remoteJSON[i]) {
									if (key == 'images') continue;
									updates.push(key);
								}
							}
						}

						self.setJSON(remoteJSON, function () {
							self.renderPopup();
							self.downloadStyles(updates, function () {
								if (!silent) {
									if (self.mode == 'dev') {
										self.msg('check', 'All styles have been synced.');
									} else {
										self.msg('check', 'New style updates have been installed for: ' + updates.join(', ') + '.');
									}
								}

								self.updateTabs("updateStyles");

								callback();
							});
						});
					}
				});
			});
		});
	},


	// compareStyles()
	// Compares version numbers between two JSON objects
	compareStyles: function (oldJSON, newJSON) {
		var newStyles = [];
		for (var i = 0, l = oldJSON.length; i < l; i++) {
			for (var key in oldJSON[i]) {
				if (key == 'images') continue;
				for (var j = 0, m = newJSON.length; j < m; j++) {
					for (var nkey in newJSON[j]) {
						if (key == nkey) {
							if (oldJSON[i][key][this.mode] != newJSON[j][nkey][this.mode]) {
								newStyles.push(key);
							}
						}
					}
				}
			}
		}
		return newStyles;
	},


	// downloadStyles()
	// Download CSS files from the data server
	downloadStyles: function (styles, callback) {
		var self = this;
		var gathered = 0;
		var gather = function () {
			gathered++;
			if (gathered == styles.length) {
				callback();
			}
		};

		this.readJSON(function (GRJSON, err) {
			if (err) return;
			for (var i = 0, l = GRJSON.length; i < l; i++) {
				for (var style in GRJSON[i]) {
					if (styles.indexOf(style) >= 0) {
						const s = GRJSON[i][style];
						const baseUrl = self.mode === 'dev' ? s.dev_url : s.url;
						const url = `${baseUrl}${s.css}_${s[self.mode]}.css?rel=${browserName}`;

						var getEr = function (url, style) {
							$.ajax({
								url: url,
								method: 'get',
								success: function (css) {
									// Strip the -moz-document from the style
									css = css.replace(/@-moz-document(.*?){/, "");
									css = css.substring(0, css.length - 1);

									// Point insecure URLs to local image pack
									css = css.replace(/http:\/\/[a-zA-Z0-9.-]+\.amazonaws\.com\/img\/2\.0\.0\//gi, browser.extension.getURL('image-pack') + '/');

									self.setStyle(style, css, function () {
										gather();
									});
								},
								error: function (xhr, text, err) {
									//console.error(err);
								}
							});
						};

						getEr(url, style);
					}
				}
			}
		});
	},


	// getStyleFromURL
	// Given a URL returns the style that shuold be loaded
	getStyleFromURL: function (url) {
		if (!url) return null;
		for (var style in this.urlStyles) {
			var regexps = this.urlStyles[style];
			for (var i = 0, l = regexps.length; i < l; i++) {
				if (url.match(regexps[i])) {
					return style;
				}
			}
		}
	},


	// loadStyles()
	// Given an array of styles, load them (if they're not disabled)
	loadStyles: function (style, tab, callback) {
		tab = tab || null;

		// Skip if disabled
		browser.storage.local.get(null, function (items) {
			// On install, this sometimes get fired prematurely. Suppress it
			// if nothing has been enabled yet
			if (!items.enabled) {
				callback(null);
				return;
			}

			var enabled = false;
			for (var i = 0, l = items.enabled.length; i < l; i++) {
				if (style == items.enabled[i]) enabled = true;
			}

			if (enabled) {
				var css = items[style];
				return callback(css);
				/*
				Unfortunately, insertCSS limits the allowed code and truncates
				the CSS data - making it corrupted.

				browser.tabs.insertCSS(tab.id, {
					allFrames: true,
					code: css,
					runAt: "document_start"
				})
				*/
			} else {
				callback(null);
			}

			return null;
		});
	},


	// updateTabs()
	// Scans the open tabs and updates the styles from the JSON
	//
	// @param	requestName		string		"updateStyles" or "toggleStyle"
	//
	updateTabs: function (requestName) {
		var self = this;
		browser.tabs.query({}, function (tabs) {
			tabs.forEach(function (tab) {
				var style = self.getStyleFromURL(tab.url);
				if (!style) return;
				GR.loadStyles(style, tab, function (css) {
					browser.tabs.sendMessage(tab.id, {name: requestName, css: css});
				});
			});
		});
	}
};
