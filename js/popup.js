var browser = chrome || browser;

document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('link').addEventListener("click", function () {
		browser.tabs.create({
			url: "https://www.globexdesigns.com/blog/43-browser-extension-is-being-deprecated"
		});
	});
});
