function beautDate(d) {
    var bd = new Date(d);
	if(isNaN(bd.getDate())) return 'ERROR';
    return `${bd.toLocaleString("default", { month: "long" })} ${bd.getDate()}, ${bd.getFullYear()}`;
}
function getRawDate(id) {
    var dbidDates = getDBIDs();
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

function getDBIDs() {
	return JSON.parse(sessionStorage.getItem('dbids'));
}

async function storeDBIDs() {
	var cached = sessionStorage.getItem('dbids');
	if(cached) return;

	try {
		const res = await fetch('https://raw.githubusercontent.com/shaunx777/dbid2date/main/dbidanddate.json');

		if(!res.ok) throw new Error('Failed to fetch DBIDs');
		
		var data  = await res.json();
		data = parseShittyFormat(data);

		sessionStorage.setItem('dbids', JSON.stringify(data));
	}
	catch(e) {
		console.error(e);
		throw e;
	}
}
function parseShittyFormat(dbids) {
	var parsed = {};

	for(let i = 0; i < dbids.length; i++) {
		parsed[dbids[i].number] = dbids[i].date;
	}

	return parsed;
}