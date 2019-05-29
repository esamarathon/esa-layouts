'use strict';
$(() => {
	// The bundle name where all the host/reader information is pulled from.
	var flagCarrierBundle = 'speedcontrol-flagcarrier';

	var flagCarrierUsers = nodecg.Replicant('users', flagCarrierBundle);
	flagCarrierUsers.on('change', newVal => {
		//if (!newVal) return;

		if (newVal && newVal.hosts) {
            var hosts = newVal.hosts;

            if (hosts.left) {
                changeHost(hosts.left, 'left');
            }
            else {
                hideHost('left');
            }

            if (hosts.midleft) {
                changeHost(hosts.midleft, 'midleft');
            }
            else {
                hideHost('midleft');
            }

            if (hosts.middle) {
                changeHost(hosts.middle, 'middle');
            }
            else {
                hideHost('middle');
            }

            if (hosts.midright) {
                changeHost(hosts.midright, 'midright');
            }
            else {
                hideHost('midright');
            }

            if (hosts.right) {
                changeHost(hosts.right, 'right');
            }
            else {
                hideHost('right');
            }
        }
        
        else {
            $('.hostContainer').hide(); // hide all containers
        }
    });
    
    function changeHost(hostData, pos) {
        $('#hostNameStorage > #'+pos).css('display', 'flex');

        // Change to display name.
        $('#hostNameStorage > #'+pos+' > span').text(hostData.display_name);

        // Show flag if country code is set, otherwise hide it.
        var countryCode = hostData.country_code;
        if (countryCode) {
            $('#hostNameStorage > #'+pos+' > .flag').attr('src', 'https://www.speedrun.com/images/flags/'+countryCode.toLowerCase()+'.png');
            $('#hostNameStorage > #'+pos+' > .flag').show();
        }
        else {
            $('#hostNameStorage > #'+pos+' > .flag').hide();
        }
    }

    function hideHost(pos) {
        $('#hostNameStorage > #'+pos).hide();
    }
});