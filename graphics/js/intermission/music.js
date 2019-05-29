'use strict';
$(() => {
	// The bundle name where all the run information is pulled from.
	var speedcontrolBundle = 'nodecg-speedcontrol';

	var songData = nodecg.Replicant('songData');
	songData.on('change', newVal => {
		if (!newVal) return;

		if (newVal.playing) {
			$('#mcIcon').show();
			$('#musicInfo').show();
		}

		else {
			$('#mcIcon').hide();
			$('#musicInfo').hide();
		}

		$('#musicInfo').text(newVal.title);

		setMusicTitleSize();
	});
});