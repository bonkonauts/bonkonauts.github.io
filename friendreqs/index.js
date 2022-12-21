async function init() {
	window.pathTitle = 'Friend Requests';
	window.REQUESTS = await fetchRequests();
	var container = document.querySelector('section.content');




	var reqListStr = "";
	for(let request of REQUESTS) {
		reqListStr += `<li class="user"><span id="name">${request.name.substring(0, 15)}${request.name.length > 15 ? '...' : ''}</span><span id="creation">${getRawDate(request.id)}</span><span id="dbid">${request.id.toLocaleString()}</span><span id="date">${request.date}</span><span id="add"><icon id="${request.id}" class="a" onclick="addFriend(this)"><i class="fas fa-user-plus"></i></icon><icon id="${request.id}" class="d" onclick="deleteFriend(this)"><i class="fas fa-user-minus"></i></icon></span></li>`;
	}

	container.innerHTML = '';

	// friends
	tmpCard = document.createElement('card');
		tmpItem = document.createElement('item');
			tmpItem.innerHTML = `<strong>Requests</strong> (${REQUESTS.length})`;
		tmpCard.appendChild(tmpItem);
		// if(FRIENDS.length != 0) {
		// 	tmpSearch = document.createElement('input');
		// 		tmpSearch.addEventListener('input', (ev) => { 
		// 			updateFriendList(ev.target, FRIENDS, LEGACY_FRIENDS)
		// 		});
		// 		tmpSearch.setAttribute('placeholder', "Username...");
		// 		tmpSearch.name = "friends";
		// 	tmpCard.appendChild(tmpSearch);
		// }
		tmpItem = document.createElement('item');
			tmpItem.id = "requests";
			tmpItem.innerHTML = REQUESTS.length != 0 ? `<ul><b><li><span id="name">Username</span><span id="creation">~ Account Age</span><span id="dbid">DBID</span><span id="date">Request Date</span><span id="action">Add / Decline</span></li></b><hr/>${reqListStr}</ul>` : "You don't have any friend requests right now...";
		tmpCard.appendChild(tmpItem);
	container.appendChild(tmpCard);

}

async function fetchRequests() {
	if(typeof window.user.token != 'string') return null;
	let res = await fetch('https://cors-anywhere.herokuapp.com/https://bonk2.io/scripts/friends.php', { 
		method: 'POST',
		headers: {'Content-Type': 'application/x-www-form-urlencoded'
	}, body: `task=getfriends&token=${window.user.token}`});

    let data = await res.json();

	return data.requests;
}

async function addFriend(elem) {
	if(typeof window.user.token != 'string') return null;
	let friendEL = elem.parentElement.parentElement;
	let container = friendEL.parentElement;
	let friendID = elem.id;
	let friend = getFriendByID(friendID);

	let res = await fetch('https://cors-anywhere.herokuapp.com/https://bonk2.io/scripts/friends.php', { 
		method: 'POST',
		headers: {'Content-Type': 'application/x-www-form-urlencoded'
	}, body: `task=accept&theirid=${friend.id}&token=${window.user.token}`});
	
	let data = await res.json();
	if(data.r != 'accept_success') return bonkError();

	AlertEmitter.emit('success', `You have added '${friend.name}' as a friend...`)

	container.removeChild(friendEL);
}
async function deleteFriend(elem) {
	if(typeof window.user.token != 'string') return null;


	let friendEL = elem.parentElement.parentElement;
	let container = friendEL.parentElement;
	let friendID = elem.id;
	let friend = getFriendByID(friendID);

	let shouldDelete = confirm(`Are you sure you want to delete '${friend.name}' as a friend?`);
	if(!shouldDelete) return;

	let res = await fetch('https://cors-anywhere.herokuapp.com/https://bonk2.io/scripts/friends.php', { 
		method: 'POST',
		headers: {'Content-Type': 'application/x-www-form-urlencoded'
	}, body: `task=deleterequest&theirid=${friend.id}&token=${window.user.token}`});


	let data = await res.json();
	if(data.r != 'success') return bonkError();

	AlertEmitter.emit('success', `You have declined '${friend.name}' as a friend...`)

	container.removeChild(friendEL);
}
function bonkError() {
	AlertEmitter.emit('error', 'That action could not be performed at this time, please try again later...')
}
function getFriendByID(id) {
	for(let i = 0; i < window.REQUESTS.length; i++) {
		let r = window.REQUESTS[i];
		if(r.id == id) return r;
	}
}