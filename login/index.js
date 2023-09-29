(function() {
    window.AlertEmitter = new AlertEmitterComponent();

	AlertEmitter.emit("info", "Login with your bonk.io account here!")

	window.user = {};
	sessionStorage.setItem('user', JSON.stringify({}));

	storeDBIDs();

    var animation = new AnimationComponent();
    animation.start();

	document.querySelector('form.login-form').onsubmit = (async (e) => {
		e.preventDefault();
		var form = e.target;

		var username = document.querySelector('form.login-form div.form-input-material input#username').value;
		var password = document.querySelector('form.login-form div.form-input-material input#password').value;

		let user = await proxyLogin(username, password);
		if(!user) return;

		if(!username) { AlertEmitter.emit('error', 'You must provide a username...'); return; }

		if(user.r != 'success') {
			var error = "";
			switch(user.e) {
				case 'username_fail':
					error = `No account with that username.`;
				break;
				case 'password':
					error = 'Invalid password!';
				break;
				case 'ratelimited':
					error = 'Our proxy server has been ratelimited by bonk.io. Please try again in a bit.';
				break;
				case 'banned':
					error = 'That account is banned.';
				break;
				default:
					error = e;
				break;
					
			}
			AlertEmitter.emit('error', error);
			window.user = {};
			sessionStorage.setItem('user', JSON.stringify({}));
			return;
		}

		user.creation = getRawDate(user.id);
		
		window.user = user;
		sessionStorage.setItem('user', JSON.stringify(user));

		sessionStorage.setItem('username', user.username);
		sessionStorage.setItem('password', password);

		AlertEmitter.emit('success', `Hi, ${user.username}! You will be redirected.`);

		setTimeout(() => {
			window.location.href = '/';
		}, 1500)
	});
})();

async function proxyLogin(user, pass) {
    let res = await fetch('https://cors-anywhere.herokuapp.com/https://www.bonk2.io/scripts/login_legacy.php', { method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, body: `username=${user}&password=${pass}&remember=false`});
    let data = await res.text();

	if(data.includes('See /corsdemo for more info')) {
		AlertEmitter.emit('error', 'First go <a href="https://cors-anywhere.herokuapp.com/corsdemo" target="_blank">here</a> and click "Request temporary access"')
		AlertEmitter.emit('warning', 'This is due to CORS on https://bonk.io/')
		return null;
	}

	if(data.includes(' has sent too many requests')) {
		AlertEmitter.emit('error', 'CORS issue, please wait and try again later.');
		return null;
	}

	var result;
	try {
		result = JSON.parse(data);
	}
	catch(e) {
		result = { r: 'error', e: 'unknown' };
		console.error(data);
	}
	return result;
}