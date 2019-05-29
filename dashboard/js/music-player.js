'use strict';
$(() => {
	$('#pausePlaySong').button();
	$('#skipSong').button();

	// Send NodeCG messages to make the buttons work.
	$('#pausePlaySong').click(() => {
		nodecg.sendMessage('pausePlaySong');
	});
	$('#skipSong').click(() => {
		nodecg.sendMessage('skipSong');
	});

	var songData = nodecg.Replicant('songData');
	songData.on('change', (newVal) => {
		// Toggle button wording/clickability depending on playback state.
		if (newVal.playing) {
			$('#pausePlaySong').button({disabled: false, label:'Pause Song'});
			$('#skipSong').button({disabled: false, label:'Skip Song'});
		}

		else {
			$('#pausePlaySong').button({disabled: false, label:'Play Song'});
			$('#skipSong').button({disabled: true, label:'Cannot skip, paused'});
		}

		// Print current track title to page.
		$('#currentTrack').html(newVal.title);
	});
});