function init() {
	window.pathTitle = 'Calculators';
	var calcContainer = document.querySelector('section.content')
	var tmpCard, tmpItem;

	// DBID2DATE
	tmpCard = document.createElement('card');
		tmpItem = document.createElement('item');
			tmpItem.innerHTML = `<strong>DBID<two style="color: #bbb;">2</two>DATE</strong> <note>(Credits to <a href="https://shaunx777.github.io/dbid2date/" target="_blank">Shaunxx</a>)</note><ul><li>Simply paste or type the DBID you would like to convert into a date and it will be done automatically! <comment>(When logged in, it will default to your DBID!)</comment></li></ul><br/><br/><input type="text" id="dbid" placeholder="DBID" ${window.user && window.user.username ? `value="${window.user.id.toLocaleString()}"` : ""} oninput="updateDate(this.value)"/><span id="dbid-date">${window.user && window.user.username ? getRawDate(window.user.id) : ""} </span>`;
		tmpCard.appendChild(tmpItem);
	calcContainer.appendChild(tmpCard);

    // XP2LEVEL
    tmpCard = document.createElement('card');
		tmpItem = document.createElement('item');
			tmpItem.innerHTML = `<strong>XP<slash style="color: #bbb;">/</slash>Level Calculator</strong><br><li><b>Level to XP</b>:<br/><br/><input type="text" id="levelC" placeholder="Level" oninput="updateXP(this.value)"/><span id="level2xp"></span></li><br/><li><b>XP to Level</b>:<br/><br/><input type="text" id="xpC" placeholder="XP" oninput="updateLevel(this.value)"/><span id="xp2level"></span></li>`;
		tmpCard.appendChild(tmpItem);
	calcContainer.appendChild(tmpCard);

	// Goal calculator
	tmpCard = document.createElement('card');
		tmpItem = document.createElement('item');
			tmpItem.innerHTML = `<strong>Goal Calculator</strong><ul><li>Simply input your starting XP/Level, and then a goal XP/Level. <comment>(When logged in, it will default to your XP/Level for starting values!)</comment></li></ul><div class="inputs"><span>Start:</span><input type="text" id="levelS" placeholder="Level" ${window.user && window.user.username ? `value="${xpToLevel(window.user.xp).toLocaleString()}"` : ""} oninput="updateGoal('level', this.value, true)"/><input type="text" id="xpS" placeholder="XP" ${window.user && window.user.username ? `value="${window.user.xp.toLocaleString()}"` : ""} oninput="updateGoal('xp', this.value, true)"/></div><div class="inputs"><span>Goal:</span><input type="text" id="levelG" placeholder="Level" oninput="updateGoal('level', this.value, false)"/><input type="text" id="xpG" placeholder="XP" oninput="updateGoal('xp', this.value, false)"/></div><div id="goal-out"></div>`;
		tmpCard.appendChild(tmpItem);
	calcContainer.appendChild(tmpCard);
}

var prevID = `${window.user && window.user.username ? window.user.id.toLocaleString() : ""}`;
function updateDate(rawID) {
    let output = document.querySelector('#dbid-date');
    let dbidInput = document.querySelector('input#dbid');
    let dbid = typeof rawID === 'string' ? Number(rawID.replace(/,/g,'')) : rawID;

    if(!onlyNumbers(dbid)) { dbidInput.value = prevID.toLocaleString(); return; }
    prevID = dbid;

    if(dbidInput) dbidInput.value = dbid != 0 ? dbid.toLocaleString() : "";

    let date = getRawDate(dbid);
    
    output.innerHTML = dbid != 0 ? date : "";
}

var prevLevel = "";
function updateXP(rawLevel) {
    let output = document.querySelector('#level2xp');
    let levelInput = document.querySelector('input#levelC');
    let level = typeof rawLevel === 'string' ? Number(rawLevel.replace(/,/g,'')) : rawLevel;

    if(!onlyNumbers(level)) { levelInput.value = prevLevel.toLocaleString(); return; }
    prevLevel = level;

    if(levelInput) levelInput.value = level != 0 ? level.toLocaleString() : "";

    let xp = levelToXP(level);
    output.innerHTML = level != 0 ? `XP ${xp.toLocaleString()}` : "";
}
function levelToXP(level) {
    return Math.pow(--level * 10, 2);
}

var prevXP = "";
function updateLevel(rawXP) {
    let output  = document.querySelector('#xp2level');
    let xpInput = document.querySelector('input#xpC');
    let xp = typeof rawXP === 'string' ? Number(rawXP.replace(/,/g,'')) : rawXP;

    if(!onlyNumbers(xp)) { xpInput.value = prevXP.toLocaleString(); return; }
    prevXP = xp;

    if(xpInput) xpInput.value = xp != 0 ? xp.toLocaleString() : "";

    let level = xpToLevel(xp);
    output.innerHTML = xp != 0 ? `Level ${level.toLocaleString()}` : "";
}
function xpToLevel(xp) {
    return Math.floor(Math.sqrt(xp) / 10) + 1;
}


let prevC = "";
function updateGoal(inputType, rawVal, isStart) {
    var output = document.querySelector('#goal-out');
    let currInput = document.querySelector(`input#${inputType}${isStart ? 'S' : 'G'}`);
    let ngbrInput = document.querySelector(`input#${inputType == "xp" ? "level" : "xp" }${isStart ? 'S' : 'G'}`);
    let otherXP = document.querySelector(`input#xp${isStart ? 'G' : 'S'}`);
    let value = typeof rawVal === 'string' ? Number(rawVal.replace(/,/g,'')) : rawVal;

    if(!onlyNumbers(value)) { currInput.value = prevC.toLocaleString(); return; }
    prevC = value;
    
    if(currInput) currInput.value = value != 0 ? value.toLocaleString() : "";
    if(ngbrInput) ngbrInput.value = (value != 0 ? inputType == "xp" ? xpToLevel(value) : levelToXP(value) : "").toLocaleString();

    let startXP  = Number(document.querySelector('input#xpS').value.replace(/,/g,''));
    let goalXP   = Number(document.querySelector('input#xpG').value.replace(/,/g,''));

    if(!otherXP || (otherXP && otherXP.value == "")) { output.innerHTML = ""; return; }

    if(startXP == goalXP ) { output.innerHTML = "<hr/><br/>Goal cannot equal the start!"; return; }
    if(goalXP < startXP)   { output.innerHTML = "<hr/><br/>Goal must be higher than start!"; return; }

    let winCount = Math.ceil((goalXP - startXP) / 100);

	const maxXP = 12000;
	var grindDays = (goalXP - startXP) / maxXP;
	var includeYears = grindDays > 365;
	var grindYears = includeYears ? grindDays / 365 : 0;
	grindYears = ` or <comment>${grindYears.toFixed(2).toLocaleString()}</comment> year${grindYears > 1 ? 's' : ''}`; 
	grindDays = Math.ceil(grindDays);

    var progress = ((startXP / goalXP) * 100).toFixed(2);
    output.innerHTML = `<hr/><br/>
	<div class="progress-stats">${startXP.toLocaleString()} / ${goalXP.toLocaleString()}</div>
	<div class="progress-wrapper"><div class="progress" style="width: ${progress}%"><perc>${progress}%</perc></div></div>
	<item><strong>What will it take?</strong>
		<li>Win <comment>${winCount.toLocaleString()}</comment> games!</li>
		<li>Get max XP (${maxXP.toLocaleString()}) every day for <comment>${grindDays.toLocaleString()}</comment> day${grindDays == 0 || grindDays > 1 ? 's' : ''}${includeYears ? grindYears : ''}!</li>
	</item>
	<br/>`
}

// input filter
function onlyNumbers(val) {
    return /^\d*$/.test(val);
}