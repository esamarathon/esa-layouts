'use strict';
$(() => {
	var init = false;
	var sponsorLogos = nodecg.Replicant('assets:sponsor-logos');
	sponsorLogos.on('change', newVal => {
		// If we aren't currently doing a rotation and there are logos available, start it off.
		if (!init && newVal.length > 0) {
			setInterval(rotateSponsors, 60000);
			rotateSponsors();
			init = true;
		}
	});

	// Rotate through logos.
	var index = 0;
	function rotateSponsors() {
		animationChangeSponsorImage($('.sponsorLogo'), sponsorLogos.value[index].url);
		index++;
		if (index >= sponsorLogos.value.length) index = 0;
	}
});