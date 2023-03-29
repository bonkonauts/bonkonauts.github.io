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
		AlertEmitter.emit('error', 'First go <a href="https://cors-anywhere.herokuapp.com/corsdemo">here</a> and click "Request temporay access"')
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


function beautDate(d) {
    var bd = new Date(d);
    return `${bd.toLocaleString("default", { month: "long" })} ${bd.getDate()}, ${bd.getFullYear()}`;
}
function getRawDate(id) {
    var dbidDates = { 4828: "1-Oct-12", 7067: "2-Nov-12", 15922: "26-Jan-13", 19399: "27-Feb-13", 21636: "29-Mar-13", 27194: "2-Jun-13", 27347: "3-Jun-13", 27933: "8-Jun-13", 33341: "8-Jul-13", 34961: "10-Aug-13", 36182: "28-Aug-13", 207482: "11-Dec-13", 233104: "9-Jan-14", 377174: "14-Jun-14", 412712: "6-Aug-14", 416111: "11-Aug-14", 420554: "18-Aug-14", 424096: "22-Aug-14", 428600: "27-Aug-14", 432321: "1-Sep-14", 437444: "6-Sep-14", 444701: "14-Sep-14", 451389: "20-Sep-14", 460207: "28-Sep-14", 473143: "9-Oct-14", 480829: "16-Oct-14", 488405: "22-Oct-14", 495573: "27-Oct-14", 497077: "28-Oct-14", 503304: "1-Nov-14", 508652: "5-Nov-14", 515908: "10-Nov-14", 524845: "15-Nov-14", 550816: "1-Dec-14", 557998: "5-Dec-14", 580255: "16-Dec-14", 595568: "21-Dec-14", 602663: "25-Dec-14", 606951: "28-Dec-14", 611699: "1-Jan-15", 617276: "6-Jan-15", 624781: "10-Jan-15", 638222: "17-Jan-15", 644190: "21-Jan-15", 678344: "5-Feb-15", 681574: "6-Feb-15", 698782: "14-Feb-15", 704427: "17-Feb-15", 713912: "21-Feb-15", 719239: "24-Feb-15", 726578: "27-Feb-15", 733123: "2-Mar-15", 740725: "5-Mar-15", 748884: "8-Mar-15", 757510: "12-Mar-15", 766518: "15-Mar-15", 768223: "16-Mar-15", 783552: "21-Mar-15", 794654: "25-Mar-15", 809730: "31-Mar-15", 812608: "1-Apr-15", 828664: "8-Apr-15", 831198: "9-Apr-15", 861149: "20-Apr-15", 879484: "26-Apr-15", 889494: "30-Apr-15", 898810: "3-May-15", 909819: "7-May-15", 919686: "10-May-15", 926193: "15-May-15", 948752: "23-May-15", 955151: "27-May-15", 966043: "31-May-15", 983384: "8-Jun-15", 995511: "13-Jun-15", 1018444: "28-Jun-15", 1025301: "4-Jul-15", 1030537: "8-Jul-15", 1038249: "15-Jul-15", 1044996: "21-Jul-15", 1056311: "2-Aug-15", 1092848: "6-Sep-15", 1136249: "6-Oct-15", 1145703: "11-Oct-15", 1153297: "16-Oct-15", 1160524: "21-Oct-15", 1168833: "25-Oct-15", 1177401: "30-Oct-15", 1185066: "4-Nov-15", 1194166: "9-Nov-15", 1204946: "14-Nov-15", 1212870: "19-Nov-15", 1222317: "24-Nov-15", 1231999: "1-Dec-15", 1241591: "5-Dec-15", 1249194: "10-Dec-15", 1265355: "17-Dec-15", 1276665: "21-Dec-15", 1281941: "25-Dec-15", 1285054: "29-Dec-15", 1288062: "2-Jan-16", 1292314: "6-Jan-16", 1300454: "10-Jan-16", 1309481: "15-Jan-16", 1315696: "19-Jan-16", 1319963: "21-Jan-16", 1325248: "23-Jan-16", 1334342: "28-Jan-16", 1342309: "2-Feb-16", 1347900: "4-Feb-16", 1357901: "8-Feb-16", 1367953: "11-Feb-16", 1376637: "16-Feb-16", 1390129: "21-Feb-16", 1404417: "26-Feb-16", 1413803: "1-Mar-16", 1429015: "5-Mar-16", 1430402: "6-Mar-16", 1442875: "10-Mar-16", 1447097: "11-Mar-16", 1454232: "14-Mar-16", 1461293: "17-Mar-16", 1468637: "19-Mar-16", 1475974: "22-Mar-16", 1486401: "26-Mar-16", 1494242: "31-Mar-16", 1501640: "4-Apr-16", 1513534: "8-Apr-16", 1520548: "12-Apr-16", 1532804: "16-Apr-16", 1538728: "19-Apr-16", 1550466: "23-Apr-16", 1557570: "27-Apr-16", 1569512: "30-Apr-16", 1571192: "2-May-16", 1576641: "4-May-16", 1581315: "5-May-16", 1593110: "9-May-16", 1597318: "11-May-16", 1609073: "13-May-16", 1616896: "17-May-16", 1635360: "21-May-16", 1644843: "24-May-16", 1659819: "29-May-16", 1665441: "1-Jun-16", 1669079: "2-Jun-16", 1683278: "7-Jun-16", 1693754: "11-Jun-16", 1703537: "16-Jun-16", 1709324: "20-Jun-16", 1717279: "25-Jun-16", 1724110: "30-Jun-16", 1730213: "4-Jul-16", 1735619: "9-Jul-16", 1740434: "13-Jul-16", 1741678: "14-Jul-16", 1746583: "19-Jul-16", 1751751: "25-Jul-16", 1756649: "30-Jul-16", 1761867: "5-Aug-16", 1766244: "10-Aug-16", 1771927: "15-Aug-16", 1778986: "21-Aug-16", 1787473: "26-Aug-16", 1789059: "27-Aug-16", 1790360: "29-Aug-16", 1796303: "1-Sep-16", 1804116: "6-Sep-16", 1815795: "10-Sep-16", 1828936: "16-Sep-16", 1833500: "17-Sep-16", 1846888: "22-Sep-16", 1867670: "27-Sep-16", 1891255: "2-Oct-16", 1912793: "7-Oct-16", 1930746: "12-Oct-16", 1951109: "17-Oct-16", 1972353: "21-Oct-16", 1985282: "24-Oct-16", 2017327: "29-Oct-16", 2043856: "3-Nov-16", 2114955: "9-Nov-16", 2132030: "11-Nov-16", 2176988: "16-Nov-16", 2197519: "18-Nov-16", 2473753: "16-Dec-16", 2497063: "19-Dec-16", 3144159: "20-Feb-17", 3815192: "9-May-17", 7091564: "5-Aug-18", 7986092: "14-Jan-19", 9117802: "25-Jul-19", 10242309: "18-Mar-20", 10544159: "11-Jul-20", 10709069: "21-Sep-20", 10844894: "1-Nov-20", 10914347: "15-Nov-20", 11136377: "18-Feb-21", 11165248: "20-Feb-21", 11241154: "11-Mar-21", 11243504: "19-Mar-21", 11305937: "13-Apr-21", 11317614: "15-Apr-21", 11337572: "23-Apr-21", 11353908: "28-Apr-21", 11414286: "12-May-21", 11499483: "22-Jun-21", 11532164: "21-Jul-21", 11679511: "22-Oct-21", 11758690: "5-Nov-21", 11825856: "5-Dec-21", 11889868: "14-Dec-21", 11947177: "16-Jan-22", 11962994: "18-Jan-22", 11978228: "24-Jan-22", 11992244: "29-Jan-22", 11993606: "30-Jan-22", 11997790: "1-Feb-22", 12005487: "3-Feb-22", 12026003: "11-Feb-22", 12027777: "12-Feb-22", 12085042: "11-Mar-22", 12182435: "20-Apr-22", 12558827: "27-Apr-22", 12567759: "30-Apr-22", 12677125: "03-Jul-22", 13119153: "27-Mar-23" };
    var dbids = Object.keys(dbidDates);

    let len = dbids.length - 1;
	if(id < dbids[0]) return `Before ${beautDate(dbidDates[dbids[0]])}`;
	if(id > dbids[len]) return `After ${beautDate(dbidDates[dbids[len]])}`;

    let prev, next;
	for(let i = 1; i < dbids.length; i++) {
		if(dbids[i] == id) return dbidDates[dbids[i]];
		if(dbids[i] > id) {
			prev = dbids[i - 1];
			next = dbids[i];
			break;
		}
	}

    var ratio = (id - prev) / (next - prev);
	var prevDate = new Date(dbidDates[prev]);
	var nextDate = new Date(dbidDates[next]);

	var diff = nextDate.getTime() - prevDate.getTime();
	var interT = prevDate.getTime() + ratio * diff;

    return beautDate(interT);
}