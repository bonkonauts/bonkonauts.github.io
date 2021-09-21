function init() {
	var leaderboard = document.querySelector('ul.users');

	fetch('/api/leaderboard', {
		method: 'GET'
	}).then(res => res.json()).then((res) => {
		if(res.error) { leaderboard.innerHTML = `<p>${res.error}</p>`; return; }
		const LEADERBOARD = res;

		let count = 1;
		for(let user of LEADERBOARD) {
			if(user.name.length > 16) user.name = `${user.name.slice(0, 14)}...`;
			leaderboard.innerHTML += `<li${user.name == window.user.username ? ' class="me"' : ''}><i ${count < 4 ? `class="${count == 1 ? 'gold' : count == 2 ? 'silver' : 'bronze'} fas fa-crown"` : ''}>${count > 3 ? count : ''}</i><span class="name">${user.name}</span><span class="xp">${user.xp.toLocaleString()}</span><span class="level">${xpToLevel(user.xp)}</span><span id="dbid">${user.id.toLocaleString()}</span></li>`
			count++;
		}
	});
}

function xpToLevel(xp) { return Math.floor(Math.sqrt(xp) / 10) + 1; }
