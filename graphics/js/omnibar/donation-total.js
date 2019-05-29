'use strict';
$(() => {
	// JQuery selectors.
	var amountText = $('#donationTotalContainer #amountText');

	// Where thew donation total is received.
	var donationTotal = nodecg.Replicant('donationTotal');
	donationTotal.on('change', (newVal, oldVal) => {
		// If the page has just been loaded, just print the current value, otherwise do the animation.
		if (!oldVal)
			amountText.text(formatDollarAmount(newVal, true));
		else
			animationUpdateDonationTotal(amountText, oldVal, newVal);
	});
});