'use strict';
$(() => {
	// The bundle name where all the run information is pulled from.
	var speedcontrolBundle = 'nodecg-speedcontrol';
	
	// Declaring other variables.
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
		else animationSetField($('#gameName'), 'The Beginning');
	});
	
	// Sets information on the layout for the run.
	function updateSceneFields(runData) {
		//var additionalDetails = runData.category+' / '+runData.system+' / EST: '+runData.estimate;

		animationSetField($('#gameName'), runData.game);
		animationSetField($('#gameAdditionalDetails')); // Needs to be faded in/out too.
		$('#gameCategory').text(runData.category);
		$('#gameSystem').text(' / '+runData.system);
		$('#gameEstimate').text(' / EST: '+runData.estimate);
		animationSetField($('#timer')); // Fade out/in the timer as well.
		animationSetField($('.finishTime')); // Fade out/in the finish times as well.
		animationSetField($('.infoDivider')); // Fade out/in the divider if it exists as well.
		animationSetField($('#infoContainer #sponsorLogoWrapper')); // Fade out/in the sponsor logo if it's in the info box.
	}
});