function init() {	
	const AVATARS = [window.user.avatar1, window.user.avatar2, window.user.avatar3, window.user.avatar4, window.user.avatar5];
	const ACTIVE_AVATAR = window.user.activeAvatarNumber;

	var tmpCard, tmpAvatar, tmpActive, tmpPreview, tmpBL;
	window.currentlyPreviewed = {};
	tmpActive = document.createElement('active');

	
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
					buildPreviewer(e.srcElement);
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

function buildPreviewer(targetSkin) {
	if(document.querySelector('#image-viewer')) document.querySelector('#image-viewer').innerHTML = '';

	var mainContainer = document.querySelector('main');
	tmpDiv = document.createElement('div');
	    tmpDiv.id = "image-viewer";
		tmpH = document.createElement('header');
			tmpH.className = "img-header"
			tmpNote = document.createElement('div');
				tmpNote.innerText = "Use your mouse to pan and zoom the skin.";
			tmpH.appendChild(tmpNote);
			tmpW = document.createElement('div');
				tmpW.className = "close";
				tmpI = document.createElement('i');
					tmpI.className = "fas fa-times";
				tmpW.appendChild(tmpI);
				tmpW.addEventListener('click', closePreview);
			tmpH.appendChild(tmpW);
		tmpDiv.appendChild(tmpH);
		tmpPreview = document.createElement('div');
			tmpPreview.className = "img-preview";
			skinImg = document.createElement('img');
				skinImg.className = 'modal-content';
				skinImg.id = 'full-image';
				skinImg.src = targetSkin.style.backgroundImage.split('"')[1].split(',')[0];
			tmpPreview.appendChild(skinImg);
	    tmpDiv.appendChild(tmpPreview);
	mainContainer.insertBefore(tmpDiv, mainContainer.firstChild);

	currentlyPreviewed.skin = skinImg.src;
	currentlyPreviewed.slot = skinImg.id;


	window.panzoom = Panzoom(document.querySelector('#full-image'), { });
	panzoom.zoom(1);
	// $('section.content').find('#full-image').panzoom('reset');
	panzoom.bind();
	tmpPreview.addEventListener('wheel', panzoom.zoomWithWheel);
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
