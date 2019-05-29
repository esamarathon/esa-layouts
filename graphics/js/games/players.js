'use strict';
$(() => {
	// TODO: if you need 2+ feeds for a co-op run, the names currently don't work,
	// not sure if we need this though.

	// The bundle name where all the run information is pulled from.
	var speedcontrolBundle = 'nodecg-speedcontrol';

	// JQuery selectors.
	var playersWrapper = $('#playersWrapper'); // Wrapper to be used on 1 player layouts.
	var playerWrapperMulti = $('.playerWrapperMulti'); // Array of wrappers to be used on 2+ player layouts.

	var playerContainers = $('.playerContainer'); // Array of ALL of the player containers in both elements above.
	var playerContainers1P = $('.playerContainer', playersWrapper); // Array of player containers within playersWrapper.
	var playerContainersMulti = $('.playerContainer', playerWrapperMulti); // Array of player containers within the Multi wrappers.

	var finishTimes = $('.finishTime'); // Array of finish timers (*should* be in the same order as the players).

	var tickRateName = 45000;
	var tickRateTwitch = 15000;
	var tickTimeout;
	var currentTeamsData = []; // All teams data is stored here for reference when changing.
	var teamPlayerIndex = []; // Stores what team member of each team is currently being shown.

	var runDataActiveRunCache = {};
	
	var runDataActiveRun = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);
	runDataActiveRun.on('change', (newVal, oldVal) => {
		if (newVal) {
			// Dumb comparison to stop the data refreshing if the server restarts.
			if (JSON.stringify(newVal) !== JSON.stringify(runDataActiveRunCache)) {
				updateSceneFields(newVal);
				runDataActiveRunCache = newVal;
			}
		}
	});

	function updateSceneFields(runData) {
		currentTeamsData = [];

		// For this co-op run that uses 2 screens, pretend each co-op partner is in a different team.
		// LEFT HERE AS AN EXAMPLE IF NEEDED THIS EVENT!
		if (runData.game.toLowerCase() === 'Example Game That Does Not Exist') {
			for (var i = 0; i < 2; i++) {
				var teamData = {players: []};
				teamData.players.push(createPlayerData(runData.teams[0].players[i]));
				currentTeamsData.push(teamData);
			}
		}

		else {
			runData.teams.forEach(team => {
				var teamData = {players: []};
				team.players.forEach(player => {teamData.players.push(createPlayerData(player));});
				currentTeamsData.push(teamData);
			});
		}

		animationFadeOutElement(playerContainers, () => {
			// For 1P we only care about the first team and any extra co-op players.
			playerContainers1P.each((i, elem) => {
				var team = currentTeamsData[0];
				
				// End all loops if no team exists, we're at the end.
				if (!team) return false;

				var player = team.players[i];

				// Hide element and skip to next loop if no player exists.
				if (!player) {
					$(elem).css('display', 'none');
					return true;
				}

				$('.twitchLogo', elem).hide();
				$('.nameLogo', elem).show();
				$(elem).width('');
				$('.playerName', elem).text(player.name);
				if (player.country) {
					$('.flag', elem).attr('src', 'https://www.speedrun.com/images/flags/'+player.country.toLowerCase()+'.png');
					$('.flag', elem).show();
				}
				else {
					$('.flag', elem).hide();
				}
				$(elem).css('display', 'flex');
				animationFadeInElement(elem);
			});

			playerContainersMulti.each((i, elem) => {
				var team = currentTeamsData[i];

				// Hide element and skip to next loop if no team exists.
				if (!team) {
					$(elem).css('display', 'none');
					return true;
				}

				var player = team.players[0];
				$(elem).width('');
				$('.twitchLogo', elem).hide();
				$('.nameLogo', elem).show();
				$('.playerName', elem).text(player.name);
				if (player.country) {
					$('.flag', elem).attr('src', 'https://www.speedrun.com/images/flags/'+player.country.toLowerCase()+'.png');
					$('.flag', elem).show();
				}
				else {
					$('.flag', elem).hide();
				}

				$(elem).css('display', 'flex');
				animationFadeInElement(elem);
			});

			for (var i = 0; i < currentTeamsData.length; i++) {teamPlayerIndex[i] = 0;}

			clearInterval(tickTimeout);
			tickTimeout = setTimeout(tick, tickRateName);
		});
	}

	function tick() {
		var twitch = false;

		playerContainers1P.each((i, elem) => {
			var team = currentTeamsData[0];
				
			// End all loops if no team exists, we're at the end.
			if (!team) return false;

			var player = team.players[i];

			// Skip to next loop if no member exists.
			if (!player) return true;

			var twitchDisplay = $('.twitchLogo', elem).css('display');

			if (twitchDisplay === 'none') {
				cyclePlayerData(player, true, elem);
				twitch = true;
			}
			else {
				cyclePlayerData(player, false, elem);
			}
		});

		playerContainersMulti.each((i, elem) => {
			var team = currentTeamsData[i];

			// Skip to next loop if no team exists.
			if (!team) return true;

			var twitchDisplay = $('.twitchLogo', elem).css('display');

			if (twitchDisplay !== 'none') {
				teamPlayerIndex[i]++;

				// If we've reached the end of the team member array, go back to the start.
				if (teamPlayerIndex[i] >= team.players.length) teamPlayerIndex[i] = 0;
			}

			var player = team.players[teamPlayerIndex[i]];

			if (twitchDisplay === 'none') {
				cyclePlayerData(player, true, elem);
				twitch = true;
			}
			else {
				cyclePlayerData(player, false, elem);
			}
		});

		if (twitch)
			tickTimeout = setTimeout(tick, tickRateTwitch);
		else
			tickTimeout = setTimeout(tick, tickRateName);
	}

	function cyclePlayerData(player, twitch, elem) {
		animationFadeOutElementMS($('*', elem), 500, () => {
			var oldWidth = $(elem).width(); // Store old width.

			// Change what the name says based on what we're going to display.
			var name = (twitch && player.twitch) ? '/'+player.twitch : player.name;
			if (!player.twitch) name = '???';
			$('.playerName', elem).text(name);

			if (player.country) {
				$('.flag', elem).attr('src', 'https://www.speedrun.com/images/flags/'+player.country.toLowerCase()+'.png');
				$('.flag', elem).show();
			}
			else {
				$('.flag', elem).hide();
			}

			// Get new width and set back to old width.
			$(elem).width('');
			var newWidth = $(elem).outerWidth();
			$(elem).width(oldWidth);

			// Change which logo is being shown based on what we're displaying.
			if (twitch) {
				$('.nameLogo', elem).hide();
				$('.twitchLogo', elem).show();
			}
			else {
				$('.nameLogo', elem).show();
				$('.twitchLogo', elem).hide();
			}

			$(elem).animate({width: newWidth}, 500, () => {
				animationFadeInElementMS($('*', elem), 500);
			});
		});
	}

	// Easy access to create player data object used above.
	function createPlayerData(player) {
		if (player.social.twitch) {
			var twitchUsername = player.social.twitch;
		}
		
		var playerData = {
			name: player.name,
			twitch: twitchUsername,
			country: player.country
		};
		
		return playerData;
	}
});