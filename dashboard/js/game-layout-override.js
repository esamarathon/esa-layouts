'use strict';
$(() => {
	// Replicants
	var layouts = nodecg.Replicant('gameLayouts');
	var currentLayout = nodecg.Replicant('currentGameLayout');
	
	// Adds the available layouts to the dropdown list.
	layouts.on('change', newVal => {
		if (newVal) {
			$('#layoutOption').empty();
			$.each(newVal, (i, layoutInfo) => {
				$('#layoutOption').append($('<option>', {
					value: layoutInfo.id,
					text: layoutInfo.name
				}));
			});

			// Select the current layout if the replicant is already available.
			if (currentLayout.value)
				$('#layoutOption').val(currentLayout.value.id);
		}
	});

	// Sets the currently selected layout in the dropdown as the current one.
	$('#applyLayout').click(() => {
		var layoutChosen = parseInt($('#layoutOption').val());
		nodecg.sendMessage('changeGameLayout', layoutChosen, err => {});
	});

	// Change the dropdown to the currently active layout.
	currentLayout.on('change', newVal => {
		if (newVal) {
			$('#layoutOption').val(newVal.id);
		}
	});
});