function init() {
	const AVATARS = [window.user.avatar1, window.user.avatar2, window.user.avatar3, window.user.avatar4, window.user.avatar5];
	const ACTIVE_AVATAR = window.user.activeAvatarNumber;

	var tmpCard, tmpAvatar, tmpActive, tmpPreview, tmpBL;
	tmpActive = document.createElement('active');

	var avatarContainer = document.querySelector('section.content');
	let count = 1;
	for(let avatar of AVATARS) {
		let previewURL = createPreviewURL(avatar);
		let shareURL   = createShareURL(count, window.user.username, avatar); 
		tmpCard = document.createElement('card');
			tmpAvatar = document.createElement('avatar');
				tmpAvatar.setAttribute('style', `background:url(${previewURL},#111);background-size: 100%;`);
				tmpAvatar.addEventListener('click', (e) => {
					alert("This is not ready yet!")
				});
			tmpCard.appendChild(tmpAvatar);
			tmpPreview = document.createElement('p');
		        tmpPreview.className = "preview";
			    tmpPreview.innerText = "Preview";
			tmpCard.appendChild(tmpPreview);

			if(count == ACTIVE_AVATAR) tmpCard.appendChild(tmpActive);
			tmpBL = document.createElement('div');
                tmpBL.className = "bl";
                tmpBL.innerHTML = "<p>open in BL</p><img src='https://bonkleagues.io/static/img/editor-logo.png'>";
                tmpBL.addEventListener('click', (e) => {
					window.open(shareURL, "_blank");
				});
			tmpCard.appendChild(tmpBL);
		avatarContainer.appendChild(tmpCard);

		
		count++;
	}
}

function createPreviewURL(avatar) {
	return `https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode=${encodeURIComponent(avatar)}`;
}

function createShareURL(slotNum, username, avatar) {
	return `https://bonkleagues.io/skins.html#${encodeURIComponent(`Skin Slot ${slotNum.toString()}`)}|${username}|${encodeURIComponent(avatar)}`
}
