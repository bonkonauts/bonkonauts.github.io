function init() {
	var userXP = Number(window.user.xp);
	var level = Math.floor(Math.sqrt(userXP) / 10) + 1;
	var nextLevel = Math.pow(level*10, 2);
	var lastLevel = Math.pow((level - 1)*10, 2);
	
	var currThisLevel = userXP - lastLevel;
	var maxThisLevel = nextLevel - lastLevel;
	var percent = ((currThisLevel / maxThisLevel) * 100).toFixed(2) + '%';

	var winCount = Math.ceil((maxThisLevel - currThisLevel) / 100);


	var farmMinutes = (userXP / 2000) * 20;
	var farmMinutesTillNext = ((maxThisLevel - currThisLevel) / 2000) * 20;
	var farmHours = farmMinutes / 60;
	var farmHoursTillNext = farmMinutesTillNext / 60;
	var farmDays = farmMinutes / 1440;
	var farmDaysTillNext = farmMinutesTillNext / 1440;

	if(userXP < -1)
	{
		winCount = Math.abs(Math.ceil((userXP - 0) / 100));
	}

	var milestones = findMilestones(userXP);


	var expContainer = document.querySelector('section.content')

	var tmpCard, tmpItem;

	// xp & level
	tmpCard = document.createElement('card');
		tmpItem = document.createElement('item');
			tmpItem.innerHTML = `<strong>Level</strong><li>${level.toLocaleString()}</li>`;
		tmpCard.appendChild(tmpItem);
		tmpItem = document.createElement('item');
			tmpItem.innerHTML = `<strong>XP</strong><li>${userXP.toLocaleString()}</li>`;
		tmpCard.appendChild(tmpItem);
		tmpItem = document.createElement('item');
			tmpItem.innerHTML = `<strong>Progress</strong>`;
		tmpCard.appendChild(tmpItem);
		tmpItem = document.createElement('item');
			tmpItem.innerHTML = `<div class="progress-stats">${currThisLevel.toLocaleString()} / ${maxThisLevel.toLocaleString()}</div><div class="progress-wrapper"><div class="progress" style="width: ${percent}"><perc>${percent}</perc></div></div>`
		tmpCard.appendChild(tmpItem);
	expContainer.appendChild(tmpCard);

	// needed
	tmpCard = document.createElement('card');
		tmpItem = document.createElement('item');
			tmpItem.innerHTML = `<strong>Gameplay</strong><li>Win ${winCount.toLocaleString()}  games</li>`;
		tmpCard.appendChild(tmpItem);
		tmpItem = document.createElement('item');
			tmpItem.innerHTML = `<strong>XP Boosting</strong><li>Minutes: ~${farmMinutesTillNext.toFixed(2)}</li><li>Hours: ~${farmHoursTillNext.toFixed(2)}</li><li>Days: ~${farmDaysTillNext.toFixed(2)}</li>`;
		tmpCard.appendChild(tmpItem);
	expContainer.appendChild(tmpCard);
	
	// milestones
	tmpCard = document.createElement('card');
		tmpItem = document.createElement('item');
			tmpItem.innerHTML = `<strong>Milestones</strong> <li><b>To level ${milestones[0].level}</b>:`;
		tmpCard.appendChild(tmpItem);
		tmpItem = document.createElement('item');
			tmpItem.innerHTML = `<div class="progress-stats">${userXP.toLocaleString()} / ${milestones[0].xp}</div><div class="progress-wrapper"><div class="progress" style="width: ${milestones[0].percent}%"><perc>${milestones[0].percent}%</perc></div></div>`;
		tmpCard.appendChild(tmpItem);
		tmpItem = document.createElement('item');
			tmpItem.innerHTML = `<li><b>To level ${milestones[1].level}</b>:`;
		tmpCard.appendChild(tmpItem);
		tmpItem = document.createElement('item');
			tmpItem.innerHTML = `<div class="progress-stats">${userXP.toLocaleString()} / ${milestones[1].xp}</div><div class="progress-wrapper"><div class="progress" style="width: ${milestones[1].percent}%"><perc>${milestones[1].percent}%</perc></div></div>`;
		tmpCard.appendChild(tmpItem);
	expContainer.appendChild(tmpCard);

}

function findMilestones(xp) {
	var lvl = Math.floor(Math.sqrt(xp) / 10) + 1;
	var mod = lvl < 50 ? 10 : lvl < 100 ? 25 : 50;
	let found = [];
	let count = 1;
	

	while(found.length < 2) {
		if((lvl + count) % mod == 0) {
			var level = lvl + count;
			var mileXP  = Math.pow(level-1, 2)*100;
			var percent = (xp / mileXP) * 100;
			found.push({level: level, xp: mileXP.toLocaleString(), percent: percent.toFixed(2)});
		}
		count++;
	}

	return found;
}
