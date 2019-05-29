'use strict';
$(() => {
	// The bundle name where all the run information is pulled from.
	var speedcontrolBundle = 'nodecg-speedcontrol';
	
	// JQuery selectors.
	var finishTimes = $('.finishTime'); // Array of finish timers (*should* be in the same order as the players).
	
	// Declaring other variables.
	var currentTime;
	var backupTimerTO;
	
	var runDataActiveRun = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);
	var timer = nodecg.Replicant('timer', speedcontrolBundle);

	NodeCG.waitForReplicants(runDataActiveRun, timer).then(() => {
		timer.on('change', (newVal, oldVal) => {
			if (!newVal) return;
			updateTimer(newVal, oldVal);
			updateFinishTimes(newVal, oldVal);
			
			// Backup Timer
			clearTimeout(backupTimerTO);
			backupTimerTO = setTimeout(backupTimer, 1000);
		});
	});
	
	// Backup timer that takes over if the connection to the server is lost.
	// Based on the last timestamp that was received.
	// When the connection is restored, the server timer will recover and take over again.
	function backupTimer() {
		backupTimerTO = setTimeout(backupTimer, 200);
		if (timer.value.state === 'running') {
			var missedTime = Date.now() - timer.value.timestamp;
			var timeOffset = timer.value.milliseconds + missedTime;
			updateTimer({time:msToTime(timeOffset)});
		}
	}
	
	function updateTimer(newVal, oldVal) {
		var time = newVal.time || '88:88:88';
		
		// Change class on the timer to change the colour if needed.
		if (oldVal) $('#timer').toggleClass('timer_'+oldVal.state, false);
		$('#timer').toggleClass('timer_'+newVal.state, true);
		
		$('#timer').html(time);
		$('#timer').lettering(); // Makes each character into a <span>.
		currentTime = time;
	}

	function updateFinishTimes(newVal, oldVal) {
		if (finishTimes.length <= 1) return;

		var teams = runDataActiveRun.value.teams;
		teams.forEach((team, index) => {
			var team = teams[index];
			var container = finishTimes.eq(index);

			if (newVal.teamFinishTimes[team.id] && (!oldVal || !oldVal.teamFinishTimes[team.id])) {
				$(container).html(newVal.teamFinishTimes[team.id].time);
				$(container).css('display', 'flex');
			}

			else if (oldVal && oldVal.teamFinishTimes[team.id] && !newVal.teamFinishTimes[team.id]) {
				$(container).html('');
				$(container).hide();
			}
		});
	}
});