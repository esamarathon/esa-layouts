'use strict';
$(() => {
	// Replicants
	var layouts = nodecg.Replicant('gameLayouts');
	var currentLayout = nodecg.Replicant('currentGameLayout');

	var extraElemsContainer = $('#extraElements');
	var layoutHash = (window.location.hash) ? window.location.hash.substring(1) : undefined;

	// If hash specified, looks through the layouts to see if that one exists.
	// If so, uses that layout style.
	// Example: http://localhost:9090/bundles/esaw19-layouts/graphics/game-layout.html#4_3-1p
	if (layoutHash) {
		layouts.on('change', newVal => {
			if (newVal) {
				var layoutInfo = findLayoutInfo(layoutHash);
				if (layoutInfo) {
					addExtraElements(newVal[i]);
					setCSS(newVal[i]);
				}
			}
		});
	}

	else {
		// Listens for the layout style to change.
		currentLayout.on('change', newVal => {
			if (newVal) {
				addExtraElements(newVal);
				setCSS(newVal);
			}
		});
	}

	// Adds extra elements to the layout that are needed depending on what is needed.
	function addExtraElements(layoutInfo) {
		moveElementsToTempStorage(); // Move importants elements to temporary storage if needed.
		extraElemsContainer.empty(); // Remove anything already added.

		// Disable all player wrappers at the start, so the correct ones can be made visible later.
		changeVisibility('.playerWrapperMulti', false);
		changeVisibility('#playersWrapper', false);

		// Game Capture/Player Wrappers
		if (!layoutInfo.gameCaptures || layoutInfo.gameCaptures === 1 || layoutInfo.code === 'geoguessr' || layoutInfo.ds) {
			// Toggle on the correct wrapper to show the player names.
			changeVisibility('#playersWrapper', true);
		}
		if (layoutInfo.gameCaptures >= 2 || layoutInfo.ds) {
			if (layoutInfo.code !== 'geoguessr' && !layoutInfo.ds) {
				// Toggle on the correct wrappers to show the player names.
				changeVisibility('#playerWrapperMulti1', true);
				changeVisibility('#playerWrapperMulti2', true);
			}
			extraElemsContainer.append(createGameCaptureElement('2'));
		}
		if (layoutInfo.gameCaptures >= 3) {
			// Toggle on the correct wrapper to show the player name.
			changeVisibility('#playerWrapperMulti3', true);

			extraElemsContainer.append(createGameCaptureElement('3'));
		}
		if (layoutInfo.gameCaptures >= 4) {
			// Toggle on the correct wrapper to show the player name.
			changeVisibility('#playerWrapperMulti4', true);

			extraElemsContainer.append(createGameCaptureElement('4'));
		}

		// Extra Camera
		if (layoutInfo.webcams >= 2) {
			extraElemsContainer.append(createWebcamElement('2'));
		}

		// Info Container
		var infoContainerElem = $('<div id="infoContainer" class="storageBox flexContainer">')

		// If there needs to be a wrapper DIV for the game/addition details or not.
		if (layoutInfo.combineGameNameAndAdditional)  {
			var combineGameAndAdditionalElem = $('<div>');

			// Move needed elements in.
			$("#gameName").detach().appendTo(combineGameAndAdditionalElem);
			$("#gameAdditionalDetails").detach().appendTo(combineGameAndAdditionalElem);

			infoContainerElem.append(combineGameAndAdditionalElem);
		}

		else {
			// Move needed elements in.
			$("#gameName").detach().appendTo(infoContainerElem);
			$("#gameAdditionalDetails").detach().appendTo(infoContainerElem);
		}

		// Timer
		$("#timer").detach().appendTo(infoContainerElem);
		
		// If the sponsor logo is in the info container (from above) or it's own thing.
		if (layoutInfo.sponsorInInfo) {
			infoContainerElem.append('<div class="infoDivider" style="opacity:1;">');
			$("#sponsorLogoWrapper").addClass('sponsorLogoWrapperGrow').detach().appendTo(infoContainerElem);
		}
		else {
			$("#sponsorLogoWrapper").addClass('storageBox').detach().appendTo(extraElemsContainer);
		}

		// Add all this to the page.
		extraElemsContainer.append(infoContainerElem);
	}

	function createGameCaptureElement(code) {
		return $('<div id="gameCapture'+code+'" class="storageBox gameCapture">');
	}

	function createWebcamElement(code) {
		return $('<div id="webcam'+code+'" class="storageBox webcam">');
	}

	// Move elements that hold information back into temporary storage if needed.
	function moveElementsToTempStorage() {
		$("#gameName").detach().appendTo('#temporaryStorage');
		$("#gameAdditionalDetails").detach().appendTo('#temporaryStorage');
		$("#timer").detach().appendTo('#temporaryStorage');
		$("#sponsorLogoWrapper").removeClass('storageBox').removeClass('sponsorLogoWrapperGrow').detach().appendTo('#temporaryStorage');
	}
	
	// Set the CSS of the layout so everything can be styled correctly.
	function setCSS(layoutInfo) {
		var cssURL = 'css/games/'+layoutInfo.code+'.css'
		$('#layoutCSSFile').attr('href', cssURL);
	}

	// Find information about layout based on it's code.
	function findLayoutInfo(code) {
		var layoutInfo;
		for (var i = 0; i < layouts.value.length; i++) {
			if (layouts.value[i].code === code.toLowerCase()) {
				layoutInfo = layouts.value[i];
				break;
			}
		}
		return layoutInfo;
	}
});