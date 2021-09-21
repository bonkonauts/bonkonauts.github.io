function init() {
	var FRIENDS = window.user.friends;
	var LEGACY_FRIENDS = window.user.legacyFriends.split('#');

	var friendsContainer = document.querySelector('section.content');

	const sortFriends = (friends) => friends.sort((a, b) => { if(a.roomid == null && b.roomid != null) return 1; else if(a.roomid != null && b.roomid == null) return -1; return 0; });  
	FRIENDS = sortFriends(FRIENDS);

	var friendListStr = "";
	for(let friend of FRIENDS) {
		friendListStr += `<li class="user"><span id="name">${friend.name}</span><span id="dbid">${friend.id.toLocaleString()}</span><span id="status" class="${friend.roomid ? "online" : "offline"}">${friend.roomid ? "Online" : "Offline"}</span></li>`;
	}
	var legacyFriendListStr = "";
	var legacyFriendCount = 0;
	for(let friend of LEGACY_FRIENDS) {
		if(friend == '') continue;
		legacyFriendListStr += `<li class="user"><span id="name">${friend}</span></li>`
		legacyFriendCount++;
	}

	// friends
	tmpCard = document.createElement('card');
		tmpItem = document.createElement('item');
			tmpItem.id = "friends_title";
			tmpItem.innerHTML = `<strong>Friends</strong> (${FRIENDS.length})`;
		tmpCard.appendChild(tmpItem);
		if(FRIENDS.length != 0) {
			tmpSearch = document.createElement('input');
				tmpSearch.addEventListener('input', (ev) => { 
					updateFriendList(ev.target, FRIENDS, LEGACY_FRIENDS)
				});
				tmpSearch.setAttribute('placeholder', "Username...");
				tmpSearch.name = "friends";
			tmpCard.appendChild(tmpSearch);
		}
		tmpItem = document.createElement('item');
			tmpItem.id = "friends";
			tmpItem.innerHTML = FRIENDS.length != 0 ? `<ul><b><li><span id="name">Username</span><span id="dbid">DBID</span><span id="status">Status</span></li></b><hr/>${friendListStr}</ul>` : "There are no friends to display...";
		tmpCard.appendChild(tmpItem);
	friendsContainer.appendChild(tmpCard);

	// legacy friends
	tmpCard = document.createElement('card');
		tmpItem = document.createElement('item');
			tmpItem.id = "legacy_title";
			tmpItem.innerHTML = `<strong>Flash Friends</strong> (${legacyFriendCount})`;
		tmpCard.appendChild(tmpItem);
		if(legacyFriendCount != 0) {
			tmpSearch = document.createElement('input');
			tmpSearch.addEventListener('input', (ev) => { 
				updateFriendList(ev.target, FRIENDS, LEGACY_FRIENDS)
			});
			tmpSearch.setAttribute('placeholder', "Username...");
			tmpSearch.name = "legacy";
			tmpCard.appendChild(tmpSearch);
		}
		tmpItem = document.createElement('item');
			tmpItem.id = 'legacy';
			tmpItem.innerHTML = legacyFriendCount != 0 ? `<ul><b><li><span id="name">Username</span></li></b><hr/>${legacyFriendListStr}</ul>` : "There are no friends to display...";
		tmpCard.appendChild(tmpItem);
	friendsContainer.appendChild(tmpCard);
}

function updateFriendList(input, friends, legacy_friends) {
	var listToUpdate = document.querySelector(`item#${input.name}`);
	var titleToUpdate = document.querySelector(`item#${input.name}_title`);
	var searchQuery = input.value;
	var friendList = "";
	var friendCount = 0;

	console.log(listToUpdate);

	if(input.name == "friends") {
		for(let friend of friends) {
			if(friend.name.toLowerCase().indexOf(searchQuery.toLowerCase()) == 0) {
				friendList += `<li class="user"><span id="name">${friend.name}</span><span id="dbid">${friend.id.toLocaleString()}</span><span id="status" class="${friend.roomid ? "online" : "offline"}">${friend.roomid ? "Online" : "Offline"}</span></li>`;
				friendCount++;
			}
		}
	}
	else
	{
		for(let friend of legacy_friends) {
			if(friend == '') continue;
			if(friend.toLowerCase().indexOf(searchQuery.toLowerCase()) == 0) {
				friendList += `<li class="user"><span id="name">${friend}</span></li>`;
				friendCount++;
			}
		}
	}
	titleToUpdate.innerHTML = `<strong>${input.name == "friends" ? "Friends" : "Flash Friends"}</strong> (${friendCount})`;
	listToUpdate.innerHTML = friendCount != 0 ? `<ul><b><li><span id="name">Username</span></li></b><hr/>${friendList}</ul>` : "There are no friends to display...";
	
}