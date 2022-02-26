class TopNavComponent {
	constructor() {
		this.component = document.createElement('section');
		this.component.className = 'topnav';
		this.buildComponent();
	}

	buildComponent() {
		var userValid = window.user && window.user.username ? window.user.username : undefined;
		var path = window.location.pathname.slice(1);
		path = path == '' ? 'about/' : path;
		path = path.slice(0, path.length - 1);

		this.component.innerHTML = `
			<div class="logo">
				${window.siteName}
			</div>
			<wrapper>
				<span id="title">
					${this.capitalize(path)}
				</span>
				${typeof userValid != 'undefined' ? `
				<div id="subtitle">
					<li>${userValid}</li>
				</div>
				` : ``}
				
			</wrapper>
		`;
	}

	capitalize(str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	}

	appendTo(container) {
		container.append(this.component);
	}

	prependTo(container) {
		container.prepend(this.component);
	}
}
