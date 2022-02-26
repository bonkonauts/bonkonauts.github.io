class SideNavComponent {
	constructor(path="") {
		this.component = document.createElement('section');
		this.component.className = 'sidenav';
		this.buildComponent(path);
	}

	buildComponent(pathOverride="") {
		var userValid = window.user && window.user.username ? window.user.username : undefined;
		var path = window.location.pathname;

		path = pathOverride != "" ? `/${pathOverride}` : path;
		path = path.slice(0, path.length - 1);

		this.addTab({currentPath: path, icon: 'fa-solid fa-circle-info', text: 'About', pathOverride: ''});
		this.addTab({currentPath: path, icon: 'fas fa-calculator', text: 'Calculators'});
		this.addTab({currentPath: path, icon: 'fas fa-star', text: 'Experience'});
		this.addTab({currentPath: path, icon: 'fas fa-user-circle', text: 'Avatars'});
		this.addTab({currentPath: path, icon: 'fas fa-users', text: 'Friends'});
		this.addTab({currentPath: path, icon: 'fas fa-table', text: 'Maps'});
		// this.addTab({currentPath: path, icon: 'fas fa-trophy', text: 'Leaderboard'});
		this.addTab({currentPath: path, icon: 'fas fa-sync-alt', text: 'Reload', additionalClass: 'rotate', onClick: runReload});
		this.addTab({currentPath: path, icon: `fas fa-sign-${typeof userValid != 'undefined' ? 'out' : 'in'}`, text: typeof userValid != 'undefined' ? 'Logout' : "Login", pathOverride: '/login'});
	}

	addTab(options={currentPath: "", icon: "", text: "", pathOverride: undefined, additionalClass: undefined, onClick: undefined}) {
		var currentPath = options.currentPath;
		var iconClass = options.icon;
		var tabName = options.text;
		var pathOverride = options.pathOverride;
		var additionalClass = options.additionalClass;
		var onClick = options.onClick;


		var path = typeof pathOverride == 'undefined' ? `/${tabName.toLowerCase()}` : pathOverride.toLowerCase();
		var tab = document.createElement('a');
			tab.className = currentPath == path ? 'selected' : '';
			typeof additionalClass == "string" ? tab.classList.add(additionalClass) : null;
			tab.innerHTML = `<i class="icon ${iconClass}"></i><span>${tabName}</span>`;
			if(typeof onClick == 'function') tab.onclick = onClick;
			else tab.href = path == "" ? '/' : path;

		this.component.append(document.createElement('hr'));
		this.component.append(tab);
		this.component.append(document.createElement('hr'));
	}

	appendTo(container) {
		container.append(this.component);
	}

	prependTo(container) {
		container.prepend(this.component);
	}
}
