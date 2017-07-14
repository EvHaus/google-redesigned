/*
 * Google Redesigned
 *
 * File: Extension Options
 * Author: Evgueni Naverniouk, evgueni@globexdesigns.com
 * Copyright: 2017 Globex Designs, Inc. All Rights Reserved.
 *
 */

var save = function (settings) {
	localStorage.settings = JSON.stringify(settings);
};

var get = function () {
	if (localStorage.settings) {
		return JSON.parse(localStorage.settings);
	}
	return {};
};

document.onload = function () {
	var settings = get();

	// On Change
	var nightly = document.getElementById('#googleredesigned-nightly');
	nightly.addEventListener('change', function () {
		if (nightly.getAttribute('checked')) {
			settings.nightly = 'checked';
		} else {
			settings.nightly = null;
		}

		var notices = document.getElementsByClassName('notice');

		if (notices.length === 0 && settings.nightly) {
			var msg = [
				'Nightly development versions are now enabled.',
				'Please note that nightly versions may be incomplete, partially unstyled and are ',
				'completely unsupported. Use at your own risk. You will need to manually click on ',
				'"Check For Style Updates" to download the latest nightly updates.'
			];

			var notice = document.createElement('div');
			notice.className = "notice";
			notice.innerHTML = msg.join(' ');
			nightly.parentNode.appendChild(notice);
		} else {
			notices.forEach(function (notice) {
				notice.remove();
			});
		}

		save(settings);
	});


	// Set current values
	if (!localStorage.settings) {
		save({});
	} else {
		if (settings.nightly) {
			nightly.setAttribute('checked', 'checked');
		}
	}
};