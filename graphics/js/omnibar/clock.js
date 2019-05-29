'use strict';
$(() => {
	// JQuery selectors.
	var clock = $('#clockText');
	
	// Simple clock with flashing colon.
	//var hasColon = false;
	setClock();
	setInterval(setClock, 1000);
	function setClock() {
		//var currentTime = moment().format('HH mm');
		var currentTime = moment().format('HH:mm');
		//if (hasColon) clock.html(currentTime.replace(' ', '<span> </span>'));
		//else clock.html(currentTime.replace(' ', '<span>:</span>'));
		clock.text(currentTime);
		//hasColon = !hasColon;
	}
});