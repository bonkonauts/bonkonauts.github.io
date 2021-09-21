/**
 * @class AlertEmitterComponent
 * @classdesc Class to handle emission of alerts to the client.
 */
class AlertEmitterComponent {
	constructor() {}

	/**
	 * Construct a fresh alert DOM element.
	 * @memberof AlertEmitterComponent
	 * @param {String} type    - The type of alert to be constructed.
	 * @param {String} message - The message to be displayed.
	 * @return {HTMLElement} Alert DOM element.
	 */
	constructAlert(type, message) {
		var alert = document.createElement('alert');
		alert.className = type;
		// alert.innerHTML = `<strong>${type}!</strong> ${message}`;
		alert.innerHTML = `${message}`;
		 
		var dismiss = document.createElement('i');
			dismiss.classList = "dismiss fas fa-times";
		dismiss.setAttribute("onclick", "AlertEmitter.handleDismiss(this.parentNode);")
		alert.appendChild(dismiss);
		return alert;
	}

	/**
	 * Handler for if the dismiss button of an alert is clicked. Will close the alert accordingly.
	 * @memberof AlertEmitterComponent
	 * @param {HTMLElement} alert 
	 * @return {undefined}
	 */
	handleDismiss(alert) {
		alert.classList.add('dismiss');
		setTimeout(() => {
			try {
				document.querySelector('container.alerts').removeChild(alert);
			}
			catch(e) {}
		}, 300);
	}

	/**
	 * "Emits" the alert to the alerts, displaying it on the users screen.
	 * @memberof AlertEmitterComponent
	 * @param {String} type   		   - Type of alert to be constructed.
	 * @param {String} message  	   - Message to be displayed.
	 * @param {Number} [timeout=7]   - If and when the alert should be dismissed automatically (in seconds).
	 * @param {Boolean} [prepend=true] - Whether the alert should prepended or appended.
	 * @return {undefined}
	 */
	emit(type, message, timeout=7, prepend=true) {
		type = type.toLowerCase();
		
		switch(type) {
			case "success":
			case "error":
			case "warning":
			case "info":
			break;
			default:
				type = null;
				message = null;
			break;
		}
		if(!type || !message) return;
		type = this.capitalize(type); message = this.capitalize(message);

		var alert = this.constructAlert(type, message);

		if(timeout >= 0) {
			setTimeout(() => {
				this.handleDismiss(alert);
			}, timeout*1000)
		}

		prepend  && this.prepend(alert);
		!prepend && this.append(alert);
	}

	/**
	 * Appends the given alert element to the alert container.
	 * @memberof AlertEmitterComponent
	 * @param {HTMLElement} alert 
	 * @return {undefined}
	 */
	append(alert) {
		document.querySelector('container.alerts').append(alert);
		setTimeout(() => {
			alert.classList.add('ready')
		}, 50);
	}

	/**
	 * Prepends the given alert element to the alert container.
	 * @memberof AlertEmitterComponent
	 * @param {HTMLElement} alert 
	 * @return {undefined}
	 */
	prepend(alert) {
		document.querySelector('container.alerts').prepend(alert);
		setTimeout(() => {
			alert.classList.add('ready')
		}, 50);
		
	}

	/**
	 * Takes a string and capitalizes the first character.
	 * @memberof AlertEmitterComponent
	 * @param {String} str - String that needs capitlization
	 * @return {String} New string with first character capitalized
	 */
	capitalize(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}
}