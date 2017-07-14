/*
 * Google Redesigned
 *
 * File: Extension Popup
 * Author: Evgueni Naverniouk, evgueni@globexdesigns.com
 * Copyright: 2017 Globex Designs, Inc. All Rights Reserved.
 *
 */

class Popup extends React.Component {
	constructor (props) {
		super(props);

		this.state = {
			data: null,
			enabled: [],
			error: null
		};

		// Bind handlers
		this._handleJSONLoad = this._handleJSONLoad.bind(this);
		this._handleEnabledLoad = this._handleEnabledLoad.bind(this);
	}

	componentDidMount () {
		const {getJSON, getLocal} = this.props;

		// Load the styles JSON
		getJSON(this._handleJSONLoad);

		// Get local style settings
		getLocal.get('enabled', this._handleEnabledLoad);
	}

	render () {
		const {
			data,
			enabled,
			error
		} = this.state;

		if (error) return this._renderError();
		if (!data) return this._renderEmpty();

		console.log(data, enabled);

		return React.createElement('ul', {
			id: 'popup'
		}, this._renderListItems());
	}

	_renderError () {
		return React.createElement('p', {
			className: 'error'
		}, this.state.error)
	}

	_renderEmpty () {
		return React.createElement('p', {
			className: 'loading'
		}, 'Loading styles...')
	}

	_renderListItems () {
		const {enabled, data} = this.state;
		const {checkForStyleUpdates, mode, toggleStyle, urlBugs, urlDonate} = this.props;
		const items = [];

		// Styles
		for (let i = 0, l = data.length; i < l; i++) {
			let style = data[i];
			for (var name in style) {
				if (name == 'images') continue;
				items.push(
					React.createElement('li', {
						className: enabled.indexOf(name) < 0 ? 'disabled' : null,
						onClick: () => toggleStyle(name)
					}, [
						name,
						React.createElement('span', {className: 'version'}, style[name][mode]),
						React.createElement('span', {className: 'icon'})
					])
				);
			}
		}

		// Check for style updates
		items.push(
			React.createElement('li', {
				className: 'checker',
				onClick: () => checkForStyleUpdates()
			}, 'Check For Style Updates')
		);

		// Donate
		items.push(
			React.createElement('li', {
				className: 'donate',
				onClick () {
					browser.tabs.create({
						active: true,
						url: urlDonate
					});
				}
			}, 'Make A Donation')
		);

		// Submit Bug Report
		items.push(
			React.createElement('li', {
				className: 'bugs',
				onClick () {
					browser.tabs.create({
						active: true,
						url: urlBugs
					});
				}
			}, 'Submit Bug Report')
		);

		return items;
	}

	_handleJSONLoad (data, err) {
		if (err) {
			this.setState({error: err});
			return;
		}

		this.setState({data});
	}

	_handleEnabledLoad (data) {
		let enabled = data.enabled || null;

		this.setState({enabled});
	}
}

Popup.propTypes = {
	checkForStyleUpdates: React.PropTypes.func.isRequired,
	getJSON: React.PropTypes.func.isRequired,
	getLocal: React.PropTypes.func.isRequired,
	mode: React.PropTypes.oneOf(['stable', 'dev']).isRequired,
	settings: React.PropTypes.shape({
		nightly: React.PropTypes.oneOf(['checked'])
	}).isRequired,
	toggleStyle: React.PropTypes.func.isRequired,
	urlBugs: React.PropTypes.string.isRequired,
	urlDonate: React.PropTypes.string.isRequired
}

// Initialize Popup
GR.renderPopup(Popup);