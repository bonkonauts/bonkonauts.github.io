var prevElem;
function showMap(e, elem) {
// 	if(elem == prevElem) return;
    
//     var stats = document.querySelector('stats');
//     var elemBounds = elem.getBoundingClientRect()

//     stats.style.top = `${(elemBounds.y / 2)}px`;
//     stats.style.left = `${e.clientX}px`;

// 	stats.style.display = "block";
//     console.log(e, )
//     prevElem = elem;
}

function hideMap() {
// 	document.querySelector('stats').style.display = "none";
//     prevElem = null;
}

async function init() {
	window.pathTitle = 'Your Maps';
	window.MAPS = [];
    

	await proxyMaps();
	var mapListStr = "";
	for(let map of MAPS) {
		// previewMap(map.id, map.leveldata).then((id, img) => {
		// 	console.log(id, img);
		// })
		mapListStr += `<li class="user" id="${map.id}"${/*' onmouseover="showMap(map, this)" onmouseout="hideMap(this)"'*/''}><span id="name">${decodeURIComponent(map.name)}</span><span id="dbid">${map.id.toLocaleString()}</span><span id="U/D">${map.published == 1 ? (map.vu == 0 && map.vd == 0 ? '<span class="down">No Votes</span>' : `<span class="up">${map.vu}</span> / <span class="down">${map.vd}</span>`): '<span class="down">PRIVATE</span>'}</span><span id="created">${map.creationdate.split(' ')[0]}</span></li>`;
	}

	window.FLASH_MAPS = "";
	await proxyFlashMaps();
	let flashMapCnt = getQuery(FLASH_MAPS, 'cant');
	var flashMapListStr = "";
	for(let i = 0; i < flashMapCnt; i++) {
		flashMapListStr += `<li class="user"><span id="name">${decodeURIComponent(getQuery(FLASH_MAPS, `mapname${i}`).replace(/\+/g, ' '))}</span><span id="dbid">${Number(getQuery(FLASH_MAPS, `mapid${i}`)).toLocaleString()}</span><span id="U/D">${getQuery(FLASH_MAPS, `public${i}`) == 1 ? (getQuery(FLASH_MAPS, `thumbsup${i}`) == 0 && getQuery(FLASH_MAPS, `thumbsdown${i}`) == 0 ? '<span class="down">No Votes</span>' : `<span class="up">${getQuery(FLASH_MAPS, `thumbsup${i}`)}</span> / <span class="down">${getQuery(FLASH_MAPS, `thumbsdown${i}`)}</span>`) : '<span class="down">PRIVATE</span>'}</span><span id="created">${getQuery(FLASH_MAPS, `creationdate${i}`).split(' ')[0]}</span></li>`;
	}

	

	var mapContainer = document.querySelector('section.content');

    // stats
    mapContainer.innerHTML = '<stats style="display: none"></stats>'

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
}

// function addMapPreview(id, img) {

// }

// function previewMap(id, rawMap) {
// 	return new Promise(async (resolve, reject) => {
// 		console.log(1);
// 		let res = await fetch(`http://bonkonauts.herokuapp.com/preview?map=test`);
// 		console.log(2);
// 		let data = await res.text();
// 		console.log(3);

// 		if(!data.includes('data:image/png')) {
// 			console.log('e');
// 			reject(-1, '');
// 		}
	
// 		console.log('s');
// 		resolve(id, data);
// 	});
// }

async function proxyFlashMaps(startingFrom=0) {
	let res = await fetch('https://cors-anywhere.herokuapp.com/https://www.bonk2.io/scripts/map_b1_getown.php', { method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, body: `token=${window.user.token}&startingfrom=${startingFrom}`});
    let data = await res.text();

	if(data.includes('See /corsdemo for more info')) {
		AlertEmitter.emit('error', 'First go <a href="https://cors-anywhere.herokuapp.com/corsdemo">here</a> and click "Request temporary access"')
		AlertEmitter.emit('warning', 'This is due to CORS on https://bonk.io/')
		return null;
	}

	if(data.includes('The origin "https://bonkonauts.github.io" has sent too many requests')) {
		AlertEmitter.emit('error', 'CORS issue, try again later.');
		return null;
	}

	let parsed = JSON.parse(data);
	FLASH_MAPS = `&${parsed.maps}&`;
}

async function proxyMaps(startingFrom=0) {
	let res = await fetch('https://cors-anywhere.herokuapp.com/https://www.bonk2.io/scripts/map_getown.php', { method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'}, body: `token=${window.user.token}&startingfrom=${startingFrom}`});
    let data = await res.text();

	if(data.includes('See /corsdemo for more info')) {
		AlertEmitter.emit('error', 'First go <a href="https://cors-anywhere.herokuapp.com/corsdemo">here</a> and click "Request temporary access"')
		AlertEmitter.emit('warning', 'This is due to CORS on https://bonk.io/')
		return null;
	}

	if(data.includes('The origin "https://bonkonauts.github.io" has sent too many requests')) {
		AlertEmitter.emit('error', 'CORS issue, try again later.');
		return null;
	}

	let parsed = JSON.parse(data);
	MAPS = MAPS.concat(parsed.maps);
	if(parsed.more == true) {
		await proxyMaps(MAPS.length);
	}
	else
	{
		return;
	}
}

function getQuery(qString, query) {
	return qString.split(`&${query}=`)[1].split('&')[0];
}
