**THIS EXTENSION IS NOW DEPRECATED. SEE: https://www.globexdesigns.com/blog/43-browser-extension-is-being-deprecated**

# Google Redesigned

**A complete redesign of popular Google services, Google Redesigned changes the appearance of popular Google services.**

This repository holds the code for the Google Redesigned browser extension. Code is written in the standard [extension API](https://developer.mozilla.org/en-US/Add-ons/WebExtensions) to maintain support for *Google Chrome* and *Mozilla Firefox*.

## [Browser Support](#browser-support)

- Firefox 45 and greater
- Chrome 38 and greater

## [How to Run](#how-to-run)

### Firefox

- Run Firefox
- Go to `about:debugging`
- Click on "Load Temporary Add-on", then select any file this repository's directory
- Use the "Reload" button on that page to reload the extension after any code change

### Chrome

- Run Chrome
- Go to `chrome://extensions/` and enable the "Developer mode" checkbox in the top-right corner
- Click on "Load unpackaged extension...", the select this repository's directory

## [How to Publish](#how-to-publish)

- Make sure to version up the extension in `manifest.json` first
- Then deploy follow browser-specific instructions below:

### Firefox / Chrome

- Open the root of the extension
- Select all files and choose "Send to" > "Compressed (zipped) folder"
- Upload the generated `.zip` file to `addons.mozilla.org` and `chrome.google.com/webstore`
