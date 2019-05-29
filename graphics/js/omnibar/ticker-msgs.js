

// The bundle name where all the run information is pulled from.
var speedcontrolBundle = 'nodecg-speedcontrol';

// Declaring other variables.
var newDonations = []; // Any new donations are stored for check on the ticks.
var newSubs = []; // Any new subscribers are stored for check on the ticks.
var newTweets = []; // Any new tweets are stored for check on the ticks.
var recentTopDonation;
var showRecentTopDonation;
var recentTopDonationTO;
var topDonationDelay = 300000; // 5 minutes
var showingMessage = false;
var prizeCache = [];
var nextRunsCache = [];
var messageType = 0;

// The chance that a message type will be shown.
var messageTypeChance = {
	0: 3, // Bids
	1: 3, // Prizes
	2: 3, // Upcoming Run
	3: 2, // Recent Top Donation
	4: 1, // ESA promotional message
	5: 1, // StC promotional message
	6: 2, // Donation URL message
	7: 2, // Other stream run information
	8: 1, // Other stream promotion
	9: 1, // Team promotion
	10: 0.2, // Stay Hydrated
	11: 2 // Spreadshirt
	//12: 3 // Rechaaarge
};

// Choose a random index on startup.
chooseRandomMessageType(true);

// Replicants
var bidsRep = nodecg.Replicant('bids');
var prizesRep = nodecg.Replicant('prizes');
prizesRep.on('change', newVal => { prizeCache = newVal; }); // Refill cache on change.
var runDataArray = nodecg.Replicant('runDataArray', speedcontrolBundle);
var runDataActiveRun = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);
var otherStreamInfo = nodecg.Replicant('otherStreamInfo');
var rechaaargeDonationTotal = nodecg.Replicant('rechaaargeDonationTotal');

// JQuery selectors.
var messagesContainer; var messagesLine1; var messagesLine2; var
	messageLinesWrapper;
$(() => {
	messagesContainer = $('#generalMessagesContainer');
	messageLinesWrapper = $('#linesWrapper');
	messagesLine1 = $('#linesWrapper .line1');
	messagesLine2 = $('#linesWrapper .line2');
});

nodecg.listenFor('newDonation', donation => {
	newDonations.push(donation);

	// Stores last donation $20+.
	// It will then be shown every so often until it's pushed off by another one.
	if (parseFloat(donation.amount) >= 20) {
		recentTopDonation = donation;
		resetRecentTopDonationTimer();
	}
});

nodecg.listenFor('newSub', subData => {
	newSubs.push(subData);
});

nodecg.listenFor('newTweet', tweetData => {
	newTweets.push(tweetData);
});

/* var subExample = {
	message: {
		trailing: 'This is a nice marathon youve got here',
		tags: {
			'system-msg': 'AyyJmc\\sjust\\ssubscribed\\swith\\sTwitch\\sPrime!'
		}
	}
};

setTimeout(() => {
	newSubs.push(subExample);
}, 10000); */

/* var tweetExample = {
	message: {
		full_text: 'Leaving for #ESASummer18 now - gonna be picking up 4 Danish mystery guests on the way, stay tuned for more pics 👀 https://t.co/KqlLQlS5sJ'
	},
	user: {
		name: 'Flippy_O'
	}
};

setTimeout(() => {
	newTweets.push(tweetExample);
}, 10000); */

// Donation test code below.
/* var donationExample = {
	id: 1,
	donor_visiblename: 'tester123',
	amount: '25.00',
	comment_state: 'APPROVED',
	comment: 'zoton2\'s test donation which has a lot of Kappa s and a whole load of OneHand s but a bit less 4Head s and hopefully this message is quite long now. It\'s not? OK then we need some more text.',
	time_received: '2018-02-04 16:18:01+00:00'
};

setTimeout(() => {
	newDonations.push(donationExample);
	recentTopDonation = donationExample;
	resetRecentTopDonationTimer();
}, 10000); */

// Bids/prizes test code below.
// var bidsTemp = JSON.parse('[{"id":3,"name":"zoton2 finishes the tracker","total":999,"game":"Inspector Gadget: Mad Robots Invasion","category":"Any%","goal":1000},{"id":4,"name":"Language","total":20,"game":"The Simpsons: Hit & Run","category":"All Story Missions","options":[{"id":5,"parent":4,"name":"English","total":0},{"id":6,"parent":4,"name":"French","total":0},{"id":7,"parent":4,"name":"German","total":0},{"id":8,"parent":4,"name":"Spanish","total":20}]}]');
// var prizesTemp = JSON.parse('[{"id":2,"name":"Stream Deck","provided":"Elgato","minimum_bid":5,"start_timestamp":"2018-02-20T05:00:00Z","end_timestamp":"2018-02-21T11:00:00Z"}]');

// returns a random bid (filtered to bids in the next 24h, with a slight bias towards bids coming soon)
var lastBidID = null;
function getRandomBid() {
	const bidChoices = [];
	let totalWeight = 0;
	bidsRep.value.forEach(bid => {
		// anything within the next 10 minutes has a relative weight of 1, beyond that theres a quadratic falloff
		let weight = Math.max(Math.min(10 * 60 * 1000 / (bid.end_time - Date.now()), 1), 0) ** 2;
		if (bid.id === lastBidID) weight = 0;
		bidChoices.push({ bid, weight });
		totalWeight += weight;
	});
	let randomValue = Math.random();
	const bidToReturn = bidChoices.find(option => {
		// the actual chance is the relative weight divided by the total weight
		const chance = option.weight / totalWeight;
		if (chance >= randomValue) {
			lastBidID = option.bid.id;
			return true;
		}
		randomValue -= chance;
		return false;
	});
	if (bidToReturn) return bidToReturn.bid;
	return null;
}

// Cycles the actual ticker messages that can be shown.
// Triggered every tick from tick-handler.js
function showTickerMessages() {
	var retry = false; // If this becomes true, we'll run this function again.

	// Skip tick if still showing a message.
	if (showingMessage) { return; }

	// Showing new donations has priority.
	if (newDonations.length > 0) {
		showDonation(newDonations[0], true);
		newDonations.shift(); // Remove first donation.
		return;
	}

	if (newSubs.length > 0) {
		showSub(newSubs[0]);
		newSubs.shift(); // Remove first sub.
		return;
	}

	if (newTweets.length > 0) {
		showTweet(newTweets[0]);
		newTweets.shift(); // Remove first tweet.
		return;
	}

	// Bids
	if (messageType === 0) {
		if (!showBid()) retry = true;
	}

	// Prizes
	if (messageType === 1) {
		// if (prizesTemp.length > 0) {
		if (prizesRep.value.length > 0) {
			showPrize();
		} else { retry = true; }
	}

	// Upcoming Run
	if (messageType === 2) {
		// Will only trigger this if there's at least 1 run still to come.
		var indexOfCurrentRun = findIndexInRunDataArray(runDataActiveRun.value);
		if (runDataArray.value[indexOfCurrentRun + 1]) {
			showUpcomingRun();
		} else retry = true;
	}

	// Recent Top Donation
	if (messageType === 3) {
		if (showRecentTopDonation && recentTopDonation) {
			showDonation(recentTopDonation, false);
			resetRecentTopDonationTimer();
		} else retry = true;
	}

	// ESA promotional message.
	if (messageType === 4) {
		displayMessage('<span class="textGlow">This is European Speedrunner Assembly Winter 2019</span>', null, 33, null, true);
	}

	// StC promotional message.
	if (messageType === 5) {
		displayMessage('<span class="textGlow">#ESAWinter19 benefits Save the Children</span>', null, 33, null, true);
	}

	// Donation URL message.
	if (messageType === 6) {
		var eventShort = nodecg.bundleConfig.stream2 ? 'esaw2019s2' : 'esaw2019s1';
		displayMessage(`<span class="textGlow">Donate @ <span class="greyText">donations.esamarathon.com/donate/${eventShort}</span></span>`, null, 33, null, true);
	}

	// Other stream run information.
	if (messageType === 7) {
		if (otherStreamInfo.value && !formPlayerNamesString(otherStreamInfo.value).toLowerCase().includes('sleepblock')) { showOtherStreamInfo(); } else { retry = true; }
	}

	// Other stream promotion.
	if (messageType === 8) {
		var streamChannel = nodecg.bundleConfig.stream2 ? 'esa' : 'esamarathon2';
		displayMessage(`<span class="textGlow">Watch more great runs over @ <span class="greyText">twitch.tv/${streamChannel}</span>!</span>`, null, 33, null, true);
	}

	// Team promotion.
	if (messageType === 9) {
		displayMessage('<span class="textGlow">Check out our Twitch team @ <span class="greyText">twitch.tv/team/esa</span>!</span>', null, 33, null, true);
	}

	// Stay Hydrated
	if (messageType === 10) {
		displayMessage('<span class="textGlow">Are you remembering to stay hydrated?</span>', null, 33, null, true);
	}

	// Spreadshirt
	if (messageType === 11) {
		displayMessage('<span class="textGlow">Want your own ESA shirt or hoodie? Order them @ <span class="greyText">shop.spreadshirt.net/esamarathon</span>!</span>', null, 33, null, true);
	}

	// Rechaaarge
	if (messageType === 12) {
		if (rechaaargeDonationTotal.value > 0) {
			displayMessage(`<span class="textGlow">$${rechaaargeDonationTotal.value.toFixed(2)} has been donated via <span class="greyText">rechaaarge.com/esamarathon</span>: donate for free!</span>`, null, 33, null, true);
		}

		else {
			retry = true;
		}
	}

	chooseRandomMessageType();
	if (retry) { showTickerMessages(); }
}

var entityMap = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;',
	'/': '&#x2F;',
	'`': '&#x60;',
	'=': '&#x3D;'
};

function escapeHtml(string) {
	return String(string).replace(/[&<>"'`=/]/g, s => entityMap[s]);
}

// Formats donations to be sent to displayMessage.
function showDonation(donation, isNew) {
	var user = donation.donor_visiblename;
	var amount = ` (${formatDollarAmount(parseFloat(donation.amount))})`;
	let line1;
	if (isNew) {
		line1 = `<span class="messageUppercase textGlow">New Donation:</span> ${user}${amount}`;
	} else {
		line1 = user + amount;
	}

	// Regex removes multiple spaces/newlines from donation messages.
	var message = donation.comment;
	message = (message && message !== '') ? escapeHtml(message.replace(/\s\s+|\n/g, ' ')) : undefined;

	displayMessage(line1, message, 25, 22);
}

function showTweet(tweetData) {
	var user = tweetData.user.name;

	// Regex removes multiple spaces/newlines from tweets.
	var message = tweetData.message.full_text;
	message = (message && message !== '') ? message.replace(/\s\s+|\n/g, ' ') : undefined;

	// Regex removes Twitter URL shortener links.
	message = message.replace(/https:\/\/t\.co\/\w+/g, match => {
		if (tweetData.message.entities && tweetData.message.entities.urls && tweetData.message.entities.urls.length > 0) {
			const replacementUrl = tweetData.message.entities.urls.find(urlInfo => urlInfo.url === match);
			if (replacementUrl) return replacementUrl.display_url;
		}
		return '';
	});

	var line1 = `<img src="img/twitter-logo.png" class="emoji"> ${escapeHtml(user)}`;
	var line2 = message;

	displayMessage(line1, line2, 25, 22);
}

function showSub(subData) {
	var systemMsg = subData.message.tags['system-msg'].replace(/\\s/g, ' ');

	let message;
	// Regex removes multiple spaces/newlines from custom resub message.
	if (subData.message.trailing) {
		message = subData.message.trailing;
		message = (message && message !== '') ? message.replace(/\s\s+|\n/g, ' ') : undefined;
	}

	var line1 = escapeHtml(systemMsg);
	var line2 = message;

	displayMessage(line1, line2, 25, 22);
}

// Handles bids cache if empty and chooses one at random to show.
function showBid() {
	var bid = getRandomBid();
	if (!bid) return null;

	let line1;
	let line2;

	// Normal Goal
	if (!bid.options) {
		line1 = `<span class="messageUppercase textGlow">Upcoming Goal:</span> ${bid.game} - ${bid.category}`;
		line2 = `<span class="greyText">${bid.name}</span> (${bid.description}): ${formatDollarAmount(bid.total)}/${formatDollarAmount(bid.goal)}`;
	}

	// Bid War
	else {
		line1 = `<span class="messageUppercase textGlow">Upcoming Bid War:</span> ${bid.game} - ${bid.category}`;
		line2 = `<span class="greyText">${bid.name}</span> (${bid.description}): `;
		var optionsFormatted = [];
		bid.options.forEach(option => {
			optionsFormatted.push(`${option.name} (${formatDollarAmount(option.total)})`);
		});
		if (!optionsFormatted.length) {
			line2 += '<i>No options submitted yet, be the first!</i>';
		} else {
			if (bid.allow_user_options) { optionsFormatted.push('<i>...or you could submit your own idea!</i>'); }
			line2 += optionsFormatted.join('/');
		}
	}

	displayMessage(line1, line2, 25, 23);
	return bid;
}

// Handles prize cache if empty and chooses one at random to show.
function showPrize() {
	if (!prizeCache.length) prizeCache = prizesRep.value; // Refill prize cache if it's empty.
	// if (!prizeCache.length) prizeCache = prizesTemp;
	var random = getRandomInt(prizeCache.length);
	var prize = prizeCache[random]; // Pick random prize from the cache.
	prizeCache.splice(random, 1); // Remove this prize from the cache.

	var line1 = `<span class="messageUppercase textGlow">Prize Available:</span> ${prize.name}`;
	var line2 = `Provided by ${prize.provided}, minimum donation amount: ${formatDollarAmount(prize.minimum_bid)} (donate in the next ${getPrizeTimeUntilString(prize)})`;

	displayMessage(line1, line2, 26, 20);
}

// Pick an upcoming run and display it.
function showUpcomingRun() {
	// Refill cache if empty.
	if (!nextRunsCache.length) nextRunsCache = getNextRuns(runDataActiveRun.value, 4);

	// Need a while loop in case the run we pick can't be shown.
	var randomRun;
	while (!randomRun) {
		var randomInt = getRandomInt(nextRunsCache.length);

		// Check if run is still to come, if not we need to ignore it.
		// Also need to ignore it if there is no scheduled time set.
		if (nextRunsCache[randomInt].scheduledS
			&& nextRunsCache[randomInt].scheduledS > moment().unix()) { randomRun = nextRunsCache[randomInt]; }

		nextRunsCache.splice(randomInt, 1);
		if (!nextRunsCache.length) break;
	}
	if (!randomRun) return; // This shouldn't happen, just a safe guard in case.

	var when = moment.unix(randomRun.scheduledS).fromNow();
	var line1 = `<span class="messageUppercase textGlow">Coming Up ${when}:</span> ${randomRun.game}`;
	var line2 = '';

	if (randomRun.category) line2 += `${randomRun.category}`;
	if (randomRun.system) line2 += ` ran on ${randomRun.system}`;
	if (checkForTotalPlayers(randomRun) > 0) line2 += ` with ${formPlayerNamesString(randomRun)}`;

	displayMessage(line1, line2, 25, 22);
}

// Show information about the run on the other stream.
function showOtherStreamInfo() {
	var streamChannel = nodecg.bundleConfig.stream2 ? 'esa' : 'esamarathon2';
	var line1 = `<span class="messageUppercase textGlow">Currently on @ twitch.tv/${streamChannel}:</span> ${otherStreamInfo.value.game}`;
	var line2 = '';

	if (otherStreamInfo.value.category) line2 += `${otherStreamInfo.value.category}`;
	if (otherStreamInfo.value.system) line2 += ` ran on ${otherStreamInfo.value.system}`;
	if (checkForTotalPlayers(otherStreamInfo.value) > 0) line2 += ` with ${formPlayerNamesString(otherStreamInfo.value)}`;

	displayMessage(line1, line2, 25, 22);
}

// Changes and fully displays the message lines supplied, and changes font size if specified.
function displayMessage(l1Message, l2Message, fontSize1, fontSize2, center) {
	denyMessageToChange();

	var amountToScroll = 0;
	var amountToWait = 2000; // Waiting before/after scrolling.
	var timeToShow = 21000 - (amountToWait * 2); // All messages get at least 21 seconds (excluding fades).
	var timeToScroll = 0;
	fontSize1 = fontSize1 || 24;
	fontSize2 = fontSize2 || 24;

	animationFadeOutElement(messageLinesWrapper, () => {
		messagesLine1.html(l1Message);
		messagesLine2.css('margin-left', '0px'); // Reset margin for scrolling if needed.

		// Changing font sizes.
		messagesLine1.css('font-size', `${fontSize1}px`);
		messagesLine2.css('font-size', `${fontSize2}px`);

		// To center or not.
		if (center) { messagesContainer.css('align-items', 'center'); } else { messagesContainer.css('align-items', 'flex-start'); }

		if (!l2Message) { messagesLine2.hide(); } else {
			messagesLine2.show();
			l2Message = replaceEmotes(l2Message); // Replace emoticon names with their images.
			l2Message = twemoji.parse(l2Message); // Replace emojis with Twitter ones.
			messagesLine2.html(l2Message);
		}

		// Waiting for all images to load in before measuring width.
		// Either emojis or emoticons need to be loaded in if present.
		messageLinesWrapper.waitForImages(() => {
			if (l2Message) {
				// We need to scroll if the message width is bigger than the container.
				if (messagesContainer.width() < messagesLine2.width()) {
					amountToScroll = messagesLine2.width() - messagesContainer.width();
					timeToScroll = amountToScroll * 13;

					// Make time to scroll the full amount of time if it's too short.
					if (timeToScroll < timeToShow) { timeToScroll = timeToShow; }
				}
			}

			animationFadeInElement(messageLinesWrapper, () => {
				// Do the scrolling logic if we need to.
				if (amountToScroll > 0) {
					// Animate text after a delay so it scrolls and everything is seen.
					messagesLine2.delay(amountToWait).animate({ 'margin-left': `-${amountToScroll}px` }, timeToScroll, 'linear', () => {
						setTimeout(allowMessageToChange, amountToWait);
					});
				} else { setTimeout(allowMessageToChange, (amountToWait * 2) + timeToShow); }
			});
		});
	});
}

// Randomly chooses the next message type to show, excluding what was just shown.
function chooseRandomMessageType(init) {
	var messageTypeList = [];

	for (var messageTypeKey in messageTypeChance) {
		if (!init && messageTypeKey === messageType) continue; // Skip current message type.
		var chance = messageTypeChance[messageTypeKey];

		// Rare message dice roll on if it appears or not.
		if (chance < 1) {
			var random = getRandomFloat(1 / chance);
			if (random >= (1 / chance) - 1) {
				chance = 1;
			} else continue; // Skip current message type.
		}

		for (var i = 0; i < chance; i++) {
			messageTypeList.push(parseInt(messageTypeKey));
		}
	}

	messageType = messageTypeList[getRandomInt(messageTypeList.length)];
}

// Helper function used above to reset variables/timeouts.
function resetRecentTopDonationTimer() {
	showRecentTopDonation = false;
	clearTimeout(recentTopDonationTO);
	recentTopDonationTO = setTimeout(() => { showRecentTopDonation = true; }, topDonationDelay);
}

// Simple function to reference when needed.
function allowMessageToChange() {
	showingMessage = false;
}

// Simple function to reference when needed.
function denyMessageToChange() {
	showingMessage = true;
}
