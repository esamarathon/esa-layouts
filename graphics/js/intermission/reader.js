'use strict';
$(() => {
	// The bundle name where all the host/reader information is pulled from.
	var flagCarrierBundle = 'speedcontrol-flagcarrier';

	var flagCarrierUsers = nodecg.Replicant('users', flagCarrierBundle);
	flagCarrierUsers.on('change', newVal => {
		if (!newVal) return;

		if (newVal.donations && newVal.donations.reader) {
			// In case they are already hidden, reveal them.
			$('#micIcon').show();
			$('#readerInfo').css('display', 'flex'); // using .show() doesn't change it to a flexbox correctly.

			// Change to display name.
			$('#readerInfo .name').text(newVal.donations.reader.display_name);

			// Show flag if country code is set, otherwise hide it.
			var countryCode = newVal.donations.reader.country_code;
			if (countryCode) {
				$('#readerInfo .flag').attr('src', 'https://www.speedrun.com/images/flags/'+countryCode.toLowerCase()+'.png');
				$('#readerInfo .flag').show();
			}
			else {
				$('#readerInfo .flag').hide();
			}
		}

		else {
			// Hide if not needed.
			$('#micIcon').hide();
			$('#readerInfo').hide();
		}

		setMusicTitleSize(); // Need to check the music title doesn't need changing to fit with the new name.
	});
});