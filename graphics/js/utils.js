'use strict';

// Replicants
var emotes = nodecg.Replicant('emotes');
var runDataArray = nodecg.Replicant('runDataArray', 'nodecg-speedcontrol');

// Get the next X runs in the schedule.
function getNextRuns(runData, amount) {
	var nextRuns = [];
	var indexOfCurrentRun = findIndexInRunDataArray(runData);
	for (var i = 1; i <= amount; i++) {
		if (!runDataArray.value[indexOfCurrentRun+i]) break;
		nextRuns.push(runDataArray.value[indexOfCurrentRun+i]);
	}
	return nextRuns;
}

// Returns how long until a run, based on the estimate of the previous run.
function formETAUntilRun(previousRun, whenTotal) {
	var whenString = '';
	if (!previousRun) whenString = 'Next';
	else {
		var previousRunTime = previousRun.estimateS + previousRun.setupTimeS;
		var formatted = moment.utc().second(0).to(moment.utc().second(whenTotal+previousRunTime), true);
		whenString = 'In about '+formatted;
		whenTotal += previousRunTime;
	}
	return [whenString, whenTotal];
}

// Converts milliseconds to a time string.
function msToTime(duration, noHour) {
	var seconds = parseInt((duration/1000)%60),
		minutes = parseInt((duration/(1000*60))%60),
		hours = parseInt((duration/(1000*60*60))%24);
	
	hours = (hours < 10) ? '0' + hours : hours;
	minutes = (minutes < 10) ? '0' + minutes : minutes;
	seconds = (seconds < 10) ? '0' + seconds : seconds;
	
	var timeString = '';
	
	if (!noHour)
		timeString += hours+':';
	timeString += minutes + ':' + seconds;
	
	return timeString;
}

// Goes through each team and members and makes a string to show the names correctly together.
function formPlayerNamesString(runData) {
	var namesArray = [];
	var namesList = 'No Player(s)';
	runData.teams.forEach(team => {
		var teamPlayerArray = [];
		team.players.forEach(player => {teamPlayerArray.push(player.name);});
		namesArray.push(teamPlayerArray.join(', '));
	});
	if (namesList.length) namesList = namesArray.join(' vs. ');
	return namesList;
}

// Returns the total amount of players a run has.
function checkForTotalPlayers(runData) {
	var amount = 0;
	runData.teams.forEach(team => team.players.forEach(player => amount++));
	return amount;
}

// Find array index of current run based on it's ID.
function findIndexInRunDataArray(run) {
	var indexOfRun = -1;
	
	// Completely skips this if the run variable isn't defined.
	if (run) {
		for (var i = 0; i < runDataArray.value.length; i++) {
			if (run.id === runDataArray.value[i].id) {
				indexOfRun = i; break;
			}
		}
	}
	
	return indexOfRun;
}

// Get a random integer, usually for selecting array elements.
// You will never get max as an output.
function getRandomInt(max) {
	return Math.floor(Math.random()*Math.floor(max));
}

function getRandomFloat(max) {
	return Math.random()*max;
}

// Used to get the width of supplied text.
function getTextWidth(text, size) {
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	ctx.font = size+'px "Barlow Condensed"'; /* Change if layout is changed. */
	return ctx.measureText(text).width;
}

// Replaces emoticon names in a text string with imgs.
function replaceEmotes(text) {
	var textSplit = text.split(' ');
	for (var i = 0; i < textSplit.length; i++) {
		if (emotes.value[textSplit[i]])
			textSplit[i] = '<img class="emoji" draggable="false" alt="'+textSplit[i]+'" src="https://static-cdn.jtvnw.net/emoticons/v1/'+emotes.value[textSplit[i]].id+'/3.0">';
	}
	return textSplit.join(' ');
}

// Formats dollar amounts to the correct string.
function formatDollarAmount(amount, forceRemoveCents) {
	// We drop the cents and add a comma over $1000.
	if (amount < 1000 && !forceRemoveCents)
		return '$'+amount.toFixed(2);
	else
		return '$'+Math.floor(amount).toLocaleString('en-US', {minimumFractionDigits: 0});
}

// calculate the time until the prize period ends and render it as a human readable string ("an hour", "20 minutes")
function getPrizeTimeUntilString(prize) {
	var timeUntil = moment(prize.end_timestamp).fromNow(true);
	timeUntil = timeUntil.replace('an ', ''); // Dirty fix for "Donate in the next an hour".
	timeUntil = timeUntil.replace('a ', ''); // Dirty fix for "Donate in the next a day".
	return timeUntil;
}

// Change if an element is visible or not.
function changeVisibility(elem, isVisible) {
	$(elem).css({
		visibility: isVisible ? 'visible' : 'hidden'
	});
}

function createAssetArrayWithChances(arr) {
	var newArr = [];
	arr.forEach(asset => {
		for (var i = 0; i < asset.chance; i++) {
			newArr.push(asset);
		}
	});
	return newArr;
}