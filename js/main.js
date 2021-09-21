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

    var sideNav = new SideNavComponent();
    sideNav.prependTo(document.querySelector('main'));

    var topNav = new TopNavComponent();
    topNav.prependTo(document.querySelector('header'));

    init();
})();

async function runReload() {
    var user = sessionStorage.getItem('username');
    var pass = sessionStorage.getItem('password');
    let res = await fetch('https://cors-anywhere.herokuapp.com/https://www.bonk2.io/scripts/login_legacy.php', { method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, body: `username=${user}&password=${pass}&remember=false`});
    res = await res.json();

    if(user.r != 'success') {
        AlertEmitter.emit('error', `Could not reload... '${user.e}'`);
        return;
    }

    AlertEmitter.emit('success', 'Reloading...');
    window.location.reload();
}

function getUser() {
    let user = sessionStorage.getItem('user');
    return JSON.parse(user);
}