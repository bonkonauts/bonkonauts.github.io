(function() {
    window.siteName = "bonkonauts";
	window.pathTitle = 'About';

    window.AlertEmitter = new AlertEmitterComponent();
    
    var animation = new AnimationComponent();
    animation.start();
    init();

    var sideNav = new SideNavComponent();
    sideNav.prependTo(document.querySelector('main'));

    var topNav = new TopNavComponent();
    topNav.prependTo(document.querySelector('header'));

    if(typeof storeDBIDs == 'function') storeDBIDs();
})();

function runLogin() {
    window.location.href = `/login`;
    return;
}

async function runReload() {
    var user = sessionStorage.getItem('username');
    var pass = sessionStorage.getItem('password');
    if(!user || !pass) {
        AlertEmitter.emit('error', `Could not reload because you are not logged in...`);
        return;   
    }
    let res = await fetch('https://cors-anywhere.herokuapp.com/https://www.bonk2.io/scripts/login_legacy.php', { method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, body: `username=${user}&password=${pass}&remember=false`});
    res = await res.json();

    if(data.includes('See /corsdemo for more info')) {
		AlertEmitter.emit('error', 'First go <a href="https://cors-anywhere.herokuapp.com/corsdemo">here</a> and click "Request temporary access"')
		AlertEmitter.emit('warning', 'This is due to CORS on https://bonk.io/')
		return null;
	}

    if(res.r != 'success') {
        AlertEmitter.emit('error', parseLoginErr(res.e));
        return;
    }

	res.creation = getRawDate(res.id);
    window.user = res;
    sessionStorage.setItem('user', JSON.stringify(res));

    sessionStorage.setItem('username', user);
    sessionStorage.setItem('password', pass);

    AlertEmitter.emit('success', 'Reloading...');

    setTimeout(() => {
        window.location.reload();
    }, 1500);
}

function parseLoginErr(e) {
    switch(e) {
        case 'username_fail':
            return `No account with that username.`;
        case 'password':
            return 'Invalid password!';
        case 'ratelimited':
                return 'Our proxy server has been ratelimited by bonk.io. Please try again in a bit.';
        default:
            return e;
            
    }
}

function getUser() {
    let user = sessionStorage.getItem('user');
    return JSON.parse(user);
}

