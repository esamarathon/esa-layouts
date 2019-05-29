'use strict';
$(() => {
	// (As of writing) triggered from a dashboard button and also when a run's timer ends
	nodecg.listenFor('forceRefreshIntermission', () => {
		location.reload();
	});
});

// Reduce the font size if the song title happens to go onto 2 lines.
// In here because 2 files need to use it.
function setMusicTitleSize() {
	$('#musicInfo').css('font-size', '30px');
	if ($('#musicInfo').height() > 30)
		$('#musicInfo').css('font-size', '23px');
}