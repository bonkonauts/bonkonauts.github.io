
async function init() {
	window.user = {};
	window.user.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1aWQiOjcwMjg4MjMsInVpcCI6IjMuODUuMjYuMjQzIiwidW4iOiJJQW1Ob3RIYWNraW5nIiwiZXYiOnRydWUsImx2IjoyMiwiZXhwIjoxNjMyMzQxODY4LCJnIjoiYiJ9.aaw52_P3Yrb1QPwbINEQTQ3LeOrPyzCv9PNwNNptSRw';

	window.MAPS = [];
	await proxyMaps();
	var mapListStr = "";
	for(let map of MAPS) {
		mapListStr += `<li class="user"><span id="name">${map.name}</span><span id="dbid">${map.id.toLocaleString()}</span><span id="U/D"><span class="up">${map.vu}</span>/<span class="down">${map.vd}</span></span><span id="created">${map.creationdate.split(' ')[0]}</span></li>`;
	}

	window.FLASH_MAPS = "";
	await proxyFlashMaps();
	console.log(FLASH_MAPS);
	let flashMapCnt = getQuery(FLASH_MAPS, 'cant');
	var flashMapListStr = "";
	for(let i = 0; i < flashMapCnt; i++) {
		flashMapListStr += `<li class="user"><span id="name">${getQuery(FLASH_MAPS, `mapname${i}`).replace(/\+/g, ' ')}</span><span id="dbid">${Number(getQuery(FLASH_MAPS, `mapid${i}`)).toLocaleString()}</span><span id="U/D"><span class="up">${getQuery(FLASH_MAPS, `thumbsup${i}`)}</span>/<span class="down">${getQuery(FLASH_MAPS, `thumbsdown${i}`)}</span></span><span id="created">${getQuery(FLASH_MAPS, `creationdate${i}`).split(' ')[0]}</span></li>`;
	}

	
	// var flashMapStr = "";
	// for(let map of FLASH_MAPS) {
	// 	console.log(map)
	// }

	var mapContainer = document.querySelector('section.content');
	// maps
	tmpCard = document.createElement('card');
		tmpItem = document.createElement('item');
			tmpItem.id = "maps_title";
			tmpItem.innerHTML = `<strong>Maps</strong> (${MAPS.length})`;
		tmpCard.appendChild(tmpItem);
		tmpItem = document.createElement('item');
			tmpItem.id = "maps";
			tmpItem.innerHTML = MAPS.length != 0 ? `<ul><b><li><span id="name">Name</span><span id="dbid">DBID</span><span id="U/D">Up/Down</span><span id="created">Created</span></li></b><hr/>${mapListStr}</ul>` : "There are no maps to display...";
		tmpCard.appendChild(tmpItem);
	mapContainer.appendChild(tmpCard);

	// flash maps
	tmpCard = document.createElement('card');
		tmpItem = document.createElement('item');
			tmpItem.id = "flash_maps_title";
			tmpItem.innerHTML = `<strong>Flash Maps</strong> (${flashMapCnt})`;
		tmpCard.appendChild(tmpItem);
		tmpItem = document.createElement('item');
			tmpItem.id = "maps";
			tmpItem.innerHTML = flashMapCnt != 0 ? `<ul><b><li><span id="name">Name</span><span id="dbid">DBID</span><span id="U/D">Up/Down</span><span id="created">Created</span></li></b><hr/>${flashMapListStr}</ul>` : "There are no maps to display...";
		tmpCard.appendChild(tmpItem);
	mapContainer.appendChild(tmpCard);

	// // legacy friends
	// tmpCard = document.createElement('card');
	// 	tmpItem = document.createElement('item');
	// 		tmpItem.id = "flash_title";
	// 		tmpItem.innerHTML = `<strong>Flash Friends</strong> (${legacyFriendCount})`;
	// 	tmpCard.appendChild(tmpItem);
	// 	if(legacyFriendCount != 0) {
	// 		tmpSearch = document.createElement('input');
	// 		tmpSearch.addEventListener('input', (ev) => { 
	// 			updateFriendList(ev.target, FRIENDS, LEGACY_FRIENDS)
	// 		});
	// 		tmpSearch.setAttribute('placeholder', "Username...");
	// 		tmpSearch.name = "legacy";
	// 		tmpCard.appendChild(tmpSearch);
	// 	}
	// 	tmpItem = document.createElement('item');
	// 		tmpItem.id = 'legacy';
	// 		tmpItem.innerHTML = legacyFriendCount != 0 ? `<ul><b><li><span id="name">Username</span></li></b><hr/>${legacyFriendListStr}</ul>` : "There are no friends to display...";
	// 	tmpCard.appendChild(tmpItem);
	// friendsContainer.appendChild(tmpCard);
}

async function proxyFlashMaps(startingFrom=0) {
	let res = await fetch('https://cors-anywhere.herokuapp.com/https://www.bonk2.io/scripts/map_b1_getown.php', { method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, body: `token=${window.user.token}&startingfrom=${startingFrom}`});
    let data = await res.text();

	if(data.includes('See /corsdemo for more info')) {
		AlertEmitter.emit('error', 'First go <a href="https://cors-anywhere.herokuapp.com/corsdemo">here</a> and click "Request temporay access"')
		AlertEmitter.emit('warning', 'This is due to CORS on https://bonk.io/')
		return null;
	}

	let parsed = JSON.parse(data);
	FLASH_MAPS = `&${parsed.maps}&`;
}

async function proxyMaps(startingFrom=0) {
	let res = await fetch('https://cors-anywhere.herokuapp.com/https://www.bonk2.io/scripts/map_getown.php', { method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, body: `token=${window.user.token}&startingfrom=${startingFrom}`});
    let data = await res.text();

	if(data.includes('See /corsdemo for more info')) {
		AlertEmitter.emit('error', 'First go <a href="https://cors-anywhere.herokuapp.com/corsdemo">here</a> and click "Request temporay access"')
		AlertEmitter.emit('warning', 'This is due to CORS on https://bonk.io/')
		return null;
	}

	let parsed = JSON.parse(data);
	MAPS = MAPS.concat(parsed.maps);
	if(parsed.more == true) {
		await proxyMaps(data.maps.length);
	}
	else
	{
		return;
	}
}

function getQuery(qString, query) {
	return qString.split(`&${query}=`)[1].split('&')[0];
}