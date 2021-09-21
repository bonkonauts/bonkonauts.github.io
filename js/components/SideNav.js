class SideNavComponent {
	constructor(path="") {
		this.component = document.createElement('section');
		this.component.className = 'sidenav';
		this.buildComponent(path);
	}

	buildComponent(pathOverride="") {
		var userValid = window.user && window.user.username ? window.user.username : null;
		var path = window.location.pathname;

		path = pathOverride != "" ? `/${pathOverride}` : path;

		this.component.innerHTML = `
			<hr/>
			<a class="${path == "/" ? 'selected' : ''}" href="/">
				<i class="icon fas fa-star"></i>
				<span>Experience</span>
			</a>
			<a class="${path == "/avatars" ? 'selected' : ''}" href="/avatars">
				<i class="icon fas fa-user-circle"></i>
				<span>Avatars</span>
			</a>
			<hr/>
			<a class="${path == "/friends" ? 'selected' : ''}" href="/friends">
				<i class="icon fas fa-users"></i>
				<span>Friends</span>
			</a>
			<hr/>
			<a class="${path == "/leaderboard" ? 'selected' : ''}" href="/leaderboard">
				<i class="icon fas fa-trophy"></i>
				<span>Leaderboard</span>
			</a>
			<hr/>
			<a onclick="runReload()">
				<i class="icon fas fa-sync-alt"></i>
				<span>Reload</span>
			</a>
			<hr/>
			<!--<a class="${path == "/maps" ? 'selected' : ''}" href="/maps">
				<i class="icon fas fa-table"></i>
				<span>Maps</span>
			</a>
			<hr/>
			<a class="${path == "/database" ? 'selected' : ''}" href="/database">
				<i class="icon fas fa-database"></i>
				<span>Database</span>
			</a>
			<hr/>-->
			<a class="${path == "/login" ? 'selected' : ''}" href="/login">
				<i class="icon fas fa-sign-out-alt"></i>
				<span>Logout</span>
			</a>
			<hr/>
		`;
	}

	appendTo(container) {
		container.append(this.component);
	}

	prependTo(container) {
		container.prepend(this.component);
	}
}