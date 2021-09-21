(function() {
    window.siteName = "bonkonauts";

    window.AlertEmitter = new AlertEmitterComponent();
    
    var animation = new AnimationComponent();
    animation.start();

    window.user = null;
    fetch('/api/user').then(res => res.json()).then(user => {
        window.user = user;
        var sideNav = new SideNavComponent();
        sideNav.prependTo(document.querySelector('main'));

        var topNav = new TopNavComponent();
        topNav.prependTo(document.querySelector('header'));

        init();
    });
})();

function runReload() {
    fetch('/api/reload', {
		method: 'GET'
	}).then(res => res.json()).then((res) => {
		if(res.error) { AlertEmitter.emit('error', 'Could not reload...'); return; }
		
        window.location.reload();
	});
}