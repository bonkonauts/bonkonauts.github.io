function init() {	
	window.pathTitle = 'Avatars';
	window.AVATARS = [window.user.avatar1, window.user.avatar2, window.user.avatar3, window.user.avatar4, window.user.avatar5];
	const ACTIVE_AVATAR = window.user.activeAvatarNumber;
	window.Skindex = getSkindex();

	var tmpCard, tmpAvatar, tmpActive, tmpPreview, tmpBL, tmpLink;
	window.currentlyPreviewed = {};
	tmpActive = document.createElement('active');

	
	var avatarContainer = document.querySelector('section.content');
	avatarContainer.innerHTML = '';
	let count = 1;
	for(let avatar of AVATARS) {
		let previewURL = createPreviewURL(avatar);
		let skinName	 = checkSkindex(avatar);
		let altName		= `Skin Slot ${count}`;
		let shareURL	 = createShareURL(count, window.user.username, avatar); 
		tmpCard = document.createElement('card');
			tmpNameIn = document.createElement('input');
				tmpNameIn.type = "text";
				tmpNameIn.className = "name";
				tmpNameIn.maxLength = 20;
				tmpNameIn.value = skinName ? skinName : '';
				tmpNameIn.placeholder = `Avatar ${count}`;
				tmpNameIn.addEventListener('change', (e) => { saveSkin(e, avatar); });
			tmpCard.appendChild(tmpNameIn);


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
					skinName = checkSkindex(avatar);
					shareURL = createShareURL(skinName ? skinName : altName, window.user.username, avatar); 
					window.open(shareURL, "_blank");
				});
			tmpCard.appendChild(tmpBL);

			tmpLink = document.createElement('span');
				tmpLink.className = "link";
				tmpLink.innerHTML = '<i class="fa-solid fa-link"></i>';
				tmpLink.addEventListener('click', async (e) => {
					let parent;
					for(parent = e.target; parent.tagName != 'CARD'; parent = parent.parentElement);
					if(parent.querySelector('.popup')) return;

					skinName = checkSkindex(avatar);
					shareURL = createShareURL(skinName ? skinName : altName, window.user.username, avatar); 
					let shortURL = await createShortURL(shareURL);
					let copied = await copyToClipboard(shortURL);
					if(copied) {
						e.target.innerHTML = '<i class="fa-solid fa-check"></i>';
						
						let popup = document.createElement('div');
							popup.className = "popup";
							popup.innerText = "Copied to clipboard!";
						parent.appendChild(popup);

						setTimeout(() => {
							e.target.innerHTML = '<i class="fa-solid fa-link"></i>';
							parent.removeChild(popup);
						}, 3500);
					}
					else {
						e.target.innerHTML = '<i class="fa-solid fa-times"></i>';
						setTimeout(() => {
							e.target.innerHTML = '<i class="fa-solid fa-link"></i>';
						}, 3500);
					}
				});
			tmpCard.appendChild(tmpLink);
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

function getSkindex() {
	let skindex = localStorage.getItem('skindex');
	if(skindex) return JSON.parse(skindex);
	return [];
}

function checkSkindex(avData) {
	for(let i = 0; i < Skindex.length; i++) {
		if(Skindex[i].includes(avData)) return Skindex[i].split('|')[0];
	}
	return false;
}

function setSkindex(skindex) {
	localStorage.setItem('skindex', JSON.stringify(skindex));
}

function saveSkin(e, avatar) {
	if(e.target.value.length <= 0) return deleteSkin(avatar);

	deleteSkin(avatar);
	let skinName = e.target.value;
	skinName = skinName.length > 20 ? skinName.substring(0, 20) : skinName;
	let skinData = `${skinName}|${avatar}`;
	Skindex.push(skinData);
	setSkindex(Skindex);
}

function deleteSkin(avatar) {
	let didDelete = false;
	for(let i = 0; i < Skindex.length; i++) {
		if(Skindex[i].includes(avatar)) { Skindex.splice(i, 1); didDelete = true; }
	}
	setSkindex(Skindex);
	return didDelete;
}

function createPreviewURL(avatar) {
	return `https://bonkleaguebot.herokuapp.com/avatar.svg?skinCode=${encodeURIComponent(avatar)}`;
}

function createShareURL(slotName, username, avatar) {
	return `https://bonkleagues.io/skins.html#${encodeURIComponent(`${slotName.toString()}`)}|${username}|${encodeURIComponent(avatar)}`
}

async function createShortURL(shareURL) {
	let url = `https://bonkleaguebot.herokuapp.com/shorten?url=${encodeURIComponent(shareURL)}`;
	let res = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
	let data = await res.json();
	if(data.url) return data.url;
	return false;
}

function fallbackCopyToClipboard(text) {
	var textArea = document.createElement("textarea");
	textArea.value = text;
	
	// Avoid scrolling to bottom
	textArea.style.top = "0";
	textArea.style.left = "0";
	textArea.style.position = "fixed";
	
	document.body.appendChild(textArea);
	textArea.focus();
	textArea.select();

	var successful;
	try {
		successful = document.execCommand('copy');
	} catch (err) {
		return false
	}
	
	document.body.removeChild(textArea);
	return successful;

}
// return a promise
async function copyToClipboard(text) {
	if (!navigator.clipboard) {
		return fallbackCopyToClipboard(text);
	}
	return new Promise((resolve, reject) => {
		navigator.clipboard.writeText(text).then(() => {
			resolve(true);
		}, err => {
			reject(false);
		});
	});
}