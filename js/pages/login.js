(function() {
    window.AlertEmitter = new AlertEmitterComponent();

	AlertEmitter.emit("info", "Login with your bonk.io account here!")

	window.user = {};
	sessionStorage.setItem('user', JSON.stringify({}));

    var animation = new AnimationComponent();
    animation.start();

	document.querySelector('form.login-form').onsubmit = ((e) => {
		e.preventDefault();
		var form = e.target;
		var data = new URLSearchParams(new FormData(form));

		fetch('/api/login', {
			method: 'POST',
			body: data
		}).then(res => res.json()).then((res) => {
			if(res.error) {
				AlertEmitter.emit('error', res.error);
				sessionStorage.setItem('user', JSON.stringify({}));
			}
			else if(res.success) {
				AlertEmitter.emit('success', `${res.success} You will be redirected.`)

				sessionStorage.setItem('user', JSON.stringify(res.user));

				var truePath = window.location.pathname == '/login' ? '/' : window.location.pathname; 
				
                setTimeout(() => {
                    window.location.pathname = truePath;
                }, 2500);
			}
		});

	});
})();

