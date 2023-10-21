async function init() {
	window.pathTitle = 'Lobbies';
	const Lobbies = await fetchLobbies();

	var container = document.querySelector('section.content');

    // // stats
    container.innerHTML = '<stats style="display: none"></stats>'

	// lobbies
	tmpCard = document.createElement('card');
		tmpItem = document.createElement('item');
			tmpItem.id = "lobbies_title";
			tmpItem.innerHTML = `<strong>Lobbies</strong> (${Lobbies.rooms.length})`;
		tmpCard.appendChild(tmpItem);
		tmpSearch = document.createElement('input');
				tmpSearch.addEventListener('input', (ev) => { 
					buildRoomList(ev.target.value, Lobbies);
				});
				tmpSearch.setAttribute('placeholder', "Roomname...");
				tmpSearch.name = "rooms";
			tmpCard.appendChild(tmpSearch);
		tmpItem = document.createElement('item');
			tmpItem.id = "roomList";
		tmpCard.appendChild(tmpItem);
	container.appendChild(tmpCard);

	buildRoomList('', Lobbies);
}

function searchRoomNames(nameKey, rooms) {
	return rooms.filter(room => room.roomname.toLowerCase().includes(nameKey.toLowerCase()));
}

function buildRoomList(query, lobbies) {
	var roomListTitle = document.querySelector('item#lobbies_title');
	var roomList = document.querySelector('item#roomList');
	var results = searchRoomNames(query, lobbies.rooms);

	console.log(lobbies)

	var lobbyListStr = "";
	for(let i = 0; i < results.length; i++) {
		let room = results[i];
		let name = room.roomname;
		let country = `<img class="country" src='${getCountryFlag(room.country)}'></img>`
		let players = `${room.players}/${room.maxplayers}`;
		let { gameType, gameMode } = getGameMode(room.mode_ga, room.mode_mo);
		let hasPass  = room.password == 1;
		let password = hasPass ? '<i class="fas fa-lock"></i>' : '<i class="fas fa-lock-open"></i>'

		lobbyListStr += `<li class="lobby"><item id="name" style='align-self: left'>${name}</item><item id="ID">${room.id.toLocaleString()}</item><item id="players">${players}</item><item id="pass"${hasPass ? ` style="color: rgb(184, 59, 59)"` : ``}>${password}</item><item id="mode">${gameMode}</item><item id="country">${country}</item></li>`;
	}

	roomListTitle.innerHTML = `<strong>Lobbies</strong> (${results.length})`;
	roomList.innerHTML = results.length != 0 ? `<ul><b><li><item id="name">Name</item><item id="ID">ID</item><item id="players">Players</item><item id="pass">Password</item><item id="mode">Mode</item><item id="country">Country</item></li></b><hr/>${lobbyListStr}</ul>` : (query.length > 0 ? `There are no rooms containing the phrase '${query}'...` : `There are no rooms...`);
}


async function fetchLobbies(startingFrom=0) {
	const VERSION = 48;
	let res = await fetch('https://cors-anywhere.herokuapp.com/https://bonk2.io/scripts/getrooms.php', { 
		method: 'POST',
		headers: {'Content-Type': 'application/x-www-form-urlencoded'
	}, body: `version=${VERSION}&gl=y&token=`});

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

	data = JSON.parse(data);

	return data;
}

function getCountryFlag(code) {
	return `https://flagicons.lipis.dev/flags/4x3/${code.toLocaleLowerCase()}.svg`
}

function getGameMode(game, mode) {
	let gameType, gameMode;
	switch(game) {
		case 'b': gameType = 'Bonk'; break;
		case 'f': gameType = 'Football'; break;
		case 's': gameType = 'Supercar'; break;
		default:  gameType = '???'; break;
	}
	switch(mode) {
		case 'b':   gameMode = 'Classic'; break;
		case 'f':   gameMode = 'Football'; break;
		case 'ar':  gameMode = 'Arrows'; break;
		case 'ard': gameMode = 'Death Arrows'; break;
		case 'sp':  gameMode = 'Grapple'; break;
		case 'v':   gameMode = 'VTOL'; break;
		case 's':   gameMode = 'Supercar'; break;
		case 'bs':  gameMode = 'Simple'; break;
		default:    gameMode = '???'; break;
	}

	return {gameType, gameMode};
}