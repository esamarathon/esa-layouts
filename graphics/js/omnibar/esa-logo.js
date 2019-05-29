'use strict';

// Declaring other variables.
var esaBarLogoCurrentRotation = 0; // 0: normal - 1: hashtag
var esaBarLogoTicks = 0;

function changeESALogo() {
	// JQuery selectors.
	var smallLogo = $('#esaBarLogoContainer #esaSmallLogo');
	var hashtag = $('#esaBarLogoContainer #esaHashtagLogo');
	
	esaBarLogoTicks++;
	
	// Change to hashtag text after 50s.
	if (esaBarLogoCurrentRotation === 0 && esaBarLogoTicks >= 11) {
		animationFadeOutInElements(smallLogo, hashtag);
		esaBarLogoTicks = 1;
		esaBarLogoCurrentRotation ^= 1; // Toggle between 0 and 1.
	}
	
	// Change to normal logo after 10s.
	else if (esaBarLogoCurrentRotation === 1 && esaBarLogoTicks >= 3) {
		animationFadeOutInElements(hashtag, smallLogo);
		esaBarLogoTicks = 1;
		esaBarLogoCurrentRotation ^= 1; // Toggle between 0 and 1.
	}
}