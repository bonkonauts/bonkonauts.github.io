function init() {	
	window.AVATARS = [window.user.avatar1, window.user.avatar2, window.user.avatar3, window.user.avatar4, window.user.avatar5];
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
					window.currentlyPreviewed.slot = e.target.id;
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

	currentlyPreviewed.skin = targetSkin.style.backgroundImage.split('"')[1].split(',')[0];

	var mainContainer = document.querySelector('main');
	imgViewer = document.createElement('div');
	    imgViewer.id = "image-viewer";
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
		imgViewer.appendChild(tmpH);
		tmpLeftArrow = document.createElement('div');
			tmpLeftArrow.className = `arrow left ${currentlyPreviewed.slot == 1 && 'disabled'}`;
			tmpI = document.createElement('i');
				tmpI.className = "fa-solid fa-angle-left";
			tmpLeftArrow.appendChild(tmpI);
			currentlyPreviewed.slot != 1 && tmpLeftArrow.addEventListener('click', previewLeft);
		imgViewer.appendChild(tmpLeftArrow);
		tmpRightArrow = document.createElement('div');
			tmpRightArrow.className = `arrow right ${currentlyPreviewed.slot == 5 && 'disabled'}`;
			tmpI = document.createElement('i');
				tmpI.className = "fa-solid fa-angle-right";
			tmpRightArrow.appendChild(tmpI);
			currentlyPreviewed.slot != 5 && tmpRightArrow.addEventListener('click', previewRight);
		imgViewer.appendChild(tmpRightArrow);
		tmpPreview = document.createElement('div');
			tmpPreview.className = "img-preview";
			skinImg = document.createElement('img');
				skinImg.className = 'modal-content';
				skinImg.id = 'full-image';
				skinImg.src = currentlyPreviewed.skin;
			tmpPreview.appendChild(skinImg);
	    imgViewer.appendChild(tmpPreview);
	mainContainer.insertBefore(imgViewer, mainContainer.firstChild);

	window.panzoom = Panzoom(document.querySelector('#full-image'), { });
	panzoom.zoom(1);
	// $('section.content').find('#full-image').panzoom('reset');
	panzoom.bind();
	tmpPreview.addEventListener('wheel', panzoom.zoomWithWheel);
}

function previewLeft() {
	let nextSlot = Number(currentlyPreviewed.slot) - 1;
	if(nextSlot == 0) return;
	nextSlot == 1 && document.querySelector('.left').classList.add('disabled');
	nextSlot != 5 && document.querySelector('.right').classList.remove('disabled');

	let skinSrc = createPreviewURL(AVATARS[nextSlot - 1]);
	document.querySelector('#full-image').src = skinSrc;
	currentlyPreviewed.slot = nextSlot;
	currentlyPreviewed.skin = skinSrc;
}

function previewRight() {
	let nextSlot = Number(currentlyPreviewed.slot) + 1;
	if(nextSlot == 6) return;
	nextSlot == 5 && document.querySelector('.right').classList.add('disabled');
	nextSlot != 1 && document.querySelector('.left').classList.remove('disabled');

	let skinSrc = createPreviewURL(AVATARS[nextSlot - 1]);
	document.querySelector('#full-image').src = skinSrc;
	currentlyPreviewed.slot = nextSlot;
	currentlyPreviewed.skin = skinSrc;
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
