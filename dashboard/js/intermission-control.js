$(() => {
	var forceRefreshIntermissionButton = $('#forceRefreshIntermissionButton');
	forceRefreshIntermissionButton.button();

	forceRefreshIntermissionButton.click(() => {
		nodecg.sendMessage('forceRefreshIntermission');
	});
});