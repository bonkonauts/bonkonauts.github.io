function init() {	
	console.log(window.user)
	const AVATARS = [window.user.avatar1, window.user.avatar2, window.user.avatar3, window.user.avatar4, window.user.avatar5];
	const ACTIVE_AVATAR = window.user.activeAvatarNumber;

	var tmpCard, tmpAvatar, tmpActive, tmpPreview, tmpBL;
	window.currentlyPreviewed = {};
	tmpActive = document.createElement('active');

	var mainContainer = document.querySelector('main');
	tmpDiv = document.createElement('div');
	    tmpDiv.id = "image-viewer";
	    tmpW = document.createElement('div');
	        tmpW.className = "close";
			tmpI = document.createElement('i');
				tmpI.className = "fas fa-times";
			tmpW.appendChild(tmpI);
			tmpW.addEventListener('click', (e) => {
				document.querySelector('#image-viewer').style.display = "none";
			});
		tmpDiv.appendChild(tmpW);
	    tmpImg = document.createElement('img');
	        tmpImg.className = 'modal-content';
	        tmpImg.id = 'full-image';
	    tmpDiv.appendChild(tmpImg);
	    tmpDiv.addEventListener('click', (e) => {
	    	if( e.target !== tmpDiv) return;
			document.querySelector('#image-viewer').style.display = "none";
		});
	mainContainer.appendChild(tmpDiv);
	

	var avatarContainer = document.querySelector('section.content');
	avatarContainer.innerHTML = '';
	let count = 1;
	for(let avatar of AVATARS) {
		let previewURL = createPreviewURL(avatar);
		let shareURL   = createShareURL(count, window.user.username, avatar); 
		tmpCard = document.createElement('card');
			tmpAvatar = document.createElement('avatar');
				tmpAvatar.setAttribute('style', `background:url(${previewURL},#111);background-size: 100%;`);
				tmpAvatar.id = count;
				tmpAvatar.addEventListener('click', (e) => {
					var previewer = document.querySelector('#full-image');
					previewer.src = e.srcElement.style.backgroundImage.split('"')[1].split(',')[0];
					currentlyPreviewed.skin = previewer.src;
					currentlyPreviewed.slot = e.srcElement.id;

					document.querySelector('#image-viewer').style.display = "block";
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


function closePreview() {
	document.querySelector('#image-viewer').style.display = "none";			
}

function createPreviewURL(avatar) {
	return `https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode=${encodeURIComponent(avatar)}`;
}

function createShareURL(slotNum, username, avatar) {
	return `https://bonkleagues.io/skins.html#${encodeURIComponent(`Skin Slot ${slotNum.toString()}`)}|${username}|${encodeURIComponent(avatar)}`
}
