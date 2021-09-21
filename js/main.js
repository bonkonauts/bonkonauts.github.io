(function() {
    window.siteName = "bonkonauts";

    window.AlertEmitter = new AlertEmitterComponent();
    
    var animation = new AnimationComponent();
    animation.start();

    window.user = getUser();
    if(!user || (user && Object.keys(user).length == 0)) {
        window.location.href = '/login';
        return;
    }

    init();
})();

function runReload() {
    fetch('/api/reload', {
		method: 'GET'
	}).then(res => res.json()).then((res) => {
		if(res.error) { AlertEmitter.emit('error', 'Could not reload...'); return; }
		
        window.location.reload();
	});
}

function getUser() {
    let user = sessionStorage.getItem('user');
    return JSON.parse(user);
}