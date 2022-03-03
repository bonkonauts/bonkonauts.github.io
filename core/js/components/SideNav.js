class SideNavComponent {
	constructor(path="") {
		this.component = document.createElement('section');
		this.component.className = 'sidenav';
		this.tabs = {};
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
		this.addTab({currentPath: path, icon: 'fas fa-table', text: 'Maps', usesSubTabs: true});
		this.addSubTab(this.tabs["Maps"], {icon: 'fas fa-map-marked-alt', text: 'Your Maps', pathOverride: '/yourmaps'}, true);
		// this.addSubTab(this.tabs["Maps"], {icon: 'fas fa-fire', text: "Hot Maps", pathOverride: '/hotmaps'});
		// this.addTab({currentPath: path, icon: 'fas fa-trophy', text: 'Leaderboard'});
		this.addTab({currentPath: path, icon: 'fas fa-sync-alt', text: 'Reload', additionalClass: 'rotate', onClick: runReload});
		this.addTab({currentPath: path, icon: `fas fa-sign-${typeof userValid != 'undefined' ? 'out' : 'in'}`, text: typeof userValid != 'undefined' ? 'Logout' : "Login", onClick: runLogin});
	
		this.component.onclick = (e) => {
			if(e.target.className != "sidenav") {
				window.lastClickTarget = e.target;
				var subTabs = e.target.querySelector('subtabs');
				subTabs.classList.contains('hidden') ? this.openSubtabs(e.target) : this.closeSubTabs(e.target);
			}
			else this.closeAllSubTabs();
		}
	}

	addTab(options={currentPath: "", icon: "", text: "", pathOverride: undefined, additionalClass: undefined, onClick: undefined, usesSubTabs: false}) {
		var currentPath = options.currentPath;
		var iconClass = options.icon;
		var tabName = options.text;
		var pathOverride = options.pathOverride;
		var additionalClass = options.additionalClass;
		var onClick = options.onClick;

		var path = typeof pathOverride == 'undefined' ? `/${tabName.toLowerCase()}` : pathOverride.toLowerCase();
		var tab = document.createElement('a');
			tab.className = tabName == sessionStorage.getItem('page') ? 'selected' : '';
			typeof additionalClass == "string" ? tab.classList.add(additionalClass) : null;
			tab.innerHTML = `<i class="icon ${iconClass}"></i><span>${tabName}</span><subtabs></subtabs>`;
			if(typeof onClick == 'function') tab.onclick = onClick;
			else if(options.usesSubTabs) {
				tab.querySelector('subtabs').className = 'hidden';
			} 
			else tab.href = path == "" ? '/' : path;

		this.component.append(document.createElement('hr'));
		this.component.append(tab);
		this.component.append(document.createElement('hr'));
		this.tabs[options.text] = tab;
		tab.addEventListener('click', () => { this.updateSessionPage(tabName) });
	}

	addSubTab(parent, options={icon: "", text: "", pathOverride: undefined, additionalClass: undefined, onClick: undefined}, isFirst=false) {
		var iconClass = options.icon;
		var tabName = options.text;
		var pathOverride = options.pathOverride;
		var additionalClass = options.additionalClass;
		var onClick = options.onClick;

		var parent = parent.querySelector('subtabs');
		var path = typeof pathOverride == 'undefined' ? `/${tabName.toLowerCase()}` : pathOverride.toLowerCase();
		var tab = document.createElement('a');
			tab.className = 'subtab';
			if(isFirst) tab.style = "margin-top: 0.75rem;";
			typeof additionalClass == "string" ? tab.classList.add(additionalClass) : null;
			tab.innerHTML = `<i class="icon ${iconClass}" style="margin-left: 0.25rem;"></i><span style="color: #9a9a9a">${tabName}</span>`;
			if(typeof onClick == 'function') tab.onclick = onClick;
			else tab.href = path == "" ? '/' : path;

		parent.append(tab);
		parent.removeEventListener('click', () => { this.updateSessionPage(tabName) });
		tab.addEventListener('click', () => { this.updateSessionPage(tabName) });
	}

	updateSessionPage(tabName) {
		sessionStorage.setItem('page', tabName);
	}

	openSubtabs(target) {
		var allSubtabs = this.component.querySelectorAll('subtabs');
		for(var tmpTab of allSubtabs) {
			tmpTab.classList.add('hidden');
		}
		target.querySelector('subtabs').classList.remove('hidden');
	}

	closeSubTabs(target) {
		target.querySelector('subtabs').classList.add('hidden');
	}

	closeAllSubTabs() {
		var allSubtabs = this.component.querySelectorAll('subtabs');
		for(var tmpTab of allSubtabs) {
			tmpTab.classList.add('hidden');
		}
	}

	appendTo(container) {
		container.append(this.component);
	}

	prependTo(container) {
		container.prepend(this.component);
	}
}
