'use strict';
$(() => {
	var init = false;
	var sponsorLogos = nodecg.Replicant('sponsor-logos_assets');
	sponsorLogos.on('change', newVal => {
		// If we aren't currently doing a rotation and there are logos available, start it off.
		if (!init && newVal.length > 0) {
			setInterval(showSponsor, 60000);
			showSponsor();
			init = true;
		}
	});

	// Rotate through logos.
	function showSponsor() {
		var array = createAssetArrayWithChances(sponsorLogos.value);
		var rand = getRandomInt(array.length);
		animationChangeSponsorImage($('.sponsorLogo'), array[rand].url);
	}
});