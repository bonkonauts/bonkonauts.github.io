async function init() {
	const Lobbies = await fetchLobbies();
	var Rooms = Lobbies.rooms;

	var lobbyListStr = "";
	for(let i = 0; i < Rooms.length; i++) {
		let room = Rooms[i];
		let name = room.roomname;
		let country = `<img class="country" src='${getCountryFlag(room.country)}'></img>`
		let players = `${room.players}/${room.maxplayers}`;
		let { gameType, gameMode } = getGameMode(room.mode_ga, room.mode_mo);
		let password = room.password == 1 ? '<i class="fas fa-lock"></i>' : '<i class="fas fa-lock-open"></i>'

		lobbyListStr += `<li class="lobby"><item id="name" style='align-self: left'>${name}</item><item id="ID">${room.id.toLocaleString()}</item><item id="players">${players}</item><item id="pass">${password}</item><item id="country">${country}</item></li>`;
	}

	var container = document.querySelector('section.content');

    // // stats
    container.innerHTML = '<stats style="display: none"></stats>'

	// maps
	tmpCard = document.createElement('card');
		tmpItem = document.createElement('item');
			tmpItem.id = "";
			tmpItem.innerHTML = `<strong>Lobbies</strong> (${Rooms.length})`;
		tmpCard.appendChild(tmpItem);
		tmpItem = document.createElement('item');
			tmpItem.id = "";
			tmpItem.innerHTML = Rooms.length != 0 ? `<ul><b><li><item id="name">Name</item><item id="ID">ID</item><item id="players">Players</item><item id="pass">Password</item><item id="country">Country</item></li></b><hr/>${lobbyListStr}</ul>` : "There are no maps to display...";
		tmpCard.appendChild(tmpItem);
	container.appendChild(tmpCard);
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
		case 'b': gameMode = 'Classic'; break;
		case 'f': gameMode = 'Football'; break;
		case 'ar': gameMode = 'Arrows'; break;
		case 'ard': gameMode = 'Death Arrows'; break;
		case 'sp': gameMode = 'Grapple'; break;
		case 'v': gameMode = 'VTOL'; break;
		case 's': gameMode = 'Supercar'; break;
		default:  gameMode = '???'; break;
	}

	return {gameType, gameMode};
}

async function fetchLobbies(startingFrom=0) {
	const VERSION = 44;
	let res = await fetch('https://bonkonauts.herokuapp.com/https://bonk2.io/scripts/getrooms.php', { 
		method: 'POST',
		headers: {'Content-Type': 'application/x-www-form-urlencoded'
	}, body: `version=${VERSION}&gl=y&token=`});

    let data = await res.text();
	data = JSON.parse(data);

	return data;
}

function getQuery(qString, query) {
	return qString.split(`&${query}=`)[1].split('&')[0];
}
