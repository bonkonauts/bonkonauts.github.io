(function() {
    window.AlertEmitter = new AlertEmitterComponent();

	AlertEmitter.emit("info", "Login with your bonk.io account here!")

	window.user = {};
	sessionStorage.setItem('user', JSON.stringify({}));

    var animation = new AnimationComponent();
    animation.start();

	document.querySelector('form.login-form').onsubmit = (async (e) => {
		e.preventDefault();
		var form = e.target;
		
		var username = document.querySelector('form.login-form div.form-input-material input#username').value;
		var password = document.querySelector('form.login-form div.form-input-material input#password').value;

		console.log(username, password)

		let user = await proxyLogin(username, password);

		if(!username) { AlertEmitter.emit('error', 'You must provide a username...'); return; }
		if(!password) { AlertEmitter.emit('error', 'You must provide a password...'); return; }

		if(user.r != 'success') {
			var error = "";
			switch(user.e) {
				case 'username_fail':
					error = `No account with that username.`;
				break;
				case 'password':
					error = `Incorrect password, try again.`;
				break;
				case 'ratelimited':
					error = `Rate limited, try again later.`;
				break;
				default:
					error = `An unknown error has occurred: ${user.e}`;
				break;
			}
			AlertEmitter.emit('error', error);
			window.user = {};
			sessionStorage.setItem('user', JSON.stringify({}));
			return;
		}

		console.log(user);
		window.user = user;
		sessionStorage.setItem('user', JSON.stringify(user));

		AlertEmitter.emit('success', `Hi, ${user.username}! You will be redirected.`)

		window.location.href = '/';

		// fetch('/api/login', {
		// 	method: 'POST',
		// 	body: data
		// }).then(res => res.json()).then((res) => {
		// 	if(res.error) {
		// 		AlertEmitter.emit('error', res.error);
		// 		sessionStorage.setItem('user', JSON.stringify({}));
		// 	}
		// 	else if(res.success) {
		// 		AlertEmitter.emit('success', `${res.success} You will be redirected.`)

		// 		sessionStorage.setItem('user', JSON.stringify(res.user));

		// 		var truePath = window.location.pathname == '/login' ? '/' : window.location.pathname; 
				
        //         setTimeout(() => {
        //             window.location.pathname = truePath;
        //         }, 2500);
		// 	}
		// });

	});
})();

async function proxyLogin(user, pass) {
    let res = await fetch('https://cors-anywhere.herokuapp.com/https://www.bonk2.io/scripts/login_legacy.php', { method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, body: `username=${user}&password=${pass}&remember=false`});
    return await res.json();
} 