'use strict';
$(() => {
	// Declaring other variables.
	var tickRate = 5000; // Everything changes/updates every 5 seconds.
	
	// This is where everything changes or checks for changes so they all happen at the same time.
	// First timeout is a dirty hack to wait for the replicants to be ready.
	setTimeout(tick, 200); setInterval(tick, tickRate);
	function tick() {
		changeESALogo(); // esa-logo.js
		showTickerMessages(); // ticker-msgs.js
	}
});